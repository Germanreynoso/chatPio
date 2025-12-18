import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  BarChart3,
  Clock,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';
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
    if (current == null || previous == null || previous === 0) return null;
    const percent = ((current - previous) / previous) * 100;
    return percent;
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
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard de Métricas</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Análisis detallado del rendimiento y uso del sistema Pío
          </p>
        </div>
        <button
          onClick={() => navigate('/chat')}
          className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-slate-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al Chat
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="w-full md:w-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Desde
              </label>
              <select
                value={fromMonth}
                onChange={(e) => setFromMonth(e.target.value)}
                className="w-full rounded-lg border-gray-200 bg-gray-50/50 text-slate-700 text-sm focus:border-udlp-blue focus:ring-udlp-blue transition-colors"
              >
                <option value="">Todos los meses</option>
                {getMonthOptions().map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Hasta
              </label>
              <select
                value={toMonth}
                onChange={(e) => setToMonth(e.target.value)}
                className="w-full rounded-lg border-gray-200 bg-gray-50/50 text-slate-700 text-sm focus:border-udlp-blue focus:ring-udlp-blue transition-colors"
              >
                <option value="">Todos los meses</option>
                {getMonthOptions().map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={() => { setAppliedFromMonth(fromMonth || null); setAppliedToMonth(toMonth || null); }}
            className="w-full md:w-auto px-6 py-2.5 bg-udlp-blue text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 flex items-center justify-center gap-2 font-medium"
          >
            <Filter className="w-4 h-4" />
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* System Alert Section */}
      {loadingSystemAlert ? (
        <div className="animate-pulse h-24 bg-white rounded-2xl border border-gray-100"></div>
      ) : errorSystemAlert ? (
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Error del Sistema</h3>
            <p className="text-red-700 text-sm mt-1">{errorSystemAlert}</p>
          </div>
        </div>
      ) : systemAlert ? (
        <div className={`rounded-2xl border p-6 flex items-start gap-4 shadow-sm transition-all duration-300
          ${systemAlert.system_status === 'ok' ? 'bg-emerald-50/50 border-emerald-100' :
            systemAlert.system_status === 'alert_cost' ? 'bg-red-50/50 border-red-100' :
              systemAlert.system_status === 'alert_usage_drop' ? 'bg-amber-50/50 border-amber-100' :
                'bg-blue-50/50 border-blue-100'}`}
        >
          <div className={`p-2 rounded-xl shrink-0
            ${systemAlert.system_status === 'ok' ? 'bg-emerald-100 text-emerald-600' :
              systemAlert.system_status === 'alert_cost' ? 'bg-red-100 text-red-600' :
                systemAlert.system_status === 'alert_usage_drop' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'}`}
          >
            {systemAlert.system_status === 'ok' ? <CheckCircle2 className="w-6 h-6" /> :
              systemAlert.system_status === 'alert_cost' ? <DollarSign className="w-6 h-6" /> :
                <Activity className="w-6 h-6" />}
          </div>
          <div>
            <h2 className={`font-bold text-lg
              ${systemAlert.system_status === 'ok' ? 'text-emerald-900' :
                systemAlert.system_status === 'alert_cost' ? 'text-red-900' :
                  systemAlert.system_status === 'alert_usage_drop' ? 'text-amber-900' :
                    'text-blue-900'}`}
            >
              Estado del Sistema
            </h2>
            <p className={`text-sm mt-1 font-medium
              ${systemAlert.system_status === 'ok' ? 'text-emerald-700' :
                systemAlert.system_status === 'alert_cost' ? 'text-red-700' :
                  systemAlert.system_status === 'alert_usage_drop' ? 'text-amber-700' :
                    'text-blue-700'}`}
            >
              {systemAlert.system_status === 'ok' ? 'El sistema está funcionando de manera óptima y estable.' :
                systemAlert.system_status === 'alert_cost' ? 'Atención: Los costes de API han superado el umbral esperado.' :
                  systemAlert.system_status === 'alert_usage_drop' ? 'Se ha detectado una caída significativa en el uso del sistema.' :
                    'Crecimiento acelerado de uso detectado.'}
            </p>
          </div>
        </div>
      ) : null}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contenidos"
          value={metrics.totalContenidos}
          variation={totalContenidosVariation}
          icon={<BarChart3 className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Horas Ahorradas"
          value={metrics.tiempoAhorrado}
          variation={horasAhorradasVariation}
          icon={<Clock className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Coste API"
          value={metrics.costesApis}
          variation={totalCosteApisVariation}
          icon={<DollarSign className="w-5 h-5" />}
          color="amber"
        />
        <MetricCard
          title="Áreas Activas"
          value={metrics.areasActivas}
          icon={<Activity className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Formats Card */}
        <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-udlp-blue" />
              Formatos Más Utilizados
            </h2>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-[400px]">
            {loadingUsageByFormat ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl"></div>)}
              </div>
            ) : errorUsageByFormat ? (
              <div className="text-sm text-red-500">{errorUsageByFormat}</div>
            ) : usageByFormat.length > 0 ? (
              <div className="space-y-4">
                {usageByFormat.map((item) => (
                  <div key={item.format} className="group p-4 rounded-xl bg-gray-50/50 hover:bg-blue-50/50 border border-gray-100 hover:border-blue-100 transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-900">{item.format}</span>
                      <span className="text-xs font-medium px-2 py-1 bg-white rounded-full text-slate-600 border border-gray-100 shadow-sm">
                        {item.count} usos
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {item.hours_saved.toFixed(1)}h ahorradas
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                        ${item.total_cost.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">No hay datos disponibles</div>
            )}
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-udlp-blue" />
              Evolución Mensual
            </h2>
          </div>
          <div className="p-6">
            {loadingMonthlyUsage ? (
              <div className="h-[300px] bg-gray-50 rounded-xl animate-pulse"></div>
            ) : errorMonthlyUsage ? (
              <div className="text-sm text-red-500">{errorMonthlyUsage}</div>
            ) : monthlyUsageData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                      dataKey="totalCount"
                      fill="#0057B8"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">No hay datos disponibles</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Data Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Content by Area Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-slate-900">Contenido por Área</h2>
          </div>
          <div className="overflow-x-auto">
            {loadingContentData ? (
              <div className="p-6 space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-50 rounded-lg"></div>)}
              </div>
            ) : errorContentData ? (
              <div className="p-6 text-sm text-red-500">{errorContentData}</div>
            ) : contentData.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Área</th>
                    <th className="px-6 py-4 font-semibold">Mes</th>
                    <th className="px-6 py-4 font-semibold text-right">Contenidos</th>
                    <th className="px-6 py-4 font-semibold text-right">Ahorro</th>
                    <th className="px-6 py-4 font-semibold text-right">Coste</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contentData.map((row) => (
                    <tr key={`${row.area}-${row.month}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.area}</td>
                      <td className="px-6 py-4 text-slate-600">{row.month}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{row.count}</td>
                      <td className="px-6 py-4 text-right text-emerald-600 font-medium">{row.hours_saved.toFixed(1)}h</td>
                      <td className="px-6 py-4 text-right text-slate-600">${row.total_cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-400">No hay datos disponibles</div>
            )}
          </div>
        </div>

        {/* Auto Insights Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-udlp-yellow" />
              Insights Automáticos
            </h2>
          </div>
          <div className="overflow-x-auto">
            {loadingAutoInsights ? (
              <div className="p-6 space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-50 rounded-lg"></div>)}
              </div>
            ) : errorAutoInsights ? (
              <div className="p-6 text-sm text-red-500">{errorAutoInsights}</div>
            ) : autoInsights.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Contexto</th>
                    <th className="px-6 py-4 font-semibold">Insight</th>
                    <th className="px-6 py-4 font-semibold text-right">Var. Cont.</th>
                    <th className="px-6 py-4 font-semibold text-right">Var. Horas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {autoInsights.map((row, index) => (
                    <tr key={`${row.area}-${row.format}-${index}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{row.area}</div>
                        <div className="text-xs text-slate-500">{row.format}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{row.insight_label}</td>
                      <td className="px-6 py-4 text-right">
                        <VariationBadge value={row.count_variation_pct} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <VariationBadge value={row.hours_variation_pct} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-400">No hay insights disponibles</div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="font-bold text-slate-900">Recomendaciones de Optimización</h2>
        </div>
        <div className="overflow-x-auto">
          {loadingRecommendations ? (
            <div className="p-6 space-y-4 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-50 rounded-lg"></div>)}
            </div>
          ) : errorRecommendations ? (
            <div className="p-6 text-sm text-red-500">{errorRecommendations}</div>
          ) : recommendations.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 font-semibold">Área / Formato</th>
                  <th className="px-6 py-4 font-semibold text-right">Coste / Contenido</th>
                  <th className="px-6 py-4 font-semibold text-right">Horas / Contenido</th>
                  <th className="px-6 py-4 font-semibold">Recomendación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recommendations.map((row, index) => (
                  <tr key={`${row.area}-${row.format}-${index}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{row.area}</div>
                      <div className="text-xs text-slate-500">{row.format}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">${row.cost_per_content.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{row.hours_per_content.toFixed(1)}h</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${row.recommendation.includes('Reducir') ? 'bg-red-50 text-red-700 border border-red-100' :
                          row.recommendation.includes('Priorizar') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                        {row.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-400">No hay recomendaciones disponibles</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, variation, icon, color = "blue" }: { title: string; value: string; variation?: number | null; icon: React.ReactNode; color?: "blue" | "emerald" | "amber" | "indigo" }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        {variation !== undefined && variation !== null && (
          <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${variation >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {variation >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {Math.abs(variation).toFixed(0)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

function VariationBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-slate-400">—</span>;

  const isPositive = value > 0;
  const isNeutral = value === 0;

  if (isNeutral) return <span className="text-slate-500">0%</span>;

  return (
    <span className={`inline-flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
      {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}