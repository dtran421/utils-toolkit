export class TestError extends Error {
  constructor(message?: string) {
    super(`Test: ${message}`);
    this.name = "TestError";
  }
}
