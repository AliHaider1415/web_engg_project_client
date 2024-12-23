import { React, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Layout from './layout/app-layout';
import Login from './pages/public/login';
import Register from './pages/public/register';
import NotFound from './pages/public/not-found';
import CreateBlog from './pages/user/create-blog';
import BlogListing from './pages/public/blog-listing';
import BlogDetail from './pages/public/blog-detail';
import useUserStore from './store/user-store';

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Exclude layout for login and sign-up pages
  const isLoginPage = location.pathname === '/' || location.pathname === '/sign-up';

  return (
    <>
      {!isLoginPage ? (
        <Layout>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/blog/create" element={<ProtectedRoute allowedRoles={['user']} component={CreateBlog} />} />
            <Route path="/blog/listing" element={<ProtectedRoute allowedRoles={['user', 'guest']} component={BlogListing} />} />
            <Route path="/blog/detail/:id" element={<ProtectedRoute allowedRoles={['user', 'guest']} component={BlogDetail} />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
        </Routes>
      )}
    </>
  );
}

// ProtectedRoute component
function ProtectedRoute({ component: Component, allowedRoles }) {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !allowedRoles.includes(user.role)) {
      navigate('/'); // Redirect to login if no user or role mismatch
    }
  }, [user, allowedRoles, navigate]);

  // Return the component only if the user is allowed
  return user && allowedRoles.includes(user.role) ? <Component /> : null;
}

export default App;