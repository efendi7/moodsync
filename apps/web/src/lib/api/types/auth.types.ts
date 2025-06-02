export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    
    id: string;
    name: string;
    email: string;
  };
  message?: string;
}

export interface ApiResponse {
  message: string;
}