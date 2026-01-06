/**
 * ============================================
 * Script Principal - Página de Donaciones
 * ============================================
 * 
 * Funcionalidades:
 * - Gestión de modo oscuro/claro
 * - Selección de montos de donación
 * - Validación de monto personalizado
 * - Animaciones y transiciones
 * - FAQ interactivo
 */

// ============================================
// Inicialización
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeDonationButtons();
    initializeCustomAmount();
    initializeFAQ();
    initializeSmoothScroll();
    initializeHanukkahModal();
});

// ============================================
// Gestión de Tema (Modo Oscuro/Claro)
// ============================================
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar tema guardado
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    // Listener para cambio de tema
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}

// ============================================
// Botones de Monto de Donación
// ============================================
let selectedAmount = 0;

function initializeDonationButtons() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    const customAmountSection = document.querySelector('.custom-amount-section');
    const otherAmountBtn = document.getElementById('other-amount-btn');
    const donationSummary = document.getElementById('donation-summary');
    const summaryAmount = document.getElementById('selected-amount');
    const continueBtn = document.getElementById('continue-btn');
    
    // Agregar listeners a cada botón de monto
    amountButtons.forEach(button => {
        // Si es el botón "Otro", manejar de forma especial
        if (button.id === 'other-amount-btn') {
            button.addEventListener('click', function() {
                // Remover clase active de todos los botones
                amountButtons.forEach(btn => btn.classList.remove('active'));
                
                // Agregar clase active al botón "Otro"
                this.classList.add('active');
                
                // Enfocar el campo de monto personalizado
                customAmountInput.focus();
                
                // Limpiar el monto seleccionado hasta que se ingrese un valor
                selectedAmount = 0;
                hideDonationSummary();
            });
            return;
        }
        
        // Para los botones de monto fijo
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener el monto del atributo data-amount
            selectedAmount = parseFloat(this.getAttribute('data-amount'));
            
            // Limpiar el campo de monto personalizado
            customAmountInput.value = '';
            customAmountInput.classList.remove('error');
            clearErrorMessage();
            
            // Actualizar y mostrar el resumen
            updateDonationSummary(selectedAmount);
        });
    });
    
    // Listener para el botón de continuar
    continueBtn.addEventListener('click', function() {
        if (selectedAmount > 0) {
            // Aquí iría la lógica para procesar el pago
            // Por ahora, mostramos un mensaje
            alert(`Redirigiendo al proceso de pago por $${selectedAmount.toFixed(2)}...\n\nEn una implementación real, aquí se conectaría con la pasarela de pago.`);
        }
    });
}

// ============================================
// Campo de Monto Personalizado
// ============================================
function initializeCustomAmount() {
    const customAmountInput = document.getElementById('custom-amount');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const donationSummary = document.getElementById('donation-summary');
    
    // Limpiar selección de botones cuando se escribe en el campo personalizado
    customAmountInput.addEventListener('input', function() {
        // Remover clase active de todos los botones excepto "Otro"
        amountButtons.forEach(btn => {
            if (btn.id !== 'other-amount-btn') {
                btn.classList.remove('active');
            }
        });
        
        // Asegurar que el botón "Otro" esté activo
        const otherBtn = document.getElementById('other-amount-btn');
        if (otherBtn && this.value.trim() !== '') {
            otherBtn.classList.add('active');
        }
        
        // Validar y procesar el valor
        const value = this.value.trim();
        
        if (value === '') {
            clearErrorMessage();
            hideDonationSummary();
            selectedAmount = 0;
            return;
        }
        
        // Validar que sea un número válido
        const numericValue = parseFloat(value);
        
        if (isNaN(numericValue)) {
            showErrorMessage('Por favor, ingresa un número válido');
            this.classList.add('error');
            hideDonationSummary();
            selectedAmount = 0;
            return;
        }
        
        if (numericValue <= 0) {
            showErrorMessage('El monto debe ser mayor a $0');
            this.classList.add('error');
            hideDonationSummary();
            selectedAmount = 0;
            return;
        }
        
        if (numericValue < 1) {
            showErrorMessage('El monto mínimo es $1');
            this.classList.add('error');
            hideDonationSummary();
            selectedAmount = 0;
            return;
        }
        
        // Si pasa todas las validaciones
        this.classList.remove('error');
        clearErrorMessage();
        selectedAmount = numericValue;
        updateDonationSummary(selectedAmount);
    });
    
    // Validar al perder el foco
    customAmountInput.addEventListener('blur', function() {
        const value = this.value.trim();
        
        if (value === '') {
            return;
        }
        
        const numericValue = parseFloat(value);
        
        if (!isNaN(numericValue) && numericValue > 0) {
            // Formatear el valor con 2 decimales si es necesario
            if (numericValue % 1 !== 0) {
                this.value = numericValue.toFixed(2);
            } else {
                this.value = numericValue.toString();
            }
        }
    });
    
    // Prevenir caracteres no numéricos (excepto punto decimal)
    customAmountInput.addEventListener('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        const currentValue = this.value;
        
        // Permitir números, punto decimal y teclas de control
        if (!/[0-9.]/.test(char) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            return false;
        }
        
        // Permitir solo un punto decimal
        if (char === '.' && currentValue.includes('.')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Permitir pegar y validar
    customAmountInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            const value = this.value.trim();
            const numericValue = parseFloat(value);
            
            if (isNaN(numericValue) || numericValue <= 0) {
                this.value = '';
                showErrorMessage('Por favor, ingresa un monto válido mayor a $0');
                this.classList.add('error');
            }
        }, 10);
    });
}

