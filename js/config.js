const CONFIG = {
  // Configuración de contacto
  telefono: "5493454175555", // Reemplazar por el número de la boutique
  nombreTienda: "Essence Deluxe",

  // Categorías de la perfumería
  categorias: [
    { id: "Hombre", nombre: "Hombre" },
    { id: "Mujer", nombre: "Mujer" },
    { id: "Unisex", nombre: "Unisex & Nicho" }
  ],

  // Listado de productos con soporte para imágenes
  productos: [
    {
      id: 1,
      categoria: "Mujer",
      nombre: "Libre (Eau de Parfum)",
      descripcion: "Lavanda floral, sensual y audaz. Un grito de libertad.",
      precio: 185000,
      img: "img/libre.jfif" // Asegurate de tener la carpeta 'img' creada
    },
    {
      id: 2,
      categoria: "Hombre",
      nombre: "Sauvage Elixir",
      descripcion: "Licoroso, especiado y extremadamente concentrado.",
      precio: 210000,
      img: "img/sauvageelixir.jfif"
    },
    {
      id: 3,
      categoria: "Unisex",
      nombre: "Baccarat Rouge 540",
      descripcion: "Alquimia poética: una firma olfativa gráfica y condensada.",
      precio: 450000,
      img: "img/baccarat.jfif"
    },
    {
      id: 4,
      categoria: "Mujer",
      nombre: "Good Girl",
      descripcion: "Poderosa y sensual. Notas de jazmín y haba tonka.",
      precio: 165000,
      img: "img/good-girl.jfif"
    },
    {
      id: 5,
      categoria: "Hombre",
      nombre: "Invictus Victory",
      descripcion: "Un choque de frescura y sensualidad magnética.",
      precio: 140000,
      img: "img/invictus.jfif"
    }
  ],

  // Configuración de logística
  zonas: [
    { nombre: "Recoleta / CABA", costo: 0 },
    { nombre: "GBA Norte", costo: 4500 },
    { nombre: "Envío Nacional (Correo)", costo: 8000 }
  ],

  // Métodos de pago
  pagos: {
    efectivo: true,
    transferencia: true,
    alias: "essence.boutique.mp"
  }
};