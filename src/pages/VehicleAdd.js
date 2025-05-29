import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addVehicle } from '../services/vehicleService';
import { getAllCustomers, getCustomerById } from '../services/customerService';
import SearchableSelect from '../components/SearchableSelect';

function VehicleAdd() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Form verileri için state
  const [vehicle, setVehicle] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    vin: '',
    engineNo: '',
    mileage: 0,
    customerId: '',
    notes: ''
  });
  
  // Form doğrulama hataları
  const [errors, setErrors] = useState({});
  
  // Müşterileri getir
  useEffect(() => {
    const customersData = getAllCustomers();
    setCustomers(customersData);
  }, []);
  
  // Form değişikliklerini takip et
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Müşteri seçimi değiştiğinde
  const handleCustomerChange = (customerId) => {
    setVehicle(prev => ({
      ...prev,
      customerId
    }));
    
    if (customerId) {
      const customer = getCustomerById(parseInt(customerId));
      setSelectedCustomer(customer);
    } else {
      setSelectedCustomer(null);
    }
    
    // Müşteri ID ile ilgili hata varsa temizle
    if (errors.customerId) {
      setErrors(prev => ({
        ...prev,
        customerId: null
      }));
    }
  };
  
  // Form gönderildiğinde
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form doğrulama
    const validationErrors = {};
    if (!vehicle.plate.trim()) {
      validationErrors.plate = 'Plaka bilgisi zorunludur';
    }
    if (!vehicle.brand.trim()) {
      validationErrors.brand = 'Marka bilgisi zorunludur';
    }
    if (!vehicle.model.trim()) {
      validationErrors.model = 'Model bilgisi zorunludur';
    }
    if (!vehicle.year) {
      validationErrors.year = 'Yıl bilgisi zorunludur';
    }
    if (!vehicle.customerId) {
      validationErrors.customerId = 'Araç sahibi seçimi zorunludur';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Araç ekle
    addVehicle(vehicle);
    navigate('/vehicles');
  };
  
  // Müşteri gösterim formatı
  const formatCustomerOption = (customer) => {
    return `${customer.name} (${customer.phone}) - ID: ${customer.id}`;
  };
  
  return (
    <div className="vehicle-add-page">
      <h2 className="mb-4">Yeni Araç Kaydı</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="plate" className="form-label">Plaka *</label>
                <input
                  type="text"
                  className={`form-control ${errors.plate ? 'is-invalid' : ''}`}
                  id="plate"
                  name="plate"
                  value={vehicle.plate}
                  onChange={handleChange}
                  placeholder="Örn: 34ABC123"
                />
                {errors.plate && <div className="invalid-feedback">{errors.plate}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="customerId" className="form-label">Araç Sahibi *</label>
                <SearchableSelect
                  options={customers}
                  onSelect={handleCustomerChange}
                  placeholder="Müşteri adı veya telefon ile arayın..."
                  initialSelectedId={vehicle.customerId ? parseInt(vehicle.customerId) : null}
                  displayFormat={formatCustomerOption}
                />
                {errors.customerId && <div className="text-danger mt-1">{errors.customerId}</div>}
              </div>
            </div>

            {/* Seçilen müşteri bilgileri gösterimi */}
            {selectedCustomer && (
              <div className="alert alert-info mb-3">
                <h6 className="mb-1">Seçilen Müşteri Bilgileri:</h6>
                <p className="mb-0">
                  <strong>Ad Soyad:</strong> {selectedCustomer.name}<br />
                  <strong>Telefon:</strong> {selectedCustomer.phone}
                </p>
              </div>
            )}
            
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="brand" className="form-label">Marka *</label>
                <input
                  type="text"
                  className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                  id="brand"
                  name="brand"
                  value={vehicle.brand}
                  onChange={handleChange}
                  placeholder="Örn: Toyota"
                />
                {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="model" className="form-label">Model *</label>
                <input
                  type="text"
                  className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                  id="model"
                  name="model"
                  value={vehicle.model}
                  onChange={handleChange}
                  placeholder="Örn: Corolla"
                />
                {errors.model && <div className="invalid-feedback">{errors.model}</div>}
              </div>
              
              <div className="col-md-4">
                <label htmlFor="year" className="form-label">Yıl *</label>
                <input
                  type="number"
                  className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                  id="year"
                  name="year"
                  value={vehicle.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                {errors.year && <div className="invalid-feedback">{errors.year}</div>}
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="color" className="form-label">Renk</label>
                <input
                  type="text"
                  className="form-control"
                  id="color"
                  name="color"
                  value={vehicle.color}
                  onChange={handleChange}
                  placeholder="Örn: Beyaz"
                />
              </div>
              
              <div className="col-md-4">
                <label htmlFor="vin" className="form-label">Şasi No</label>
                <input
                  type="text"
                  className="form-control"
                  id="vin"
                  name="vin"
                  value={vehicle.vin}
                  onChange={handleChange}
                />
              </div>
              
              <div className="col-md-4">
                <label htmlFor="engineNo" className="form-label">Motor No</label>
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
              <label htmlFor="mileage" className="form-label">Kilometre</label>
              <input
                type="number"
                className="form-control"
                id="mileage"
                name="mileage"
                value={vehicle.mileage}
                onChange={handleChange}
                min="0"
              />
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
                placeholder="Araç ile ilgili özel notlar"
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => navigate('/vehicles')}
              >
                İptal
              </button>
              <button type="submit" className="btn btn-primary">
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VehicleAdd;