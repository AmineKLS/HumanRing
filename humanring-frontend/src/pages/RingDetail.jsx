import React, { useState ,useEffect } from 'react'
import { Card, Space,  Tag, Typography, Input, Alert, Button, Form, message, Spin } from 'antd'
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseOutlined, HeartOutlined, MailOutlined, UserOutlined, CheckOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { ringService } from '../services/api'


const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

const RingDetail = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [ring, setRing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [form] = Form.useForm()
  const signingRings = ringService(getAccessTokenSilently)

  useEffect(()=>{
    fetchRing()
  }, [id, getAccessTokenSilently])

  const fetchRing = async () => {
    try {
      setLoading(true)
      const data = await signingRings.getRingById(id)
      setRing(data)
    } catch (error) {
      console.error("Error fetching ring:", error)
      message.error("Engagement non trouvé")
    } finally {
      setLoading(false)
    }
  }

  const handleSignatureAction = async (values, status) => {
    try {
      setSigning(true)
      const signatureData = {
        signatureText: values.signatureText,
        userId: user.sub,
      }
      
      await signingRings.signRing(id, signatureData, status)
      
      if (status === 'signé') {
        message.success("Engagement signé avec succès!")
      } else {
        message.info("Engagement refusé")
      }
      
      fetchRing()
    }catch(error){
      console.error(`Error handling action for status ${status}:`, error)
      message.error("Erreur lors de la mise à jour de l'engagement")
    }finally{
      setSigning(false)
    }
  }

  const handleFormSubmit = async (status) => {
  try {
    await form.validateFields()
    const values = form.getFieldsValue()
    handleSignatureAction(values, status)
  } catch {
  }
}

  if (loading) {
    return(
      <div style={{ display:'flex', justifyContent:'center', padding:'50px'}}>
        <Spin size='large' />
      </div>
    )
  }

  if (!ring) {
    return (
      <Alert message="Engagement non trouvé" description="Cet engagement n'existe pas ou n'est plus accessible." type="error" showIcon />
    )
  }

  const isRecipient = isAuthenticated && user?.email === ring.recipientEmail
  const canSign = isRecipient && ring.status === 'en_attente'

  const setStatusColor = (status) => {
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

  const setStatusIcon = (status) => {
    switch (status) {
      case 'en_attente':
        return <ClockCircleOutlined/>
      case 'signé':
        return <CheckCircleOutlined/>
      case 'rompu':
        return <CloseOutlined/>
      default:
        return <ClockCircleOutlined />
    }

  }

  
  return (
    <div>
      <Card className="ring-detail">
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <div style={{ textAlign: "center" }}>
            <HeartOutlined style={{ fontSize: "48px", color: "#667eea", marginBottom: "16px" }} />
            <Title level={2}>Engagement émotionnel</Title>
            <Tag color={setStatusColor(ring.status)} icon={setStatusIcon(ring.status)} style={{ fontSize: "14px", padding: '4px 12px' }}>
              {ring.status === 'en_attente' ? 'En attente de signature' : ring.status === 'signé' ? 'Signé' : 'Rompu'}
            </Tag>
          </div>

          <div>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Text strong><UserOutlined /> Créé par: {ring.authorUsername || 'Inconnu'} </Text>
                  <br />
                  <Text>{ring.authorEmail}</Text>
                </div>
                <div>
                  <Text strong><MailOutlined /> Destinataire:</Text>
                  <br />
                  <Text>{ring.recipientEmail}</Text>
                </div>
              </div>

              <div>
                <Text strong><CalendarOutlined /> Date de création:</Text>
                <br />
                <Text type="secondary">{new Date (ring.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' , hour: '2-digit', minute:'2-digit'})}</Text>
              </div>
            </Space>
          </div>


          <div className='signature-section'>
            <Title level={4}>Message d'engagement:</Title>
            <Paragraph style={{ fontSize: '14px', lineHeight: '1.5', fontStyle: 'italic', background:'white', padding:'16px', borderRadius: '8px', border:'1px solid #e8e8e8' }}>"{ring.message}"</Paragraph>
          </div>

          {ring.signatures && ring.signatures.length > 0 && (
            <div className='signature-section'>
              <Title level={4}>Signatures:</Title>
              {ring.signatures.map((sig, index) => (
                <div key={index} style={{ background:'white', padding:'16px', borderRadius:'8px', marginBottom:'8px'}}>
                  <Text strong>{sig.email}</Text>
                  <br/>
                  <Text>{sig.signatureText}</Text>
                  <br/>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{new Date(sig.signedAt).toLocaleDateString('fr-FR')}</Text>
                </div>
              ))}
            </div>
              )}


            {canSign && (
              <div className='signature-section'>
                <Title level={4}>Votre réponse:</Title>
                <Form form={form} layout='vertical'>
                  <Form.Item name='signatureText' rules={[{ required: true, message:'Veuillez saisir votre réponse'}, {min: 5, message: 'La réponse doit contenir au moins 5 caractères'}]}>
                    <TextArea rows={4} placeholder='Exprimez votre acceptation de cet engagement de manière sincère...' showCount maxLength={500} />
                  </Form.Item>

                  <Space>
                    <Button type='primary' className='button-gradient' htmlType='submit' loading={signing} icon={<CheckOutlined />} size='large' onClick={()=> handleFormSubmit('signé')}>
                      Accepter et signer
                    </Button>
                    <Button danger htmlType='submit' onClick={() => handleFormSubmit('rompu')} icon={<CloseOutlined />} size='large' loading={signing}>
                      Refuser
                    </Button>
                  </Space>
                </Form>
              </div>
            )}

            {!isAuthenticated && ring.status === 'en_attente' && (
              <Alert message="Connexion requise" description="Vous devez vous connecter pour répondre à cet engagement." type="info" showIcon action={<Button size="small" onClick={()=> navigate('/login')}>Se connecter </Button>}/>
            )}

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button onClick={()=> navigate('/')}>Retour au dashboard</Button>
            </div>
        </Space>
      </Card>
    </div>
  )
}

export default RingDetail
