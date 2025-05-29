const formatDate = (date) => {
  return new Date(date).toISOString();
};
// Servis durum seçenekleri
export const SERVICE_STATUSES = {
    PENDING: 'Bekliyor',
    IN_PROGRESS: 'Devam Ediyor',
    WAITING_PARTS: 'Parça Bekleniyor',
    COMPLETED: 'Tamamlandı',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal Edildi'
  };
  const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
  // Demo servis verileri
  const DEMO_SERVICES = [
    { 
      id: 1, 
      vehicleId: 1, // Toyota Corolla
      customerId: 1, // Ahmet Yılmaz
      title: 'Periyodik bakım (10.000 km)',
      description: 'Yağ, filtre değişimi ve genel kontrol',
      startDate: today.toISOString(), // Bugünün tarihi
      endDate: null,
      status: SERVICE_STATUSES.COMPLETED,
      items: [
        { id: 1, name: 'Motor yağı değişimi', price: 750, isLabor: true },
        { id: 2, name: 'Yağ filtresi', price: 200, isLabor: false },
        { id: 3, name: 'Hava filtresi', price: 150, isLabor: false },
        { id: 4, name: 'Polen filtresi', price: 180, isLabor: false },
        { id: 5, name: 'Genel kontrol ve ayarlar', price: 250, isLabor: true }
      ],
      totalPrice: 1530,
      notes: 'Fren balatalarının %30 aşınma tespit edildi. Bir sonraki serviste değiştirilmesi önerilir.',
      technicianName: 'Mehmet Usta',
      isPaid: true,
      paymentDate: yesterday.toISOString()
    },
    { 
      id: 2, 
      vehicleId: 2, // Honda Civic
      customerId: 2, // Ayşe Demir
      title: 'Fren balatası değişimi',
      description: 'Ön fren balatalarının değişimi ve disklerin kontrolü',
      startDate: today.toISOString(), // Bugünün tarihi
      endDate: null,
      status: SERVICE_STATUSES.DELIVERED,
      items: [
        { id: 1, name: 'Ön fren balatası (4 adet)', price: 600, isLabor: false },
        { id: 2, name: 'İşçilik', price: 350, isLabor: true }
      ],
      totalPrice: 950,
      notes: 'Fren diskleri iyi durumda, değişime gerek yok.',
      technicianName: 'Ali Usta',
      isPaid: false
    },
    { 
      id: 3, 
      vehicleId: 3, // Volkswagen Passat
      customerId: 3, // Mehmet Kaya
      title: 'Ön takım problemi inceleme',
      description: 'Virajlarda ses geliyor, rot ve rotil kontrolü',
      startDate: today.toISOString(), // Bugünün tarihi
      endDate: null,
      status: SERVICE_STATUSES.IN_PROGRESS,
      items: [
        { id: 1, name: 'Arıza tespit', price: 250, isLabor: true }
      ],
      totalPrice: 250,
      notes: 'Sol ön rotil değişmesi gerekiyor. Parça sipariş edilecek.',
      technicianName: 'İbrahim Usta',
      isPaid: false
    },
    { 
      id: 4, 
      vehicleId: 4, // Renault Megane
      customerId: 1, // Ahmet Yılmaz
      title: 'Yağ kaçağı kontrolü',
      description: 'Motor altından yağ damladığı belirtildi',
      startDate: today.toISOString(), // Bugünün tarihi
      endDate: null,
      status: SERVICE_STATUSES.WAITING_PARTS,
      items: [],
      totalPrice: 0,
      notes: 'Yağ tapası conta problemi tespit edildi. Yedek parça siparişi verildi.',
      technicianName: '',
      isPaid: false
    },
    { 
      id: 5, 
      vehicleId: 1, // Toyota Corolla
      customerId: 1, // Ahmet Yılmaz
      title: 'Lastik değişimi ve balans ayarı',
      description: '4 adet mevsimlik lastik değişimi',
      startDate: tomorrow.toISOString(), // Yarının tarihi
      endDate: null,
      status: SERVICE_STATUSES.PENDING,
      items: [],
      totalPrice: 0,
      notes: '',
      technicianName: '',
      isPaid: false
    },
    { 
      id: 6, 
      vehicleId: 2, // Honda Civic
      customerId: 2, // Ayşe Demir
      title: 'Klima bakımı',
      description: 'Klima gazı dolumu ve performans kontrolü',
      startDate: yesterday.toISOString(), // Dünün tarihi
      endDate: yesterday.toISOString(),
      status: SERVICE_STATUSES.COMPLETED,
      items: [
        { id: 1, name: 'Klima gazı dolumu', price: 450, isLabor: true },
        { id: 2, name: 'Klima filtresi', price: 200, isLabor: false }
      ],
      totalPrice: 650,
      notes: 'Klima sistemi kontrol edildi, gaz basıncı tamamlandı.',
      technicianName: 'Ali Usta',
      isPaid: true,
      paymentDate: yesterday.toISOString()
    }
  ];
  DEMO_SERVICES.forEach(service => {
    if (!service.createdAt) {
      const now = formatDate(new Date());
      service.createdAt = now;
      service.updatedAt = now;
    }
  });

  
  // localStorage'dan servis kayıtlarını al veya yoksa demo verileri kullan
  const getServices = () => {
    const services = localStorage.getItem('services');
    if (services) {
      return JSON.parse(services);
    } else {
      // İlk kez çalıştırılıyorsa, demo verileri kullan
      localStorage.setItem('services', JSON.stringify(DEMO_SERVICES));
      return DEMO_SERVICES;
    }
  };
  
  // getAllServices fonksiyonunu da güncelleyelim
