"use client";
import { useEffect, useState } from "react";

interface AlertItem {
  message: string;
  timestamp: string;
  severity: "critical" | "warning";
}

const ARCHIVE_LIMIT = 10;

function AlertCard({ alert }: { alert: AlertItem }) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        alert.severity === "critical"
          ? "bg-red-50 border-red-300 text-red-800"
          : "bg-amber-50 border-amber-300 text-amber-800"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-semibold">{alert.message}</p>
        <span className="text-xs font-bold uppercase whitespace-nowrap">
          {alert.severity === "critical" ? "Критично" : "Попередження"}
        </span>
      </div>
      <p className="text-sm mt-1">
        {new Date(alert.timestamp).toLocaleString("uk-UA")}
      </p>
    </div>
  );
}

function toItems(data: any[]): AlertItem[] {
  return data
    .map((alert: any) => ({
      message: alert.message,
      timestamp: alert.timestamp,
      severity: alert.severity,
    }))
    .sort(
      (a: AlertItem, b: AlertItem) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, ARCHIVE_LIMIT);
}

export default function HomePage() {
  const [tempAlerts, setTempAlerts] = useState<AlertItem[]>([]);
  const [humAlerts, setHumAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!apiUrl) return;

    async function fetchHistory() {
      try {
        const [tempRes, humRes] = await Promise.all([
          fetch(`${apiUrl}/temperature-sensors/alerts/history`),
          fetch(`${apiUrl}/humidity-sensors/alerts/history`),
        ]);

        const tempData = tempRes.ok ? await tempRes.json() : [];
        const humData = humRes.ok ? await humRes.json() : [];

        setTempAlerts(toItems(tempData));
        setHumAlerts(toItems(humData));
      } catch (error) {
        console.error("Fetching alert history error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  return (
    <section className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Архів сповіщень</h1>
      <p className="mb-6 text-gray-700">
        Останні критичні та попереджувальні події з давачів. Перейдіть на
        сторінку графіка, щоб побачити активні сповіщення в реальному часі.
      </p>

      {loading ? (
        <p className="text-gray-500">Завантаження архіву...</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-slate-800">
              Датчик температури
            </h2>
            {tempAlerts.length === 0 ? (
              <p className="text-amber-600">Сповіщень поки немає.</p>
            ) : (
              <div className="space-y-3">
                {tempAlerts.map((alert, index) => (
                  <AlertCard
                    key={`temp-${alert.timestamp}-${index}`}
                    alert={alert}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-slate-800">
              Датчик вологості
            </h2>
            {humAlerts.length === 0 ? (
              <p className="text-amber-600">Сповіщень поки немає.</p>
            ) : (
              <div className="space-y-3">
                {humAlerts.map((alert, index) => (
                  <AlertCard
                    key={`hum-${alert.timestamp}-${index}`}
                    alert={alert}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}