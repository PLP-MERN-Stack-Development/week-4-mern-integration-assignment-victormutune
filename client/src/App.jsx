import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import PostList from './components/PostList';
import PostView from './components/PostView';
import PostForm from './components/PostForm';
import AuthForm from './components/AuthForm';
import { authService } from './services/api';

const PrivateRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/create" element={<PrivateRoute><PostForm /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><PostForm /></PrivateRoute>} />
          <Route path="/login" element={<AuthForm mode="login" />} />
          <Route path="/register" element={<AuthForm mode="register" />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
