export default defineEventHandler(async (event) => {
  const { openaiApiKey } = useRuntimeConfig(event)

  if (!openaiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key not configured'
    })
  }

  const sessionConfig = {
    session: {
      type: 'realtime',
      model: 'gpt-realtime',
      audio: {
        output: {
          voice: 'marin'
        }
      }
    }
  }

  try {
    const response = await fetch(
      'https://api.openai.com/v1/realtime/client_secrets',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionConfig)
      }
    )

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Token generation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate token'
    })
  }
})
