const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString),
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: responseBody });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(dataString);
    req.end();
  });
};

const runVerification = async () => {
  console.log('====================================================');
  console.log('🧪 RUNNING FULL SYSTEM VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    console.log('1. Testing Health Endpoint...');
    const health = await request('GET', '/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'API Health Check is healthy');

    // 2. Admin Login
    console.log('\n2. Testing Admin Login...');
    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@example.com',
      password: 'AdminPass@2025',
    });
    assert(adminLogin.status === 200 && adminLogin.data.token, 'Admin login succeeded and JWT returned');
    assert(adminLogin.data.user.role === 'ADMIN', 'Admin role verified in JWT user profile');
    const adminToken = adminLogin.data.token;

    // 3. Student Registration
    console.log('\n3. Testing Student Registration...');
    const testRoll = `TEST${Date.now().toString().slice(-4)}`;
    const studentData = {
      name: 'Aditya Sen',
      email: `aditya.${Date.now()}@student.edu`,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      rollNumber: testRoll,
      course: 'B.Tech AI & Data Science',
      year: '2nd Year / 3rd Sem',
      phoneNumber: '+91 9876501234',
      gender: 'Male',
    };
    const regRes = await request('POST', '/auth/register', studentData);
    assert(regRes.status === 201 && regRes.data.token, 'Student registration created student with JWT token');
    assert(regRes.data.user.role === 'STUDENT', 'Registered student assigned role STUDENT strictly');
    const studentToken = regRes.data.token;
    const studentId = regRes.data.user._id;

    // 4. Duplicate Prevention
    console.log('\n4. Testing Duplicate Prevention...');
    const dupRes = await request('POST', '/auth/register', studentData);
    assert(dupRes.status === 400, 'Duplicate email/roll registration correctly rejected with 400 Bad Request');

    // 5. Student Login
    console.log('\n5. Testing Student Login...');
    const stuLogin = await request('POST', '/auth/login', {
      email: studentData.email,
      password: studentData.password,
    });
    assert(stuLogin.status === 200 && stuLogin.data.user.email === studentData.email, 'Student login verified');

    // 6. Role-based Route Protection
    console.log('\n6. Testing Role-based Access Control (RBAC)...');
    const forbiddenAdminCall = await request('GET', '/students', null, studentToken);
    assert(forbiddenAdminCall.status === 403, 'Student cannot access Admin route /api/students (403 Forbidden)');

    const allowedAdminCall = await request('GET', '/students', null, adminToken);
    assert(allowedAdminCall.status === 200 && Array.isArray(allowedAdminCall.data.students), 'Admin can access /api/students');

    // 7. Hostel Creation
    console.log('\n7. Testing Hostel Creation...');
    const newHostel = {
      name: `Kalam Boys Residence ${Date.now().toString().slice(-4)}`,
      type: 'Boys',
      location: 'South Campus, Block K',
      totalFloors: 3,
      description: 'Air-conditioned modern student suites',
      wardenName: 'Dr. V. Raman',
      wardenContact: '+91 9988776655',
    };
    const createHostelRes = await request('POST', '/hostels', newHostel, adminToken);
    assert(createHostelRes.status === 201 && createHostelRes.data.hostel._id, 'Hostel created successfully');
    const hostelId = createHostelRes.data.hostel._id;

    // 8. Room Creation
    console.log('\n8. Testing Room Creation with Capacity = 1...');
    const newRoom = {
      roomNumber: `K-101`,
      hostel: hostelId,
      floor: 1,
      roomType: 'Single',
      capacity: 1,
      monthlyFee: 7500,
      status: 'Available',
      amenities: ['Bed', 'AC', 'Study Table'],
    };
    const createRoomRes = await request('POST', '/rooms', newRoom, adminToken);
    assert(createRoomRes.status === 201 && createRoomRes.data.room.capacity === 1, 'Room created with single capacity');
    const roomId = createRoomRes.data.room._id;

    // 9. Hostel Application Submission
    console.log('\n9. Testing Hostel Application Submission...');
    const appData = {
      preferredHostel: hostelId,
      roomType: 'Single',
      preferredFloor: 1,
      personalDetails: {
        emergencyContactName: 'Parent Sen',
        emergencyContactPhone: '+91 9123456789',
        bloodGroup: 'O+',
        specialRequests: 'Need ground floor for academic books access',
      },
    };
    const submitAppRes = await request('POST', '/applications', appData, studentToken);
    assert(submitAppRes.status === 201 && submitAppRes.data.application.status === 'Pending', 'Application submitted with status Pending');
    const applicationId = submitAppRes.data.application._id;

    // 10. Application Approval
    console.log('\n10. Testing Application Approval...');
    const approveRes = await request('PUT', `/applications/${applicationId}/status`, {
      status: 'Approved',
      adminRemarks: 'Application verified and approved by Chief Warden.',
    }, adminToken);
    assert(approveRes.status === 200 && approveRes.data.application.status === 'Approved', 'Application approved with warden remarks');

    // 11. Room Allocation
    console.log('\n11. Testing Room Allocation...');
    const allocRes = await request('POST', '/allocations', {
      studentId: studentId,
      roomId: roomId,
      applicationId: applicationId,
      remarks: 'Bed 1 assigned to Aditya Sen',
    }, adminToken);
    assert(allocRes.status === 201 && allocRes.data.allocation.status === 'Active', 'Room allocated successfully to student');
    const allocationId = allocRes.data.allocation._id;

    // 12. Verify Room Capacity Enforcement (Never allow room to exceed capacity)
    console.log('\n12. Testing Room Capacity Restrictions...');
    // Create a 2nd student and try to allocate to same single room (capacity 1, already 1 occupant)
    const stu2Data = {
      name: 'Ravi Kumar',
      email: `ravi.${Date.now()}@student.edu`,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      rollNumber: `TEST2${Date.now().toString().slice(-4)}`,
      course: 'B.Tech IT',
      year: '1st Year',
      phoneNumber: '+91 9876543999',
      gender: 'Male',
    };
    const reg2 = await request('POST', '/auth/register', stu2Data);
    const stu2Id = reg2.data.user._id;

    const overAllocRes = await request('POST', '/allocations', {
      studentId: stu2Id,
      roomId: roomId,
      remarks: 'Attempting over-capacity allocation',
    }, adminToken);
    assert(overAllocRes.status === 400, 'System strictly prevented exceeding room capacity (400 Bad Request)');

    // 13. Student My-Room API
    console.log('\n13. Testing Student My-Room & Allocation View...');
    const myRoomRes = await request('GET', '/allocations/my', null, studentToken);
    assert(myRoomRes.status === 200 && myRoomRes.data.hasAllocation === true, 'Student views allocated room number and hostel');

    // 14. Room Vacating
    console.log('\n14. Testing Room Vacating...');
    const vacateRes = await request('PUT', `/allocations/${allocationId}/vacate`, {
      vacateRemarks: 'Student checked out successfully at end of term.',
    }, adminToken);
    assert(vacateRes.status === 200 && vacateRes.data.allocation.status === 'Vacated', 'Room vacated successfully');

    // Verify room availability is restored
    const roomCheck = await request('GET', `/rooms/${roomId}`, null, adminToken);
    assert(roomCheck.data.room.currentOccupancy === 0 && roomCheck.data.room.status === 'Available', 'Room occupancy decremented to 0 and status restored to Available');

    // 15. Dashboard Statistics
    console.log('\n15. Testing Admin Dashboard Statistics...');
    const dashRes = await request('GET', '/dashboard/admin', null, adminToken);
    assert(dashRes.status === 200 && dashRes.data.stats.totalStudents >= 2, 'Admin dashboard statistics returned updated live totals');

    // 16. CSV Report Export
    console.log('\n16. Testing CSV Report Export...');
    const csvRes = await request('GET', '/reports/export/hostels', null, adminToken);
    assert(csvRes.status === 200 && typeof csvRes.raw === 'string' && csvRes.raw.includes('Hostel Name'), 'CSV Export generated valid tabular CSV stream');

    console.log('\n====================================================');
    console.log(`🏁 VERIFICATION COMPLETE: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error('Test run failed with error:', err);
    process.exit(1);
  }
};

runVerification();
