// this is a hidden type
// to manage nested object
import { types,  fieldifyType } from 'fieldify'

class ArrayClass extends fieldifyType {
  configuration () {
    return ({
      min: {
        $doc: 'Minimum of items',
        $required: false,
        $type: 'Number'
      },
      max: {
        $doc: 'Maximun of items',
        $required: false,
        $type: 'Number'
      }
    })
  }
}

export default {
  code: "Array",
  description: "Array",
  class: ArrayClass
}