// ============================================
// Funciones de Validación y Mensajes
// ============================================
function showErrorMessage(message) {
    const errorElement = document.getElementById('amount-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearErrorMessage() {
    const errorElement = document.getElementById('amount-error');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

// ============================================
// Actualización del Resumen de Donación
// ============================================
function updateDonationSummary(amount) {
    const donationSummary = document.getElementById('donation-summary');
    const summaryAmount = document.getElementById('selected-amount');
    
    if (amount > 0) {
        summaryAmount.textContent = amount.toFixed(2);
        
        // Forzar reflow para asegurar que la animación funcione
        donationSummary.style.display = 'block';
        donationSummary.offsetHeight; // Trigger reflow
        
        // Animación suave
        donationSummary.style.animation = 'none';
        setTimeout(() => {
            donationSummary.style.animation = 'fadeIn 0.3s ease-in-out';
            donationSummary.style.opacity = '1';
        }, 10);
    } else {
        hideDonationSummary();
    }
}

function hideDonationSummary() {
    const donationSummary = document.getElementById('donation-summary');
    donationSummary.style.display = 'none';
}

// ============================================
// FAQ Interactivo
// ============================================
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Cerrar todas las otras preguntas (opcional - comentar si quieres que varias estén abiertas)
            // faqQuestions.forEach(q => {
            //     if (q !== this) {
            //         q.setAttribute('aria-expanded', 'false');
            //         q.nextElementSibling.style.maxHeight = '0';
            //     }
            // });
            
            // Toggle de la pregunta actual
            const icon = this.querySelector('.faq-icon-svg');
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
                if (icon) icon.setAttribute('icon', 'mdi:plus');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                if (icon) icon.setAttribute('icon', 'mdi:minus');
            }
        });
        
        // Animación táctil para móviles
        question.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        question.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.opacity = '1';
            }, 150);
        });
    });
}

// ============================================
// Scroll Suave
// ============================================
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#donacion') {
                return; // Permitir comportamiento por defecto
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// Modal de Feliz Hanukkah
// ============================================
function initializeHanukkahModal() {
    const modal = document.getElementById('hanukkah-modal');
    const closeBtn = document.getElementById('hanukkah-close');
    
    if (!modal || !closeBtn) {
        console.warn("Modal de Hanukkah no encontrado");
        return;
    }
    
    // Verificar si el modal ya fue cerrado en esta sesión
    // Para forzar que se muestre, comenta la siguiente línea o elimina el sessionStorage
    const modalClosed = sessionStorage.getItem('hanukkah-modal-closed');
    
    // Para pruebas: descomenta la siguiente línea para forzar que se muestre siempre
    // const modalClosed = null;
    
    if (!modalClosed) {
        // Mostrar el modal después de un pequeño delay para mejor efecto
        setTimeout(() => {
            modal.style.display = 'flex';
            // Forzar reflow para que la animación funcione
            modal.offsetHeight;
            modal.classList.remove('hidden');
            
            // Inicializar animación de lucesitas DESPUÉS de mostrar el modal
            setTimeout(() => {
                initHanukkahLights();
            }, 100);
        }, 300);
    } else {
        // Si el modal ya fue cerrado, ocultarlo
        modal.style.display = 'none';
        modal.classList.add('hidden');
    }
    
    // Cerrar modal al hacer clic en el botón
    closeBtn.addEventListener('click', function() {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        sessionStorage.setItem('hanukkah-modal-closed', 'true');
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            sessionStorage.setItem('hanukkah-modal-closed', 'true');
        }
    });
    
    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            sessionStorage.setItem('hanukkah-modal-closed', 'true');
        }
    });
}

