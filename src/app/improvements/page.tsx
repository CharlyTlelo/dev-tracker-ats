import Link from 'next/link';

export default function Improvements() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            <span className="text-yellow-400">Improvements</span> 🚀
          </h1>
          <p className="text-sm text-gray-400">Recomendaciones personalizadas para tu CV y LinkedIn basadas en tus vacantes.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/dashboard" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition border border-gray-700 text-center w-full md:w-auto">
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto space-y-6">
        
        {/* Banner de IA */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 flex items-start gap-4">
          <div className="text-3xl">✨</div>
          <div>
            <h2 className="text-lg font-bold text-yellow-400 mb-1">Análisis de IA Activo</h2>
            <p className="text-sm text-gray-300">
              He analizado las vacantes guardadas en tu ATS contra tu perfil actual. Aquí tienes las áreas de oportunidad más importantes para destacar ante los reclutadores.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CV Improvements */}
          <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              📄 Ajustes para tu CV
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">Destacar Arquitectura Cloud</h4>
                  <p className="text-xs text-gray-400 mt-1">El 80% de tus vacantes piden AWS o Azure. Asegúrate de incluir logros específicos sobre despliegues escalables, no solo mencionarlo en la lista de skills.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">Métricas de Impacto</h4>
                  <p className="text-xs text-gray-400 mt-1">Cambia "Desarrollé una API en Next.js" por "Reduje el tiempo de carga un 40% migrando a Next.js App Router".</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">⚠</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">Falta testing (Pruebas)</h4>
                  <p className="text-xs text-gray-400 mt-1">Varias posiciones Senior exigen Jest o Cypress. Agrega una línea sobre cómo implementaste TDD o mejoraste la cobertura de código.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* LinkedIn Improvements */}
          <section className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              💼 Estrategia LinkedIn
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-blue-400 mt-0.5">▪</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">Titular Optimizadado (SEO)</h4>
                  <p className="text-xs text-gray-400 mt-1">Tu titular actual es bueno, pero prueba: "Senior Software Architect | Next.js & PostgreSQL | Construyendo productos escalables".</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 mt-0.5">▪</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">Palabras Clave en el 'Acerca de'</h4>
                  <p className="text-xs text-gray-400 mt-1">Los reclutadores de OCC buscan "Liderazgo técnico" y "Microservicios". Añade un párrafo breve sobre tu experiencia liderando decisiones técnicas.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 mt-0.5">▪</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">Proyecto Destacado</h4>
                  <p className="text-xs text-gray-400 mt-1">Fija (Pin) este mismo proyecto (Dev Tracker ATS) en la sección de Destacados de tu LinkedIn. Demuestra iniciativa y dominio del stack.</p>
                </div>
              </li>
            </ul>
          </section>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-8">
          <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-bold transition shadow-lg shadow-yellow-500/20">
            Generar PDF con mi nuevo CV 🪄
          </button>
        </div>

      </main>
    </div>
  );
}
