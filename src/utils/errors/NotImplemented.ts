export class NotImplemented extends Error {
  constructor(message?: string) {
    super();
    this.name = "NotImplementedError";
    this.message = message ?? `Method must be implemented.`;
  }
}
