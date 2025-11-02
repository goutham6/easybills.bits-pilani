const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const authAPI = {
  login: (credentials) =>
    apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiCall("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};

export const claimsAPI = {
  getAll: (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return apiCall(`/api/claims${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id) => apiCall(`/api/claims/${id}`),

  create: (claimData) =>
    apiCall("/api/claims", {
      method: "POST",
      body: JSON.stringify(claimData),
    }),

  update: (id, claimData) =>
    apiCall(`/api/claims/${id}`, {
      method: "PUT",
      body: JSON.stringify(claimData),
    }),

  submit: (id) =>
    apiCall(`/api/claims/${id}/submit`, {
      method: "POST",
    }),

  uploadDocument: async (id, formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/claims/${id}/documents`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Document upload failed");
    }
    return data;
  },

  addComment: (id, message) =>
    apiCall(`/api/claims/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  getPendingClaims: () => apiCall("/api/claims/accounts/pending"),

  verifyClaim: (id, verificationData) =>
    apiCall(`/api/claims/${id}/verify`, {
      method: "PUT",
      body: JSON.stringify(verificationData),
    }),
};

export default apiCall;