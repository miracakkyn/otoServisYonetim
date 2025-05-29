import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addService, SERVICE_STATUSES } from '../services/serviceService';
import { getAllVehicles, getVehicleById } from '../services/vehicleService';
import { getAllCustomers, getCustomerById } from '../services/customerService';
import SearchableSelect from '../components/SearchableSelect';

function ServiceAdd() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Form alanları için durum (state)
  const [service, setService] = useState({
    vehicleId: '',
    customerId: '',
    title: '',
    description: '',
    startDate: new Date().toISOString().slice(0, 16), // Şu anki tarih/saat
    endDate: '',
    status: SERVICE_STATUSES.PENDING,
    items: [],
    notes: '',
    technicianName: ''
  });
  
  // Servis kalemleri için durum (işçilik ve parçalar)
  const [serviceItems, setServiceItems] = useState([
    { name: '', price: '', isLabor: false }
  ]);
  
  // Form doğrulama hataları
  const [errors, setErrors] = useState({});

  // Sayfa yüklendiğinde araçları ve müşterileri getir
  useEffect(() => {
    const vehiclesData = getAllVehicles();
    setVehicles(vehiclesData);
    
    const customersData = getAllCustomers();
    setCustomers(customersData);
  }, []);

  // Araç seçildiğinde müşteriyi otomatik seç
  const handleVehicleChange = (vehicleId) => {
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
  const handleCustomerChange = (customerId) => {
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
    setServiceItems([...serviceItems, { name: '', price: '', isLabor: false }]);
  };

  // Servis kalemi silme
  const removeServiceItem = (index) => {
    const updatedItems = [...serviceItems];
    updatedItems.splice(index, 1);
    setServiceItems(updatedItems);
  };

  // Servis kalemi güncelleme
  const handleServiceItemChange = (index, field, value) => {
    const updatedItems = [...serviceItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'isLabor' ? (value === 'true') : value
    };
    setServiceItems(updatedItems);
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
    const validItems = serviceItems.filter(item => item.name.trim() && item.price.trim());
    if (validItems.length === 0) {
      validationErrors.items = 'En az bir servis kalemi eklemelisiniz';
    }
    
    // Hata varsa göster
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Servis kaydı oluştur
    const serviceData = {
      ...service,
      items: serviceItems.filter(item => item.name.trim() && item.price.trim())
    };
    
    addService(serviceData);
    navigate('/services'); // Servis listesine yönlendir
  };

  // Araç gösterim formatı
  const formatVehicleOption = (vehicle) => {
    return `${vehicle.plate} - ${vehicle.brand} ${vehicle.model} (${vehicle.year})`;
  };

  // Müşteri gösterim formatı
  const formatCustomerOption = (customer) => {
    return `${customer.name} (${customer.phone}) - ID: ${customer.id}`;
  };

  return (
    <div className="service-add-page">
      <h2 className="mb-4">Yeni Servis Kaydı</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="vehicleId" className="form-label">Araç *</label>
                <SearchableSelect
                  options={vehicles}
                  onSelect={handleVehicleChange}
                  placeholder="Plaka veya marka/model ile arayın..."
                  initialSelectedId={service.vehicleId ? parseInt(service.vehicleId) : null}
                  displayFormat={formatVehicleOption}
                />
                {errors.vehicleId && <div className="text-danger mt-1">{errors.vehicleId}</div>}
              </div>
              
              <div className="col-md-6">
                <label htmlFor="customerId" className="form-label">Müşteri *</label>
                <SearchableSelect
                  options={customers}
                  onSelect={handleCustomerChange}
                  placeholder="Müşteri adı veya telefonu ile arayın..."
                  initialSelectedId={service.customerId ? parseInt(service.customerId) : null}
                  displayFormat={formatCustomerOption}
                />
                {errors.customerId && <div className="text-danger mt-1">{errors.customerId}</div>}
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
                        <p className="mb-1">
                          <strong>Telefon:</strong> {selectedCustomer.phone}
                        </p>
                        <p className="mb-0">
                          <strong>ID:</strong> {selectedCustomer.id}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Diğer form alanları aynen kalıyor */}
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
                  placeholder="Örn: Periyodik Bakım"
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
                  value={service.endDate}
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
                placeholder="Müşteri şikayeti veya yapılacak işlem detayları"
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
              
              {serviceItems.map((item, index) => (
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
                          disabled={serviceItems.length === 1}
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
                Toplam: {serviceItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toLocaleString()} ₺
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
                placeholder="İlave notlar, öneriler veya uyarılar"
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => navigate('/services')}
              >
                İptal
              </button>
              <button type="submit" className="btn btn-primary">Servis Kaydı Oluştur</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ServiceAdd;