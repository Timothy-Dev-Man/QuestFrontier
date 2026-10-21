const clients = new Set()

export function addSseClient(res) {
  clients.add(res)
  console.info("SSE client connected")

  res.on("close", () => {
    clients.delete(res)
    console.info("SSE client disconnected")
  })
}

export function sendSseEvent(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  for (const res of clients) {
    res.write(payload)
  }
  console.info("SSE event dispatched")
}
