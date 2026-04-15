"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function LaporanSampah() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Laporan berhasil dikirim! 🌱");
        (e.target as HTMLFormElement).reset();
      } else {
        const errorData = await res.json();
        alert("Gagal: " + errorData.error);
      }
    } catch (err) {
      alert("Gagal menyambung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-green-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-800">Cikini Bersih</h1>
          <p className="text-green-600/70 text-sm">Laporkan tumpukan sampah untuk lingkungan yang asri.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Lokasi / Judul</label>
            <input 
              name="title" 
              required
              className="w-full px-4 py-3 rounded-xl border border-green-100 text-gray-900 focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
              placeholder="Contoh: Sampah depan Cluster"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Keterangan</label>
            <textarea 
              name="description" 
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-green-100 text-gray-900 focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
              placeholder="Ceritakan detail lokasinya..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Foto Sampah</label>
            <div className="border-2 border-dashed border-green-200 rounded-xl p-4 text-center bg-green-50/20">
              <input 
                type="file" 
                name="file" 
                accept="image/*" 
                required
                className="w-full text-sm text-green-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Laporan 🌱"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}