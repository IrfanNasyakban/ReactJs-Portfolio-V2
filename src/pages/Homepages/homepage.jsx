import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import Hero from "./Hero/Hero";
import Projects from "./Projects/Projects";
import Skills from "./Skills/Skills";
import About from "./About/About";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";
import "./homepage.css";

const Homepage = () => {
  return (
    <main className="overflow-x-hidden font-homepage bg-nature-pattern">
      {/* Navigation */}
      <Navbar />

      <section id="hero">
        <Hero />
      </section>

      <section id="projects">
        <Projects />
      </section>

      <section id="skills">
        <Skills />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
};

export default Homepage;