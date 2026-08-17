/** Every backend controller responds with this envelope (see errorMiddleware.js / controllers) */
export interface ApiSuccess<T> {
  success: true;
  message?: string;
  count?: number;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  stack?: string | null;
}
