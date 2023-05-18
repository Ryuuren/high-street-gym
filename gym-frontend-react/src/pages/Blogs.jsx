import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBlogs } from "../api/blog";
import { getUserByID } from "../api/user";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";

export default function Blogs() {
  const navigate = useNavigate();

  // Load recent blogs list
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBlogs().then(async (blogs) => {
      // fetch the user who wrote each blog
      const blogsWithExtras = await Promise.all(
        blogs.map(async (blog) => {
          const user = await getUserByID(blog.blog_user_id);

          return Promise.resolve({
            blog_id: blog.blog_id,
            blog_title: blog.blog_title,
            user,
            blog_datetime: blog.blog_datetime, // Keep the original datetime value
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

      // Filter blogs to remove those older than a fortnight (two weeks)
      const filteredBlogs = blogsWithExtras.filter((blog) => {
        const blogDateTime = new Date(blog.blog_datetime);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 24);
        return blogDateTime >= twoWeeksAgo;
      });

      setBlogs(filteredBlogs);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Nav />
      <div className="container sm:p-2 mx-auto">
        <div className="overflow-x-auto w-full pt-9 sm:pl-2 sm:pr-4">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {blogs.length === 0 ? (
                <p>No recent blogs available.</p>
              ) : (
                <table className="table table-compact w-full">
                  <thead>
                    <tr className="text-cyan-500">
                      <th className="w-1/4">Title</th>
                      <th className="w-1/4">Author</th>
                      <th className="w-1/4">Date</th>
                      <th className="w-1/4">Time</th>
                      <th className="w-1/6">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.blog_id}>
                        <td className="overflow-hidden text-ellipsis">
                          {blog.blog_title.substring(0, blog.blog_title.length / 1.4) + "..."}
                        </td>
                        <td>
                          {blog.user.user_firstname} {blog.user.user_lastname}
                        </td>
                        <td>{blog.blog_date}</td>
                        <td>{blog.blog_time}</td>
                        <td>
                          <button
                            className="btn btn-outline btn-info btn-xs"
                            onClick={() => navigate("/blogs/" + blog.blog_id)}
                          >
                            Read
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
