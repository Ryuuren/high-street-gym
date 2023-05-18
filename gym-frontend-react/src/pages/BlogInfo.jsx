import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getBlogByID } from "../api/blog";
import { getUserByID } from "../api/user";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";

export default function BlogInfo() {
  const { blogID } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Loading blog");
    getBlogByID(blogID)
      .then((blog) => {
        setBlog(blog);
        getUserByID(blog.blog_user_id).then((user) => {
          setUser(user);
          setLoading(false);
        });
      })
      .catch((error) => console.log(error));
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Nav />
      <div className="hero w-1/3  mx-auto min-h-6 bg-base-100 flex justify-center items-center">
        <div className="hero-content">
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold text-cyan-500 uppercase">{blog.blog_title}</h1>
            {user && (
              <p className="py-2 font-semi-bold text-cyan-500">
                By {user.user_firstname} {user.user_lastname}
              </p>
            )}
            <p className="py-6">{blog.blog_content}</p>
            <p className="py-6">
              Posted on {new Date(blog.blog_datetime).toLocaleDateString()} at{" "}
              {new Date(blog.blog_datetime)
                .toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  hourCycle: "h11",
                })
                .toUpperCase()}
            </p>
            <button className="btn btn-info" onClick={() => navigate("/blogs")}>
              Back
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
