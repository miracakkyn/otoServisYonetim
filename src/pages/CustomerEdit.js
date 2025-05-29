import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, updateCustomer } from '../services/customerService';

function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Düzenlenecek müşteri verilerini getir
    const customerData = getCustomerById(id);
    if (customerData) {
      setCustomer(customerData);
    } else {
      // Müşteri bulunamadıysa listeye yönlendir
      navigate('/customers');
    }
    setIsLoading(false);
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prevState => ({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form doğrulama
    const validationErrors = {};
    if (!customer.name.trim()) {
      validationErrors.name = 'Ad Soyad alanı zorunludur';
    }
    if (!customer.phone.trim()) {
      validationErrors.phone = 'Telefon alanı zorunludur';
    }
    if (customer.email && !/\S+@\S+\.\S+/.test(customer.email)) {
      validationErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    // Hata varsa göster
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Müşteriyi güncelle
    updateCustomer(id, customer);
    navigate(`/customers/${id}`); // Müşteri detay sayfasına yönlendir
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="customer-edit-page">
      <h2 className="mb-4">Müşteri Düzenle</h2>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Ad Soyad *</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={customer.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Telefon *</label>
              <input
                type="text"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                id="phone"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-posta</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Adres</label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                rows="3"
                value={customer.address}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">Notlar</label>
              <textarea
                className="form-control"
                id="notes"
                name="notes"
                rows="3"
                value={customer.notes}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => navigate(`/customers/${id}`)}
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

export default CustomerEdit;