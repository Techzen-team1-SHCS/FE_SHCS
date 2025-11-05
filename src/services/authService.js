import axios from 'axios';
import api from './api';

export const authService = {
  // 🔹 LOGIN
  login: async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });

    if (response.data.status === 200) {
      const token = response.data.data.access_token;
      const user = response.data.data.user;

      // ✅ Lưu token & user vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Trả về gọn gàng để dùng trong AuthContext.login()
      return { status: 200, token, user };
    }

    return response.data;
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
        const response = await axios.get(`/api/auth/user/${id}`);
        return response.data;
  },

  // 🔹 REGISTER
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  forgotPassword:async(email)=>{
    const response = await api.post('/auth/forgot-password', {email});
    return response.data;
  },
  resetPassword:async(data)=>{
    const response=await api.post('/auth/reset-password',data);
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
  updateProfile: async (userId, profileData,token) => {

  const response = await api.post(
    `/auth/user/update/${userId}`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
},
  // 🔹 UPLOAD AVATAR
  uploadAvatar: async (userId, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const token=localStorage.getItem('token');
    const response = await api.post(`/auth/user/upload-avatar/${userId}`, formData, {
      headers: {
        Authorization:`Bearer ${token}`,
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
  }

};
