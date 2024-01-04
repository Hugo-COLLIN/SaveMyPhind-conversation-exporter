export class AbstractClassInstanciation extends TypeError {
  constructor(message) {
    super();
    this.name = "InstanciateAbstractClassError";
    this.message = message ?? `Abstract class ${this.constructor.name} cannot be instanciated.`;
  }
}
