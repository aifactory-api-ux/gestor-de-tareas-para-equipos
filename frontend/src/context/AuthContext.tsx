import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Usuario, LoginPayload, RegisterPayload } from '../types/models';
import { authService } from '../services/auth.service';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    if (storedUsuario && token) {
      setUsuario(JSON.parse(storedUsuario));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const payload: LoginPayload = { email, password };
    const response = await authService.login(payload);
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('usuario', JSON.stringify(response.usuario));
    setUsuario(response.usuario);
  };

  const register = async (nombre: string, email: string, password: string) => {
    const payload: RegisterPayload = { nombre, email, password };
    await authService.register(payload);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        register,
        logout,
        isAuthenticated: !!usuario,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
