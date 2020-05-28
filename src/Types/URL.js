const { types } = require("fieldify")

class signderivaMongooseTypeURL extends types.URL.class {

}

module.exports = {
  "code": types.URL.code,
  "description": types.URL.description,
  "class": signderivaMongooseTypeURL
}