import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/theme.css'; // Tema CSS dosyası
import { ThemeProvider } from './contexts/ThemeContext'; // Tema Context'i

// Components
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerAdd from './pages/CustomerAdd';
import CustomerDetail from './pages/CustomerDetail';
import CustomerEdit from './pages/CustomerEdit';
import Vehicles from './pages/Vehicles';
import VehicleAdd from './pages/VehicleAdd';
import VehicleDetail from './pages/VehicleDetail';
import VehicleEdit from './pages/VehicleEdit';
import Services from './pages/Services';
import ServiceAdd from './pages/ServiceAdd';
import ServiceDetail from './pages/ServiceDetail';
import ServiceEdit from './pages/ServiceEdit';
import FinancialReport from './pages/FinancialReport';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container py-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/add" element={<CustomerAdd />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/edit/:id" element={<CustomerEdit />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/add" element={<VehicleAdd />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/vehicles/edit/:id" element={<VehicleEdit />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/add" element={<ServiceAdd />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/services/edit/:id" element={<ServiceEdit />} />
              <Route path="/financial" element={<FinancialReport />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;