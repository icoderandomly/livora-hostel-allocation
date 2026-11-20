const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { roomValidation } = require('../middleware/validator');

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', verifyToken, isAdmin, roomValidation, createRoom);
router.put('/:id', verifyToken, isAdmin, updateRoom);
router.delete('/:id', verifyToken, isAdmin, deleteRoom);

module.exports = router;
