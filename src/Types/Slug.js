const { types } = require("fieldify")

class signderivaMongooseTypeSlug extends types.Slug.class {


}

module.exports = {
  code: types.Slug.code,
  description: types.Slug.description,
  class: signderivaMongooseTypeSlug
}