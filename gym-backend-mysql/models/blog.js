import { db } from "../database/mysql.js";

// CREATE
export async function createBlog(blog) {
  // New blog should not have an existing ID, delete just to be sure.
  delete blog.blog_id;
  // Insert the blog and return the resulting promise
  return db
    .query(
      "INSERT INTO blogs (blog_datetime, blog_title, blog_content, blog_user_id) " +
        "VALUES (NOW(), ?, ?, ?)",
      [blog.blog_title, blog.blog_content, blog.blog_user_id]
    )
    .then(([result]) => {
      // Inject the inserted ID into the blog object and return
      return { ...blog, blog_id: result.insertId };
    });
}

// READ
export async function getAllBlogs() {
  // Get the collection of all blogs
  const [allBlogsResults] = await db.query(
    "SELECT * FROM blogs ORDER BY blog_datetime DESC"
    );
  // If there are no blogs in the database, return an error
  if (allBlogsResults.length === 0) {
    return Promise.reject("No blogs available");
  }
  // Convert the collection of results into a list of blog objects
  return await allBlogsResults.map((blogResult) => {
    return { ...blogResult };
  });
}

// READ BY ID
export async function getBlogByID(blogID) {
  // Find the first blog document with a matching ID
  const [blogsResults] = await db.query("SELECT * FROM blogs WHERE blog_id = ?", blogID);
  // If there is more than one blog in the database, return the first one matching the ID
  if (blogsResults.length > 0) {
    const blogResult = blogsResults[0];
    // Return the resulting document
    return Promise.resolve(blogResult);
  } else {
    return Promise.reject("No blog found");
  }
}

// READ BY USER ID
export async function getBlogsByUserID(userID) {
  // Get the collection of all blogs matching the given userID, in order of most recent
  const [blogsResults] = await db.query(
    "SELECT * FROM blogs WHERE blog_user_id = ? ORDER BY blog_datetime DESC",
    userID
  );
  // Return the resulting document(s)
  return blogsResults.map((blogResult) => {
    return { ...blogResult };
  });
}

// UPDATE
export async function updateBlog(blog) {
  // Runs the update on all columns for the row with the provided ID
  //
  // Allows users to make edits to their blog, with the datetime referencing the latest version.
  const [result] = await db.query(
    "UPDATE blogs SET blog_datetime = NOW(), blog_title = ?, blog_content = ?, blog_user_id = ? WHERE blog_id = ?",
    [blog.blog_title, blog.blog_content, blog.blog_user_id, blog.blog_id]
  );

  // If a blog is updated, show the result
  if (result.affectedRows > 0) {
    return result;
  } else {
    return Promise.reject("Blog not found");
  }
}

// DELETE
export async function deleteBlogByID(blogID) {
  const [result] = await db.query("DELETE FROM blogs WHERE blog_id = ?", blogID);
  if (result.affectedRows === 0) {
    return Promise.reject("Blog not found");
  }
  return result;
}
