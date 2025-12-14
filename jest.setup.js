import '@testing-library/jest-dom';
import 'whatwg-fetch';

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
