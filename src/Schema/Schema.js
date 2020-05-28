import { schema } from "fieldify";

export class FieldifySchema extends schema {
  constructor(name, options) {
    super(name, options);
  }

  compile(schema) {
    // process normal compilation
    super.compile(schema);
  }
}
