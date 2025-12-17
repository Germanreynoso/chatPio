// src/pages/MetricsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchSummaryMetrics, fetchContentByAreaMonth, fetchUsageByFormat, fetchUsageByFormatArea, fetchGlobalKpis, fetchGlobalKpisByMonth, fetchTopDrivers, fetchTopDriversTrend, fetchAutoInsights, fetchSystemAlerts, fetchRecommendations, fetchRecommendationsTrend } from '../services/supabaseService';

export default function MetricsDashboard() {
  const [fromMonth, setFromMonth] = useState('');
  const [toMonth, setToMonth] = useState('');
  const [appliedFromMonth, setAppliedFromMonth] = useState<string | null>(null);
  const [appliedToMonth, setAppliedToMonth] = useState<string | null>(null);

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
  const [globalKpis, setGlobalKpis] = useState<{ total_contenidos: number; areas_activas: number; horas_ahorradas: number | null; total_coste_apis: number | null } | null>(null);
  const [loadingGlobalKpis, setLoadingGlobalKpis] = useState(true);
  const [errorGlobalKpis, setErrorGlobalKpis] = useState<string | null>(null);
  const [monthlyKpis, setMonthlyKpis] = useState<{ month: string; total_contenidos: number; areas_activas: number; horas_ahorradas: number; total_coste_apis: number }[]>([]);
  const [topDrivers, setTopDrivers] = useState<{ area: string; format: string; count: number; percent_contenidos: number; percent_horas: number }[]>([]);
  const [loadingTopDrivers, setLoadingTopDrivers] = useState(true);
  const [errorTopDrivers, setErrorTopDrivers] = useState<string | null>(null);
  const [topDriversTrend, setTopDriversTrend] = useState<{ area: string; format: string; current_count: number; previous_count: number | null; variation_percent: number | null }[]>([]);
  const [loadingTopDriversTrend, setLoadingTopDriversTrend] = useState(true);
  const [errorTopDriversTrend, setErrorTopDriversTrend] = useState<string | null>(null);
  const [autoInsights, setAutoInsights] = useState<{ area: string; format: string; month: string; count_variation_pct: number | null; hours_variation_pct: number | null; cost_variation_pct: number | null; insight_label: string }[]>([]);
  const [loadingAutoInsights, setLoadingAutoInsights] = useState(true);
  const [errorAutoInsights, setErrorAutoInsights] = useState<string | null>(null);
  const [systemAlert, setSystemAlert] = useState<{ system_status: 'ok' | 'alert_cost' | 'alert_usage_drop' | 'alert_growth'; total_contenidos: number; total_cost: number; hours_saved: number } | null>(null);
  const [loadingSystemAlert, setLoadingSystemAlert] = useState(true);
  const [errorSystemAlert, setErrorSystemAlert] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<{ area: string; format: string; cost_per_content: number; hours_per_content: number; recommendation: string }[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [errorRecommendations, setErrorRecommendations] = useState<string | null>(null);
  const [recommendationsTrend, setRecommendationsTrend] = useState<{ area: string; format: string; month: string; cost_per_content: number; hours_per_content: number; cost_variation: number | null; hours_variation: number | null }[]>([]);
  const [loadingRecommendationsTrend, setLoadingRecommendationsTrend] = useState(true);
  const [errorRecommendationsTrend, setErrorRecommendationsTrend] = useState<string | null>(null);

  const navigate = useNavigate();

  const calculateVariation = (current: number | null | undefined, previous: number | null | undefined) => {
    if (current == null || previous == null || previous === 0) return '—';
    const percent = ((current - previous) / previous) * 100;
    const sign = percent > 0 ? '↑' : '↓';
    return `${sign} ${Math.abs(percent).toFixed(0)}%`;
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      options.push({ value, label: value });
    }
    return options;
  };

  useEffect(() => {
    const loadGlobalKpis = async () => {
      setLoadingGlobalKpis(true);
      setErrorGlobalKpis(null);
      try {
        const kpis = await fetchGlobalKpis();
        const monthly = await fetchGlobalKpisByMonth();
        setGlobalKpis(kpis);
        setMonthlyKpis(monthly);
        if (kpis) {
          setMetrics({
            tiempoAhorrado: kpis.horas_ahorradas ? kpis.horas_ahorradas.toFixed(1) : '—',
            costesApis: kpis.total_coste_apis ? `$${kpis.total_coste_apis.toFixed(2)}` : '—',
            totalContenidos: kpis.total_contenidos ? kpis.total_contenidos.toString() : '—',
            areasActivas: kpis.areas_activas ? kpis.areas_activas.toString() : '—'
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
        console.error('Error loading global KPIs:', error);
        setErrorGlobalKpis('Error al cargar los KPIs');
        setMetrics({
          tiempoAhorrado: '—',
          costesApis: '—',
          totalContenidos: '—',
          areasActivas: '—'
        });
      } finally {
        setLoadingGlobalKpis(false);
      }
    };
    loadGlobalKpis();
  }, []);

  const current = monthlyKpis[0];
  const previous = monthlyKpis[1];
  const totalContenidosVariation = calculateVariation(current?.total_contenidos, previous?.total_contenidos);
  const horasAhorradasVariation = calculateVariation(current?.horas_ahorradas, previous?.horas_ahorradas);
  const totalCosteApisVariation = calculateVariation(current?.total_coste_apis, previous?.total_coste_apis);

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
        const data = await fetchContentByAreaMonth(appliedFromMonth || undefined, appliedToMonth || undefined);
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
  }, [appliedFromMonth, appliedToMonth]);

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
    const loadTopDrivers = async () => {
      setLoadingTopDrivers(true);
      setErrorTopDrivers(null);
      try {
        const drivers = await fetchTopDrivers();
        setTopDrivers(drivers);
      } catch (error) {
        console.error('Error loading top drivers:', error);
        setErrorTopDrivers('Error al cargar los datos');
      } finally {
        setLoadingTopDrivers(false);
      }
    };
    loadTopDrivers();
  }, []);

  useEffect(() => {
    const loadTopDriversTrend = async () => {
      setLoadingTopDriversTrend(true);
      setErrorTopDriversTrend(null);
      try {
        const trend = await fetchTopDriversTrend();
        setTopDriversTrend(trend);
      } catch (error) {
        console.error('Error loading top drivers trend:', error);
        setErrorTopDriversTrend('Error al cargar los datos');
      } finally {
        setLoadingTopDriversTrend(false);
      }
    };
    loadTopDriversTrend();
  }, []);

  useEffect(() => {
    const loadAutoInsights = async () => {
      setLoadingAutoInsights(true);
      setErrorAutoInsights(null);
      try {
        const insights = await fetchAutoInsights(appliedFromMonth || undefined, appliedToMonth || undefined);
        setAutoInsights(insights);
      } catch (error) {
        console.error('Error loading auto insights:', error);
        setErrorAutoInsights('Error al cargar los datos');
      } finally {
        setLoadingAutoInsights(false);
      }
    };
    loadAutoInsights();
  }, [appliedFromMonth, appliedToMonth]);

  useEffect(() => {
    const loadSystemAlert = async () => {
      setLoadingSystemAlert(true);
      setErrorSystemAlert(null);
      try {
        const alert = await fetchSystemAlerts();
        setSystemAlert(alert);
      } catch (error) {
        console.error('Error loading system alert:', error);
        setErrorSystemAlert('Error al cargar el estado del sistema');
      } finally {
        setLoadingSystemAlert(false);
      }
    };
    loadSystemAlert();
  }, []);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoadingRecommendations(true);
      setErrorRecommendations(null);
      try {
        const recs = await fetchRecommendations();
        setRecommendations(recs);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setErrorRecommendations('Error al cargar las recomendaciones');
      } finally {
        setLoadingRecommendations(false);
      }
    };
    loadRecommendations();
  }, []);

  useEffect(() => {
    const loadRecommendationsTrend = async () => {
      setLoadingRecommendationsTrend(true);
      setErrorRecommendationsTrend(null);
      try {
        const trend = await fetchRecommendationsTrend(appliedFromMonth || undefined, appliedToMonth || undefined);
        setRecommendationsTrend(trend);
      } catch (error) {
        console.error('Error loading recommendations trend:', error);
        setErrorRecommendationsTrend('Error al cargar la evolución de eficiencia');
      } finally {
        setLoadingRecommendationsTrend(false);
      }
    };
    loadRecommendationsTrend();
  }, [appliedFromMonth, appliedToMonth]);

  useEffect(() => {
    const loadContentData = async () => {
      setLoadingContentData(true);
      setErrorContentData(null);
      try {
        const content = await fetchContentByAreaMonth(appliedFromMonth || undefined, appliedToMonth || undefined);
        setContentData(content);
      } catch (error) {
        console.error('Error loading content data:', error);
        setErrorContentData('Error al cargar los datos');
      } finally {
        setLoadingContentData(false);
      }
    };
    loadContentData();
  }, [appliedFromMonth, appliedToMonth]);
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard de Métricas</h1>
          <p className="text-sm text-muted-foreground">
            Métricas de uso del sistema Pío
          </p>
        </div>
        <button onClick={() => navigate('/chat')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Volver al Chat
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Desde (YYYY-MM)</label>
          <select value={fromMonth} onChange={(e) => setFromMonth(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Seleccionar</option>
            {getMonthOptions().map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hasta (YYYY-MM)</label>
          <select value={toMonth} onChange={(e) => setToMonth(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Seleccionar</option>
            {getMonthOptions().map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={() => { setAppliedFromMonth(fromMonth || null); setAppliedToMonth(toMonth || null); }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Aplicar filtros
          </button>
        </div>
      </div>

      {loadingSystemAlert ? (
        <div className="rounded-xl border p-6 bg-gray-50">
          <div className="text-sm text-muted-foreground">Cargando estado del sistema...</div>
        </div>
      ) : errorSystemAlert ? (
        <div className="rounded-xl border p-6 bg-red-50 text-red-800">
          <div className="text-sm">{errorSystemAlert}</div>
        </div>
      ) : systemAlert ? (
        <div className={`rounded-xl border p-6 ${systemAlert.system_status === 'ok' ? 'bg-green-50 text-green-800' : systemAlert.system_status === 'alert_cost' ? 'bg-red-50 text-red-800' : systemAlert.system_status === 'alert_usage_drop' ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-800'}`}>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${systemAlert.system_status === 'ok' ? 'bg-green-500' : systemAlert.system_status === 'alert_cost' ? 'bg-red-500' : systemAlert.system_status === 'alert_usage_drop' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
            <div>
              <h2 className="font-medium">Estado del sistema</h2>
              <p className="text-sm">
                {systemAlert.system_status === 'ok' ? 'Sistema estable este mes' :
                 systemAlert.system_status === 'alert_cost' ? 'Costes de API fuera de rango' :
                 systemAlert.system_status === 'alert_usage_drop' ? 'Caída significativa de uso' :
                 'Crecimiento acelerado de uso'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border p-6 bg-gray-50">
          <div className="text-sm text-muted-foreground">—</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard title="Total de contenidos" value={metrics.totalContenidos} variation={totalContenidosVariation} />
        <MetricCard title="Horas ahorradas" value={metrics.tiempoAhorrado} variation={horasAhorradasVariation} />
        <MetricCard title="Coste total de API" value={metrics.costesApis} variation={totalCosteApisVariation} />
        <MetricCard title="Áreas activas" value={metrics.areasActivas} />
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

        <div className="rounded-xl border p-4">
          <h2 className="font-medium mb-2">Principales impulsores de uso</h2>
          {loadingTopDrivers ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : errorTopDrivers ? (
            <div className="text-sm text-red-500">{errorTopDrivers}</div>
          ) : topDrivers.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Área</th>
                  <th className="text-left">Formato</th>
                  <th className="text-left">% del total de contenidos</th>
                  <th className="text-left">% del total de horas ahorradas</th>
                </tr>
              </thead>
              <tbody>
                {topDrivers.map((row) => (
                  <tr key={`${row.area}-${row.format}`}>
                    <td>{row.area}</td>
                    <td>{row.format}</td>
                    <td>{row.percent_contenidos.toFixed(1)}%</td>
                    <td>{row.percent_horas.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-muted-foreground">—</div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="font-medium mb-2">Tendencia de principales impulsores</h2>
          {loadingTopDriversTrend ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : errorTopDriversTrend ? (
            <div className="text-sm text-red-500">{errorTopDriversTrend}</div>
          ) : topDriversTrend.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Área</th>
                  <th className="text-left">Formato</th>
                  <th className="text-left">Contenidos (mes actual)</th>
                  <th className="text-left">Variación vs mes anterior</th>
                </tr>
              </thead>
              <tbody>
                {topDriversTrend.map((row) => (
                  <tr key={`${row.area}-${row.format}`}>
                    <td>{row.area}</td>
                    <td>{row.format}</td>
                    <td>{row.current_count}</td>
                    <td className={row.variation_percent && row.variation_percent > 0 ? 'text-green-600' : row.variation_percent && row.variation_percent < 0 ? 'text-red-600' : ''}>
                      {row.variation_percent !== null ? `${row.variation_percent > 0 ? '↑' : '↓'} ${Math.abs(row.variation_percent).toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-muted-foreground">—</div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="font-medium mb-2">Insights automáticos</h2>
          {loadingAutoInsights ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : errorAutoInsights ? (
            <div className="text-sm text-red-500">{errorAutoInsights}</div>
          ) : autoInsights.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Área</th>
                  <th className="text-left">Formato</th>
                  <th className="text-left">Insight</th>
                  <th className="text-left">Variación de contenidos</th>
                  <th className="text-left">Variación de horas</th>
                  <th className="text-left">Variación de coste</th>
                </tr>
              </thead>
              <tbody>
                {autoInsights.map((row, index) => (
                  <tr key={`${row.area}-${row.format}-${index}`}>
                    <td>{row.area}</td>
                    <td>{row.format}</td>
                    <td>{row.insight_label}</td>
                    <td className={row.count_variation_pct && row.count_variation_pct > 0 ? 'text-green-600' : row.count_variation_pct && row.count_variation_pct < 0 ? 'text-red-600' : ''}>
                      {row.count_variation_pct !== null ? `${row.count_variation_pct > 0 ? '↑' : '↓'} ${Math.abs(row.count_variation_pct).toFixed(1)}%` : '—'}
                    </td>
                    <td className={row.hours_variation_pct && row.hours_variation_pct > 0 ? 'text-green-600' : row.hours_variation_pct && row.hours_variation_pct < 0 ? 'text-red-600' : ''}>
                      {row.hours_variation_pct !== null ? `${row.hours_variation_pct > 0 ? '↑' : '↓'} ${Math.abs(row.hours_variation_pct).toFixed(1)}%` : '—'}
                    </td>
                    <td className={row.cost_variation_pct && row.cost_variation_pct > 0 ? 'text-green-600' : row.cost_variation_pct && row.cost_variation_pct < 0 ? 'text-red-600' : ''}>
                      {row.cost_variation_pct !== null ? `${row.cost_variation_pct > 0 ? '↑' : '↓'} ${Math.abs(row.cost_variation_pct).toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-muted-foreground">—</div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="font-medium mb-2">Recomendaciones de optimización</h2>
          {loadingRecommendations ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : errorRecommendations ? (
            <div className="text-sm text-red-500">{errorRecommendations}</div>
          ) : recommendations.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Área</th>
                  <th className="text-left">Formato</th>
                  <th className="text-left">Coste por contenido</th>
                  <th className="text-left">Horas ahorradas por contenido</th>
                  <th className="text-left">Recomendación</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((row, index) => (
                  <tr key={`${row.area}-${row.format}-${index}`}>
                    <td>{row.area}</td>
                    <td>{row.format}</td>
                    <td>${row.cost_per_content.toFixed(2)}</td>
                    <td>{row.hours_per_content.toFixed(1)}</td>
                    <td className={row.recommendation.includes('Reducir') ? 'text-red-600' : row.recommendation.includes('Priorizar') ? 'text-green-600' : 'text-gray-600'}>
                      {row.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-muted-foreground">—</div>
          )}
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="font-medium mb-2">Evolución de eficiencia por área y formato</h2>
          {loadingRecommendationsTrend ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : errorRecommendationsTrend ? (
            <div className="text-sm text-red-500">{errorRecommendationsTrend}</div>
          ) : recommendationsTrend.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Área</th>
                  <th className="text-left">Formato</th>
                  <th className="text-left">Mes</th>
                  <th className="text-left">Coste / contenido</th>
                  <th className="text-left">Horas / contenido</th>
                  <th className="text-left">Variación coste</th>
                  <th className="text-left">Variación horas</th>
                </tr>
              </thead>
              <tbody>
                {recommendationsTrend.map((row) => (
                  <tr key={`${row.area}-${row.format}-${row.month}`}>
                    <td>{row.area}</td>
                    <td>{row.format}</td>
                    <td>{row.month}</td>
                    <td>${row.cost_per_content.toFixed(2)}</td>
                    <td>{row.hours_per_content.toFixed(1)}</td>
                    <td className={row.cost_variation && row.cost_variation > 0 ? 'text-green-600' : row.cost_variation && row.cost_variation < 0 ? 'text-red-600' : ''}>
                      {row.cost_variation !== null ? `${row.cost_variation > 0 ? '↑' : '↓'} ${Math.abs(row.cost_variation).toFixed(1)}%` : '—'}
                    </td>
                    <td className={row.hours_variation && row.hours_variation > 0 ? 'text-green-600' : row.hours_variation && row.hours_variation < 0 ? 'text-red-600' : ''}>
                      {row.hours_variation !== null ? `${row.hours_variation > 0 ? '↑' : '↓'} ${Math.abs(row.hours_variation).toFixed(1)}%` : '—'}
                    </td>
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

function MetricCard({ title, value, variation }: { title: string; value: string; variation?: string }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {variation && <p className="text-xs text-gray-500 mt-1">{variation} vs mes anterior</p>}
    </div>
  );
}