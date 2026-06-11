import app from './app'

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
  console.log(`🌟 I've Seen This Before — BrasilIA Hackaton`)
  console.log(`📡 API disponível em http://localhost:${PORT}/api/health`)
})
