const { NextResponse } = require("next/server") // This will fail if we don't mock it, but we are redefining it.

// Mock implementation
const MockNextResponse = {
  json: (data, init) => {
    return {
      ok: !init?.status || init.status < 400,
      status: init?.status || 200,
      json: async () => data,
      headers: new Headers(init && init.headers),
      text: async () => JSON.stringify(data),
    }
  },
  next: () => ({
    status: 200,
    headers: new Headers(),
    json: async () => ({}),
  }),
  redirect: (url) => ({
    status: 307,
    headers: new Headers({ Location: url }),
    json: async () => ({}),
  }),
}

module.exports = {
  NextResponse: MockNextResponse,
}
