import {create} from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
  isLoggedIn: boolean;
  islogin: (token: string) => void;
  islogout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  islogin: (token: string) => {
    Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'Strict' });
    set({ isLoggedIn: true });
  },
  islogout: () => {
    Cookies.remove('authToken');
    set({ isLoggedIn: false});
  },
}));
