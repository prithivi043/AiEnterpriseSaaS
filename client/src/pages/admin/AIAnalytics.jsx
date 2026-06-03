import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaRobot,
  FaUsers,
  FaProjectDiagram,
  FaTasks,
  FaExclamationTriangle,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";

export default function AIAnalytics() {
  const [overview, setOverview] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadOverview();
  }, []);

  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("eaura_ai_chat");

    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("eaura_ai_chat", JSON.stringify(messages));

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const healthScore = overview
    ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            (overview.completedTasks / Math.max(overview.totalTasks, 1)) * 100 -
              (overview.overdueTasks || 0) * 5,
          ),
        ),
      )
    : 0;

  const loadOverview = async () => {
    try {
      const cached = localStorage.getItem("eaura_ai_overview");

      if (cached) {
        setOverview(JSON.parse(cached));

        return;
      }

      const token = localStorage.getItem("eaura_token");

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/ai/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOverview(data);

      localStorage.setItem("eaura_ai_overview", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;

    try {
      setIsTyping(true);

      const token = localStorage.getItem("eaura_token");

      const userMessage = {
        type: "user",
        text: question,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      const currentQuestion = question;

      setQuestion("");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/chat`,
        {
          question: currentQuestion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: data.answer,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Unable to generate response.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!overview) return <div className="text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">AI Analytics</h1>

        <p className="text-slate-400 mt-2">
          AI-powered insights for projects, employees and productivity.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Employees</p>

          <h2 className="text-3xl font-bold mt-2">{overview.totalEmployees}</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Projects</p>

          <h2 className="text-3xl font-bold mt-2">{overview.totalProjects}</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Tasks</p>

          <h2 className="text-3xl font-bold mt-2">{overview.totalTasks}</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Overdue</p>

          <h2 className="text-3xl font-bold mt-2 text-red-400">
            {overview.overdueTasks}
          </h2>
        </div>
      </div>

      {/* AI Overview */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaRobot className="text-cyan-400" />

          <h2 className="font-semibold text-lg">AI Overview</h2>
        </div>

        <p className="text-slate-300 whitespace-pre-wrap leading-7">
          {overview.summary}
        </p>
      </div>

      {/* Suggested Questions */}

      <div className="flex flex-wrap gap-2">
        {[
          "Who is the best employee?",
          "Which project is delayed?",
          "Show project risks",
          "Department performance",
        ].map((q) => (
          <button
            key={q}
            onClick={() => setQuestion(q)}
            className="px-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500"
          >
            {q}
          </button>
        ))}
      </div>

      {/* AI Chat */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="p-5 border-b border-slate-800">
          <h2 className="font-semibold">Ask Eaura AI</h2>
        </div>

        <div className="h-[350px] md:h-[450px] overflow-y-auto p-5 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[90%] p-4 rounded-2xl ${
                msg.type === "user" ? "ml-auto bg-cyan-600" : "bg-slate-800"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {isTyping && (
            <div className="bg-slate-800 p-4 rounded-2xl w-fit">
              Thinking...
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        <div className="p-4 border-t border-slate-800 flex flex-col md:flex-row gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAI()}
            placeholder="Ask AI..."
            className="flex-1 bg-slate-800 px-4 py-3 rounded-xl outline-none"
          />

          <button
            disabled={isTyping}
            onClick={askAI}
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <FaPaperPlane />

            {isTyping ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
