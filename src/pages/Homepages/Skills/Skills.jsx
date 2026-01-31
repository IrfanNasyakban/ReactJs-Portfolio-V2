import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Skills = () => {
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills();
  }, []);

  const getSkills = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_URL_API;
      const response = await axios.get(`${apiUrl}/all-skill`);
      
      if (response.data && response.data.length > 0) {
        const skillData = response.data[0]; // Get the first (and likely only) skill object
        
        // Transform API data into the format needed for display
        const transformedSkills = [
          {
            category: "Languages",
            skills: parseSkills(skillData.languages)
          },
          {
            category: "Databases",
            skills: parseSkills(skillData.databases)
          },
          {
            category: "Tools",
            skills: parseSkills(skillData.tools)
          },
          {
            category: "Frameworks",
            skills: parseSkills(skillData.frameworks)
          },
          {
            category: "Other",
            skills: parseSkills(skillData.other)
          }
        ].filter(item => item.skills.length > 0); // Filter out empty categories
        
        setSkillsData(transformedSkills);
        console.log("Skills data:", transformedSkills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to parse comma-separated skills
  const parseSkills = (skillsString) => {
    if (!skillsString) return [];
    return skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');
  };

  // Loading state
  if (loading) {
    return (
      <div id='skills' className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400 text-lg">Loading skills...</div>
        </div>
      </div>
    );
  }

  return (
    <div id='skills' className="max-w-7xl mx-auto mb-32 px-6 lg:px-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          <span className="text-purple-500">#</span>skills
        </h2>
        <div className="h-[1px] bg-purple-500 w-72"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Side - Decorative Elements */}
        <div className="lg:w-[350px] relative flex-shrink-0 hidden lg:block">
          {/* Top Left Dots */}
          <div className="absolute top-0 left-0 grid grid-cols-5 gap-2">
            {[...Array(25)].map((_, i) => (
              <div key={`top-${i}`} className="w-1 h-1 bg-slate-500"></div>
            ))}
          </div>

          {/* Top Right Square */}
          <div className="absolute top-0 right-0 w-28 h-28 border border-slate-100"></div>

          {/* Middle Dots */}
          <div className="absolute top-48 left-32 grid grid-cols-5 gap-2">
            {[...Array(25)].map((_, i) => (
              <div key={`mid-${i}`} className="w-1 h-1 bg-slate-500"></div>
            ))}
          </div>

          {/* Bottom Left Overlapping Squares */}
          <div className="absolute bottom-2 w-32 h-32">
            <div className="absolute w-28 h-28 border border-purple-500"></div>
            <div className="absolute w-28 h-28 border border-slate-500 top-4 left-4"></div>
            <div className="absolute w-28 h-28 border border-slate-500 top-8 left-8"></div>
          </div>

          {/* Bottom Right Small Square */}
          <div className="absolute bottom-0 right-8 w-20 h-20 border border-slate-500"></div>
        </div>

        {/* Right Side - Skills Grid */}
        <div className="flex-1">
          {skillsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No skills data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillsData.map((item, index) => (
                <div 
                  key={index} 
                  className="border border-slate-500 hover:border-purple-500 transition-colors duration-300"
                >
                  {/* Category Header */}
                  <div className="border-b border-slate-500 px-3 py-2 bg-slate-800/50">
                    <h3 className="text-white font-semibold text-sm">{item.category}</h3>
                  </div>
                  
                  {/* Skills List */}
                  <div className="p-3 bg-[#282C33]">
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {item.skills.join(' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;