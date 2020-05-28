const { types } = require("fieldify")

class signderivaMongooseTypeDatePicker extends types.DatePicker.class {

}

module.exports = {
  "code": types.DatePicker.code,
  "description": types.DatePicker.description,
  "class": signderivaMongooseTypeDatePicker
}