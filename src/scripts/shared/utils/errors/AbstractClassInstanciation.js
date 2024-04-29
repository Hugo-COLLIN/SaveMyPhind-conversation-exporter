export class AbstractClassInstanciation extends TypeError {
  constructor(message) {
    super();
    this.name = "AbstractClassInstanciationError";
    this.message = message ?? `Abstract class cannot be instanciated.`;
  }
}
