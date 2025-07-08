const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = catchAsync(async (req, res) => {
  try {
    const { amount, email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // 單位是 cents (e.g. 1000 = $10)
      currency: 'usd',
      receipt_email: email,
      metadata: { email },
      payment_method_types: ['card'],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // ✅ Stripe 金額錯誤的特殊處理
    if (error.type === 'StripeInvalidRequestError' && error.code === 'amount_too_small') {
      return res.status(400).json({
        error: '金額必須至少為 $0.50 美元',
      });
    }

    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: '建立付款請求時發生錯誤，請稍後再試',
      details: err.message,
    });
  }
});

module.exports = {
  createPaymentIntent,
};
