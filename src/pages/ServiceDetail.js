import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById, updateServiceStatus, SERVICE_STATUSES } from '../services/serviceService';
import { getVehicleById } from '../services/vehicleService';
import { getCustomerById } from '../services/customerService';

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Servis detaylarını getir
    const serviceData = getServiceById(id);
    if (serviceData) {
      setService(serviceData);
      
      // Araç bilgilerini getir
      const vehicleData = getVehicleById(serviceData.vehicleId);
      setVehicle(vehicleData);
      
      // Müşteri bilgilerini getir
      const customerData = getCustomerById(serviceData.customerId);
      setCustomer(customerData);
    } else {
      // Servis bulunamadıysa listeye yönlendir
      navigate('/services');
    }
    setIsLoading(false);
  }, [id, navigate]);

  // Tarih formatını düzenli gösterme
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Durum badge renkleri
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case SERVICE_STATUSES.PENDING:
        return 'bg-secondary';
      case SERVICE_STATUSES.IN_PROGRESS:
        return 'bg-primary';
      case SERVICE_STATUSES.WAITING_PARTS:
        return 'bg-warning text-dark';
      case SERVICE_STATUSES.COMPLETED:
        return 'bg-success';
      case SERVICE_STATUSES.DELIVERED:
        return 'bg-info text-dark';
      case SERVICE_STATUSES.CANCELLED:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };
  
  // Servis durumu güncelleme
  const handleStatusChange = (status) => {
    updateServiceStatus(id, status);
    setService(prev => ({
      ...prev,
      status,
      endDate: status === SERVICE_STATUSES.COMPLETED && !prev.endDate 
        ? new Date().toISOString() 
        : prev.endDate
    }));
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (!service) {
    return <div className="alert alert-danger">Servis kaydı bulunamadı.</div>;
  }

  // İşçilik ve parça toplamlarını hesaplama
  const laborTotal = service.items
    .filter(item => item.isLabor)
    .reduce((sum, item) => sum + parseFloat(item.price), 0);
    
  const partsTotal = service.items
    .filter(item => !item.isLabor)
    .reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <div className="service-detail-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Servis Detayları</h2>
        <div>
          <Link to={`/services/edit/${service.id}`} className="btn btn-warning me-2">
            Düzenle
          </Link>
          <Link to="/services" className="btn btn-secondary">
            Geri Dön
          </Link>
        </div>
      </div>

      {/* Durum ve Temel Bilgiler Kartı */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Servis Bilgileri</h5>
                <div className="dropdown">
                  <span
                    className={`badge ${getStatusBadgeClass(service.status)} dropdown-toggle fs-6`}
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {service.status}
                  </span>
                  <ul className="dropdown-menu">
                    {Object.values(SERVICE_STATUSES).map(status => (
                      <li key={status}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleStatusChange(status)}
                          disabled={service.status === status}
                        >
                          {status}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Servis ID:</div>
                <div className="col-md-9">{service.id}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Başlık:</div>
                <div className="col-md-9">{service.title}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Açıklama:</div>
                <div className="col-md-9">{service.description || '-'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Başlangıç Tarihi:</div>
                <div className="col-md-9">{formatDate(service.startDate)}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Bitiş Tarihi:</div>
                <div className="col-md-9">{formatDate(service.endDate) || '-'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Teknisyen:</div>
                <div className="col-md-9">{service.technicianName || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-3 fw-bold">Notlar:</div>
                <div className="col-md-9">
                  {service.notes ? (
                    <p className="mb-0">{service.notes}</p>
                  ) : (
                    <span className="text-muted">Not bulunmuyor</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Araç ve Müşteri Bilgisi Kartları */}
          {vehicle && (
            <div className="card mb-4">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">Araç Bilgisi</h5>
              </div>
              <div className="card-body">
                <p className="mb-1">
                  <strong>Plaka:</strong> {vehicle.plate}
                </p>
                <p className="mb-1">
                  <strong>Marka/Model:</strong> {vehicle.brand} {vehicle.model} ({vehicle.year})
                </p>
                <p className="mb-1">
                  <strong>Kilometre:</strong> {vehicle.mileage.toLocaleString()} km
                </p>
                <div className="mt-2">
                  <Link to={`/vehicles/${vehicle.id}`} className="btn btn-sm btn-info">
                    Araç Detayları
                  </Link>
                </div>
              </div>
            </div>
          )}

          {customer && (
            <div className="card mb-4">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">Müşteri Bilgisi</h5>
              </div>
              <div className="card-body">
                <p className="mb-1">
                  <strong>Ad Soyad:</strong> {customer.name}
                </p>
                <p className="mb-1">
                  <strong>Telefon:</strong> {customer.phone}
                </p>
                <div className="mt-2">
                  <Link to={`/customers/${customer.id}`} className="btn btn-sm btn-info">
                    Müşteri Detayları
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Servis Kalemleri ve Ücret Tablosu */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Servis Kalemleri</h5>
        </div>
        <div className="card-body">
          {service.items.length === 0 ? (
            <div className="alert alert-info">Henüz servis kalemi eklenmemiş.</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th width="5%">#</th>
                      <th width="55%">Kalem Adı</th>
                      <th width="20%">Tür</th>
                      <th width="20%" className="text-end">Ücret</th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.isLabor ? 'İşçilik' : 'Parça'}</td>
                        <td className="text-end">{parseFloat(item.price).toLocaleString()} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="2" className="text-end fw-bold">Ara Toplamlar:</td>
                      <td>Parçalar</td>
                      <td className="text-end">{partsTotal.toLocaleString()} ₺</td>
                    </tr>
                    <tr>
                      <td colSpan="2"></td>
                      <td>İşçilik</td>
                      <td className="text-end">{laborTotal.toLocaleString()} ₺</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">GENEL TOPLAM:</td>
                      <td className="text-end fw-bold fs-5">{service.totalPrice.toLocaleString()} ₺</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Servis Durumu Zaman Çizelgesi */}
      <div className="card mb-4">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">İşlem Durumu</h5>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {Object.values(SERVICE_STATUSES).map(status => {
              const isActive = service.status === status;
              const isPast = Object.values(SERVICE_STATUSES).indexOf(service.status) >= 
                              Object.values(SERVICE_STATUSES).indexOf(status);
              
              return (
                <li 
                  key={status} 
                  className={`list-group-item ${isActive ? 'active' : ''} ${isPast && !isActive ? 'list-group-item-success' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{status}</span>
                    {isActive && (
                      <span className="badge bg-primary rounded-pill">Güncel Durum</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      
      {/* Yazdır butonu */}
      <div className="d-flex justify-content-end">
        <button 
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          <i className="bi bi-printer"></i> Yazdır
        </button>
      </div>
    </div>
  );
}

export default ServiceDetail;