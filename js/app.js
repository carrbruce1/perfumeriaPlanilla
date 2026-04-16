let carrito = [];
let categoriaActiva = "Todo";

document.addEventListener("DOMContentLoaded", () => {
  renderCategorias();
  renderProductos();
  renderZonas();
  renderPagos();
  actualizarTemporizador(); // Inicia el reloj de cuotas/envío
  document.getElementById("buscador").addEventListener("input", buscar);
});

// ── CATEGORIAS (Misma lógica, estética minimalista) ──
function renderCategorias() {
  const cont = document.getElementById("categorias");
  if(!cont) return;
  cont.innerHTML = "";
  const todas = [{ id: "Todo", nombre: "Todo" }, ...CONFIG.categorias];
  todas.forEach(cat => {
    const activa = cat.id === categoriaActiva ? "bg-acento text-primario" : "border border-white/10 text-white/60";
    cont.innerHTML += `
      <button onclick="filtrar('${cat.id}')" 
              class="flex-shrink-0 px-6 py-2 text-[10px] uppercase tracking-widest transition-all ${activa}">
        ${cat.nombre}
      </button>`;
  });
}

function filtrar(id) {
  categoriaActiva = id;
  renderCategorias();
  renderProductos();
}

// ── PRODUCTOS (Diseño Premium) ──
function renderProductos() {
  const cont = document.getElementById("productos");
  if(!cont) return;
  cont.innerHTML = "";
  
  const textoBusqueda = document.getElementById("buscador").value.trim().toLowerCase();
  let filtrados = CONFIG.productos;

  if (textoBusqueda !== "") {
    filtrados = CONFIG.productos.filter(p => 
      p.nombre.toLowerCase().includes(textoBusqueda) || 
      p.descripcion.toLowerCase().includes(textoBusqueda)
    );
  } else if (categoriaActiva !== "Todo") {
    filtrados = CONFIG.productos.filter(p => p.categoria === categoriaActiva);
  }

  if(filtrados.length === 0) {
    cont.innerHTML = `<p class="text-center text-white/20 py-10 uppercase tracking-widest text-xs">No se encontraron fragancias</p>`;
    return;
  }

  // Grid de productos
  const grid = document.createElement("div");
  grid.className = "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4";
  
  filtrados.forEach(p => {
    grid.innerHTML += `
      <div class="group relative bg-white/5 border border-white/5 p-4 transition-all hover:border-acento/30">
        <div class="aspect-[3/4] mb-4 overflow-hidden bg-[#111]">
          <img src="${p.img}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
        </div>
        <div class="text-center">
          <h3 class="font-playfair text-sm tracking-wide h-10 overflow-hidden">${p.nombre}</h3>
          <p class="text-[9px] text-white/30 uppercase mt-1 mb-3 tracking-tighter">${p.descripcion}</p>
          <div class="text-acento font-bold text-sm mb-4">$${p.precio.toLocaleString()}</div>
          <button onclick="abrirOpciones(${p.id})" 
                  class="w-full border border-acento/50 text-acento py-2 text-[10px] uppercase tracking-widest hover:bg-acento hover:text-primario transition-all">
            Ver más
          </button>
        </div>
      </div>`;
  });
  cont.appendChild(grid);
}

// ── LÓGICA DE MODAL DE OPCIONES (Ej: Tamaños de perfume) ──
function abrirOpciones(id) {
  const producto = CONFIG.productos.find(p => p.id === id);
  if(!producto) return;

  document.getElementById("modalTitulo").innerText = producto.nombre;
  const contenedor = document.getElementById("contenedorOpciones");
  contenedor.innerHTML = "";

  // Aquí podrías tener tamaños en tu CONFIG, si no, agregamos el estándar
  const tamaños = [
    { label: "50ml", precio: producto.precio },
    { label: "100ml", precio: producto.precio * 1.6 } // Ejemplo de incremento
  ];

  tamaños.forEach(t => {
    contenedor.innerHTML += `
      <button onclick="agregarAlCarrito('${producto.nombre}', '${t.label}', ${t.precio})" 
              class="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-3 hover:border-acento/50 transition-all">
        <span class="text-xs text-white/80 uppercase">${t.label}</span>
        <span class="text-acento font-bold">$${t.precio.toLocaleString()}</span>
      </button>`;
  });

  document.getElementById("modalOpciones").classList.remove("hidden");
}

