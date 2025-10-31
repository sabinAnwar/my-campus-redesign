# 📚 PDF Storage Guide - Where to Place Your Files

## 📁 Folder Structure

To have your PDFs appear in the "Zuletzt geöffnete Dokumente" (Last Opened Documents) section, place them in the following folders:

### For Course Files (Organized by Studiengang)

**Location:** `my-react-router-app/public/uploads/studiengaenge/[STUDIENGANG]/[COURSE]/`

#### Example Paths:

1. **Wirtschaftsinformatik → Webentwicklung:**
   ```
   my-react-router-app/public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/
   ```
   - Place files like: `HTML_Basics.pdf`, `CSS_Advanced.pdf`, `JavaScript_Tutorial.zip`

2. **Wirtschaftsinformatik → Datenbankdesign:**
   ```
   my-react-router-app/public/uploads/studiengaenge/Wirtschaftsinformatik/Datenbankdesign/
   ```
   - Place files like: `SQL_Queries.pdf`, `Normalisierung.docx`

3. **Cloud Computing → Cloud Computing:**
   ```
   my-react-router-app/public/uploads/studiengaenge/Cloud-Computing/Cloud-Computing/
   ```
   - Place files like: `AWS_Guide.pdf`, `Docker_Examples.tar.gz`

### For Personal Files

**Location:** `my-react-router-app/public/uploads/eigene-dateien/`

```
my-react-router-app/public/uploads/eigene-dateien/
```
- Place your personal PDFs here
- These will appear in "Meine Dateien" section

## ✅ How It Works

1. **Place PDFs** in the appropriate folder above
2. **File names** should match the names in the course (or any name you prefer)
3. **Open the Files page** (`/files`) in your application
4. **Click "Download"** on any PDF from a course
5. **The file will:**
   - Open in your browser (if PDF)
   - Be tracked in "Zuletzt geöffnete Dokumente"
   - Remember your last page and reading progress
   - Show up in the recent documents list

## 📋 Quick Start

1. **Add a PDF to a course:**
   ```bash
   # Copy your PDF to the course folder
   # Example:
   my-pdf.pdf → my-react-router-app/public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/my-pdf.pdf
   ```

2. **Open the app** and go to `/files`

3. **Select the Studiengang** (e.g., "Wirtschaftsinformatik")

4. **Select the Course** (e.g., "Webentwicklung")

5. **Click "Download"** on your PDF

6. **The PDF will:**
   - Open in a new tab
   - Be added to "Zuletzt geöffnete Dokumente"
   - Track your reading progress

## 🔍 File Tracking Features

Once a PDF is opened/downloaded, the system tracks:
- ✅ **Last opened page** - Resume where you left off
- ✅ **Reading progress** - See how much you've read (%)
- ✅ **Bookmarks** - Save important pages (coming soon)
- ✅ **Timestamp** - When you last accessed it
- ✅ **Studiengang & Course** - Which course it belongs to

## 📝 Supported File Formats

- **PDF** - Fully tracked with reading state
- **DOC/DOCX** - Word documents
- **PPT/PPTX** - PowerPoint presentations
- **XLS/XLSX** - Excel spreadsheets
- **ZIP** - Compressed archives

## 🚀 Example Workflow

1. You have a PDF: `Introduction_to_React.pdf`
2. Place it in: `public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/`
3. Go to `/files` page
4. Select "Wirtschaftsinformatik" → "Webentwicklung"
5. You'll see the file listed
6. Click "Download" → PDF opens
7. File appears in "Zuletzt geöffnete Dokumente" at the top
8. Next time you open it, it shows your last page!

## 📍 Current Folder Structure

```
my-react-router-app/
└── public/
    └── uploads/
        ├── README.md (instructions)
        ├── eigene-dateien/ (personal files)
        └── studiengaenge/
            ├── Wirtschaftsinformatik/
            │   ├── Webentwicklung/
            │   └── Datenbankdesign/
            └── Cloud-Computing/
                └── Cloud-Computing/
```

## ⚠️ Important Notes

- **File names** don't need to match exactly - you can use any name
- Files are served from the `public` folder, so they're publicly accessible
- PDFs are automatically detected and tracked
- Reading state is saved in browser localStorage (persists between sessions)
- Maximum 15 recent files are tracked

## 🎯 Summary

**To see files in "Zuletzt geöffnet":**
1. Place PDFs in: `public/uploads/studiengaenge/[STUDIENGANG]/[COURSE]/`
2. Open `/files` page in the app
3. Click "Download" on any PDF
4. File will appear in the recent documents list!

