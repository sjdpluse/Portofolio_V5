import React, { useEffect, memo, useMemo, useState } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, UserCheck, Loader2, AlertTriangle, X, ChevronLeft, ChevronRight } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { supabase } from "../supabaseClient"; // اتصال به سوپابیس


// Memoized Components
const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2 
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]" 
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        About Me
      </h2>
    </div>
    <p 
      className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 text-purple-400" />
      Creating value through technology and creativity
      <Sparkles className="w-5 h-5 text-purple-400" />
    </p>
  </div>
));

const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div 
      className="relative group" 
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Optimized gradient backgrounds with reduced complexity for mobile */}
      <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-full blur-2xl animate-spin-slower" />
        <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 rounded-full blur-2xl animate-float opacity-50" />
      </div>

      <div className="relative">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)] transform transition-all duration-700 group-hover:scale-105">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />
          
          {/* Optimized overlay effects - disabled on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-blue-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />
          
          <img
            src="/Photo.jpg"
            alt="Profile"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
          />

          {/* Advanced hover effects - desktop only */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
            <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <span 
          className="text-4xl font-bold text-white"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {value}
        </span>
      </div>

      <div>
        <p 
          className="text-sm uppercase tracking-wider text-gray-300 mb-2"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p 
            className="text-xs text-gray-400"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

const ImpactfulPeopleSlider = memo(() => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
    // Create six different shuffles for variety to minimize visible repetition
    const shuffled1 = [...people].sort(() => 0.5 - Math.random());
    const shuffled2 = [...people].sort(() => 0.5 - Math.random());
    const shuffled3 = [...people].sort(() => 0.5 - Math.random());
    const shuffled4 = [...people].sort(() => 0.5 - Math.random());
    const shuffled5 = [...people].sort(() => 0.5 - Math.random());
    const shuffled6 = [...people].sort(() => 0.5 - Math.random());
    return [shuffled1, shuffled2, shuffled3, shuffled4, shuffled5, shuffled6];
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
      
      <div className="relative bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 overflow-hidden min-h-[420px] flex items-center justify-center transition-all duration-500">
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
          <div className="relative group h-96 w-full max-w-6xl mx-auto overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]">
            <div className="flex justify-center gap-4 h-full">
              {/* Column 1: Scrolling Up */}
              <div className="flex flex-col gap-4 animate-scroll-up group-hover:[animation-play-state:paused]" style={{ animationDuration: `${people.length * 5.2}s` }}>
                {[...peopleCol1, ...peopleCol1].map((person, index) => (
                  <div key={`col1-${person.id}-${index}`} onClick={() => handleCardClick(person)} className="relative group/card w-40 h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0 transition-transform duration-300 hover:!scale-105 hover:shadow-indigo-500/30">
                    <img src={person.image_url} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 text-left">
                      <h3 className="text-white font-bold text-base drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-100">{person.name}</h3>
                      <p className="text-indigo-300 text-xs font-medium drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-200">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Column 2: Scrolling Down */}
              <div className="flex flex-col gap-4 animate-scroll-down group-hover:[animation-play-state:paused]" style={{ animationDuration: `${people.length * 6.1}s` }}>
                {[...peopleCol2, ...peopleCol2].map((person, index) => (
                   <div key={`col2-${person.id}-${index}`} onClick={() => handleCardClick(person)} className="relative group/card w-40 h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0 transition-transform duration-300 hover:!scale-105 hover:shadow-indigo-500/30">
                    <img src={person.image_url} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 text-left">
                      <h3 className="text-white font-bold text-base drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-100">{person.name}</h3>
                      <p className="text-indigo-300 text-xs font-medium drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-200">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Column 3: Scrolling Up (hidden on small screens) */}
              <div className="hidden sm:flex flex-col gap-4 animate-scroll-up group-hover:[animation-play-state:paused]" style={{ animationDuration: `${people.length * 5.5}s` }}>
                {[...peopleCol3, ...peopleCol3].map((person, index) => (
                  <div key={`col3-${person.id}-${index}`} onClick={() => handleCardClick(person)} className="relative group/card w-40 h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0 transition-transform duration-300 hover:!scale-105 hover:shadow-indigo-500/30">
                    <img src={person.image_url} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 text-left">
                      <h3 className="text-white font-bold text-base drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-100">{person.name}</h3>
                      <p className="text-indigo-300 text-xs font-medium drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-200">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Column 4: Scrolling Down (hidden on medium screens) */}
              <div className="hidden md:flex flex-col gap-4 animate-scroll-down group-hover:[animation-play-state:paused]" style={{ animationDuration: `${people.length * 6.3}s` }}>
                {[...peopleCol4, ...peopleCol4].map((person, index) => (
                   <div key={`col4-${person.id}-${index}`} onClick={() => handleCardClick(person)} className="relative group/card w-40 h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0 transition-transform duration-300 hover:!scale-105 hover:shadow-indigo-500/30">
                    <img src={person.image_url} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 text-left">
                      <h3 className="text-white font-bold text-base drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-100">{person.name}</h3>
                      <p className="text-indigo-300 text-xs font-medium drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-200">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Column 5: Scrolling Up (hidden on large screens) */}
              <div className="hidden lg:flex flex-col gap-4 animate-scroll-up group-hover:[animation-play-state:paused]" style={{ animationDuration: `${people.length * 4.8}s` }}>
                {[...peopleCol5, ...peopleCol5].map((person, index) => (
                  <div key={`col5-${person.id}-${index}`} onClick={() => handleCardClick(person)} className="relative group/card w-40 h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0 transition-transform duration-300 hover:!scale-105 hover:shadow-indigo-500/30">
                    <img src={person.image_url} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 text-left">
                      <h3 className="text-white font-bold text-base drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-100">{person.name}</h3>
                      <p className="text-indigo-300 text-xs font-medium drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-200">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Column 6: Scrolling Down (hidden on xl screens) */}
              <div className="hidden xl:flex flex-col gap-4 animate-scroll-down group-hover:[animation-play-state:paused]" style={{ animationDuration: `${people.length * 5.8}s` }}>
                {[...peopleCol6, ...peopleCol6].map((person, index) => (
                  <div key={`col6-${person.id}-${index}`} onClick={() => handleCardClick(person)} className="relative group/card w-40 h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0 transition-transform duration-300 hover:!scale-105 hover:shadow-indigo-500/30">
                    <img src={person.image_url} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 text-left">
                      <h3 className="text-white font-bold text-base drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-100">{person.name}</h3>
                      <p className="text-indigo-300 text-xs font-medium drop-shadow-md transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-200">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const AboutPage = () => {
  // Memoized calculations
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
    
    const startDate = new Date("2021-11-06");
    const today = new Date();
    const experience = today.getFullYear() - startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects: storedProjects.length,
      totalCertificates: storedCertificates.length,
      YearExperience: experience
    };
  }, []);

  // Optimized AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: false, 
      });
    };

    initAOS();
    
    // Debounced resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#6366f1] to-[#a855f7]",
      value: totalProjects,
      label: "Total Projects",
      description: "Innovative web solutions crafted",
      animation: "fade-right",
    },
    {
      icon: Award,
      color: "from-[#a855f7] to-[#6366f1]",
      value: totalCertificates,
      label: "Certificates",
      description: "Professional skills validated",
      animation: "fade-up",
    },
    {
      icon: Globe,
      color: "from-[#6366f1] to-[#a855f7]",
      value: YearExperience,
      label: "Years of Experience",
      description: "Continuous learning journey",
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0" 
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                Hello, I'm
              </span>
              <span 
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
                Sajad Mohammadi
              </span>
            </h2>
            
            <p 
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
             Dynamic and results-driven professional with a diverse background in Computer Science, Graphic Design, IT Training, and Business Management. Demonstrates a proven ability to lead teams, develop innovative digital solutions, and drive operational efficiency across technical and managerial domains. Experienced in teaching, creative design, and implementing impactful IT strategies. Bilingual in English and Dari/Farsi, with exceptional communication, leadership, and problem-solving skills.
            </p>

               {/* Quote Section */}
      <div 
        className="relative bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 border border-gradient-to-r border-[#6366f1]/30 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
        data-aos="fade-up"
        data-aos-duration="1700"
      >
        {/* Floating orbs background */}
        <div className="absolute top-2 right-4 w-16 h-16 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-gradient-to-r from-[#a855f7]/20 to-[#6366f1]/20 rounded-full blur-lg"></div>
        
        {/* Quote icon */}
        <div className="absolute top-3 left-4 text-[#6366f1] opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
        </div>
        
        <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
          "Utilizing AI to augment human potential, not replace it."
        </blockquote>
      </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 lg:px-0 w-full">
              <a href="https://drive.google.com/drive/folders/1sXOjRPlQOK6IGUC-6BpLXFUO6j-g2BFG?dmr=1&ec=wgc-drive-hero-goto" className="w-full lg:w-auto">
              <button 
                data-aos="fade-up"
                data-aos-duration="800"
                className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 shadow-lg hover:shadow-xl "
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Download CV
              </button>
              </a>
              <a href="#Portofolio" className="w-full lg:w-auto">
              <button 
                data-aos="fade-up"
                data-aos-duration="1000"
                className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-[#a855f7]/50 text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-[#a855f7]/10 "
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5" /> View Projects
              </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        <ImpactfulPeopleSlider />

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slower {
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 8s linear infinite;
        }
        @keyframes blurry-in {
          from {
            filter: blur(5px);
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            filter: blur(0);
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-blurry-in {
          animation: blurry-in 0.7s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out forwards;
        }
        @keyframes scroll-up {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .animate-scroll-up {
          animation: scroll-up linear infinite;
        }
        @keyframes scroll-down {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }
        .animate-scroll-down {
          animation: scroll-down linear infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);