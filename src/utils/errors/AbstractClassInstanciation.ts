export class AbstractClassInstanciation extends TypeError {
  constructor(message?: string) {
    super();
    this.name = "AbstractClassInstanciationError";
    this.message = message ?? `Abstract class cannot be instanciated.`;
  }
}
