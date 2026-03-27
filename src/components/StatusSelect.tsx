'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function StatusSelect({ jobId, currentStatus }: { jobId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', jobId);

    setLoading(false);

    if (error) {
      alert('Error al actualizar: ' + error.message);
      setStatus(currentStatus); // revertir si falla
    } else {
      router.refresh(); // recarga la página en el fondo para actualizar contadores
    }
  };

  // Determinar colores
  let colorClass = 'bg-gray-800 text-gray-300 border-gray-700';
  if (status === 'Aplicado') colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  else if (status === 'En Proceso / Docs') colorClass = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  else if (status === 'Oferta Recibida') colorClass = 'bg-green-500/10 text-green-400 border-green-500/20';
  else if (status === 'Rechazado') colorClass = 'bg-red-500/10 text-red-400 border-red-500/20';

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer text-center transition ${colorClass} ${loading ? 'opacity-50' : 'hover:brightness-125'}`}
    >
      <option value="Aplicado" className="bg-gray-900 text-white">Aplicado</option>
      <option value="En Proceso / Docs" className="bg-gray-900 text-white">En Proceso / Docs</option>
      <option value="Oferta Recibida" className="bg-gray-900 text-white">Oferta Recibida</option>
      <option value="Rechazado" className="bg-gray-900 text-white">Rechazado</option>
    </select>
  );
}
