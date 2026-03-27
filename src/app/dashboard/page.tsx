import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import AddJobButton from '@/components/AddJobButton';

export const revalidate = 0; // Para que siempre traiga datos frescos

export default async function Dashboard() {
  // Traemos las vacantes desde Supabase, ordenadas por la más reciente
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  // Calculamos las métricas
  const total = jobs?.length || 0;
  const enEntrevista = jobs?.filter(j => j.status === 'Entrevista Técnica' || j.status === 'Entrevista RH').length || 0;
  const rechazados = jobs?.filter(j => j.status === 'Rechazado').length || 0;
  const ofertas = jobs?.filter(j => j.status === 'Oferta Recibida').length || 0;

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
          <AddJobButton />
        </div>
      </header>

      {/* Tarjetas de Métricas (Responsivo) */}
      <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Aplicaciones Totales', value: total, color: 'text-blue-400' },
          { label: 'En Entrevista', value: enEntrevista, color: 'text-yellow-400' },
          { label: 'Rechazados', value: rechazados, color: 'text-red-400' },
          { label: 'Ofertas Recibidas', value: ofertas, color: 'text-green-400' },
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
                {error && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-red-400">
                      Error al cargar los datos: {error.message}
                    </td>
                  </tr>
                )}
                {!error && jobs?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-400">
                      Aún no has agregado ninguna vacante. ¡Es hora de aplicar! 🚀
                    </td>
                  </tr>
                )}
                {jobs?.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-800/50 transition">
                    <td className="p-4 font-medium text-white">{job.company}</td>
                    <td className="p-4 text-gray-300">{job.position}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        job.status === 'Aplicado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        job.status.includes('Entrevista') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        job.status === 'Oferta Recibida' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(job.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-400 hover:text-white transition">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
