import React from "react"
import Navbar from "./Components/Navbar"
import Hero from "./Components/Herosection"
import HowIThink from "./Components/HowIthink";
import ProjectsLab from "./Components/ProjectLab";
import BlogSection from "./Components/BlogSection";
import ContactSection from "./Components/Connectus";
import MetricsDashboard from "./Components/MetricsDashboard";
function MainPage(){
    return(
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <HowIThink />
            <ProjectsLab />
            <MetricsDashboard />
            <BlogSection />
            <ContactSection />
        </div>
    );
}
export default MainPage