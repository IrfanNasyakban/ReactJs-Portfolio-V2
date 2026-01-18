import React from 'react'
import { MdOutlineCancel } from 'react-icons/md'
import { BsCheck } from 'react-icons/bs'
import { FaPalette } from 'react-icons/fa'
import { useStateContext } from '../contexts/ContextProvider'
import { Tooltip } from 'react-tooltip'

const ThemeSettings = () => {
  const { setColor, setMode, currentMode, currentColor, setThemeSettings } = useStateContext()

  const safeColor = currentColor || '#A855F7'; // Fallback to purple

  // Portfolio themed colors - matching the purple/violet theme from images
  const portfolioColors = [
    { name: 'Purple', color: '#A855F7' },
    { name: 'Violet', color: '#8B5CF6' },
    { name: 'Indigo', color: '#6366F1' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Cyan', color: '#06B6D4' },
    { name: 'Teal', color: '#14B8A6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Rose', color: '#F43F5E' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Amber', color: '#F59E0B' },
    { name: 'Slate', color: '#64748B' },
  ];

  const isDark = currentMode === 'Dark';

  return (
    <div 
      className='bg-black/60 backdrop-blur-sm w-screen fixed nav-item top-0 right-0 z-50'
      onClick={() => setThemeSettings(false)}
    >
      <div 
        className={`float-right h-screen w-400 shadow-2xl border-l ${
          isDark 
            ? 'bg-[#282C33] border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div 
          className={`flex justify-between items-center p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: safeColor }}
            >
              <FaPalette className="text-white" />
            </div>
            <div>
              <p 
                className={`font-bold text-xl ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                Settings
              </p>
              <p 
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Customize your portfolio
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={() => setThemeSettings(false)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MdOutlineCancel className="text-2xl" />
          </button>
        </div>
        
        {/* Theme Mode Section */}
        <div 
          className={`p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <p 
            className={`font-semibold text-lg mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Theme Mode
          </p>

          <div className='space-y-3'>
            <label 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                isDark 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <input
                type='radio'
                id='light'
                name='theme'
                value='Light'
                className='w-4 h-4 cursor-pointer'
                style={{ accentColor: safeColor }}
                onChange={setMode}
                checked={currentMode === 'Light'}
              />
              <span 
                className={`text-md font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Light Mode
              </span>
            </label>

            <label 
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                isDark 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <input
                type='radio'
                id='dark'
                name='theme'
                value='Dark'
                className='w-4 h-4 cursor-pointer'
                style={{ accentColor: currentColor }}
                onChange={setMode}
                checked={currentMode === 'Dark'}
              />
              <span 
                className={`text-md font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Dark Mode
              </span>
            </label>
          </div>
        </div>

        {/* Portfolio Theme Colors */}
        <div className='p-6'>
          <p 
            className={`font-semibold text-lg mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Theme Colors
          </p>
          
          <div className='grid grid-cols-4 gap-3'>
            {portfolioColors.map((item, index) => (
              <div key={index} className='relative cursor-pointer'>
                <button
                  type='button'
                  className={`h-12 w-12 rounded-lg cursor-pointer shadow-md hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-2 ${
                    item.color === currentColor 
                      ? 'ring-2 ring-offset-2' 
                      : ''
                  }`}
                  style={{ 
                    backgroundColor: item.color,
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                    ringColor: item.color
                  }}
                  onClick={() => setColor(item.color)}
                  data-tooltip-id={`tooltip-${index}`}
                  data-tooltip-content={item.name}
                >
                  <BsCheck 
                    className={`ml-2 text-2xl text-white ${item.color === currentColor ? 'block' : 'hidden'}`} 
                  />
                </button>
                <Tooltip 
                  id={`tooltip-${index}`} 
                  place="top" 
                  className={`text-xs px-2 py-1 rounded ${
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSettings