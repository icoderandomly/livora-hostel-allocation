const express = require('express');
const router = express.Router();
const {
  createAllocation,
  vacateAllocation,
  reassignRoom,
  getAllAllocations,
  getMyAllocation,
} = require('../controllers/allocationController');
const { verifyToken, isAdmin, isStudent } = require('../middleware/auth');

router.post('/', verifyToken, isAdmin, createAllocation);
router.get('/', verifyToken, isAdmin, getAllAllocations);
router.get('/my', verifyToken, isStudent, getMyAllocation);
router.put('/:id/vacate', verifyToken, isAdmin, vacateAllocation);
router.put('/:id/reassign', verifyToken, isAdmin, reassignRoom);

module.exports = router;
