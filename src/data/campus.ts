import type { Course } from '../types';
import type { Course32 } from './courses32';
import { COURSES } from './courses/index';
import { COURSES32, getCampusCourseById } from './courses32';

export type { Course, Course32 };
export { COURSES, getCourseById } from './courses/index';
export { COURSES32 } from './courses32';
