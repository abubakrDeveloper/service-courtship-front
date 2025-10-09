import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Search } from "lucide-react";

// Inventory Dashboard - single-file React component
// TailwindCSS utility classes assumed to be available in the project
// Default export a React component

export default function InventoryDashboard() {
  // Sample data - replace with API calls as needed
  const initialItems = [
    { id: 1, name: "Samsung Galaxy A14", sku: "PH-0001", qtyRecorded: 500, qtyActual: 500, unit: "pcs", location: "Ombor A" },
    { id: 2, name: "HP LaserJet Pro M404", sku: "EQ-0007", qtyRecorded: 10, qtyActual: 9, unit: "pcs", location: "Ofis" },
    { id: 3, name: "Office Chair - Black", sku: "EQ-0023", qtyRecorded: 20, qtyActual: 22, unit: "pcs", location: "Ofis" },
  ];

  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", sku: "", qtyRecorded: 0, qtyActual: 0, unit: "pcs", location: "" });
  const [commission, setCommission] = useState({ leader: "", members: "" });

  // derived lists
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q) || it.location.toLowerCase().includes(q));
  }, [items, query]);

  const differences = useMemo(() => items.map(it => ({ ...it, diff: it.qtyActual - it.qtyRecorded })), [items]);

  function handleAddItem(e) {
    e.preventDefault();
    const next = { ...newItem, id: Date.now() };
    setItems(prev => [next, ...prev]);
    setNewItem({ name: "", sku: "", qtyRecorded: 0, qtyActual: 0, unit: "pcs", location: "" });
    setShowAddModal(false);
  }

  function exportCSV() {
    const headers = ["id", "name", "sku", "qtyRecorded", "qtyActual", "unit", "location"];
    const rows = items.map(it => headers.map(h => JSON.stringify(it[h] ?? "")).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventarizatsiya_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function updateActual(id, value) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, qtyActual: Number(value) } : it));
  }

  function removeItem(id) {
    if (!confirm("Rostdan o'chirmoqchimisiz?")) return;
    setItems(prev => prev.filter(it => it.id !== id));
  }

  // small summary
  const summary = useMemo(() => {
    const totalRecorded = items.reduce((s, i) => s + Number(i.qtyRecorded), 0);
    const totalActual = items.reduce((s, i) => s + Number(i.qtyActual), 0);
    const totalDiff = totalActual - totalRecorded;
    const shortages = items.filter(i => i.qtyActual < i.qtyRecorded).length;
    const surpluses = items.filter(i => i.qtyActual > i.qtyRecorded).length;
    return { totalRecorded, totalActual, totalDiff, shortages, surpluses };
  }, [items]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Inventarizatsiya boshqaruvi</h1>
            <p className="mt-1 text-sm text-slate-600">Komissiya, sanash, farqlar va yakuniy hisobot — hammasi bu yerdа.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow hover:bg-indigo-700 transition">
              <Plus size={16} /> Yangi yozuv
            </button>
            <button onClick={exportCSV} className="inline-flex items-center gap-2 bg-white border px-4 py-2 rounded-2xl shadow hover:shadow-md transition">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </header>

        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full">
                <div className="relative w-full">
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tavar, SKU yoki joy bo'yicha qidirish..." className="w-full border rounded-xl px-4 py-3 focus:outline-none" />
                  <div className="absolute right-3 top-3 opacity-60"><Search size={16} /></div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <div>Jami hisobda: <strong className="ml-2">{summary.totalRecorded}</strong></div>
                <div>Haqiqiy: <strong className="ml-2">{summary.totalActual}</strong></div>
                <div>Farq: <strong className={`ml-2 ${summary.totalDiff < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{summary.totalDiff}</strong></div>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm table-auto">
                <thead className="text-slate-500 text-left">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Nomi / SKU</th>
                    <th className="p-3">Joy</th>
                    <th className="p-3">Hisobda</th>
                    <th className="p-3">Haqiqiy</th>
                    <th className="p-3">Farq</th>
                    <th className="p-3">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((it, idx) => {
                    const diff = it.qtyActual - it.qtyRecorded;
                    return (
                      <tr key={it.id} className="border-b last:border-0 bg-white">
                        <td className="p-3 align-top">{idx + 1}</td>
                        <td className="p-3 align-top">
                          <div className="font-medium">{it.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{it.sku}</div>
                        </td>
                        <td className="p-3 align-top">{it.location}</td>
                        <td className="p-3 align-top">{it.qtyRecorded} {it.unit}</td>
                        <td className="p-3 align-top">
                          <input type="number" value={it.qtyActual} onChange={(e) => updateActual(it.id, e.target.value)} className="w-24 border rounded px-2 py-1" />
                        </td>
                        <td className={`p-3 align-top font-semibold ${diff < 0 ? 'text-rose-600' : diff > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>{diff}</td>
                        <td className="p-3 align-top">
                          <button onClick={() => removeItem(it.id)} className="text-xs text-rose-600 underline">O'chirish</button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-slate-500">Hech narsa topilmadi</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="bg-white rounded-2xl p-4 shadow">
            <h3 className="text-lg font-semibold">Komissiya</h3>
            <p className="text-sm text-slate-500 mt-2">Komissiya rahbari va a'zolarini kiriting.</p>
            <div className="mt-3 space-y-2">
              <input value={commission.leader} onChange={(e) => setCommission(c => ({ ...c, leader: e.target.value }))} placeholder="Rahbar (ISM)" className="w-full border rounded px-3 py-2" />
              <input value={commission.members} onChange={(e) => setCommission(c => ({ ...c, members: e.target.value }))} placeholder="A'zolar (vergul bilan)" className="w-full border rounded px-3 py-2" />
              <button onClick={() => alert('Komissiya saqlandi (demo)')} className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-2xl">Saqlash</button>
            </div>

            <div className="mt-6 border-t pt-4 text-sm text-slate-600">
              <div>Kamomadlar: <strong className="text-rose-600">{summary.shortages}</strong></div>
              <div>Ortiqchalar: <strong className="text-emerald-600">{summary.surpluses}</strong></div>
              <div className="mt-3">Yakuniy farq: <strong className={`${summary.totalDiff < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{summary.totalDiff}</strong></div>
            </div>
          </aside>
        </motion.section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-4 shadow">
            <h3 className="font-semibold text-lg">Inventarizatsiya vedomosti</h3>
            <p className="text-sm text-slate-500 mt-1">Jami ro'yxat — siz uni tahrir qilib, PDF/CSV qilib eksport qilishingiz mumkin.</p>

            <div className="mt-4">
              <textarea readOnly value={items.map(it => `${it.name} | SKU:${it.sku} | Hisobda:${it.qtyRecorded} | Haqiqiy:${it.qtyActual}`).join('\n')} className="w-full h-36 border rounded p-3 text-xs" />
              <div className="flex gap-2 mt-3">
                <button onClick={() => navigator.clipboard.writeText(items.map(it => `${it.name} | SKU:${it.sku} | Hisobda:${it.qtyRecorded} | Haqiqiy:${it.qtyActual}`).join('\n'))} className="px-4 py-2 border rounded-2xl">Nusxa olish</button>
                <button onClick={exportCSV} className="px-4 py-2 bg-indigo-600 text-white rounded-2xl inline-flex items-center gap-2"><Download size={16} /> CSV eksport</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow">
            <h3 className="font-semibold text-lg">Farqlar tahlili</h3>
            <p className="text-sm text-slate-500 mt-1">Kamomad va ortiqchalarni tezda ko'rish.</p>

            <div className="mt-4 space-y-2">
              {differences.map(d => (
                <div key={d.id} className="flex items-center justify-between border rounded px-3 py-2">
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-slate-500">Hisobda: {d.qtyRecorded} — Haqiqiy: {d.qtyActual}</div>
                  </div>
                  <div className={`font-semibold ${d.diff < 0 ? 'text-rose-600' : d.diff > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>{d.diff}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowAddModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 shadow max-w-md w-full z-10">
              <h3 className="text-lg font-semibold mb-3">Yangi inventar yozuvi</h3>
              <form onSubmit={handleAddItem} className="space-y-3">
                <input required value={newItem.name} onChange={e => setNewItem(n => ({ ...n, name: e.target.value }))} placeholder="Nomi" className="w-full border rounded px-3 py-2" />
                <input required value={newItem.sku} onChange={e => setNewItem(n => ({ ...n, sku: e.target.value }))} placeholder="SKU" className="w-full border rounded px-3 py-2" />
                <div className="grid grid-cols-2 gap-2">
                  <input required type="number" value={newItem.qtyRecorded} onChange={e => setNewItem(n => ({ ...n, qtyRecorded: Number(e.target.value) }))} placeholder="Hisobda miqdor" className="w-full border rounded px-3 py-2" />
                  <input required type="number" value={newItem.qtyActual} onChange={e => setNewItem(n => ({ ...n, qtyActual: Number(e.target.value) }))} placeholder="Haqiqiy miqdor" className="w-full border rounded px-3 py-2" />
                </div>
                <input value={newItem.location} onChange={e => setNewItem(n => ({ ...n, location: e.target.value }))} placeholder="Joy/filial" className="w-full border rounded px-3 py-2" />
                <div className="flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-2xl">Bekor qilish</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-2xl">Qo'shish</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
