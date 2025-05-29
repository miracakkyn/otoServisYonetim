// pages/FinancialReport.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getCompletedServicesByDateRange, 
  calculateRevenueByCategory,
  calculateRevenueByPaymentStatus,
  markServiceAsPaid,
  markServiceAsUnpaid
} from '../services/serviceService';
import { getCustomerById } from '../services/customerService';
import { getVehicleById } from '../services/vehicleService';

const FinancialReport = () => {
  // Varsayılan olarak bu ayın başlangıcını ve bugünün tarihini ayarla
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
  const [revenueByCategory, setRevenueByCategory] = useState({ laborTotal: 0, partsTotal: 0, total: 0 });
  const [revenueByPayment, setRevenueByPayment] = useState({ paidTotal: 0, unpaidTotal: 0, total: 0 });
  const [enrichedServices, setEnrichedServices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Servis verilerini yükle
        const completedServices = getCompletedServicesByDateRange(startDate, endDate);
        
        // Gelir hesaplamaları
        const categoryData = calculateRevenueByCategory(startDate, endDate);
        setRevenueByCategory(categoryData);
        
        const paymentData = calculateRevenueByPaymentStatus(startDate, endDate);
        setRevenueByPayment(paymentData);
        
        // Müşteri ve araç bilgilerini ekle
        const enriched = completedServices.map(service => {
          // Müşteri bilgilerini al
          const customer = getCustomerById(service.customerId);
          
          // Araç bilgilerini al
          const vehicle = getVehicleById(service.vehicleId);
          
          // Müşteri adını hazırla
          let customerName = 'Bilinmeyen Müşteri';
          if (customer) {
            // Eğer name alanı varsa onu kullan
            if (customer.name) {
              customerName = customer.name;
            } 
            // Eğer firstName ve lastName alanları varsa onları kullan
            else if (customer.firstName && customer.lastName) {
              customerName = `${customer.firstName} ${customer.lastName}`;
            }
          }
          
          // Araç bilgisini hazırla
          let vehicleInfo = 'Bilinmeyen Araç';
          if (vehicle) {
            if (vehicle.brand && vehicle.model) {
              vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
              // Plaka bilgisi varsa ekle
              if (vehicle.plate) {
                vehicleInfo += ` (${vehicle.plate})`;
              } else if (vehicle.licensePlate) {
                vehicleInfo += ` (${vehicle.licensePlate})`;
              }
            }
          }
          
          return {
            ...service,
            customerName,
            vehicleInfo
          };
        });
        
        setEnrichedServices(enriched);
        setIsLoading(false);
      } catch (error) {
        console.error('Servis verileri yüklenirken hata:', error);
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [startDate, endDate]);
  
  // Ödeme durumu değiştirme
  const handlePaymentStatusChange = (serviceId, isPaid) => {
    try {
      if (isPaid) {
        markServiceAsPaid(serviceId);
      } else {
        markServiceAsUnpaid(serviceId);
      }
      
      // Verileri yeniden yükle
      const updatedServices = getCompletedServicesByDateRange(startDate, endDate);
      
      // Güncellenmiş kategori ve ödeme verileri
      const updatedCategoryData = calculateRevenueByCategory(startDate, endDate);
      setRevenueByCategory(updatedCategoryData);
      
      const updatedPaymentData = calculateRevenueByPaymentStatus(startDate, endDate);
      setRevenueByPayment(updatedPaymentData);
      
      // Servisleri zenginleştir
      const updatedEnriched = updatedServices.map(service => {
        // Müşteri bilgilerini al
        const customer = getCustomerById(service.customerId);
        
        // Araç bilgilerini al
        const vehicle = getVehicleById(service.vehicleId);
        
        // Müşteri adını hazırla
        let customerName = 'Bilinmeyen Müşteri';
        if (customer) {
          // Eğer name alanı varsa onu kullan
          if (customer.name) {
            customerName = customer.name;
          } 
          // Eğer firstName ve lastName alanları varsa onları kullan
          else if (customer.firstName && customer.lastName) {
            customerName = `${customer.firstName} ${customer.lastName}`;
          }
        }
        
        // Araç bilgisini hazırla
        let vehicleInfo = 'Bilinmeyen Araç';
        if (vehicle) {
          if (vehicle.brand && vehicle.model) {
            vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
            // Plaka bilgisi varsa ekle
            if (vehicle.plate) {
              vehicleInfo += ` (${vehicle.plate})`;
            } else if (vehicle.licensePlate) {
              vehicleInfo += ` (${vehicle.licensePlate})`;
            }
          }
        }
        
        return {
          ...service,
          customerName,
          vehicleInfo
        };
      });
      
      setEnrichedServices(updatedEnriched);
    } catch (error) {
      console.error('Ödeme durumu güncellenirken hata oluştu:', error);
    }
  };
  
  // Tarih formatı
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };
  
  // Durum filtreleme
  const filteredServices = enrichedServices.filter(service => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'paid') return service.isPaid;
    if (selectedStatus === 'unpaid') return !service.isPaid;
    return true;
  });

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h1 className="h5 mb-0">
            <i className="bi bi-cash-stack me-2"></i>
            Finansal Raporlama
          </h1>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <label className="form-label">Başlangıç Tarihi</label>
              <input 
                type="date" 
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Bitiş Tarihi</label>
              <input 
                type="date" 
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Ödeme Durumu</label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tümü</option>
                <option value="paid">Ödenenler</option>
                <option value="unpaid">Ödenmeyenler</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p className="mt-2">Finansal veriler yükleniyor...</p>
            </div>
          ) : (
            <>
              {/* Gelir Özeti Kartları */}
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <div className="card bg-primary text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">Toplam Gelir</h5>
                      <p className="display-6">{revenueByCategory.total.toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-success text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">Tahsil Edilen</h5>
                      <p className="display-6">{revenueByPayment.paidTotal.toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-danger text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">Tahsil Edilmemiş</h5>
                      <p className="display-6">{revenueByPayment.unpaidTotal.toLocaleString('tr-TR')} ₺</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* İkincil Gelir Kartları */}
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="card border-success h-100">
                    <div className="card-body">
                      <h5 className="card-title text-success">İşçilik Geliri</h5>
                      <p className="h3">{revenueByCategory.laborTotal.toLocaleString('tr-TR')} ₺</p>
                      <p className="text-muted mt-2">Toplam gelirin {Math.round((revenueByCategory.laborTotal / revenueByCategory.total) * 100) || 0}%'si</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card border-info h-100">
                    <div className="card-body">
                      <h5 className="card-title text-info">Parça Geliri</h5>
                      <p className="h3">{revenueByCategory.partsTotal.toLocaleString('tr-TR')} ₺</p>
                      <p className="text-muted mt-2">Toplam gelirin {Math.round((revenueByCategory.partsTotal / revenueByCategory.total) * 100) || 0}%'si</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Servis Tablosu */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    {startDate && endDate && `${formatDate(startDate)} - ${formatDate(endDate)}`}
                    {' '}Tarihleri Arası Tamamlanan Servisler
                  </h5>
                </div>
                <div className="card-body p-0">
                  {filteredServices.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Servis No</th>
                            <th>Tarih</th>
                            <th>Müşteri</th>
                            <th>Araç</th>
                            <th>Servis</th>
                            <th>Tutar</th>
                            <th>Ödeme Durumu</th>
                            <th>İşlemler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredServices.map((service) => (
                            <tr key={service.id}>
                              <td>#{service.id}</td>
                              <td>{formatDate(service.endDate || service.updatedAt || service.createdAt)}</td>
                              <td>{service.customerName}</td>
                              <td>{service.vehicleInfo}</td>
                              <td>{service.title}</td>
                              <td>{service.totalPrice.toLocaleString('tr-TR')} ₺</td>
                              <td>
                                <span className={`badge ${service.isPaid ? 'bg-success' : 'bg-danger'}`}>
                                  {service.isPaid ? 'Ödendi' : 'Ödenmedi'}
                                </span>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className={`btn ${service.isPaid ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                    onClick={() => handlePaymentStatusChange(service.id, !service.isPaid)}
                                    title={service.isPaid ? 'Ödenmedi olarak işaretle' : 'Ödendi olarak işaretle'}
                                  >
                                    <i className={`bi ${service.isPaid ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
                                  </button>
                                  <Link to={`/services/${service.id}`} className="btn btn-outline-primary" title="Servis Detaylarını Görüntüle">
                                    <i className="bi bi-eye"></i>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-search display-6 text-muted"></i>
                      <p className="text-muted mt-3">Seçilen tarih aralığında tamamlanmış servis bulunmamaktadır.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;