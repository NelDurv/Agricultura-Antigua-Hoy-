export enum UserMembership {
  Visitor = 'Visitante',
  Free = 'Usuario Registrado',
  Premium = 'Miembro Premium',
  Institutional = 'Institución',
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  date: string;
  code: string;
  recipientName: string;
}

export interface UserProfile {
  name: string;
  email: string;
  membership: UserMembership;
  institution?: string;
  enrolledCourses: string[];
  courseProgress: { [courseId: string]: number };
  completedModules: string[];
  certificates: Certificate[];
  favorites: string[];
}
