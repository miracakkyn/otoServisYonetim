// Servis kayıtlarını localStorage'da saklayan servis

// Demo servis kayıtları
const DEMO_SERVICE_RECORDS = [
    { 
      id: 1, 
      vehicleId: 1, // Toyota Corolla
      startDate: "2024-04-15", 
      endDate: "2024-04-16", 
      mileage: 46500,
      description: "Periyodik bakım",
      status: "completed", // beklemede, devam ediyor, tamamlandı
      services: [
        { id: 1, name: "Yağ değişimi", price: 1200 },
        { id: 2, name: "Filtre değişimi", price: 500 },
        { id: 3, name: "Fren kontrolü", price: 300 }
      ],
      parts: [
        { id: 1, name: "Motor yağı", quantity: 4, unitPrice: 200, totalPrice: 800 },
        { id: 2, name: "Yağ filtresi", quantity: 1, unitPrice: 150, totalPrice: 150 },
        { id: 3, name: "Hava filtresi", quantity: 1, unitPrice: 200, totalPrice: 200 }
      ],
      laborCost: 800,
      partsCost: 1150,
      taxRate: 20,
      totalCost: 2340, // (laborCost + partsCost) * (1 + taxRate/100)
      notes: "Gelecek bakım 50,000 km'de yapılmalı",
      technician: "Mehmet Usta"
    },
    { 
      id: 2, 
      vehicleId: 4, // Renault Megane
      startDate: "2024-04-22", 
      endDate: null, 
      mileage: 61200,
      description: "Yağ kaçağı kontrolü ve motor revizyonu",
      status: "in_progress", // beklemede, devam ediyor, tamamlandı
      services: [
        { id: 1, name: "Yağ kaçağı tespiti", price: 400 },
        { id: 2, name: "Motor contası değişimi", price: 1500 }
      ],
      parts: [
        { id: 1, name: "Motor contası", quantity: 1, unitPrice: 750, totalPrice: 750 }
      ],
      laborCost: 1900,
      partsCost: 750,
      taxRate: 20,
      totalCost: 3180,
      notes: "Ön taraftan yağ kaçağı mevcut, conta değişimi yapılıyor",
      technician: "Ali Usta"
    },
    { 
      id: 3, 
      vehicleId: 2, // Honda Civic
      startDate: "2024-04-25", 
      endDate: null, 
      mileage: 31000,
      description: "Kaza sonrası ön tampon değişimi",
      status: "pending", // beklemede, devam ediyor, tamamlandı
      services: [
        { id: 1, name: "Tampon değişimi", price: 800 },
        { id: 2, name: "Boya işlemi", price: 1200 }
      ],
      parts: [
        { id: 1, name: "Ön tampon", quantity: 1, unitPrice: 2500, totalPrice: 2500 },
        { id: 2, name: "Far seti", quantity: 1, unitPrice: 1800, totalPrice: 1800 }
      ],
      laborCost: 2000,
      partsCost: 4300,
      taxRate: 20,
      totalCost: 7560,
      notes: "Sigorta kapsamında yapılacak işlem. Müşteri onayı bekleniyor.",
      technician: "Hasan Usta"
    }
  ];
  
  // localStorage'dan servis kayıtlarını al veya yoksa demo verileri kullan
  const getServiceRecords = () => {
    const records = localStorage.getItem('serviceRecords');
    if (records) {
      return JSON.parse(records);
    } else {
      // İlk kez çalıştırılıyorsa, demo verileri kullan
      localStorage.setItem('serviceRecords', JSON.stringify(DEMO_SERVICE_RECORDS));
      return DEMO_SERVICE_RECORDS;
    }
  };
  
  // Tüm servis kayıtlarını getir
  const getAllServiceRecords = () => {
    return getServiceRecords();
  };
  
  // ID'ye göre servis kaydını getir
  const getServiceRecordById = (id) => {
    const records = getServiceRecords();
    return records.find(record => record.id === parseInt(id));
  };
  
  // Araca göre servis kayıtlarını getir
  const getServiceRecordsByVehicleId = (vehicleId) => {
    const records = getServiceRecords();
    return records.filter(record => record.vehicleId === parseInt(vehicleId));
  };
  
  // Müşteriye ait araçların servis kayıtlarını getir
  const getServiceRecordsByCustomerId = (customerId, vehicles) => {
    // Önce müşteriye ait araçları bulmalıyız
    const customerVehicleIds = vehicles
      .filter(vehicle => vehicle.customerId === parseInt(customerId))
      .map(vehicle => vehicle.id);
    
    // Şimdi bu araçlara ait servis kayıtlarını bulalım
    const records = getServiceRecords();
    return records.filter(record => customerVehicleIds.includes(record.vehicleId));
  };
  
  // Yeni servis kaydı ekle
  const addServiceRecord = (record) => {
    const records = getServiceRecords();
    // Yeni ID oluştur
    const newId = records.length > 0 
      ? Math.max(...records.map(r => r.id)) + 1 
      : 1;
    
    // Yeni servis kaydı oluştur
    const newRecord = { 
      ...record, 
      id: newId,
      vehicleId: parseInt(record.vehicleId),
      totalCost: calculateTotalCost(record)
    };
    
    records.push(newRecord);
    localStorage.setItem('serviceRecords', JSON.stringify(records));
    return newRecord;
  };
  
  // Servis kaydını güncelle
  const updateServiceRecord = (id, updatedRecord) => {
    const records = getServiceRecords();
    const index = records.findIndex(record => record.id === parseInt(id));
    
    if (index !== -1) {
      // Toplam tutarı yeniden hesapla
      const totalCost = calculateTotalCost(updatedRecord);
      
      records[index] = { 
        ...updatedRecord, 
        id: parseInt(id),
        vehicleId: parseInt(updatedRecord.vehicleId),
        totalCost
      };
      localStorage.setItem('serviceRecords', JSON.stringify(records));
      return records[index];
    }
    return null;
  };
  
  // Servis kaydını sil
  const deleteServiceRecord = (id) => {
    let records = getServiceRecords();
    records = records.filter(record => record.id !== parseInt(id));
    localStorage.setItem('serviceRecords', JSON.stringify(records));
    return true;
  };
  
  // Servis durum metinleri
  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Beklemede',
      in_progress: 'Devam Ediyor',
      completed: 'Tamamlandı'
    };
    return statusMap[status] || status;
  };
  
  // Toplam tutarı hesapla
  const calculateTotalCost = (record) => {
    const laborCost = parseFloat(record.laborCost) || 0;
    const partsCost = parseFloat(record.partsCost) || 0;
    const taxRate = parseFloat(record.taxRate) || 0;
    
    return (laborCost + partsCost) * (1 + taxRate / 100);
  };
  
  export {
    getAllServiceRecords,
    getServiceRecordById,
    getServiceRecordsByVehicleId,
    getServiceRecordsByCustomerId,
    addServiceRecord,
    updateServiceRecord,
    deleteServiceRecord,
    getStatusText,
    calculateTotalCost
  };