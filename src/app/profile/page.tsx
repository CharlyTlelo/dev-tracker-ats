import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            <span className="text-purple-400">Mi Perfil Maestro</span> 👤
          </h1>
          <p className="text-sm text-gray-400">Tu fuente de la verdad. Llena esto una vez y la IA lo usará para armar CVs perfectos.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/dashboard" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition border border-gray-700 text-center w-full md:w-auto">
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <ProfileForm />
      </main>
    </div>
  );
}
