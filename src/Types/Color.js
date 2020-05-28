const { types } = require("fieldify")


class signderivaMongooseTypeColor extends types.Color.class {

}

module.exports = {
  "code": types.Color.code,
  "description": types.Color.description,
  "class": signderivaMongooseTypeColor
}