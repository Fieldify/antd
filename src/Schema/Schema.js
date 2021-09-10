import { schema } from "fieldify";
import Types from "../Types"

export class FieldifySchema extends schema {
  constructor(name, options) {
    super(name, options);
  }

  resolver(type) {
    return (Types[type])
  }

  // compile(schema) {
  //   // process normal compilation
  //   super.compile(schema);
  // }
}
