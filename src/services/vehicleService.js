// Araç verilerini localStorage'da saklayan servis

const formatDate = (date) => {
  return new Date(date).toISOString();
};


// Demo araç verileri
const DEMO_VEHICLES = [
    { 
      id: 1, 
      plate: "34AB1234", 
      brand: "Toyota", 
      model: "Corolla", 
      year: 2019,
      color: "Beyaz",
      vin: "JT2BF22K1W0123456",
      engineNo: "1ZZ-1234567",
      mileage: 45000,
      customerId: 1, // Ahmet Yılmaz'a ait
      notes: "Düzenli bakım yapılıyor"
    },
    { 
      id: 2, 
      plate: "06CD5678", 
      brand: "Honda", 
      model: "Civic", 
      year: 2020,
      color: "Gri",
      vin: "1HGEJ8144YL123456",
      engineNo: "R18-7654321",
      mileage: 30000,
      customerId: 2, // Ayşe Demir'e ait
      notes: "Son serviste fren balataları değiştirildi"
    },
    { 
      id: 3, 
      plate: "35EF9012", 
      brand: "Volkswagen", 
      model: "Passat", 
      year: 2021,
      color: "Siyah",
      vin: "WVWZZZ3CZLE123456",
      engineNo: "TSI-2468101",
      mileage: 15000,
      customerId: 3, // Mehmet Kaya'ya ait
      notes: ""
    },
    { 
      id: 4, 
      plate: "34GH3456", 
      brand: "Renault", 
      model: "Megane", 
      year: 2018,
      color: "Mavi",
      vin: "VF1RFA23456123456",
      engineNo: "K4M-1357924",
      mileage: 60000,
      customerId: 1, // Ahmet Yılmaz'ın ikinci aracı
      notes: "Yağ kaçağı kontrolü yapılacak"
    }
  ];
  DEMO_VEHICLES.forEach(vehicle => {
    if (!vehicle.createdAt) {
      const now = formatDate(new Date());
      vehicle.createdAt = now;
      vehicle.updatedAt = now;
    }
  });
  
  // localStorage'dan araçları al veya yoksa demo verileri kullan
  const getVehicles = () => {
    const vehicles = localStorage.getItem('vehicles');
    if (vehicles) {
      return JSON.parse(vehicles);
    } else {
      // İlk kez çalıştırılıyorsa, demo verileri kullan
      localStorage.setItem('vehicles', JSON.stringify(DEMO_VEHICLES));
      return DEMO_VEHICLES;
    }
  };
  
  // getAllVehicles fonksiyonunu da güncelleyelim
const getAllVehicles = () => {
  const vehicles = getVehicles();
  // Deleted olmayan araçları döndür
  return vehicles.filter(vehicle => !vehicle.deleted);
};
  
  // ID'ye göre aracı getir
  const getVehicleById = (id) => {
    const vehicles = getVehicles();
    return vehicles.find(vehicle => vehicle.id === parseInt(id));
  };
  
  // Müşteriye ait araçları getir
  const getVehiclesByCustomerId = (customerId) => {
    const vehicles = getVehicles();
    return vehicles.filter(vehicle => vehicle.customerId === parseInt(customerId));
  };
  
  const addVehicle = (vehicle) => {
    const vehicles = getVehicles();
    
    // Yeni ID oluştur
    const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
    
    const now = formatDate(new Date());
    
    const newVehicle = {
      ...vehicle,
      id: newId,
      mileage: parseInt(vehicle.mileage),
      customerId: parseInt(vehicle.customerId),
      createdAt: now,
      updatedAt: now
    };
    
    vehicles.push(newVehicle);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    return newVehicle;
  };
  
  // Araç güncelle fonksiyonunu düzenleyelim
const updateVehicle = (id, updatedVehicle) => {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(vehicle => vehicle.id === parseInt(id));
  
  if (index !== -1) {
    // Orijinal createdAt'i koru, updatedAt'i güncelle
    const createdAt = vehicles[index].createdAt || formatDate(new Date());
    
    vehicles[index] = {
      ...updatedVehicle,
      id: parseInt(id),
      mileage: parseInt(updatedVehicle.mileage),
      customerId: parseInt(updatedVehicle.customerId),
      createdAt: createdAt,
      updatedAt: formatDate(new Date())
    };
    
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    return vehicles[index];
  }
  return null;
};
  
  // Araç silme (soft delete)
const deleteVehicle = (id) => {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(vehicle => vehicle.id === parseInt(id));
  
  if (index !== -1) {
    // Fiziksel silme yerine deleted bayrağı ekleyelim
    vehicles[index] = {
      ...vehicles[index],
      deleted: true,
      updatedAt: formatDate(new Date())
    };
    
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    return true;
  }
  return false;
};
  
  export {
    getAllVehicles,
    getVehicleById,
    getVehiclesByCustomerId,
    addVehicle,
    updateVehicle,
    deleteVehicle
  };