import { useEffect, useState } from "react";

import { getAIAnalytics } from "../../services/aiApi";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const res = await getAIAnalytics();

    setData(res);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl">
          <h3>Employees</h3>
          <p className="text-3xl font-bold">{data.totalEmployees}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h3>Projects</h3>
          <p className="text-3xl font-bold">{data.totalProjects}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h3>Tasks</h3>
          <p className="text-3xl font-bold">{data.totalTasks}</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Gemini Insights</h2>

        <pre className="whitespace-pre-wrap text-slate-300">
          {data.aiInsights}
        </pre>
      </div>
    </div>
  );
}
