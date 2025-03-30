import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getLastProfile, postProfile } from '../models/profile-model'

type Bindings = {
  USERNAME: string
  PASSWORD: string
}

const api_profile = new Hono<{ Bindings: Bindings }>()
api_profile.use('/profiles/*', cors())

api_profile.get('/profile', async (c) => {
  const lastprofile = await getLastProfile()
  return c.json({ profile: lastprofile }, 200)
})

api_profile.post('/profile', async (c) => {
  try {
    const { name, lastname, birthdate, culture, follow, pathologies } = await c.req.json()

    const newProfile = await postProfile({
      name,
      lastname,
      birthdate: new Date(birthdate),
      culture,
      follow,
      pathologies,
    })

    return c.json({ profile: newProfile }, 201)
  } catch (error) {
    console.error('Error creating profile:', error)
    return c.json({ error: 'Failed to create profile' }, 500)
  }
})

export default api_profile