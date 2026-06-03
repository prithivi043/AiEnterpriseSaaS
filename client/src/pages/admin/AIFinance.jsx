import { useState } from "react";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaChartPie,
  FaChartLine,
  FaFileInvoiceDollar,
  FaSyncAlt,
} from "react-icons/fa";

export default function AIFinance() {
  const [financeReport, setFinanceReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const [finance, setFinance] = useState({
    salaryPerEmployee: "",
    officeRent: "",
    hostingCost: "",
    marketingBudget: "",
    miscExpense: "",
  });

  const [stats, setStats] = useState(null);

  const saveFinanceSettings = async () => {
    try {
      const token = localStorage.getItem("eaura_token");

      await axios.post(`${import.meta.env.VITE_API_URL}/ai/settings`, finance, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await generateFinanceReport();

      alert("Finance settings saved successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const generateFinanceReport = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("eaura_token");

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/ai/finance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFinanceReport(data);

      setStats({
        totalExpense: data.totalExpense,
        totalEmployees: data.totalEmployees,
        totalProjects: data.totalProjects,
        completionRate: data.completionRate,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Finance Center</h1>

          <p className="text-slate-400 mt-2">
            AI-powered financial analytics, cost optimization, and business
            recommendations.
          </p>
        </div>

        <button
          onClick={generateFinanceReport}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 px-5 py-3 rounded-xl transition disabled:opacity-50"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />

          {loading ? "Generating..." : "Generate AI Report"}
        </button>
      </div>

      {/* Finance Settings */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Finance Settings</h2>

          <p className="text-slate-400 text-sm mt-1">
            Configure operational expenses used by AI analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Salary Per Employee (₹)
            </label>

            <input
              type="number"
              placeholder="25000"
              value={finance.salaryPerEmployee}
              onChange={(e) =>
                setFinance({
                  ...finance,
                  salaryPerEmployee: e.target.value,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Office Rent (₹)
            </label>

            <input
              type="number"
              placeholder="15000"
              value={finance.officeRent}
              onChange={(e) =>
                setFinance({
                  ...finance,
                  officeRent: e.target.value,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Hosting Cost (₹)
            </label>

            <input
              type="number"
              placeholder="5000"
              value={finance.hostingCost}
              onChange={(e) =>
                setFinance({
                  ...finance,
                  hostingCost: e.target.value,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Marketing Budget (₹)
            </label>

            <input
              type="number"
              placeholder="10000"
              value={finance.marketingBudget}
              onChange={(e) =>
                setFinance({
                  ...finance,
                  marketingBudget: e.target.value,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-400 mb-2">
              Miscellaneous Expense (₹)
            </label>

            <input
              type="number"
              placeholder="3000"
              value={finance.miscExpense}
              onChange={(e) =>
                setFinance({
                  ...finance,
                  miscExpense: e.target.value,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={saveFinanceSettings}
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-medium"
          >
            Save Settings
          </button>

          <button
            onClick={generateFinanceReport}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3 rounded-xl"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <FaMoneyBillWave className="text-green-400 text-2xl mb-3" />

          <h3 className="text-slate-400 text-sm">Monthly Expense</h3>

          <p className="text-2xl font-bold mt-2">₹{stats?.totalExpense || 0}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <FaChartPie className="text-cyan-400 text-2xl mb-3" />

          <h3 className="text-slate-400 text-sm">Employees</h3>

          <p className="text-2xl font-bold mt-2">
            {stats?.totalEmployees || 0}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <FaChartLine className="text-indigo-400 text-2xl mb-3" />

          <h3 className="text-slate-400 text-sm">Projects</h3>

          <p className="text-2xl font-bold mt-2">{stats?.totalProjects || 0}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <FaFileInvoiceDollar className="text-yellow-400 text-2xl mb-3" />

          <h3 className="text-slate-400 text-sm">Completion Rate</h3>

          <p className="text-2xl font-bold mt-2">
            {stats?.completionRate || 0}%
          </p>
        </div>
      </div>

      {/* AI Insights */}

      {/* AI Insights Dashboard */}

      {financeReport && (
        <>
          {/* AI Overview */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm mb-2">Financial Score</p>

              <h2 className="text-4xl font-bold text-cyan-400">
                {financeReport.financialScore || 0}
              </h2>

              <p className="text-slate-500 text-sm mt-2">Out of 100</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm mb-2">Risk Level</p>

              <h2 className="text-3xl font-bold text-orange-400">
                {financeReport.riskLevel || "N/A"}
              </h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm mb-2">Growth Forecast</p>

              <p className="text-slate-200 leading-6">
                {financeReport.growthForecast || "N/A"}
              </p>
            </div>
          </div>

          {/* Executive Summary */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Executive Summary</h2>

            <p className="text-slate-300 leading-7">
              {financeReport.summary || "No summary available"}
            </p>
          </div>

          {/* Expense Breakdown */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Expense Breakdown</h2>

            <div className="space-y-6">
              {/* Salary */}

              <div>
                <div className="flex justify-between mb-2">
                  <span>Salary Expense</span>

                  <span>₹{financeReport.expenseBreakdown?.salary || 0}</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500"
                    style={{
                      width: `${
                        financeReport.totalExpense
                          ? ((financeReport.expenseBreakdown?.salary || 0) /
                              financeReport.totalExpense) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Rent */}

              <div>
                <div className="flex justify-between mb-2">
                  <span>Office Rent</span>

                  <span>₹{financeReport.expenseBreakdown?.rent || 0}</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{
                      width: `${
                        financeReport.totalExpense
                          ? ((financeReport.expenseBreakdown?.rent || 0) /
                              financeReport.totalExpense) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Marketing */}

              <div>
                <div className="flex justify-between mb-2">
                  <span>Marketing Budget</span>

                  <span>₹{financeReport.expenseBreakdown?.marketing || 0}</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{
                      width: `${
                        financeReport.totalExpense
                          ? ((financeReport.expenseBreakdown?.marketing || 0) /
                              financeReport.totalExpense) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Hosting */}

              <div>
                <div className="flex justify-between mb-2">
                  <span>Hosting Cost</span>

                  <span>₹{financeReport.expenseBreakdown?.hosting || 0}</span>
                </div>

                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${
                        financeReport.totalExpense
                          ? ((financeReport.expenseBreakdown?.hosting || 0) /
                              financeReport.totalExpense) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-5">AI Recommendations</h2>

            <div className="grid gap-3">
              {financeReport.recommendations?.length > 0 ? (
                financeReport.recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-300"
                  >
                    ✓ {item}
                  </div>
                ))
              ) : (
                <div className="text-slate-500">
                  No recommendations available.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
