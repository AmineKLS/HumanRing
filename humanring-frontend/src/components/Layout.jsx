  import React, { useState, useEffect } from 'react'
  import { Layout as AntLayout, Menu, Dropdown, Button, Avatar, Typography } from 'antd'
  import { useAuth0 } from '@auth0/auth0-react'
  import { useNavigate, useLocation } from 'react-router-dom'
  import { DashboardOutlined, PlusOutlined, HistoryOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons'


  const { Header, Content } = AntLayout
  const { Title } = Typography

  const Layout = ({children}) => {

    const { user, logout, isAuthenticated } = useAuth0()
    const navigate = useNavigate()
    const location = useLocation()

    const [scrolled, setScrolled] = useState(false)

    useEffect(()=>{
      const handleScroll = () => {
        setScrolled(window.scrollY > 30)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    const userMenuItems = [
      { key: 'profile', label: user?.name || user?.email },
      { type: 'divider' },
      { key: 'logout', label: 'Déconnexion', onClick: () => logout({ returnTo: window.location.origin }) },
    ]

    return (
      <AntLayout style={{ minHeight: '100vh' }}>
        {isAuthenticated && (
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f5f5', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', height: '80px', padding: '0 40px', position: 'fixed', top: 0, width: '100%', zIndex: 1000, transition: 'background-color 0.3s ease, opacity 0.3s ease', opacity: scrolled ? 0.65 : 1 }} >
            <div style={{ marginTop: '40px', marginBottom: '40px', display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center', gap: '0px' }} onClick={() => navigate('/')}>
              <img src="../../public/logo.png" alt="HumanRing Logo Icon" style={{ height: '100px' }} />
              <a><Title level={4} style={{ margin: 0, fontWeight: 600 }}>HumanRing</Title></a>
            </div>
            <Menu mode="horizontal" selectedKeys={[location.pathname]}  style={{ flex: 1, marginLeft: '40px', border: 'none', background: ' #18a88e' }} />
              <Dropdown style={{background: '#18a88e' }} menu={{ items: userMenuItems }} placement="bottomRight">
                <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={user?.picture} icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                  {user?.name || user?.email}
                </Button>
              </Dropdown>
        </Header>
        )}
        <Content style={{  background: 'linear-gradient(180deg, rgba(230, 247, 255, 0.4) 0%, rgba(249, 227, 255, 0.4) 100%)' }}>{children}</Content>
      </AntLayout>
    )
  }

  export default Layout
