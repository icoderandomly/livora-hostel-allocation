const express = require('express');
const router = express.Router();
const {
  getReportSummary,
  exportReportCSV,
} = require('../controllers/reportController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/summary', verifyToken, isAdmin, getReportSummary);
router.get('/export/:type', verifyToken, isAdmin, exportReportCSV);

module.exports = router;
