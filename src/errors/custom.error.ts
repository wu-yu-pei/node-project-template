class CustomError extends Error {
  public statusCode: number;

  constructor(message) {
    super(message);
  }
}

export default CustomError;
