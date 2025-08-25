  import React, { useState, useEffect } from 'react'
  import { Layout as AntLayout, Menu, Dropdown, Button, Avatar } from 'antd'
  import { useAuth0 } from '@auth0/auth0-react'
  import { useNavigate, useLocation } from 'react-router-dom'
  import { DashboardOutlined, PlusOutlined, HistoryOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons'

  const { Header, Content } = AntLayout

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
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#292C7B', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', height: '80px', padding: '0 40px', position: 'fixed', top: 0, width: '100%', zIndex: 1000, transition: 'background-color 0.3s ease, opacity 0.3s ease', opacity: scrolled ? 0.85 : 1 }} >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <HeartOutlined style={{ fontSize: '30px', color: '#18a88e', marginRight: '8px' }} onClick={() => navigate('/')}/>
              <a className='humanring-logo' style={{ fontSize: '24px', fontWeight: 'bold', color: '#18a88e' }} onClick={() => navigate('/')}>HumanRing</a>
            </div>
            {isAuthenticated && (
            <>
            <Menu mode="horizontal" selectedKeys={[location.pathname]}  style={{ flex: 1, marginLeft: '40px', border: 'none', background: ' #18a88e' }} />
              <Dropdown style={{background: '#18a88e' }} menu={{ items: userMenuItems }} placement="bottomRight">
                <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={user?.picture} icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                  {user?.name || user?.email}
                </Button>
              </Dropdown>
            </>
            )}
        </Header>
        <Content style={{ padding: '24px', background: '#F5F5F5', marginTop: '80px' }}>{children}</Content>
      </AntLayout>
    )
  }

  export default Layout
