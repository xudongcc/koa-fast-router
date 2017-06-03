const path = require('path')
const compose = require('koa-compose')

const MIDDLEWARE_COMPOSE = Symbol('Routable#MiddlewareCompose')
const MIDDLEWARE_COMPOSE_LOCK = Symbol('Routable#MiddlewareComposeLock')

module.exports = class Routable {
  constructor (pattern, group) {
    this.group = group
    this.pattern = this.group ? path.join(this.group.pattern, pattern) : pattern
    this.middleware = []

    this[MIDDLEWARE_COMPOSE] = null
    this[MIDDLEWARE_COMPOSE_LOCK] = false
  }

  add (...middleware) {
    this.middleware = this.middleware.concat(...middleware)
    this[MIDDLEWARE_COMPOSE_LOCK] = false
    return this
  }

  middlewareCompose () {
    if (!this[MIDDLEWARE_COMPOSE_LOCK]) {
      if (this.group) {
        this[MIDDLEWARE_COMPOSE] = compose(
          [this.group.middlewareCompose()].concat(this.middleware)
        )
      } else {
        this[MIDDLEWARE_COMPOSE] = compose(this.middleware)
      }

      this[MIDDLEWARE_COMPOSE_LOCK] = true
    }

    return this[MIDDLEWARE_COMPOSE]
  }
}
