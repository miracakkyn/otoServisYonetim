import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCustomers } from '../services/customerService';
import { getAllVehicles } from '../services/vehicleService';
import { getAllServices, SERVICE_STATUSES } from '../services/serviceService';
import { loadTestDataToLocalStorage } from '../utils/testData';
function Dashboard() {
  const [statistics, setStatistics] = useState({
    customers: 0,
    vehicles: 0,
    services: 0,
    completedServices: 0,
    pendingServices: 0,
    inProgressServices: 0
  });
  
  const [todayServices, setTodayServices] = useState([]);
  const [activeServices, setActiveServices] = useState([]);
  const [waitingPartsServices, setWaitingPartsServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTestData, setIsLoadingTestData] = useState(false);
  
  // Servis listeleri için görüntüleme limitleri ve durumları
  const [activeServicesLimit, setActiveServicesLimit] = useState(3);
  const [waitingPartsServicesLimit, setWaitingPartsServicesLimit] = useState(3);

  // Verileri yükle
  useEffect(() => {
    // Tüm verileri getir
    const customers = getAllCustomers();
    const vehicles = getAllVehicles();
    const services = getAllServices();
    
    // İstatistikleri hesapla
    const completedServices = services.filter(
      s => s.status === SERVICE_STATUSES.COMPLETED || s.status === SERVICE_STATUSES.DELIVERED
    ).length;
    
    const pendingServices = services.filter(
      s => s.status === SERVICE_STATUSES.PENDING
    ).length;
    
    const inProgressServices = services.filter(
      s => s.status === SERVICE_STATUSES.IN_PROGRESS
    ).length;
    
    setStatistics({
      customers: customers.length,
      vehicles: vehicles.length,
      services: services.length,
      completedServices,
      pendingServices,
      inProgressServices
    });
    
    // Bugünün tarihini al
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Günün başlangıcı
    
    // Bugün planlanan servisleri filtrele
    const todayServicesList = services.filter(service => {
      const serviceDate = new Date(service.startDate);
      serviceDate.setHours(0, 0, 0, 0);
      return serviceDate.getTime() === today.getTime();
    }).map(service => {
      // Araç ve müşteri bilgilerini ekle
      const vehicle = vehicles.find(v => v.id === service.vehicleId);
      const customer = customers.find(c => c.id === service.customerId);
      
      return {
        ...service,
        vehiclePlate: vehicle ? vehicle.plate : 'Bilinmiyor',
        vehicleInfo: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Bilinmiyor',
        customerName: customer ? customer.name : 'Bilinmiyor',
        phoneNumber: customer ? customer.phone : 'Bilinmiyor'
      };
    });
    
    setTodayServices(todayServicesList);
    
    // Devam eden servisleri filtrele
    const activeServicesList = services
      .filter(service => service.status === SERVICE_STATUSES.IN_PROGRESS)
      .map(service => {
        const vehicle = vehicles.find(v => v.id === service.vehicleId);
        const customer = customers.find(c => c.id === service.customerId);
        
        return {
          ...service,
          vehiclePlate: vehicle ? vehicle.plate : 'Bilinmiyor',
          vehicleInfo: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Bilinmiyor',
          customerName: customer ? customer.name : 'Bilinmiyor'
        };
      });
    
    setActiveServices(activeServicesList);
    
    // Parça bekleyen servisleri filtrele
    const waitingPartsServicesList = services
      .filter(service => service.status === SERVICE_STATUSES.WAITING_PARTS)
      .map(service => {
        const vehicle = vehicles.find(v => v.id === service.vehicleId);
        const customer = customers.find(c => c.id === service.customerId);
        
        return {
          ...service,
          vehiclePlate: vehicle ? vehicle.plate : 'Bilinmiyor',
          vehicleInfo: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Bilinmiyor',
          customerName: customer ? customer.name : 'Bilinmiyor'
        };
      });
    
    setWaitingPartsServices(waitingPartsServicesList);
    
    setIsLoading(false);
  }, []);

  // Test verilerini yükle
  const handleLoadTestData = () => {
    if (window.confirm('Uyarı: Bu işlem mevcut verilerin üzerine yazacak. Devam etmek istiyor musunuz?')) {
      try {
        setIsLoadingTestData(true);
        const { customers, vehicles, services } = loadTestDataToLocalStorage();
        alert(`Test verileri başarıyla yüklendi:\n- ${customers.length} müşteri\n- ${vehicles.length} araç\n- ${services.length} servis kaydı oluşturuldu.`);
        // Sayfayı yenile
        window.location.reload();
      } catch (error) {
        alert('Test verileri yüklenirken bir hata oluştu: ' + error.message);
        setIsLoadingTestData(false);
      }
    }
  };

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

  // Tüm aktif servisleri göster/gizle
  const toggleAllActiveServices = () => {
    setActiveServicesLimit(activeServicesLimit === 3 ? activeServices.length : 3);
  };

  // Tüm parça bekleyen servisleri göster/gizle
  const toggleAllWaitingPartsServices = () => {
    setWaitingPartsServicesLimit(waitingPartsServicesLimit === 3 ? waitingPartsServices.length : 3);
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Ana Sayfa</h2>
        
        {/* Test verilerini yükleme butonu */}
        <button 
          className="btn btn-warning" 
          onClick={handleLoadTestData}
          disabled={isLoadingTestData}
        >
          {isLoadingTestData ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Yükleniyor...
            </>
          ) : (
            '100 Test Verisi Oluştur'
          )}
        </button>
      </div>
      
      {/* İstatistik Kartları */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Toplam Müşteri</h6>
                  <h2 className="mt-2 mb-0">{statistics.customers}</h2>
                </div>
                <i className="bi bi-people fs-1"></i>
              </div>
              <div className="mt-3">
                <Link to="/customers" className="text-white">
                  Müşterileri Görüntüle <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Toplam Araç</h6>
                  <h2 className="mt-2 mb-0">{statistics.vehicles}</h2>
                </div>
                <i className="bi bi-car-front fs-1"></i>
              </div>
              <div className="mt-3">
                <Link to="/vehicles" className="text-white">
                  Araçları Görüntüle <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Toplam Servis</h6>
                  <h2 className="mt-2 mb-0">{statistics.services}</h2>
                </div>
                <i className="bi bi-tools fs-1"></i>
              </div>
              <div className="mt-3">
                <Link to="/services" className="text-white">
                  Servisleri Görüntüle <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Servis Durumu */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-warning h-100">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Bekleyen Servisler</h5>
            </div>
            <div className="card-body">
              <h3 className="display-4 text-center">{statistics.pendingServices}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card border-primary h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Devam Eden Servisler</h5>
            </div>
            <div className="card-body">
              <h3 className="display-4 text-center">{statistics.inProgressServices}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card border-success h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Tamamlanan Servisler</h5>
            </div>
            <div className="card-body">
              <h3 className="display-4 text-center">{statistics.completedServices}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bugünün Servisleri */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Bugünün Servisleri</h5>
            <Link to="/services/add" className="btn btn-sm btn-light">
              <i className="bi bi-plus"></i> Yeni Servis
            </Link>
          </div>
        </div>
        <div className="card-body">
          {todayServices.length === 0 ? (
            <div className="alert alert-info">
              Bugün için planlanmış servis bulunmuyor.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Saat</th>
                    <th>Plaka</th>
                    <th>Müşteri</th>
                    <th>Araç</th>
                    <th>Servis</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {todayServices.map(service => (
                    <tr key={service.id}>
                      <td>{new Date(service.startDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</td>
                      <td>
                        <Link to={`/vehicles/${service.vehicleId}`}>
                          {service.vehiclePlate}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/customers/${service.customerId}`}>
                          {service.customerName}
                        </Link>
                      </td>
                      <td>{service.vehicleInfo}</td>
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
      
      <div className="row">
        {/* Devam Eden Servisler - Sınırlı Gösterim */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Devam Eden Servisler</h5>
                <Link to="/services?status=in_progress" className="btn btn-sm btn-light">
                  <i className="bi bi-list"></i> Tümünü Görüntüle
                </Link>
              </div>
            </div>
            <div className="card-body">
              {activeServices.length === 0 ? (
                <div className="alert alert-info">
                  Devam eden servis bulunmuyor.
                </div>
              ) : (
                <>
                  <div className="list-group">
                    {activeServices.slice(0, activeServicesLimit).map(service => (
                      <Link 
                        key={service.id}
                        to={`/services/${service.id}`} 
                        className="list-group-item list-group-item-action"
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{service.title}</h6>
                          <small>{formatDate(service.startDate)}</small>
                        </div>
                        <p className="mb-1">
                          {service.vehiclePlate} - {service.vehicleInfo}
                        </p>
                        <small>{service.customerName}</small>
                      </Link>
                    ))}
                  </div>
                  
                  {activeServices.length > 3 && (
                    <div className="d-flex justify-content-center mt-3">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={toggleAllActiveServices}
                      >
                        {activeServicesLimit === 3 ? (
                          <>
                            <i className="bi bi-arrow-down"></i> Daha Fazla Göster ({activeServices.length - 3} adet daha)
                          </>
                        ) : (
                          <>
                            <i className="bi bi-arrow-up"></i> Daha Az Göster
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Parça Bekleyen Servisler - Sınırlı Gösterim */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-warning text-dark">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Parça Bekleyen Servisler</h5>
                <Link to="/services?status=waiting_parts" className="btn btn-sm btn-dark">
                  <i className="bi bi-list"></i> Tümünü Görüntüle
                </Link>
              </div>
            </div>
            <div className="card-body">
              {waitingPartsServices.length === 0 ? (
                <div className="alert alert-info">
                  Parça bekleyen servis bulunmuyor.
                </div>
              ) : (
                <>
                  <div className="list-group">
                    {waitingPartsServices.slice(0, waitingPartsServicesLimit).map(service => (
                      <Link 
                        key={service.id}
                        to={`/services/${service.id}`} 
                        className="list-group-item list-group-item-action"
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{service.title}</h6>
                          <small>{formatDate(service.startDate)}</small>
                        </div>
                        <p className="mb-1">
                          {service.vehiclePlate} - {service.vehicleInfo}
                        </p>
                        <small>{service.customerName}</small>
                      </Link>
                    ))}
                  </div>
                  
                  {waitingPartsServices.length > 3 && (
                    <div className="d-flex justify-content-center mt-3">
                      <button 
                        className="btn btn-outline-warning btn-sm"
                        onClick={toggleAllWaitingPartsServices}
                      >
                        {waitingPartsServicesLimit === 3 ? (
                          <>
                            <i className="bi bi-arrow-down"></i> Daha Fazla Göster ({waitingPartsServices.length - 3} adet daha)
                          </>
                        ) : (
                          <>
                            <i className="bi bi-arrow-up"></i> Daha Az Göster
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hızlı Erişim Butonları */}
      <div className="row mt-2">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between">
                <Link to="/customers/add" className="btn btn-outline-primary m-1">
                  <i className="bi bi-person-plus"></i> Yeni Müşteri
                </Link>
                <Link to="/vehicles/add" className="btn btn-outline-success m-1">
                  <i className="bi bi-car-front"></i> Yeni Araç
                </Link>
                <Link to="/services/add" className="btn btn-outline-info m-1">
                  <i className="bi bi-tools"></i> Yeni Servis
                </Link>
                <Link to="/customers" className="btn btn-outline-secondary m-1">
                  <i className="bi bi-people"></i> Müşteriler
                </Link>
                <Link to="/vehicles" className="btn btn-outline-secondary m-1">
                  <i className="bi bi-car-front"></i> Araçlar
                </Link>
                <Link to="/services" className="btn btn-outline-secondary m-1">
                  <i className="bi bi-gear"></i> Servisler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;