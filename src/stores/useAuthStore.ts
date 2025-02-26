import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
  isLoggedIn: boolean;
  organizacao: {
    organizacao_id: number | null;
    organizacao_name: string | null;
  };
  islogin: (token: string, payload: { organizacao_id: number; organizacao_name: string }) => void;
  islogout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  organizacao: {
    organizacao_id: null,
    organizacao_name: null,
  },
  islogin: (token: string, payload: { organizacao_id: number; organizacao_name: string }) => {
    Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'Strict' });

    set({
      isLoggedIn: true,
      organizacao: {
        organizacao_id: payload.organizacao_id,
        organizacao_name: payload.organizacao_name,
      },
    });
  },
  islogout: () => {
    Cookies.remove('authToken');

    set({
      isLoggedIn: false,
      organizacao: {
        organizacao_id: null,
        organizacao_name: null,
      },
    });
  },
}));
