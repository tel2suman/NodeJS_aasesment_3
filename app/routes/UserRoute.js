const express = require("express");

const validateRegister = require("../utils/UserSchemaValidation");

const UserController = require("../controllers/UserController");

const Upload = require("../utils/CloudinaryImageUpload");

const tokenCheck = require("../middleware/tokenCheck");

const Rolechek = require("../middleware/roleCheck");

const router = express.Router();

// user register
router.get("/register", UserController.registerPage);

router.post("/register", Upload.single("image"), validateRegister, UserController.registerUser);

// user login
router.get("/login", UserController.loginPage);

router.post("/login", UserController.loginUser);

router.use(tokenCheck);

// get user profile
router.get("/profile", Rolechek("user","admin"), UserController.userProfile);

// get edit profile
router.get(
  "/edit/profile",
  Rolechek("user", "admin"),
  UserController.editProfile,
);

// user profile update
router.post("/update/profile", Upload.single("image"),
    Rolechek("user", "admin"), UserController.updateProfile
);

router.get("/logout", Rolechek("user", "admin"), UserController.logoutUser);

module.exports = router;