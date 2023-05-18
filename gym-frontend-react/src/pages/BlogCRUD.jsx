import { useEffect, useState } from "react";
import { deleteBlogByID, getAllBlogs, getBlogByID, updateBlog } from "../api/blog";
import { getUserByID } from "../api/user";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import { useAuthentication } from "../hooks/authentication";

export default function BlogCRUD() {
  const [user] = useAuthentication();
  // Creates an empty space to store the blogs list and selected blogs
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogID, setSelectedBlogID] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState({
    blog_id: "",
    blog_datetime: "",
    blog_title: "",
    blog_content: "",
    blog_user_id: "",
  });

  useEffect(() => {
    getAllBlogs(user.user_authenticationkey).then(async (blogs) => {
      // fetch the user who wrote each blog
      const blogsWithExtras = await Promise.all(
        blogs.map(async (blog) => {
          const user = await getUserByID(blog.blog_user_id);

          return Promise.resolve({
            blog_id: blog.blog_id,
            blog_title: blog.blog_title,
            user,
            blog_date: new Date(blog.blog_datetime).toLocaleDateString(),
            blog_time: new Date(blog.blog_datetime)
              .toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                hourCycle: "h11",
              })
              .toUpperCase(),
          });
        })
      );
      setBlogs(blogsWithExtras);
    });
  }, [selectedBlogID, user]);

  useEffect(() => {
    if (selectedBlogID) {
      getBlogByID(selectedBlogID, user.user_authenticationkey).then((blog) => {
        setSelectedBlog(blog);
      });
    } else {
      setSelectedBlog({
        blog_id: "",
        blog_datetime: "",
        blog_title: "",
        blog_content: "",
        blog_user_id: "",
      });
    }
  }, [selectedBlogID, user.user_authenticationkey]);

  function updateSelectedBlog() {
    // This function updates the selected blog if there is
    // an ID in the ID field, otherwise it does nothing
    if (selectedBlogID) {
      // Update
      updateBlog(selectedBlog).then((updatedBlog) => {
        setSelectedBlogID(null);
        setSelectedBlog({
          blog_id: "",
          blog_datetime: "",
          blog_title: "",
          blog_content: "",
          blog_user_id: "",
        });
      });
    } else {
      setSelectedBlogID(null);
      setSelectedBlog({
        blog_id: "",
        blog_datetime: "",
        blog_title: "",
        blog_content: "",
        blog_user_id: "",
      });
    }
  }

  function deleteSelectedBlog() {
    deleteBlogByID(selectedBlog.blog_id).then((result) => {
      console.log("delete debug", selectedBlog);
      setSelectedBlogID(null);
      setSelectedBlog({
        blog_id: "",
        blog_datetime: "",
        blog_title: "",
        blog_content: "",
        blog_user_id: "",
      });
    });
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap 2">
        {/* Blogs List */}
        <div className="overflow-x-auto pt-0 pl-0 sm:pt-11 sm:pl-4">
          {blogs.length == null ? (
            <Spinner />
          ) : (
            <table className="table table-compact w-full">
              <thead>
                <tr className="text-cyan-500">
                  <th className="w-1/12">ID</th>
                  <th className="w-1/6">Title</th>
                  <th className="w-1/6">Author</th>
                  <th className="w-1/6">Date</th>
                  <th className="w-1/6">Time</th>
                  <th className="w-1/6">Select</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.blog_id}>
                    <td>{blog.blog_id}</td>
                    <td className="overflow-hidden text-ellipsis">
                      {blog.blog_title.substring(0, blog.blog_title.length / 2) + "..."}
                    </td>
                    <td>
                      {blog.user.user_firstname} {blog.user.user_lastname}
                    </td>
                    <td>{blog.blog_date}</td>
                    <td>{blog.blog_time}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-info btn-xs"
                        onClick={() => setSelectedBlogID(blog.blog_id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Edit Form */}
        <div className="pl-10 text-lg">
          <div className="form-control">
            <label className="label" htmlFor="blog_id">
              ID
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered input-info w-full max-w-xs"
              id="blog_id"
              value={selectedBlogID || ""}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="blog_title">
              Title
            </label>
            <input
              type="text"
              className="input input-bordered input-info w-full max-w-xs"
              id="blog_title"
              value={selectedBlog.blog_title}
              onChange={(e) => setSelectedBlog({ ...selectedBlog, blog_title: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="blog_content">
              Content
            </label>
            <textarea
              className="input input-bordered input-info w-full max-w-xs"
              id="blog_content"
              value={selectedBlog.blog_content}
              onChange={(e) => setSelectedBlog({ ...selectedBlog, blog_content: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="blog_user_id">
              User ID
            </label>
            <input
              type="text"
              readOnly
              className="input input-bordered input-info w-full max-w-xs mb-3"
              id="blog_user_id"
              value={selectedBlog.blog_user_id}
              onChange={(e) => setSelectedBlog({ ...selectedBlog, blog_user_id: e.target.value })}
            />
          </div>
          <div className="pt-2 flex gap-2">
            <button
              className="btn btn-outline btn-info"
              onClick={() => {
                setSelectedBlogID(null);
                setSelectedBlog({
                  blog_datetime: "",
                  blog_title: "",
                  blog_content: "",
                  blog_user_id: "",
                });
              }}
            >
              Clear
            </button>
            <button className="btn btn-outline btn-info" onClick={() => updateSelectedBlog()}>
              Update
            </button>
            <button className="btn btn-outline btn-info" onClick={() => deleteSelectedBlog()}>
              Delete
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
