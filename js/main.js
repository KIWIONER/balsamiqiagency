document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startAgentBtn = document.getElementById('start-agent-btn');
    const navChatBtn = document.getElementById('nav-chat-btn');
    const aiInterface = document.getElementById('ai-agent-interface');
    const closeAgentBtn = document.getElementById('close-agent');
    const chatHistory = document.getElementById('chat-history');
    const optionBtns = document.querySelectorAll('.option-btn');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Auto-Open Agent Removed per user request
    // The chat is now strictly opt-in via the nav button.

    // Initial Greeting

    // State
    let isAgentOpen = false;

    // --- Core Functions ---

    function toggleAgent() {
        isAgentOpen = !isAgentOpen;
        if (isAgentOpen) {
            aiInterface.classList.remove('hidden');
            setTimeout(() => userInput && userInput.focus(), 500);
        } else {
            aiInterface.classList.add('hidden');
        }
    }

    function addMessage(text, sender = 'bot') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');

        const p = document.createElement('p');
        p.innerText = text;
        messageDiv.appendChild(p);

        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        return messageDiv;
    }

    // Agent Logic: Decisions & Replies
    function handleOptionClick(action) {
        // 1. User "says" the option
        let userText = "";
        switch (action) {
            case 'explain': userText = "¿Qué haces exactamente?"; break;
            case 'demo': userText = "Quiero ver las demos."; break;
            case 'book': userText = "Me interesa, quiero agendar."; break;
        }
        addMessage(userText, 'user');

        // 2. Simulate AI thinking
        simulateResponse(action);
    }

    function handleInput() {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        userInput.value = '';

        // Determine intent based on keywords
        const lowerText = text.toLowerCase();
        let intent = 'generic';

        if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('vale')) intent = 'pricing';
        else if (lowerText.includes('hola') || lowerText.includes('buenas')) intent = 'greeting';
        else if (lowerText.includes('demo') || lowerText.includes('ejemplo')) intent = 'demo';
        else if (lowerText.includes('contacto') || lowerText.includes('correo')) intent = 'contact';
        else if (lowerText.includes('porque') || lowerText.includes('por qué') || lowerText.includes('vosotros')) intent = 'why_us';
        else if (lowerText.includes('beneficio') || lowerText.includes('ventaja')) intent = 'benefits';
        else if (lowerText.includes('tecnología') || lowerText.includes('tecnologia') || lowerText.includes('stack')) intent = 'technology';
        else if (lowerText.includes('capacidad') || lowerText.includes('qué haces')) intent = 'capabilities';

        // 3. Simulate AI thinking
        simulateResponse(intent);
    }

    function simulateResponse(intentOrAction) {
        const thinkingDelay = Math.random() * 800 + 600; // 600-1400ms

        setTimeout(() => {
            let botResponse = "";
            let followupAction = null;

            switch (intentOrAction) {
                case 'explain':
                    botResponse = "Soy un Motor de Lógica Adaptativa. Me integro en tu arquitectura para procesar clientes y agendar procesos críticos sin pausa.";
                    followupAction = 'capabilities';
                    break;
                case 'demo':
                    botResponse = "Perfecto. Observa cómo operan nuestras unidades en entornos reales: Nexus (Comercio) y Melros (Salud).";
                    followupAction = 'demo';
                    break;
                case 'book':
                    botResponse = "Iniciando secuencia de diagnóstico... Desplazando a interfaz de toma de requisitos.";
                    setTimeout(() => {
                        const contactSection = document.getElementById('contact');
                        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                    }, 1000);
                    break;
                case 'pricing':
                    botResponse = "Implementamos Arquitectura Propietaria desde 1.500€. ¿Deseas solicitar una evaluación técnica gratuita?";
                    followupAction = 'book';
                    break;
                case 'greeting':
                    botResponse = "Sistema BalsamiqIA activo. ¿En qué puedo optimizar tu negocio hoy?";
                    break;
                case 'contact':
                    botResponse = "Canal directo: hola@balsamiqiagency.com";
                    break;
                case 'benefits':
                    botResponse = "Ventajas Competitivas: ♾️ Autonomía 24/7, ⚡ Respuesta en Milisegundos y 🛡️ Datos Blindados. ¿Te interesa el rendimiento?";
                    followupAction = 'pricing';
                    break;
                case 'why_us':
                    botResponse = "No vendemos software de terceros; construimos tu propia propiedad intelectual tecnológica. Tu negocio merece una ventaja injusta. 🧠";
                    followupAction = 'book';
                    break;
                case 'technology':
                case 'tech_stack':
                    botResponse = "Utilizamos nuestra propia Arquitectura de Grandes Ligas: una combinación de Motores de Lógica Adaptativa y Bóvedas de Datos Encriptadas. No usamos soluciones estándar; construimos sistemas propietarios.";
                    followupAction = 'capabilities';
                    break;
                case 'capabilities':
                    botResponse = "Mis módulos principales incluyen: 1. Triaje Inteligente de Clientes, 2. Gestión Autónoma de Agendas, 3. Automatización de Procesos Críticos.";
                    followupAction = 'demo';
                    break;
                default: // generic
                    botResponse = "Interesante input. Mi lógica adaptativa sugiere que podrías estar buscando potenciar tu infraestructura actual. ¿Exploramos nuestras capacidades?";
                    followupAction = 'capabilities';
                    break;
            }

            const msgNode = addMessage(botResponse, 'bot');

            // Append Follow-up buttons if needed
            if (followupAction) {
                const optionsDiv = document.createElement('div');
                optionsDiv.classList.add('options');

                if (followupAction === 'demo') {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.innerText = "Ver Arquitectura Real (Demos)";
                    btn.onclick = () => window.location.href = "#showcase";
                    optionsDiv.appendChild(btn);
                } else if (followupAction === 'book') {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.innerText = "Solicitar Auditoría";
                    btn.onclick = () => handleOptionClick('book');
                    optionsDiv.appendChild(btn);
                } else if (followupAction === 'pricing') {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.innerText = "Consultar Inversión";
                    btn.onclick = () => handleInputForce('precio');
                    optionsDiv.appendChild(btn);
                } else if (followupAction === 'benefits') {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.innerText = "Ver Ventajas";
                    btn.onclick = () => handleOptionClick('benefits');
                    optionsDiv.appendChild(btn);
                } else if (followupAction === 'capabilities') {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.innerText = "Explorar Capacidades";
                    btn.onclick = () => handleOptionClick('capabilities');
                    optionsDiv.appendChild(btn);
                }
                msgNode.appendChild(optionsDiv);
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }
        }, thinkingDelay);
    }

    // Helper to force input simulation from button
    function handleInputForce(text) {
        if (userInput) userInput.value = text;
        handleInput();
    }

    // --- Neural Network Particle Animation ---
    // --- Neural Network Particle Animation ---
    const initParticles = () => {
        const containers = document.querySelectorAll('.neural-network-bg');
        if (containers.length === 0) return;

        containers.forEach(container => {
            const canvas = document.createElement('canvas');
            container.appendChild(canvas);
            const ctx = canvas.getContext('2d');

            // Config based on data attribute
            const configType = container.getAttribute('data-config') || 'subtle';

            const config = {
                particleCount: configType === 'intense' ? 80 : 50,
                particleSizeBase: configType === 'intense' ? 1 : 0, // + random * 3 or 2
                particleSizeRandom: configType === 'intense' ? 3 : 2,
                opacity: configType === 'intense' ? 0.8 : 0.5,
                connectionOpacityBase: configType === 'intense' ? 0.25 : 0.1,
                connectionDistanceDivisor: configType === 'intense' ? 1000 : 1500,
                glow: configType === 'intense'
            };

            let width, height;
            let particles = [];

            const resize = () => {
                width = canvas.width = container.offsetWidth;
                height = canvas.height = container.offsetHeight;
            };

            class Particle {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.vx = (Math.random() - 0.5) * 0.5;
                    this.vy = (Math.random() - 0.5) * 0.5;
                    this.size = Math.random() * config.particleSizeRandom + config.particleSizeBase;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 240, 255, ${config.opacity})`;
                    if (config.glow) {
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = `rgba(0, 240, 255, ${config.opacity})`;
                    }
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            const init = () => {
                resize();
                particles = [];
                for (let i = 0; i < config.particleCount; i++) {
                    particles.push(new Particle());
                }
            };

            const animate = () => {
                ctx.clearRect(0, 0, width, height);
                particles.forEach((p, index) => {
                    p.update();
                    p.draw();
                    for (let j = index + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 150) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(0, 240, 255, ${config.connectionOpacityBase - distance / config.connectionDistanceDivisor})`;
                            ctx.lineWidth = 1;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                });
                requestAnimationFrame(animate);
            };

            window.addEventListener('resize', resize);
            init();
            animate();
        });
    };


    // --- Event Listeners ---

    // Chat Toggles
    if (startAgentBtn) startAgentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isAgentOpen) toggleAgent();
    });
    if (navChatBtn) navChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAgent();
    });
    if (closeAgentBtn) closeAgentBtn.addEventListener('click', toggleAgent);

    // Chat Input
    if (sendBtn) sendBtn.addEventListener('click', handleInput);
    if (userInput) userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInput();
    });

    // Chat Initial Options
    optionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            e.target.parentElement.style.display = 'none';
            handleOptionClick(action);
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Init Logic
    initParticles();

    // Animación de fases de metodología (v.10.8)
    const methodCards = document.querySelectorAll('.method-card');
    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.borderColor = 'var(--accent-color)';
                    entry.target.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.1)';
                }, index * 200); // Delay secuencial
            }
        });
    }, observerOptions);

    methodCards.forEach(card => observer.observe(card));
    // --- Architecture Diagram Interaction (v.11.0 & Mobile Overlay v.1.0) ---
    const diagramNodes = document.querySelectorAll('.diagram-node');
    const techSpecs = document.querySelectorAll('.tech-spec-card');
    const detailPanel = document.getElementById('tech-detail-panel');

    if (diagramNodes.length > 0) {
        // Initialize Mobile Overlay Inteface
        diagramNodes.forEach(node => {
            // 1. Wrap existing content (icon, h5, span, p) in .node-content div
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'node-content';
            while (node.firstChild) {
                contentWrapper.appendChild(node.firstChild);
            }
            node.appendChild(contentWrapper);

            // 2. Create hidden overlay with spec content
            const nodeType = node.getAttribute('data-node');
            const matchingSpec = document.querySelector(`.tech-spec-card[data-for="${nodeType}"]`);

            if (matchingSpec) {
                const overlay = document.createElement('div');
                overlay.className = 'mobile-detail-overlay';
                overlay.innerHTML = matchingSpec.innerHTML;
                node.appendChild(overlay);
            }
        });

        diagramNodes.forEach(node => {
            node.addEventListener('click', (e) => {
                const isMobile = window.innerWidth <= 768;

                if (isMobile) {
                    // Mobile Behavior: Toggle Overlay
                    e.stopPropagation(); // Prevent bubbling issues

                    // If already active, deactivate it (toggle off)
                    if (node.classList.contains('mobile-active')) {
                        node.classList.remove('mobile-active');
                        return;
                    }

                    // Otherwise, deactivate others and activate this one
                    diagramNodes.forEach(n => n.classList.remove('mobile-active'));
                    node.classList.add('mobile-active');

                } else {
                    // Desktop Behavior: Side-by-Side Expansion (v.12.0)
                    const architectureDiagram = document.querySelector('.architecture-diagram');

                    // Toggle Logic
                    // If clicking the already active node, close everything
                    if (node.classList.contains('active')) {
                        node.classList.remove('active');
                        architectureDiagram.classList.remove('expanded');
                        detailPanel.classList.add('hidden'); // Ensure panel hides
                        techSpecs.forEach(spec => spec.classList.remove('active'));
                        return;
                    }

                    // Otherwise, activate this node
                    // 1. Remove active class from all nodes
                    diagramNodes.forEach(n => n.classList.remove('active'));

                    // 2. Add active class to clicked node
                    node.classList.add('active');

                    // 3. Expand the diagram container
                    architectureDiagram.classList.add('expanded');

                    // 4. Get node type
                    const nodeType = node.getAttribute('data-node');

                    // 5. Show panel
                    detailPanel.classList.remove('hidden');

                    // 6. Hide all specs, show matching one
                    techSpecs.forEach(spec => {
                        spec.classList.remove('active');
                        if (spec.getAttribute('data-for') === nodeType) {
                            // Instant show for side-by-side, or slight delay
                            setTimeout(() => spec.classList.add('active'), 100);
                        }
                    });
                }
            });
        });

        // Close mobile overlay when clicking outside (Optional polish)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !e.target.closest('.diagram-node')) {
                diagramNodes.forEach(n => n.classList.remove('mobile-active'));
            }
        });
    }
});

