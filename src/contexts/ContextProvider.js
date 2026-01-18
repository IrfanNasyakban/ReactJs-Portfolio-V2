import React, { createContext, useContext, useState, useEffect } from 'react';

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  // Screen and menu state
  const [screenSize, setScreenSize] = useState(undefined);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);

  // Theme state - Portfolio defaults
  const [currentColor, setCurrentColor] = useState(() => {
    // Try to get from localStorage, otherwise use default purple
    const savedColor = localStorage.getItem('colorMode');
    return savedColor || '#A855F7';
  });
  
  const [currentMode, setCurrentMode] = useState(() => {
    // Try to get from localStorage, otherwise use Dark mode
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'Dark';
  });
  
  const [themeSettings, setThemeSettings] = useState(false);

  // Save to localStorage whenever theme changes
  useEffect(() => {
    if (currentColor) {
      localStorage.setItem('colorMode', currentColor);
    }
  }, [currentColor]);

  useEffect(() => {
    if (currentMode) {
      localStorage.setItem('themeMode', currentMode);
    }
  }, [currentMode]);

  // Apply theme mode to document
  useEffect(() => {
    if (currentMode === 'Dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [currentMode]);

  const handleClick = (clicked) => {
    setIsClicked((prevState) => ({
      ...initialState,
      [clicked]: !prevState[clicked],
    }));
  };

  const setMode = (e) => {
    const newMode = e.target.value;
    setCurrentMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  // Enhanced context value
  const contextValue = {
    // Original properties
    activeMenu,
    screenSize,
    setScreenSize,
    handleClick,
    isClicked,
    initialState,
    setIsClicked,
    setActiveMenu,
    
    // Theme properties
    currentColor,
    currentMode,
    themeSettings,
    setThemeSettings,
    setColor,
    setMode,
  };

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a ContextProvider');
  }
  return context;
};