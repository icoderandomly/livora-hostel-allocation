const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
} = require('../middleware/validator');

// Rate limiting on sensitive auth endpoints: max 50 requests per 15 mins
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);
router.put('/update-profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
