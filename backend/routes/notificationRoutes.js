// notificationControllers.js
const express = require("express");
const protectRoute = require("../middlewares/protectRoute.js");
const { Notification } = require("../controllers/notificationControllers.js");

const router = express.Router();

router.get("/notification", protectRoute, Notification);


module.exports = router;
