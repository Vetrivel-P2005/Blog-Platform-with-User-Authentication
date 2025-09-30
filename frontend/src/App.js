import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Edit3, Trash2, MessageCircle, Plus, LogIn, LogOut, Home, AlertCircle, Loader } from 'lucide-react';

// Auth Context for managing user state
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// API Configuration
const API_BASE = 'http://localhost:5000/api';

// API Service
const api = {
  // Auth endpoints
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  // Post endpoints
  getPosts: async (page = 1) => {
    const response = await fetch(`${API_BASE}/posts?page=${page}&limit=10`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return response.json();
  },

  createPost: async (postData, token) => {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create post');
    }
    
    return response.json();
  },

  updatePost: async (postId, postData, token) => {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update post');
    }
    
    return response.json();
  },

  deletePost: async (postId, token) => {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete post');
    }
    
    return response.json();
  },

  // Comment endpoints
  getComments: async (postId) => {
    const response = await fetch(`${API_BASE}/comments/${postId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    
    return response.json();
  },

  createComment: async (commentData, token) => {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add comment');
    }
    
    return response.json();
  }
};

// Utility function to get stored token
const getStoredAuth = () => {
  const token = sessionStorage.getItem('blog_token');
  const user = sessionStorage.getItem('blog_user');
  
  if (token && user) {
    return {
      token,
      user: JSON.parse(user)
    };
  }
  
  return null;
};

// Components
const LoadingSpinner = ({ size = 20 }) => (
  <Loader size={size} className="animate-spin" />
);

const ErrorMessage = ({ message, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
    <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
    <div className="flex-1">
      <p className="text-red-800">{message}</p>
    </div>
    {onClose && (
      <button onClick={onClose} className="text-red-500 hover:text-red-700">
        ×
      </button>
    )}
  </div>
);

const SuccessMessage = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start gap-3">
    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
      <span className="text-white text-xs">✓</span>
    </div>
    <div className="flex-1">
      <p className="text-green-800">{message}</p>
    </div>
    {onClose && (
      <button onClick={onClose} className="text-green-500 hover:text-green-700">
        ×
      </button>
    )}
  </div>
);

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home size={24} />
          BlogPlatform
        </h1>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="flex items-center gap-2">
                <User size={20} />
                Welcome, {user.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-blue-100">
              <LogIn size={16} />
              Please log in to create posts
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const PostCard = ({ post, onEdit, onDelete, onViewComments }) => {
  const { user } = useAuth();
  const isOwner = user && user.id === post.author._id;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
          <p className="text-sm text-gray-600">
            By {post.author.name} • {formatDate(post.createdAt)}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(post)}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Edit post"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-gray-700 mb-4">
        {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
      </p>
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => onViewComments(post)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <MessageCircle size={16} />
          {post.commentCount || 0} Comments
        </button>
        {post.content.length > 200 && (
          <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Read More
          </button>
        )}
      </div>
    </div>
  );
};

const CreatePostForm = ({ onSubmit, editPost, onCancel, loading }) => {
  const [title, setTitle] = useState(editPost?.title || '');
  const [content, setContent] = useState(editPost?.content || '');
  const [tags, setTags] = useState(editPost?.tags?.join(', ') || '');

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setContent(editPost.content);
      setTags(editPost.tags?.join(', ') || '');
    }
  }, [editPost]);

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      onSubmit({ title, content, tags: tagArray });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">
        {editPost ? 'Edit Post' : 'Create New Post'}
      </h3>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Tags (comma separated, e.g., React, JavaScript, Tutorial)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div>
          <textarea
            placeholder="Write your post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            disabled={loading}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !content.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading && <LoadingSpinner size={16} />}
            {editPost ? 'Update Post' : 'Publish Post'}
          </button>
          {editPost && (
            <button
              onClick={onCancel}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ onLogin, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = () => {
    if (isSignup) {
      if (name && email && password) {
        onLogin({ name, email, password, isSignup: true });
      }
    } else {
      if (email && password) {
        onLogin({ email, password, isSignup: false });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? 'Sign Up' : 'Login'}
        </h2>
        <div className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size={16} />}
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </button>
        </div>
        
        
      </div>
    </div>
  );
};

const CommentSection = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    loadComments();
  }, [post._id]);

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const commentsData = await api.getComments(post._id);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;

    try {
      setLoading(true);
      const result = await api.createComment({
        content: newComment,
        postId: post._id
      }, token);
      
      setComments([...comments, result.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">Comments for "{post.title}"</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          
          {user && (
            <div className="mb-6">
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                disabled={loading}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !newComment.trim()}
                className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {loading && <LoadingSpinner size={16} />}
                Add Comment
              </button>
            </div>
          )}
          
          <div className="space-y-4">
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={24} />
              </div>
            ) : comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment._id} className="border-l-4 border-blue-200 pl-4 py-2">
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    By {comment.author.name} • {formatDate(comment.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const BlogPlatform = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const storedAuth = getStoredAuth();
    if (storedAuth) {
      setUser(storedAuth.user);
      setToken(storedAuth.token);
    }
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setPostsLoading(true);
      const result = await api.getPosts();
      setPosts(result.posts);
    } catch (error) {
      setError('Failed to load posts. Please try again.');
      console.error('Failed to load posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = credentials.isSignup 
        ? await api.register(credentials)
        : await api.login(credentials);
      
      setUser(result.user);
      setToken(result.token);
      
      // Store in session storage
      sessionStorage.setItem('blog_token', result.token);
      sessionStorage.setItem('blog_user', JSON.stringify(result.user));
      
      setSuccess(credentials.isSignup ? 'Account created successfully!' : 'Login successful!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setShowCreateForm(false);
    setEditingPost(null);
    
    // Clear storage
    sessionStorage.removeItem('blog_token');
    sessionStorage.removeItem('blog_user');
    
    setSuccess('Logged out successfully');
  };

  const handleCreatePost = async (postData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await api.createPost(postData, token);
      setPosts([result.post, ...posts]);
      setShowCreateForm(false);
      setSuccess('Post created successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (postData) => {
    if (!editingPost) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await api.updatePost(editingPost._id, postData, token);
      setPosts(posts.map(post => 
        post._id === editingPost._id 
          ? result.post
          : post
      ));
      setEditingPost(null);
      setSuccess('Post updated successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await api.deletePost(postId, token);
      setPosts(posts.filter(post => post._id !== postId));
      setSuccess('Post deleted successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto p-6">
          {/* Error and Success Messages */}
          {error && (
            <ErrorMessage 
              message={error} 
              onClose={() => setError(null)} 
            />
          )}
          
          {success && (
            <SuccessMessage 
              message={success} 
              onClose={() => setSuccess(null)} 
            />
          )}

          {!user ? (
            <LoginForm onLogin={login} loading={loading} />
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowCreateForm(!showCreateForm);
                    setEditingPost(null);
                  }}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                  <Plus size={20} />
                  {showCreateForm ? 'Cancel' : 'Create New Post'}
                </button>
              </div>

              {(showCreateForm || editingPost) && (
                <CreatePostForm
                  onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
                  editPost={editingPost}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setEditingPost(null);
                  }}
                  loading={loading}
                />
              )}

              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Posts</h2>
                
                {postsLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size={32} />
                  </div>
                ) : posts.length > 0 ? (
                  posts.map(post => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onEdit={(post) => {
                        setEditingPost(post);
                        setShowCreateForm(false);
                      }}
                      onDelete={handleDeletePost}
                      onViewComments={setSelectedPostForComments}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No posts yet. Create your first post!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {selectedPostForComments && (
          <CommentSection
            post={selectedPostForComments}
            onClose={() => setSelectedPostForComments(null)}
          />
        )}
      </div>
    </AuthContext.Provider>
  );
};

export default BlogPlatform;