function cerrarModalOpciones() {
  document.getElementById("modalOpciones").classList.add("hidden");
}

// ── CARRITO ──
function agregarAlCarrito(nombre, detalle, precio) {
  carrito.push({ item: `${nombre} (${detalle})`, precio: precio });
  actualizarContador();
  cerrarModalOpciones();
}

function actualizarContador() {
  document.getElementById("contador").innerText = carrito.length;
}

function abrirCarrito() {
  const lista = document.getElementById("listaCarrito");
  const totalDoc = document.getElementById("totalCarrito");
  if(!lista) return;
  
  lista.innerHTML = "";
  let total = 0;
  
  carrito.forEach((p, i) => {
    total += p.precio;
    lista.innerHTML += `
      <div class="flex justify-between items-center py-4 border-b border-white/5">
        <div>
          <div class="text-white text-xs uppercase tracking-wider">${p.item}</div>
          <div class="text-acento text-[10px] mt-1">$${p.precio.toLocaleString()}</div>
        </div>
        <button onclick="eliminarItem(${i})" class="text-white/20 hover:text-red-400">✕</button>
      </div>`;
  });
  
  totalDoc.innerText = "$" + total.toLocaleString();
  document.getElementById("modalCarrito").classList.remove("hidden");
}

function cerrarCarrito() {
  document.getElementById("modalCarrito").classList.add("hidden");
}

function eliminarItem(i) {
  carrito.splice(i, 1);
  actualizarContador();
  if (carrito.length === 0) cerrarCarrito();
  else abrirCarrito();
}

// ── FORMULARIO Y ENVÍO ──
function cerrarCarritoYFormulario() {
  cerrarCarrito();
  document.getElementById("modal").classList.remove("hidden");
}

function renderZonas() {
  const select = document.getElementById("zona");
  if(!select) return;
  select.innerHTML = "";
  CONFIG.zonas.forEach(z => {
    select.innerHTML += `<option value="${z.costo}" class="bg-primario text-white">${z.nombre} ($${z.costo.toLocaleString()})</option>`;
  });
}

function renderPagos() {
  const cont = document.getElementById("listaPagos");
  if(!cont) return;
  cont.innerHTML = `
    <label class="flex items-center gap-3 cursor-pointer text-xs text-white/60">
      <input type="radio" name="pago" value="Efectivo" checked class="accent-acento"> Efectivo / Boutique
    </label>
    <label class="flex items-center gap-3 cursor-pointer text-xs text-white/60 mt-2">
      <input type="radio" name="pago" value="Transferencia" class="accent-acento"> Transferencia Bancaria
    </label>`;
}

function enviarPedido() {
  const n = document.getElementById("nombre").value.trim();
  const d = document.getElementById("direccion").value.trim();
  const t = document.getElementById("tipo").value;
  const p = document.querySelector('input[name="pago"]:checked')?.value;
  
  if (!n) { alert("Por favor, ingresá tu nombre."); return; }
  
  let sub = 0; 
  carrito.forEach(x => sub += x.precio);
  
  let mensaje = `*Essence Deluxe - Nuevo Pedido*%0A━━━━━━━━━━━━━━━%0A👤 *Cliente:* ${n}%0A📦 *Método:* ${t}%0A💳 *Pago:* ${p}%0A`;
  if(t === "Delivery") mensaje += `📍 *Dirección:* ${d}%0A`;
  
  mensaje += `%0A✨ *Fragancias:*%0A`;
  carrito.forEach(x => { mensaje += `• ${x.item}%0A`; });
  mensaje += `%0A💰 *Total: $${sub.toLocaleString()}*`;
  
  window.open(`https://wa.me/${CONFIG.telefono}?text=${mensaje}`);
}

// ── TEMPORIZADOR (Versión 3 Cuotas / Envío Gratis) ──
function actualizarTemporizador() {
  const timerDoc = document.getElementById("timer");
  if(!timerDoc) return;
  
  const ahora = new Date();
  const finDeDia = new Date();
  finDeDia.setHours(23, 59, 59, 0);
  
  const diff = finDeDia - ahora;
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  
  timerDoc.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
setInterval(actualizarTemporizador, 1000);

function buscar() { renderProductos(); }
function toggleDelivery() {
  const t = document.getElementById("tipo").value;
  document.getElementById("seccionDelivery").classList.toggle("hidden", t !== "Delivery");
}