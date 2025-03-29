class APIClient {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl
  }

  async request(method, endpoint, data = null, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    const options = {
      method,
      headers
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options)
    return response.json()
  }

  async getState(token) {
    return await this.request('GET', '/state', null, token)
  }

  async saveState(state, token) {
    await this.request('POST', '/state', state, token)
  }
}

export default new APIClient()
