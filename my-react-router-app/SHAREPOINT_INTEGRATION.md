# SharePoint Integration Guide for Antragsverwaltung

This guide explains how to integrate the application forms with Microsoft SharePoint and Microsoft Forms.

## Table of Contents
1. [Microsoft Forms Integration](#microsoft-forms-integration)
2. [SharePoint List Integration](#sharepoint-list-integration)
3. [Azure AD Setup](#azure-ad-setup)
4. [Environment Variables](#environment-variables)
5. [File Upload to SharePoint](#file-upload-to-sharepoint)

---

## Microsoft Forms Integration

### Option 1: Direct Microsoft Forms Links

The easiest approach is to create Microsoft Forms for each application type and link to them directly.

#### Steps:
1. Go to [Microsoft Forms](https://forms.office.com/)
2. Create a new form for each application type
3. Add the required fields (matching the `formDefinitions` in the code)
4. Get the form's share link
5. Update the `microsoftFormUrl` in `formDefinitions` with your actual form URLs

Example:
```typescript
const formDefinitions = {
  "1": {
    title: "Anmeldung zur Abschlussarbeit",
    microsoftFormUrl: "https://forms.office.com/Pages/ResponsePage.aspx?id=YOUR_ACTUAL_FORM_ID",
    // ... fields
  },
};
```

### Option 2: Embed Microsoft Forms

You can also embed Microsoft Forms directly in your application:

```tsx
<iframe 
  src="https://forms.office.com/Pages/ResponsePage.aspx?id=YOUR_FORM_ID&embed=true"
  width="100%"
  height="600px"
  frameBorder="0"
  marginHeight={0}
  marginWidth={0}
>
  Loading…
</iframe>
```

---

## SharePoint List Integration

### Step 1: Create SharePoint List

1. Navigate to your SharePoint site
2. Create a new list called "Application Submissions"
3. Add the following columns:
   - **Title** (Single line of text) - Application title
   - **ApplicationId** (Single line of text) - Application ID
   - **FormData** (Multiple lines of text) - JSON data
   - **Status** (Choice) - Pending, Approved, Rejected
   - **SubmittedAt** (Date and Time)
   - **StudentName** (Single line of text)
   - **MatrikelNummer** (Single line of text)

### Step 2: Get SharePoint Site and List IDs

```bash
# Get Site ID
https://graph.microsoft.com/v1.0/sites/{hostname}:/sites/{site-name}

# Get List ID
https://graph.microsoft.com/v1.0/sites/{site-id}/lists
```

---

## Azure AD Setup

### Step 1: Register Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in:
   - Name: "Student Portal Application Submissions"
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: Leave blank for now
5. Click **Register**

### Step 2: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Application permissions**
5. Add these permissions:
   - `Sites.ReadWrite.All` - To read/write SharePoint lists
   - `Files.ReadWrite.All` - To upload files
6. Click **Grant admin consent**

### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Add description: "Application Submissions API"
4. Choose expiration period
5. Click **Add**
6. **IMPORTANT**: Copy the secret value immediately (you won't see it again)

### Step 4: Note Your Credentials

You'll need these values:
- **Tenant ID**: Found in Azure AD > Overview
- **Client ID**: Found in your app registration > Overview
- **Client Secret**: The value you just copied

---

## Environment Variables

Create a `.env` file in your project root:

```env
# Azure AD Configuration
AZURE_TENANT_ID=your-tenant-id-here
AZURE_CLIENT_ID=your-client-id-here
AZURE_CLIENT_SECRET=your-client-secret-here

# SharePoint Configuration
SHAREPOINT_SITE_ID=your-sharepoint-site-id
SHAREPOINT_LIST_ID=your-list-id-here
SHAREPOINT_SITE_URL=https://yourtenant.sharepoint.com/sites/yoursite

# Azure Blob Storage (optional, for file uploads)
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_CONTAINER=applications
```

---

## File Upload to SharePoint

### Option 1: Upload to SharePoint Document Library

```typescript
async function uploadFileToSharePoint(
  file: File,
  applicationId: string,
  accessToken: string
) {
  const siteId = process.env.SHAREPOINT_SITE_ID;
  const driveId = "YOUR_DRIVE_ID"; // Get from SharePoint
  
  const fileName = `${applicationId}_${Date.now()}_${file.name}`;
  const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/Applications/${fileName}:/content`;
  
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": file.type,
    },
    body: file,
  });
  
  return await response.json();
}
```

### Option 2: Upload to Azure Blob Storage

```typescript
import { BlobServiceClient } from "@azure/storage-blob";

async function uploadFileToAzure(file: File, applicationId: string) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING!
  );
  
  const containerClient = blobServiceClient.getContainerClient("applications");
  const blobName = `${applicationId}/${Date.now()}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  await blockBlobClient.uploadData(file);
  
  return blockBlobClient.url;
}
```

---

## Complete Integration Example

Here's a complete example of the submission handler with SharePoint integration:

```typescript
export async function action({ request }: ActionFunctionArgs) {
  const data = await request.json();
  const { applicationId, applicationTitle, formData, timestamp } = data;
  
  try {
    // 1. Get access token
    const accessToken = await getSharePointAccessToken();
    
    // 2. Upload files if present
    let fileUrls: string[] = [];
    if (formData.documents) {
      const fileUrl = await uploadFileToSharePoint(
        formData.documents,
        applicationId,
        accessToken
      );
      fileUrls.push(fileUrl);
    }
    
    // 3. Create SharePoint list item
    const siteId = process.env.SHAREPOINT_SITE_ID;
    const listId = process.env.SHAREPOINT_LIST_ID;
    
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Title: applicationTitle,
            ApplicationId: applicationId,
            FormData: JSON.stringify(formData),
            Status: "Pending",
            SubmittedAt: timestamp,
            StudentName: formData.studentName || "",
            MatrikelNummer: formData.matrikelNummer || "",
            FileUrls: fileUrls.join(", "),
          },
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to create SharePoint item");
    }
    
    const result = await response.json();
    
    return Response.json({
      success: true,
      message: "Antrag erfolgreich eingereicht",
      submissionId: result.id,
    });
    
  } catch (error) {
    console.error("Submission error:", error);
    return Response.json(
      { error: "Fehler beim Einreichen" },
      { status: 500 }
    );
  }
}
```

---

## Testing

### Test with Microsoft Graph Explorer

1. Go to [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
2. Sign in with your account
3. Test these queries:

```
# Get your site
GET https://graph.microsoft.com/v1.0/sites/{hostname}:/sites/{site-name}

# Get lists
GET https://graph.microsoft.com/v1.0/sites/{site-id}/lists

# Create list item (test)
POST https://graph.microsoft.com/v1.0/sites/{site-id}/lists/{list-id}/items
{
  "fields": {
    "Title": "Test Application",
    "ApplicationId": "TEST-001",
    "Status": "Pending"
  }
}
```

---

## Security Considerations

1. **Never expose credentials in frontend code**
2. **Use HTTPS only**
3. **Validate all input on the server**
4. **Implement rate limiting**
5. **Use secure file upload validation**
6. **Rotate client secrets regularly**
7. **Monitor API usage**

---

## Troubleshooting

### Common Issues

**Issue**: "Access token invalid"
- **Solution**: Check that your Azure AD app has the correct permissions and admin consent

**Issue**: "Site not found"
- **Solution**: Verify your SharePoint site ID is correct

**Issue**: "Insufficient permissions"
- **Solution**: Ensure you've granted admin consent for the required permissions

**Issue**: "File upload fails"
- **Solution**: Check file size limits and ensure the document library exists

---

## Additional Resources

- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [SharePoint REST API](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service)
- [Azure AD Authentication](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Microsoft Forms](https://support.microsoft.com/en-us/office/create-a-form-with-microsoft-forms-4ffb64cc-7d5d-402f-b82e-b1d49418fd9d)
