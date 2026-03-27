'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Campos de formulario base
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    skills: '',
    experience: '',
    education: ''
  });

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .single();
        
      if (data) {
        setProfileId(data.id);
        setFormData({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          skills: data.skills ? data.skills.join(', ') : '',
          experience: typeof data.experience === 'string' ? data.experience : JSON.stringify(data.experience, null, 2) || '',
          education: typeof data.education === 'string' ? data.education : JSON.stringify(data.education, null, 2) || ''
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Convertimos skills de string a arreglo limpio
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

    let xpJson = [];
    let eduJson = [];
    try {
        xpJson = formData.experience ? JSON.parse(formData.experience) : [];
        eduJson = formData.education ? JSON.parse(formData.education) : [];
    } catch (err) {
        // Fallback if not valid JSON, save as text array inside JSON or just let it fail gracefully.
        alert('Advertencia: El formato de Experiencia/Educación no es JSON válido (por ahora guárdalo como texto entre corchetes [] o usa comillas). Se intentará guardar como string.');
    }

    const payload = {
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      skills: skillsArray,
      // Para esta versión sencilla, si falla el parseo lo guardamos como texto plano en jsonb:
      experience: xpJson,
      education: eduJson,
      updated_at: new Date()
    };

    if (profileId) {
      const { error } = await supabase.from('profile').update(payload).eq('id', profileId);
      if (error) alert('Error: ' + error.message);
      else alert('¡Perfil actualizado con éxito! 🪄');
    } else {
      const { data, error } = await supabase.from('profile').insert([payload]).select().single();
      if (error) alert('Error: ' + error.message);
      else {
        alert('¡Perfil creado con éxito! 🪄');
        setProfileId(data.id);
      }
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center text-gray-500 py-10">Cargando tu perfil... 🧠</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700/50 pb-2">Identidad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Nombre Completo</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="Ej. Carlos Tlelo" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Título Profesional</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="Ej. Senior Software Architect" />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Acerca de Mí (Bio)</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="Tu elevator pitch. ¿Quién eres, qué sabes hacer y qué te apasiona?" />
        </div>
        
        <div className="mt-4">
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Habilidades Clave (Skills)</label>
          <textarea name="skills" value={formData.skills} onChange={handleChange} rows={2} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="Ej. React, Next.js, PostgreSQL, Arquitectura Cloud, Liderazgo (separados por coma)" />
        </div>
      </div>

      {/* Experiencia */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700/50 pb-2">Experiencia Laboral</h2>
        <p className="text-sm text-gray-400 mb-2">Pega aquí tu historial completo (empresas, años, logros). La IA extraerá lo más importante después.</p>
        <textarea name="experience" value={formData.experience} onChange={handleChange} rows={6} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 font-mono text-xs" placeholder='[{"empresa": "Ejemplo", "puesto": "Sr Dev", "años": "2020-2023", "logros": "Mencionaré que hice X y Y..."}]' />
      </div>

      {/* Botón de Guardar */}
      <div className="flex justify-end sticky bottom-4 z-10">
        <button 
          type="submit" 
          disabled={saving}
          className="px-8 py-3.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-lg transition shadow-2xl shadow-purple-500/40 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Guardando Perfil...' : '💾 Guardar mi Perfil Maestro'}
        </button>
      </div>
    </form>
  );
}
