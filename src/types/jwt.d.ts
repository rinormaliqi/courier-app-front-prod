// types/jwt.d.ts
export interface JwtClaims {
  exp: number;
  iat: number;
  sub: string;
  iss: string;
  aud: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  roles?: string[];
}
