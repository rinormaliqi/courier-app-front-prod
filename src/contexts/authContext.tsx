// contexts/auth.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { decodeJwt } from "jose";
import Cookies from "js-cookie";
import { JwtClaims } from "@/src/types/jwt";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (tokens: {
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const accessToken = Cookies.get("access_token");

    if (accessToken) {
      try {
        const decoded = decodeJwt(accessToken) as JwtClaims;
        setUserFromToken(accessToken, decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to validate token:", error);
        logout();
      }
    }

    setLoading(false);
  };

  const setUserFromToken = (token: string, decoded: JwtClaims) => {
    const roles =
      decoded.resource_access?.courier?.roles || decoded.roles || [];

    setUser({
      id: decoded.sub,
      name:
        decoded.name || decoded.preferred_username || decoded.email || "User",
      email: decoded.email || "",
      roles: Array.isArray(roles) ? roles : [roles],
    });
  };

  const login = async ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    Cookies.set("access_token", accessToken, { expires: 1 }); // 1 day expiration
    Cookies.set("refresh_token", refreshToken, { expires: 7 }); // 7 days or as needed

    const decoded = decodeJwt(accessToken) as JwtClaims;
    setUserFromToken(accessToken, decoded);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
