import React from 'react'
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  // 🔹 Profile state
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // 🔹 Company state
  const [company, setCompany] = useState({
    name: "",
    phone: "",
  });

  // 🔹 Preferences state
  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: true,
  });

  // 🔹 Handlers (keyinchalik API bilan ulanish uchun)
  const handleProfileSave = (e) => {
    e.preventDefault();
    console.log("Profile data to backend:", profile);
    // fetch("/api/profile", { method: "POST", body: JSON.stringify(profile) })
  };

  const handleCompanySave = (e) => {
    e.preventDefault();
    console.log("Company data to backend:", company);
  };

  const handlePreferencesSave = (e) => {
    e.preventDefault();
    console.log("Preferences data to backend:", preferences);
  };

  const handleSecurity = () => {
    console.log("Enable 2FA (backend API call)");
  };

  // 🔹 Tabs
  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "company", label: "Company" },
    { key: "preferences", label: "Preferences" },
    { key: "security", label: "Security" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      {/* <div className="flex gap-2 border-b pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={px-4 py-2 rounded-t-lg transition ${
              activeTab === tab.key
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div> */}

      {/* Content */}
      <div className="bg-white shadow rounded-2xl p-6">
        {activeTab === "profile" && (
          <form className="space-y-4" onSubmit={handleProfileSave}>
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded"
              value={profile.password}
              onChange={(e) =>
                setProfile({ ...profile, password: e.target.value })
              }
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Save
            </button>
          </form>
        )}

        {activeTab === "company" && (
          <form className="space-y-4" onSubmit={handleCompanySave}>
            <h2 className="text-xl font-semibold mb-4">Company Settings</h2>
            <input
              type="text"
              placeholder="Company Name"
              className="w-full p-2 border rounded"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full p-2 border rounded"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Save
            </button>
          </form>
        )}
        {activeTab === "preferences" && (
          <form className="space-y-4" onSubmit={handlePreferencesSave}>
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="flex items-center gap-2">
              <label>Dark Mode</label>
              <input
                type="checkbox"
                checked={preferences.darkMode}
                onChange={(e) =>
                  setPreferences({ ...preferences, darkMode: e.target.checked })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <label>Email Notifications</label>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    emailNotifications: e.target.checked,
                  })
                }
              />
            </div>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg">
              Save
            </button>
          </form>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            <button
              onClick={handleSecurity}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Enable 2FA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}