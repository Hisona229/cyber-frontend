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

interface HumidityAlert {
  message: string;
  humidityLevel: number;
  sensorName: string;
  location: string;
  timestamp: string;
  severity: "critical" | "warning";
}

export default function DashboardHumidityPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [alerts, setAlerts] = useState<HumidityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${apiUrl}/humidity-sensors`);
        if (!res.ok) throw new Error("Error fetching data");
        const data = await res.json();
        const sorted = [...data].sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime(),
        );
        const formatted = sorted.map((item: any) => ({
          time: new Date(item.timestamp).toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          value: Number(item.humidityLevel),
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

  useEffect(() => {
    if (!apiUrl) return;

    async function fetchActiveAlerts() {
      try {
        const res = await fetch(
          `${apiUrl}/humidity-sensors/alerts/active`,
        );
        if (!res.ok) throw new Error("Error fetching alerts");
        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.error("Fetching alerts error:", error);
      }
    }

    fetchActiveAlerts();
    const interval = setInterval(fetchActiveAlerts, 5000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  useEffect(() => {
    if (!apiUrl) return;

    const eventSource = new EventSource(
      `${apiUrl}/humidity-sensors/alerts`,
    );

    eventSource.onmessage = (event) => {
      try {
        const alert: HumidityAlert = JSON.parse(event.data);
        setAlerts((prev) => [
          alert,
          ...prev.filter((item) => item.sensorName !== alert.sensorName),
        ]);
      } catch (error) {
        console.error("SSE parse error:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
    };

    return () => eventSource.close();
  }, [apiUrl]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">
        Графік сенсора вологості
      </h1>

      {alerts.length > 0 && (
        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">
            Активні сповіщення
          </h2>
          <p className="text-sm text-slate-500">
            Сповіщення тримається, поки останнє значення не повернеться в норму
            (20-80 %).
          </p>
          {alerts.map((alert, index) => (
            <div
              key={`${alert.sensorName}-${alert.timestamp}-${index}`}
              role="alert"
              className={`rounded-2xl border p-4 shadow-sm ${
                alert.severity === "critical"
                  ? "bg-red-50 border-red-300 text-red-800"
                  : "bg-amber-50 border-amber-300 text-amber-800"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold">{alert.message}</p>
                <span className="text-xs font-bold uppercase whitespace-nowrap">
                  {alert.severity === "critical"
                    ? "Критично"
                    : "Попередження"}
                </span>
              </div>
              <p className="text-sm mt-1">
                Датчик: {alert.sensorName} · {alert.location} ·{" "}
                {new Date(alert.timestamp).toLocaleString("uk-UA")}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Датчик відносної вологості
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
                <YAxis unit=" %" stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ fill: "#059669", r: 4 }}
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