const getAllServices = () => {
  const services = getServices();
  // Deleted olmayan servisleri döndür
  return services.filter(service => !service.deleted);
};
  // ID'ye göre servis kaydını getir
  const getServiceById = (id) => {
    const services = getServices();
    return services.find(service => service.id === parseInt(id));
  };
  
  // Araç ID'sine göre servis kayıtlarını getir
  const getServicesByVehicleId = (vehicleId) => {
    const services = getServices();
    return services.filter(service => service.vehicleId === parseInt(vehicleId));
  };
  
  // Müşteri ID'sine göre servis kayıtlarını getir
  const getServicesByCustomerId = (customerId) => {
    const services = getServices();
    return services.filter(service => service.customerId === parseInt(customerId));
  };
  
 // Servis ekle fonksiyonuna zaman damgası ekleyelim
const addService = (service) => {
  const services = getServices();
  // Yeni ID oluştur
  const newId = services.length > 0 
    ? Math.max(...services.map(s => s.id)) + 1 
    : 1;
  
  // Toplam fiyatı hesapla
  const totalPrice = service.items.reduce((total, item) => total + parseFloat(item.price || 0), 0);
  
  const now = formatDate(new Date());
  
  const newService = { 
    ...service, 
    id: newId,
    vehicleId: parseInt(service.vehicleId),
    customerId: parseInt(service.customerId),
    items: service.items.map((item, index) => ({
      id: index + 1,
      name: item.name,
      price: parseFloat(item.price || 0),
      isLabor: item.isLabor
    })),
    totalPrice,
    status: service.status || SERVICE_STATUSES.PENDING,
    createdAt: now,
    updatedAt: now,
    isPaid: service.isPaid || false
  };
  
  services.push(newService);
  localStorage.setItem('services', JSON.stringify(services));
  return newService;
};
  
  // Servis güncelle fonksiyonunu düzenleyelim
const updateService = (id, updatedService) => {
  const services = getServices();
  const index = services.findIndex(service => service.id === parseInt(id));
  
  if (index !== -1) {
    // Orijinal createdAt'i koru, updatedAt'i güncelle
    const createdAt = services[index].createdAt || formatDate(new Date());
    
    // Toplam fiyatı hesapla
    const totalPrice = updatedService.items.reduce((total, item) => total + parseFloat(item.price || 0), 0);
    
    services[index] = { 
      ...updatedService, 
      id: parseInt(id),
      vehicleId: parseInt(updatedService.vehicleId),
      customerId: parseInt(updatedService.customerId),
      items: updatedService.items.map((item, idx) => ({
        id: item.id || idx + 1,
        name: item.name,
        price: parseFloat(item.price || 0),
        isLabor: item.isLabor
      })),
      totalPrice,
      createdAt: createdAt,
      updatedAt: formatDate(new Date()),
      isPaid: updatedService.isPaid !== undefined ? updatedService.isPaid : services[index].isPaid || false,
      paymentDate: updatedService.isPaid && !services[index].isPaid ? formatDate(new Date()) : services[index].paymentDate
    };
    
    localStorage.setItem('services', JSON.stringify(services));
    return services[index];
  }
  return null;
};
  
  // Servis silme (soft delete)
