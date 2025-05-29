import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // Bildirimleri takip et
  
  return (
    <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-dark bg-primary'} mb-4`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-tools me-2"></i>
          Oto Servis Yönetim
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house-door me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/customers">
                <i className="bi bi-people me-1"></i>
                Müşteriler
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/vehicles">
                <i className="bi bi-car-front me-1"></i>
                Araçlar
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">
                <i className="bi bi-gear me-1"></i>
                Servis İşlemleri
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/financial">
                <i className="bi bi-cash-stack me-1"></i>
                Finansal Raporlar
              </Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            {/* Bildirim merkezi */}
            
            {/* Tema değiştirme butonu */}
            <button 
              className={`btn ${theme === 'dark' ? 'btn-light' : 'btn-dark'} btn-sm ms-2`}
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {theme === 'dark' ? (
                <><i className="bi bi-sun-fill me-1"></i> Açık Tema</>
              ) : (
                <><i className="bi bi-moon-fill me-1"></i> Koyu Tema</>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;