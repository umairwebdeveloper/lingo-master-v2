"use client";

import React from "react";
import "flowbite";
import Navbar from "./_components/navbar";
import Hero from "./_components/hero";
import Features from "./_components/features";
import Pricing from "./_components/pricing";
import LearningSection from "./_components/learning_section";
import Testimonials from "./_components/testimonials";
import UniquePlatform from "./_components/unique_platform";
import Extras from "./_components/extras";
import StepsToSuccess from "./_components/steps_to_success";
import Faq from "./_components/faq";
import ReadyToPass from "./_components/ready_to_pass";
import Footer from "./_components/footer";
import PricingPage from "./pricing";

const LandingPage: React.FC = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <Pricing />
            <LearningSection />
            <Testimonials />
            <UniquePlatform />
            <Extras />
            <StepsToSuccess />
            <Faq />
            <ReadyToPass />
            <Footer />
        </>
    );
};

export default LandingPage;
