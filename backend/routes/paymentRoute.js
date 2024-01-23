const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthenticatedUse } = require("../middleware/auth");

router.route("/payment/process").post(isAuthenticatedUse, processPayment);

router.route("/stripeapikey").get(isAuthenticatedUse, sendStripeApiKey);

module.exports = router;
