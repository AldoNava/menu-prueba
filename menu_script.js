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
        // Definición de formatos de lista según la estructura del JSON
        
        // Formato para items con precio chica y grande (ej. TORTAS SENCILLAS)
        const formatChicaGrande = item => {
            return `<span class="item-nombre">${item.nombre}</span> <span class="item-precio">$${item.precio_chica}</span> (Grande $${item.precio_grande})`;
        };

        // Formato para items con nombre, precio y descripción (ej. TORTAS ESPECIALES)
        const formatEspecial = item => {
            return `<span class="item-nombre"><strong>${item.nombre}</strong> <span class="item-precio">$${item.precio}</span></span> <span class="item-descripcion">${item.descripcion}</span>`;
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
        
        // Usando el formato simple para el resto de secciones similares:
        dibujarSeccion(menuData.SINCRONIZADAS, 'lista-sincronizadas', formatSimple);
        dibujarSeccion(menuData.TACOS, 'lista-tacos', formatSimple);
        dibujarSeccion(menuData.HAMBURGUESAS, 'lista-hamburguesas', formatSimple);
        dibujarSeccion(menuData.SANDWICH, 'lista-sandwich', formatSimple);
        dibujarSeccion(menuData.TOSTADAS, 'lista-tostadas', formatSimple);

        // Formato específico para bebidas y extras
        dibujarSeccion(menuData.BEBIDAS, 'lista-bebidas', formatBebidas);
        dibujarSeccion(menuData.EXTRAS, 'lista-extras', formatSimple);


    } catch (error) {
        console.error('Error al cargar el menú:', error);
        // Mensaje de error visible para el usuario si falla la carga
        document.getElementById('menu-principal').innerHTML = '<p class="error-msg">Error al cargar el menú. Por favor, asegúrate de que el archivo menu_data.json exista y sea válido.</p>';
    }
}

// Función auxiliar que toma la lista de items, el ID del contenedor y la función de formato
function dibujarSeccion(items, targetId, formatter) {
    const ul = document.getElementById(targetId);
    if (!ul || !items) return; 

    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = formatter(item); 
        ul.appendChild(li);
    });
}

// Ejecuta la carga del menú cuando el navegador esté listo
cargarMenu();
