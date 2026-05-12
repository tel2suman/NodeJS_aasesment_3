
const BlogPost = require("../models/blog");

const jwt = require("jsonwebtoken");

const cloudinary = require("../config/cloudinary");

const fs = require("fs");

const StatusCode = require("../utils/StatusCode");

class BlogController {
  //add posts page
  async addPost(req, res) {
    res.render("add_posts", {
      title: "Blog Create Page",
    });
  }

  async createPost(req, res) {
    try {
      const { title, content } = req.body;

      //validate all fields
      if (!title || !content) {
        return res.redirect("/add_posts");
      }

      const existPost = await BlogPost.findOne({ title });

      if (existPost) {
        return res.redirect("/add_posts");
      }

      //upload to clodinary
      const imageResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
        width: 500,
        height: 500,
        crop: "limit",
        quality: "auto",
      });

      // Delete local file after upload (important)
      if (req.file && req.file.path) {
        await fs.promises.unlink(req.file.path);
      }

      const postdata = new BlogPost({
        title,
        content,
        userId: req.user._id,
        cover_image: imageResult ? imageResult.secure_url : null,
        cloudinary_id: imageResult ? imageResult.public_id : null,
      });

      const data = await postdata.save();

      if (data) {
        res.redirect("/posts");
      } else {
        res.redirect("/add_posts");
      }
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        await fs.promises.unlink(req.file.path);
      }

      console.log("Error storing employee:", error);

      return res.status(500).send("Something went wrong");
    }
  }

  // get all posts
  async getAllPost(req, res) {
    try {
      const data = await BlogPost.find({ is_delete: false });

      res.render("posts", {
        title: "Blog Lists",
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // get single posts
  async getSinglePost(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.redirect("/posts");
      }

      const data = await BlogPost.findById(id);

      if (!data) {
        return res.render("view_details", {
          title: "Post Not Found",
          data: null,
        });
      }

      res.render("view_details", {
        title: "View Details Page",
        data: data,
      });
    } catch (error) {
      console.log(error);

      res.redirect("/posts");
    }
  }

  //edit
  async editPost(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.redirect("/posts");
      }

      const data = await BlogPost.findById(id);

      if (!data) {
        return res.redirect("/posts");
      }

      res.render("edit_posts", {
        title: "Edit Blog",
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //update post
  async updatePost(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.redirect("/posts");
      }

      const bloguser = await BlogPost.findById(id);

      if (!bloguser) {
        return res.redirect("/posts");
      }

      // Handle Cloudinary image
      if (req.file) {
        // delete existing image
        if (bloguser.cloudinary_id) {
          await cloudinary.uploader.destroy(bloguser.cloudinary_id);
        }

        // upload new image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "uploads",
          width: 500,
          height: 500,
          crop: "limit",
          quality: "auto",
        });

        bloguser.cover_image = result.secure_url;
        bloguser.cloudinary_id = result.public_id;

        // Delete local file
        await fs.promises.unlink(req.file.path);
      }

      // Handle Data Update
      if (req.body.title !== undefined) {
        bloguser.title = req.body.title;
      }

      if (req.body.content !== undefined) {
        bloguser.content = req.body.content;
      }

      //updated user
      const updatedBlog = await bloguser.save();

      return res.redirect("/posts");
    } catch (error) {
      // cleanup local file if error occurs
      if (req.file && fs.existsSync(req.file.path)) {
        await fs.promises.unlink(req.file.path);
      }

      console.error(error);
      return res.status(500).send("Something went wrong");
    }
  }

  // hard delete post
  async deletePost(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.redirect("/posts");
      }

      const data = await BlogPost.findByIdAndDelete(id);

      if (!data) {
        return res.redirect("/posts");
      }

      return res.redirect("/posts");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Something went wrong");
    }
  }

  // soft delete post
  async softdeletePost(req, res) {
    
    try {

      const id = req.params.id;

      if (!id) {
        return res.redirect("/posts");
      }

      const data = await BlogPost.findByIdAndUpdate(
        id,
        { userId: req.user._id },
        { is_delete: true },
        { new: true },
      );

      if (!data) {
        return res.redirect("/posts");
      }

      return res.redirect("/posts");

    } catch (error) {

      console.error(error);

      return res.status(500).send("Something went wrong");
    }
  }
}

module.exports = new BlogController();