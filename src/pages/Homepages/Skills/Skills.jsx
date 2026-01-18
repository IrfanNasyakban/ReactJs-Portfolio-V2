import React from 'react';

const Skills = () => {
  const skillsData = [
    {
      category: "Languages",
      skills: ["TypeScript", "Lua", "Python", "JavaScript"]
    },
    {
      category: "Databases",
      skills: ["SQLite", "PostgreSQL", "Mongo"]
    },
    {
      category: "Other",
      skills: ["HTML", "CSS", "EJS", "SCSS", "REST", "Jinja"]
    },
    {
      category: "Tools",
      skills: ["VSCode", "Neovim", "Linux", "Figma", "XFCE", "Arch", "Git", "Font Awesome"]
    },
    {
      category: "Frameworks",
      skills: ["React", "Vue", "Disnake", "Discord.js", "Flask", "Express.js"]
    }
  ];

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
          <div className="lg:w-[350px] relative flex-shrink-0">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillsData.map((item, index) => (
                <div 
                  key={index} 
                  className="border border-slate-500"
                >
                  {/* Category Header */}
                  <div className="border-b border-slate-500 px-3 py-2">
                    <h3 className="text-white font-semibold text-sm">{item.category}</h3>
                  </div>
                  
                  {/* Skills List */}
                  <div className="p-3">
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {item.skills.join(' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Skills;