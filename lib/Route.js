const compose = require('koa-compose')
const Routable = require('./Routable')

module.exports = class Route extends Routable {
  constructor (method, pattern, handler, group) {
    super(pattern, group)
    this.method = method
    this.handler = handler
  }

  compose () {
    return compose([this.middlewareCompose(), this.handler])
  }
}
