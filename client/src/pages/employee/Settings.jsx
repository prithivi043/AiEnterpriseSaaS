import { useState } from "react";
import { changePassword } from "../../services/employeeApi";

export default function Settings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await changePassword({
        currentPassword: form.currentPassword,

        newPassword: form.newPassword,
      });

      alert("Password Updated Successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={(e) =>
            setForm({
              ...form,
              currentPassword: e.target.value,
            })
          }
          className="w-full p-3 rounded-xl bg-slate-800"
        />

        <input
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          onChange={(e) =>
            setForm({
              ...form,
              newPassword: e.target.value,
            })
          }
          className="w-full p-3 rounded-xl bg-slate-800"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value,
            })
          }
          className="w-full p-3 rounded-xl bg-slate-800"
        />

        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
