import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfill for Web APIs needed by Next.js in test environment
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init) {
      this._headers = new Map();
      if (init) {
        if (init instanceof Headers) {
          init.forEach((value, key) => this._headers.set(key, value));
        } else if (Array.isArray(init)) {
          init.forEach(([key, value]) => this._headers.set(key, value));
        } else if (typeof init === 'object') {
          Object.entries(init).forEach(([key, value]) => this._headers.set(key, value));
        }
      }
    }
    get(name) {
      return this._headers.get(name) || null;
    }
    set(name, value) {
      this._headers.set(name, value);
    }
    has(name) {
      return this._headers.has(name);
    }
    delete(name) {
      this._headers.delete(name);
    }
    append(name, value) {
      const existing = this._headers.get(name);
      // Set-Cookie headers should not be concatenated
      if (name.toLowerCase() === 'set-cookie') {
        // For set-cookie, store as array
        const cookies = existing ? (Array.isArray(existing) ? existing : [existing]) : [];
        cookies.push(value);
        this._headers.set(name, cookies);
      } else if (existing) {
        this._headers.set(name, `${existing}, ${value}`);
      } else {
        this._headers.set(name, value);
      }
    }
    forEach(callback, thisArg) {
      this._headers.forEach((value, key) => {
        callback.call(thisArg, value, key, this);
      });
    }
    keys() {
      return this._headers.keys();
    }
    values() {
      return this._headers.values();
    }
    entries() {
      return this._headers.entries();
    }
    getSetCookie() {
      // Return array of set-cookie values
      const setCookie = this._headers.get('set-cookie');
      if (!setCookie) return [];
      return Array.isArray(setCookie) ? setCookie : [setCookie];
    }
  };
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || '';
      this.headers = new global.Headers(init.headers);
      this.ok = this.status >= 200 && this.status < 300;
    }
    
    async json() {
      return JSON.parse(this.body);
    }
    
    async text() {
      return this.body;
    }
  };
}

if (!Response.json) {
    Response.json = function (data, init) {
        return new Response(JSON.stringify(data), {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...(init && init.headers)
            }
        });
    };
}

if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = input;
      this.method = init.method || 'GET';
      this.headers = new global.Headers(init.headers);
      this.body = init.body;
    }
    
    async json() {
      return JSON.parse(this.body);
    }
  };
}
