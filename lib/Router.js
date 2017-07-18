const FastRoute = require('fast-route')
const Route = require('./Route')
const RouteGroup = require('./RouteGroup')

const CURRENT_GROUP = Symbol('Router#CurrentGroup')

const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head']

module.exports = class Router {
  constructor () {
    this.routesMap = []
    this[CURRENT_GROUP] = null

    httpMethods.forEach((httpMethod) => {
      const httpMethodUpperCase = httpMethod.toUpperCase()
      this[httpMethod] = (...args) => this.addRoute(httpMethodUpperCase, ...args)
    })
  }

  group (pattern, callable) {
    // 记录父级路由组
    const parentGroup = this[CURRENT_GROUP]

    // 创建路由组
    const group = new RouteGroup(pattern, callable, parentGroup)
    this[CURRENT_GROUP] = group

    // 执行回调函数
    group.callable()

    // 还原当前路由组为父路由组
    this[CURRENT_GROUP] = parentGroup

    return group
  }

  addRoute (method, pattern, handler) {
    const route = new Route(method, pattern, handler, this[CURRENT_GROUP])
    this.routesMap.push(route)
    return route
  }

  middleware () {
    const router = new FastRoute()
    this.routesMap.forEach((route) => {
      router.addRoute(route.method, route.pattern, route.compose())
    })

    return async (ctx, next) => {
      const { status, handler, params } = router.dispatch(ctx.method, ctx.path)

      if (status === 200) {
        ctx.params = params
        await handler(ctx)
      } else {
        await next()
      }
    }
  }
}

