"use client";
import { useEffect, useState } from "react";

interface AlertItem {
  sensorType: "temperature" | "humidity";
  message: string;
  timestamp: string;
  severity: "critical" | "warning";
}

const ARCHIVE_LIMIT = 10;

export default function HomePage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
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

        const merged: AlertItem[] = [
          ...tempData.map((alert: any) => ({
            sensorType: "temperature" as const,
            message: alert.message,
            timestamp: alert.timestamp,
            severity: alert.severity,
          })),
          ...humData.map((alert: any) => ({
            sensorType: "humidity" as const,
            message: alert.message,
            timestamp: alert.timestamp,
            severity: alert.severity,
          })),
        ];

        merged.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime(),
        );

        setAlerts(merged.slice(0, ARCHIVE_LIMIT));
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
    <section className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Архів сповіщень</h1>
      <p className="mb-6 text-gray-700">
        Останні критичні та попереджувальні події з давачів температури й
        вологості. Перейдіть на сторінку графіка, щоб побачити активні
        сповіщення в реальному часі.
      </p>

      {loading ? (
        <p className="text-gray-500">Завантаження архіву...</p>
      ) : alerts.length === 0 ? (
        <p className="text-amber-600">
          Сповіщень поки немає. Надішліть критичне значення через Postman, і
          воно з'явиться тут.
        </p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={`${alert.sensorType}-${alert.timestamp}-${index}`}
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
                {alert.sensorType === "temperature"
                  ? "Температура"
                  : "Вологість"}{" "}
                · {new Date(alert.timestamp).toLocaleString("uk-UA")}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}