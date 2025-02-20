import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Cookies from "js-cookie";

interface AuthContextType {
  user: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { login, logout: authLogout, error, authToken } = useAuth();
  const [user, setUser] = useState<boolean | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get("authToken");
    setUser(!!storedToken); 
  }, [authToken]); 

  const handleLogout = async () => {
    await authLogout();
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout: handleLogout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
};