/**
 * ============================================
 * Marketplace - Base de Datos y Lógica
 * ============================================
 */

// Base de datos de productos
const productos = [
    {
        id: 1,
        titulo: "Libro de Tradiciones Judías - Edición Especial",
        precio: 29.99,
        categoria: "libros",
        estado: "nuevo",
        ubicacion: "Buenos Aires, Argentina",
        imagen: "images/bomi.jpg",
        descripcion: "Una guía completa sobre las tradiciones y costumbres de nuestra comunidad."
    },
    {
        id: 2,
        titulo: "Menorah Artesanal de Latón",
        precio: 89.99,
        categoria: "artesanias",
        estado: "nuevo",
        ubicacion: "Córdoba, Argentina",
        imagen: "images/bandera.jpg",
        descripcion: "Hermosa menorah hecha completamente a mano por artesanos expertos."
    },
    {
        id: 3,
        titulo: "Tallit Premium de Lana",
        precio: 149.99,
        categoria: "textiles",
        estado: "nuevo",
        ubicacion: "Rosario, Argentina",
        imagen: "images/ban.jpg",
        descripcion: "Manto de oración de alta calidad con diseño tradicional."
    },
    {
        id: 4,
        titulo: "Torá Ilustrada para Niños",
        precio: 59.99,
        categoria: "libros",
        estado: "nuevo",
        ubicacion: "Mendoza, Argentina",
        imagen: "images/bomi.jpg",
        descripcion: "Edición especial con ilustraciones hermosas para toda la familia."
    },
    {
        id: 5,
        titulo: "Set de Utensilios Cocina Kosher",
        precio: 79.99,
        categoria: "cocina",
        estado: "nuevo",
        ubicacion: "La Plata, Argentina",
        imagen: "images/bandera.jpg",
        descripcion: "Utensilios de cocina certificados kosher para tu hogar."
    },
    {
        id: 6,
        titulo: "CD Música Tradicional Judía",
        precio: 19.99,
        categoria: "musica",
        estado: "usado",
        ubicacion: "Tucumán, Argentina",
        imagen: "images/ban.jpg",
        descripcion: "Colección de canciones tradicionales interpretadas por artistas reconocidos."
    },
    {
        id: 7,
        titulo: "Kipá Bordada a Mano",
        precio: 24.99,
        categoria: "textiles",
        estado: "nuevo",
        ubicacion: "Mar del Plata, Argentina",
        imagen: "images/bomi.jpg",
        descripcion: "Kipá artesanal con bordado tradicional en hilo dorado."
    },
    {
        id: 8,
        titulo: "Sidur Completo - Edición Aniversario",
        precio: 45.99,
        categoria: "libros",
        estado: "usado",
        ubicacion: "Salta, Argentina",
        imagen: "images/bandera.jpg",
        descripcion: "Libro de oraciones completo con comentarios y traducciones."
    },
    {
        id: 9,
        titulo: "Jarrón de Janucá Decorativo",
        precio: 65.99,
        categoria: "artesanias",
        estado: "nuevo",
        ubicacion: "Santa Fe, Argentina",
        imagen: "images/ban.jpg",
        descripcion: "Jarrón decorativo con motivos de Janucá, perfecto para el hogar."
    },
    {
        id: 10,
        titulo: "Mantel de Shabat Bordado",
        precio: 89.99,
        categoria: "textiles",
        estado: "nuevo",
        ubicacion: "CABA, Argentina",
        imagen: "images/bomi.jpg",
        descripcion: "Mantel elegante para la mesa de Shabat con bordados tradicionales."
    },
    {
        id: 11,
        titulo: "Vinilo Música Klezmer Clásica",
        precio: 34.99,
        categoria: "musica",
        estado: "usado",
        ubicacion: "Bahía Blanca, Argentina",
        imagen: "images/bandera.jpg",
        descripcion: "Vinilo original de música klezmer de los años 70."
    },
    {
        id: 12,
        titulo: "Cuchillo para Pan Kosher",
        precio: 42.99,
        categoria: "cocina",
        estado: "nuevo",
        ubicacion: "Neuquén, Argentina",
        imagen: "images/ban.jpg",
        descripcion: "Cuchillo especial certificado kosher para cortar pan."
    }
];

// Estado de la aplicación
let productosFiltrados = [...productos];
let filtrosActivos = {
    categorias: [],
    estados: []
};

// ============================================
// Inicialización
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    renderizarProductos(productos);
    actualizarContador(productos.length);
    inicializarEventos();
    inicializarTema();
});

