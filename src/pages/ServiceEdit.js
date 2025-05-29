import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, updateService, SERVICE_STATUSES } from '../services/serviceService';
import { getAllVehicles, getVehicleById } from '../services/vehicleService';
import { getAllCustomers, getCustomerById } from '../services/customerService';

function ServiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form alanları için durum (state)
  const [service, setService] = useState({
    vehicleId: '',
    customerId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    items: [],
    notes: '',
    technicianName: ''
  });
  
  // Form doğrulama hataları
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Araçları ve müşterileri getir
    const vehiclesData = getAllVehicles();
    setVehicles(vehiclesData);
    
    const customersData = getAllCustomers();
    setCustomers(customersData);
    
    // Düzenlenecek servis verilerini getir
    const serviceData = getServiceById(id);
    if (serviceData) {
      // Tarih formatlarını form için düzenle
      const formattedService = {
        ...serviceData,
        startDate: serviceData.startDate ? serviceData.startDate.slice(0, 16) : '',
        endDate: serviceData.endDate ? serviceData.endDate.slice(0, 16) : ''
      };
      
      setService(formattedService);
      
      // Araç ve müşteri bilgilerini getir
      if (serviceData.vehicleId) {
        const vehicle = getVehicleById(serviceData.vehicleId);
        setSelectedVehicle(vehicle);
      }
      
      if (serviceData.customerId) {
        const customer = getCustomerById(serviceData.customerId);
        setSelectedCustomer(customer);
      }
    } else {
      // Servis bulunamadıysa listeye yönlendir
      navigate('/services');
    }
    setIsLoading(false);
  }, [id, navigate]);

  // Araç seçildiğinde müşteriyi otomatik seç
  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    setService(prev => ({
      ...prev,
      vehicleId
    }));
    
    if (vehicleId) {
      const vehicle = getVehicleById(parseInt(vehicleId));
      setSelectedVehicle(vehicle);
      
      if (vehicle && vehicle.customerId) {
        const customer = getCustomerById(vehicle.customerId);
        setSelectedCustomer(customer);
        setService(prev => ({
          ...prev,
          customerId: vehicle.customerId.toString()
        }));
      }
    } else {
      setSelectedVehicle(null);
    }
  };

  // Müşteri seçildiğinde
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setService(prev => ({
      ...prev,
      customerId
    }));
    
    if (customerId) {
      const customer = getCustomerById(parseInt(customerId));
      setSelectedCustomer(customer);
    } else {
      setSelectedCustomer(null);
    }
  };

  // Form alanları değiştiğinde çalışır
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Servis kalemi ekleme
  const addServiceItem = () => {
    setService(prev => ({
      ...prev,
      items: [...prev.items, { name: '', price: '', isLabor: false }]
    }));
  };

  // Servis kalemi silme
  const removeServiceItem = (index) => {
    const updatedItems = [...service.items];
    updatedItems.splice(index, 1);
    setService(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Servis kalemi güncelleme
  const handleServiceItemChange = (index, field, value) => {
    const updatedItems = [...service.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'isLabor' ? (value === 'true') : value
    };
    setService(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  // Form gönderildiğinde çalışır
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form doğrulama
    const validationErrors = {};
    if (!service.vehicleId) {
      validationErrors.vehicleId = 'Araç seçimi zorunludur';
    }
    if (!service.customerId) {
      validationErrors.customerId = 'Müşteri seçimi zorunludur';
    }
    if (!service.title.trim()) {
      validationErrors.title = 'Servis başlığı zorunludur';
    }
    if (!service.startDate) {
      validationErrors.startDate = 'Başlangıç tarihi zorunludur';
    }
    
    // Servis kalemleri için doğrulama
    const validItems = service.items.filter(item => item.name.trim() && item.price);
    if (validItems.length === 0) {
      validationErrors.items = 'En az bir servis kalemi eklemelisiniz';
    }
    
    // Hata varsa göster
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Yalnızca geçerli kalemleri al
    const cleanedItems = service.items.filter(item => item.name.trim() && item.price);
    
    // Servisi güncelle
    const serviceData = {
      ...service,
      items: cleanedItems
    };
    
    updateService(id, serviceData);
    navigate(`/services/${id}`); // Servis detay sayfasına yönlendir
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="service-edit-page">
      <h2 className="mb-4">Servis Düzenle</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="vehicleId" className="form-label">Araç *</label>
                <select
                  className={`form-select ${errors.vehicleId ? 'is-invalid' : ''}`}
                  id="vehicleId"
                  name="vehicleId"
                  value={service.vehicleId}
                  onChange={handleVehicleChange}
                >
                  <option value="">Araç Seçin</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate} - {vehicle.brand} {vehicle.model}
                    </option>
                  ))}
                </select>
                {errors.vehicleId && <div className="invalid-feedback">{errors.vehicleId}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="customerId" className="form-label">Müşteri *</label>
                <select
                  className={`form-select ${errors.customerId ? 'is-invalid' : ''}`}
                  id="customerId"
                  name="customerId"
                  value={service.customerId}
                  onChange={handleCustomerChange}
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
            
            {/* Seçilen araç ve müşteri bilgileri */}
            {(selectedVehicle || selectedCustomer) && (
              <div className="row mb-4">
                {selectedVehicle && (
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6>Seçilen Araç Bilgisi</h6>
                        <p className="mb-1">
                          <strong>Plaka:</strong> {selectedVehicle.plate}
                        </p>
                        <p className="mb-1">
                          <strong>Araç:</strong> {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
                        </p>
                        <p className="mb-0">
                          <strong>Kilometre:</strong> {selectedVehicle.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedCustomer && (
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6>Seçilen Müşteri Bilgisi</h6>
                        <p className="mb-1">
                          <strong>Ad Soyad:</strong> {selectedCustomer.name}
                        </p>
                        <p className="mb-0">
                          <strong>Telefon:</strong> {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="title" className="form-label">Servis Başlığı *</label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  id="title"
                  name="title"
                  value={service.title}
                  onChange={handleChange}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="status" className="form-label">Durum</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={service.status}
                  onChange={handleChange}
                >
                  {Object.values(SERVICE_STATUSES).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="startDate" className="form-label">Başlangıç Tarihi *</label>
                <input
                  type="datetime-local"
                  className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                  id="startDate"
                  name="startDate"
                  value={service.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="endDate" className="form-label">Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={service.endDate || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Açıklama</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="2"
                value={service.description}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="technicianName" className="form-label">Teknisyen / Usta</label>
              <input
                type="text"
                className="form-control"
                id="technicianName"
                name="technicianName"
                value={service.technicianName}
                onChange={handleChange}
              />
            </div>
            
            {/* Servis Kalemleri (Parçalar ve İşçilik) */}
            <div className="mt-4 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Servis Kalemleri</h5>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-primary"
                  onClick={addServiceItem}
                >
                  <i className="bi bi-plus"></i> Kalem Ekle
                </button>
              </div>
              
              {errors.items && (
                <div className="alert alert-danger">{errors.items}</div>
              )}
              
              {service.items.map((item, index) => (
                <div key={index} className="card mb-2">
                  <div className="card-body">
                    <div className="row g-2">
                      <div className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Kalem adı (Parça veya İşçilik)"
                          value={item.name}
                          onChange={(e) => handleServiceItemChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Ücret"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleServiceItemChange(index, 'price', e.target.value)}
                          />
                          <span className="input-group-text">₺</span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={item.isLabor.toString()}
                          onChange={(e) => handleServiceItemChange(index, 'isLabor', e.target.value)}
                        >
                          <option value="false">Parça</option>
                          <option value="true">İşçilik</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-outline-danger w-100"
                          onClick={() => removeServiceItem(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Toplam Ücret */}
              <div className="text-end fw-bold mt-2">
                Toplam: {service.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toLocaleString()} ₺
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="notes" className="form-label">Notlar</label>
              <textarea
                className="form-control"
                id="notes"
                name="notes"
                rows="3"
                value={service.notes}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => navigate(`/services/${id}`)}
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

export default ServiceEdit;