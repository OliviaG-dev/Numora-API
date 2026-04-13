declare namespace Express {
  interface Locals {
    auth?: {
      userId: string;
      email?: string;
    };
  }
}
