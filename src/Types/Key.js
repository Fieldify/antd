const { types } = require("fieldify")

class signderivaMongooseTypeKey extends types.Key.class {

}

module.exports = {
  "code": types.Key.code,
  "description": types.Key.description,
  "class": signderivaMongooseTypeKey
}