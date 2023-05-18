import { useEffect, useState } from "react";
import { getUserBlogs } from "../api/blog";
import Spinner from "./Spinner";

export default function UserBlogs({ userID, refreshDependency }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data

    getUserBlogs(userID).then((blogs) => {
      const myBlogs = blogs.map((blog) => ({
        blog_title: blog.blog_title,
        blog_date: new Date(blog.blog_datetime).toLocaleDateString(),
        blog_time: new Date(blog.blog_datetime)
          .toLocaleTimeString([], {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            hourCycle: "h11",
          })
          .toUpperCase(),
      }));
      setBlogs(myBlogs);
      setLoading(false);
    });
  }, [userID, refreshDependency]); // Include userID and refreshDependency in the dependency array

  return loading ? (
    <Spinner />
  ) : (
    <>
      <h2 className="text-xl font-bold uppercase text-cyan-500 ml-32 sm:ml-64">My Blogs</h2>
      <table className="table table-compact w-full mt-16 mb-14">
        <thead>
          <tr className="text-cyan-500">
            <th className="w-1/2">Title</th>
            <th className="w-1/4">Date</th>
            <th className="w-1/4">Time</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.blog_id}>
              <td>{blog.blog_title}</td>
              <td>{blog.blog_date}</td>
              <td>{blog.blog_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
