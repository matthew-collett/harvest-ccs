class APIClient {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  async request(method, endpoint, data = null) {
    const headers = {
      'Content-Type': 'application/json'
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const options = {
      method,
      headers
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options)

    if (response.status === 401) {
      this.token = null
      throw new Error('Unauthorized: Please login again')
    }

    return response.json()
  }

  async getState() {
    return await this.request('GET', '/state')
  }

  async saveState(state) {
    await this.request('POST', '/state', state)
  }
}

export default new APIClient()
