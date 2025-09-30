export interface Role {
  role_id: number;
  name: string;
  description?: string | null;
}
export interface Permission {
  permission_id: number;
  permission_string: string;
  resource?: string | null;
  // Optional fields included by the mock API
  scope?: string | null;
  action?: string | null;
  description?: string | null;
}
export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  first_name: string;
  last_name_p: string;
  last_name_m?: string | null;
  initials?: string | null;
  email: string;
  // Optional profile and identity fields
  auth_provider?: string | null;
  email_verified_at?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone_number?: string | null;
  azure_ad_object_id?: string | null;
  upn?: string | null;
  // Timestamps and activity
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
  is_active: 0 | 1;
  mfa_enabled: 0 | 1;
}
export interface UserSession {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name_p: string;
  last_name_m?: string | null;
  initials?: string | null;
  is_active: boolean;
  mfa_enabled: boolean;
  roles: Role[];
  permissions: Permission[];
  full_name: string;
}
