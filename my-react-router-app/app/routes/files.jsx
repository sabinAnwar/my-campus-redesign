import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { File as FileIcon, Download, Trash2, Clock, ArrowLeft } from 'lucide-react';

const MODULES = [
  {
    id: 1,
    name: 'Webentwicklung',
    files: [
      { id: 1, name: 'HTML_Basics.pdf', size: '2.5 MB', date: '2025-10-15' },
      { id: 2, name: 'CSS_Advanced.pdf', size: '3.1 MB', date: '2025-10-18' },
      { id: 3, name: 'JavaScript_Tutorial.zip', size: '15 MB', date: '2025-10-20' }
    ]
  },
  {
    id: 2,
    name: 'Datenbankdesign',
    files: [
      { id: 4, name: 'SQL_Queries.pdf', size: '1.8 MB', date: '2025-10-12' },
      { id: 5, name: 'Normalisierung.docx', size: '0.9 MB', date: '2025-10-16' }
    ]
  },
  {
    id: 3,
    name: 'Cloud Computing',
    files: [
      { id: 6, name: 'AWS_Guide.pdf', size: '4.2 MB', date: '2025-10-14' },
      { id: 7, name: 'Docker_Examples.tar.gz', size: '8.5 MB', date: '2025-10-19' }
    ]
  }
];

export const loader = async () => {
  return null;
};

export default function FileManagement() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);

  const LS_KEYS = { recentFiles: 'recentFilesList' };

  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem(LS_KEYS.recentFiles) || '[]');
      if (Array.isArray(f)) setRecentFiles(f);
    } catch {}
  }, []);

  const saveRecentFile = (file, moduleLabel) => {
    const entry = {
      id: file.id ?? `${file.name}-${Date.now()}`,
      name: file.name,
      moduleName: moduleLabel ?? (selectedModule ? MODULES.find(m => m.id === selectedModule)?.name : 'Eigene Dateien'),
      at: Date.now(),
    };
    const dedup = recentFiles.filter((f) => f.id !== entry.id);
    const next = [entry, ...dedup].slice(0, 15);
    setRecentFiles(next);
    try { localStorage.setItem(LS_KEYS.recentFiles, JSON.stringify(next)); } catch {}
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

  const downloadModuleFile = (file, moduleLabel) => {
    saveRecentFile(file, moduleLabel);
    alert(`Download: ${file.name}`);
  };

  const downloadUploadedFile = (file) => {
    saveRecentFile(file, 'Eigene Dateien');
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
            {/* Last opened */}
            {recentFiles?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
                <h3 className="text-xl font-black text-slate-900 mb-2">Zuletzt geöffnet</h3>
                <div className="flex items-start gap-3">
                  <FileIcon className="h-5 w-5 text-slate-700 mt-1"/>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{recentFiles[0].name}</p>
                      {(() => {
                        const ext = recentFiles[0].name.split('.').pop()?.toLowerCase();
                        const isScript = ['pdf','doc','docx','ppt','pptx'].includes(ext || '');
                        return isScript ? <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">Skript</span> : null;
                      })()}
                    </div>
                    <p className="text-sm text-slate-600">{recentFiles[0].moduleName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="h-3.5 w-3.5"/> {new Date(recentFiles[0].at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
              <h3 className="text-xl font-black text-slate-900 mb-4">Module</h3>
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
            </div>

            {/* Module Files */}
            {selectedModule && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  {MODULES.find(m => m.id === selectedModule)?.name}
                </h3>
                <div className="space-y-2">
                  {MODULES.find(m => m.id === selectedModule)?.files.map(file => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-slate-400 transition"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">{file.name}</p>
                        <p className="text-xs text-slate-600">{file.size}</p>
                      </div>
                      <button
                        onClick={() => downloadModuleFile(file, MODULES.find(m => m.id === selectedModule)?.name)}
                        className="ml-2 inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-sm transition"
                      >
                        <Download className="h-4 w-4"/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
