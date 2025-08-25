import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const ringService = (getAccessTokenSilently) => {
  const getAuthHeader = async () => {
    const token = await getAccessTokenSilently()
    console.log("Using token:", token)
    return { Authorization: `Bearer ${token}` }
  }

  return {

    getMyRings: async () => {
      const headers = await getAuthHeader();
      const token = headers.Authorization.split(" ")[1];
      const payload = JSON.parse(atob(token.split(".")[1]));
      const uuid = payload["https://humanring.com/uuid"];

      if (!uuid) throw new Error("UUID not found in token");
      const response = await axios.get(`${BACKEND_URL}/users/${uuid}/rings`, { headers });
      return response.data;
    },
    
    createRing: async (ringData) => {
      const headers = await getAuthHeader()
      const response = await axios.post(`${BACKEND_URL}/rings`, ringData, { headers })
      return response.data
    },

    signRing: async (ringId, ringData, status) => {
      const headers = await getAuthHeader()
      const response = await axios.post(`${BACKEND_URL}/rings/${ringId}/sign`,{ createSignatureDto: ringData, status }, { headers })
      return response.data
    },

    getRingById: async (ringId) => {
      const headers = await getAuthHeader()
      const response = await axios.get(`${BACKEND_URL}/rings/${ringId}`, { headers })
      return response.data
    }
  }
}
