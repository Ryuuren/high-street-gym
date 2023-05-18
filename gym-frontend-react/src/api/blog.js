import { API_URL } from "./api.js";

// CREATE
export async function createBlog(blog) {
  const response = await fetch(API_URL + "/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.blog;
}

// READ
export async function getAllBlogs() {
  const response = await fetch(API_URL + "/blogs", {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.blogs;
}

// READ BY ID
export async function getBlogByID(blogID) {
  const response = await fetch(API_URL + "/blogs/" + blogID, {
    method: "GET",
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.blog;
}

// READ BY USER ID
export async function getUserBlogs(userID) {
  const response = await fetch(API_URL + "/my-blogs/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.blogs;
}

// UPDATE
export async function updateBlog(blog) {
  const response = await fetch(API_URL + "/blogs", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.blog;
}

// DELETE
export async function deleteBlogByID(blogID) {
  blogID = JSON.stringify(blogID);
  const response = await fetch(API_URL + "/blogs", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blog_id: blogID }),
  });

  const APIResponseObject = await response.json();

  return APIResponseObject;
}