const deleteService = (id) => {
  const services = getServices();
  const index = services.findIndex(service => service.id === parseInt(id));
  
  if (index !== -1) {
    // Fiziksel silme yerine deleted bayrağı ekleyelim
    services[index] = {
      ...services[index],
      deleted: true,
      updatedAt: formatDate(new Date())
    };
    
    localStorage.setItem('services', JSON.stringify(services));
    return true;
  }
  return false;
};
  
  // Servis durumu güncelleme fonksiyonunu düzenleyelim
const updateServiceStatus = (id, status) => {
  const services = getServices();
  const index = services.findIndex(service => service.id === parseInt(id));
  
  if (index !== -1) {
    services[index].status = status;
    
    // Eğer tamamlandıysa ve bitiş tarihi yoksa şu anki zamanı ekle
    if (status === SERVICE_STATUSES.COMPLETED && !services[index].endDate) {
      services[index].endDate = new Date().toISOString();
    }
    
    // updatedAt'i güncelle
    services[index].updatedAt = formatDate(new Date());
    
    localStorage.setItem('services', JSON.stringify(services));
    return services[index];
  }
  return null;
};

// Belirli tarih aralığında tamamlanmış servisleri getirme 
export const getCompletedServicesByDateRange = (startDate, endDate) => {
  const services = getAllServices();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Bitiş tarihi verilen günün 23:59:59'una ayarlanmalı
  end.setHours(23, 59, 59, 999);
  
  return services.filter(service => {
    // Tamamlanan veya teslim edilen servisleri filtrele
    const isCompleted = service.status === SERVICE_STATUSES.COMPLETED || 
                        service.status === SERVICE_STATUSES.DELIVERED;
    
    if (!isCompleted) return false;
    
    // Tamamlanma tarihini al (endDate, updatedAt, createdAt sırasıyla kontrol et)
    const completionDate = service.endDate 
      ? new Date(service.endDate) 
      : service.updatedAt 
        ? new Date(service.updatedAt) 
        : new Date(service.createdAt);
    
    // Tarih aralığında mı kontrol et
    return completionDate >= start && completionDate <= end;
  });
};

// Kategori bazlı (işçilik, parça) gelir raporlama 
export const calculateRevenueByCategory = (startDate, endDate) => {
  const completedServices = getCompletedServicesByDateRange(startDate, endDate);
  
  let laborTotal = 0;
  let partsTotal = 0;
  
  completedServices.forEach(service => {
    if (service.items && Array.isArray(service.items)) {
      service.items.forEach(item => {
        if (item.isLabor) {
          laborTotal += (parseFloat(item.price) || 0);
        } else {
          partsTotal += (parseFloat(item.price) || 0);
        }
      });
    }
  });
  
  return {
    laborTotal,
    partsTotal,
    total: laborTotal + partsTotal
  };
};

// Ödeme durumuna göre servisleri filtreleme
export const getServicesByPaymentStatus = (isPaid, startDate, endDate) => {
  const completedServices = getCompletedServicesByDateRange(startDate, endDate);
  return completedServices.filter(service => service.isPaid === isPaid);
};

// Servisi ödenmiş olarak işaretleme
export const markServiceAsPaid = (id) => {
  const services = getServices();
  const index = services.findIndex(service => service.id === parseInt(id));
  
  if (index !== -1) {
    services[index].isPaid = true;
    services[index].paymentDate = formatDate(new Date());
    services[index].updatedAt = formatDate(new Date());
    
    localStorage.setItem('services', JSON.stringify(services));
    return services[index];
  }
  return null;
};

// Servisi ödenmemiş olarak işaretleme
export const markServiceAsUnpaid = (id) => {
  const services = getServices();
  const index = services.findIndex(service => service.id === parseInt(id));
  
  if (index !== -1) {
    services[index].isPaid = false;
    services[index].paymentDate = null;
    services[index].updatedAt = formatDate(new Date());
    
    localStorage.setItem('services', JSON.stringify(services));
    return services[index];
  }
  return null;
};

// Ödeme durumlarını kapsayan gelir hesaplama
export const calculateRevenueByPaymentStatus = (startDate, endDate) => {
  const completedServices = getCompletedServicesByDateRange(startDate, endDate);
  
  let paidTotal = 0;
  let unpaidTotal = 0;
  
  completedServices.forEach(service => {
    const amount = service.totalPrice || 0;
    if (service.isPaid) {
      paidTotal += amount;
    } else {
      unpaidTotal += amount;
    }
  });
  
  return {
    paidTotal,
    unpaidTotal,
    total: paidTotal + unpaidTotal
  };
};

export {
  getAllServices,
  getServiceById,
  getServicesByVehicleId,
  getServicesByCustomerId,
  addService,
  updateService,
  deleteService,
  updateServiceStatus
};