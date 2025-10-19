// Teacher Course Upload Page
import React, { useState } from "react";

export default function TeacherUpload() {
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !course) {
      setMessage("Please select a course and a file.");
      return;
    }
    // TODO: Implement upload logic (API call)
    setMessage("Course PDF uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-50 flex items-center justify-center">
      <form className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Upload Course PDF</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
          <input type="text" value={course} onChange={handleCourseChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Mathematics" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full" />
        </div>
        {message && <div className="mb-4 text-center text-green-600 font-semibold">{message}</div>}
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-800 transition">Upload</button>
      </form>
    </div>
  );
}
