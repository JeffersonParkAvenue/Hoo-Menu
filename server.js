import { serve } from 'https://deno.land/std@0.91.0/http/server.ts'
import { parse } from 'https://deno.land/std@0.91.0/flags/mod.ts'

import get_on from './newcomb-ohill-test.js'
import get_runk from './runk.js'

const get_all = async () => ({
	  last_updated: Date.now()
	, data: [...await get_on(), await get_runk(new Date())]
})

console.log('getting initial data...')
let data = await get_all()
console.log('OK')
setInterval(async () => {
	console.log('fetching new data...')
	data = await get_all()
	console.log('done')
}, 1000 * 60 * 60 * 2) // 2 hours

const { port } = parse(Deno.args)
if (port == null) {
	console.error('need port')
	Deno.exit()
}

const server = serve({ port })

console.log(`now serving on port ${port}`)

// should specify but
const headers = new Headers({ 'Access-Control-Allow-Origin': '*' })

for await (const request of server)
	request.respond({ headers, body: JSON.stringify(data) })