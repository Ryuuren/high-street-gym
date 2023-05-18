import { Router } from "express";
import { validate } from "../middleware/validator.js";
import {
  createBlog,
  getAllBlogs,
  getBlogByID,
  getBlogsByUserID,
  updateBlog,
  deleteBlogByID,
} from "../models/blog.js";

const blogController = Router();

// Start - Create Blog Endpoint
const createBlogSchema = {
  type: "object",
  required: ["blog_title", "blog_content", "blog_user_id"],
  properties: {
    blog_datetime: {
      type: "string",
    },
    blog_title: {
      type: "string",
    },
    blog_content: {
      type: "string",
    },
    blog_user_id: {
      type: "string",
    },
  },
};

blogController.post("/blogs", validate({ body: createBlogSchema }), async (req, res) => {
  // Get the blog data out of the request
  const blog = req.body;

  // Use the create blog model function to insert this blog into the DB
  createBlog(blog)
    .then((blog) => {
      res.status(200).json({
        status: 200,
        message: "Created blog",
        blog: blog,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to create blog " + error.message,
      });
    });
});
// End - Create Blog Endpoint
//
// Start - Get All Blogs Endpoint
const getBlogListSchema = {
  type: "object",
  properties: {},
};

blogController.get("/blogs", validate({ body: getBlogListSchema }), async (req, res) => {
  // Use the get all blogs model function to retrieve all blogs
  getAllBlogs()
    .then((blogs) => {
      res.status(200).json({
        status: 200,
        message: "Got all blogs",
        blogs: blogs,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get all blogs" + error,
      });
    });
});
// End - Get All Blogs Endpoint
//
// Start - Get Blog By ID Endpoint
const getBlogByIDSchema = {
  type: "object",
  properties: {
    blog_id: {
      type: "string",
    },
  },
};

blogController.get("/blogs/:blog_id", validate({ params: getBlogByIDSchema }), async (req, res) => {
  const blogID = req.params.blog_id;

  // Use the get by ID model function to retrieve the single blog
  getBlogByID(blogID)
    .then((blog) => {
      res.status(200).json({
        status: 200,
        message: "Got blog by ID",
        blog: blog,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get blog by ID - ID invalid or doesn't exist",
      });
    });
});
// End - Get Blog By ID Endpoint
//
// Start - Get Blogs By User ID Endpoint
const getBlogsByUserIDSchema = {
  type: "object",
  properties: {
    user_id: {
      type: "string",
    },
  },
};

blogController.get(
  "/my-blogs/:user_id",
  validate({ params: getBlogsByUserIDSchema }),
  async (req, res) => {
    const userID = req.params.user_id;

    const blogs = await getBlogsByUserID(userID);

    res.status(200).json({
      status: 200,
      message: "Got all blogs by user ID",
      blogs: blogs,
    });
  }
);
// End - Get Blogs By User ID Endpoint
//
// Start - Update Blog By ID Endpoint
const updateBlogSchema = {
  type: "object",
  required: ["blog_id"],
  properties: {
    blog_id: {
      type: "number",
    },
    blog_datetime: {
      type: "string",
    },
    blog_title: {
      type: "string",
    },
    blog_content: {
      type: "string",
    },
    blog_user_id: {
      type: "number",
    },
  },
};

blogController.patch("/blogs", validate({ body: updateBlogSchema }), async (req, res) => {
  const blog = req.body;

  // Check that the blog has an ID
  if (!blog.blog_id) {
    res.status(404).json({
      status: 404,
      message: "Cannot find blog to update without ID",
    });
    return;
  }

  // Use the update model function to update the existing row/document
  // in the database for this blog
  updateBlog(blog)
    .then((updatedBlog) => {
      res.status(200).json({
        status: 200,
        message: "Blog updated",
        blog: updatedBlog,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to update blog - ID invalid or doesn't exist",
      });
    });
});
// End - Update Blog By ID Endpoint
//
// Start - Delete Blog By ID Endpoint
const deleteBlogSchema = {
  type: "object",
  required: ["blog_id"],
  properties: {
    blog_id: {
      type: "string",
      minLength: 1,
    },
  },
};

blogController.delete("/blogs", validate({ body: deleteBlogSchema }), (req, res) => {
  const blogID = req.body.blog_id;

  deleteBlogByID(blogID)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Deleted blog by ID",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to delete blog by ID - ID invalid or doesn't exist",
      });
    });
});
// End - Delete Blog By ID Endpoint

export default blogController;
