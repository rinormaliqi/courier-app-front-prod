// types/auth.d.ts
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

export interface User {
  name: string;
  email: string;
  roles: string[];
  // Add other user properties from JWT
}
