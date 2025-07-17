import React, { useEffect } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBalanceScale, 
  faCalculator, 
  faMapMarkerAlt,
  faShip,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const HomePage = ({ onStart }) => {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 150) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <div className="homepage">
      {/* Hero Banner with Parallax */}
      <section className="hero-banner">
        <div className="hero-content reveal fade-bottom">
          <h1>Advanced Ship Load Balancer</h1>
          <p>Optimize cargo distribution with AI-powered weight management for maximum stability and safety</p>
          <button className="cta-button" onClick={onStart}>
            Get Started <FontAwesomeIcon icon={faArrowRight} className="btn-icon" />
          </button>
        </div>
        <div className="scroll-indicator"></div>
      </section>

      {/* Features Section */}
      <section className="features-section reveal fade-bottom">
        <div className="container">
          <h2><span className="section-highlight">Key</span> Features</h2>
          <div className="features-grid">
            {[
              {
                icon: faBalanceScale,
                title: "Smart Weight Balancing",
                desc: "Our AI calculates optimal cargo placement considering multiple stability factors",
                color: "#005b96"
              },
              {
                icon: faCalculator,
                title: "Precision Calculations",
                desc: "Advanced algorithms ensure perfect weight distribution across all ship sections",
                color: "#ff6600"
              },
              {
                icon: faMapMarkerAlt,
                title: "Visual Placement Guide",
                desc: "Interactive 3D visualization shows exact container positions",
                color: "#2ecc71"
              },
              {
                icon: faShip,
                title: "Multi-Vessel Support",
                desc: "Works with various ship types and container configurations",
                color: "#9b59b6"
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="icon-wrapper" style={{ color: feature.color }}>
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className="feature-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works reveal fade-bottom">
        <div className="container">
          <h2><span className="section-highlight">How</span> It Works</h2>
          <div className="steps">
            {[
              {
                number: "1",
                title: "Input Cargo Details",
                desc: "Enter container weights, dimensions, and special requirements"
              },
              {
                number: "2",
                title: "Algorithm Processing",
                desc: "Our system analyzes multiple load distribution scenarios"
              },
              {
                number: "3",
                title: "Get Placement Plan",
                desc: "Receive visual and textual loading instructions"
              },
              {
                number: "4",
                title: "Export & Share",
                desc: "Download PDF reports or share plans with your team"
              }
            ].map((step, index) => (
              <div key={index} className="step">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                {index < 3 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section reveal fade-bottom">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your <span className="text-highlight">Cargo Operations</span>?</h2>
            <p>Join hundreds of shipping companies optimizing their loads with our system</p>
            <button className="cta-button pulse" onClick={onStart}>
              Start Balancing Now <FontAwesomeIcon icon={faArrowRight} className="btn-icon" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;