/**
 * ============================================
 * Script de Hanukkah - Lucecitas y Emojis Flotantes
 * ============================================
 */

// ============================================
// Lucecitas Cayendo (Canvas Particles)
// ============================================
(function initLights() {
    const canvas = document.getElementById("lights");
    if (!canvas) return;
    
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
})();

// ============================================
// Emojis Flotantes
// ============================================
(function initFloaters() {
    const floatersEl = document.getElementById("floaters");
    if (!floatersEl) return;
    
    const icons = ["✡️", "🕎", "✨", "⭐", "🪙", "🌀", "🔯", "💫"];
    const FLOATER_COUNT = 14;
    
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function addFloater() {
        const el = document.createElement("div");
        el.className = "floater";
        el.textContent = icons[(Math.random() * icons.length) | 0];
        
        const x = rand(6, 94).toFixed(2) + "vw";
        const y = rand(8, 92).toFixed(2) + "vh";
        const size = rand(18, 42).toFixed(0) + "px";
        const dur = rand(4.5, 9.5).toFixed(2) + "s";
        
        el.style.setProperty("--x", x);
        el.style.setProperty("--y", y);
        el.style.setProperty("--size", size);
        el.style.setProperty("--dur", dur);
        
        // Variación de fase
        el.style.animationDelay = (-rand(0, 6)).toFixed(2) + "s";
        
        floatersEl.appendChild(el);
    }
    
    // Crear todos los flotantes
    for (let i = 0; i < FLOATER_COUNT; i++) {
        addFloater();
    }
})();

