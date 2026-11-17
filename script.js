let carrito = [];

const contadorCarrito = document.getElementById('contador-carrito');
const iconoCarrito = document.querySelector('.carrito-icono');
const modalCarrito = document.getElementById('modal-carrito');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const listaCarrito = document.getElementById('lista-carrito');
const precioTotal = document.getElementById('precio-total');
const btnWhatsapp = document.getElementById('btn-whatsapp');

// Lógica de las tarjetas en la página principal
document.querySelectorAll('.tarjeta-producto').forEach((tarjeta) => {
    const btnSumar = tarjeta.querySelector('.btn-sumar');
    const btnRestar = tarjeta.querySelector('.btn-restar');
    const inputCantidad = tarjeta.querySelector('.input-cantidad');
    const btnAgregar = tarjeta.querySelector('.btn-agregar');
    
    const nombreProducto = tarjeta.querySelector('h3').innerText;
    const precio = parseFloat(tarjeta.querySelector('.precio').innerText.replace('$', ''));

    btnSumar.addEventListener('click', () => {
        inputCantidad.value = parseInt(inputCantidad.value) + 1;
    });

    btnRestar.addEventListener('click', () => {
        if (parseInt(inputCantidad.value) > 1) {
            inputCantidad.value = parseInt(inputCantidad.value) - 1;
        }
    });

    btnAgregar.addEventListener('click', () => {
        const cantidadElegida = parseInt(inputCantidad.value);
        const productoExistente = carrito.find(item => item.nombre === nombreProducto);

        if (productoExistente) {
            productoExistente.cantidad += cantidadElegida;
        } else {
            carrito.push({ nombre: nombreProducto, precio: precio, cantidad: cantidadElegida });
        }
        
        const textoOriginal = btnAgregar.innerText;
        btnAgregar.innerText = "¡Añadido!";
        btnAgregar.style.backgroundColor = "#2ecc71"; 
        
        setTimeout(() => {
            btnAgregar.innerText = textoOriginal;
            btnAgregar.style.backgroundColor = "";
        }, 1000); 

        inputCantidad.value = 1; 
        actualizarContador();
    });
});

function actualizarContador() {
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contadorCarrito.innerText = totalItems;
}

// ABRIR Y CERRAR MODAL
iconoCarrito.addEventListener('click', () => {
    modalCarrito.classList.remove('modal-oculto');
    modalCarrito.classList.add('modal-visible'); 
    renderizarCarrito(); 
});

btnCerrarModal.addEventListener('click', () => {
    modalCarrito.classList.remove('modal-visible');
    modalCarrito.classList.add('modal-oculto'); 
});

// DIBUJAR Y CONTROLAR PRODUCTOS DENTRO DEL MODAL
function renderizarCarrito() {
    listaCarrito.innerHTML = ''; 
    let total = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p style="text-align:center; color:#7f8c8d;">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            
            const div = document.createElement('div');
            div.classList.add('item-carrito');
            
            // Diseño limpio sin la X
            div.innerHTML = `
                <div style="display:flex; flex-direction:column; flex:1;">
                    <div class="control-carrito">
                        <button class="btn-cantidad-carrito btn-restar-carrito" data-index="${index}">-</button>
                        <strong>${item.cantidad}</strong>
                        <button class="btn-cantidad-carrito btn-sumar-carrito" data-index="${index}">+</button>
                        <span style="margin-left: 5px;">${item.nombre}</span>
                    </div>
                    <span style="font-size: 13px; color: #7f8c8d;">$${item.precio.toFixed(2)} c/u</span>
                </div>
                <div style="display:flex; align-items:center;">
                    <strong>$${subtotal.toFixed(2)}</strong>
                </div>
            `;
            listaCarrito.appendChild(div);
        });

        // Lógica para el mini-botón de RESTAR en el carrito
        document.querySelectorAll('.btn-restar-carrito').forEach(boton => {
            boton.addEventListener('click', (evento) => {
                const indice = evento.target.getAttribute('data-index');
                if (carrito[indice].cantidad > 1) {
                    carrito[indice].cantidad--; // Resta 1
                } else {
                    carrito.splice(indice, 1); // Si ya es 1 y lo resta, se elimina por completo
                }
                renderizarCarrito();
                actualizarContador();
            });
        });

        // Lógica para el mini-botón de SUMAR en el carrito
        document.querySelectorAll('.btn-sumar-carrito').forEach(boton => {
            boton.addEventListener('click', (evento) => {
                const indice = evento.target.getAttribute('data-index');
                carrito[indice].cantidad++; // Suma 1
                renderizarCarrito();
                actualizarContador();
            });
        });
    }
    precioTotal.innerText = total.toFixed(2);
}

// ENVIAR A WHATSAPP
btnWhatsapp.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let numeroTelefono = "50765789311"; 
    let mensaje = "Hola, me gustaría hacer el siguiente pedido:%0A%0A"; 
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `- ${item.cantidad}x ${item.nombre} ($${subtotal.toFixed(2)})%0A`;
    });

    mensaje += `%0A*Total a pagar: $${total.toFixed(2)}*`;

    const url = `https://wa.me/${numeroTelefono}?text=${mensaje}`;
    window.open(url, '_blank');
});

document.addEventListener('DOMContentLoaded', () => {
    let totalCarrito = 0;
    
    // Seleccionamos todas las tarjetas de productos del catálogo
    const tarjetas = document.querySelectorAll('.tarjeta-producto');

    tarjetas.forEach(tarjeta => {
        const btnMenos = tarjeta.querySelector('.control-cantidad button:first-child');
        const btnMas = tarjeta.querySelector('.control-cantidad button:last-child');
        const inputCantidad = tarjeta.querySelector('.control-cantidad input');
        const btnAnadir = tarjeta.querySelector('.btn-anadir');
        const nombreProducto = tarjeta.querySelector('h3').textContent;

        // Botón restar (-)
        btnMenos.addEventListener('click', () => {
            let valorActual = parseInt(inputCantidad.value);
            if (valorActual > 1) {
                inputCantidad.value = valorActual - 1;
            }
        });

        // Botón sumar (+)
        btnMas.addEventListener('click', () => {
            let valorActual = parseInt(inputCantidad.value);
            inputCantidad.value = valorActual + 1;
        });

        // Botón Añadir al carrito
        btnAnadir.addEventListener('click', () => {
            let cantidad = parseInt(inputCantidad.value);
            totalCarrito += cantidad;

            // Actualiza de forma dinámica el texto del botón del carrito en el menú superior
            document.querySelectorAll('a, button').forEach(el => {
                if (el.textContent.includes('Carrito')) {
                    el.textContent = `🛒 Carrito (${totalCarrito})`;
                }
            });

            // Mensaje de confirmación en pantalla
            alert(`¡Se han añadido ${cantidad} unidad(es) de ${nombreProducto} al carrito!`);
        });
    });
});