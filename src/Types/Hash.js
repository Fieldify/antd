const { types } = require("fieldify")

class signderivaMongooseTypeHash extends types.Hash.class {

}

module.exports = {
  "code": types.Hash.code,
  "description": types.Hash.description,
  "class": signderivaMongooseTypeHash
}