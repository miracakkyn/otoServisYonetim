import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCustomers, deleteCustomer } from '../services/customerService';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sıralama state'leri
  const [sortField, setSortField] = useState('name'); // Varsayılan sıralama alanı: isim
  const [sortDirection, setSortDirection] = useState('asc'); // Varsayılan sıralama yönü

  // Sayfa yüklendiğinde müşterileri getir
  useEffect(() => {
    loadCustomers();
  }, []);

  // Müşterileri yükle
  const loadCustomers = () => {
    setIsLoading(true);
    const data = getAllCustomers();
    setCustomers(data);
    setIsLoading(false);
  };

  // Müşteri silme işlemi
  const handleDelete = (id) => {
    if (window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
      deleteCustomer(id);
      loadCustomers(); // Listeyi yenile
    }
  };

  // Arama filtrelemesi
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Müşterileri sıralama fonksiyonu
  const sortCustomers = (customers) => {
    return [...customers].sort((a, b) => {
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
      
      // ID gibi sayısal değerler için karşılaştırma
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

  // Sıralanmış müşteriler
  const sortedCustomers = sortCustomers(filteredCustomers);

  return (
    <div className="customers-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Müşteri Yönetimi</h2>
        <Link to="/customers/add" className="btn btn-primary">
          <i className="bi bi-plus"></i> Yeni Müşteri
        </Link>
      </div>

      {/* Arama kutusu */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Müşteri ara... (İsim, telefon veya e-posta)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : (
        <>
          {filteredCustomers.length === 0 ? (
            <div className="alert alert-info">
              {searchTerm ? 'Arama kriterine uygun müşteri bulunamadı.' : 'Henüz müşteri kaydı bulunmuyor.'}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th onClick={() => handleSort('id')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        ID {renderSortIcon('id')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        Ad Soyad {renderSortIcon('name')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('phone')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        Telefon {renderSortIcon('phone')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('email')} style={{cursor: 'pointer'}}>
                      <div className="d-flex align-items-center">
                        E-posta {renderSortIcon('email')}
                      </div>
                    </th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCustomers.map(customer => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.name}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.email}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link to={`/customers/${customer.id}`} className="btn btn-sm btn-info">
                            Görüntüle
                          </Link>
                          <Link to={`/customers/edit/${customer.id}`} className="btn btn-sm btn-warning">
                            Düzenle
                          </Link>
                          <button
                            onClick={() => handleDelete(customer.id)}
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
            <span className="text-muted">Toplam {filteredCustomers.length} müşteri</span>
            {filteredCustomers.length < customers.length && (
              <span className="text-muted">
                Filtre: {customers.length} müşteri içinden {filteredCustomers.length} müşteri gösteriliyor
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Customers;