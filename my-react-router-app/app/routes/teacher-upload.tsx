import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MODULES = [
  'Webentwicklung',
  'Datenbankdesign',
  'Cloud Computing',
  'UI/UX Design',
  'Project Management',
  'Wirtschaftsinformatik'
];

export const loader = async () => {
  return null;
};

export default function TeacherUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    course: '',
    title: '',
    description: '',
    file: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      setFormData({ ...formData, file: e.dataTransfer.files[0] });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.course || !formData.title || !formData.file) {
      setMessage({ type: 'error', text: 'Bitte fülle alle Pflichtfelder aus!' });
      return;
    }

    // Create uploaded file record
    const newFile = {
      id: Date.now(),
      course: formData.course,
      title: formData.title,
      description: formData.description,
      fileName: formData.file.name,
      fileSize: (formData.file.size / (1024 * 1024)).toFixed(2) + ' MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Hochgeladen'
    };

    setUploadedFiles([newFile, ...uploadedFiles]);
    setMessage({ type: 'success', text: 'Kursmaterial erfolgreich hochgeladen!' });
    
    // Reset form
    setFormData({
      course: '',
      title: '',
      description: '',
      file: null
    });

    // Clear message after 3 seconds
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const deleteUpload = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white px-8 py-8 shadow-xl">
        <div className="container mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-4 font-semibold">
            ← Zurück zum Dashboard
          </Link>
          <h1 className="text-4xl font-black mb-2">📤 Kursmaterial hochladen</h1>
          <p className="text-slate-200 text-lg">Lade Materialien für deine Kurse hoch</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-slate-200 mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Neues Material hochladen</h2>

              {message.text && (
                <div className={`mb-6 p-4 rounded-lg border-2 ${
                  message.type === 'success' 
                    ? 'bg-green-50 border-green-300 text-green-700' 
                    : 'bg-red-50 border-red-300 text-red-700'
                }`}>
                  <p className="font-bold">
                    {message.type === 'success' ? '✅ ' : '❌ '}
                    {message.text}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Selection */}
                <div>
                  <label className="block text-base font-bold text-slate-900 mb-3">📚 Modul *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-iu-blue focus:outline-none font-semibold"
                  >
                    <option value="">-- Wähle ein Modul --</option>
                    {MODULES.map(module => (
                      <option key={module} value={module}>{module}</option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-base font-bold text-slate-900 mb-3">📝 Titel *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-iu-blue focus:outline-none font-semibold"
                    placeholder="z.B. Vorlesung 1 - Einführung"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-base font-bold text-slate-900 mb-3">📋 Beschreibung (optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-iu-blue focus:outline-none font-semibold resize-none"
                    placeholder="Kurze Beschreibung des Materials..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-base font-bold text-slate-900 mb-3">📄 Datei *</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`rounded-xl border-4 border-dashed p-8 text-center transition ${
                      dragActive
                        ? 'border-iu-blue bg-cyan-50'
                        : 'border-slate-300 bg-slate-50 hover:border-iu-blue'
                    }`}
                  >
                    {formData.file ? (
                      <div>
                        <div className="text-4xl mb-2">📎</div>
                        <p className="font-bold text-slate-900">{formData.file.name}</p>
                        <p className="text-sm text-slate-600">{(formData.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, file: null })}
                          className="mt-3 text-red-600 hover:text-red-700 font-bold"
                        >
                          Entfernen
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">📤</div>
                        <p className="text-slate-600 font-semibold mb-3">
                          Ziehe eine Datei hier hin oder klicke zum Auswählen
                        </p>
                        <label className="inline-block">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                            className="hidden"
                          />
                          <span className="inline-block px-6 py-2 bg-gradient-to-r from-iu-blue to-blue-600 hover:from-iu-blue hover:to-blue-700 text-white font-bold rounded-lg transition cursor-pointer">
                            Datei wählen
                          </span>
                        </label>
                        <p className="text-slate-500 text-xs mt-3">
                          PDF, DOC, DOCX, PPT, PPTX, ZIP (max. 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-iu-blue hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg text-lg"
                >
                  ✅ Material hochladen
                </button>
              </form>
            </div>

            {/* Uploaded Files List */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Hochgeladene Materialien ({uploadedFiles.length})</h2>

              {uploadedFiles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-lg font-semibold">Noch keine Materialien hochgeladen</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-6 border-2 border-slate-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-slate-900">{file.title}</h3>
                          <p className="text-sm text-slate-600 font-semibold">📚 {file.course}</p>
                          {file.description && (
                            <p className="text-sm text-slate-700 mt-2">{file.description}</p>
                          )}
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold ml-4">
                          {file.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          <p>📄 {file.fileName}</p>
                          <p>💾 {file.fileSize} • 📅 {new Date(file.uploadDate).toLocaleDateString('de-DE')}</p>
                        </div>
                        <button
                          onClick={() => deleteUpload(file.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-4 py-2 rounded-lg transition"
                        >
                          🗑️ Löschen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Guidelines */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-iu-blue">
              <h3 className="text-xl font-black text-slate-900 mb-4">📋 Richtlinien</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-slate-700">Dateien müssen dem gewählten Modul entsprechen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-slate-700">Maximale Dateigröße: 50 MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-slate-700">Unterstützte Formate: PDF, DOC, DOCX, PPT, PPTX, ZIP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-slate-700">Aussagekräftige Titel verwenden</span>
                </li>
              </ul>
            </div>

            {/* Module Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
              <h3 className="text-xl font-black text-slate-900 mb-4">📊 Statistik</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-semibold">Hochgeladen:</span>
                  <span className="text-2xl font-black text-purple-600">{uploadedFiles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-semibold">Module:</span>
                  <span className="text-xl font-bold text-slate-900">{MODULES.length}</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-300">
              <h3 className="text-xl font-black text-slate-900 mb-3">❓ Hilfe</h3>
              <p className="text-slate-700 text-sm mb-4">
                Bei Problemen oder Fragen zum Upload kontaktiere den Support.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-2 px-4 rounded-lg transition shadow-lg text-sm w-full text-center"
              >
                Support kontaktieren
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
