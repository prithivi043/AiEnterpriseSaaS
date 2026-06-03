import { useEffect, useState } from "react";

import { getMyTasks } from "../../services/employeeApi";

export default function Performance() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getMyTasks();

    setTasks(data);
  };

  const completed = tasks.filter((t) => t.status === "completed").length;

  const productivity = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-slate-900 rounded-2xl p-8">
        <h2 className="text-xl mb-4">Productivity</h2>

        <div className="text-6xl font-bold text-cyan-400">{productivity}%</div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8">
        <h2 className="text-xl mb-4">Completed Tasks</h2>

        <div className="text-6xl font-bold text-green-400">{completed}</div>
      </div>
    </div>
  );
}
