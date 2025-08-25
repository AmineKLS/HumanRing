import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { useAuth0 } from '@auth0/auth0-react'
import { Button, Card, Empty, Input, List, message, Space, Spin, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ringService } from '../services/api'


const { Title, Text } = Typography

const History = () => {
  const [rings, setRings] = useState([])
  const [filteredRings, setFilteredRings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const navigate = useNavigate()
  const {user, getAccessTokenSilently, getIdTokenClaims} = useAuth0()
  const [api, setApi] = useState(null)
  const [userUuid, setUserUuid] = useState(null)

  useEffect(()=> {
    const init = async () => {
      const claims = await getIdTokenClaims()
      const uuid = claims['https://humanring.com/uuid']
      setUserUuid(uuid)
      console.log('user uuid from claims ', uuid)
  }
  init()
}, [getIdTokenClaims] )

  useEffect(()=> {
    if (getAccessTokenSilently) {
      setApi(ringService(getAccessTokenSilently))
    }
  }, [getAccessTokenSilently])

  useEffect(()=>{
    if (api){
      fetchRings()
    }
  }, [api])

  useEffect(()=>{
    filterRings()
  }, [rings, searchText, statusFilter])

  const fetchRings = async () => {
    try {
      setLoading(true)
      const data = await api.getMyRings()
      setRings(data)
    } catch (error) {
      console.error("Erreur lors du chargement des rings:", error)
      message.error("Erreur lors du chargement de l'historique")
    }finally{
      setLoading(false)
    }
  }

  const filterRings = () => {
    let filtered = rings 

    if (statusFilter !== 'all'){
      filtered = filtered.filter(ring => ring.status === statusFilter)
    }

    if (searchText){
      filtered = filtered.filter(
        (ring) => ring.message.toLowerCase().includes(searchText.toLowerCase()) || ring.recipientEmail.toLowerCase().includes(searchText.toLowerCase()) || (ring.authorEmail && ring.authorEmail.toLowerCase().includes(searchText.toLowerCase()))
      )
    }
    filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) 

    setFilteredRings(filtered)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "en_attente":
        return <ClockCircleOutlined className="status-pending" />
      case "signé":
        return <CheckCircleOutlined className="status-signed" />
      case "rompu":
        return <CloseCircleOutlined className="status-broken" />
      default:
        return <ClockCircleOutlined />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "en_attente":
        return "En attente"
      case "signé":
        return "Signé"
      case "rompu":
        return "Rompu"
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "en_attente":
        return "orange"
      case "signé":
        return "green"
      case "rompu":
        return "red"
      default:
        return "default"
    }
  }

  const getRingType = (ring) => {
    if (ring.authorId === userUuid){
      return {type: "Créé", partner: ring.recipientEmail}
    }else{
      return {type: "Reçu", partner: ring.authorUsername}
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    )
  }



  return (
    <div style={{ maxWidth: 1000, margin: '0 auto'}}>
      <div style={{ marginBottom: '24px'}}>
        <Title level={2}>Historique des engagements</Title>
        <Title type="secondary">Retrouvez tous vos engagements créés et reçus</Title>
      </div>

      <Card style={{ marginBottom: '24px' }} >
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          <Input.Search placeholder='Rechercher dans les messages ou emails...' allowClear size='large' prefix={<SearchOutlined />} onChange={(e) => setSearchText(e.target.value)} style={{ maxWidth: 400 }}/>

          <Space wrap>
            <Text strong>
              <FilterOutlined /> Filter par statut:
            </Text>
            <Button type={statusFilter === 'all' ? 'primary' : 'default'} onClick={() => setStatusFilter('all')}>Tous({rings.length})</Button>
            <Button type={statusFilter === 'en_attente' ? 'primary' : 'default'} onClick={()=> setStatusFilter('en_attente')}>En attente ({rings.filter((r)=> r.status === 'en_attente').length})</Button>
            <Button type={statusFilter === 'signé' ? 'primary' : 'default'} onClick={()=> setStatusFilter('signé')}>Signé ({rings.filter((r)=> r.status === 'signé').length})</Button>
            <Button type={statusFilter === 'rompu' ? 'primary' : 'default'} onClick={()=> setStatusFilter('rompu')}>Rompu ({rings.filter((r)=> r.status === 'rompu').length})</Button>
          </Space>
        </Space>
      </Card>

      <Card>
        {filteredRings.length === 0 ? (
          <Empty description={searchText || statusFilter !== 'all' ? 'Aucun engagement trouvé' : 'Aucun engagement dans l\'historique' } image={Empty.PRESENTED_IMAGE} />
        ):(
          <List dataSource={filteredRings} renderItem={(ring) => {
            const ringInfo = getRingType(ring)
            return (
              <List.Item key={ring.uuid} actions={[<Button type='link' icon={<EyeOutlined />} onClick={() => navigate(`/ring/${ring.uuid}`)}>Voir détails</Button>]} style={{padding: '16px 0'}}>
                <List.Item.Meta title={
                  <Space>
                    <Tag color={ringInfo.type === "Créé" ? "blue" : "purple"}>{ringInfo.type}</Tag>
                    <Text strong>{ringInfo.partner}</Text>
                    <Tag color={getStatusColor(ring.status)} icon={getStatusIcon(ring.status)}>{getStatusText(ring.status)}</Tag>
                  </Space>
                }
                description={
                  <div>
                    <Text ellipsis style={{ display: 'block', marginBottom: '8px', maxWidth:'600px'}}>{ring.message}</Text>
                    <Space split={<span style={{ color: '#d9d9d9'}}>•</span>}>
                      <Text type='secondary' style={{ fontSize: "12px"}}>
                        {new Date(ring.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                      {ring.updatedAt !== ring.createdAt && (
                        <Text type='secondary' style={{ fontSize: "12px"}}>
                          Mis à jour le {new Date(ring.updatedAt).toLocaleDateString("fr-FR")}
                        </Text>
                      )}
                      {ring.signatures && ring.signatures.length > 0 && (
                        <Text type='secondary' style={{ fontSize: "12px"}}>
                          {ring.signatures.length} signature(s)
                        </Text>
                      )}
                    </Space>
                  </div>
                }
              />
            </List.Item>
            )
          }}
        />
        )}
      </Card>
    </div>
  )
}

export default History
