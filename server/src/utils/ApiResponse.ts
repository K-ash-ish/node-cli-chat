class ApiResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data?: T;
  constructor(statusCode: number, message = "Success", data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = true;
    this.data = data;
  }
}

export { ApiResponse };
