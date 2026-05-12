const express = require("express");

const validateRegister = require("../utils/UserSchemaValidation");

const BlogController = require("../controllers/BlogController");

const Upload = require("../utils/CloudinaryImageUpload");

const tokenCheck = require("../middleware/tokenCheck");

const Rolechek = require("../middleware/roleCheck");

const router = express.Router();

// post page
router.get("/post/add", BlogController.addPost);

// create post
router.post("/create/post", Upload.single("cover_image"), tokenCheck, BlogController.createPost);

// get all posts
router.get("/posts", BlogController.getAllPost);

// get single post
router.get("/post/:id", BlogController.getSinglePost);

// get single post
router.get("/edit/post/:id", tokenCheck, BlogController.editPost);

// update post
router.post(
  "/update/post/:id",
  Upload.single("cover_image"),
  tokenCheck,
  BlogController.updatePost,
);

// delete post
router.get("/delete/post/:id", tokenCheck, Rolechek("admin"), BlogController.deletePost);

// soft delete post
router.get(
  "/softdelete/post/:id",
  tokenCheck,
  Rolechek("user"),
  BlogController.softdeletePost,
);




module.exports = router;