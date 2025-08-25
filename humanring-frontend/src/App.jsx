import React from 'react';
import Layout from './components/Layout';
import frFR from 'antd/locale/fr_FR';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateRing from './pages/CreateRing';
import RingDetail from './pages/RingDetail';
import History from './pages/History';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
  <ConfigProvider theme={{ token: { colorPrimary: '#18a88e', borderRadius: 8 } }} locale={frFR}>
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateRing /></ProtectedRoute>} />
          <Route path="/ring/:id" element={<ProtectedRoute><RingDetail /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  </ConfigProvider>
  );
}

export default App;