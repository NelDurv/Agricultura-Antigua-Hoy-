import { UserMembership } from '../types';

export const MEMBERSHIP_LABELS: Record<UserMembership, string> = {
  [UserMembership.Visitor]: 'Visitante',
  [UserMembership.Free]: 'Usuario Registrado',
  [UserMembership.Premium]: 'Miembro Premium',
  [UserMembership.Institutional]: 'Institución',
};

export const MEMBERSHIP_ORDER: UserMembership[] = [
  UserMembership.Visitor,
  UserMembership.Free,
  UserMembership.Premium,
  UserMembership.Institutional,
];
