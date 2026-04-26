"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  usedRag?: boolean;
}

const suggestions = [
  "What is photosynthesis?",
  "Solve: 2x + 5 = 11",
  "Explain Newton's laws of motion",
  "How does the water cycle work?",
];

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
    </svg>
  );
}

export default function EduBridge() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadMsg, setUploadMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const userMsg: Message = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://eaten-counting-unrushed.ngrok-free.dev/chat", {
        method: "POST",
        headers: { 
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true"
},
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer,
        usedRag: data.used_rag
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Unable to connect to backend. Please make sure the server is running."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("https://eaten-counting-unrushed.ngrok-free.dev/upload", {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true"
        },
        body: formData
      });
      const data = await res.json();
      setUploadedFiles(prev => [...prev, file.name]);
      setUploadMsg(`✓ ${file.name} indexed (${data.chunks_indexed} chunks)`);
      setTimeout(() => setUploadMsg(""), 4000);
    } catch {
      setUploadMsg("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .msg-appear { animation: fadeUp 0.3s ease forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dot-pulse { display: flex; gap: 4px; align-items: center; }
        .dot-pulse span {
          width: 5px; height: 5px; border-radius: 50%;
          background: #666; animation: pulse 1.2s infinite;
        }
        .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
        .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        .send-btn:hover:not(:disabled) { background: #fff !important; }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .upload-btn:hover { background: #1a1a1a !important; }
        .suggestion-btn:hover { background: #1a1a1a !important; border-color: #444 !important; }
        textarea { resize: none; }
        textarea:focus { outline: none; }
        input[type="file"] { display: none; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e5e5e5"
      }}>
        {/* Sidebar */}
        <div style={{
          width: "240px",
          borderRight: "1px solid #1a1a1a",
          background: "#0d0d0d",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          gap: "16px",
          position: "fixed",
          top: 0, bottom: 0, left: 0
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 0" }}>
            <div style={{
              width: "28px", height: "28px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <BotIcon />
            </div>
            <span style={{ fontWeight: 600, fontSize: "15px" }}>EduBridge</span>
          </div>

          <div style={{ height: "1px", background: "#1a1a1a" }} />

          {/* Upload Section */}
          <div>
            <p style={{ fontSize: "11px", color: "#555", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Study Materials
            </p>
            <button
              className="upload-btn"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{
                width: "100%",
                background: "#111",
                border: "1px dashed #2a2a2a",
                borderRadius: "10px",
                padding: "12px",
                color: "#666",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.15s"
              }}
            >
              <UploadIcon />
              {uploading ? "Uploading..." : "Upload PDF / TXT"}
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.txt" onChange={handleUpload} />

            {uploadMsg && (
              <p style={{
                fontSize: "11px", color: "#22c55e",
                marginTop: "8px", lineHeight: "1.4"
              }}>
                {uploadMsg}
              </p>
            )}
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div>
              <p style={{ fontSize: "11px", color: "#555", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Indexed Files
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={{
                    fontSize: "12px", color: "#666",
                    background: "#111",
                    border: "1px solid #1a1a1a",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Status */}
          <div style={{ marginTop: "auto" }}>
            <div style={{
              background: "#111", border: "1px solid #1a1a1a",
              borderRadius: "10px", padding: "10px 12px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: "12px", color: "#555" }}>Local · Offline Ready</span>
              </div>
              <p style={{ fontSize: "11px", color: "#333" }}>Gemma 4 · Ollama</p>
            </div>
          </div>
        </div>

        {/* Main Chat */}
        <div style={{
          marginLeft: "240px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh"
        }}>
          {/* Top Bar */}
          <div style={{
            position: "fixed",
            top: 0, left: "240px", right: 0,
            height: "52px",
            borderBottom: "1px solid #1a1a1a",
            background: "rgba(10,10,10,0.9)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            zIndex: 100
          }}>
            <span style={{ fontSize: "14px", color: "#555" }}>
              {uploadedFiles.length > 0
                ? `${uploadedFiles.length} document(s) loaded · RAG Active`
                : "No documents loaded · Ask anything"}
            </span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            paddingTop: "52px",
            paddingBottom: "90px",
            overflowY: "auto"
          }}>
            {isEmpty ? (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "80px 24px 40px", gap: "32px"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "56px", height: "56px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    borderRadius: "16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px"
                  }}>
                    <BotIcon />
                  </div>
                  <h2 style={{
                    fontSize: "26px", fontWeight: 600,
                    letterSpacing: "-0.5px", color: "#fff", marginBottom: "8px"
                  }}>
                    How can I help you learn?
                  </h2>
                  <p style={{ color: "#555", fontSize: "14px" }}>
                    Upload study materials or ask anything directly.
                  </p>
                </div>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: "10px", maxWidth: "520px", width: "100%"
                }}>
                  {suggestions.map((s, i) => (
                    <button key={i} className="suggestion-btn" onClick={() => sendMessage(s)} style={{
                      background: "#111", border: "1px solid #222",
                      borderRadius: "12px", padding: "14px 16px",
                      color: "#aaa", fontSize: "13px",
                      textAlign: "left", cursor: "pointer",
                      transition: "all 0.15s", lineHeight: "1.4"
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: "720px", width: "100%", margin: "0 auto", padding: "24px" }}>
                {messages.map((msg, i) => (
                  <div key={i} className="msg-appear" style={{
                    display: "flex", gap: "14px", marginBottom: "28px",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    alignItems: "flex-start"
                  }}>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "8px",
                      background: msg.role === "user" ? "#1a1a1a" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      border: msg.role === "user" ? "1px solid #2a2a2a" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, color: msg.role === "user" ? "#888" : "#fff"
                    }}>
                      {msg.role === "user" ? <UserIcon /> : <BotIcon />}
                    </div>
                    <div style={{ maxWidth: "85%" }}>
                      <div style={{
                        padding: msg.role === "user" ? "10px 16px" : "0",
                        background: msg.role === "user" ? "#161616" : "transparent",
                        border: msg.role === "user" ? "1px solid #222" : "none",
                        borderRadius: "12px", fontSize: "14px",
                        lineHeight: "1.7",
                        color: msg.role === "user" ? "#ddd" : "#ccc"
                      }}>
                        {msg.content}
                      </div>
                      {msg.usedRag && (
                        <p style={{ fontSize: "11px", color: "#4ade80", marginTop: "6px" }}>
                          ✓ Answer from your uploaded documents
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="msg-appear" style={{
                    display: "flex", gap: "14px", marginBottom: "28px", alignItems: "flex-start"
                  }}>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "8px",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      <BotIcon />
                    </div>
                    <div style={{ paddingTop: "8px" }}>
                      <div className="dot-pulse">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            position: "fixed", bottom: 0, left: "240px", right: 0,
            background: "rgba(10,10,10,0.95)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid #1a1a1a",
            padding: "12px 24px 16px"
          }}>
            <div style={{
              maxWidth: "720px", margin: "0 auto",
              background: "#111", border: "1px solid #222",
              borderRadius: "14px",
              display: "flex", alignItems: "flex-end",
              gap: "8px", padding: "10px 14px"
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                rows={1}
                style={{
                  flex: 1, background: "transparent",
                  border: "none", color: "#e5e5e5",
                  fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                  lineHeight: "1.5", maxHeight: "120px", overflowY: "auto"
                }}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: "#e5e5e5", border: "none", color: "#000",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.15s", flexShrink: 0
                }}
              >
                <SendIcon />
              </button>
            </div>
            <p style={{
              textAlign: "center", fontSize: "11px",
              color: "#333", marginTop: "8px"
            }}>
              EduBridge · Powered by Gemma 4 + Ollama · Runs 100% Locally
            </p>
          </div>
        </div>
      </div>
    </>
  );
}