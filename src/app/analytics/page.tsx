import Link from 'next/link';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Analítica y <span className="text-cyan-400">Predicciones</span> 🧠
          </h1>
          <p className="text-sm text-gray-400">Descubre qué te pide el mercado y qué necesitas estudiar.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition border border-gray-700">
            ← Volver al ATS
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Skills Demandados */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-6">🔥 Top Skills Demandados</h2>
          <div className="space-y-4">
            {[
              { skill: 'React / Next.js', percent: 85, color: 'bg-blue-500' },
              { skill: 'Node.js / Express', percent: 65, color: 'bg-green-500' },
              { skill: 'PostgreSQL / SQL', percent: 60, color: 'bg-indigo-500' },
              { skill: 'AWS / Cloud', percent: 45, color: 'bg-yellow-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1 font-semibold text-gray-300">
                  <span>{item.skill}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2.5 border border-gray-700">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">* Basado en las últimas 12 vacantes guardadas.</p>
        </div>

        {/* Rendimiento por Categoría (Win Rate) */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Rendimiento Técnico (Win Rate)</h2>
          <div className="space-y-4">
            {[
              { cat: 'Frontend (React/UI)', rate: 90, status: 'Excelente' },
              { cat: 'Bases de Datos (SQL)', rate: 75, status: 'Bueno' },
              { cat: 'System Design', rate: 40, status: 'Estudiar' },
              { cat: 'Algoritmos (LeetCode)', rate: 30, status: 'Alerta Roja' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-700/30">
                <span className="text-sm font-semibold text-gray-300">{item.cat}</span>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  item.rate >= 80 ? 'bg-green-500/10 text-green-400' : 
                  item.rate >= 60 ? 'bg-yellow-500/10 text-yellow-400' : 
                  'bg-red-500/10 text-red-400'
                }`}>
                  {item.rate}% - {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerta de Estudio - Banco de Preguntas Falladas */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">🚨 Alerta de Estudio (Preguntas Falladas)</h2>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">Ver Banco Completo →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { company: 'Mercado Libre', q: '¿Cómo escalarías una base de datos relacional para 1M de lecturas por segundo?' },
              { company: 'Clip', q: 'Explica el Event Loop de Node.js a profundidad.' },
              { company: 'Kavak', q: 'Diferencia entre SSR, SSG e ISR en Next.js y cuándo usar cada uno.' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gray-900 border border-red-500/20 hover:border-red-500/50 transition">
                <div className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wide">{item.company}</div>
                <div className="text-sm text-gray-300">"{item.q}"</div>
                <button className="mt-4 text-xs font-bold text-gray-400 hover:text-white transition w-full text-left">
                  + Marcar como estudiada
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
