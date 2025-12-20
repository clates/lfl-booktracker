// Mock Supabase environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock.supabase.co"
process.env.SUPABASE_SERVICE_ROLE_KEY = "mock-key"
process.env.DB_KEY = "mock-key"

// Mock global Request if missing
if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor(input, init) {
      return { input, init, json: () => Promise.resolve({}) }
    }
  }
}

if (typeof global.Response === "undefined") {
  global.Response = class Response {
    constructor(body, init) {
      return { body, init, ok: true, json: () => Promise.resolve(body) }
    }
  }
}
