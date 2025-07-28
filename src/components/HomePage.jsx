import React, { useEffect, useRef } from 'react';
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
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optional: unobserve after it's visible so it doesn't re-animate
            // observer.unobserve(entry.target); 
          }
        });
      },
      {
        threshold: 0.1 // Trigger when 10% of the element is visible
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });
    
    // Cleanup observer on component unmount
    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const features = [
    { icon: faBalanceScale, title: "Smart Weight Balancing", desc: "Our AI calculates optimal cargo placement considering multiple stability factors." },
    { icon: faCalculator, title: "Precision Calculations", desc: "Advanced algorithms ensure perfect weight distribution across all ship sections." },
    { icon: faMapMarkerAlt, title: "Visual Placement Guide", desc: "Interactive 3D visualization shows exact container positions." },
    { icon: faShip, title: "Multi-Vessel Support", desc: "Works with various ship types and container configurations." }
  ];

  const steps = [
    { number: "1", title: "Input Cargo Details", desc: "Enter container weights, dimensions, and special requirements." },
    { number: "2", title: "Algorithm Processing", desc: "Our system analyzes multiple load distribution scenarios." },
    { number: "3", title: "Get Placement Plan", desc: "Receive visual and textual loading instructions." },
    { number: "4", title: "Export & Share", desc: "Download PDF reports or share plans with your team." }
  ];

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-video-wrapper">
          <video autoPlay loop muted playsInline poster="https://images.unsplash.com/photo-1599827558998-857fa2382604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80">
            <source src="https://cdn.pixabay.com/video/2020/09/22/50123-460144211_large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animated-text">Advanced Ship Load Balancer</h1>
          <p className="animated-text" style={{ animationDelay: '0.3s' }}>
            Optimize cargo distribution with AI-powered weight management for maximum stability and safety.
          </p>
          <button className="cta-button animated-text" onClick={onStart} style={{ animationDelay: '0.6s' }}>
            Get Started <FontAwesomeIcon icon={faArrowRight} className="btn-icon" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="features-section reveal" 
        ref={(el) => sectionsRef.current[0] = el}
      >
        <div className="container">
          <h2><span className="section-highlight">Key</span> Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card" 
                style={{ '--delay': `${index * 0.15}s` }}
              >
                <div className="feature-icon">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className="card-shine-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        className="how-it-works reveal" 
        ref={(el) => sectionsRef.current[1] = el}
      >
        <div className="container">
          <h2><span className="section-highlight">How It</span> Works</h2>
          <div className="steps-timeline">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="step"
                style={{ '--delay': `${index * 0.2}s` }}
              >
                <div className="step-number-wrapper">
                  <div className="step-number">{step.number}</div>
                  {index < steps.length - 1 && <div className="step-connector"></div>}
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        className="final-cta-section reveal" 
        ref={(el) => sectionsRef.current[2] = el}
      >
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your <span className="text-highlight">Cargo Operations</span>?</h2>
            <p>Join hundreds of shipping companies optimizing their loads with our intelligent system.</p>
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