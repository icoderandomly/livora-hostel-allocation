const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { verifyToken, isAdmin, isStudent } = require('../middleware/auth');
const { applicationValidation } = require('../middleware/validator');

router.post('/', verifyToken, isStudent, applicationValidation, createApplication);
router.get('/my', verifyToken, isStudent, getMyApplications);
router.get('/', verifyToken, isAdmin, getAllApplications);
router.put('/:id/status', verifyToken, isAdmin, updateApplicationStatus);

module.exports = router;
