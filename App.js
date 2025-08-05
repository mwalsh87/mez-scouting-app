// MEZ Scouting App Shell - React (with TBA integration and Local Match Data Persistence)

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Home() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-yellow-500">MEZ Scouting App</h1>
      <p className="mt-2 text-lg">Welcome to the Michigan Engineering Zone scouting tool!</p>
      <ul className="mt-4 space-y-2">
        <li><Link to="/match" className="text-blue-600 underline">Match Scouting</Link></li>
        <li><Link to="/pit" className="text-blue-600 underline">Pit Scouting</Link></li>
        <li><Link to="/analytics" className="text-blue-600 underline">Analytics</Link></li>
      </ul>
    </div>
  );
}

function MatchScouting() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ team: "", autoPoints: 0, teleopPoints: 0, endgamePoints: 0, notes: "" });

  useEffect(() => {
    fetch("https://www.thebluealliance.com/api/v3/event/2025miwil/teams", {
      headers: {
        "X-TBA-Auth-Key": "INSERT_YOUR_TBA_KEY_HERE"
      }
    })
      .then(res => res.json())
      .then(data => setTeams(data.map(team => team.team_number)))
      .catch(err => console.error("TBA Fetch Error:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("mezMatchData") || "[]");
    localStorage.setItem("mezMatchData", JSON.stringify([...existing, form]));
    console.log("Match data saved locally:", form);
    setForm({ team: "", autoPoints: 0, teleopPoints: 0, endgamePoints: 0, notes: "" });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-yellow-500">Match Scouting</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium">Team</label>
          <select name="team" value={form.team} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Select a team</option>
            {teams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-medium">Autonomous Points</label>
          <input type="number" name="autoPoints" value={form.autoPoints} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium">Teleop Points</label>
          <input type="number" name="teleopPoints" value={form.teleopPoints} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium">Endgame Points</label>
          <input type="number" name="endgamePoints" value={form.endgamePoints} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="border p-2 rounded w-full"></textarea>
        </div>

        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">Save Match</button>
      </form>
    </div>
  );
}

function PitScouting() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-yellow-500">Pit Scouting</h2>
      <p className="mt-2">Pit scouting form will be here (robot info, drive base, etc).</p>
    </div>
  );
}

function Analytics() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-yellow-500">Analytics</h2>
      <p className="mt-2">Team insights and performance data will appear here.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<MatchScouting />} />
        <Route path="/pit" element={<PitScouting />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}
