import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllVehicles, deleteVehicle } from '../services/vehicleService';
import { getCustomerName } from '../services/customerService';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sıralama state'leri
  const [sortField, setSortField] = useState('plate'); // Varsayılan sıralama alanı
  const [sortDirection, setSortDirection] = useState('asc'); // Varsayılan sıralama yönü (artan)

  // Sayfa yüklendiğinde araçları getir
  useEffect(() => {
    loadVehicles();
  }, []);

  // Araçları yükle
  const loadVehicles = () => {
    setIsLoading(true);
    const vehicleData = getAllVehicles();
    
    // Her aracın müşteri adını ekle
    const vehiclesWithCustomerNames = vehicleData.map(vehicle => ({
      ...vehicle,
      customerName: getCustomerName(vehicle.customerId)
    }));
    
    setVehicles(vehiclesWithCustomerNames);
    setIsLoading(false);
  };

  // Araç silme işlemi
  const handleDelete = (id) => {
    if (window.confirm('Bu aracı silmek istediğinize emin misiniz?')) {
      deleteVehicle(id);
      loadVehicles(); // Listeyi yenile
    }
  };

  // Arama filtrelemesi
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Araçları sıralama fonksiyonu
  const sortVehicles = (vehicles) => {
    return [...vehicles].sort((a, b) => {
      // Değerleri al
      let aValue = a[sortField];
      let bValue = b[sortField];
      
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
      // Farklı bir alan tıklandıysa, o alanı seç ve artan sıralama yap
      setSortField(field);
      setSortDirection('asc');
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

  // Sıralanmış araçlar
  const sortedVehicles = sortVehicles(filteredVehicles);

  return (
    <div className="vehicles-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Araç Yönetimi</h2>
        <Link to="/vehicles/add" className="btn btn-primary">
          <i className="bi bi-plus"></i> Yeni Araç
        </Link>
      </div>

      {/* Arama kutusu */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Araç ara... (Plaka, marka, model veya müşteri adı)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : (
        <>
          {filteredVehicles.length === 0 ? (
            <div className="alert alert-info">
              {searchTerm ? 'Arama kriterine uygun araç bulunamadı.' : 'Henüz araç kaydı bulunmuyor.'}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    {/* Sıralanabilir tablo başlıkları */}
                    <th onClick={() => handleSort('plate')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        Plaka {renderSortIcon('plate')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('brand')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        Marka {renderSortIcon('brand')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('model')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        Model {renderSortIcon('model')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('year')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        Yıl {renderSortIcon('year')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('mileage')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        Kilometre {renderSortIcon('mileage')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('customerName')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        Müşteri {renderSortIcon('customerName')}
                      </div>
                    </th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.plate}</td>
                      <td>{vehicle.brand}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.year}</td>
                      <td>{vehicle.mileage.toLocaleString()} km</td>
                      <td>
                        <Link to={`/customers/${vehicle.customerId}`}>
                          {vehicle.customerName}
                        </Link>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link to={`/vehicles/${vehicle.id}`} className="btn btn-sm btn-info">
                            Görüntüle
                          </Link>
                          <Link to={`/vehicles/edit/${vehicle.id}`} className="btn btn-sm btn-warning">
                            Düzenle
                          </Link>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="btn btn-sm btn-danger"
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
            <span className="text-muted">Toplam {filteredVehicles.length} araç</span>
            {filteredVehicles.length < vehicles.length && (
              <span className="text-muted">
                Filtre: {vehicles.length} araç içinden {filteredVehicles.length} araç gösteriliyor
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Vehicles;