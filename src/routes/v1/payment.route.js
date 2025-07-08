const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller');

router.route('/create-payment-intent').post(paymentController.createPaymentIntent);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment
 */
