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
    education: '',
    linkedin: '',
    github: '',
    portfolio: ''
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
        
        let socialLinks = { linkedin: '', github: '', portfolio: '' };
        if (data.social_links) {
          try {
            socialLinks = typeof data.social_links === 'string' ? JSON.parse(data.social_links) : data.social_links;
          } catch (e) {}
        }

        setFormData({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          skills: data.skills ? data.skills.join(', ') : '',
          experience: typeof data.experience === 'string' ? data.experience : (data.experience ? JSON.stringify(data.experience, null, 2) : ''),
          education: typeof data.education === 'string' ? data.education : (data.education ? JSON.stringify(data.education, null, 2) : ''),
          linkedin: socialLinks.linkedin || '',
          github: socialLinks.github || '',
          portfolio: socialLinks.portfolio || ''
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

    // Título y Nombre
    doc.setFontSize(22);
    doc.text(formData.name || 'Currículum Vitae', 20, yOffset);
    yOffset += 10;
    
    doc.setFontSize(16);
    doc.text(formData.title || 'Perfil Maestro', 20, yOffset);
    yOffset += 15;

    // Foto de perfil
    if (photoBase64) {
      const isPng = photoBase64.startsWith('data:image/png');
      const format = isPng ? 'PNG' : 'JPEG';
      
      const imgProps = doc.getImageProperties(photoBase64);
      const ratio = imgProps.width / imgProps.height;
      
      const maxWidth = 40;
      const maxHeight = 45;
      
      let finalWidth = maxWidth;
      let finalHeight = finalWidth / ratio;
      
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = finalHeight * ratio;
      }

      const xPos = 190 - finalWidth;
      
      doc.addImage(photoBase64, format, xPos, 10, finalWidth, finalHeight);
    }
    
    // Bio
    if (formData.bio) {
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const splitBio = doc.splitTextToSize(formData.bio, photoBase64 ? 120 : 170);
      doc.text(splitBio, 20, yOffset);
      yOffset += (splitBio.length * 5) + 8;
    }

    // Enlaces Sociales
    if (formData.linkedin || formData.github || formData.portfolio) {
      doc.setFontSize(10);
      doc.setTextColor(0, 102, 204); // Color link
      let linksText = '';
      if (formData.linkedin) linksText += `LinkedIn: ${formData.linkedin}   `;
      if (formData.github) linksText += `GitHub: ${formData.github}   `;
      if (formData.portfolio) linksText += `Portfolio: ${formData.portfolio}`;
      
      doc.text(linksText, 20, yOffset);
      yOffset += 8;
    }
    doc.setTextColor(50, 50, 50);

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

      const lines = formData.experience.split('\n');
      
      lines.forEach((line) => {
        if (yOffset > 275) {
          doc.addPage();
          yOffset = 20;
        }
        
        const text = line.trim();
        if (!text) {
          yOffset += 4;
          return;
        }

        if (text.startsWith('### ')) {
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          const cleanText = text.replace('### ', '');
          const splitText = doc.splitTextToSize(cleanText, 170);
          doc.text(splitText, 20, yOffset);
          yOffset += (splitText.length * 5) + 3;
        } else if (text.startsWith('## ')) {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          const cleanText = text.replace('## ', '');
          const splitText = doc.splitTextToSize(cleanText, 170);
          doc.text(splitText, 20, yOffset);
          yOffset += (splitText.length * 5) + 4;
        } else if (text.startsWith('# ')) {
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          const cleanText = text.replace('# ', '');
          const splitText = doc.splitTextToSize(cleanText, 170);
          doc.text(splitText, 20, yOffset);
          yOffset += (splitText.length * 5) + 5;
        } else if (text.startsWith('- ') || text.startsWith('* ')) {
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
          const cleanText = '• ' + text.substring(2);
          const splitText = doc.splitTextToSize(cleanText, 165);
          doc.text(splitText, 25, yOffset);
          yOffset += (splitText.length * 5) + 2;
        } else {
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
          const splitText = doc.splitTextToSize(text, 170);
          doc.text(splitText, 20, yOffset);
          yOffset += (splitText.length * 5) + 2;
        }
      });
    }

    // Educación
    if (formData.education) {
      if (yOffset > 260) {
        doc.addPage();
        yOffset = 20;
      } else {
        yOffset += 5;
      }
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Educación", 20, yOffset);
      yOffset += 10;

      const lines = formData.education.split('\n');
      
      lines.forEach((line) => {
        if (yOffset > 275) {
          doc.addPage();
          yOffset = 20;
        }
        
        const text = line.trim();
        if (!text) {
          yOffset += 4;
          return;
        }

        if (text.startsWith('## ')) {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          const cleanText = text.replace('## ', '');
          const splitText = doc.splitTextToSize(cleanText, 170);
          doc.text(splitText, 20, yOffset);
          yOffset += (splitText.length * 5) + 4;
        } else if (text.startsWith('- ') || text.startsWith('* ')) {
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
          const cleanText = '• ' + text.substring(2);
          const splitText = doc.splitTextToSize(cleanText, 165);
          doc.text(splitText, 25, yOffset);
          yOffset += (splitText.length * 5) + 2;
        } else {
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
          const splitText = doc.splitTextToSize(text, 170);
          doc.text(splitText, 20, yOffset);
          yOffset += (splitText.length * 5) + 2;
        }
      });
    }

    doc.save(`CV_${formData.name ? formData.name.replace(/ /g, '_') : 'Perfil_Maestro'}.pdf`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      skills: skillsArray,
      experience: formData.experience,
      education: formData.education,
      photo_url: photoBase64,
      social_links: {
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio
      },
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
        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700/50 pb-2">Identidad y Contacto</h2>
        
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
                🧑💻
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

        {/* REDES SOCIALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">LinkedIn URL</label>
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="https://linkedin.com/in/tu-perfil" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">GitHub URL</label>
            <input name="github" value={formData.github} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="https://github.com/tu-usuario" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Portfolio / Web</label>
            <input name="portfolio" value={formData.portfolio} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" placeholder="https://tu-sitio.com" />
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
        <p className="text-sm text-gray-400 mb-2">Usa texto normal. Puedes usar <strong>##</strong> para Títulos de puestos, <strong>###</strong> para empresas o subtítulos y <strong>-</strong> para listas de logros.</p>
        <textarea name="experience" value={formData.experience} onChange={handleChange} rows={12} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 font-sans text-sm" placeholder="## Senior Frontend Developer&#10;### TechCorp Inc. (2020 - Presente)&#10;- Lideré la migración a Next.js&#10;- Mejoré el rendimiento en un 40%" />
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