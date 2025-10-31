import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { File as FileIcon, Download, Trash2, Clock, ArrowLeft, BookOpen, Bookmark, FileText, GraduationCap } from 'lucide-react';

// Studiengang (Degree Program) structure
const STUDIENGAENGE = [
  {
    id: 1,
    name: 'Wirtschaftsinformatik',
    description: 'Business Informatics',
    courses: [
      {
        id: 1,
        code: 'WEB101',
        name: 'Webentwicklung',
        files: [
          { id: 1, name: 'HTML_Basics.pdf', size: '2.5 MB', date: '2025-10-15', type: 'pdf' },
          { id: 2, name: 'CSS_Advanced.pdf', size: '3.1 MB', date: '2025-10-18', type: 'pdf' },
          { id: 3, name: 'JavaScript_Tutorial.zip', size: '15 MB', date: '2025-10-20', type: 'zip' }
        ]
      },
      {
        id: 2,
        code: 'DB101',
        name: 'Datenbankdesign',
        files: [
          { id: 4, name: 'SQL_Queries.pdf', size: '1.8 MB', date: '2025-10-12', type: 'pdf' },
          { id: 5, name: 'Normalisierung.docx', size: '0.9 MB', date: '2025-10-16', type: 'docx' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Cloud Computing',
    description: 'Cloud Technologies',
    courses: [
      {
        id: 3,
        code: 'CC101',
        name: 'Cloud Computing',
        files: [
          { id: 6, name: 'AWS_Guide.pdf', size: '4.2 MB', date: '2025-10-14', type: 'pdf' },
          { id: 7, name: 'Docker_Examples.tar.gz', size: '8.5 MB', date: '2025-10-19', type: 'gz' }
        ]
      }
    ]
  }
];

// Flatten modules for backward compatibility
const MODULES = STUDIENGAENGE.flatMap(sg => 
  sg.courses.map(course => ({
    id: course.id,
    name: course.name,
    studiengang: sg.name,
    files: course.files
  }))
);

export const loader = async () => {
  return null;
};

export default function FileManagement() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedStudiengang, setSelectedStudiengang] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);
  const [fileReadingStates, setFileReadingStates] = useState({});

  const LS_KEYS = { 
    recentFiles: 'recentFilesList',
    readingStates: 'fileReadingStates',
    lastOpened: 'lastOpenedFile'
  };

  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem(LS_KEYS.recentFiles) || '[]');
      if (Array.isArray(f)) setRecentFiles(f);
      
      const states = JSON.parse(localStorage.getItem(LS_KEYS.readingStates) || '{}');
      setFileReadingStates(states);
    } catch {}
  }, []);

  const saveRecentFile = (file, moduleLabel, studiengangName) => {
    const module = MODULES.find(m => m.id === selectedModule);
    const entry = {
      id: file.id ?? `${file.name}-${Date.now()}`,
      name: file.name,
      moduleName: moduleLabel ?? module?.name ?? 'Eigene Dateien',
      studiengang: studiengangName ?? module?.studiengang ?? null,
      fileType: file.type || file.name.split('.').pop()?.toLowerCase(),
      at: Date.now(),
    };
    const dedup = recentFiles.filter((f) => f.id !== entry.id);
    const next = [entry, ...dedup].slice(0, 15);
    setRecentFiles(next);
    try { 
      localStorage.setItem(LS_KEYS.recentFiles, JSON.stringify(next));
      localStorage.setItem(LS_KEYS.lastOpened, JSON.stringify(entry));
    } catch {}
  };

  const updateReadingState = (fileId, readingState) => {
    const newStates = {
      ...fileReadingStates,
      [fileId]: {
        ...fileReadingStates[fileId],
        ...readingState,
        lastUpdated: Date.now()
      }
    };
    setFileReadingStates(newStates);
    try {
      localStorage.setItem(LS_KEYS.readingStates, JSON.stringify(newStates));
    } catch {}
  };

  const getReadingState = (fileId) => {
    return fileReadingStates[fileId] || null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      files.forEach(file => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          date: new Date().toISOString().split('T')[0],
          module: selectedModule
        };
        setUploadedFiles([newFile, ...uploadedFiles]);
      });
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          date: new Date().toISOString().split('T')[0],
          module: selectedModule
        };
        setUploadedFiles([newFile, ...uploadedFiles]);
      });
    }
  };

  const deleteFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const downloadModuleFile = (file, moduleLabel, studiengangName) => {
    saveRecentFile(file, moduleLabel, studiengangName);
    
    // Build file path based on studiengang and course
    const sanitizedStudiengang = studiengangName?.replace(/\s+/g, '-') || '';
    const sanitizedCourse = moduleLabel?.replace(/\s+/g, '-') || '';
    const filePath = `/uploads/studiengaenge/${sanitizedStudiengang}/${sanitizedCourse}/${file.name}`;
    
    // If it's a PDF, create/update reading state
    if (file.type === 'pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const existingState = getReadingState(file.id);
      if (!existingState) {
        updateReadingState(file.id, {
          lastPage: 1,
          totalPages: null, // Would be set when actually reading
          readingProgress: 0,
          bookmarks: [],
          filePath: filePath // Store path for actual file access
        });
      }
    }
    
    // Open PDF in new tab or download
    if (file.type === 'pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const currentState = getReadingState(file.id);
      
      // Try to open the file from public/uploads folder
      // If file doesn't exist, it will fall back to download
      const link = document.createElement('a');
      link.href = filePath;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // For PDFs, try to open in browser viewer
      if (window.confirm(`${file.name}\n\nPDF öffnen? (Seite ${currentState?.lastPage || 1})`)) {
        // Update reading state when opened
        if (currentState) {
          const newPage = parseInt(
            prompt('Auf welche Seite möchten Sie springen?', currentState.lastPage || 1) || 
            currentState.lastPage || 1
          );
          updateReadingState(file.id, {
            lastPage: newPage,
            readingProgress: currentState.totalPages ? (newPage / currentState.totalPages * 100) : null,
            filePath: filePath
          });
        }
        link.click();
      }
    } else {
      // For non-PDF files, download directly
      const link = document.createElement('a');
      link.href = filePath;
      link.download = file.name;
      link.click();
    }
  };

  const downloadUploadedFile = (file) => {
    saveRecentFile(file, 'Eigene Dateien', null);
    
    // If it's a PDF, create/update reading state
    if (file.name.toLowerCase().endsWith('.pdf')) {
      const existingState = getReadingState(file.id);
      if (!existingState) {
        updateReadingState(file.id, {
          lastPage: 1,
          totalPages: null,
          readingProgress: 0,
          bookmarks: []
        });
      }
    }
    
    alert(`Download: ${file.name}`);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = {
      'pdf': 'pdf',
      'docx': 'doc',
      'doc': 'doc',
      'xlsx': 'xls',
      'xls': 'xls',
      'zip': 'zip',
      'tar': 'zip',
      'gz': 'zip',
      'ppt': 'ppt',
      'pptx': 'ppt'
    };
    return icons[ext] || 'file';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white px-8 py-8 shadow-xl">
        <div className="container mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-4 font-semibold">
            <ArrowLeft className="h-4 w-4"/> Zurück zum Dashboard
          </Link>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-2"><FileIcon className="h-7 w-7"/> Dateien & Materialien</h1>
          <p className="text-slate-200 text-lg">Verwalte deine Unterrichtsmaterialien und Dokumente</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`rounded-2xl border-4 border-dashed p-12 text-center transition mb-8 ${
                dragActive
                  ? 'border-cyan-600 bg-cyan-50'
                  : 'border-slate-300 bg-white hover:border-cyan-400'
              }`}
            >
              <div className="text-6xl mb-4"><Download className="inline h-10 w-10 text-slate-700"/></div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Datei hochladen</h3>
              <p className="text-slate-600 font-semibold mb-6">
                Ziehe Dateien hier hin oder klicke zum Auswählen
              </p>

              {!selectedModule && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                  <p className="text-yellow-700 font-bold">⚠️ Wähle zuerst ein Modul aus!</p>
                </div>
              )}

              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  disabled={!selectedModule}
                  className="hidden"
                />
                <span className={`inline-block px-8 py-3 rounded-lg font-bold transition cursor-pointer ${
                  selectedModule
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                    : 'bg-slate-300 text-slate-600 cursor-not-allowed'
                }`}>
                  Datei auswählen
                </span>
              </label>

              <p className="text-slate-500 text-sm mt-6">
                Unterstützte Formate: PDF, DOC, DOCX, XLS, XLSX, ZIP, PPT, PPTX
              </p>
            </div>

            {/* Uploaded Files */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Meine Dateien ({uploadedFiles.length})</h2>

              {uploadedFiles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-lg font-semibold">Keine Dateien hochgeladen</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-slate-400 transition">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl"><FileIcon className="h-6 w-6"/></span>
                        <div>
                          <p className="font-bold text-slate-900">{file.name}</p>
                          <p className="text-sm text-slate-600">{file.size} • {new Date(file.date).toLocaleDateString('de-DE')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadUploadedFile(file)}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition"
                        >
                          <Download className="h-4 w-4"/> Download
                        </button>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4"/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Module Selection */}
          <div className="space-y-6">
            {/* Last opened documents list */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border-2 border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600"/>
                  <h3 className="text-xl font-black text-slate-900">Zuletzt geöffnete Dokumente</h3>
                </div>
                {recentFiles?.length > 0 && (
                  <span className="text-xs text-slate-600 font-semibold">{recentFiles.length} Dokumente</span>
                )}
              </div>
              
              {recentFiles?.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {recentFiles.map((file, index) => {
                    const readingState = getReadingState(file.id);
                    const isPDF = file.fileType === 'pdf' || file.name.toLowerCase().endsWith('.pdf');
                    const isFirst = index === 0;
                    
                    return (
                      <div
                        key={file.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          isFirst
                            ? 'bg-white border-blue-400 shadow-md hover:border-blue-500'
                            : 'bg-white/80 border-blue-200 hover:border-blue-300'
                        }`}
                        onClick={() => downloadModuleFile(file, file.moduleName, file.studiengang)}
                      >
                        {/* Main file info */}
                        <div className="flex items-start gap-3">
                          <FileText className={`h-5 w-5 mt-0.5 ${isFirst ? 'text-blue-600' : 'text-slate-500'}`}/>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className={`font-bold text-slate-900 ${isFirst ? 'text-base' : 'text-sm'}`}>
                                {file.name}
                              </p>
                              {isPDF && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                                  PDF
                                </span>
                              )}
                              {['doc','docx','ppt','pptx'].includes(file.fileType || '') && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                                  Skript
                                </span>
                              )}
                              {isFirst && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                  Zuletzt geöffnet
                                </span>
                              )}
                            </div>
                            
                            {/* Studiengang and Course */}
                            <div className="space-y-1 mb-2">
                              {file.studiengang && (
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3 text-slate-500"/>
                                  <p className="text-xs font-semibold text-slate-700">{file.studiengang}</p>
                                </div>
                              )}
                              <p className="text-xs text-slate-600">{file.moduleName}</p>
                            </div>
                            
                            {/* PDF Reading State Details */}
                            {isPDF && readingState && (
                              <div className="mt-2 p-2 bg-slate-50 rounded border border-blue-100">
                                <div className="space-y-1.5">
                                  {readingState.lastPage && (
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-slate-600 flex items-center gap-1">
                                        <BookOpen className="h-3 w-3"/> Seite:
                                      </span>
                                      <span className="font-semibold text-blue-600">
                                        {readingState.lastPage}
                                        {readingState.totalPages && ` / ${readingState.totalPages}`}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {readingState.readingProgress !== null && readingState.readingProgress !== undefined && (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-600">Fortschritt:</span>
                                        <span className="font-semibold text-slate-900">
                                          {Math.round(readingState.readingProgress)}%
                                        </span>
                                      </div>
                                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                                        <div 
                                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all"
                                          style={{ width: `${Math.min(readingState.readingProgress, 100)}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {readingState.bookmarks && readingState.bookmarks.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Bookmark className="h-3 w-3 text-amber-500"/>
                                      <span className="text-xs text-slate-600">
                                        {readingState.bookmarks.length} Lesezeichen
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Timestamp */}
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                              <Clock className="h-3 w-3"/> 
                              {new Date(file.at).toLocaleString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          
                          {/* Action button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadModuleFile(file, file.moduleName, file.studiengang);
                            }}
                            className={`ml-2 px-3 py-1.5 rounded text-xs font-semibold transition ${
                              isFirst
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isPDF && readingState ? 'Weiterlesen' : 'Öffnen'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileIcon className="h-12 w-12 text-slate-300 mx-auto mb-3"/>
                  <p className="text-sm text-slate-500 font-semibold">
                    Noch keine Dokumente geöffnet
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Geöffnete oder heruntergeladene Dateien erscheinen hier
                  </p>
                </div>
              )}
            </div>
            {/* Studiengang Selection */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5"/> Studiengänge
              </h3>
              <div className="space-y-3 mb-4">
                {STUDIENGAENGE.map(sg => (
                  <button
                    key={sg.id}
                    onClick={() => {
                      setSelectedStudiengang(sg.id);
                      setSelectedModule(null);
                    }}
                    className={`w-full p-3 rounded-lg font-bold transition text-left ${
                      selectedStudiengang === sg.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-700'
                        : 'bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{sg.name}</span>
                      <span className="text-xs opacity-75">
                        {sg.courses.reduce((sum, c) => sum + c.files.length, 0)} Dateien
                      </span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">{sg.courses.length} Kurse</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Course/Module Selection */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
              <h3 className="text-xl font-black text-slate-900 mb-4">Kurse / Module</h3>
              {selectedStudiengang ? (
                <div className="space-y-3">
                  {STUDIENGAENGE.find(sg => sg.id === selectedStudiengang)?.courses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedModule(course.id)}
                      className={`w-full p-4 rounded-lg font-bold transition text-left ${
                        selectedModule === course.id
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-2 border-cyan-700'
                          : 'bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-cyan-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{course.name}</span>
                        <span className="text-xs opacity-75">{course.code}</span>
                      </div>
                      <div className="text-xs opacity-75 mt-1">{course.files.length} Dateien</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {MODULES.map(module => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module.id)}
                      className={`w-full p-4 rounded-lg font-bold transition text-left ${
                        selectedModule === module.id
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-2 border-cyan-700'
                          : 'bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-cyan-400'
                      }`}
                    >
                      {module.name}
                      <div className="text-xs opacity-75 mt-1">{module.files.length} Dateien</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Module Files */}
            {selectedModule && (() => {
              const module = MODULES.find(m => m.id === selectedModule);
              const studiengang = selectedStudiengang 
                ? STUDIENGAENGE.find(sg => sg.id === selectedStudiengang)
                : null;
              const course = studiengang 
                ? studiengang.courses.find(c => c.id === selectedModule)
                : null;
              
              return (
                <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-4">
                    {course?.name || module?.name}
                  </h3>
                  {course && (
                    <p className="text-sm text-slate-600 mb-4">{course.code}</p>
                  )}
                  <div className="space-y-2">
                    {(course?.files || module?.files || []).map(file => {
                      const readingState = getReadingState(file.id);
                      const isPDF = file.type === 'pdf' || file.name.toLowerCase().endsWith('.pdf');
                      
                      return (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-slate-400 transition"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 text-sm">{file.name}</p>
                              {isPDF && readingState && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                  Seite {readingState.lastPage || 1}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600">{file.size}</p>
                            {isPDF && readingState && readingState.readingProgress !== null && (
                              <div className="mt-1">
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-500 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(readingState.readingProgress, 100)}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {Math.round(readingState.readingProgress)}% gelesen
                                </p>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => downloadModuleFile(
                              file, 
                              course?.name || module?.name,
                              studiengang?.name
                            )}
                            className="ml-2 inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-sm transition"
                          >
                            <Download className="h-4 w-4"/>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Stats */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
              <h3 className="text-lg font-black text-slate-900 mb-4">📊 Statistik</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-semibold">Hochgeladene Dateien:</span>
                  <span className="text-2xl font-black text-green-600">{uploadedFiles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-semibold">Gesamt Material:</span>
                  <span className="text-xl font-bold text-slate-900">
                    {MODULES.reduce((sum, m) => sum + m.files.length, 0)} Dateien
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
