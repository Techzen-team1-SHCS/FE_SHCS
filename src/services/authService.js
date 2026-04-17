import api from './api';

export const authService = {
  // 🔹 LOGIN
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { status, data, message } = response.data;

      if (status !== 200) {
        throw new Error(message || 'Đăng nhập thất bại');
      }

      const { access_token, user } = data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        status: 200,
        user,
        token: access_token,
      };
    } catch (err) {
      const serverError = err.response?.data;
      if (serverError) {
        // validation errors (422)
        if (serverError.errors) {
          const firstError = Object.values(serverError.errors)
            .flat()
            .filter(Boolean)[0];
          throw new Error(firstError || serverError.message || 'Đăng nhập thất bại');
        }
        throw new Error(serverError.message || 'Đăng nhập thất bại');
      }

      throw new Error(err.message || 'Đăng nhập thất bại');
    }
  },
  //Login với google
  loginGoogle: async (idToken) => {
    try {
      const res = await api.post("auth/loginGoogle", {
        id_token: idToken,
      });

      if (res.data.status) {
        const { token, user } = res.data;
        // Lưu thông tin đăng nhập
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true, user, token };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.error("Login Google error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Lỗi kết nối server khi đăng nhập Google.",
      };
    }
  },
  getUserById: async (id) => {
    try {
      const response = await api.get(`/auth/user/${id}`);
      const userData = response.data.data || response.data;
      return userData;

    } catch (error) {
      console.error('❌ Error in getUserById:', error);
      throw error;
    }
  },
  // 🔹 REGISTER
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
  // 🔹 LOGOUT
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  // 🔹 Lấy user hiện tại
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // 🔹 Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  // 🔹 UPDATE PROFILE
  // Accepts either a plain object (JSON) or FormData (for file upload).
  updateProfile: async (userId, profileData, token) => {
    const headers = {
      Authorization: `Bearer ${token || localStorage.getItem('token')}`,
    };

    // If profileData is NOT FormData, send JSON
    if (!(profileData instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    } else {
      headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await api.post(
      `/auth/user/update/${userId}`,
      profileData,
      {
        headers,
      }
    );

    return response.data;
  },
  // 🔹 UPLOAD AVATAR
  uploadAvatar: async (userId, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const token = localStorage.getItem('token');
    const response = await api.post(`/auth/user/upload-avatar/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 🔹 REMOVE AVATAR
  removeAvatar: async (userId) => {
    const response = await api.delete(`/auth/user/${userId}/avatar`);
    return response.data;
  },

  // 🔹 GET USER PROFILE
  getUserProfile: async (userId) => {
    const response = await api.get(`/auth/user/${userId}/profile`);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get('/auth/user');
    return response.data.data;
  },
  async blockUser(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication no token not found')
      }
      const response = await api.post(`/auth/users/${id}/block`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to block user");
    }
  },
  async unblockUser(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication no token not found')
      }
      const response = await api.post(`/auth/users/${id}/unblock`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to block user");
    }
  },
  async updateUser(id, userData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication no token not found')
      }
      const response = await api.post(`/auth/user/update/${id}`, userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Update user error:', error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  }
};
