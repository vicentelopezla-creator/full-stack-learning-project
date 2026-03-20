import type { User } from './user';

export type AuthDialogMode = 'login' | 'register';

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegistrationChallenge = {
  challenge_token: string;
  question: string;
};

export type RegistrationRequestPayload = {
  name: string;
  surname: string;
  email: string;
  password: string;
  consent_accepted: boolean;
  consent_version: string;
  human_challenge_token: string;
  human_challenge_answer: string;
};

export type RegistrationRequestResponse = {
  email: string;
  expires_in_seconds: number;
  detail: string;
};

export type RegistrationVerifyPayload = {
  email: string;
  code: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};
