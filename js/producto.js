/**
 * ============================================
 * Script para Página de Producto
 * ============================================
 */

// Datos de los productos
const productos = {
    1: {
        id: 1,
        titulo: "Libro de Tradiciones Judías",
        precio: "$29.99",
        descripcion: "Una guía completa y detallada sobre las tradiciones y costumbres de nuestra comunidad. Este libro incluye explicaciones profundas sobre las festividades, rituales y prácticas que han sido transmitidas de generación en generación.",
        imagen: "images/bomi.jpg",
        caracteristicas: [
            "Más de 300 páginas de contenido",
            "Ilustraciones a color",
            "Guía de festividades",
            "Glosario de términos",
            "Edición de lujo"
        ]
    },
    2: {
        id: 2,
        titulo: "Menorah Artesanal",
        precio: "$89.99",
        descripcion: "Hermosa menorah hecha completamente a mano por artesanos expertos. Cada pieza es única y está diseñada para durar generaciones. Perfecta para tus celebraciones de Hanukkah y como pieza decorativa especial.",
        imagen: "images/bandera.jpg",
        caracteristicas: [
            "Hecha a mano",
            "Material: Latón pulido",
            "Incluye velas",
            "Base decorativa",
            "Certificado de autenticidad"
        ]
    },
    3: {
        id: 3,
        titulo: "Tallit Premium",
        precio: "$149.99",
        descripcion: "Manto de oración de alta calidad con diseño tradicional. Fabricado con los mejores materiales y técnicas artesanales. Este tallit es perfecto para uso diario y ocasiones especiales.",
        imagen: "images/ban.jpg",
        caracteristicas: [
            "100% lana premium",
            "Flecos tradicionales",
            "Bordado a mano",
            "Estuche incluido",
            "Tallas disponibles"
        ]
    },
    4: {
        id: 4,
        titulo: "Torá Ilustrada",
        precio: "$59.99",
        descripcion: "Edición especial de la Torá con hermosas ilustraciones que hacen que el texto sagrado sea accesible para toda la familia. Perfecta para estudio y enseñanza.",
        imagen: null,
        caracteristicas: [
            "Ilustraciones a color",
            "Texto en hebreo y español",
            "Comentarios explicativos",
            "Encuadernación de lujo",
            "Ideal para regalo"
        ]
    },
    5: {
        id: 5,
        titulo: "Set de Cocina Kosher",
        precio: "$79.99",
        descripcion: "Utensilios de cocina certificados kosher para tu hogar. Este set completo incluye todo lo necesario para mantener una cocina kosher según las leyes dietéticas judías.",
        imagen: null,
        caracteristicas: [
            "Certificado kosher",
            "Acero inoxidable",
            "Set completo de 12 piezas",
            "Fácil de limpiar",
            "Garantía de por vida"
        ]
    },
    6: {
        id: 6,
        titulo: "CD de Música Tradicional",
        precio: "$19.99",
        descripcion: "Colección de canciones tradicionales judías interpretadas por artistas reconocidos. Perfecta para disfrutar en familia y durante las festividades.",
        imagen: null,
        caracteristicas: [
            "20 canciones tradicionales",
            "Calidad de audio premium",
            "Incluye letras",
            "Artistas reconocidos",
            "Edición limitada"
        ]
    }
};

// Cargar producto al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    if (productos[productId]) {
        mostrarProducto(productos[productId]);
    } else {
        mostrarProducto(productos[1]);
    }
});

function mostrarProducto(producto) {
    const productDetail = document.getElementById('product-detail');
    
    const imagenHTML = producto.imagen 
        ? `<div class="product-image-wrapper">
            <img src="${producto.imagen}" alt="${producto.titulo}" class="product-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="image-placeholder-small" style="display: none; width: 100%; height: 400px; align-items: center; justify-content: center; background: var(--color-bg-secondary);">
                <iconify-icon icon="mdi:image" style="font-size: 4rem; color: var(--color-text-light);"></iconify-icon>
            </div>
          </div>`
        : `<div class="product-image-wrapper" style="height: 400px; display: flex; align-items: center; justify-content: center; background: var(--color-bg-secondary);">
            <iconify-icon icon="mdi:image" style="font-size: 4rem; color: var(--color-text-light);"></iconify-icon>
          </div>`;
    
    const caracteristicasHTML = producto.caracteristicas.map(caracteristica => 
        `<li><iconify-icon icon="mdi:check-circle"></iconify-icon> ${caracteristica}</li>`
    ).join('');
    
    productDetail.innerHTML = `
        ${imagenHTML}
        <div class="product-info">
            <h1 class="product-title">${producto.titulo}</h1>
            <div class="product-price">${producto.precio}</div>
            <p class="product-description">${producto.descripcion}</p>
            <ul class="product-features">
                ${caracteristicasHTML}
            </ul>
            <button class="buy-btn" onclick="comprarProducto(${producto.id})">
                Comprar ahora
            </button>
        </div>
    `;
}

function comprarProducto(id) {
    alert(`Redirigiendo al proceso de compra para el producto #${id}...\n\nEn una implementación real, aquí se conectaría con el sistema de pagos.`);
}

