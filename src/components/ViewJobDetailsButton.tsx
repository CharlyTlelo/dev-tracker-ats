'use client';
import { useState } from 'react';

export default function ViewJobDetailsButton({ job }: { job: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Mock inteligente para "CV Sugerido" basado en el título del puesto
  const getSuggestedCV = (position: string, company: string) => {
     const pos = position.toLowerCase();
     if (pos.includes('next') || pos.includes('react') || pos.includes('frontend')) {
         return `Destaca tus proyectos con Next.js App Router y SSR. Menciona cómo mejoraste el performance en Vercel. Usa la plantilla de CV enfocada en Frontend para ${company}.`;
     }
     if (pos.includes('back') || pos.includes('node') || pos.includes('sql')) {
         return `Enfócate en tu experiencia con PostgreSQL, Supabase y diseño de APIs. Omite las habilidades de UI/UX para no diluir tu perfil técnico backend.`;
     }
     if (pos.includes('architect') || pos.includes('arquitecto')) {
         return `Resalta tu experiencia en diseño de sistemas escalables, toma de decisiones técnicas y liderazgo de proyectos cloud. ${company} busca visión a largo plazo.`;
     }
     return `Ajusta el resumen de tu perfil para hacer match con los valores de ${company}. Resalta tu capacidad de adaptación y stack full-stack (Next.js + Postgres).`;
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="text-cyan-400 hover:text-cyan-300 font-bold transition text-xs uppercase tracking-wider bg-cyan-900/30 px-3 py-1.5 rounded-lg border border-cyan-500/30"
      >
        Ver Detalle
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm text-left">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gray-800/30">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{job.position}</h2>
                <p className="text-cyan-400 font-medium text-sm">@ {job.company}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Grid de info básica */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Fecha de Postulación</p>
                  <p className="text-white text-sm font-medium">
                    {new Date(job.created_at).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Estatus Actual</p>
                  <p className="text-white text-sm font-medium">{job.status}</p>
                </div>
              </div>

              {/* Info de la vacante */}
              <div className="space-y-3">
                <h3 className="text-sm text-gray-400 uppercase tracking-wider font-bold">Detalles de la Vacante</h3>
                {job.url && (
                  <p className="text-sm">
                    <a href={job.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1 font-medium">
                      🔗 Ver publicación original
                    </a>
                  </p>
                )}
                {job.salary && <p className="text-sm text-gray-300">💰 <strong>Salario:</strong> {job.salary}</p>}
                {job.notes && (
                  <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 text-sm text-gray-300 leading-relaxed">
                    {job.notes}
                  </div>
                )}
                {!job.url && !job.salary && !job.notes && (
                  <p className="text-sm text-gray-500 italic">No hay detalles adicionales guardados para esta vacante.</p>
                )}
              </div>

              {/* CV Sugerido (IA) */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-5 mt-2">
                <h3 className="text-md font-bold text-yellow-400 mb-2 flex items-center gap-2">
                  🪄 CV Sugerido por IA
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  {getSuggestedCV(job.position, job.company)}
                </p>
                <button className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-bold rounded-lg transition border border-yellow-500/30">
                  Descargar CV Optimizado (Próximamente)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
