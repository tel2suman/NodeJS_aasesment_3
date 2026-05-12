const express = require("express");

const router = express.Router();

//defining routes
const UserRoute = require("./UserRoute");


router.use(UserRoute);

module.exports = router;
