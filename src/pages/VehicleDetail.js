import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVehicleById } from '../services/vehicleService';
import { getCustomerById } from '../services/customerService';
import { getServicesByVehicleId, SERVICE_STATUSES } from '../services/serviceService';
function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Araç detaylarını getir
    const vehicleData = getVehicleById(id);
    const vehicleServices = getServicesByVehicleId(parseInt(id));
    setServices(vehicleServices);
    if (vehicleData) {
      setVehicle(vehicleData);
      
      // Araç sahibi (müşteri) bilgilerini getir
      const customerData = getCustomerById(vehicleData.customerId);
      setCustomer(customerData);
    } else {
      // Araç bulunamadıysa listeye yönlendir
      navigate('/vehicles');
    }
    setIsLoading(false);
  }, [id, navigate]);

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (!vehicle) {
    return <div className="alert alert-danger">Araç bulunamadı.</div>;
  }

  return (
    <div className="vehicle-detail-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Araç Detayları</h2>
        <div>
          <Link to={`/vehicles/edit/${vehicle.id}`} className="btn btn-warning me-2">
            Düzenle
          </Link>
          <Link to="/vehicles" className="btn btn-secondary">
            Geri Dön
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Araç Bilgileri</h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Plaka:</div>
                <div className="col-md-9">{vehicle.plate}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Marka/Model:</div>
                <div className="col-md-9">
                  {vehicle.brand} {vehicle.model} ({vehicle.year})
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Renk:</div>
                <div className="col-md-9">{vehicle.color || '-'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Kilometre:</div>
                <div className="col-md-9">{vehicle.mileage.toLocaleString()} km</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Şasi No:</div>
                <div className="col-md-9">{vehicle.vin || '-'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Motor No:</div>
                <div className="col-md-9">{vehicle.engineNo || '-'}</div>
              </div>
              <div className="row">
                <div className="col-md-3 fw-bold">Notlar:</div>
                <div className="col-md-9">
                  {vehicle.notes ? (
                    <p className="mb-0">{vehicle.notes}</p>
                  ) : (
                    <span className="text-muted">Not bulunmuyor</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Araç Sahibi</h5>
            </div>
            <div className="card-body">
              {customer ? (
                <>
                  <div className="mb-3">
                    <strong>Ad Soyad:</strong>
                    <div>{customer.name}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Telefon:</strong>
                    <div>{customer.phone}</div>
                  </div>
                  <div className="mb-3">
                    <strong>E-posta:</strong>
                    <div>{customer.email || '-'}</div>
                  </div>
                  <Link to={`/customers/${customer.id}`} className="btn btn-info btn-sm">
                    Müşteri Detayları
                  </Link>
                </>
              ) : (
                <div className="text-muted">Müşteri bilgisi bulunamadı</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
  <div className="card-header bg-primary text-white">
    <h5 className="mb-0">Servis Geçmişi</h5>
  </div>
  <div className="card-body">
    {services.length === 0 ? (
      <div className="alert alert-info">Bu araca ait servis kaydı bulunamadı.</div>
    ) : (
      <div className="table-responsive">
        <table className="table table-sm table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Tarih</th>
              <th>Servis Başlığı</th>
              <th>Durum</th>
              <th>Toplam Ücret</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{new Date(service.startDate).toLocaleDateString('tr-TR')}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>
    </div>
  );
}

export default VehicleDetail;