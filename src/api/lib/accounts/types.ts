export interface IADSApiUserResponse {
  [key: string]: unknown;
}

export interface IADSApiUserErrorResponse {
  [key: string]: unknown;
}

export interface IRegisterParams {
  email: string;
  errorMsg: string;
  hasError: boolean;
  password1: string;
  password2: string;
  verify_url: string;
  'g-recaptcha-response': string;
}

export interface IRegisterResponse {
  message: string;
}

export interface IRegisterErrorResponse {
  error: string;
}

export interface ICSRFResponse {
  csrf: string;
}

import { AxiosResponse } from 'axios';

export interface IBootstrapPayload {
  username: string;
  scopes: string[];
  client_id: string;
  access_token: string;
  client_name: string;
  token_type: string;
  ratelimit: number;
  anonymous: boolean;
  client_secret: string;
  expire_in: string;
  refresh_token: string;
}

export interface IADSApiBootstrapResponse extends AxiosResponse<IBootstrapPayload> {
  headers: {
    'set-cookie': string;
  };
}

export type IUserData = Pick<IBootstrapPayload, 'username' | 'anonymous' | 'access_token' | 'expire_in'>;
