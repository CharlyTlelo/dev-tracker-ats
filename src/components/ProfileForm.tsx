'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { jsPDF } from 'jspdf';

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

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
        if (data.photo_url) {
           setPhotoBase64(data.photo_url);
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCV = () => {
    const doc = new jsPDF();
    let yOffset = 20;

    // Dibujar fondo oscuro en la cabecera (opcional, para darle más estilo ATS moderno)
    // doc.setFillColor(30, 41, 59);
    // doc.rect(0, 0, 210, 45, 'F');

    // Título y Nombre
    doc.setFontSize(22);
    // doc.setTextColor(255, 255, 255);
    doc.text(formData.name || 'Currículum Vitae', 20, yOffset);
    yOffset += 10;
    
    doc.setFontSize(16);
    doc.text(formData.title || 'Perfil Maestro', 20, yOffset);
    yOffset += 15;

    // Foto de perfil
    if (photoBase64) {
      // Intentar detectar si es PNG o JPEG basado en el data URL
      const isPng = photoBase64.startsWith('data:image/png');
      const format = isPng ? 'PNG' : 'JPEG';
      
      // Obtener proporciones reales de la imagen para no deformarla
      const imgProps = doc.getImageProperties(photoBase64);
      const ratio = imgProps.width / imgProps.height;
      
      // Definir un área máxima (ej. 40x50)
      const maxWidth = 40;
      const maxHeight = 45;
      
      let finalWidth = maxWidth;
      let finalHeight = finalWidth / ratio;
      
      // Si la altura calculada se pasa del máximo, ajustamos basados en la altura
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = finalHeight * ratio;
      }

      // Alinearla a la derecha (margen derecho en x = 190)
      const xPos = 190 - finalWidth;
      
      doc.addImage(photoBase64, format, xPos, 10, finalWidth, finalHeight);
    }
    
    // Bio
    if (formData.bio) {
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const splitBio = doc.splitTextToSize(formData.bio, photoBase64 ? 120 : 170);
      doc.text(splitBio, 20, yOffset);
      yOffset += (splitBio.length * 5) + 10;
    }

    // Asegurar que bajamos debajo de la foto si la bio fue muy corta
    if (photoBase64 && yOffset < 60) {
      yOffset = 60;
    }

    // Skills
    if (formData.skills) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Habilidades Clave", 20, yOffset);
      yOffset += 8;
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const splitSkills = doc.splitTextToSize(formData.skills, 170);
      doc.text(splitSkills, 20, yOffset);
      yOffset += (splitSkills.length * 5) + 10;
    }

    // Experiencia
    if (formData.experience) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Experiencia Laboral", 20, yOffset);
      yOffset += 10;

      try {
        const expArray = JSON.parse(formData.experience);
        expArray.forEach((job: any) => {
          if (yOffset > 270) {
            doc.addPage();
            yOffset = 20;
          }
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          const puestoTitle = `${job.puesto || ''} | ${job.empresa || ''}`;
          doc.text(puestoTitle, 20, yOffset);
          yOffset += 6;
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(job.periodo || '', 20, yOffset);
          doc.setTextColor(50, 50, 50);
          yOffset += 8;

          if (job.logros && Array.isArray(job.logros)) {
            job.logros.forEach((logro: string) => {
              if (yOffset > 280) {
                doc.addPage();
                yOffset = 20;
              }
              const splitLogro = doc.splitTextToSize(`• ${logro}`, 170);
              doc.text(splitLogro, 20, yOffset);
              yOffset += (splitLogro.length * 5) + 2;
            });
          }
          yOffset += 6;
        });
      } catch (e) {
        // Fallback si no es un array JSON válido
        const splitExp = doc.splitTextToSize(formData.experience, 170);
        doc.setFontSize(10);
        doc.text(splitExp, 20, yOffset);
      }
    }

    doc.save(`CV_${formData.name ? formData.name.replace(/ /g, '_') : 'Perfil_Maestro'}.pdf`);
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
        // Fallback si no es JSON válido
    }

    const payload = {
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      skills: skillsArray,
      experience: xpJson,
      education: eduJson,
      photo_url: photoBase64,
      updated_at: new Date()
    };

    if (profileId) {
      const { error } = await supabase.from('profile').update(payload).eq('id', profileId);
      if (error) alert('Error al guardar: ' + error.message);
      else alert('¡Perfil guardado con éxito! 🪄');
    } else {
      const { data, error } = await supabase.from('profile').insert([payload]).select().single();
      if (error) alert('Error al crear perfil: ' + error.message);
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
        
        {/* FOTO DE PERFIL */}
        <div className="mb-6">
          <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Foto para el CV</label>
          <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700 border-dashed">
            {photoBase64 ? (
              <div className="relative">
                <img src={photoBase64} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-gray-600 shadow-lg" />
                <button 
                  type="button"
                  onClick={() => setPhotoBase64(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-3xl">
                🧑‍💻
              </div>
            )}
            <div className="flex-1">
              <input 
                type="file" 
                accept="image/png, image/jpeg" 
                onChange={handleImageUpload} 
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30 cursor-pointer" 
              />
              <p className="text-xs text-gray-500 mt-2">Formatos aceptados: PNG, JPG (Se incrustará en la esquina superior derecha del PDF)</p>
            </div>
          </div>
        </div>

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

      {/* Botones */}
      <div className="flex justify-end gap-4 sticky bottom-4 z-10">
        <button 
          type="button" 
          onClick={downloadCV}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition shadow-2xl shadow-blue-500/40 flex items-center gap-2"
        >
          📄 Descargar CV (PDF)
        </button>
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