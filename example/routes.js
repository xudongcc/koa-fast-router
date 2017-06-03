const KoaRouter = require('../lib/Router')

const router = new KoaRouter()

router.group('/api', () => {
  router.group('/user', () => {
    router.get('', async (ctx) => {
      ctx.body = 'user index'
      console.log('user index controller')
    }).add(async (ctx, next) => {
      console.log('user index middleware')
      await next()
    })
  }).add(async (ctx, next) => {
    console.log('user group middleware')
    await next()
  })

  router.group('/post', () => {
    router.get('', async (ctx) => {
      ctx.body = 'post index'
      console.log('post index controller')
    }).add(async (ctx, next) => {
      console.log('post index middleware')
      await next()
    })
  }).add(async (ctx, next) => {
    console.log('post group middleware')
    await next()
  })
}).add(async (ctx, next) => {
  console.log('api group middleware')
  await next()
})

module.exports = router
