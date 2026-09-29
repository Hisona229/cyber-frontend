"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Reading {
  time: string;
  value: number;
}

export default function DashboardTempPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${apiUrl}/sensors`);
        if (!res.ok) throw new Error("Error fetching data");
        const data = await res.json();
        const formatted = data.map((item: any) => ({
          time: new Date(item.timestamp).toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          value: Number(item.value),
        }));
        setReadings(formatted);
      } catch (error) {
        console.error("Fetching data error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">
        Графік температурного сенсора
      </h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Датчик температури (DHT22)
        </h2>
        {loading ? (
          <p className="text-gray-500">Завантаження даних...</p>
        ) : readings.length === 0 ? (
          <p className="text-amber-600">
            Дані відсутні на сервері. Надішліть POST-запит через Postman для додавання точок.
          </p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis unit=" °C" stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: "#2563eb", r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}