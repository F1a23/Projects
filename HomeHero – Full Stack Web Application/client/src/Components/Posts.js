import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPosts, deletePost } from "../Features/PostSlice";
import { Table } from "reactstrap";
import moment from "moment";
import { likePost } from "../Features/PostSlice";
import { FaThumbsUp } from "react-icons/fa";

const Posts = () => {
  const posts = useSelector((state) => state.posts.posts);
  const email = useSelector((state) => state.users.user.email);
  const userId = useSelector((state) => state.users.user._id);
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLikePost = (postId) => {
    const postData = {
      postId: postId,
      userId: userId,
    };
    dispatch(likePost(postData));
    navigate("/post");
  };

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user]);
  return (
    <div className="container">
      <br />
      <br />
      <br />
      <h1 className="h1">Users Feedback</h1>
      <br />
      <br />
      <div className="row">
        {posts.map((post) => (
          <div className="col-md-4 mb-4" key={post._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{post.email}</h5>
                <p className="card-text">
                  {post.postMsg} <br />
                  <small className="text-muted">
                    {moment(post.createdAt).fromNow()}
                  </small>
                </p>
                <div className="button-container">
                  <a
                    href="#"
                    className="buttona"
                    onClick={() => handleLikePost(post._id)}
                  >
                    Like <FaThumbsUp /> ({post.likes.count})
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
