import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, List, Tag, Typography, Space, Empty, Spin, message } from "antd"
import { CloseCircleOutlined, PlusOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useAuth0 } from '@auth0/auth0-react'
import { ringService as createRingService } from '../services/api'

const { Title, Text } = Typography

const Dashboard = () => {
  const [rings, setRings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user, getAccessTokenSilently, getIdTokenClaims  } = useAuth0()
  const ringService = createRingService(getAccessTokenSilently, user)
  const [uuid, setUuid] = useState(null);
  
  const fetchRings = async (userUuid) =>{
    try{
      setLoading(true)
      
      const data = await ringService.getMyRings(userUuid)
      console.log("Fetched rings:", data);
      setRings(Array.isArray(data) ? data : [])
    }catch(error){
      console.error('Error fetching rings:', error)
      message.error('Erreur lors du chargement des engagements')
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    const initDashboard = async () => {
      if (user && user.sub) {
        console.log("User email :", user.email);
        try {
          const idTokenClaims = await getIdTokenClaims();

          const namespace = `https://humanring.com/`;
          const customUuid = idTokenClaims[namespace + 'uuid'];

          if (customUuid) {
            setUuid(customUuid);
            await fetchRings(customUuid);
          } else {
            console.error("UUID not found in token claims. Please check your Auth0 Action.");
            message.error("Erreur: Le UUID de l'utilisateur n'a pas été trouvé.");
            setLoading(false);
          }

        } catch (error) {
          console.error("Failed to get ID Token claims:", error);
          message.error("Erreur lors de la récupération des informations utilisateur.");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    initDashboard();
  }, [user, getIdTokenClaims]);



  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente':
        return 'orange'
      case 'signé':
        return 'green'
      case 'rompu':
        return 'red'
      default:
        return 'default'
    } 
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en_attente':
        return <ClockCircleOutlined  className='status-pending'/>
      case 'signé':
        return <CheckCircleOutlined className='status-signed'/>
      case 'rompu':
        return <CloseCircleOutlined className='status-broken'/>
      default:
        return <CloseCircleOutlined />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'en_attente':
        return 'En attente'
      case 'signé':
        return 'Signé'
      case 'rompu':
        return 'Rompu'
      default:
        return status
    }
  }

  const createdRings = rings.filter((ring) => ring.authorId === uuid)
  const receivedRings = rings.filter((ring) => ring.recipientEmail?.toLowerCase() === user?.email?.toLowerCase())

  if (loading) {
    return(
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    )
  }
  
  return (
    <div className='dashboard-container' style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>

      <div className="dashboard-header">
        <Title level={2} style={{ margin: 0 }}>Bon retour, {user?.name}</Title>
        <Text type="secondary">Renforcez les liens grâce à des engagements numériques significatifs</Text>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', justifyContent: 'center' }}>
        <Button type="primary" className='button-gradient' icon={<PlusOutlined />} onClick={() => navigate('/create')}>
          Créer un nouvel engagement
        </Button>

        <Button
          type="default"
          style={{ backgroundColor: 'white', borderColor: '#f0f0f0', borderRadius: '8px', padding: '10px 24px', height: 'auto', color: '#00796B' }}
          icon={<EyeOutlined />}
          onClick={() => navigate('/history')}
        >
          View History
        </Button>
      </div>

    {/*stats*/}
    <div className='stats-card stat-0'>
      <Title level={3} style={{ margin: 0, color: 'inherit' }}>{rings.length}</Title>
      <Text type='secondary'>Total engagements</Text>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px auto', maxWidth: '1200px' }}>
      <div className='stats-card stat-1'>
        <Title level={4} style={{ margin: 0, color: 'inherit' }}>Signé(s)</Title>
        <Text style={{ fontSize: '2em', color: 'inherit' }}>{rings.filter((r) => r.status === 'signé').length}</Text>
      </div>
      <div className='stats-card stat-2'>
        <Title level={4} style={{ margin: 0, color: 'inherit' }}>En attente</Title>
        <Text style={{ fontSize: '2em', color: 'inherit' }}>{rings.filter((r) => r.status === 'en_attente').length}</Text>
      </div>
      <div className='stats-card stat-3'>
        <Title level={4} style={{ margin: 0, color: 'inherit' }}>Rompu(s)</Title>
        <Text style={{ fontSize: '2em', color: 'inherit' }}>{rings.filter((r) => r.status === 'rompu').length}</Text>
      </div>
    </div>

    {/* créés */}
        <Card title='Mes engagements créés' className='ring-card' extra={<Text type="secondary">{createdRings.length} engagement(s)</Text>} style={{ marginBottom: '24px' }}>
          {createdRings.length === 0 ? (
            <Empty description="Aucun engagement créé" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List dataSource={createdRings} renderItem={(ring)=> (
              <List.Item key={ring.uuid} actions={[ 
                <Button type='link' icon={<EyeOutlined />} onClick={() => navigate(`/ring/${ring.uuid}`)}>
                  Voir
                </Button> ]}>
                <List.Item.Meta title={
                  <Space>
                    <Text strong>Pour: {ring.recipientEmail}</Text>
                    <Tag color={getStatusColor(ring.status)} icon={getStatusIcon(ring.status)}>{getStatusText(ring.status)}</Tag>
                  </Space>
                }
                description={
                  <div>
                    <Text ellipsis style={{ display: 'block', marginBottom: '4px'}}> {ring.message}</Text>
                    <Text type='secondary' style={{ fontSize: '12px' }}>Créé le: {new Date(ring.createdAt).toLocaleDateString('fr-FR')}</Text>
                  </div>
                } />
              </List.Item>
            )}
           />
          )}
        </Card>
{/*reçus*/}

        <Card title='Mes engagements reçus' className='ring-card' extra={<Text type="secondary">{receivedRings.length} engagement(s)</Text>}>
          {receivedRings.length === 0 ? (
            <Empty description="Aucun engagement reçu" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List dataSource={receivedRings} renderItem={(ring)=> (
              <List.Item key={ring.uuid} actions={[ 
                <Button type='link' icon={<EyeOutlined />} onClick={() => navigate(`/ring/${ring.uuid}`)}>
                  Voir
                </Button> ]}>
                <List.Item.Meta title={
                  <Space>
                    <Text strong>Pour: {ring.recipientEmail}</Text>
                    <Tag color={getStatusColor(ring.status)} icon={getStatusIcon(ring.status)}>{getStatusText(ring.status)}</Tag>
                  </Space>
                }
                description={
                  <div>
                    <Text ellipsis style={{ display: 'block', marginBottom: '4px'}}> {ring.message}</Text>
                    <Text type='secondary' style={{ fontSize: '12px' }}>Créé le: {new Date(ring.createdAt).toLocaleDateString('fr-FR')}</Text>
                  </div>
                } />
              </List.Item>
            )}
           />
          )}
        </Card>



      <div className='quote-section'>
        <Text style={{color: '#00796B', fontWeight: 'bold'}}>
          "La confiance se construit avec la constance."
        </Text>
        <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
          Chaque engagement honoré renforce les liens qui nous unissent.
        </Text>
      </div>
      
    </div>
  )
}

export default Dashboard
