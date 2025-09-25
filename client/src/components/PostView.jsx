import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    postService.getPost(id)
      .then(setPost)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="post-view">
      <h2>{post.title}</h2>
      {post.featuredImage && <img src={post.featuredImage} alt="Featured" style={{ maxWidth: 400 }} />}
      <p>{post.content}</p>
      <div>Category: {post.category?.name}</div>
      <div>Author: {post.author?.username || 'Unknown'}</div>
    </div>
  );
};

export default PostView;
