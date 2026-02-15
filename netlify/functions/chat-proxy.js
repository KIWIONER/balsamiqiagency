// Netlify Serverless Function — Proxy para n8n
// Resuelve: Mixed Content (HTTPS→HTTP) + CORS (mismo dominio)
exports.handler = async function (event) {
    // Solo aceptar POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);

        // Llamada server-side a n8n (sin restricciones de navegador)
        const response = await fetch("https://bookmarks-lighter-barn-tower.trycloudflare.com/webhook/chat-agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: body.message })
        });

        const data = await response.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Proxy error:", error);
        return {
            statusCode: 502,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ output: "Error de conexión con el servidor IA. Inténtalo de nuevo." })
        };
    }
};
