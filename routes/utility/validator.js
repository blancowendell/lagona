const { body, validationResult } = require('express-validator');
const mysql = require("../repository/lagonaDb");
const { SelectPromise } = require('../repository/dbconnect');
const { SelectStatement } = require('../repository/customhelper');

const validateCustomerCheckout = [
  // Basic field validations
  body('merchant_id').isInt().withMessage('Merchant ID must be an integer'),
  body('customer_id').isInt().withMessage('Customer ID must be an integer'),
  body('order_type').notEmpty().withMessage('Order type is required'),
  body('lagona_fee').isFloat().withMessage('Lagona fee must be a number'),
  body('order_total').isFloat().withMessage('Order total must be a number'),
  body('address_id').isInt().withMessage('Address ID must be an integer'),
  body('order_details').isArray({ min: 1 }).withMessage('Order details must be a non-empty array'),
  body('order_details.*.category').notEmpty().withMessage('Category is required'),
  body('order_details.*.product_id').isInt().withMessage('Product ID must be an integer'),
  body('order_details.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  // Custom validations
  body('merchant_id').custom(async (value) => {
    let merchant = SelectStatement(
        "SELECT * FROM master_merchant WHERE merchant_id = ?",
        [value]
    );
    if (merchant.length === 0) {
      return Promise.reject('Merchant ID does not exist');
    }
  }),

  body('customer_id').custom(async (value) => {
    let customer = SelectStatement(
        "SELECT * FROM master_customer WHERE customer_id = ?",
        [value]
    );
    if (customer.length === 0) {
      return Promise.reject('Customer ID does not exist');
    }
  }),

  body('address_id').custom(async (value) => {
    let address = SelectStatement(
        "SELECT * FROM customer_address WHERE address_id = ?",
        [value]
    );
    if (address.length === 0) {
      return Promise.reject('Address ID does not exist');
    }
  }),

  body('order_details').custom(async (items) => {
    for (const item of items) {
      const { category, product_id } = item;
      let query = '';
      switch (category) {
        case 'Item':
          query = 'SELECT * FROM menu_item WHERE mi_item_id = ?';
          break;
        case 'Solo':
          query = 'SELECT * FROM menu_solo WHERE ms_solo_id = ?';
          break;
        case 'Combo':
          query = 'SELECT * FROM menu_combo WHERE mc_combo_id = ?';
          break;
        case 'Extra':
          query = 'SELECT * FROM menu_extras WHERE me_extra_id = ?';
          break;
        default:
          return Promise.reject(`Invalid category: ${category}`);
      }
      const product = SelectPromise(query, [product_id]);
      if (product.length === 0) {
        return Promise.reject(`Product ID ${product_id} does not exist in category ${category}`);
      }
    }
  }),

  // Middleware to handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateCustomerCheckout;
