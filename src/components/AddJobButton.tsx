'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function AddJobButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const company = formData.get('company') as string;
    const position = formData.get('position') as string;
    const status = formData.get('status') as string;

    const { error } = await supabase
      .from('jobs')
      .insert([{ company, position, status }]);

    setLoading(false);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      setIsOpen(false);
      router.refresh(); // Recarga la página para mostrar el nuevo dato
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-bold text-white transition shadow-lg shadow-indigo-500/20 text-center w-full md:w-auto"
      >
        + Nueva Vacante
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Agregar Vacante</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Empresa</label>
                <input required name="company" type="text" placeholder="Ej. Kavak" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Puesto</label>
                <input required name="position" type="text" placeholder="Ej. Senior Next.js Developer" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Estatus</label>
                <select name="status" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                  <option value="Aplicado">Aplicado</option>
                  <option value="En Proceso / Docs">En Proceso / Docs</option>
                  <option value="Oferta Recibida">Oferta Recibida</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
