import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import { Page404, Homepage, ChatAI, CertificatesPage, Dashboard, LoginPage, BiodataPage, AddBiodata, EditBiodata, ListProject, AddProject, EditProject, ListSkill, AddSkill, EditSkill, ListCertificate, AddCertificate, EditCertificate, ListExperience, AddExperience, EditExperience, ListEducation, AddEducation, EditEducation, ListOrganization, AddOrganization, EditOrganization, ChangePassword } from "./pages";

import { useStateContext } from "./contexts/ContextProvider";

import "./App.css";

const AppContent = () => {
  const { activeMenu, currentMode, themeSettings } = useStateContext();
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isDashboard = location.pathname === "/dashboard";
  const isChatAI = location.pathname === "/chat-ai";
  const isCertificatesPage = location.pathname === "/certificates-page";

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
        { !isLoginPage && !isHomepage && !isChatAI && !isCertificatesPage &&  activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : !isLoginPage && !isHomepage && !isChatAI && !isCertificatesPage ? (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        ) : null}

        {/* Main Content */}
        <div
          className={`main-content dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu && !isLoginPage && !isHomepage && !isChatAI && !isCertificatesPage ? "sidebar-visible" : "full-width"
          }`}
        >
          { !isLoginPage && !isHomepage && !isChatAI && !isCertificatesPage && (
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>
          )}

          <div>

            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat-ai" element={<ChatAI />} />
              <Route path="/certificates-page" element={<CertificatesPage />} />
              
              Portfolio Routes
              <Route path="/biodata" element={<BiodataPage />} />
              <Route path="/add-biodata" element={<AddBiodata />} />
              <Route path="/edit-biodata/:id" element={<EditBiodata />} />
              <Route path="/projects" element={<ListProject />} />
              <Route path="/add-projects" element={<AddProject />} />
              <Route path="/edit-project/:id" element={<EditProject />} />
              <Route path="/skills" element={<ListSkill />} />
              <Route path="/add-skills" element={<AddSkill />} />
              <Route path="/edit-skills/:id" element={<EditSkill />} />
              <Route path="/certificates" element={<ListCertificate />} />
              <Route path="/add-certificates" element={<AddCertificate />} />
              <Route path="/edit-certificates/:id" element={<EditCertificate />} />
              <Route path="/experience" element={<ListExperience />} />
              <Route path="/add-experience" element={<AddExperience />} />
              <Route path="/edit-experience/:id" element={<EditExperience />} />
              <Route path="/education" element={<ListEducation />} />
              <Route path="/add-education" element={<AddEducation />} />
              <Route path="/edit-education/:id" element={<EditEducation />} />
              <Route path="/organizations" element={<ListOrganization />} />
              <Route path="/add-organizations" element={<AddOrganization />} />
              <Route path="/edit-organizations/:id" element={<EditOrganization />} />
              <Route path="/change-password" element={<ChangePassword />} />

              <Route path="/page-not-found" element={<Page404 />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>

          { !isLoginPage && !isDashboard && !isHomepage && !isChatAI && !isCertificatesPage && <Footer /> }
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