// src/pages/MetricsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchSummaryMetrics, fetchContentByAreaMonth, fetchUsageByFormat, fetchUsageByFormatArea } from '../services/supabaseService';

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState({
    tiempoAhorrado: '—',
    costesApis: '—',
    totalContenidos: '—',
    areasActivas: '—'
  });
  const [contentData, setContentData] = useState<{ area: string; month: string; count: number; hours_saved: number; total_cost: number }[]>([]);
  const [loadingContentData, setLoadingContentData] = useState(true);
  const [errorContentData, setErrorContentData] = useState<string | null>(null);
  const [usageByFormat, setUsageByFormat] = useState<{ format: string; count: number; hours_saved: number; total_cost: number }[]>([]);
  const [loadingUsageByFormat, setLoadingUsageByFormat] = useState(true);
  const [errorUsageByFormat, setErrorUsageByFormat] = useState<string | null>(null);
  const [monthlyUsageData, setMonthlyUsageData] = useState<{ month: string; totalCount: number }[]>([]);
  const [loadingMonthlyUsage, setLoadingMonthlyUsage] = useState(true);
  const [errorMonthlyUsage, setErrorMonthlyUsage] = useState<string | null>(null);
  const [usageByFormatArea, setUsageByFormatArea] = useState<{ area: string; format: string; count: number; hours_saved: number; total_cost: number }[]>([]);
  const [loadingUsageByFormatArea, setLoadingUsageByFormatArea] = useState(true);
  const [errorUsageByFormatArea, setErrorUsageByFormatArea] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const summary = await fetchSummaryMetrics();
        if (summary) {
          setMetrics({
            tiempoAhorrado: summary.horas_ahorradas ? Math.floor(summary.horas_ahorradas).toString() : '—',
            costesApis: summary.total_coste_apis ? `$${summary.total_coste_apis.toFixed(2)}` : '—',
            totalContenidos: summary.total_contenidos ? summary.total_contenidos.toString() : '—',
            areasActivas: summary.areas_activas ? summary.areas_activas.toString() : '—'
          });
        } else {
          setMetrics({
            tiempoAhorrado: '—',
            costesApis: '—',
            totalContenidos: '—',
            areasActivas: '—'
          });
        }
      } catch (error) {
        console.error('Error loading metrics:', error);
      }
    };
    loadMetrics();
  }, []);

  useEffect(() => {
    const loadUsageByFormat = async () => {
      setLoadingUsageByFormat(true);
      setErrorUsageByFormat(null);
      try {
        const formats = await fetchUsageByFormat();
        setUsageByFormat(formats);
      } catch (error) {
        console.error('Error loading usage by format:', error);
        setErrorUsageByFormat('Error al cargar los datos');
      } finally {
        setLoadingUsageByFormat(false);
      }
    };
    loadUsageByFormat();
  }, []);

  useEffect(() => {
    const loadMonthlyUsage = async () => {
      setLoadingMonthlyUsage(true);
      setErrorMonthlyUsage(null);
      try {
        const data = await fetchContentByAreaMonth();
        const monthMap = new Map<string, number>();
        data.forEach(item => {
          const current = monthMap.get(item.month) || 0;
          monthMap.set(item.month, current + item.count);
        });
        const aggregated = Array.from(monthMap.entries()).map(([month, totalCount]) => ({ month, totalCount })).sort((a, b) => b.month.localeCompare(a.month));
        setMonthlyUsageData(aggregated);
      } catch (error) {
        console.error('Error loading monthly usage:', error);
        setErrorMonthlyUsage('Error al cargar los datos');
      } finally {
        setLoadingMonthlyUsage(false);
      }
    };
    loadMonthlyUsage();
  }, []);

  useEffect(() => {
    const loadUsageByFormatArea = async () => {
      setLoadingUsageByFormatArea(true);
      setErrorUsageByFormatArea(null);
      try {
        const data = await fetchUsageByFormatArea();
        setUsageByFormatArea(data);
      } catch (error) {
        console.error('Error loading usage by format area:', error);
        setErrorUsageByFormatArea('Error al cargar los datos');
      } finally {
        setLoadingUsageByFormatArea(false);
      }
    };
    loadUsageByFormatArea();
  }, []);

  useEffect(() => {
    const loadContentData = async () => {
      setLoadingContentData(true);
      setErrorContentData(null);
      try {
        const content = await fetchContentByAreaMonth();
        setContentData(content);
      } catch (error) {
        console.error('Error loading content data:', error);
        setErrorContentData('Error al cargar los datos');
      } finally {
        setLoadingContentData(false);
      }
    };
    loadContentData();
  }, []);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard de Métricas</h1>
        <p className="text-sm text-muted-foreground">
          Métricas de uso del sistema Pío
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard title="Tiempo Ahorrado" value={metrics.tiempoAhorrado} />
        <MetricCard title="Costes APIs" value={metrics.costesApis} />
        <MetricCard title="Total Contenidos" value={metrics.totalContenidos} />
        <MetricCard title="Áreas Activas" value={metrics.areasActivas} />
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Formatos Más Utilizados</p>
          {loadingUsageByFormat ? (
            <div className="text-sm text-muted-foreground mt-2">Cargando...</div>
          ) : errorUsageByFormat ? (
            <div className="text-sm text-red-500 mt-2">{errorUsageByFormat}</div>
          ) : usageByFormat.length > 0 ? (
            <div className="space-y-2 mt-2">
              {usageByFormat.map((item) => (
                <div key={item.format} className="text-sm border-b pb-1">
                  <div className="font-medium">{item.format}</div>
                  <div>Conteo de contenidos: {item.count}</div>
                  <div>Horas ahorradas: {item.hours_saved.toFixed(1)}</div>
                  <div>Coste de API: ${item.total_cost.toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground mt-2">—</div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border p-4">
          <h2 className="font-medium mb-2">Contenido generado por área y mes</h2>
          {loadingContentData ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : errorContentData ? (
            <div className="text-sm text-red-500">{errorContentData}</div>
          ) : contentData.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Área</th>
                  <th className="text-left">Mes</th>
                  <th className="text-left">Conteo de contenidos</th>
                  <th className="text-left">Horas ahorradas</th>
                  <th className="text-left">Coste total de API</th>
                </tr>
              </thead>
              <tbody>
                {contentData.map((row) => (
                  <tr key={`${row.area}-${row.month}`}>
                    <td>{row.area}</td>
                    <td>{row.month}</td>
                    <td>{row.count}</td>
                    <td>{row.hours_saved.toFixed(1)}</td>
                    <td>${row.total_cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-muted-foreground">—</div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="font-medium mb-2">Comparativa de uso mes a mes</h2>
          {loadingMonthlyUsage ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : errorMonthlyUsage ? (
            <div className="text-sm text-red-500">{errorMonthlyUsage}</div>
          ) : monthlyUsageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalCount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-muted-foreground">—</div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="font-medium mb-2">Áreas activas por formato</h2>
          {loadingUsageByFormatArea ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : errorUsageByFormatArea ? (
            <div className="text-sm text-red-500">{errorUsageByFormatArea}</div>
          ) : usageByFormatArea.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Área</th>
                  <th className="text-left">Formato</th>
                  <th className="text-left">Conteo de contenidos</th>
                  <th className="text-left">Horas ahorradas</th>
                  <th className="text-left">Coste total de API</th>
                </tr>
              </thead>
              <tbody>
                {usageByFormatArea.map((row) => (
                  <tr key={`${row.area}-${row.format}`}>
                    <td>{row.area}</td>
                    <td>{row.format}</td>
                    <td>{row.count}</td>
                    <td>{row.hours_saved.toFixed(1)}</td>
                    <td>${row.total_cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-muted-foreground">—</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}