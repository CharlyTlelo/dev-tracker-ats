'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function WorkAnalysisForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    
    // Aquí (en el futuro) llamaremos a una API de OpenAI/Gemini para que lea el HTML real.
    // Por ahora, simulamos el análisis para que veas el flujo:
    setTimeout(() => {
      setAnalysis({
        company: url.includes('occ') ? 'Empresa OCC' : 'Empresa Tech',
        position: 'Senior Software Engineer / Architect',
        match: 85,
        salary: '$80,000 - $120,000 MXN',
        requirements: ['Next.js', 'React', 'PostgreSQL', 'Arquitectura Cloud'],
        notes: `Vacante interesante extraída de ${url}. Ideal para tu perfil técnico en Frontend y Backend.`
      });
      setLoading(false);
    }, 2000);
  };

  const handleSaveToAts = async () => {
    if (!analysis) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('jobs')
      .insert([{ 
        company: analysis.company, 
        position: analysis.position, 
        status: 'Aplicado',
        url: url,
        salary: analysis.salary,
        notes: analysis.notes
      }]);

    setSaving(false);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('¡Vacante guardada en tu Dashboard!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Caja de Input */}
      <form onSubmit={handleAnalyze} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 flex flex-col md:flex-row gap-4">
        <input 
          type="url" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Pega aquí la URL (Ej. de OCC, Computrabajo, LinkedIn...)" 
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
          required
        />
        <button 
          type="submit" 
          disabled={loading || !url}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-gray-900 rounded-lg font-bold transition disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Analizando... 🔍' : 'Analizar Vacante ⚡'}
        </button>
      </form>

      {/* Resultado del Análisis */}
      {analysis && (
        <div className="bg-gray-800/30 rounded-xl border border-cyan-500/30 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-gray-700/50 flex justify-between items-center bg-cyan-900/20">
            <div>
              <h2 className="text-xl font-bold text-white">{analysis.position}</h2>
              <p className="text-sm text-cyan-400 font-medium">@ {analysis.company}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">{analysis.match}%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Match Score</div>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-3">Requisitos Clave</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.requirements.map((req: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gray-900 text-gray-300 rounded-full text-sm border border-gray-700">
                    {req}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Salario Estimado</h3>
                <p className="text-white font-medium">{analysis.salary}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Notas de IA</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{analysis.notes}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-700/50 bg-gray-800/50 flex justify-end">
            <button 
              onClick={handleSaveToAts}
              disabled={saving}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : '📥 Guardar en mi ATS'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
