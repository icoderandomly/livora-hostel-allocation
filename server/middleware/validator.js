const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return res.status(400).json({
      success: false,
      message: extractedErrors[0].message,
      errors: extractedErrors,
    });
  }
  next();
};

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  body('rollNumber')
    .trim()
    .notEmpty()
    .withMessage('Roll number is required for student registration'),
  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course is required'),
  body('year')
    .trim()
    .notEmpty()
    .withMessage('Year / Semester is required'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,16}$/)
    .withMessage('Please enter a valid phone number'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  validate,
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

const hostelValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Hostel name is required'),
  body('type')
    .isIn(['Boys', 'Girls', 'Co-ed'])
    .withMessage('Hostel type must be Boys, Girls, or Co-ed'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('totalFloors')
    .isInt({ min: 1, max: 20 })
    .withMessage('Total floors must be between 1 and 20'),
  validate,
];

const roomValidation = [
  body('roomNumber')
    .trim()
    .notEmpty()
    .withMessage('Room number is required'),
  body('hostel')
    .notEmpty()
    .withMessage('Hostel ID is required')
    .isMongoId()
    .withMessage('Invalid hostel ID format'),
  body('floor')
    .isInt({ min: 0 })
    .withMessage('Floor must be a non-negative integer'),
  body('roomType')
    .isIn(['Single', 'Double', 'Triple'])
    .withMessage('Room type must be Single, Double, or Triple'),
  body('capacity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Capacity must be between 1 and 10'),
  body('monthlyFee')
    .isNumeric({ min: 0 })
    .withMessage('Monthly fee must be a positive number'),
  validate,
];

const applicationValidation = [
  body('preferredHostel')
    .notEmpty()
    .withMessage('Preferred hostel is required')
    .isMongoId()
    .withMessage('Invalid hostel ID format'),
  body('roomType')
    .isIn(['Single', 'Double', 'Triple'])
    .withMessage('Room type must be Single, Double, or Triple'),
  body('preferredFloor')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Preferred floor must be a non-negative number'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  hostelValidation,
  roomValidation,
  applicationValidation,
};
