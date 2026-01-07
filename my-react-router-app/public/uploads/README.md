# PDF Storage Structure

##  Folder Organization

Place your PDF files and documents in the following folders:

### Studiengang-Based Organization

```
public/uploads/studiengaenge/
├── Wirtschaftsinformatik/
│   ├── Webentwicklung/
│   │   ├── HTML_Basics.pdf
│   │   ├── CSS_Advanced.pdf
│   │   └── JavaScript_Tutorial.zip
│   └── Datenbankdesign/
│       ├── SQL_Queries.pdf
│       └── Normalisierung.docx
└── Cloud-Computing/
    └── Cloud-Computing/
        ├── AWS_Guide.pdf
        └── Docker_Examples.tar.gz
```

### Personal Files

```
public/uploads/eigene-dateien/
├── your-personal-file-1.pdf
└── your-personal-file-2.pdf
```

##  How to Add Files

1. **For Course Files:**
   - Place PDFs in: `public/uploads/studiengaenge/[STUDIENGANG]/[COURSE]/`
   - Files will automatically appear in the course file list
   - When you click "Download" or open them, they'll be tracked in "Zuletzt geöffnete Dokumente"

2. **For Personal Files:**
   - Use the drag-and-drop upload feature on the `/files` page
   - Or place files in: `public/uploads/eigene-dateien/`
   - These will appear in "Meine Dateien" section

##  File Tracking

Once a PDF is:
- **Downloaded** from a course
- **Opened** via the download button
- **Uploaded** through the interface

It will automatically appear in the "Zuletzt geöffnete Dokumente" list and track:
- Last page opened
- Reading progress
- Bookmarks
- Timestamp

##  Important Notes

- File names should match the names used in the course configuration
- Supported formats: PDF, DOC, DOCX, XLS, XLSX, ZIP, PPT, PPTX
- PDFs are automatically tracked for reading state
- Files are accessible via: `/uploads/[path-to-file]`

