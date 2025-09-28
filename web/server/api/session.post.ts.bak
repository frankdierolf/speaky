export default defineEventHandler(async (event) => {
  const { openaiApiKey } = useRuntimeConfig(event)

  if (!openaiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key not configured'
    })
  }

  const body = await readBody(event)
  const sdp = body.sdp

  if (!sdp) {
    throw createError({
      statusCode: 400,
      statusMessage: 'SDP is required'
    })
  }

  const sessionConfig = JSON.stringify({
    session: {
      type: 'realtime',
      model: 'gpt-realtime',
      audio: {
        output: {
          voice: 'marin'
        }
      }
    }
  })

  try {
    const fd = new FormData()
    fd.set('sdp', sdp)
    fd.set('session', sessionConfig)

    const response = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        'OpenAI-Beta': 'realtime=v1',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: fd
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const responseSdp = await response.text()

    return {
      sdp: responseSdp
    }
  } catch (error) {
    console.error('Session creation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create session'
    })
  }
})
