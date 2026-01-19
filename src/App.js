import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import { Page404, Homepage, Dashboard, LoginPage, BiodataPage, AddBiodata, EditBiodata } from "./pages";

import { useStateContext } from "./contexts/ContextProvider";

import "./App.css";

const AppContent = () => {
  const { activeMenu, currentMode, themeSettings } = useStateContext();
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isDashboard = location.pathname === "/dashboard";

  // Toggle class body-no-scroll
  useEffect(() => {
    if (activeMenu) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }

    return () => {
      document.body.classList.remove("body-no-scroll");
    };
  }, [activeMenu]);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="flex relative dark:bg-main-dark-bg">
        
        {/* Theme Settings Modal */}
        {themeSettings && <ThemeSettings />}

        {/* Sidebar */}
        { !isLoginPage && !isHomepage &&  activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : !isLoginPage && !isHomepage ? (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        ) : null}

        {/* Main Content */}
        <div
          className={`main-content dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu && !isLoginPage && !isHomepage ? "sidebar-visible" : "full-width"
          }`}
        >
          { !isLoginPage && !isHomepage && (
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>
          )}

          <div>

            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              Portfolio Routes
              <Route path="/biodata" element={<BiodataPage />} />
              <Route path="/add-biodata" element={<AddBiodata />} />
              <Route path="/edit-biodata/:id" element={<EditBiodata />} />
              <Route path="/projects" element={<div className="p-8">Projects Page</div>} />
              <Route path="/skills" element={<div className="p-8">Skills Page</div>} />
              <Route path="/certificates" element={<div className="p-8">Certificates Page</div>} />
              <Route path="/experience" element={<div className="p-8">Experience Page</div>} />
              <Route path="/education" element={<div className="p-8">Education Page</div>} />
              <Route path="/organizations" element={<div className="p-8">Organizations Page</div>} />
              <Route path="/ganti-password" element={<div className="p-8">Change Password Page</div>} />
              <Route path="/users" element={<div className="p-8">Users Management Page</div>} />

              <Route path="/page-not-found" element={<Page404 />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>

          { !isLoginPage && !isDashboard && !isHomepage && <Footer /> }
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;