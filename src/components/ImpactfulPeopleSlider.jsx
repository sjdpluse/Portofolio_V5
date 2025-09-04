import React, { useState, useEffect, useMemo, memo } from 'react';
import { supabase } from "../supabaseClient";
import { Loader2, AlertTriangle, X } from 'lucide-react';

const ImpactfulPeopleSlider = memo(() => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('impactful_people')
          .select('*')
          .order('id', { ascending: true });

        if (dbError) {
          throw dbError;
        }
        setPeople(data || []);
      } catch (err) {
        setError('Failed to load data. Check Supabase table "impactful_people" and RLS policies.');
        console.error("Error fetching impactful people:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  const [peopleCol1, peopleCol2, peopleCol3, peopleCol4, peopleCol5, peopleCol6] = useMemo(() => {
    if (people.length === 0) return [[], [], [], [], [], []];
    
    // Shuffle the array once to create a base order
    const baseShuffle = [...people].sort(() => 0.5 - Math.random());

    // Create rotated versions for each column to ensure variety and reduce repetition
    const createColumn = (offset) => {
      if (people.length === 0) return [];
      const effectiveOffset = offset % people.length;
      return [...baseShuffle.slice(effectiveOffset), ...baseShuffle.slice(0, effectiveOffset)];
    };

    // Generate 6 columns, each starting with a different person
    return Array.from({ length: 6 }, (_, i) => createColumn(i));
  }, [people]);

  const handleCardClick = (person) => {
    setSelectedPerson(person);
  };

  const handleCloseDetail = () => {
    setSelectedPerson(null);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 my-8 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (people.length === 0) {
    return null; // اگر داده‌ای وجود نداشت، چیزی نمایش داده نمی‌شود
  }

  return (
    <div className="mt-16" data-aos="fade-up" data-aos-duration="1000">
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Inspirations on My Journey
        </h3>
        <p className="mt-2 text-gray-400 text-sm">A tribute to the mentors and guides who have shaped my path.</p>
      </div>
      
      <div className="relative bg-gray-900/30 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-white/10 overflow-hidden min-h-[380px] md:min-h-[420px] flex items-center justify-center transition-all duration-500">
        <div className="absolute inset-0 -z-10">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-l from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-spin-slower"></div>
        </div>
        {selectedPerson ? (
          <div className="relative w-full animate-fade-in">
            <button 
              onClick={handleCloseDetail} 
              className="absolute -top-5 -right-5 z-20 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors"
              aria-label="Close detail view"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-48 h-56 md:w-56 md:h-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-500">
                <img src={selectedPerson.image_url} alt={selectedPerson.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="text-center md:text-left animate-blurry-in">
                <h3 className="text-3xl font-bold text-white mb-2">{selectedPerson.name}</h3>
                <p className="text-lg font-medium text-indigo-300 mb-4">{selectedPerson.role}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedPerson.impact_description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative group h-96 w-full max-w-6xl mx-auto overflow-x-auto overflow-y-hidden [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] custom-horizontal-scrollbar">
            <div className="flex justify-start md:justify-center gap-2 md:gap-4 h-full min-w-max">
              {/* Columns */}
              {[peopleCol1, peopleCol2, peopleCol3, peopleCol4, peopleCol5, peopleCol6].map((col, colIndex) => (
                <div
                  key={colIndex}
                  className={`flex flex-col gap-2 md:gap-4 group-hover:[animation-play-state:paused] ${colIndex % 2 === 0 ? 'animate-scroll-up' : 'animate-scroll-down'}`}
                  style={{ animationDuration: `${people.length * (2.5 + Math.random())}s` }}
                >
                  {[...col, ...col].map((person, index) => (
                    <div key={`${colIndex}-${person.id}-${index}`} onClick={() => handleCardClick(person)} className="relative group/card w-24 h-36 md:w-40 md:h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0 transition-transform duration-300 hover:!scale-105 hover:shadow-indigo-500/30">
                      <img src={person.image_url} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-2 md:p-3 text-left">
                        <h3 className="text-white font-bold text-sm md:text-base drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-100">{person.name}</h3>
                        <p className="text-indigo-300 text-[10px] md:text-xs font-medium drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-200">{person.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ImpactfulPeopleSlider;