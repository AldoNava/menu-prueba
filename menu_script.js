// 1. Define la URL del archivo JSON
const dataURL = 'menu_data.json';

// Función principal para cargar y dibujar el menú
async function cargarMenu() {
    try {
        const response = await fetch(dataURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuData = await response.json();

        // ----------------------------------------------------
        // Definición de formatos de lista
        
        // Formato para items con precio chica y grande (ej. TORTAS SENCILLAS)
        const formatChicaGrande = item => {
            return `<span class="item-nombre">${item.nombre}</span> <span class="item-precio">$${item.precio_chica}</span> (Grande $${item.precio_grande})`;
        };

        // Formato para items con nombre, precio y descripción (ej. TORTAS ESPECIALES)
        const formatEspecial = item => {
            // Aseguramos que la descripción de las Especiales siempre incluya el precio grande
            const desc = item.descripcion.includes('(Grande') ? item.descripcion : `${item.descripcion} (Precio Grande No Especificado)`;
            return `<span class="item-nombre"><strong>${item.nombre}</strong> <span class="item-precio">$${item.precio}</span></span> <span class="item-descripcion">${desc}</span>`;
        };

        // Formato simple para items con nombre y precio (ej. TACOS, EXTRAS)
        const formatSimple = item => {
             let descripcion = item.descripcion ? `<span class="item-descripcion">${item.descripcion}</span>` : '';
             return `<span class="item-nombre">${item.nombre}</span> <span class="item-precio">$${item.precio}</span> ${descripcion}`;
        };
        
        // Formato para BEBIDAS (maneja tamaño)
        const formatBebidas = item => {
            let tamaño = item.tamaño ? `<span class="item-tamaño">${item.tamaño}</span>` : '';
            return `<span class="item-nombre">${item.nombre}</span> <span class="item-precio">$${item.precio}</span> ${tamaño}`;
        };

        // ----------------------------------------------------
        // Llama a dibujar cada sección con su formato y ID específicos

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

// =================================================================
// Lógica para el Carrusel de Imágenes
// =================================================================

function inicializarCarrusel() {
    // Array de nombres de archivo de las 8 fotos de muestra (deben estar en img/)
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
        carousel.appendChild(img);
    });

    const items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    // 2. Función para mostrar la imagen actual
    function updateCarousel() {
        items.forEach(item => item.classList.remove('active'));
        items[currentIndex].classList.add('active');
    }

    // 3. Manejar los botones de navegación
    function nextImage() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    }

    // 4. Asignar Eventos y Autocarrusel
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    
    // Carrusel automático cada 5 segundos
    setInterval(nextImage, 5000); 

    // Inicializar mostrando la primera imagen
    updateCarousel(); 
}

// Ejecuta la carga del menú y el carrusel cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();
    inicializarCarrusel();
});
