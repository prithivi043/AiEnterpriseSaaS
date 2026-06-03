import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaUsers,
  FaProjectDiagram,
  FaChartLine,
  FaArrowRight,
  FaBuilding,
  FaMoneyBillWave,
  FaCheckCircle,
  FaBolt,
} from "react-icons/fa";

function Landing() {
  const features = [
    {
      icon: <FaProjectDiagram size={28} />,
      title: "Project Management",
      description:
        "Plan, assign, and monitor projects end-to-end with real-time status tracking and milestone alerts.",
    },
    {
      icon: <FaUsers size={28} />,
      title: "Workforce Management",
      description:
        "Manage employee records, attendance, performance, and productivity from a single unified view.",
    },
    {
      icon: <FaMoneyBillWave size={28} />,
      title: "Financial Management",
      description:
        "Track budgets, expenses, revenue, and profitability in real time across all departments.",
    },
    {
      icon: <FaRobot size={28} />,
      title: "AI Insights",
      description:
        "Receive intelligent forecasts, anomaly detection, and AI-driven recommendations to stay ahead.",
    },
  ];

  const benefits = [
    "Real-Time Project & Task Analytics",
    "AI-Powered Forecasting & Recommendations",
    "End-to-End Workforce Monitoring",
    "Live Financial Insights & Budget Control",
    "Role-Based Access & Team Permissions",
    "Secure, Scalable Cloud Infrastructure",
  ];

  const stats = [
    ["10K+", "Projects Managed"],
    ["500+", "Enterprises"],
    ["50K+", "Employees Tracked"],
    ["99.9%", "Uptime SLA"],
  ];

  const steps = [
    {
      title: "Register Your Enterprise",
      desc: "Onboard your organization, configure departments, and invite your teams in minutes.",
    },
    {
      title: "Manage Teams & Projects",
      desc: "Assign roles, launch projects, track workforce activity, and monitor financial flows live.",
    },
    {
      title: "Unlock AI Intelligence",
      desc: "Let Eaura AI surface patterns, predict risks, and recommend actions to optimize performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
              <FaBolt className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Eaura <span className="text-cyan-400">AI</span>
            </h1>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg border border-slate-700 hover:border-cyan-500 transition text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-sm font-medium hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative py-28 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/15 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/12 blur-3xl rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-64 bg-violet-500/6 blur-3xl rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-violet-300 text-sm mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            AI-Driven Real-Time Enterprise SaaS Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
          >
            Project, Workforce &amp;
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Financial Intelligence
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-7 text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Eaura AI unifies enterprise project tracking, workforce management,
            and financial monitoring into one intelligent platform — powered by
            real-time AI insights.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center gap-4 mt-10 flex-wrap"
          >
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center gap-2 font-medium hover:opacity-90 transition"
            >
              Start Free Trial <FaArrowRight size={14} />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-500 transition"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map(([num, label]) => (
            <motion.div
              key={label}
              whileHover={{ y: -4 }}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-8 text-center transition"
            >
              <h2 className="text-4xl font-bold text-cyan-400">{num}</h2>
              <p className="text-slate-400 mt-2 text-sm">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Everything Your Enterprise Needs
          </h2>
          <p className="text-slate-400 text-center mb-16 text-lg">
            One platform. Every operational dimension, in real time.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative bg-slate-900 border border-slate-800 hover:border-cyan-500/25 rounded-3xl p-8 overflow-hidden group transition"
              >
                {/* Top shimmer on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition" />

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/15 border border-indigo-500/20 flex items-center justify-center text-cyan-400 mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 bg-slate-900/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-center mb-16 text-lg">
            Get your enterprise running on Eaura AI in three simple steps.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-8 text-center transition"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center mx-auto mb-5 font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Why Choose Eaura AI
          </h2>
          <p className="text-slate-400 text-center mb-16 text-lg">
            Built for enterprises that demand precision, speed, and
            intelligence.
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {benefits.map((item) => (
              <motion.div
                key={item}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/25 rounded-2xl px-6 py-5 transition"
              >
                <FaCheckCircle className="text-cyan-400 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-br from-indigo-900/40 to-cyan-900/30 rounded-3xl p-16 border border-slate-800">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Ready to Transform Your
            <br />
            Enterprise Operations?
          </h2>
          <p className="text-slate-300 mt-6 text-lg max-w-xl mx-auto leading-relaxed">
            Join forward-thinking organizations using Eaura AI to streamline
            projects, empower teams, and drive financial clarity — all in real
            time.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 mt-10 px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 font-medium hover:opacity-90 transition"
          >
            Create Your Enterprise <FaArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        © 2026 Eaura AI. All rights reserved.
      </footer>
    </div>
  );
}

export default Landing;
