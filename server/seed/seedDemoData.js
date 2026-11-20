require('dotenv').config({ path: __dirname + '/../.env' });
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Application = require('../models/Application');
const Allocation = require('../models/Allocation');

const seedDemoData = async () => {
  try {
    console.log('🏛️ Seeding authentic, university-grade campus accommodation data...');
    await connectDB();

    // 1. Clear existing collections
    await User.deleteMany({});
    await Hostel.deleteMany({});
    await Room.deleteMany({});
    await Application.deleteMany({});
    await Allocation.deleteMany({});
    console.log('🧹 Purged previous database collections.');

    // 2. Create Chief Warden Administrator
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass@2025';

    const admin = await User.create({
      name: 'Dr. K. S. Ramanathan',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
      phoneNumber: '+91 98401 23456',
      gender: 'Male',
      isActive: true,
    });
    console.log(`✅ Administrator (Chief Warden) created: ${admin.email}`);

    // 3. Create Real-world University Hostels
    const shivalik = await Hostel.create({
      name: 'Shivalik Hall of Residence (Hostel 16)',
      type: 'Boys',
      location: 'North Campus, Lakeview Boulevard, Sector 4',
      totalFloors: 5,
      description: 'Premier collegiate residence overlooking the campus botanical gardens. Equipped with 1 Gbps fiber optic Wi-Fi 6, air-conditioned digital reading hall, collegiate gymnasium, Olympic-size badminton courts, and 24/7 solar water heating.',
      wardenName: 'Prof. Dr. Rajesh M. Deshmukh',
      wardenContact: '+91 98201 44521',
    });

    const mandakini = await Hostel.create({
      name: 'Mandakini Hall of Residence (Hostel 15)',
      type: 'Girls',
      location: 'West Campus, Hillside Enclave, Block M',
      totalFloors: 4,
      description: 'Modern high-security residential facility with RFID/biometric turnstiles, 24/7 on-call infirmary, quiet study lounges on every floor, indoor sports complex, cafeteria, and landscaped rooftop solar patio.',
      wardenName: 'Dr. Radhika Sen',
      wardenContact: '+91 98332 55632',
    });

    const nilgiri = await Hostel.create({
      name: 'Nilgiri Scholars Tower (Postgraduate & International)',
      type: 'Co-ed',
      location: 'East Wing, Research & Innovation Quadrangle',
      totalFloors: 6,
      description: 'Multi-tower international residency for postgraduate scholars, PhD fellows, and exchange students. Features centrally air-conditioned studio apartments, private kitchenettes, laundromat, soundproof thesis pods, and conference suites.',
      wardenName: 'Prof. Alistair Vance',
      wardenContact: '+91 98119 77840',
    });

    const kailash = await Hostel.create({
      name: 'Kailash Hall of Residence (Hostel 10)',
      type: 'Boys',
      location: 'South Campus, Engineering Promenade',
      totalFloors: 4,
      description: 'Dedicated senior undergraduate hall known for tech culture and hackathons. Features 24/7 high-speed makerspace, robotics tinker lab, amphitheater courtyard, and student-run cooperative mess.',
      wardenName: 'Dr. Vikramaditya Joshi',
      wardenContact: '+91 98450 66782',
    });

    const gargi = await Hostel.create({
      name: "Gargi Women's Research Residence",
      type: 'Girls',
      location: 'Central Campus, Academic Ring Road, Block G',
      totalFloors: 4,
      description: 'Serene scholarly residence housing engineering and science researchers. Features 24/7 cyber library, ergonomic workstation rooms, fitness & yoga studio, and round-the-clock campus security patrol.',
      wardenName: 'Dr. Shweta Kulkarni',
      wardenContact: '+91 98221 88990',
    });

    console.log('✅ 5 Real University Hostels seeded successfully.');

    // 4. Create Extensive Realistic Room Inventory
    const rooms = [];

    // Shivalik Boys Rooms
    rooms.push(
      { roomNumber: 'SH-101', hostel: shivalik._id, floor: 1, roomType: 'Single', capacity: 1, currentOccupancy: 0, monthlyFee: 8500, status: 'Available', amenities: ['Gigabit Wi-Fi 6', 'Single Bed', 'Ergonomic Chair & Desk', 'Inverter AC', 'Attached Geyser Bath', 'Wardrobe'] },
      { roomNumber: 'SH-201', hostel: shivalik._id, floor: 2, roomType: 'Double', capacity: 2, currentOccupancy: 0, monthlyFee: 6200, status: 'Available', amenities: ['Gigabit Wi-Fi 6', 'Twin Beds', '2 Study Desks', 'Balcony Garden View', 'Modular Cupboards'] },
      { roomNumber: 'SH-202', hostel: shivalik._id, floor: 2, roomType: 'Double', capacity: 2, currentOccupancy: 0, monthlyFee: 6200, status: 'Available', amenities: ['High-speed LAN', 'Twin Beds', 'Study Desks', 'Balcony', 'Ceiling Fan'] },
      { roomNumber: 'SH-301', hostel: shivalik._id, floor: 3, roomType: 'Triple', capacity: 3, currentOccupancy: 0, monthlyFee: 4800, status: 'Available', amenities: ['3 Beds', '3 Study Tables', '3 Steel Lockers', 'Balcony', 'Ceiling Fan'] },
      { roomNumber: 'SH-302', hostel: shivalik._id, floor: 3, roomType: 'Double', capacity: 2, currentOccupancy: 0, monthlyFee: 6200, status: 'Available', amenities: ['Twin Beds', '2 Desks', 'Cupboard', 'Solar Water'] },
      { roomNumber: 'SH-401', hostel: shivalik._id, floor: 4, roomType: 'Single', capacity: 1, currentOccupancy: 0, monthlyFee: 9000, status: 'Available', amenities: ['Single Suite', 'Air Conditioner', 'Study Desk', 'Lake View'] }
    );

    // Mandakini Girls Rooms
    rooms.push(
      { roomNumber: 'MD-101', hostel: mandakini._id, floor: 1, roomType: 'Single', capacity: 1, currentOccupancy: 0, monthlyFee: 9200, status: 'Available', amenities: ['Ensuite Washroom', 'Single Bed', 'Ergonomic Desk', 'Smart Inverter AC', 'Balcony', 'Geyser'] },
      { roomNumber: 'MD-102', hostel: mandakini._id, floor: 1, roomType: 'Double', capacity: 2, currentOccupancy: 0, monthlyFee: 6800, status: 'Available', amenities: ['Twin Beds', '2 Work Desks', '2 Built-in Wardrobes', 'High-Speed Wi-Fi'] },
      { roomNumber: 'MD-203', hostel: mandakini._id, floor: 2, roomType: 'Double', capacity: 2, currentOccupancy: 0, monthlyFee: 6800, status: 'Available', amenities: ['Twin Beds', 'Study Tables', 'Balcony', 'Solar Geyser'] },
      { roomNumber: 'MD-204', hostel: mandakini._id, floor: 2, roomType: 'Triple', capacity: 3, currentOccupancy: 0, monthlyFee: 5000, status: 'Available', amenities: ['3 Single Beds', '3 Bookcases', '3 Lockers', 'Ceiling Fan'] },
      { roomNumber: 'MD-301', hostel: mandakini._id, floor: 3, roomType: 'Single', capacity: 1, currentOccupancy: 0, monthlyFee: 9200, status: 'Available', amenities: ['Single Bed', 'AC', 'Hillside Balcony', 'Study Desk'] }
    );

    // Nilgiri Scholars Tower Rooms
    rooms.push(
      { roomNumber: 'NL-101', hostel: nilgiri._id, floor: 1, roomType: 'Single', capacity: 1, currentOccupancy: 0, monthlyFee: 12500, status: 'Available', amenities: ['Executive Studio', 'Central AC', 'Kitchenette', 'Ensuite Bath', 'Ergonomic Workstation', 'Laundromat Access'] },
      { roomNumber: 'NL-102', hostel: nilgiri._id, floor: 1, roomType: 'Double', capacity: 2, currentOccupancy: 0, monthlyFee: 8500, status: 'Available', amenities: ['Deluxe Twin Beds', '2 Work Pods', 'Central AC', 'Attached Bath'] },
      { roomNumber: 'NL-201', hostel: nilgiri._id, floor: 2, roomType: 'Single', capacity: 1, currentOccupancy: 0, monthlyFee: 12500, status: 'Available', amenities: ['Scholar Suite', 'Central AC', 'Research Desk', 'High-Speed LAN'] },
      { roomNumber: 'NL-301', hostel: nilgiri._id, floor: 3, roomType: 'Double', capacity: 2, currentOccupancy: 0, monthlyFee: 8500, status: 'Maintenance', amenities: ['Under Annual Renovation', 'Twin Beds'] }
    );

    // Kailash Boys Rooms
    rooms.push(
      { roomNumber: 'KL-101', hostel: kailash._id, floor: 1, roomType: 'Single', capacity: 1, currentOccupancy: 0, monthlyFee: 8000, status: 'Available', amenities: ['Single Bed', 'Optical Fiber LAN', 'Makerspace Access', 'Study Table'] },
      { roomNumber: 'KL-202', hostel: kailash._id, floor: 2, roomType: 'Double', capacity: 2, currentOccupancy: 0, monthlyFee: 5900, status: 'Available', amenities: ['Twin Beds', '2 Workstations', 'Wardrobe', 'Balcony'] },
      { roomNumber: 'KL-304', hostel: kailash._id, floor: 3, roomType: 'Triple', capacity: 3, currentOccupancy: 0, monthlyFee: 4500, status: 'Available', amenities: ['3 Beds', 'Study Desks', 'Lockers', 'Ceiling Fan'] }
    );

    // Gargi Women's Research Rooms
    rooms.push(
      { roomNumber: 'GR-101', hostel: gargi._id, floor: 1, roomType: 'Single', capacity: 1, currentOccupancy: 0, monthlyFee: 8800, status: 'Available', amenities: ['Single Bed', 'Ergonomic Chair & Desk', 'AC', 'Attached Bath', 'Power Backup'] },
      { roomNumber: 'GR-202', hostel: gargi._id, floor: 2, roomType: 'Double', capacity: 2, currentOccupancy: 0, monthlyFee: 6500, status: 'Available', amenities: ['Twin Beds', '2 Study Desks', 'Built-in Lockers', 'Garden View'] }
    );

    const createdRooms = await Room.insertMany(rooms);
    console.log(`✅ ${createdRooms.length} Authentic Rooms seeded across all hostels.`);

    // 5. Create Authentic Student Profiles
    const studentData = [
      {
        name: 'Aarav Patel',
        email: 'aarav.patel@student.edu',
        password: 'Password@123',
        role: 'STUDENT',
        rollNumber: '2024CSB1042',
        course: 'B.Tech Computer Science & Artificial Intelligence',
        year: '3rd Year / 5th Sem',
        phoneNumber: '+91 91234 56781',
        gender: 'Male',
      },
      {
        name: 'Rohan Verma',
        email: 'rohan.verma@student.edu',
        password: 'Password@123',
        role: 'STUDENT',
        rollNumber: '2024CSB1043',
        course: 'B.Tech Computer Science & Artificial Intelligence',
        year: '3rd Year / 5th Sem',
        phoneNumber: '+91 91234 56782',
        gender: 'Male',
      },
      {
        name: 'Ananya Sharma',
        email: 'ananya.sharma@student.edu',
        password: 'Password@123',
        role: 'STUDENT',
        rollNumber: '2024EEB1108',
        course: 'Dual Degree Electrical & Computer Engineering',
        year: '2nd Year / 3rd Sem',
        phoneNumber: '+91 91234 56783',
        gender: 'Female',
      },
      {
        name: 'Sneha Kulkarni',
        email: 'sneha.k@student.edu',
        password: 'Password@123',
        role: 'STUDENT',
        rollNumber: '2025MEB1015',
        course: 'B.Tech Mechanical Engineering',
        year: '1st Year / 1st Sem',
        phoneNumber: '+91 91234 56784',
        gender: 'Female',
      },
      {
        name: 'Vikramaditya Roy',
        email: 'vikram.roy@student.edu',
        password: 'Password@123',
        role: 'STUDENT',
        rollNumber: '2024DSB2005',
        course: 'M.Tech Data Science & Machine Learning',
        year: '1st Year / 2nd Sem',
        phoneNumber: '+91 91234 56785',
        gender: 'Male',
      },
      {
        name: 'Diya Sengupta',
        email: 'diya.sen@student.edu',
        password: 'Password@123',
        role: 'STUDENT',
        rollNumber: '2023BTB1055',
        course: 'B.Tech Biotechnology & Biomedical Devices',
        year: '4th Year / 7th Sem',
        phoneNumber: '+91 91234 56786',
        gender: 'Female',
      },
      {
        name: 'Kavya Nair',
        email: 'kavya.nair@student.edu',
        password: 'Password@123',
        role: 'STUDENT',
        rollNumber: '2024CSB1089',
        course: 'B.Tech Computer Science & Engineering',
        year: '2nd Year / 3rd Sem',
        phoneNumber: '+91 91234 56787',
        gender: 'Female',
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun.mehta@student.edu',
        password: 'Password@123',
        role: 'STUDENT',
        rollNumber: '2023CHB1022',
        course: 'Dual Degree Chemical & Process Engineering',
        year: '3rd Year / 5th Sem',
        phoneNumber: '+91 91234 56788',
        gender: 'Male',
      },
    ];

    const students = [];
    for (const s of studentData) {
      const created = await User.create(s);
      students.push(created);
    }
    console.log(`✅ ${students.length} Student Profiles registered with official college roll numbers.`);

    // 6. Create Allocations & Roommate Pairings
    // Room SH-201 (Double) -> Occupants: Aarav Patel and Rohan Verma
    const roomSH201 = createdRooms.find((r) => r.roomNumber === 'SH-201');

    const appAarav = await Application.create({
      applicationNumber: 'APP-2025-1042',
      student: students[0]._id,
      preferredHostel: shivalik._id,
      roomType: 'Double',
      preferredFloor: 2,
      personalDetails: {
        emergencyContactName: 'Rajesh K. Patel (Father)',
        emergencyContactPhone: '+91 98980 11223',
        bloodGroup: 'B+',
        medicalCondition: 'None',
        specialRequests: 'Allotted for Robotics Lab night shifts; mutual roommate request with Rohan Verma.',
      },
      status: 'Allocated',
      adminRemarks: 'Application verified. Assigned to Shivalik Room SH-201 (Bed A).',
      reviewedBy: admin._id,
      reviewedAt: new Date(Date.now() - 20 * 86400000),
    });

    await Allocation.create({
      student: students[0]._id,
      room: roomSH201._id,
      hostel: shivalik._id,
      application: appAarav._id,
      allocationDate: new Date(Date.now() - 20 * 86400000),
      status: 'Active',
      monthlyFee: roomSH201.monthlyFee,
      allocatedBy: admin._id,
      remarks: 'Bed A allocated. Key issued.',
    });

    const appRohan = await Application.create({
      applicationNumber: 'APP-2025-1043',
      student: students[1]._id,
      preferredHostel: shivalik._id,
      roomType: 'Double',
      preferredFloor: 2,
      personalDetails: {
        emergencyContactName: 'Vikramaditya Verma (Father)',
        emergencyContactPhone: '+91 98980 22334',
        bloodGroup: 'O+',
        medicalCondition: 'None',
        specialRequests: 'Roommate pairing requested with Aarav Patel.',
      },
      status: 'Allocated',
      adminRemarks: 'Roommate pairing approved. Assigned to Shivalik Room SH-201 (Bed B).',
      reviewedBy: admin._id,
      reviewedAt: new Date(Date.now() - 19 * 86400000),
    });

    await Allocation.create({
      student: students[1]._id,
      room: roomSH201._id,
      hostel: shivalik._id,
      application: appRohan._id,
      allocationDate: new Date(Date.now() - 19 * 86400000),
      status: 'Active',
      monthlyFee: roomSH201.monthlyFee,
      allocatedBy: admin._id,
      remarks: 'Bed B allocated. Key issued.',
    });

    roomSH201.currentOccupancy = 2;
    roomSH201.status = 'Full';
    await roomSH201.save();

    // Student 2: Ananya Sharma -> Single Ensuite Room in Mandakini MD-101
    const roomMD101 = createdRooms.find((r) => r.roomNumber === 'MD-101');
    const appAnanya = await Application.create({
      applicationNumber: 'APP-2025-1108',
      student: students[2]._id,
      preferredHostel: mandakini._id,
      roomType: 'Single',
      preferredFloor: 1,
      personalDetails: {
        emergencyContactName: 'Dr. Suniti Sharma (Mother)',
        emergencyContactPhone: '+91 98760 33445',
        bloodGroup: 'A+',
        medicalCondition: 'Mild Asthma (Dust Allergy)',
        specialRequests: 'Quiet single AC room on 1st floor needed for medical and study reasons.',
      },
      status: 'Allocated',
      adminRemarks: 'Medical certificate verified. Single AC suite MD-101 allocated on ground/first floor.',
      reviewedBy: admin._id,
      reviewedAt: new Date(Date.now() - 12 * 86400000),
    });

    await Allocation.create({
      student: students[2]._id,
      room: roomMD101._id,
      hostel: mandakini._id,
      application: appAnanya._id,
      allocationDate: new Date(Date.now() - 12 * 86400000),
      status: 'Active',
      monthlyFee: roomMD101.monthlyFee,
      allocatedBy: admin._id,
      remarks: 'Single room allotment. Ground floor access granted.',
    });

    roomMD101.currentOccupancy = 1;
    roomMD101.status = 'Full';
    await roomMD101.save();

    // Student 6: Kavya Nair -> Allocated to Gargi GR-101 (Single)
    const roomGR101 = createdRooms.find((r) => r.roomNumber === 'GR-101');
    const appKavya = await Application.create({
      applicationNumber: 'APP-2025-1089',
      student: students[6]._id,
      preferredHostel: gargi._id,
      roomType: 'Single',
      preferredFloor: 1,
      personalDetails: {
        emergencyContactName: 'P. N. Nair (Father)',
        emergencyContactPhone: '+91 98400 44556',
        bloodGroup: 'B+',
      },
      status: 'Allocated',
      adminRemarks: 'Approved for Gargi Women Research residence Room GR-101.',
      reviewedBy: admin._id,
      reviewedAt: new Date(Date.now() - 8 * 86400000),
    });

    await Allocation.create({
      student: students[6]._id,
      room: roomGR101._id,
      hostel: gargi._id,
      application: appKavya._id,
      allocationDate: new Date(Date.now() - 8 * 86400000),
      status: 'Active',
      monthlyFee: roomGR101.monthlyFee,
      allocatedBy: admin._id,
      remarks: 'Bed 1 allocated.',
    });

    roomGR101.currentOccupancy = 1;
    roomGR101.status = 'Full';
    await roomGR101.save();

    // Student 7: Arjun Mehta -> Allocated to Kailash KL-202 (Double, 1/2 occupied)
    const roomKL202 = createdRooms.find((r) => r.roomNumber === 'KL-202');
    const appArjun = await Application.create({
      applicationNumber: 'APP-2025-1022',
      student: students[7]._id,
      preferredHostel: kailash._id,
      roomType: 'Double',
      preferredFloor: 2,
      personalDetails: {
        emergencyContactName: 'Raman Mehta (Uncle)',
        emergencyContactPhone: '+91 98300 55667',
        bloodGroup: 'AB+',
      },
      status: 'Allocated',
      adminRemarks: 'Allocated to Kailash Engineering Hall Room KL-202.',
      reviewedBy: admin._id,
      reviewedAt: new Date(Date.now() - 6 * 86400000),
    });

    await Allocation.create({
      student: students[7]._id,
      room: roomKL202._id,
      hostel: kailash._id,
      application: appArjun._id,
      allocationDate: new Date(Date.now() - 6 * 86400000),
      status: 'Active',
      monthlyFee: roomKL202.monthlyFee,
      allocatedBy: admin._id,
      remarks: 'Bed 1 occupied.',
    });

    roomKL202.currentOccupancy = 1;
    roomKL202.status = 'Available'; // 1 bed still available!
    await roomKL202.save();

    // Student 3: Sneha Kulkarni -> Approved application ready in Awaiting Allocation tab
    await Application.create({
      applicationNumber: 'APP-2025-1015',
      student: students[3]._id,
      preferredHostel: mandakini._id,
      roomType: 'Double',
      preferredFloor: 2,
      personalDetails: {
        emergencyContactName: 'Ashok Kulkarni (Father)',
        emergencyContactPhone: '+91 98220 77889',
        bloodGroup: 'B+',
        specialRequests: 'Prefers reading hall proximity for mechanical design study.',
      },
      status: 'Approved',
      adminRemarks: 'Documents and admission verified. Approved for room allotment in Mandakini Hall.',
      reviewedBy: admin._id,
      reviewedAt: new Date(Date.now() - 2 * 86400000),
    });

    // Student 4: Vikramaditya Roy -> Pending Application
    await Application.create({
      applicationNumber: 'APP-2025-2005',
      student: students[4]._id,
      preferredHostel: nilgiri._id,
      roomType: 'Single',
      preferredFloor: 1,
      personalDetails: {
        emergencyContactName: 'Debabrata Roy (Father)',
        emergencyContactPhone: '+91 98100 88991',
        bloodGroup: 'O-',
        specialRequests: 'Postgraduate scholar requiring quiet workspace for machine learning thesis computation.',
      },
      status: 'Pending',
    });

    // Student 5: Diya Sengupta -> Rejected Application
    await Application.create({
      applicationNumber: 'APP-2025-1055',
      student: students[5]._id,
      preferredHostel: mandakini._id,
      roomType: 'Single',
      preferredFloor: 1,
      personalDetails: {
        emergencyContactName: 'Subir Sengupta (Father)',
        emergencyContactPhone: '+91 98310 99002',
        bloodGroup: 'A-',
      },
      status: 'Rejected',
      adminRemarks: 'Single AC suites in Mandakini are currently at 100% capacity. Please re-apply selecting Double sharing or Gargi Women Residence.',
      reviewedBy: admin._id,
      reviewedAt: new Date(Date.now() - 4 * 86400000),
    });

    console.log('✅ Real University Applications & Allocations seeded with live occupancy.');
    console.log('------------------------------------------------------------');
    console.log('🌟 READY VERIFIED CREDENTIALS:');
    console.log(`👨‍💼 CHIEF WARDEN (Admin):`);
    console.log(`   Email   : ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`👨‍🎓 STUDENT (Allocated with Roommate in Shivalik Room SH-201):`);
    console.log(`   Email   : aarav.patel@student.edu`);
    console.log(`   Password: Password@123`);
    console.log(`👨‍🎓 STUDENT (Roommate in Shivalik Room SH-201):`);
    console.log(`   Email   : rohan.verma@student.edu`);
    console.log(`   Password: Password@123`);
    console.log(`👩‍🎓 STUDENT (Single Ensuite Suite in Mandakini MD-101):`);
    console.log(`   Email   : ananya.sharma@student.edu`);
    console.log(`   Password: Password@123`);
    console.log(`👩‍🎓 STUDENT (Approved Application awaiting room):`);
    console.log(`   Email   : sneha.k@student.edu`);
    console.log(`   Password: Password@123`);
    console.log(`👨‍🎓 STUDENT (Pending Application in Nilgiri Scholars Tower):`);
    console.log(`   Email   : vikram.roy@student.edu`);
    console.log(`   Password: Password@123`);
    console.log('------------------------------------------------------------');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding realistic demo data:', error);
    process.exit(1);
  }
};

seedDemoData();
