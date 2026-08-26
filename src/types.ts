export type UserRole = 'teacher' | 'student' | 'guest';

export type LessonCategory = 
  | 'turkce' 
  | 'ingilizce' 
  | 'matematik' 
  | 'zeka_oyunlari' 
  | 'degerler_egitimi';

export interface Classroom {
  id: string;
  name: string;
  color: string;
  icon: string;
  ageGroup: string;
  description: string;
  createdAt: string;
}

export interface StudentBadge {
  id: string;
  title: string;
  icon: string;
  awardedAt: string;
  reason: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  parentName: string;
  parentPhone: string;
  email: string;
  password?: string;
  classId: string;
  className: string;
  avatar: string;
  registeredAt: string;
  starsCount: number;
  teacherNote?: string;
  badges?: StudentBadge[];
}

export interface VideoLesson {
  id: string;
  title: string;
  category: LessonCategory;
  durationSeconds: number;
  videoUrl: string;
  description: string;
  targetAge: string;
  thumbnail: string;
  lyricsOrNotes?: string;
  teacherName?: string;
  addedAt: string;
}

export interface WatchLog {
  id: string;
  studentId: string;
  studentName: string;
  videoId: string;
  videoTitle: string;
  category: LessonCategory;
  watchSeconds: number;
  totalDurationSeconds: number;
  completedPercent: number;
  lastWatchedAt: string;
}

export interface GameActivity {
  id: string;
  studentId: string;
  studentName: string;
  gameId: 'animal_sounds' | 'number_match' | 'memory_cards' | 'shape_color';
  gameTitle: string;
  score: number;
  maxScore: number;
  starsAwarded: number;
  playedAt: string;
}

export interface CurrentUser {
  role: UserRole;
  student?: Student;
  username?: string;
  name: string;
}
