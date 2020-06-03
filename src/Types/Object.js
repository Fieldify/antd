// this is a hidden type
// to manage nested object
import { types,  fieldifyType } from 'fieldify'


class ObjectClass extends fieldifyType {
}


export default {
  code: "Object",
  description: "Nested Sub Object",
  class: ObjectClass
}
