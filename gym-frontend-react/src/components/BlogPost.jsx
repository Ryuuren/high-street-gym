import { useState } from "react";
import { createBlog } from "../api/blog";
import { useAuthentication } from "../hooks/authentication";

export default function BlogPost({ onAdded }) {
  const [user] = useAuthentication();

  const [formData, setFormData] = useState({
    blog_title: "",
    blog_content: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  function addBlog(e) {
    e.preventDefault();
    setStatusMessage("Posting your blog...");

    // Add user_id to the blog object before sending
    const blogData = {
      ...formData,
      blog_user_id: user.user_id,
    };

    createBlog(blogData)
      .then((result) => {
        setStatusMessage(result.message);
        setFormData({
          blog_title: "",
          blog_content: "",
        });
        if (typeof onAdded === "function") {
          onAdded();
        }
      })
      .catch((error) => {
        setStatusMessage("Failed to post the blog.");
        console.error(error);
      });
  }

  return (
    <div>
      <h2 className="text-xl font-bold uppercase text-cyan-500 ml-24 sm:ml-40">New blog post</h2>
      <form className="flex-grow m-4 max-w-2xl text-xl" onSubmit={addBlog}>
        <div className="form-control">
          <label className="label" htmlFor="blog_title">
            Title:
          </label>
          <input
            type="text"
            className="input input-bordered input-info w-full max-w-md"
            id="blog_title"
            value={formData.blog_title}
            required
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, blog_title: e.target.value };
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="blog_content">
            Content:
          </label>
          <textarea
            className="input input-bordered input-info w-full max-w-md h-52 mb-2"
            id="blog_content"
            value={formData.blog_content}
            required
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, blog_content: e.target.value };
              })
            }
          />
        </div>
        <div className="my-2">
          <button className="btn btn-outline btn-info mr-2">Post</button>
          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
    </div>
  );
}
