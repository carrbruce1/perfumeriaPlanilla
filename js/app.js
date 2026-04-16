let carrito = [];
let categoriaActiva = "Todo";

document.addEventListener("DOMContentLoaded", () => {
    renderCategorias();
    renderProductos();
    renderZonas();
    renderPagos();
    // Iniciamos el temporizador de la promo
    if (typeof actualizarTemporizador === 'function') {
        setInterval(actualizarTemporizador, 1000);
    }
    document.getElementById("buscador").addEventListener("input", buscar);
});

// ── CATEGORÍAS (Estilo minimalista con barra inferior) ──
function renderCategorias() {
    const cont = document.getElementById("categorias");
    if (!cont) return;
    cont.innerHTML = "";
    const todas = [{ id: "Todo", nombre: "Todos" }, ...CONFIG.categorias];
    
    todas.forEach(cat => {
        const esActiva = cat.id === categoriaActiva;
        const btn = document.createElement("button");
        btn.onclick = () => filtrar(cat.id);
        btn.className = `flex-shrink-0 pb-2 px-2 text-[11px] uppercase tracking-[2px] transition-all duration-300 border-b-2 ${
            esActiva ? "border-acento text-white font-bold" : "border-transparent text-white/40"
        }`;
        btn.innerText = cat.nombre;
        cont.appendChild(btn);
    });
}

function filtrar(id) {
    categoriaActiva = id;
    renderCategorias();
    renderProductos();
}

// ── PRODUCTOS (Card estilo Boutique) ──
function renderProductos() {
    const cont = document.getElementById("productos");
    if (!cont) return;
    cont.innerHTML = "";

    const textoBusqueda = document.getElementById("buscador").value.trim().toLowerCase();
    let filtrados = CONFIG.productos;

    if (textoBusqueda !== "") {
        filtrados = CONFIG.productos.filter(p => 
            p.nombre.toLowerCase().includes(textoBusqueda) || 
            p.categoria.toLowerCase().includes(textoBusqueda)
        );
    } else if (categoriaActiva !== "Todo") {
        filtrados = CONFIG.productos.filter(p => p.categoria === categoriaActiva);
    }

    // Contenedor de grilla profesional (2 columnas en móvil, 4 en desktop)
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-4";

    filtrados.forEach(p => {
        grid.innerHTML += `
            <div class="group cursor-pointer" onclick="abrirOpciones(${p.id})">
                <div class="relative overflow-hidden bg-[#111] aspect-[3/4] mb-4 border border-white/5 transition-all group-hover:border-acento/30">
                    <img src="${p.img}" alt="${p.nombre}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    
                    <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 text-[8px] uppercase tracking-widest text-acento">
                        ${p.categoria}
                    </div>
                    
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span class="border border-white px-4 py-2 text-[10px] uppercase tracking-widest">Descubrir</span>
                    </div>
                </div>
                
                <div class="text-center px-2">
                    <h3 class="font-playfair text-sm text-white/90 leading-tight mb-1 group-hover:text-acento transition-colors">${p.nombre}</h3>
                    <p class="text-[10px] text-white/30 uppercase tracking-tighter mb-2 line-clamp-1">${p.descripcion}</p>
                    <div class="text-acento font-light tracking-widest text-sm">$${p.precio.toLocaleString()}</div>
                </div>
            </div>`;
    });
    cont.appendChild(grid);
}

// ── LÓGICA DE SELECCIÓN DE TAMAÑO (Modal refinado) ──
function abrirOpciones(id) {
    const producto = CONFIG.productos.find(p => p.id === id);
    if (!producto) return;

    document.getElementById("modalTitulo").innerText = producto.nombre;
    const contenedor = document.getElementById("contenedorOpciones");
    contenedor.innerHTML = "";

    // Tamaños típicos de perfumería
    const presentaciones = [
        { ml: "50ml", factor: 1 },
        { ml: "100ml", factor: 1.6 }
    ];

    presentaciones.forEach(pres => {
        const precioFinal = Math.round(producto.precio * pres.factor);
        contenedor.innerHTML += `
            <button onclick="agregarAlCarrito('${producto.nombre}', '${pres.ml}', ${precioFinal})" 
                    class="group flex justify-between items-center w-full border border-white/10 p-4 hover:border-acento transition-all">
                <div class="text-left">
                    <div class="text-[10px] text-white/40 uppercase tracking-widest">Tamaño</div>
                    <div class="text-sm text-white group-hover:text-acento">${pres.ml}</div>
                </div>
                <div class="text-acento font-bold">$${precioFinal.toLocaleString()}</div>
            </button>`;
    });

    document.getElementById("modalOpciones").classList.remove("hidden");
}

