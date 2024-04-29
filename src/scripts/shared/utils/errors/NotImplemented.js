export class NotImplemented extends Error {
  constructor(message) {
    super();
    this.name = "NotImplementedError";
    this.message = message ?? `Method must be implemented.`;
  }
}