// ============================================
// Renderizado de Productos
// ============================================
function renderizarProductos(productosArray) {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!grid) return;
    
    if (productosArray.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    grid.innerHTML = productosArray.map(producto => `
        <article class="product-card" data-product-id="${producto.id}">
            <div class="product-image-wrapper">
                <img 
                    src="${producto.imagen}" 
                    alt="${producto.titulo}" 
                    class="product-image"
                    onerror="this.src='images/bandera.jpg';"
                >
                <span class="product-badge ${producto.estado}">${producto.estado === 'nuevo' ? 'Nuevo' : 'Usado'}</span>
            </div>
            <div class="product-info">
                <h3 class="product-title">${producto.titulo}</h3>
                <div class="product-location">
                    <iconify-icon icon="mdi:map-marker"></iconify-icon>
                    <span>${producto.ubicacion}</span>
                </div>
                <div class="product-price">$${producto.precio.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn-details" onclick="verDetalles(${producto.id})" aria-label="Ver detalles de ${producto.titulo}">
                        <iconify-icon icon="mdi:eye"></iconify-icon>
                        Ver detalles
                    </button>
                    <button class="btn-contact" onclick="contactarWhatsApp(${producto.id})" aria-label="Contactar por WhatsApp sobre ${producto.titulo}">
                        <iconify-icon icon="mdi:whatsapp"></iconify-icon>
                        WhatsApp
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// ============================================
// Búsqueda
// ============================================
function inicializarEventos() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const statusFilters = document.querySelectorAll('.status-filter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    
    // Búsqueda en tiempo real
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            aplicarFiltros();
        });
    }
    
    // Ordenamiento
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            ordenarProductos(e.target.value);
        });
    }
    
    // Filtros de categoría
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            actualizarFiltrosCategoria();
            aplicarFiltros();
        });
    });
    
    // Filtros de estado
    statusFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            actualizarFiltrosEstado();
            aplicarFiltros();
        });
    });
    
    // Limpiar filtros
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Sidebar móvil
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
    }
    
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', toggleSidebar);
    }
    
    // Cerrar sidebar al hacer clic fuera
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleSidebar');
        
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                toggleSidebar();
            }
        }
    });
}

function actualizarFiltrosCategoria() {
    const checked = document.querySelectorAll('.category-filter:checked');
    filtrosActivos.categorias = Array.from(checked).map(cb => cb.value).filter(v => v !== 'todos');
    
    // Si "todos" está marcado, limpiar otros
    const todosCheckbox = document.querySelector('.category-filter[value="todos"]');
    if (todosCheckbox && todosCheckbox.checked) {
        filtrosActivos.categorias = [];
        document.querySelectorAll('.category-filter:not([value="todos"])').forEach(cb => cb.checked = false);
    }
}

function actualizarFiltrosEstado() {
    const checked = document.querySelectorAll('.status-filter:checked');
    filtrosActivos.estados = Array.from(checked).map(cb => cb.value).filter(v => v !== 'todos');
    
    // Si "todos" está marcado, limpiar otros
    const todosCheckbox = document.querySelector('.status-filter[value="todos"]');
    if (todosCheckbox && todosCheckbox.checked) {
        filtrosActivos.estados = [];
        document.querySelectorAll('.status-filter:not([value="todos"])').forEach(cb => cb.checked = false);
    }
}

function aplicarFiltros() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const sortValue = document.getElementById('sortSelect').value;
    
    productosFiltrados = productos.filter(producto => {
        // Búsqueda por título
        const matchSearch = !searchTerm || producto.titulo.toLowerCase().includes(searchTerm);
        
        // Filtro por categoría
        const matchCategory = filtrosActivos.categorias.length === 0 || 
                             filtrosActivos.categorias.includes(producto.categoria);
        
        // Filtro por estado
        const matchStatus = filtrosActivos.estados.length === 0 || 
                           filtrosActivos.estados.includes(producto.estado);
        
        return matchSearch && matchCategory && matchStatus;
    });
    
    ordenarProductos(sortValue);
    actualizarContador(productosFiltrados.length);
}

function ordenarProductos(tipo) {
    switch(tipo) {
        case 'precio-asc':
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
        case 'relevante':
        default:
            // Mantener orden original (más relevante = primero en la lista)
            productosFiltrados.sort((a, b) => a.id - b.id);
            break;
    }
    
    renderizarProductos(productosFiltrados);
}

function actualizarContador(count) {
    const counter = document.getElementById('resultsCount');
    if (counter) {
        counter.textContent = count;
    }
}

function clearAllFilters() {
    // Limpiar búsqueda
    document.getElementById('searchInput').value = '';
    
    // Limpiar checkboxes
    document.querySelectorAll('.category-filter, .status-filter').forEach(cb => {
        if (cb.value === 'todos') {
            cb.checked = true;
        } else {
            cb.checked = false;
        }
    });
    
    // Resetear filtros
    filtrosActivos = { categorias: [], estados: [] };
    
    // Aplicar filtros
    aplicarFiltros();
}

// ============================================
// Sidebar Móvil
// ============================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay') || crearOverlay();
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevenir scroll del body cuando el sidebar está abierto
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function crearOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', toggleSidebar);
    document.body.appendChild(overlay);
    return overlay;
}

// ============================================
// Acciones de Producto
// ============================================
function verDetalles(productId) {
    window.location.href = `producto.html?id=${productId}`;
}

function contactarWhatsApp(productId) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;
    
    const mensaje = encodeURIComponent(`Hola, estoy interesado en: ${producto.titulo}`);
    const whatsappUrl = `https://wa.me/5491123456789?text=${mensaje}`;
    window.open(whatsappUrl, '_blank');
}

// ============================================
// Tema (compartido con el resto del sitio)
// ============================================
function inicializarTema() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
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