// ============================================
// Animación de Lucesitas Cayendo (Canvas)
// ============================================
function initHanukkahLights() {
    const canvas = document.getElementById("hanukkah-lights");
    if (!canvas) {
        console.warn("Canvas de lucesitas no encontrado");
        return;
    }
    
    const ctx = canvas.getContext("2d", { alpha: true });
    let W = 0, H = 0, DPR = 1;
    
    function resize() {
        DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * DPR;
        canvas.height = H * DPR;
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    
    window.addEventListener("resize", resize);
    resize();
    
    const colors = [
        "rgba(255, 226, 140, 0.95)", // dorado suave
        "rgba(255, 255, 255, 0.90)", // blanco
        "rgba(170, 220, 255, 0.85)"  // azul claro
    ];
    
    const lights = [];
    const LIGHT_COUNT = Math.min(160, Math.floor((W * H) / 12000) + 60);
    
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function spawnLight(initial = false) {
        const r = rand(1.2, 3.4);
        lights.push({
            x: rand(0, W),
            y: initial ? rand(0, H) : -10,
            r,
            vy: rand(0.7, 2.2),
            vx: rand(-0.25, 0.25),
            a: rand(0.55, 1.0),
            tw: rand(0.006, 0.02),
            c: colors[(Math.random() * colors.length) | 0]
        });
    }
    
    // Inicializar luces
    for (let i = 0; i < LIGHT_COUNT; i++) {
        spawnLight(true);
    }
    
    function tick() {
        ctx.clearRect(0, 0, W, H);
        
        for (let i = lights.length - 1; i >= 0; i--) {
            const p = lights[i];
            p.y += p.vy;
            p.x += p.vx;
            
            // "twinkle" - efecto de parpadeo
            p.a += (Math.random() < 0.5 ? -1 : 1) * p.tw;
            p.a = Math.max(0.25, Math.min(1.0, p.a));
            
            // Dibujar luz
            ctx.beginPath();
            ctx.fillStyle = p.c.replace(/[\d.]+\)\s*$/, p.a + ")");
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            
            // Respawn cuando sale de la pantalla
            if (p.y - p.r > H + 10) {
                lights.splice(i, 1);
                spawnLight(false);
            }
            if (p.x < -20) p.x = W + 20;
            if (p.x > W + 20) p.x = -20;
        }
        
        requestAnimationFrame(tick);
    }
    
    tick();
}

// ============================================
// Utilidades Adicionales
// ============================================

/**
 * Formatea un número como moneda
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Valida si un valor es un número positivo válido
 * @param {string|number} value - Valor a validar
 * @returns {boolean} True si es válido
 */
function isValidPositiveNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 && isFinite(num);
}

// Exportar funciones para uso externo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        isValidPositiveNumber
    };
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.twemoji) {
      twemoji.parse(document.body, { folder: "svg", ext: ".svg" });
    }
});

// ============================================
// Swiper - Carrusel de Artículos
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    if (!window.Swiper) return;

    new Swiper("#articlesSwiper", {
        loop: true,
        speed: 800,
        spaceBetween: 16,
        allowTouchMove: true,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        grabCursor: true,

        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },

        pagination: {
            el: "#articlesSwiper .swiper-pagination",
            clickable: true
        },

        navigation: {
            nextEl: "#articlesSwiper .swiper-button-next",
            prevEl: "#articlesSwiper .swiper-button-prev"
        },

        // Responsive suave
        breakpoints: {
            0:    { slidesPerView: 1.08 },
            640:  { slidesPerView: 2.05 },
            1024: { slidesPerView: 3.05 }
        }
    });
});
  
