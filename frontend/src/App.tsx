import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Play, Info, Calendar, ChevronRight, X } from 'lucide-react';

interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl: string;
  media_type: string;
}

const API_BASE_URL = 'http://localhost:8080/api/nasa';

function App() {
  const [heroData, setHeroData] = useState<ApodData | null>(null);
  const [recentData, setRecentData] = useState<ApodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchHeroApod = async (date?: string) => {
    try {
      const url = date ? `${API_BASE_URL}/apod/${date}` : `${API_BASE_URL}/apod`;
      const response = await axios.get(url);
      setHeroData(response.data);
    } catch (err) {
      console.error('Error fetching hero APOD:', err);
      setError('Failed to fetch data from the cosmic servers.');
    }
  };

  const fetchRecentApods = async () => {
    const today = new Date();
    const recent: ApodData[] = [];
    
    // Fetch last 6 days for the "Recent Highlights" row
    // Note: We use the existing getApodByDate endpoint
    for (let i = 1; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      try {
        const response = await axios.get(`${API_BASE_URL}/apod/${dateString}`);
        recent.push(response.data);
      } catch (err) {
        console.error(`Error fetching APOD for ${dateString}:`, err);
      }
    }
    setRecentData(recent);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchHeroApod(), fetchRecentApods()]);
      setLoading(false);
    };

    init();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDateSubmit = async () => {
    setLoading(true);
    setShowDatePicker(false);
    await fetchHeroApod(selectedDate);
    setLoading(false);
  };

  if (loading && !heroData) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <Rocket size={32} fill="currentColor" />
          <span>COSMOS</span>
        </div>
        <ul className="nav-links">
          <button className="nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          <button className="nav-item" onClick={() => setShowDatePicker(true)}>History</button>
        </ul>
      </nav>

      {/* Hero Section */}
      {heroData && (
        <section className="hero">
          <div className="hero-image-container">
            {heroData.media_type === 'video' ? (
              <iframe
                src={heroData.url + "?autoplay=1&mute=1&loop=1&playlist=" + heroData.url.split('/').pop()?.split('?')[0]}
                title={heroData.title}
                className="hero-image"
                allow="autoplay; encrypted-media"
              ></iframe>
            ) : (
              <img src={heroData.hdurl || heroData.url} alt={heroData.title} className="hero-image" />
            )}
          </div>
          <div className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-title"
            >
              {heroData.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-description"
            >
              {heroData.explanation}
            </motion.p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => window.open(heroData.hdurl || heroData.url, '_blank')}>
                <Play size={24} fill="black" /> View Full
              </button>
              <button className="btn btn-secondary" onClick={() => setShowDatePicker(true)}>
                <Info size={24} /> Change Date
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Content Rows */}
      <main className="main-content">
        <section className="row">
          <h2 className="row-title">Recent Cosmic Highlights</h2>
          <div className="row-posters">
            {recentData.map((item, index) => (
              <motion.div 
                key={item.date}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="poster-card"
                onClick={() => {
                  setHeroData(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {item.media_type === 'video' ? (
                  <div className="poster-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
                    <Play size={40} color="#555" />
                  </div>
                ) : (
                  <img src={item.url} alt={item.title} className="poster-img" />
                )}
                <div className="poster-info">
                  <span className="poster-date">{item.date}</span>
                  <span className="poster-title">{item.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* You could add more rows here if you had more categories/endpoints */}
      </main>

      <footer className="footer">
        <p>© 2026 Cosmos Exploration • Data provided by NASA Open API</p>
        <p style={{ marginTop: '10px', opacity: 0.5 }}>Inspired by the beauty of the universe.</p>
      </footer>

      {/* Date Picker Modal */}
      <AnimatePresence>
        {showDatePicker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="date-picker-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="date-picker-modal"
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-10px' }}>
                <button onClick={() => setShowDatePicker(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              <h2 className="modal-title">Select Cosmic Date</h2>
              <input 
                type="date" 
                className="date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              <div className="modal-buttons">
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleDateSubmit}>
                  Travel Through Time
                </button>
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowDatePicker(false)}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
