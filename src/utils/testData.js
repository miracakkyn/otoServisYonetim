// testData.js dosyası

// Türkçe rastgele isimler için liste
const firstNames = [
    'Ahmet', 'Mehmet', 'Ali', 'Mustafa', 'Ayşe', 'Fatma', 'Emine', 'Hatice', 
    'Can', 'Elif', 'Zeynep', 'Hüseyin', 'İbrahim', 'Murat', 'Serkan', 'Hakan', 
    'Emre', 'Burak', 'Özgür', 'Tolga', 'Selin', 'Sevgi', 'Merve', 'Derya', 
    'Cem', 'Cihan', 'Deniz', 'Caner', 'Tarık', 'Selim', 'Sibel', 'Buse', 
    'Kaan', 'Kerem', 'Koray', 'Levent', 'Melis', 'Meltem', 'Mert', 'Onur', 
    'Pelin', 'Pınar', 'Seda', 'Sema', 'Taner', 'Tuba', 'Ufuk', 'Umut'
  ];
  
  const lastNames = [
    'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 
    'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 
    'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Özcan', 'Korkmaz', 'Çakır', 
    'Erdoğan', 'Akbaş', 'Tuncer', 'Ateş', 'Kuru', 'Avcı', 'Uçar', 'Güler', 
    'Yalçın', 'Bulut', 'Aktaş', 'Güneş', 'Yüksel', 'Eroğlu', 'Tekin', 'Turan', 
    'Demirci', 'Karataş', 'Ergin', 'Türk', 'Can', 'Sarı', 'Küçük', 'Balcı'
  ];
  
  // Türkiye illeri
  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 
    'Gaziantep', 'Şanlıurfa', 'Kocaeli', 'Mersin', 'Diyarbakır', 'Hatay', 'Manisa', 
    'Kayseri', 'Samsun', 'Balıkesir', 'Kahramanmaraş', 'Van', 'Aydın'
  ];
  
  // Marka ve modeller
  const cars = [
    { brand: 'Toyota', models: ['Corolla', 'Yaris', 'Auris', 'C-HR', 'RAV4', 'Camry'] },
    { brand: 'Honda', models: ['Civic', 'Accord', 'CR-V', 'Jazz', 'HR-V'] },
    { brand: 'Volkswagen', models: ['Golf', 'Passat', 'Tiguan', 'Polo', 'T-Roc', 'Arteon'] },
    { brand: 'Ford', models: ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Puma', 'EcoSport'] },
    { brand: 'Renault', models: ['Clio', 'Megane', 'Captur', 'Kadjar', 'Talisman'] },
    { brand: 'Hyundai', models: ['i20', 'i30', 'Tucson', 'Kona', 'Elantra'] },
    { brand: 'Fiat', models: ['Egea', '500', 'Panda', 'Tipo', 'Doblo'] },
    { brand: 'Mercedes', models: ['A180', 'C200', 'E250', 'GLA', 'CLA'] },
    { brand: 'BMW', models: ['320i', '520d', 'X3', 'X5', '116i'] },
    { brand: 'Audi', models: ['A3', 'A4', 'Q5', 'A6', 'Q3'] }
  ];
  
  // Servis başlıkları
  const serviceTitles = [
    'Periyodik bakım', 'Yağ değişimi', 'Fren balata değişimi', 'Debriyaj tamiri',
    'Akü değişimi', 'Ateşleme sistemi kontrolü', 'Triger kayışı değişimi', 'Klima bakımı',
    'Rot balans ayarı', 'Amortisör değişimi', 'Radyatör tamiri', 'Far ayarı',
    'Enjektör temizliği', 'Motor revizyonu', 'Şanzıman tamiri', 'Alternatör tamiri',
    'Yürüyen aksam kontrolü', 'Egzoz tamiri', 'Buji değişimi', 'Direksiyon tamiri'
  ];
  
  // Rastgele telefon numarası oluştur
  const generatePhone = () => {
    const prefixes = ['530', '532', '535', '536', '537', '539', '541', '542', '543', '544', '545', '546', '551', '552', '553', '554', '555', '559'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let number = '';
    for (let i = 0; i < 7; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return `0${prefix}${number}`;
  };
  
  // Rastgele TC Kimlik oluştur
  const generateTcId = () => {
    let id = '';
    for (let i = 0; i < 11; i++) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  };
  
  // Rastgele plaka oluştur
  const generatePlate = () => {
    const plates = ['34', '06', '35', '16', '07', '01', '42', '27', '63', '41', '33', '21', '31', '45', '38', '55', '10', '46', '65', '09'];
    const plate = plates[Math.floor(Math.random() * plates.length)];
    const letters = 'ABCDEFGHJKLMNPRSTUVYZ';
    const letter1 = letters[Math.floor(Math.random() * letters.length)];
    const letter2 = letters[Math.floor(Math.random() * letters.length)];
    let numbers = '';
    for (let i = 0; i < 3; i++) {
      numbers += Math.floor(Math.random() * 10);
    }
    return `${plate} ${letter1}${letter2} ${numbers}`;
  };
  
  // Rastgele kilometre oluştur
  const generateMileage = () => {
    return Math.floor(Math.random() * 250000) + 1000;
  };
  
  // Rastgele tarih oluştur (son 3 yıl içinde)
  const generateDate = () => {
    const today = new Date();
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(today.getFullYear() - 3);
    
    return new Date(
      threeYearsAgo.getTime() + Math.random() * (today.getTime() - threeYearsAgo.getTime())
    ).toISOString();
  };
  
  // 100 adet demo müşteri verisi oluştur
  export const generateDemoCustomers = (count = 100) => {
    const customers = [];
    
    for (let i = 1; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      
      customers.push({
        id: i,
        name: `${firstName} ${lastName}`,
        phone: generatePhone(),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        address: `${city}, Türkiye`,
        tcId: generateTcId(),
        notes: Math.random() > 0.7 ? `${firstName} Bey/Hanım özel müşterimizdir.` : '',
        createdAt: generateDate(),
        updatedAt: generateDate()
      });
    }
    
    return customers;
  };
  
  // 200 adet demo araç verisi oluştur (100 müşteri için ortalama 2'şer araç)
  export const generateDemoVehicles = (customerCount = 100) => {
    const vehicles = [];
    let vehicleId = 1;
    
    // Her müşteri için 1-3 araç oluştur
    for (let i = 1; i <= customerCount; i++) {
      const vehicleCount = Math.floor(Math.random() * 3) + 1; // 1-3 arası
      
      for (let j = 0; j < vehicleCount; j++) {
        const car = cars[Math.floor(Math.random() * cars.length)];
        const brand = car.brand;
        const model = car.models[Math.floor(Math.random() * car.models.length)];
        const year = Math.floor(Math.random() * 20) + 2000; // 2000-2020 arası
        
        vehicles.push({
          id: vehicleId++,
          customerId: i,
          plate: generatePlate(),
          brand,
          model,
          year,
          color: ['Beyaz', 'Siyah', 'Gri', 'Kırmızı', 'Mavi', 'Gümüş'][Math.floor(Math.random() * 6)],
          vin: Math.random().toString(36).substring(2, 15).toUpperCase(),
          engineNo: Math.random().toString(36).substring(2, 10).toUpperCase(),
          mileage: generateMileage(),
          notes: Math.random() > 0.8 ? 'Dikkat: Sağ ön kapıda boya kalkması var.' : '',
          createdAt: generateDate(),
          updatedAt: generateDate()
        });
      }
    }
    
    return vehicles;
  };
  
  // 300 adet demo servis verisi oluştur
  export const generateDemoServices = (vehicles) => {
    const services = [];
    let serviceId = 1;
    
    // Servis durumları
    const statuses = [
      'Bekliyor', 'Devam Ediyor', 'Parça Bekleniyor', 'Tamamlandı', 'Teslim Edildi', 'İptal Edildi'
    ];
    
    // Her araç için 1-3 servis oluştur
    for (const vehicle of vehicles) {
      const serviceCount = Math.floor(Math.random() * 3) + 1; // 1-3 arası
      
      for (let i = 0; i < serviceCount; i++) {
        const title = serviceTitles[Math.floor(Math.random() * serviceTitles.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const startDate = generateDate();
        
        // Servis kalemleri
        const itemCount = Math.floor(Math.random() * 5) + 1; // 1-5 arası
        const items = [];
        
        for (let j = 0; j < itemCount; j++) {
          items.push({
            id: j + 1,
            name: ['Yağ değişimi', 'Filtre değişimi', 'Balata değişimi', 'İşçilik', 'Fren hidroliği', 'Triger seti', 'Akü'][Math.floor(Math.random() * 7)],
            price: Math.floor(Math.random() * 1000) + 100,
            isLabor: Math.random() > 0.7
          });
        }
        
        // Toplam fiyat hesapla
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
        
        services.push({
          id: serviceId++,
          vehicleId: vehicle.id,
          customerId: vehicle.customerId,
          title,
          description: `${vehicle.brand} ${vehicle.model} aracı için ${title.toLowerCase()} işlemi`,
          startDate,
          endDate: status === 'Tamamlandı' || status === 'Teslim Edildi' ? new Date(new Date(startDate).getTime() + 86400000).toISOString() : null,
          status,
          items,
          totalPrice,
          notes: Math.random() > 0.6 ? 'Araç sahibi işlem bitince aranacak.' : '',
          technicianName: ['Ahmet Usta', 'Mehmet Usta', 'Ali Usta', 'Hüseyin Usta', 'İbrahim Usta'][Math.floor(Math.random() * 5)],
          createdAt: startDate,
          updatedAt: startDate
        });
      }
    }
    
    return services;
  };
  
  // Tüm test verilerini oluştur
  export const generateAllTestData = () => {
    const customers = generateDemoCustomers(100);
    const vehicles = generateDemoVehicles(100);
    const services = generateDemoServices(vehicles);
    
    return { customers, vehicles, services };
  };
  
  // localStorage'a test verilerini yükle
  export const loadTestDataToLocalStorage = () => {
    const { customers, vehicles, services } = generateAllTestData();
    
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    localStorage.setItem('services', JSON.stringify(services));
    
    return { customers, vehicles, services };
  };