// --- LÓGICA DE CONEXIÓN CON EL CEREBRO (BALSAMIQ ENGINE) ---
const contactForm = document.getElementById('audit-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Detiene la recarga de la página

        // 1. Feedback Visual (UX)
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "CONECTANDO CON SERVIDOR...";
        btn.style.opacity = "0.7";
        btn.disabled = true;
        btn.style.cursor = "wait";

        // 2. Captura de Datos Limpios
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
            console.log("📦 Empaquetando datos para n8n:", formData);

            // AQUI IRÁ TU URL DE N8N EN EL SIGUIENTE PASO
            // Por ahora simulamos una conexión de 1.5 segundos
            await new Promise(r => setTimeout(r, 1500));

            // 3. Éxito Visual
            btn.innerText = "¡DATOS RECIBIDOS!";
            btn.style.background = "#22c55e"; // Verde éxito
            btn.style.color = "#000";

            // Mostrar Popup si existe
            const popup = document.getElementById('custom-popup');
            if (popup) {
                popup.style.display = 'flex'; // Forzar visualización
                setTimeout(() => popup.classList.add('active'), 10);

                const msg = document.querySelector('.popup-message');
                if (msg) msg.innerText = `Hola ${formData.name}, hemos recibido tu solicitud. El Agente IA está analizando tu caso.`;
            }

            contactForm.reset(); // Limpiar formulario

        } catch (error) {
            console.error("Error de conexión:", error);
            btn.innerText = "ERROR DE RED";
            btn.style.background = "#ef4444";
        } finally {
            // Restaurar botón a los 4 segundos
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

// Lógica de Cierre del Popup
const closePopupBtn = document.getElementById('close-popup');
if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
        const popup = document.getElementById('custom-popup');
        if (popup) {
            popup.classList.remove('active');
            setTimeout(() => popup.style.display = 'none', 300);
        }
    });
}


