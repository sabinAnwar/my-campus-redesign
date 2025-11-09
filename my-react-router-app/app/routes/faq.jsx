import React, { useState, useEffect, useRef } from "react";
import AppShell from "../components/AppShell";
import { useLoaderData } from "react-router";
import { prisma } from "../lib/prisma";

// LOADER: Fetch all FAQs from database when page loads
export const loader = async () => {
  try {
    // Query database to get all FAQ records
    const faqs = await prisma.fAQ.findMany({
      orderBy: {
        category: "asc", // Sort by category
      },
    });

    // Return FAQs as JSON to the component
    return { faqs };
  } catch (error) {
    console.error("Error loading FAQs:", error);
    return { faqs: [] }; // Return empty array if error
  }
};

// Home Page Component
const HomePage = ({ onNavigate }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            background: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "4rem",
            margin: "0 auto 2rem",
            boxShadow: "0 8px 30px rgba(255,255,255,0.3)",
          }}
        >
          🤖
        </div>

        <h1
          style={{
            color: "white",
            fontSize: "3rem",
            fontWeight: "700",
            margin: "0 0 1rem 0",
          }}
        >
          IU AI FAQ Assistent
        </h1>

        <p
          style={{
            color: "#999",
            fontSize: "1.2rem",
            marginBottom: "3rem",
            lineHeight: "1.6",
          }}
        >
          Dein intelligenter Helfer für alle Fragen rund um dein Studium an der
          IU. Stelle deine Fragen und erhalte sofortige Antworten!
        </p>

        <button
          onClick={() => onNavigate("chat")}
          style={{
            background: "white",
            color: "#1a1a1a",
            border: "none",
            padding: "1.2rem 3rem",
            borderRadius: "30px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 8px 30px rgba(255,255,255,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 12px 40px rgba(255,255,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 8px 30px rgba(255,255,255,0.3)";
          }}
        >
          Chat starten 💬
        </button>

        <div
          style={{
            marginTop: "4rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "15px",
              borderLeft: "4px solid #2ecc71",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
            <h3
              style={{
                color: "white",
                margin: "0 0 0.5rem 0",
                fontSize: "1.1rem",
              }}
            >
              Sofortige Antworten
            </h3>
            <p style={{ color: "#999", margin: 0, fontSize: "0.9rem" }}>
              Erhalte Antworten in Sekunden
            </p>
          </div>

          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "15px",
              borderLeft: "4px solid #ff8c42",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎯</div>
            <h3
              style={{
                color: "white",
                margin: "0 0 0.5rem 0",
                fontSize: "1.1rem",
              }}
            >
              Intelligent
            </h3>
            <p style={{ color: "#999", margin: 0, fontSize: "0.9rem" }}>
              KI-gestützte Antworten
            </p>
          </div>

          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "15px",
              borderLeft: "4px solid #2ecc71",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💡</div>
            <h3
              style={{
                color: "white",
                margin: "0 0 0.5rem 0",
                fontSize: "1.1rem",
              }}
            >
              Umfassend
            </h3>
            <p style={{ color: "#999", margin: 0, fontSize: "0.9rem" }}>
              Alle wichtigen Themen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat Page Component
const ChatPage = ({ onNavigate, faqs }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hallo! 👋 Ich bin dein IU FAQ Assistent. Ich kann dir bei Fragen rund um dein Studium helfen. Was möchtest du wissen?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // SEARCH LOGIC: Find answer from database FAQs
  const findAnswer = (question) => {
    const normalizedQuestion = question.toLowerCase().trim();

    // Step 1: Try exact question match
    for (const faq of faqs) {
      if (faq.question.toLowerCase() === normalizedQuestion) {
        return faq.answer;
      }
    }

    // Step 2: Try partial question match (question contains search OR search contains question)
    for (const faq of faqs) {
      const faqQuestion = faq.question.toLowerCase();
      if (
        normalizedQuestion.includes(faqQuestion) ||
        faqQuestion.includes(normalizedQuestion)
      ) {
        return faq.answer;
      }
    }

    // Step 3: Try keyword matching from database
    for (const faq of faqs) {
      if (faq.keywords) {
        try {
          // Parse JSON keywords array
          const keywords = JSON.parse(faq.keywords);
          // Check if any keyword matches
          for (const keyword of keywords) {
            if (normalizedQuestion.includes(keyword.toLowerCase())) {
              return faq.answer;
            }
          }
        } catch (e) {
          // Skip if keywords JSON is invalid
          console.error("Invalid keywords JSON:", e);
        }
      }
    }

    // Step 4: No match found
    return "Entschuldigung, ich habe keine passende Antwort auf deine Frage gefunden. 😕 Bitte versuche es anders zu formulieren oder kontaktiere direkt den IU Support unter support@iu.org";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);
    const question = inputValue;
    setInputValue("");

    setTimeout(() => {
      const answer = findAnswer(question);
      setMessages((prev) => [...prev, { text: answer, isUser: false }]);
    }, 800);
  };

  const handleClear = () => {
    setMessages([
      {
        text: "Hallo! 👋 Ich bin dein IU FAQ Assistent. Ich kann dir bei Fragen rund um dein Studium helfen. Was möchtest du wissen?",
        isUser: false,
      },
    ]);
  };

  const suggestions = [
    {
      text: "📧 E-Mail nutzen",
      question: "Wie nutze ich meine IU E-Mail-Adresse?",
    },
    {
      text: "📋 Prüfung wiederholen",
      question: "Wie oft kann ich eine Prüfung wiederholen?",
    },
    {
      text: "🌍 Erasmus-Programm",
      question: "Ist die IU Teil des Erasmus-Programms?",
    },
    {
      text: "⚙️ Praxisbericht",
      question: "Wie reiche ich meinen Praxisbericht ein?",
    },
  ];

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#1a1a1a",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "3px solid #2ecc71",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              background: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              boxShadow: "0 4px 15px rgba(255,255,255,0.2)",
            }}
          >
            🤖
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "white",
              }}
            >
              IU AI FAQ Assistent
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#999",
              }}
            >
              Stelle mir deine Fragen!
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => onNavigate("home")}
            style={{
              background: "#1a1a1a",
              color: "white",
              border: "2px solid white",
              padding: "0.7rem 1.5rem",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#1a1a1a";
              e.target.style.color = "white";
            }}
          >
            🏠 Home
          </button>
          <button
            onClick={handleClear}
            style={{
              background: "white",
              color: "#1a1a1a",
              border: "none",
              padding: "0.7rem 1.5rem",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 20px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 15px rgba(255,255,255,0.2)";
            }}
          >
            🔄 Neu starten
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2rem",
          background: "#0a0a0a",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                flexDirection: msg.isUser ? "row-reverse" : "row",
                animation: "slideIn 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: msg.isUser ? "#333" : "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  flexShrink: 0,
                  boxShadow: msg.isUser
                    ? "0 4px 15px rgba(0,0,0,0.3)"
                    : "0 4px 15px rgba(255,255,255,0.3)",
                  border: msg.isUser ? "2px solid #ff8c42" : "none",
                }}
              >
                {msg.isUser ? "👤" : "🤖"}
              </div>
              <div
                style={{
                  background: msg.isUser ? "#1a1a1a" : "white",
                  color: msg.isUser ? "white" : "#1a1a1a",
                  padding: "1.2rem 1.5rem",
                  borderRadius: msg.isUser
                    ? "20px 20px 5px 20px"
                    : "20px 20px 20px 5px",
                  maxWidth: "70%",
                  boxShadow: msg.isUser
                    ? "0 4px 20px rgba(0,0,0,0.3)"
                    : "0 4px 20px rgba(255,255,255,0.1)",
                  borderLeft: msg.isUser ? "none" : "4px solid #2ecc71",
                  borderRight: msg.isUser ? "4px solid #ff8c42" : "none",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                    fontWeight: msg.isUser ? "400" : "500",
                  }}
                >
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestions */}
      <div
        style={{
          padding: "1rem 2rem",
          background: "#1a1a1a",
          borderTop: "1px solid #333",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p
            style={{
              margin: "0 0 0.8rem 0",
              fontSize: "0.85rem",
              color: "#999",
              fontWeight: "600",
            }}
          >
            💡 Beliebte Fragen:
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.8rem",
            }}
          >
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(sug.question);
                  setTimeout(handleSend, 100);
                }}
                style={{
                  background: "white",
                  color: "#1a1a1a",
                  border: "2px solid white",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#2ecc71";
                  e.target.style.color = "white";
                  e.target.style.borderColor = "#2ecc71";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(46, 204, 113, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "#1a1a1a";
                  e.target.style.borderColor = "white";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {sug.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "1.5rem 2rem",
          background: "#1a1a1a",
          borderTop: "3px solid #2ecc71",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Stelle deine Frage hier..."
            style={{
              flex: 1,
              padding: "1rem 1.5rem",
              border: "2px solid #333",
              borderRadius: "25px",
              outline: "none",
              fontSize: "0.95rem",
              background: "#0a0a0a",
              color: "white",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#2ecc71";
              e.target.style.boxShadow = "0 4px 20px rgba(46, 204, 113, 0.2)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#333";
              e.target.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: "white",
              color: "#1a1a1a",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 20px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 15px rgba(255,255,255,0.2)";
            }}
          >
            Senden 📤
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Main App Component with AppShell
export default function App() {
  const [currentPage, setCurrentPage] = useState("chat");

  // GET FAQ DATA from loader (database)
  const { faqs } = useLoaderData();

  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <AppShell>
      {currentPage === "home" && <HomePage onNavigate={navigate} />}
      {currentPage === "chat" && <ChatPage onNavigate={navigate} faqs={faqs} />}
    </AppShell>
  );
}