// ── EL RESTO DE LAS FUNCIONES SE MANTIENEN IGUAL (Carrito, Enviar, etc.) ──
function agregarAlCarrito(nombre, detalle, precio) {
    carrito.push({ item: nombre, detalle: detalle, precio: precio });
    actualizarContador();
    cerrarModalOpciones();
}

function actualizarContador() {
    const count = document.getElementById("contador");
    if(count) count.innerText = carrito.length;
}

function abrirCarrito() {
    const lista = document.getElementById("listaCarrito");
    const totalDoc = document.getElementById("totalCarrito");
    lista.innerHTML = "";
    let total = 0;
    
    carrito.forEach((p, i) => {
        total += p.precio;
        lista.innerHTML += `
            <div class="flex justify-between items-center py-5 border-b border-white/5">
                <div class="flex-1">
                    <div class="text-[11px] text-acento uppercase tracking-widest mb-1">${p.item}</div>
                    <div class="text-[10px] text-white/40 uppercase">${p.detalle}</div>
                    <div class="text-sm mt-1">$${p.precio.toLocaleString()}</div>
                </div>
                <button onclick="eliminarItem(${i})" class="text-white/20 hover:text-white transition-colors">✕</button>
            </div>`;
    });
    totalDoc.innerText = "$" + total.toLocaleString();
    document.getElementById("modalCarrito").classList.remove("hidden");
}

function eliminarItem(i) {
    carrito.splice(i, 1);
    actualizarContador();
    if (carrito.length === 0) cerrarCarrito(); else abrirCarrito();
}

function cerrarModalOpciones() { document.getElementById("modalOpciones").classList.add("hidden"); }
function cerrarCarrito() { document.getElementById("modalCarrito").classList.add("hidden"); }
function cerrarCarritoYFormulario() { cerrarCarrito(); document.getElementById("modal").classList.remove("hidden"); }
function buscar() { renderProductos(); }

function renderZonas() {
    const select = document.getElementById("zona");
    if(!select) return;
    CONFIG.zonas.forEach(z => {
        select.innerHTML += `<option value="${z.costo}" class="bg-black text-white">${z.nombre} ($${z.costo.toLocaleString()})</option>`;
    });
}

function renderPagos() {
    const cont = document.getElementById("listaPagos");
    cont.innerHTML = `
        <label class="flex items-center gap-3 cursor-pointer py-2 group">
            <input type="radio" name="pago" value="Efectivo" checked class="accent-acento"> 
            <span class="text-[11px] uppercase tracking-widest text-white/60 group-hover:text-white">Efectivo / Boutique</span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer py-2 group">
            <input type="radio" name="pago" value="Transferencia" class="accent-acento"> 
            <span class="text-[11px] uppercase tracking-widest text-white/60 group-hover:text-white">Transferencia / Alias</span>
        </label>`;
}

function enviarPedido() {
    const n = document.getElementById("nombre").value.trim();
    const t = document.getElementById("tipo").value;
    const p = document.querySelector('input[name="pago"]:checked')?.value;
    if (!n) return alert("Ingresá tu nombre");
    
    let total = 0;
    let itemsTxt = "";
    carrito.forEach(x => {
        total += x.precio;
        itemsTxt += `• ${x.item} (${x.detalle})%0A`;
    });

    let mensaje = `*Essence Deluxe - Pedido*%0A━━━━━━━━━━━━━━━%0A👤 *Cliente:* ${n}%0A📦 *Entrega:* ${t}%0A💳 *Pago:* ${p}%0A%0A✨ *Fragancias:*%0A${itemsTxt}%0A💰 *Total: $${total.toLocaleString()}*`;
    window.open(`https://wa.me/${CONFIG.telefono}?text=${mensaje}`);
}

function toggleDelivery() {
    const t = document.getElementById("tipo").value;
    document.getElementById("seccionDelivery").classList.toggle("hidden", t !== "Delivery");
}