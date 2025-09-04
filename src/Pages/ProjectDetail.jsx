import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../supabase'; // Path adjusted to match your project
import { Code, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      console.log('Fetching project with ID:', id);
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching from Supabase:', fetchError);
        setError('Project not found.');
      } else {
        console.log('Data received:', data);
        setProject(data);
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="text-center text-white p-10">Loading project...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">{error}</div>;
  }

  if (!project) {
    return <div className="text-center text-white p-10">Project not found.</div>;
  }

  console.log('Rendering project:', project);

  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 text-white animate-fade-in">
      <div className="mb-6">
        <RouterLink to="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
          <ArrowLeft size={18} />
          Back to Projects
        </RouterLink>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20">
        <img src={project.Img} alt={project.Title} className="w-full h-64 md:h-80 object-cover" />
        
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
            {project.Title}
          </h1>
          
          <p className="text-slate-300 leading-relaxed mb-8">
            {project.Description}
          </p>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-3">
                <CheckCircle className="text-green-400" />
                Key Features
              </h2>
              <ul className="list-none space-y-2 pl-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300">
                    <span className="text-purple-400 mt-1.5 text-xs">◆</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies Used */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-3">
                <Code className="text-blue-400" />
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="bg-slate-700/60 text-slate-200 text-sm font-medium px-4 py-1.5 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Live Link */}
          {project.Link && (
            <div className="mt-10 text-center">
              <a href={project.Link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg transition-all duration-300 transform hover:scale-105">
                <span>View Live Demo</span>
                <ExternalLink size={20} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;