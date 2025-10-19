
import React, { useState } from "react";
import { Link } from "react-router-dom";

const TABS = [
  { name: "Studienplan", icon: "📚" },
  { name: "Klausuren", icon: "📝" },
  { name: "Bibliothek", icon: "🏛️" },
  { name: "FAQ", icon: "❓" },
  { name: "News", icon: "📰" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Studienplan");
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#e6fcff]">
      {/* Top Banner */}
      <div className="w-full bg-[#aafcff] text-black text-center py-2 text-sm font-semibold border-b border-[#00e6ff]">
        Mit Code <span className="font-bold">25JAHREIU</span> bis <span className="font-bold">30. September</span> starten & <span className="font-bold">1.444 Euro + 250 Euro Rabatt + gratis iPad</span> sichern.
      </div>
      {/* Header */}
      <header className="bg-white flex items-center justify-between px-8 py-6 shadow-md border-b border-[#00e6ff]">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-black">iu</span>
          <span className="text-xs font-semibold text-black">INTERNATIONALE HOCHSCHULE</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border-2 border-[#0033ff] text-[#0033ff] font-bold px-4 py-2 rounded hover:bg-[#e6fcff] transition">STUDIENPLATZ SICHERN</button>
          <button className="bg-[#0033ff] text-white font-bold px-4 py-2 rounded hover:bg-[#0055ff] transition">STUDIENBROSCHÜRE</button>
        </div>
      </header>
      {/* Navigation Bar */}
      <nav className="bg-[#e6fcff] shadow py-3 border-b border-[#00e6ff]">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">IU Dual Student Portal</h1>
          <div className="space-x-6">
            <Link to="/dashboard" className="text-black hover:text-[#0033ff] font-medium">Dashboard</Link>
            <Link to="/teacher-upload" className="text-black hover:text-[#0033ff] font-medium">Upload Course</Link>
            <Link to="/courses" className="text-black hover:text-[#0033ff] font-medium">Courses</Link>
            <Link to="/contact" className="text-black hover:text-[#0033ff] font-medium">Contact</Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-12">
        {/* Tabbed Interface */}
        <div className="flex justify-center mb-10">
          {TABS.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-6 py-3 mx-2 rounded-t-xl font-bold text-lg border-b-4 transition-all duration-200 ${activeTab === tab.name ? "bg-[#00e6ff] text-black border-[#0033ff]" : "bg-white text-black border-[#e6fcff] hover:bg-[#aafcff]"}`}
            >
              <span className="mr-2">{tab.icon}</span>{tab.name}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#00e6ff]">
          {/* Tab Content */}
          {activeTab === "Studienplan" && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center"><span className="mr-2">📚</span>Studienplan</h2>
              <p className="text-black mb-6">See your study plan, modules, and progress at a glance.</p>
              <div className="w-full bg-[#e6fcff] rounded-lg p-4 text-black text-center font-semibold border border-[#00e6ff] mb-6">Your study plan will appear here.</div>
              {/* Example Progress Bar */}
              <div className="w-full mb-6">
                <div className="flex justify-between mb-1"><span>Progress</span><span>60%</span></div>
                <div className="w-full bg-[#aafcff] rounded-full h-4">
                  <div className="bg-[#0033ff] h-4 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Klausuren" && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center"><span className="mr-2">📝</span>Klausuren (Exams)</h2>
              <p className="text-black mb-6">Check your upcoming and past exams, results, and feedback.</p>
              <div className="w-full bg-[#e6fcff] rounded-lg p-4 text-black text-center font-semibold border border-[#00e6ff] mb-6">Upcoming and past exams will be listed here.</div>
              <div className="mt-6 w-full">
                <h3 className="text-lg font-bold text-black mb-2">Einsicht in der Klausuren</h3>
                <p className="text-black mb-2">Request to view your exam papers and feedback.</p>
                <button className="bg-[#0033ff] text-white px-4 py-2 rounded font-bold hover:bg-[#00e6ff] transition">Request Exam Review</button>
              </div>
            </div>
          )}
          {activeTab === "Bibliothek" && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center"><span className="mr-2">🏛️</span>Bibliothek</h2>
              <p className="text-black mb-6">Access university library resources, books, and research papers.</p>
              <div className="w-full bg-[#e6fcff] rounded-lg p-4 text-black text-center font-semibold border border-[#00e6ff] mb-6">Browse or search the IU library collection.</div>
              <input type="text" placeholder="Search library..." className="w-full px-4 py-2 mb-4 border border-[#00e6ff] rounded" />
              <div className="w-full flex flex-col gap-2">
                <a href="https://www.iu.de/bibliothek/" target="_blank" rel="noopener noreferrer" className="bg-[#0033ff] text-white px-4 py-2 rounded font-bold hover:bg-[#00e6ff] transition text-center">Go to IU Library</a>
                <a href="https://www.iu.de/campus/" target="_blank" rel="noopener noreferrer" className="bg-[#0033ff] text-white px-4 py-2 rounded font-bold hover:bg-[#00e6ff] transition text-center">IU Campus Portal</a>
                <a href="https://www.iu.de/studium/" target="_blank" rel="noopener noreferrer" className="bg-[#0033ff] text-white px-4 py-2 rounded font-bold hover:bg-[#00e6ff] transition text-center">IU Study Info</a>
              </div>
            </div>
          )}
          {activeTab === "FAQ" && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center"><span className="mr-2">❓</span>FAQ</h2>
              <button onClick={() => setFaqOpen(!faqOpen)} className="bg-[#0033ff] text-white px-4 py-2 rounded font-bold mb-4">{faqOpen ? "Hide" : "Show"} FAQ</button>
              {faqOpen && (
                <ul className="text-black list-disc pl-5">
                  <li>How do I access my Studienplan?</li>
                  <li>Where can I find exam dates?</li>
                  <li>How do I request exam review?</li>
                  <li>Who do I contact for support?</li>
                </ul>
              )}
            </div>
          )}
          {activeTab === "News" && (
            <div>
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center"><span className="mr-2">📰</span>News</h2>
              <div className="grid gap-4">
                <div className="bg-[#e6fcff] rounded-lg p-4 border border-[#00e6ff]">
                  <h4 className="font-bold mb-1">New module added: Data Science</h4>
                  <p className="text-black">Starts next semester</p>
                </div>
                <div className="bg-[#e6fcff] rounded-lg p-4 border border-[#00e6ff]">
                  <h4 className="font-bold mb-1">Exam review requests open</h4>
                  <p className="text-black">Submit until 15th September</p>
                </div>
                <div className="bg-[#e6fcff] rounded-lg p-4 border border-[#00e6ff]">
                  <h4 className="font-bold mb-1">Library hours extended</h4>
                  <p className="text-black">During exam period</p>
                </div>
              </div>
            </div>
          )}
          {/* Help Section */}
          <div className="mt-12 flex flex-col items-center">
            <div className="bg-[#e6fcff] rounded-xl shadow p-6 w-full max-w-xl text-center border border-[#00e6ff]">
              <h3 className="text-lg font-semibold text-black mb-2">Need Help?</h3>
              <p className="text-black mb-4">Contact your teacher or support team for any questions or issues.</p>
              <Link to="/contact" className="bg-[#0033ff] text-white px-6 py-2 rounded-full font-bold hover:bg-[#00e6ff] transition inline-block">Contact Support</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
// ...existing code...