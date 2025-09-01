import {React, useEffect} from 'react';
import { Button, Typography, Space } from 'antd';
import { SafetyOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const buttonGradientStyle = {
  background: 'linear-gradient(90deg, #5CA7F2 0%, #A252F8 100%)', // Adjusted to match image's button gradient
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  height: 'auto',
  padding: '12px 32px',
  fontWeight: 500,
  fontSize: '16px',
};

const featureIconStyle = { 
  fontSize: '28px', 
  color: '#5CA7F2', // Consistent color for features
  marginBottom: '8px'
};

const Login = () => {

    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()

  useEffect(() => {
    // Stocker le token Auth0 dans localStorage si disponible
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("access_token")
    if (token) {
      localStorage.setItem("auth0_token", token)
    }
  }, [])

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <div>Chargement...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        borderRadius: '50%',
        background: 'rgba(92, 103, 242, 0.1)', // Soft blue blob
        filter: 'blur(80px)',
        zIndex: 0,
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40%',
        height: '40%',
        borderRadius: '50%',
        background: 'rgba(162, 82, 248, 0.1)', // Soft purple blob
        filter: 'blur(80px)',
        zIndex: 0,
      }}></div>
      
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        borderRadius: '20px', 
        backgroundColor: 'white',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        maxWidth: '700px',
        width: '100%',
        position: 'relative',
        zIndex: 1, // Ensure content is above background blobs
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0px' }}>
            <img src="../../public/logo.png" alt="HumanRing Logo Icon" style={{ height: '100px' }} />
            <Title level={4} style={{ margin: 0, fontWeight: 600 }}>HumanRing</Title>
          </div>

          {/* Hero Content */}
          <div style={{ marginBottom: '40px' }}>
            <Title level={2} style={{ fontSize: '36px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
              Créez des liens d'engagement émotionnel numérique
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
              HumanRing permet à deux personnes de créer un lien symbolique, sincère et personnel. Exprimez une intention, scellez-la à deux, et gardez-en une trace émotionnelle.
            </Paragraph>
          </div>
          
          {/* CTA Button */}
          <Button
            type="primary"
            size="large"
            className='button-gradient'
            onClick={() => loginWithRedirect()}
          >
            Se connecter
          </Button>

          {/* Feature Icons */}
          <Space size="large" style={{ marginTop: '40px', justifyContent: 'center', width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <SafetyOutlined style={featureIconStyle} />
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Sécurisé</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <HeartOutlined style={featureIconStyle} />
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Émotionnel</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <GlobalOutlined style={featureIconStyle} />
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Universel</div>
            </div>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Login;