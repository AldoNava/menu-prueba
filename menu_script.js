// 1. Define la URL del archivo JSON
const dataURL = 'menu_data.json';

// Función auxiliar que construye los elementos LI
function dibujarSeccion(items, targetId, formatter) {
    const ul = document.getElementById(targetId);
    if (!ul || !items) return; 

    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = formatter(item); 
        ul.appendChild(li);
    });
}

// ----------------------------------------------------
// Definición de formatos de lista
const formatChicaGrande = item => {
    return `<span class="item-nombre">${item.nombre}</span> <span class="item-precio">$${item.precio_chica}</span> (Grande $${item.precio_grande})`;
};

const formatEspecial = item => {
    const desc = item.descripcion.includes('(Grande') ? item.descripcion : `${item.descripcion} (Precio Grande No Especificado)`;
    return `<span class="item-nombre"><strong>${item.nombre}</strong> <span class="item-precio">$${item.precio}</span></span> <span class="item-descripcion">${desc}</span>`;
};

const formatSimple = item => {
     let descripcion = item.descripcion ? `<span class="item-descripcion">${item.descripcion}</span>` : '';
     return `<span class="item-nombre">${item.nombre}</span> <span class="item-precio">$${item.precio}</span> ${descripcion}`;
};

const formatBebidas = item => {
    let tamaño = item.tamaño ? `<span class="item-tamaño">${item.tamaño}</span>` : '';
    return `<span class="item-nombre">${item.nombre}</span> <span class="item-precio">$${item.precio}</span> ${tamaño}`;
};

// Función principal para cargar y dibujar el menú
async function cargarMenu() {
    try {
        const response = await fetch(dataURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuData = await response.json();

        // Llama a dibujar cada sección
        dibujarSeccion(menuData.TORTAS_SENCILLAS, 'lista-tortas-sencillas', formatChicaGrande);
        dibujarSeccion(menuData.TORTAS_ESPECIALES, 'lista-tortas-especiales', formatEspecial);
        dibujarSeccion(menuData.SINCRONIZADAS, 'lista-sincronizadas', formatSimple);
        dibujarSeccion(menuData.TACOS, 'lista-tacos', formatSimple);
        dibujarSeccion(menuData.HAMBURGUESAS, 'lista-hamburguesas', formatSimple);
        dibujarSeccion(menuData.SANDWICH, 'lista-sandwich', formatSimple);
        dibujarSeccion(menuData.TOSTADAS, 'lista-tostadas', formatSimple);
        dibujarSeccion(menuData.BEBIDAS, 'lista-bebidas', formatBebidas);
        dibujarSeccion(menuData.EXTRAS, 'lista-extras', formatSimple);


    } catch (error) {
        console.error('Error al cargar el menú:', error);
        document.getElementById('menu-principal').innerHTML = '<p class="error-msg">Error al cargar el menú. Por favor, asegúrate de que el archivo menu_data.json exista y sea válido.</p>';
    }
}

// =================================================================
// 🍔 Lógica para la Navegación por Tabs (Menú Horizontal)
// =================================================================
function setupCategoryTabs() {
    const navItems = document.querySelectorAll('#category-nav .nav-item');
    const menuSections = document.querySelectorAll('#menu-content .categoria');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('data-target');

            // 1. Manejar la clase activa de la navegación (Tabs)
            navItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // 2. Manejar la visibilidad del contenido (Secciones)
            menuSections.forEach(section => {
                section.classList.remove('active-menu');
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-menu');
            }
        });
    });
}


// =================================================================
// 🖼️ Lógica para el Carrusel de 3 Imágenes (Cover Flow)
// =================================================================
function inicializarCarrusel() {
    const imageNames = [
        'la-tortuga-fotos-1.jpg',
        'la-tortuga-fotos-2.jpg',
        'la-tortuga-fotos-3.jpg',
        'la-tortuga-fotos-4.jpg',
        'la-tortuga-fotos-5.jpg',
        'la-tortuga-fotos-6.jpg',
        'la-tortuga-fotos-7.jpg',
        'la-tortuga-fotos-8.jpg'
    ];

    const carousel = document.getElementById('image-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentIndex = 0;

    // 1. Cargar todas las imágenes
    imageNames.forEach((name, index) => {
        const img = document.createElement('img');
        img.src = `img/${name}`;
        img.alt = `Foto de Tortería La Tortuga ${index + 1}`;
        img.classList.add('carousel-item');
        // Usamos un estilo inline para el posicionamiento inicial
        img.style.transform = `translateX(${(index - currentIndex) * 100}%)`; 
        carousel.appendChild(img);
    });

    const items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;
    const totalItems = items.length;

    // Función para actualizar las clases y posiciones
    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            item.style.opacity = '0'; // Ocultar por defecto

            // Calcular índices cíclicos
            const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
            const nextIndex = (currentIndex + 1) % totalItems;

            if (index === currentIndex) {
                item.classList.add('active');
                item.style.opacity = '1';
            } else if (index === prevIndex) {
                item.classList.add('prev');
                item.style.opacity = '1';
            } else if (index === nextIndex) {
                item.classList.add('next');
                item.style.opacity = '1';
            }
        });
    }

    // Manejar los botones de navegación
    function nextImage() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    // 4. Asignar Eventos y Autocarrusel
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    
    // Carrusel automático cada 5 segundos
    setInterval(nextImage, 5000); 

    // Inicializar mostrando las tres primeras imágenes
    updateCarousel(); 
}

// Ejecuta la carga del menú y el carrusel cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();
    inicializarCarrusel();
    setupCategoryTabs(); 
});
