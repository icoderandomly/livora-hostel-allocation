const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  updateStudent,
} = require('../controllers/studentController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, getAllStudents);
router.get('/:id', verifyToken, getStudentById);
router.put('/:id', verifyToken, isAdmin, updateStudent);

module.exports = router;
