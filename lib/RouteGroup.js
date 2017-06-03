const Routable = require('./Routable')

module.exports = class RouteGroup extends Routable {
  constructor (pattern, callable, group) {
    super(pattern, group)
    this.callable = callable
  }
}
