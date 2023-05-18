import { useState } from "react";
import { useAuthentication } from "../hooks/authentication";
import BlogPost from "../components/BlogPost";
import UserBlogs from "../components/UserBlogs";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";

export default function MyBlogs() {
  const [user] = useAuthentication();

  const [refreshTrigger, setRefreshTrigger] = useState();

  const handleBlogPostAdded = () => {
    setRefreshTrigger({}); // Trigger the refresh by updating the state
  };

  return (
    <>
      <Nav />
      {user ? (
        <div className="container p-2 mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Blog Post Form and User Blogs List */}
          <div className="md:col-span-2 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="overflow-x-auto pr-10">
                <UserBlogs userID={user.user_id} refreshDependency={refreshTrigger} />
              </div>
              <div>
                <BlogPost onAdded={handleBlogPostAdded} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
      <Footer />
    </>
  );
}
