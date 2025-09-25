import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    postService.getAllPosts()
      .then(setPosts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="post-list">
      <h2>Blog Posts</h2>
      {posts.length === 0 ? <p>No posts found.</p> : (
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              <Link to={`/posts/${post._id}`}>{post.title}</Link>
              <span> | {post.category?.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
