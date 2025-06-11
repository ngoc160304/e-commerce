declare interface User {
  email: string;
  userId: string;
  role: string;
}

declare namespace Express {
  export interface Request {
    user: User;
  }
}
