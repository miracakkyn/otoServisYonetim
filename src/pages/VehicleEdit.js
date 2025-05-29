import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleById, updateVehicle } from '../services/vehicleService';
import { getAllCustomers } from '../services/customerService';

function VehicleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState({
    plate: '',
    brand: '',
    model: '',
    year: 0,
    color: '',
    vin: '',
    engineNo: '',
    mileage: 0,
    customerId: '',
    notes: ''
  });
  
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Müşterileri getir
    const customerData = getAllCustomers();
    setCustomers(customerData);
    
    // Düzenlenecek araç verilerini getir
    const vehicleData = getVehicleById(id);
    if (vehicleData) {
      setVehicle(vehicleData);
    } else {
      // Araç bulunamadıysa listeye yönlendir
      navigate('/vehicles');
    }
    setIsLoading(false);
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prevState => ({
      ...prevState,
      [name]: name === 'mileage' || name === 'year' ? parseInt(value) || 0 : value
    }));
    
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form doğrulama
    const validationErrors = {};
    if (!vehicle.plate.trim()) {
      validationErrors.plate = 'Plaka alanı zorunludur';
    }
    if (!vehicle.brand.trim()) {
      validationErrors.brand = 'Marka alanı zorunludur';
    }
    if (!vehicle.model.trim()) {
      validationErrors.model = 'Model alanı zorunludur';
    }
    if (!vehicle.year) {
      validationErrors.year = 'Yıl alanı zorunludur';
    }
    if (!vehicle.customerId) {
      validationErrors.customerId = 'Müşteri seçimi zorunludur';
    }
    
    // Hata varsa göster
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Aracı güncelle
    updateVehicle(id, vehicle);
    navigate(`/vehicles/${id}`); // Araç detay sayfasına yönlendir
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="vehicle-edit-page">
      <h2 className="mb-4">Araç Düzenle</h2>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="plate" className="form-label">Plaka *</label>
                <input
                  type="text"
                  className={`form-control ${errors.plate ? 'is-invalid' : ''}`}
                  id="plate"
                  name="plate"
                  value={vehicle.plate}
                  onChange={handleChange}
                />
                {errors.plate && <div className="invalid-feedback">{errors.plate}</div>}
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="customerId" className="form-label">Araç Sahibi *</label>
                <select
                  className={`form-select ${errors.customerId ? 'is-invalid' : ''}`}
                  id="customerId"
                  name="customerId"
                  value={vehicle.customerId}
                  onChange={handleChange}
                >
                  <option value="">Müşteri Seçin</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                {errors.customerId && <div className="invalid-feedback">{errors.customerId}</div>}
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="brand" className="form-label">Marka *</label>
                <input
                  type="text"
                  className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                  id="brand"
                  name="brand"
                  value={vehicle.brand}
                  onChange={handleChange}
                />
                {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
              </div>
              
              <div className="col-md-4 mb-3">
                <label htmlFor="model" className="form-label">Model *</label>
                <input
                  type="text"
                  className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                  id="model"
                  name="model"
                  value={vehicle.model}
                  onChange={handleChange}
                />
                {errors.model && <div className="invalid-feedback">{errors.model}</div>}
              </div>
              
              <div className="col-md-4 mb-3">
                <label htmlFor="year" className="form-label">Yıl *</label>
                <input
                  type="number"
                  className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                  id="year"
                  name="year"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={vehicle.year}
                  onChange={handleChange}
                />
                {errors.year && <div className="invalid-feedback">{errors.year}</div>}
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="color" className="form-label">Renk</label>
                <input
                  type="text"
                  className="form-control"
                  id="color"
                  name="color"
                  value={vehicle.color}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-4 mb-3">
                <label htmlFor="mileage" className="form-label">Kilometre</label>
                <input
                  type="number"
                  className="form-control"
                  id="mileage"
                  name="mileage"
                  min="0"
                  value={vehicle.mileage}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="vin" className="form-label">Şasi (VIN) Numarası</label>
                <input
                  type="text"
                  className="form-control"
                  id="vin"
                  name="vin"
                  value={vehicle.vin}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="engineNo" className="form-label">Motor Numarası</label>
                <input
                  type="text"
                  className="form-control"
                  id="engineNo"
                  name="engineNo"
                  value={vehicle.engineNo}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">Notlar</label>
              <textarea
                className="form-control"
                id="notes"
                name="notes"
                rows="3"
                value={vehicle.notes}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => navigate(`/vehicles/${id}`)}
              >
                İptal
              </button>
              <button type="submit" className="btn btn-success">Değişiklikleri Kaydet</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VehicleEdit;