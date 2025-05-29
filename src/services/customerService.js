// Müşteri verilerini localStorage'da saklayan servis

// Tarih formatını düzenleme yardımcı fonksiyonu
const formatDate = (date) => {
  return new Date(date).toISOString();
};


// Demo müşteri verileri


const DEMO_CUSTOMERS = [
    { 
      id: 1, 
      name: "Ahmet Yılmaz", 
      phone: "555-123-4567", 
      email: "ahmet@example.com",
      address: "Cumhuriyet Mah. Atatürk Cad. No:123 İstanbul",
      notes: "Düzenli servis müşterisi"
    },
    { 
      id: 2, 
      name: "Ayşe Demir", 
      phone: "555-765-4321", 
      email: "ayse@example.com",
      address: "Bahçelievler Sok. No:45 Ankara",
      notes: "Sadece belirli teknisyenlerle çalışmayı tercih ediyor"
    },
    { 
      id: 3, 
      name: "Mehmet Kaya", 
      phone: "555-987-6543", 
      email: "mehmet@example.com",
      address: "Yıldız Mah. Güneş Sok. No:7 İzmir",
      notes: ""
    }
  ];
  DEMO_CUSTOMERS.forEach(customer => {
    if (!customer.createdAt) {
      const now = formatDate(new Date());
      customer.createdAt = now;
      customer.updatedAt = now;
    }
  });
  // localStorage'dan müşterileri al veya yoksa demo verileri kullan
  const getCustomers = () => {
    const customers = localStorage.getItem('customers');
    if (customers) {
      return JSON.parse(customers);
    } else {
      // İlk kez çalıştırılıyorsa, demo verileri kullan
      localStorage.setItem('customers', JSON.stringify(DEMO_CUSTOMERS));
      return DEMO_CUSTOMERS;
    }
  };
  
  // getAllCustomers fonksiyonunu da güncelleyelim
const getAllCustomers = () => {
  const customers = getCustomers();
  // Deleted olmayan müşterileri döndür
  return customers.filter(customer => !customer.deleted);
};
  
  // ID'ye göre müşteriyi getir
  const getCustomerById = (id) => {
    const customers = getCustomers();
    return customers.find(customer => customer.id === parseInt(id));
  };
  
  // Yeni müşteri ekle
  const addCustomer = (customer) => {
    const customers = getCustomers();
    // Yeni ID oluştur (basit yaklaşım)
    const newId = customers.length > 0 
      ? Math.max(...customers.map(c => c.id)) + 1 
      : 1;
    const now = formatDate(new Date());
    const newCustomer = {
      ...customer,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    
    customers.push(newCustomer);
  localStorage.setItem('customers', JSON.stringify(customers));
  return newCustomer;
};
  
  // Müşteri güncelle fonksiyonunu düzenleyelim
const updateCustomer = (id, updatedCustomer) => {
  const customers = getCustomers();
  const index = customers.findIndex(customer => customer.id === parseInt(id));
  
  if (index !== -1) {
    // Orijinal createdAt'i koru, updatedAt'i güncelle
    const createdAt = customers[index].createdAt || formatDate(new Date());
    
    customers[index] = {
      ...updatedCustomer,
      id: parseInt(id),
      createdAt: createdAt,
      updatedAt: formatDate(new Date())
    };
    
    localStorage.setItem('customers', JSON.stringify(customers));
    return customers[index];
  }
  return null;
};
  
  // Müşteri silme (soft delete)
const deleteCustomer = (id) => {
  const customers = getCustomers();
  const index = customers.findIndex(customer => customer.id === parseInt(id));
  
  if (index !== -1) {
    // Fiziksel silme yerine deleted bayrağı ekleyelim
    customers[index] = {
      ...customers[index],
      deleted: true,
      updatedAt: formatDate(new Date())
    };
    
    localStorage.setItem('customers', JSON.stringify(customers));
    return true;
  }
  return false;
};

  const getCustomerName = (id) => {
    const customers = getCustomers();
    const customer = customers.find(customer => customer.id === parseInt(id));
    return customer ? customer.name : 'Bilinmeyen Müşteri';
  };
  
  export {
    getAllCustomers,
    getCustomerById,
    addCustomer,
    getCustomerName,
    updateCustomer,
    deleteCustomer
  };

  

