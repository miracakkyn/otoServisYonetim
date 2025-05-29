import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCustomerById } from '../services/customerService';
import { getVehiclesByCustomerId } from '../services/vehicleService';
import { getServicesByCustomerId, SERVICE_STATUSES } from '../services/serviceService';

function CustomerDetail() {
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Müşteriye ait servis geçmişini getir
    const customerServices = getServicesByCustomerId(parseInt(id));
    setServices(customerServices);
    // Müşteri detaylarını getir
    const customerData = getCustomerById(id);
    if (customerData) {
      setCustomer(customerData);
      
      // Müşteriye ait araçları getir
      const customerVehicles = getVehiclesByCustomerId(parseInt(id));
      setVehicles(customerVehicles);
    } else {
      // Müşteri bulunamadıysa listeye yönlendir
      navigate('/customers');
    }
    setIsLoading(false);
  }, [id, navigate]);

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (!customer) {
    return <div className="alert alert-danger">Müşteri bulunamadı.</div>;
  }

  return (
    <div className="customer-detail-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Müşteri Detayları</h2>
        <div>
          <Link to={`/customers/edit/${customer.id}`} className="btn btn-warning me-2">
            Düzenle
          </Link>
          <Link to="/customers" className="btn btn-secondary">
            Geri Dön
          </Link>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Müşteri ID:</div>
            <div className="col-md-9">{customer.id}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Ad Soyad:</div>
            <div className="col-md-9">{customer.name}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Telefon:</div>
            <div className="col-md-9">{customer.phone}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">E-posta:</div>
            <div className="col-md-9">{customer.email || '-'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Adres:</div>
            <div className="col-md-9">{customer.address || '-'}</div>
          </div>
          <div className="row">
            <div className="col-md-3 fw-bold">Notlar:</div>
            <div className="col-md-9">
              {customer.notes ? (
                <p className="mb-0">{customer.notes}</p>
              ) : (
                <span className="text-muted">Not bulunmuyor</span>
              )}
            </div>
          </div>
          {/* Zaman Damgaları */}
{customer.createdAt && (
  <div className="mt-3 text-muted small">
    <div>Oluşturulma: {new Date(customer.createdAt).toLocaleString('tr-TR')}</div>
    <div>Son Güncelleme: {new Date(customer.updatedAt).toLocaleString('tr-TR')}</div>
  </div>
)}
        </div>
      </div>
      
      

      

      {/* Müşteriye ait araçlar */}
      <div className="my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Araçlar</h3>
          <Link to="/vehicles/add" className="btn btn-primary btn-sm">
            <i className="bi bi-plus"></i> Yeni Araç Ekle
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <div className="alert alert-info">
            Bu müşteriye ait araç kaydı bulunmuyor.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Plaka</th>
                  <th>Marka/Model</th>
                  <th>Yıl</th>
                  <th>Kilometre</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.plate}</td>
                    <td>{vehicle.brand} {vehicle.model}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.mileage.toLocaleString()} km</td>
                    <td>
                      <Link to={`/vehicles/${vehicle.id}`} className="btn btn-sm btn-info me-1">
                        Detaylar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Servis Geçmişi */}
<div className="my-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h3>Servis Geçmişi</h3>
    <Link to="/services/add" className="btn btn-primary btn-sm">
      <i className="bi bi-plus"></i> Yeni Servis Ekle
    </Link>
  </div>

  {services.length === 0 ? (
    <div className="alert alert-info">
      Bu müşteriye ait servis kaydı bulunmuyor.
    </div>
  ) : (
    <div className="table-responsive">
      <table className="table table-sm table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Tarih</th>
            <th>Plaka</th>
            <th>Servis Başlığı</th>
            <th>Durum</th>
            <th>Toplam Ücret</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => {
            const vehicle = vehicles.find(v => v.id === service.vehicleId);
            return (
              <tr key={service.id}>
                <td>{new Date(service.startDate).toLocaleDateString('tr-TR')}</td>
                <td>{vehicle ? vehicle.plate : '-'}</td>
                <td>{service.title}</td>
                <td>
                  <span 
                    className={`badge ${
                      service.status === SERVICE_STATUSES.COMPLETED ? 'bg-success' : 
                      service.status === SERVICE_STATUSES.IN_PROGRESS ? 'bg-primary' : 
                      service.status === SERVICE_STATUSES.WAITING_PARTS ? 'bg-warning text-dark' : 
                      service.status === SERVICE_STATUSES.DELIVERED ? 'bg-info text-dark' : 
                      service.status === SERVICE_STATUSES.CANCELLED ? 'bg-danger' : 
                      'bg-secondary'
                    }`}
                  >
                    {service.status}
                  </span>
                </td>
                <td>{service.totalPrice.toLocaleString()} ₺</td>
                <td>
                  <Link to={`/services/${service.id}`} className="btn btn-sm btn-info">
                    Görüntüle
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>
      </div>
    </div>
  );
}

export default CustomerDetail;