const express = require('express');
const router = express.Router();
const {
  getAllHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
} = require('../controllers/hostelController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { hostelValidation } = require('../middleware/validator');

router.get('/', getAllHostels);
router.get('/:id', getHostelById);
router.post('/', verifyToken, isAdmin, hostelValidation, createHostel);
router.put('/:id', verifyToken, isAdmin, hostelValidation, updateHostel);
router.delete('/:id', verifyToken, isAdmin, deleteHostel);

module.exports = router;
