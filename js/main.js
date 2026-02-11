document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    // --- LÓGICA DEL AGENTE IA (CHAT) ---
    const chatTrigger = document.getElementById('chat-trigger');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('user-input');
    const chatHistoryDiv = document.getElementById('chat-history');

    // Estado del chat (Memoria a corto plazo)
    let chatHistory = [];

    // Abrir/Cerrar
    if (chatTrigger) {
        chatTrigger.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) chatInput.focus();
        });
    }
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => chatWindow.classList.add('hidden'));
    }

    // Hero button opens chat
    const startAgentBtn = document.getElementById('start-agent-btn');
    if (startAgentBtn) {
        startAgentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (chatWindow && chatWindow.classList.contains('hidden')) {
                chatWindow.classList.remove('hidden');
                if (chatInput) chatInput.focus();
            }
        });
    }

    // Nav chat button opens chat
    const navChatBtn = document.getElementById('nav-chat-btn');
    if (navChatBtn) {
        navChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (chatWindow) {
                chatWindow.classList.toggle('hidden');
                if (!chatWindow.classList.contains('hidden') && chatInput) chatInput.focus();
            }
        });
    }

    // Enviar Mensaje
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Mostrar mensaje usuario
        addMessageToUI(text, 'user');
        chatInput.value = '';
        chatHistory.push({ role: 'user', content: text });

        // 2. Indicador de "Escribiendo..."
        const loadingId = addMessageToUI('Analizando...', 'bot', true);

        // URL de producción de tu n8n (sin el -test si ya lo has activado)
        // USO DE PROXY HTTPS: Necesario porque tu web es HTTPS y n8n es HTTP (Mixed Content)
        const targetUrl = "http://195.201.118.14:5678/webhook/chat-agent";
        const webhookUrl = "https://corsproxy.io/?" + encodeURIComponent(targetUrl);

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // IMPORTANTE: Esto evita que el navegador bloquee la petición desde Netlify
                mode: "cors",
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            // Buscamos 'output' que es el nombre que configuramos en el nodo 'Edit Fields'
            const botReply = data.output || data.text || "Conexión establecida, pero sin respuesta.";

            removeMessage(loadingId);
            addMessageToUI(botReply, 'bot');
            chatHistory.push({ role: 'assistant', content: botReply });

        } catch (error) {
            console.error("Error en el Agente:", error);
            removeMessage(loadingId);
            addMessageToUI("Lo siento, mi conexión neuronal está saturada. Prueba de nuevo en unos segundos.", 'bot');
        }
    }

    // Helpers UI
    function addMessageToUI(text, sender, isLoading = false) {
        const div = document.createElement('div');
        div.classList.add('message', sender === 'bot' ? 'bot-message' : 'user-message');
        div.innerText = text;
        if (isLoading) {
            div.id = 'loading-msg';
            div.style.opacity = '0.7';
            div.style.fontStyle = 'italic';
        }
        chatHistoryDiv.appendChild(div);
        chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
        return div.id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // Chat Listeners
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            // Close mobile menu after clicking a link
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- Hamburger Menu ---
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !hamburgerBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Form Submission (with popup integration) ---
    const contactForm = document.getElementById('audit-form');
    const popup = document.getElementById('custom-popup');
    const closePopupBtn = document.getElementById('close-popup');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "CONECTANDO CON SERVIDOR...";
            btn.style.opacity = "0.7";
            btn.disabled = true;
            btn.style.cursor = "wait";

            const formData = {
                source: 'Web Principal',
                name: document.getElementById('name').value,
                sector: document.getElementById('sector').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('process').value,
                timestamp: new Date().toISOString()
            };

            try {
                // 1. Efecto visual inmediato (UX)
                btn.innerText = "CONECTANDO CEREBRO...";

                // 2. Definimos el destino (VPS)
                const webhookURL = "http://195.201.118.14:5678/webhook-test/audit";

                // 3. Enviamos los datos (Fetch)
                const response = await fetch(webhookURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                // 4. Verificamos si n8n nos ha escuchado
                if (response.ok) {
                    btn.innerText = "¡RECIBIDO EN CENTRAL!";
                    btn.style.background = "#22c55e";
                    btn.style.color = "#000";

                    // Lanzar Popup
                    if (popup) {
                        popup.style.display = 'flex';
                        const msg = document.querySelector('.popup-message');
                        if (msg) msg.innerText = `Hola ${formData.name}, el sistema ha procesado tu solicitud. Iniciando protocolo de análisis.`;
                    }
                    contactForm.reset();
                } else {
                    throw new Error("Error en servidor");
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                btn.innerText = "ERROR DE CONEXIÓN";
                btn.style.background = "#ef4444";

                // FALLBACK: Aviso técnico
                alert("Nota: Si no funciona, asegúrate de que n8n dice 'Waiting for data' en el botón rojo.");
            } finally {
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.opacity = "1";
                    btn.style.cursor = "pointer";
                    btn.style.background = "";
                    btn.style.color = "";
                }, 4000);
            }
        });
    }

    // --- Popup Close Logic ---
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            if (popup) popup.style.display = 'none';
        });
    }

    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.style.display = 'none';
        });
    }

    // --- Partners Button ---
    const partnerBtn = document.querySelector('.partners-btn');
    if (partnerBtn) {
        partnerBtn.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                const msgArea = document.getElementById('process');
                if (msgArea) msgArea.value = "Hola, me interesa solicitar una de las 3 plazas de Socio Estratégico.";
            }
        });
    }
});
