"use client"

import { useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Button, Card, Typography, Space } from "antd"
import { Navigate } from "react-router-dom"
import { HeartOutlined, SafetyOutlined, GlobalOutlined, LoginOutlined } from "@ant-design/icons"

const { Title, Paragraph } = Typography

const Login = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()

  useEffect(() => {
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <HeartOutlined style={{ fontSize: "48px", color: "#667eea" }} />
            <Title level={1} className="humanring-logo" style={{ margin: "16px 0" }}>
              HumanRing
            </Title>
          </div>

          <div>
            <Title level={3} style={{ color: "#333" }}>
              Créez des liens d'engagement émotionnel numérique
            </Title>
            <Paragraph style={{ fontSize: "16px", color: "#666" }}>
              HumanRing permet à deux personnes de créer un lien symbolique, sincère et personnel. Exprimez une
              intention, scellez-la à deux, et gardez-en une trace émotionnelle.
            </Paragraph>
          </div>

          <Space direction="vertical" size="middle">
            <div style={{ display: "flex", justifyContent: "space-around", margin: "20px 0" }}>
              <div style={{ textAlign: "center" }}>
                <SafetyOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
                <div style={{ marginTop: "8px", fontSize: "14px" }}>Sécurisé</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <HeartOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />
                <div style={{ marginTop: "8px", fontSize: "14px" }}>Émotionnel</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <GlobalOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <div style={{ marginTop: "8px", fontSize: "14px" }}>Universel</div>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              onClick={() => loginWithRedirect()}
              className="button-gradient"
              style={{
                width: "100%",
                height: "48px",
                fontSize: "16px",
                borderRadius: "8px",
              }}
            >
              <LoginOutlined />
              Se connecter
            </Button>
          </Space>

          <Paragraph style={{ fontSize: "12px", color: "#999", marginTop: "20px" }}>
            En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </Paragraph>
        </Space>
      </Card>
    </div>
  )
}

export default Login
