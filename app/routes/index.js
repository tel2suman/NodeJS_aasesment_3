const express = require("express");

const router = express.Router();

//defining routes
const UserRoute = require("./UserRoute");

const BlogRoute = require("./BlogRoute");

router.use(UserRoute);

router.use(BlogRoute);

module.exports = router;
