import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar (Responsive) */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="text-xl font-bold tracking-tighter text-indigo-400">
          Charly.<span className="text-white">dev</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
          <Link href="#proyectos" className="hover:text-white transition">Proyectos</Link>
          <Link href="#skills" className="hover:text-white transition">Skills</Link>
          <Link href="/dashboard" className="hover:text-white transition">Panel Privado 🔒</Link>
        </div>
        <button className="md:hidden bg-gray-800 p-2 rounded text-sm font-bold">Menú</button>
      </nav>

      {/* Hero Section (Responsive) */}
      <main className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-900/30 rounded-full border border-indigo-500/20">
          En búsqueda de nuevos retos 🚀
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Construyendo Arquitecturas <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Escalables y Modernas.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl">
          Soy Charly, Arquitecto de Software y Desarrollador especializado en ecosistemas robustos, bases de datos y plataformas de alto rendimiento.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a href="/cv-carlos-tlelo.pdf" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 text-sm font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition shadow-lg shadow-indigo-500/30 text-center">
            Ver Mi CV
          </a>
          <a href="https://www.linkedin.com/in/carlos-tlelo/" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 text-sm font-bold bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition border border-gray-700 text-center">
            Contactar por LinkedIn
          </a>
        </div>
      </main>

      {/* Stats/Skills Section (Mobile Friendly Grid) */}
      <section id="skills" className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-white mb-2">+5</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Años de Exp.</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white mb-2">Next.js</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Frontend</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white mb-2">PostgreSQL</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Base de Datos</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white mb-2">Supabase</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Backend as a Service</div>
          </div>
        </div>
      </section>
    </div>
  );
}
