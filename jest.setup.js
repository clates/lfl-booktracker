// Mock Supabase environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock.supabase.co"
process.env.SUPABASE_SERVICE_ROLE_KEY = "mock-key"
process.env.DB_KEY = "mock-key"

// Mock global Request if missing
if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor(input, init) {
      return { url: input, input, init, json: () => Promise.resolve({}) }
    }
    static json(data) {
      return { json: () => Promise.resolve(data) }
    }
  }
}

if (typeof global.Response === "undefined") {
  global.Response = class Response {
    constructor(body, init) {
      return {
        body,
        init,
        ok: true,
        status: init?.status || 200,
        headers: {
          get: (key) => init?.headers?.[key] || null,
        },
        json: () => Promise.resolve(body),
      }
    }
    static json(body, init) {
      return {
        body,
        init,
        ok: true,
        status: init?.status || 200,
        json: () => Promise.resolve(body),
      }
    }
  }
}
