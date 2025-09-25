import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, categoryService } from '../services/api';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories);
    if (id) {
      postService.getPost(id).then(post => {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category?._id || '');
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const postData = { title, content, category };
      if (id) {
        await postService.updatePost(id, postData);
      } else {
        await postService.createPost(postData);
      }
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Post' : 'Create Post'}</h2>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <select value={category} onChange={e => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
};

export default PostForm;
