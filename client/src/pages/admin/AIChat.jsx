import { useState } from "react";
import axios from "axios";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/chat`,
        {
          question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Eaura AI Assistant</h1>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full bg-slate-900 p-4 rounded-xl"
        rows="5"
      />

      <button onClick={askAI} className="bg-indigo-600 px-5 py-3 rounded-xl">
        Ask AI
      </button>

      <div className="bg-slate-900 p-6 rounded-xl">{answer}</div>
    </div>
  );
}
