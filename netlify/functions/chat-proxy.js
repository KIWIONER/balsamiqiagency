// Netlify Serverless Function — Proxy para n8n
// Resuelve: Mixed Content (HTTPS→HTTP) + CORS (mismo dominio)

// Compatible con Node 16 (usa https nativo) y Node 18+ (fetch nativo)
const https = require('https');

function postJSON(url, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const urlObj = new URL(url);

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    resolve({ output: responseData });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.setTimeout(25000, () => { req.destroy(); reject(new Error('Timeout')); });
        req.write(body);
        req.end();
    });
}

exports.handler = async function (event) {
    // Solo aceptar POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const webhookUrl = "https://barcelona-discount-lil-retention.trycloudflare.com/webhook/chat-agent";

        const data = await postJSON(webhookUrl, { message: body.message });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Proxy error:", error.message);
        return {
            statusCode: 502,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ output: "Error de conexión con el servidor IA. Inténtalo de nuevo." })
        };
    }
};
