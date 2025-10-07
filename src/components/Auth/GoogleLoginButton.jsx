import { useEffect, useRef } from 'react';
import api  from '../../services/api';
import { toast } from 'react-toastify';

export default function GoogleLoginButton({ onSuccess }) {
  const googleDivRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        toast.error('Thiếu VITE_GOOGLE_CLIENT_ID');
        return;
      }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const { credential: id_token } = response; // JWT từ Google
            const res = await api.post('/auth/login-google', { id_token });
            if (res.data?.status) {
              const token = res.data.token;
              const user = res.data.user;
              if (token) localStorage.setItem('auth_token', token);
              if (user) localStorage.setItem('user', JSON.stringify(user));
              toast.success('Đăng nhập Google thành công');
              onSuccess?.(user);
            } else {
              toast.error(res.data?.message || 'Đăng nhập Google thất bại');
            }
          } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi khi đăng nhập Google');
          }
        },
      });
      if (googleDivRef.current) {
        window.google.accounts.id.renderButton(googleDivRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div ref={googleDivRef} />;
}