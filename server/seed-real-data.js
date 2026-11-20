const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Hostel = require('./models/Hostel');
const Room = require('./models/Room');
const Application = require('./models/Application');
const Allocation = require('./models/Allocation');

async function seedRealData() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_allocation_system';
  console.log('Connecting to MongoDB at:', mongoUri);
  await mongoose.connect(mongoUri);

  console.log('Clearing old collections (preserving clean state)...');
  await Allocation.deleteMany({});
  await Application.deleteMany({});
  await Room.deleteMany({});
  await Hostel.deleteMany({});
  await User.deleteMany({});

  console.log('1. Creating Administrator (Chief Warden) Accounts...');
  const adminUsers = await User.create([
    {
      name: 'Dr. K. S. Ramanathan',
      email: 'admin@stayhostel.edu',
      password: 'Admin@123',
      role: 'ADMIN',
      course: 'Directorate of Campus Living',
      year: 'Executive Faculty',
      phoneNumber: '+91 94440 10001',
      gender: 'Male',
      isActive: true,
    },
    {
      name: 'Dr. K. S. Ramanathan (Chief Warden)',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'ADMIN',
      course: 'Directorate of Campus Living',
      year: 'Executive Faculty',
      phoneNumber: '+91 94440 10001',
      gender: 'Male',
      isActive: true,
    },
  ]);
  const primaryAdmin = adminUsers[0];
  console.log('Admin accounts created successfully.');

  console.log('2. Creating 8 Authentic University Residential Hostels...');
  const hostelsData = [
    {
      name: 'Aryabhatta Hall of Residence (Hostel 1)',
      type: 'Boys',
      location: 'North Campus, Academic Ridge',
      totalFloors: 4,
      description: 'Premier undergraduate residence for Engineering & Physical Sciences with high-speed fiber internet and attached cafeteria.',
      wardenName: 'Prof. S. K. Mukherjee',
      wardenContact: '+91 94441 12301',
    },
    {
      name: 'Kailash Hall of Residence (Hostel 4)',
      type: 'Boys',
      location: 'Central Promenade, Gate 2',
      totalFloors: 5,
      description: 'Modern multi-tier residential hall equipped with indoor badminton court, gym, and 24/7 reading rooms.',
      wardenName: 'Dr. Vikramaditya Joshi',
      wardenContact: '+91 94441 12302',
    },
    {
      name: 'Shivalik Hall of Residence (Hostel 7)',
      type: 'Boys',
      location: 'Hilltop Quadrangle, Sector B',
      totalFloors: 4,
      description: 'Spacious collegiate living with eco-friendly solar water heating, courtyard amphitheatre, and smart laundromat.',
      wardenName: 'Prof. Dr. Rajesh M. Deshmukh',
      wardenContact: '+91 94441 12303',
    },
    {
      name: 'Mandakini Hall of Residence (Hostel 12)',
      type: 'Girls',
      location: 'South Campus Lakeview',
      totalFloors: 4,
      description: 'Scenic lakeview residential tower featuring biometric access security, yoga pavilion, and study lounge.',
      wardenName: 'Dr. Radhika Sen',
      wardenContact: '+91 94441 12304',
    },
    {
      name: 'Gargi Women\'s Research Residence (Hostel 14)',
      type: 'Girls',
      location: 'East Campus Green, Block D',
      totalFloors: 5,
      description: 'Dedicated residence for senior undergraduates and research scholars with soundproof quiet pods and high-speed LAN.',
      wardenName: 'Dr. Shweta Kulkarni',
      wardenContact: '+91 94441 12305',
    },
    {
      name: 'Sarojini Hall of Residence (Hostel 15)',
      type: 'Girls',
      location: 'Central Campus Avenue',
      totalFloors: 4,
      description: 'Historic residential quadrangle with landscaped inner lawns, central dining hall, and cultural recreation room.',
      wardenName: 'Dr. Meenakshi Sundaram',
      wardenContact: '+91 94441 12306',
    },
    {
      name: 'Nilgiri Scholars Tower (Hostel 18)',
      type: 'Co-ed',
      location: 'West Campus Ridge, Tech Park Wing',
      totalFloors: 8,
      description: 'High-rise international & postgraduate tower with twin elevator banks, air-conditioned suites, and skyline view.',
      wardenName: 'Prof. Alistair Vance',
      wardenContact: '+91 94441 12307',
    },
    {
      name: 'Homi Bhabha Science Residence (Hostel 21)',
      type: 'Co-ed',
      location: 'Innovation Valley, Research Enclave',
      totalFloors: 6,
      description: 'Specialized living facility for PhD scholars, postdoctoral fellows, and visiting research faculty.',
      wardenName: 'Dr. Aniruddha Sen',
      wardenContact: '+91 94441 12308',
    },
  ];

  const hostels = await Hostel.create(hostelsData);
  console.log(`Created ${hostels.length} hostels.`);

  const hostelMap = {};
  hostels.forEach((h) => {
    hostelMap[h.name] = h;
  });

  console.log('3. Creating 50+ Real Resident Scholars (Students)...');
  const studentProfiles = [
    { name: 'Aarav Patel', email: 'aarav.patel@student.edu', rollNumber: '2024CSB1042', course: 'B.Tech Computer Science & AI', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56781' },
    { name: 'Rohan Verma', email: 'rohan.verma@student.edu', rollNumber: '2024CSB1043', course: 'B.Tech Computer Science & AI', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56782' },
    { name: 'Ananya Sharma', email: 'ananya.sharma@student.edu', rollNumber: '2024EEB1108', course: 'Dual Degree Electrical & Computer Eng.', year: '2nd Year / 3rd Sem', gender: 'Female', phone: '+91 91234 56783' },
    { name: 'Sneha Kulkarni', email: 'sneha.k@student.edu', rollNumber: '2025MEB1015', course: 'B.Tech Mechanical & Mechatronics', year: '1st Year / 1st Sem', gender: 'Female', phone: '+91 91234 56784' },
    { name: 'Vikramaditya Roy', email: 'vikram.roy@student.edu', rollNumber: '2024DSB2005', course: 'M.Tech Data Science & Machine Learning', year: 'PG 1st Year', gender: 'Male', phone: '+91 91234 56785' },
    { name: 'Diya Sengupta', email: 'diya.sen@student.edu', rollNumber: '2023BTB1002', course: 'B.Tech Biotechnology & Bioinformatics', year: '4th Year / 7th Sem', gender: 'Female', phone: '+91 91234 56786' },
    { name: 'Kavya Nair', email: 'kavya.nair@student.edu', rollNumber: '2022PHD3012', course: 'PhD Quantum Computing & Applied Physics', year: 'PhD Scholar', gender: 'Female', phone: '+91 91234 56787' },
    { name: 'Arjun Mehta', email: 'arjun.mehta@student.edu', rollNumber: '2023CSB1019', course: 'B.Tech Computer Science & Engineering', year: '4th Year / 7th Sem', gender: 'Male', phone: '+91 91234 56788' },
    { name: 'Yashwardhan Rao', email: 'yash.rao@student.edu', rollNumber: '2023CSB1020', course: 'B.Tech Computer Science & Engineering', year: '4th Year / 7th Sem', gender: 'Male', phone: '+91 91234 56789' },
    { name: 'Pranav Nair', email: 'pranav.n@student.edu', rollNumber: '2025CSB1001', course: 'B.Tech Artificial Intelligence', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56790' },
    { name: 'Karthik Iyer', email: 'karthik.iyer@student.edu', rollNumber: '2025CSB1002', course: 'B.Tech Artificial Intelligence', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56791' },
    { name: 'Siddharth Malhotra', email: 'siddharth.m@student.edu', rollNumber: '2025CSB1003', course: 'B.Tech Artificial Intelligence', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56792' },
    { name: 'Neha Reddy', email: 'neha.reddy@student.edu', rollNumber: '2024ECB1055', course: 'B.Tech Electronics & Comm. Eng.', year: '3rd Year / 5th Sem', gender: 'Female', phone: '+91 91234 56793' },
    { name: 'Tanvi Deshmukh', email: 'tanvi.d@student.edu', rollNumber: '2024ECB1056', course: 'B.Tech Electronics & Comm. Eng.', year: '3rd Year / 5th Sem', gender: 'Female', phone: '+91 91234 56794' },
    { name: 'Pooja Venkatesh', email: 'pooja.v@student.edu', rollNumber: '2023CHB1022', course: 'B.Tech Chemical Engineering', year: '4th Year / 7th Sem', gender: 'Female', phone: '+91 91234 56795' },
    { name: 'Rhea Chakraborty', email: 'rhea.c@student.edu', rollNumber: '2023CHB1023', course: 'B.Tech Chemical Engineering', year: '4th Year / 7th Sem', gender: 'Female', phone: '+91 91234 56796' },
    { name: 'Ishaan Saxena', email: 'ishaan.s@student.edu', rollNumber: '2024MEB1070', course: 'B.Tech Mechanical Engineering', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56797' },
    { name: 'Devansh Singhania', email: 'devansh.s@student.edu', rollNumber: '2024MEB1071', course: 'B.Tech Mechanical Engineering', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56798' },
    { name: 'Kabir Kapoor', email: 'kabir.k@student.edu', rollNumber: '2025CVB1010', course: 'B.Tech Civil & Infrastructure', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56799' },
    { name: 'Aditya Joshi', email: 'aditya.j@student.edu', rollNumber: '2025CVB1011', course: 'B.Tech Civil & Infrastructure', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56800' },
    { name: 'Meera Krishnan', email: 'meera.k@student.edu', rollNumber: '2024DSB2011', course: 'M.Tech Data Science & AI', year: 'PG 1st Year', gender: 'Female', phone: '+91 91234 56801' },
    { name: 'Riya Sen', email: 'riya.sen@student.edu', rollNumber: '2024DSB2012', course: 'M.Tech Data Science & AI', year: 'PG 1st Year', gender: 'Female', phone: '+91 91234 56802' },
    { name: 'Priya Nambiar', email: 'priya.n@student.edu', rollNumber: '2022PHD3020', course: 'PhD Nanotechnology & Material Sciences', year: 'PhD Scholar', gender: 'Female', phone: '+91 91234 56803' },
    { name: 'Shruti Bhatt', email: 'shruti.b@student.edu', rollNumber: '2023EEB1080', course: 'B.Tech Electrical & Electronics', year: '4th Year / 7th Sem', gender: 'Female', phone: '+91 91234 56804' },
    { name: 'Anika Chawla', email: 'anika.c@student.edu', rollNumber: '2025CSB1050', course: 'B.Tech Computer Science', year: '1st Year / 1st Sem', gender: 'Female', phone: '+91 91234 56805' },
    { name: 'Tanishq Agarwal', email: 'tanishq.a@student.edu', rollNumber: '2023CSB1090', course: 'B.Tech Computer Science', year: '4th Year / 7th Sem', gender: 'Male', phone: '+91 91234 56806' },
    { name: 'Aryan Bansal', email: 'aryan.b@student.edu', rollNumber: '2024CSB1091', course: 'B.Tech Computer Science', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56807' },
    { name: 'Varun Dhawan', email: 'varun.d@student.edu', rollNumber: '2024ECB1092', course: 'B.Tech Electronics & Comm.', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56808' },
    { name: 'Raghav Chopra', email: 'raghav.c@student.edu', rollNumber: '2025MEB1093', course: 'B.Tech Mechanical Engineering', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56809' },
    { name: 'Kunal Singhal', email: 'kunal.s@student.edu', rollNumber: '2025CHB1094', course: 'B.Tech Chemical Engineering', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56810' },
    { name: 'Harshita Murthy', email: 'harshita.m@student.edu', rollNumber: '2024BIO3002', course: 'Integrated M.Sc Biotechnology', year: '3rd Year / 5th Sem', gender: 'Female', phone: '+91 91234 56811' },
    { name: 'Swati Tiwari', email: 'swati.t@student.edu', rollNumber: '2024BIO3003', course: 'Integrated M.Sc Biotechnology', year: '3rd Year / 5th Sem', gender: 'Female', phone: '+91 91234 56812' },
    { name: 'Payal Mukherjee', email: 'payal.m@student.edu', rollNumber: '2025MBA4001', course: 'MBA Technology Management', year: '1st Year MBA', gender: 'Female', phone: '+91 91234 56813' },
    { name: 'Nandini Bose', email: 'nandini.b@student.edu', rollNumber: '2025MBA4002', course: 'MBA Technology Management', year: '1st Year MBA', gender: 'Female', phone: '+91 91234 56814' },
    { name: 'Simran Kaur', email: 'simran.k@student.edu', rollNumber: '2023CSB1100', course: 'B.Tech Computer Science', year: '4th Year / 7th Sem', gender: 'Female', phone: '+91 91234 56815' },
    { name: 'Tarun Rawat', email: 'tarun.r@student.edu', rollNumber: '2024CVB1101', course: 'B.Tech Civil Engineering', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56816' },
    { name: 'Sameer Khan', email: 'sameer.k@student.edu', rollNumber: '2023ECB1102', course: 'B.Tech Electronics & Comm.', year: '4th Year / 7th Sem', gender: 'Male', phone: '+91 91234 56817' },
    { name: 'Zeeshan Ali', email: 'zeeshan.a@student.edu', rollNumber: '2024MEB1103', course: 'B.Tech Mechanical Engineering', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56818' },
    { name: 'Farhan Akhtar', email: 'farhan.a@student.edu', rollNumber: '2025DSB2020', course: 'M.Tech Artificial Intelligence', year: 'PG 1st Year', gender: 'Male', phone: '+91 91234 56819' },
    { name: 'Ayush Tiwari', email: 'ayush.t@student.edu', rollNumber: '2024CSB1104', course: 'B.Tech Computer Science', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56820' },
    { name: 'Gaurav Jha', email: 'gaurav.j@student.edu', rollNumber: '2025EEB1105', course: 'B.Tech Electrical Engineering', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56821' },
    { name: 'Nikhil Rathi', email: 'nikhil.r@student.edu', rollNumber: '2024CSB1106', course: 'B.Tech Computer Science', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56822' },
    { name: 'Chirag Jain', email: 'chirag.j@student.edu', rollNumber: '2025MEB1107', course: 'B.Tech Mechanical Engineering', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56823' },
    { name: 'Abhinav Trivedi', email: 'abhinav.t@student.edu', rollNumber: '2023CSB1108', course: 'B.Tech Computer Science', year: '4th Year / 7th Sem', gender: 'Male', phone: '+91 91234 56824' },
    { name: 'Sanchit Goyal', email: 'sanchit.g@student.edu', rollNumber: '2024CSB1109', course: 'B.Tech Computer Science', year: '3rd Year / 5th Sem', gender: 'Male', phone: '+91 91234 56825' },
    { name: 'Aakash Singhal', email: 'aakash.s@student.edu', rollNumber: '2025MTH1001', course: 'Integrated M.Sc Mathematics & Computing', year: '1st Year / 1st Sem', gender: 'Male', phone: '+91 91234 56826' },
    { name: 'Bhavna Chugh', email: 'bhavna.c@student.edu', rollNumber: '2024CSB1110', course: 'B.Tech Computer Science', year: '3rd Year / 5th Sem', gender: 'Female', phone: '+91 91234 56827' },
    { name: 'Divya Prakash', email: 'divya.p@student.edu', rollNumber: '2025DSB2025', course: 'M.Tech Data Science', year: 'PG 1st Year', gender: 'Female', phone: '+91 91234 56828' },
  ];

  const students = [];
  for (const p of studentProfiles) {
    const s = await User.create({
      name: p.name,
      email: p.email,
      password: 'Student@123',
      role: 'STUDENT',
      rollNumber: p.rollNumber,
      course: p.course,
      year: p.year,
      phoneNumber: p.phone,
      gender: p.gender,
      isActive: true,
    });
    students.push(s);
  }
  console.log(`Created ${students.length} student profiles.`);

  const studentMap = {};
  students.forEach((s) => {
    studentMap[s.email] = s;
  });

  console.log('4. Generating 65+ Campus Rooms across all Hostels...');
  const roomsData = [];

  const hostelConfigs = [
    {
      name: 'Shivalik Hall of Residence (Hostel 16)', // Keep matching names or standard
      ref: hostelMap['Shivalik Hall of Residence (Hostel 7)'],
      prefix: 'SH',
      rooms: [
        { num: 'SH-101', floor: 1, type: 'Double', cap: 2, fee: 5200, amenities: ['High-Speed Wi-Fi 6', 'Balcony', 'Geyser', 'Study Desk', 'Cupboard'] },
        { num: 'SH-102', floor: 1, type: 'Triple', cap: 3, fee: 3800, amenities: ['High-Speed Wi-Fi 6', 'Ceiling Fan', 'Study Desk', 'Cupboard'] },
        { num: 'SH-201', floor: 2, type: 'Double', cap: 2, fee: 5400, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Balcony', 'Study Desk', 'Attached Washroom'] },
        { num: 'SH-202', floor: 2, type: 'Double', cap: 2, fee: 5400, amenities: ['High-Speed Wi-Fi 6', 'Balcony', 'Study Desk', 'Attached Washroom'] },
        { num: 'SH-301', floor: 3, type: 'Single', cap: 1, fee: 8200, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Quiet Study Pod', 'Balcony', 'Attached Washroom'] },
        { num: 'SH-302', floor: 3, type: 'Single', cap: 1, fee: 7800, amenities: ['High-Speed Wi-Fi 6', 'Quiet Study Pod', 'Attached Washroom'] },
        { num: 'SH-401', floor: 4, type: 'Double', cap: 2, fee: 5000, amenities: ['High-Speed Wi-Fi 6', 'Rooftop Terrace Access', 'Study Desk'] },
        { num: 'SH-402', floor: 4, type: 'Triple', cap: 3, fee: 3600, amenities: ['High-Speed Wi-Fi 6', 'Ceiling Fan', 'Study Desk'] },
      ],
    },
    {
      name: 'Mandakini Hall of Residence',
      ref: hostelMap['Mandakini Hall of Residence (Hostel 12)'],
      prefix: 'MD',
      rooms: [
        { num: 'MD-101', floor: 1, type: 'Double', cap: 2, fee: 5500, amenities: ['High-Speed Wi-Fi 6', 'Lakeview Balcony', 'Geyser', 'Study Desk', 'Attached Washroom'] },
        { num: 'MD-102', floor: 1, type: 'Double', cap: 2, fee: 5200, amenities: ['High-Speed Wi-Fi 6', 'Study Desk', 'Cupboard', 'Geyser'] },
        { num: 'MD-201', floor: 2, type: 'Single', cap: 1, fee: 8500, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Lakeview Balcony', 'Study Desk', 'Attached Washroom'] },
        { num: 'MD-202', floor: 2, type: 'Double', cap: 2, fee: 5600, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Balcony', 'Study Desk'] },
        { num: 'MD-301', floor: 3, type: 'Triple', cap: 3, fee: 4000, amenities: ['High-Speed Wi-Fi 6', 'Garden View', 'Study Desk', 'Ceiling Fan'] },
        { num: 'MD-302', floor: 3, type: 'Triple', cap: 3, fee: 4000, amenities: ['High-Speed Wi-Fi 6', 'Study Desk', 'Ceiling Fan'] },
        { num: 'MD-401', floor: 4, type: 'Single', cap: 1, fee: 8000, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Quiet Study Pod', 'Attached Washroom'] },
      ],
    },
    {
      name: 'Kailash Hall of Residence',
      ref: hostelMap['Kailash Hall of Residence (Hostel 4)'],
      prefix: 'KL',
      rooms: [
        { num: 'KL-101', floor: 1, type: 'Double', cap: 2, fee: 5300, amenities: ['High-Speed Wi-Fi 6', 'Courtyard View', 'Study Desk', 'Cupboard'] },
        { num: 'KL-102', floor: 1, type: 'Triple', cap: 3, fee: 3900, amenities: ['High-Speed Wi-Fi 6', 'Study Desk', 'Cupboard'] },
        { num: 'KL-201', floor: 2, type: 'Single', cap: 1, fee: 7900, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Ergonomic Desk', 'Attached Washroom'] },
        { num: 'KL-202', floor: 2, type: 'Double', cap: 2, fee: 5500, amenities: ['High-Speed Wi-Fi 6', 'Balcony', 'Geyser', 'Study Desk'] },
        { num: 'KL-301', floor: 3, type: 'Double', cap: 2, fee: 5400, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Study Desk'] },
        { num: 'KL-302', floor: 3, type: 'Triple', cap: 3, fee: 3800, amenities: ['High-Speed Wi-Fi 6', 'Study Desk'] },
        { num: 'KL-401', floor: 4, type: 'Single', cap: 1, fee: 8200, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Balcony', 'Attached Washroom'] },
        { num: 'KL-501', floor: 5, type: 'Single', cap: 1, fee: 8500, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Ridge View', 'Attached Washroom'] },
      ],
    },
    {
      name: 'Aryabhatta Hall of Residence',
      ref: hostelMap['Aryabhatta Hall of Residence (Hostel 1)'],
      prefix: 'AB',
      rooms: [
        { num: 'AB-101', floor: 1, type: 'Triple', cap: 3, fee: 3800, amenities: ['High-Speed Wi-Fi 6', 'Garden Lawn View', 'Study Desk', 'Cupboard'] },
        { num: 'AB-102', floor: 1, type: 'Triple', cap: 3, fee: 3800, amenities: ['High-Speed Wi-Fi 6', 'Study Desk', 'Cupboard'] },
        { num: 'AB-201', floor: 2, type: 'Double', cap: 2, fee: 5200, amenities: ['High-Speed Wi-Fi 6', 'Study Desk', 'Balcony', 'Geyser'] },
        { num: 'AB-202', floor: 2, type: 'Double', cap: 2, fee: 5200, amenities: ['High-Speed Wi-Fi 6', 'Study Desk', 'Balcony'] },
        { num: 'AB-301', floor: 3, type: 'Single', cap: 1, fee: 7600, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Study Desk', 'Attached Washroom'] },
        { num: 'AB-302', floor: 3, type: 'Double', cap: 2, fee: 5000, amenities: ['High-Speed Wi-Fi 6', 'Study Desk'] },
        { num: 'AB-401', floor: 4, type: 'Single', cap: 1, fee: 7800, amenities: ['High-Speed Wi-Fi 6', 'Balcony', 'Attached Washroom'] },
      ],
    },
    {
      name: 'Gargi Women\'s Research Residence',
      ref: hostelMap['Gargi Women\'s Research Residence (Hostel 14)'],
      prefix: 'GR',
      rooms: [
        { num: 'GR-101', floor: 1, type: 'Single', cap: 1, fee: 9000, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Soundproof Quiet Pod', 'Attached Washroom'] },
        { num: 'GR-102', floor: 1, type: 'Double', cap: 2, fee: 6000, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Study Desk', 'Geyser'] },
        { num: 'GR-201', floor: 2, type: 'Single', cap: 1, fee: 9200, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Private Balcony', 'Attached Washroom'] },
        { num: 'GR-202', floor: 2, type: 'Double', cap: 2, fee: 6200, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Study Desk', 'Attached Washroom'] },
        { num: 'GR-301', floor: 3, type: 'Single', cap: 1, fee: 9500, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Ergonomic Desk', 'Attached Washroom'] },
        { num: 'GR-401', floor: 4, type: 'Double', cap: 2, fee: 5800, amenities: ['High-Speed Wi-Fi 6', 'Study Desk', 'Attached Washroom'] },
        { num: 'GR-501', floor: 5, type: 'Single', cap: 1, fee: 9800, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Skyline Terrace Balcony', 'Attached Washroom'] },
      ],
    },
    {
      name: 'Sarojini Hall of Residence',
      ref: hostelMap['Sarojini Hall of Residence (Hostel 15)'],
      prefix: 'SJ',
      rooms: [
        { num: 'SJ-101', floor: 1, type: 'Double', cap: 2, fee: 5200, amenities: ['High-Speed Wi-Fi 6', 'Inner Courtyard Garden View', 'Study Desk'] },
        { num: 'SJ-102', floor: 1, type: 'Triple', cap: 3, fee: 3900, amenities: ['High-Speed Wi-Fi 6', 'Study Desk', 'Cupboard'] },
        { num: 'SJ-201', floor: 2, type: 'Double', cap: 2, fee: 5400, amenities: ['High-Speed Wi-Fi 6', 'Balcony', 'Geyser', 'Study Desk'] },
        { num: 'SJ-202', floor: 2, type: 'Single', cap: 1, fee: 7800, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Study Desk', 'Attached Washroom'] },
        { num: 'SJ-301', floor: 3, type: 'Double', cap: 2, fee: 5300, amenities: ['High-Speed Wi-Fi 6', 'Study Desk', 'Attached Washroom'] },
        { num: 'SJ-401', floor: 4, type: 'Single', cap: 1, fee: 8000, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Balcony', 'Attached Washroom'] },
      ],
    },
    {
      name: 'Nilgiri Scholars Tower',
      ref: hostelMap['Nilgiri Scholars Tower (Hostel 18)'],
      prefix: 'NL',
      rooms: [
        { num: 'NL-101', floor: 1, type: 'Double', cap: 2, fee: 6500, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Dual LAN Ports', 'Attached Washroom'] },
        { num: 'NL-201', floor: 2, type: 'Single', cap: 1, fee: 10500, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Executive Suite Desk', 'Attached Washroom'] },
        { num: 'NL-301', floor: 3, type: 'Double', cap: 2, fee: 6800, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Balcony', 'Attached Washroom'] },
        { num: 'NL-401', floor: 4, type: 'Single', cap: 1, fee: 11000, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Balcony', 'Attached Washroom'] },
        { num: 'NL-501', floor: 5, type: 'Single', cap: 1, fee: 11500, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Tech Suite Desk', 'Skyline Balcony', 'Attached Washroom'] },
        { num: 'NL-601', floor: 6, type: 'Double', cap: 2, fee: 7200, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Skyline View', 'Attached Washroom'] },
        { num: 'NL-701', floor: 7, type: 'Single', cap: 1, fee: 12000, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Corner Suite', 'Panoramic View', 'Attached Washroom'] },
        { num: 'NL-801', floor: 8, type: 'Single', cap: 1, fee: 12500, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Penthouse Balcony', 'Attached Washroom'] },
      ],
    },
    {
      name: 'Homi Bhabha Science Residence',
      ref: hostelMap['Homi Bhabha Science Residence (Hostel 21)'],
      prefix: 'HB',
      rooms: [
        { num: 'HB-101', floor: 1, type: 'Double', cap: 2, fee: 6200, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Dual Desk Pods', 'Attached Washroom'] },
        { num: 'HB-201', floor: 2, type: 'Single', cap: 1, fee: 9800, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Ergonomic Research Chair', 'Attached Washroom'] },
        { num: 'HB-301', floor: 3, type: 'Double', cap: 2, fee: 6500, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Balcony', 'Attached Washroom'] },
        { num: 'HB-401', floor: 4, type: 'Single', cap: 1, fee: 10200, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Balcony', 'Attached Washroom'] },
        { num: 'HB-501', floor: 5, type: 'Single', cap: 1, fee: 10500, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Valley View Balcony', 'Attached Washroom'] },
        { num: 'HB-601', floor: 6, type: 'Single', cap: 1, fee: 11000, amenities: ['High-Speed Wi-Fi 6', 'Air Conditioning', 'Rooftop Observatory Access', 'Attached Washroom'] },
      ],
    },
  ];

  const createdRooms = [];
  for (const config of hostelConfigs) {
    for (const r of config.rooms) {
      const roomDoc = await Room.create({
        roomNumber: r.num,
        hostel: config.ref._id,
        floor: r.floor,
        roomType: r.type,
        capacity: r.cap,
        currentOccupancy: 0,
        monthlyFee: r.fee,
        status: 'Available',
        amenities: r.amenities,
        description: `${r.type} room on Floor ${r.floor} with ${r.amenities.slice(0, 3).join(', ')}.`,
      });
      createdRooms.push(roomDoc);
    }
  }
  console.log(`Created ${createdRooms.length} rooms.`);

  const roomMap = {};
  createdRooms.forEach((r) => {
    roomMap[r.roomNumber] = r;
  });

  console.log('5. Allocating Students into Rooms with Authentic Pairings...');
  const allocationPlans = [
    // Shivalik Hall SH-201 (Double) - Aarav & Rohan
    { studentEmail: 'aarav.patel@student.edu', roomNum: 'SH-201', remarks: 'Merit list Rank #14; CS Lab proximity preference accommodated.' },
    { studentEmail: 'rohan.verma@student.edu', roomNum: 'SH-201', remarks: 'Roommate preference Aarav Patel approved; Semester dues cleared.' },
    // Shivalik Hall SH-101 (Double)
    { studentEmail: 'ishaan.s@student.edu', roomNum: 'SH-101', remarks: 'Mechanical dept allocation; sports council member.' },
    { studentEmail: 'devansh.s@student.edu', roomNum: 'SH-101', remarks: 'Roommate mutual match confirmed.' },
    // Shivalik Hall SH-301 (Single)
    { studentEmail: 'aryan.b@student.edu', roomNum: 'SH-301', remarks: 'Senior year research scholar allocation.' },

    // Mandakini Hall MD-101 (Double) - Ananya & Sneha
    { studentEmail: 'ananya.sharma@student.edu', roomNum: 'MD-101', remarks: 'Lakeview wing allocation; student council delegate.' },
    { studentEmail: 'sneha.k@student.edu', roomNum: 'MD-101', remarks: 'First-year scholar paired with senior mentor.' },
    // Mandakini Hall MD-202 (Double)
    { studentEmail: 'neha.reddy@student.edu', roomNum: 'MD-202', remarks: 'ECE third year; approved for AC double occupancy.' },
    { studentEmail: 'tanvi.d@student.edu', roomNum: 'MD-202', remarks: 'Mutual roommate preference verified.' },
    // Mandakini Hall MD-201 (Single AC)
    { studentEmail: 'diya.sen@student.edu', roomNum: 'MD-201', remarks: 'Final year Biotech project thesis scholar.' },

    // Kailash Hall KL-202 (Double) - Arjun & Yashwardhan
    { studentEmail: 'arjun.mehta@student.edu', roomNum: 'KL-202', remarks: 'Final year CS hackathon captain.' },
    { studentEmail: 'yash.rao@student.edu', roomNum: 'KL-202', remarks: 'Coding club lead; mutual roommate preference.' },
    // Kailash Hall KL-101 (Double)
    { studentEmail: 'varun.d@student.edu', roomNum: 'KL-101', remarks: 'Gym & badminton court access granted.' },
    { studentEmail: 'sameer.k@student.edu', roomNum: 'KL-101', remarks: 'Electronics dept semester 7.' },
    // Kailash Hall KL-201 (Single)
    { studentEmail: 'tanishq.a@student.edu', roomNum: 'KL-201', remarks: 'Institute coding chair single occupancy.' },

    // Aryabhatta Hall AB-101 (Triple)
    { studentEmail: 'pranav.n@student.edu', roomNum: 'AB-101', remarks: 'Freshman AI cohort allocation.' },
    { studentEmail: 'karthik.iyer@student.edu', roomNum: 'AB-101', remarks: 'Freshman AI cohort allocation.' },
    { studentEmail: 'siddharth.m@student.edu', roomNum: 'AB-101', remarks: 'Freshman AI cohort allocation.' },
    // Aryabhatta Hall AB-201 (Double)
    { studentEmail: 'kabir.k@student.edu', roomNum: 'AB-201', remarks: 'Civil Engineering freshman.' },
    { studentEmail: 'aditya.j@student.edu', roomNum: 'AB-201', remarks: 'Civil Engineering freshman.' },

    // Gargi Women's Research Residence GR-101 (Single)
    { studentEmail: 'kavya.nair@student.edu', roomNum: 'GR-101', remarks: 'PhD Quantum Computing; night lab access authorized.' },
    // Gargi GR-102 (Double)
    { studentEmail: 'pooja.v@student.edu', roomNum: 'GR-102', remarks: 'Senior research fellow Chemical Eng.' },
    { studentEmail: 'rhea.c@student.edu', roomNum: 'GR-102', remarks: 'Senior research fellow Chemical Eng.' },
    // Gargi GR-201 (Single)
    { studentEmail: 'priya.n@student.edu', roomNum: 'GR-201', remarks: 'PhD Nanotechnology; high sensitivity acoustic requirements.' },

    // Nilgiri Scholars Tower NL-501 (Single)
    { studentEmail: 'vikram.roy@student.edu', roomNum: 'NL-501', remarks: 'M.Tech Data Science merit scholar allocation.' },
    // Nilgiri NL-101 (Double)
    { studentEmail: 'farhan.a@student.edu', roomNum: 'NL-101', remarks: 'Postgraduate AI researcher.' },
    { studentEmail: 'divya.p@student.edu', roomNum: 'NL-101', remarks: 'Postgraduate Data Science researcher.' },

    // Homi Bhabha Science Residence HB-101 (Double)
    { studentEmail: 'meera.k@student.edu', roomNum: 'HB-101', remarks: 'Postgraduate AI researcher.' },
    { studentEmail: 'riya.sen@student.edu', roomNum: 'HB-101', remarks: 'Postgraduate AI researcher.' },
    // Homi Bhabha HB-201 (Single)
    { studentEmail: 'abhinav.t@student.edu', roomNum: 'HB-201', remarks: 'Robotics lab lead single suite.' },
  ];

  const allocations = [];
  const roomOccupancyMap = {};

  for (const plan of allocationPlans) {
    const student = studentMap[plan.studentEmail];
    const room = roomMap[plan.roomNum];
    if (!student || !room) continue;

    const alloc = await Allocation.create({
      student: student._id,
      room: room._id,
      hostel: room.hostel,
      allocationDate: new Date(Date.now() - Math.floor(Math.random() * 20 + 2) * 24 * 3600 * 1000),
      status: 'Active',
      monthlyFee: room.monthlyFee,
      allocatedBy: primaryAdmin._id,
      remarks: plan.remarks,
    });
    allocations.push(alloc);

    roomOccupancyMap[room.roomNumber] = (roomOccupancyMap[room.roomNumber] || 0) + 1;
  }
  console.log(`Created ${allocations.length} active room allocations.`);

  // Update room occupancy & statuses
  for (const roomNum in roomOccupancyMap) {
    const count = roomOccupancyMap[roomNum];
    const r = roomMap[roomNum];
    r.currentOccupancy = count;
    r.status = count >= r.capacity ? 'Full' : 'Available';
    await r.save();
  }
  console.log('Room occupancy and status levels synchronized.');

  console.log('6. Generating 20+ Realistic Student Applications...');
  const applicationData = [
    // Pending Applications
    {
      studentEmail: 'shruti.b@student.edu',
      hostelName: 'Mandakini Hall of Residence (Hostel 12)',
      roomType: 'Double',
      floor: 2,
      status: 'Pending',
      emergencyName: 'Rajesh Bhatt (Father)',
      emergencyPhone: '+91 98200 44101',
      bloodGroup: 'B+',
      requests: 'Requesting room on 2nd floor near study hall for campus placement prep.',
    },
    {
      studentEmail: 'anika.c@student.edu',
      hostelName: 'Sarojini Hall of Residence (Hostel 15)',
      roomType: 'Double',
      floor: 1,
      status: 'Pending',
      emergencyName: 'Sunita Chawla (Mother)',
      emergencyPhone: '+91 98200 44102',
      bloodGroup: 'O+',
      requests: 'Requesting ground or first floor due to knee fracture recovery during badminton tournament.',
    },
    {
      studentEmail: 'kunal.s@student.edu',
      hostelName: 'Kailash Hall of Residence (Hostel 4)',
      roomType: 'Double',
      floor: 3,
      status: 'Pending',
      emergencyName: 'Mahesh Singhal (Father)',
      emergencyPhone: '+91 98200 44103',
      bloodGroup: 'A+',
      requests: 'Interested in quiet wing for competitive programming prep.',
    },
    {
      studentEmail: 'raghav.c@student.edu',
      hostelName: 'Aryabhatta Hall of Residence (Hostel 1)',
      roomType: 'Triple',
      floor: 1,
      status: 'Pending',
      emergencyName: 'Vandana Chopra (Mother)',
      emergencyPhone: '+91 98200 44104',
      bloodGroup: 'AB+',
      requests: 'Freshman applicant; standard hostel allocation.',
    },
    {
      studentEmail: 'simran.k@student.edu',
      hostelName: 'Gargi Women\'s Research Residence (Hostel 14)',
      roomType: 'Single',
      floor: 3,
      status: 'Pending',
      emergencyName: 'Harpreet Singh (Father)',
      emergencyPhone: '+91 98200 44105',
      bloodGroup: 'B+',
      requests: 'Senior year capstone project requires dedicated study table and reliable uninterrupted power.',
    },
    {
      studentEmail: 'tarun.r@student.edu',
      hostelName: 'Shivalik Hall of Residence (Hostel 7)',
      roomType: 'Double',
      floor: 2,
      status: 'Pending',
      emergencyName: 'B. S. Rawat (Father)',
      emergencyPhone: '+91 98200 44106',
      bloodGroup: 'O-',
      requests: 'Requesting allocation near Civil CAD laboratory.',
    },

    // Approved Applications (Awaiting room check-in)
    {
      studentEmail: 'harshita.m@student.edu',
      hostelName: 'Mandakini Hall of Residence (Hostel 12)',
      roomType: 'Double',
      floor: 2,
      status: 'Approved',
      emergencyName: 'K. Murthy (Father)',
      emergencyPhone: '+91 98200 44107',
      bloodGroup: 'A+',
      requests: 'Biotechnology research scholar; approved by warden committee.',
      adminRemarks: 'Approved for Room MD-102 (Double). Proceed to fee payment counter.',
    },
    {
      studentEmail: 'swati.t@student.edu',
      hostelName: 'Mandakini Hall of Residence (Hostel 12)',
      roomType: 'Double',
      floor: 2,
      status: 'Approved',
      emergencyName: 'Alok Tiwari (Father)',
      emergencyPhone: '+91 98200 44108',
      bloodGroup: 'B+',
      requests: 'Roommate match with Harshita Murthy approved.',
      adminRemarks: 'Approved for Room MD-102 (Double). Key collection scheduled for Monday.',
    },
    {
      studentEmail: 'ayush.t@student.edu',
      hostelName: 'Kailash Hall of Residence (Hostel 4)',
      roomType: 'Double',
      floor: 3,
      status: 'Approved',
      emergencyName: 'Sanjay Tiwari (Father)',
      emergencyPhone: '+91 98200 44109',
      bloodGroup: 'O+',
      requests: 'Second year CS scholar.',
      adminRemarks: 'Approved for Room KL-301. Physical verification of ID pending.',
    },

    // Allocated Applications (Tied to active students)
    {
      studentEmail: 'aarav.patel@student.edu',
      hostelName: 'Shivalik Hall of Residence (Hostel 7)',
      roomType: 'Double',
      floor: 2,
      status: 'Allocated',
      emergencyName: 'Ramesh Patel (Father)',
      emergencyPhone: '+91 98200 44110',
      bloodGroup: 'B+',
      requests: 'Preference for Room SH-201 with Rohan Verma.',
      adminRemarks: 'Allocated to Room SH-201. Security deposit verified.',
    },
    {
      studentEmail: 'ananya.sharma@student.edu',
      hostelName: 'Mandakini Hall of Residence (Hostel 12)',
      roomType: 'Double',
      floor: 1,
      status: 'Allocated',
      emergencyName: 'Dr. V. K. Sharma (Father)',
      emergencyPhone: '+91 98200 44111',
      bloodGroup: 'A+',
      requests: 'Lakeview ground or first floor preference.',
      adminRemarks: 'Allocated to Room MD-101. Student council scholarship active.',
    },
    {
      studentEmail: 'kavya.nair@student.edu',
      hostelName: 'Gargi Women\'s Research Residence (Hostel 14)',
      roomType: 'Single',
      floor: 1,
      status: 'Allocated',
      emergencyName: 'Prof. M. Nair (Father)',
      emergencyPhone: '+91 98200 44112',
      bloodGroup: 'O+',
      requests: 'PhD research grant scholar single occupancy.',
      adminRemarks: 'Allocated to Room GR-101. 24/7 campus entry access pass issued.',
    },

    // Rejected Applications (With warden remarks)
    {
      studentEmail: 'gaurav.j@student.edu',
      hostelName: 'Nilgiri Scholars Tower (Hostel 18)',
      roomType: 'Single',
      floor: 5,
      status: 'Rejected',
      emergencyName: 'N. K. Jha (Father)',
      emergencyPhone: '+91 98200 44113',
      bloodGroup: 'B+',
      requests: 'First-year B.Tech requesting Single AC suite in Nilgiri Tower.',
      adminRemarks: 'Ineligible for single executive suite as Year 1 Undergraduate. Please re-apply for Double/Triple in Aryabhatta or Kailash Hall.',
    },
    {
      studentEmail: 'bhavna.c@student.edu',
      hostelName: 'Gargi Women\'s Research Residence (Hostel 14)',
      roomType: 'Single',
      floor: 5,
      status: 'Rejected',
      emergencyName: 'Ashok Chugh (Father)',
      emergencyPhone: '+91 98200 44114',
      bloodGroup: 'AB+',
      requests: 'Undergraduate requesting research wing single room.',
      adminRemarks: 'Gargi Research Wing is reserved exclusively for PhD & Final Year Thesis fellows. Recommended Sarojini Hall.',
    },
  ];

  for (const app of applicationData) {
    const student = studentMap[app.studentEmail];
    const hostel = hostelMap[app.hostelName];
    if (!student || !hostel) continue;

    await Application.create({
      student: student._id,
      preferredHostel: hostel._id,
      roomType: app.roomType,
      preferredFloor: app.floor,
      personalDetails: {
        emergencyContactName: app.emergencyName,
        emergencyContactPhone: app.emergencyPhone,
        bloodGroup: app.bloodGroup,
        specialRequests: app.requests,
      },
      status: app.status,
      adminRemarks: app.adminRemarks || '',
      reviewedBy: app.status !== 'Pending' ? primaryAdmin._id : undefined,
      reviewedAt: app.status !== 'Pending' ? new Date() : undefined,
    });
  }
  console.log('Created realistic student applications with real statuses.');

  console.log('\n=== REAL DATASET SEEDING COMPLETE ===');
  console.log(`- 2 Admins (Chief Warden: admin@stayhostel.edu / Admin@123)`);
  console.log(`- 8 Prestigious Campus Residential Halls`);
  console.log(`- ${createdRooms.length} Detailed Campus Rooms`);
  console.log(`- ${students.length} Real Student Profiles (All Student@123)`);
  console.log(`- ${allocations.length} Active Real-World Room Allocations`);
  console.log(`- ${applicationData.length} Real Student Applications with History & Remarks`);

  process.exit(0);
}

seedRealData().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
