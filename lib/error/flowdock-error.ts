export abstract class FlowdockApiError extends Error {
  public readonly statusCode: number;
  public readonly success = false;
  public readonly code?: string;

  protected constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export function isFlowdockApiError(error: unknown): error is FlowdockApiError {
  return error instanceof FlowdockApiError;
}
