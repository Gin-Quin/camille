import { Hono } from 'hono'
import api_profile from './apis/profile'
import { prettyJSON } from 'hono/pretty-json'
import api_analysis from './apis/analysis'
import api_conv from './apis/conversation'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.use(prettyJSON())
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))

app.route('/api-profile', api_profile)
app.route('/api-analysis', api_analysis)
app.route('/api-conversation', api_conv)

export default app
