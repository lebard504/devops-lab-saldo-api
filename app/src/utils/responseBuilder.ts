import { ApiResponse } from "../types/api-response.types";

export class ResponseBuilder {
  static success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data
    };
  }

  static error(message: string): ApiResponse<null> {
    return {
      success: false,
      error: message
    };
  }
}