const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getStudentDashboard,
} = require('../controllers/dashboardController');
const { verifyToken, isAdmin, isStudent } = require('../middleware/auth');

router.get('/admin', verifyToken, isAdmin, getAdminDashboard);
router.get('/student', verifyToken, isStudent, getStudentDashboard);

module.exports = router;
