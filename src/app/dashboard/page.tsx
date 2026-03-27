import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header del Dashboard */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Mi <span className="text-indigo-400">ATS Personal</span>
          </h1>
          <p className="text-sm text-gray-400">Control de vacantes, entrevistas y estadísticas.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition border border-gray-700 text-center w-full md:w-auto">
            Volver al Portafolio
          </Link>
          <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-bold text-white transition shadow-lg shadow-indigo-500/20 text-center w-full md:w-auto">
            + Nueva Vacante
          </button>
        </div>
      </header>

      {/* Tarjetas de Métricas (Responsivo) */}
      <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Aplicaciones Totales', value: '12', color: 'text-blue-400' },
          { label: 'En Entrevista', value: '3', color: 'text-yellow-400' },
          { label: 'Rechazados', value: '2', color: 'text-red-400' },
          { label: 'Ofertas Recibidas', value: '0', color: 'text-green-400' },
        ].map((metric, idx) => (
          <div key={idx} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col items-center md:items-start text-center md:text-left hover:bg-gray-800 transition">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{metric.label}</span>
            <span className={`text-4xl font-black ${metric.color}`}>{metric.value}</span>
          </div>
        ))}
      </section>

      {/* Tabla/Lista de Vacantes Activas */}
      <section className="max-w-6xl mx-auto">
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50 flex justify-between items-center bg-gray-800/50">
            <h2 className="text-lg font-bold text-white">Actividad Reciente</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">Ver todas →</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-700/50">
                  <th className="p-4 font-semibold">Empresa</th>
                  <th className="p-4 font-semibold">Puesto</th>
                  <th className="p-4 font-semibold">Estatus</th>
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-700/50">
                {/* Fila de ejemplo 1 */}
                <tr className="hover:bg-gray-800/50 transition">
                  <td className="p-4 font-medium text-white">Mercado Libre</td>
                  <td className="p-4 text-gray-300">Software Architect</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      Entrevista Técnica
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">24 Mar 2026</td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-white transition">Editar</button>
                  </td>
                </tr>
                {/* Fila de ejemplo 2 */}
                <tr className="hover:bg-gray-800/50 transition">
                  <td className="p-4 font-medium text-white">Clip</td>
                  <td className="p-4 text-gray-300">Senior Backend Engineer</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Aplicado
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">22 Mar 2026</td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-white transition">Editar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
