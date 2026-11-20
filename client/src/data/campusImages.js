// High-resolution architectural campus photography
export const CAMPUS_IMAGES = {
  // Hostels
  shivalik: {
    photo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    tagline: 'North Campus Engineering Quadrangle',
  },
  mandakini: {
    photo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    tagline: 'South Campus Garden Court Residence',
  },
  nilgiri: {
    photo: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
    tagline: 'East Campus International Research Tower',
  },
  kailash: {
    photo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    tagline: 'West Campus Sports Enclave',
  },
  gargi: {
    photo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Central Campus Women Scholar Hall',
  },
  kalam: {
    photo: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Modern Collegiate Academic Residence',
  },
  defaultHostel: {
    photo: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=80',
    tagline: 'University Residential Living Hall',
  },

  // Room Types
  rooms: {
    Single: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    Double: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    Triple: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  },
};

export const getHostelImage = (hostelName = '') => {
  const lower = hostelName.toLowerCase();
  if (lower.includes('shivalik')) return CAMPUS_IMAGES.shivalik.photo;
  if (lower.includes('mandakini')) return CAMPUS_IMAGES.mandakini.photo;
  if (lower.includes('nilgiri')) return CAMPUS_IMAGES.nilgiri.photo;
  if (lower.includes('kailash')) return CAMPUS_IMAGES.kailash.photo;
  if (lower.includes('gargi')) return CAMPUS_IMAGES.gargi.photo;
  if (lower.includes('kalam')) return CAMPUS_IMAGES.kalam.photo;
  return CAMPUS_IMAGES.defaultHostel.photo;
};

export const getRoomImage = (roomType = 'Double') => {
  return CAMPUS_IMAGES.rooms[roomType] || CAMPUS_IMAGES.rooms.Double;
};
