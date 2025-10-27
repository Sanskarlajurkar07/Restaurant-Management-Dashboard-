const API_BASE_URL = "https://restaurant-management-backend-2.onrender.com/api"

export const apiClient = {
  // Menu endpoints
  getMenu: async (category, page = 1, search = "") => {
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (page) params.append("page", page)
    if (search) params.append("search", search)
    const response = await fetch(`${API_BASE_URL}/menu/category/${category || "all"}?${params}`)
    return response.json()
  },

  getAllMenu: async () => {
    const response = await fetch(`${API_BASE_URL}/menu`)
    return response.json()
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/menu/categories/all`)
    return response.json()
  },

  getMenuItem: async (id) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`)
    return response.json()
  },

  createMenuItem: async (data) => {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  updateMenuItem: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  deleteMenuItem: async (id) => {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  // Order endpoints
  getOrders: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE_URL}/orders?${params}`)
    return response.json()
  },

  getOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`)
    return response.json()
  },

  getChefOrders: async (chefId) => {
    const response = await fetch(`${API_BASE_URL}/orders/chef/${chefId}`)
    return response.json()
  },

  createOrder: async (data) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  updateOrderStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    return response.json()
  },

  deleteOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  // Table endpoints
  getTables: async () => {
    const response = await fetch(`${API_BASE_URL}/tables`)
    return response.json()
  },

  getTable: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`)
    return response.json()
  },

  getAvailableTables: async (capacity) => {
    const response = await fetch(`${API_BASE_URL}/tables/available/${capacity}`)
    return response.json()
  },

  createTable: async (data) => {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  updateTable: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  reserveTable: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tables/${id}/reserve`, {
      method: "PUT",
    })
    return response.json()
  },

  unreserveTable: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tables/${id}/unreserve`, {
      method: "PUT",
    })
    return response.json()
  },

  deleteTable: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  // Chef endpoints
  getChefs: async () => {
    const response = await fetch(`${API_BASE_URL}/chefs`)
    return response.json()
  },

  getChef: async (id) => {
    const response = await fetch(`${API_BASE_URL}/chefs/${id}`)
    return response.json()
  },

  createChef: async (data) => {
    const response = await fetch(`${API_BASE_URL}/chefs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  updateChef: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/chefs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  deleteChef: async (id) => {
    const response = await fetch(`${API_BASE_URL}/chefs/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  assignOrder: async (data) => {
    const response = await fetch(`${API_BASE_URL}/chefs/assign-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Analytics endpoints
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`)
    return response.json()
  },

  getOrdersSummary: async (filter = "daily") => {
    const response = await fetch(`${API_BASE_URL}/analytics/orders-summary?filter=${filter}`)
    return response.json()
  },

  getGraphData: async (type = "daily") => {
    const response = await fetch(`${API_BASE_URL}/analytics/graph?type=${type}`)
    return response.json()
  },

  getOrderProcessing: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/order-processing`)
    return response.json()
  },
}
