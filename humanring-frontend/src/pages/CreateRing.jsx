import { useState } from "react"
import { Card, Form, Input, Button, Typography, Space, message } from "antd"
import { useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { HeartOutlined, SendOutlined } from "@ant-design/icons"
import { ringService as createRingService  } from "../services/api"

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

const CreateRing = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, getAccessTokenSilently } = useAuth0()
  const ringService = createRingService(getAccessTokenSilently)

  const onFinish = async (values) => {

    try {
      setLoading(true)
      const ringData = {
        recipientEmail: values.recipientEmail,
        message: values.message,
        authorId: user.user_id
      }
    
      await ringService.createRing(ringData)
      message.success("Engagement créé avec succès")
      navigate("/")
    } catch (error) {
      console.error("Error creating ring:", error)
      message.error("Erreur lors de la création de l'engagement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Card className="engagement-form">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <HeartOutlined style={{ fontSize: "48px", color: "#667eea", marginBottom: "16px" }} />
            <Title level={2}>Créer un nouvel engagement</Title>
            <Paragraph style={{ fontSize: "16px", color: "#666" }}>
              Créez un lien d'engagement émotionnel avec une personne qui vous est chère. Exprimez votre intention
              sincère et invitez-la à la sceller avec vous.
            </Paragraph>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              label="Email du destinataire"
              name="recipientEmail"
              rules={[
                { required: true, message: "Veuillez saisir l'email du destinataire" },
                { type: "email", message: "Veuillez saisir un email valide" },
              ]}
            >
              <Input placeholder="exemple@email.com" style={{ borderRadius: "8px" }} />
            </Form.Item>

            <Form.Item
              label="Votre message d'engagement"
              name="message"
              rules={[
                { required: true, message: "Veuillez saisir votre message d'engagement" },
                { min: 10, message: "Le message doit contenir au moins 10 caractères" },
                { max: 1000, message: "Le message ne peut pas dépasser 1000 caractères" },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Exprimez votre intention, votre promesse ou votre engagement de manière sincère et personnelle..."
                showCount
                maxLength={1000}
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            <div
              style={{
                background: "#f9f9f9",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <Text strong style={{ color: "#667eea" }}>
                💡 Conseils pour un bon engagement :
              </Text>
              <ul style={{ marginTop: "8px", marginBottom: 0 }}>
                <li>Soyez sincère et authentique</li>
                <li>Exprimez clairement votre intention</li>
                <li>Utilisez un langage personnel et émotionnel</li>
                <li>Évitez les termes trop formels ou légaux</li>
              </ul>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Button size="large" onClick={() => navigate("/")}>
                  Annuler
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  size="large"
                  style={{ minWidth: "150px" }}
                  className="button-gradient"
                >
                  Créer l'engagement
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>

  )
}

export default CreateRing
