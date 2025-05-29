import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllServices, updateServiceStatus, deleteService, SERVICE_STATUSES } from '../services/serviceService';
import { getVehicleById } from '../services/vehicleService';
import { getCustomerById } from '../services/customerService';

function Services() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Sıralama state'leri
  const [sortField, setSortField] = useState('startDate'); // Varsayılan olarak başlangıç tarihine göre sırala
  const [sortDirection, setSortDirection] = useState('desc'); // Varsayılan olarak en yeni tarih en üstte

  // Sayfa yüklendiğinde servisleri getir
  useEffect(() => {
    loadServices();
  }, []);

  // Servisleri yükle
  const loadServices = () => {
    setIsLoading(true);
    const servicesData = getAllServices();
    
    // Her servis için araç ve müşteri bilgisi ekle
    const enrichedServices = servicesData.map(service => {
      const vehicle = getVehicleById(service.vehicleId);
      const customer = getCustomerById(service.customerId);
      
      return {
        ...service,
        vehiclePlate: vehicle ? vehicle.plate : 'Bilinmeyen',
        vehicleBrand: vehicle ? vehicle.brand : '',
        vehicleModel: vehicle ? vehicle.model : '',
        vehicleInfo: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Bilinmeyen',
        customerName: customer ? customer.name : 'Bilinmeyen'
      };
    });
    
    setServices(enrichedServices);
    setIsLoading(false);
  };

  // Servis silme işlemi
  const handleDelete = (id) => {
    if (window.confirm('Bu servis kaydını silmek istediğinize emin misiniz?')) {
      deleteService(id);
      loadServices(); // Listeyi yenile
    }
  };
  
  // Servis durumu güncelleme
  const handleStatusChange = (id, status) => {
    updateServiceStatus(id, status);
    loadServices(); // Listeyi yenile
  };

  // Arama ve durum filtrelemesi
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === '' || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Servisleri sıralama fonksiyonu
  const sortServices = (services) => {
    return [...services].sort((a, b) => {
      // Değerleri al
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Tarih alanları için özel işlem
      if (sortField === 'startDate' || sortField === 'endDate') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      // String değerler için büyük/küçük harf duyarsız karşılaştırma
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Türkçe karakter desteği için localeCompare kullan
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue, 'tr-TR') 
          : bValue.localeCompare(aValue, 'tr-TR');
      }
      
      // Sayısal değerler için karşılaştırma
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };
  
  // Sıralama alanını değiştiren fonksiyon
  const handleSort = (field) => {
    // Eğer aynı alan tıklandıysa, sıralama yönünü değiştir
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Farklı bir alan tıklandıysa, o alanı seç ve uygun sıralama yönünü belirle
      setSortField(field);
      
      // Tarihler için varsayılan olarak en son tarih en üstte (desc)
      // Diğer alanlar için artan sıralama (asc)
      setSortDirection(field === 'startDate' || field === 'endDate' ? 'desc' : 'asc');
    }
  };
  
  // Sıralama ikonlarını render eden yardımcı fonksiyon
  const renderSortIcon = (field) => {
    if (field !== sortField) {
      return <i className="bi bi-arrow-down-up ms-1 text-muted small"></i>;
    }
    
    return sortDirection === 'asc' 
      ? <i className="bi bi-sort-down ms-1 text-primary"></i> 
      : <i className="bi bi-sort-up-alt ms-1 text-primary"></i>;
  };

  // Sıralanmış servisler
  const sortedServices = sortServices(filteredServices);

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

  return (
    <div className="services-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Servis İşlemleri</h2>
        <Link to="/services/add" className="btn btn-primary">
          <i className="bi bi-plus"></i> Yeni Servis Kaydı
        </Link>
      </div>

      {/* Arama ve filtreleme */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Servis ara... (Başlık, plaka, araç bilgisi veya müşteri adı)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tüm Durumlar</option>
            {Object.values(SERVICE_STATUSES).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : (
        <>
          {filteredServices.length === 0 ? (
            <div className="alert alert-info">
              {searchTerm || statusFilter
                ? 'Filtreleme kriterlerine uygun servis kaydı bulunamadı.'
                : 'Henüz servis kaydı bulunmuyor.'}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th onClick={() => handleSort('id')} style={{cursor: 'pointer', width: '5%'}}>
                      <div className="d-flex align-items-center">
                        ID {renderSortIcon('id')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('title')} style={{cursor: 'pointer', width: '15%'}}>
                      <div className="d-flex align-items-center">
                        Servis Başlığı {renderSortIcon('title')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('vehiclePlate')} style={{cursor: 'pointer', width: '10%'}}>
                      <div className="d-flex align-items-center">
                        Plaka {renderSortIcon('vehiclePlate')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('vehicleInfo')} style={{cursor: 'pointer', width: '10%'}}>
                      <div className="d-flex align-items-center">
                        Araç Bilgisi {renderSortIcon('vehicleInfo')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('customerName')} style={{cursor: 'pointer', width: '15%'}}>
                      <div className="d-flex align-items-center">
                        Müşteri {renderSortIcon('customerName')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('startDate')} style={{cursor: 'pointer', width: '15%'}}>
                      <div className="d-flex align-items-center">
                        Başlangıç {renderSortIcon('startDate')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('status')} style={{cursor: 'pointer', width: '10%'}}>
                      <div className="d-flex align-items-center">
                        Durum {renderSortIcon('status')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('totalPrice')} style={{cursor: 'pointer', width: '10%'}}>
                      <div className="d-flex align-items-center">
                        Ücret {renderSortIcon('totalPrice')}
                      </div>
                    </th>
                    <th style={{width: '10%'}}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedServices.map(service => (
                    <tr key={service.id}>
                      <td>{service.id}</td>
                      <td>{service.title}</td>
                      <td>
                        <Link to={`/vehicles/${service.vehicleId}`}>
                          {service.vehiclePlate}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/vehicles/${service.vehicleId}`}>
                          {service.vehicleInfo}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/customers/${service.customerId}`}>
                          {service.customerName}
                        </Link>
                      </td>
                      <td>{formatDate(service.startDate)}</td>
                      <td>
                        <div className="dropdown">
                          <span
                            className={`badge ${getStatusBadgeClass(service.status)} dropdown-toggle`}
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
                                  onClick={() => handleStatusChange(service.id, status)}
                                  disabled={service.status === status}
                                >
                                  {status}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                      <td>{service.totalPrice.toLocaleString()} ₺</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link to={`/services/${service.id}`} className="btn btn-sm btn-info">
                            Görüntüle
                          </Link>
                          <Link to={`/services/edit/${service.id}`} className="btn btn-sm btn-warning">
                            Düzenle
                          </Link>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="btn btn-sm btn-danger"
                            disabled={service.status === SERVICE_STATUSES.COMPLETED || 
                                    service.status === SERVICE_STATUSES.DELIVERED}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted">Toplam {filteredServices.length} servis kaydı</span>
            {filteredServices.length < services.length && (
              <span className="text-muted">
                Filtre: {services.length} servis kaydı içinden {filteredServices.length} servis gösteriliyor
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Services;