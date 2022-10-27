//ENTREGA FINAL - ROBLEDO, BELEN

//----CLASES----------------------------------------------------------------------------------------------
class Producto{
    static i = 1;

    constructor({nombre, precio, categoria, imgRoute}){
        this.id = this.constructor.i++;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.categoria = categoria;
        this.cantidad = 1;
        this.imgRoute = (imgRoute || "./img/undefined.jpg");
    }

    setCantidad (cantidad){
        this.cantidad = parseInt(cantidad);
    }

    static resetStaticID (){
        Producto.i = 1;
    }
}

class Carrito{
    constructor(){
        this.productos = [];
    }

    agregarProducto(producto){
        let index = this.productos.indexOf(producto);
        (index !==-1) ? this.productos[index].cantidad++ : this.productos.push(producto);
    }

    eliminarProducto(producto){
        let index = this.productos.indexOf(producto);
        if(index!==-1){
            (this.productos[index].cantidad>1) ? this.productos[index].cantidad-- : this.productos.splice(index, 1);
        }
    }

    calcularPrecioTotal(){
        let suma = 0;
        for(let producto of this.productos){
            suma += (producto.precio * producto.cantidad);
        }
        return suma;
    }

    calcularCantTotalProductos(){
      let suma = 0;
        for(let producto of this.productos){
            suma += producto.cantidad;
        }
        return suma;
    }
}
//----------------------------------------------------------------------------------------------------------



//----VARIABLES-GLOBALES------------------------------------------------------------------------------------
let listaProductos = [];
let carrito = new Carrito();
//----------------------------------------------------------------------------------------------------------



//----MAIN--------------------------------------------------------------------------------------------------
main();

function main(){
    cargarListaProductos().then(() => {
      carrito = retrieveCarrito();
      indexView();
    });
}
//----------------------------------------------------------------------------------------------------------



//-----FUNCIONES--------------------------------------------------------------------------------------------
async function cargarListaProductos() {
  try {
    const response = await fetch(
      "./productos.json"
    );
    const data = await response.json();
    for (const object of data) {
      let producto = new Producto(object)
      listaProductos.push(producto);
    }
  } catch (error) {
    console.log(error);
  }
}

function indexListener(){
    let auxLista = [];
    let containerIndex = document.getElementById("containerIndex");

    let opcion1 = document.getElementById("bannerProductos");
    opcion1.onclick = function() {
        containerIndex.remove();
        breadCrumb();
        listarProductos()};

    let opcion2 = document.getElementById("bannerGatos");
    opcion2.onclick = function() {
        containerIndex.remove();
        auxLista = listaProductos.filter((elemento) => elemento.categoria == "Gato");
        breadCrumb("Gatos");
        listarProductos(auxLista);};

    let opcion3 = document.getElementById("bannerPerros");
    opcion3.onclick = function() {
        containerIndex.remove();
        auxLista = listaProductos.filter((elemento) => elemento.categoria == "Perro");
        breadCrumb("Perros");
        listarProductos(auxLista);};

    let opcion4 = document.getElementById("bannerAlimentos");
    opcion4.onclick = function() {
        containerIndex.remove();
        auxLista = listaProductos.filter((elemento) => elemento.categoria == "Alimento");
        breadCrumb("Alimento");
        listarProductos(auxLista);};

    let busqueda = document.getElementById("searchButton");
    busqueda.onclick = function() {
        containerIndex.remove();
        breadCrumb("busqueda");
        buscarProductoPorNombre();};
}

//----------------------------------------------------------------------------------------------------------



//-----BUSCAR-PRODUCTO-POR-NOMBRE---------------------------------------------------------------------------
function buscarProductoPorNombre(){
  let searchForm = document.getElementById("search");
  searchForm.addEventListener("submit", obtenerProductoIngresado);
}

function obtenerProductoIngresado(event){
  let resultado = document.getElementById("searchResult");
  let containerProductos = document.getElementById("containerProductos");
  if(resultado){
    resultado.remove();
  }
  if(containerProductos){
    containerProductos.remove();
  }

  event.preventDefault();
  let formulario = event.target;
  let auxLista = [];
  let nombre = formulario.children[0].value;
  auxLista = listaProductos.filter((elemento) => elemento.nombre.toLowerCase().includes(nombre.trim().toLowerCase()));
  console.log(auxLista);
  //"includes" para que pueda buscar por un fragmento del string y no solo por la palabra completa.
  if(auxLista.length === 0){
      let resultado = document.createElement("p");
      resultado.id = "searchResult";
      resultado.className = "text-center";
      resultado.innerText = "No se encontraron productos que coincidan con la busqueda.";
      document.body.append(resultado);
  }
  else{
      listarProductos(auxLista);
  }
}
//----------------------------------------------------------------------------------------------------------



//-----LOCAL-STORAGE----------------------------------------------------------------------------------------
function retrieveCarrito(){
  let listaJSON = JSON.parse(localStorage.getItem("productosCarrito"));
  if(listaJSON!=null){
      for(const objeto of listaJSON){
          let aux = listaProductos.find(e => e.id === objeto.id);
          (aux !== undefined) && (aux.setCantidad(objeto.cantidad) + carrito.productos.push(aux));
      }
  }
  mostrarCarrito();
  return carrito;
}

function saveCarrito(){
  localStorage.setItem("productosCarrito", JSON.stringify(carrito.productos));
}

function emptyCarrito(){
localStorage.clear();
carrito = new Carrito();
for(const producto of listaProductos){
  producto.cantidad = 1;
}
}
//----------------------------------------------------------------------------------------------------------



//-----VISTAS-----------------------------------------------------------------------------------------------
function indexView() {
    let containerIndex = document.createElement("div");
    containerIndex.id = "containerIndex";
    containerIndex.innerHTML = 
    `
    <div class="container-fluid" id="home-container">
    <div class="row">
      <div class="col-sm-12 col-md-4 col-lg-3 p-3">
        <div class="textbanner-link" href="index.html" title="Productos" id="bannerProductos">
          <div class="textbanner img-1">
            <!--img as bg in styles.scss-->
            <div class="textbanner-text">
              <p class="textbanner-title"><b>PRODUCTOS</b></p>
              <button class="btn btn-outline-light textbanner-button">Ver todos los Productos</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-8 col-lg-9">
        <div class="row">
          <div class="col-12 col-sm-12 p-3">
            <div class="textbanner-link" href="index.html" title="Gatos" id="bannerGatos">
              <div class="textbanner mid background img-2">
                <!--img as bg in styles.scss-->
                <div class="textbanner-text">
                  <p class="textbanner-title"><b>GATOS</b></p>
                  <button class="btn btn-outline-light textbanner-button">Ver productos para Gatos</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-6 p-3">
            <div class="textbanner-link" href="index.html" title="Perros" id="bannerPerros">
              <div class="textbanner mid img-3">
                <!--img as bg in styles.scss-->
                <div class="textbanner-text">
                  <p class="textbanner-title"><b>PERROS</b></p>
                  <button class="btn btn-outline-light textbanner-button">Ver productos para Perros</button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6 p-3">
            <div class="textbanner-link" href="index.html" title="Alimentos" id="bannerAlimentos">
              <div class="textbanner mid img-4">
                <!--img as bg in styles.scss-->
                <div class="textbanner-text">
                  <p class="textbanner-title"><b>ALIMENTO</b></p>
                  <button class="btn btn-outline-light textbanner-button">Ver Alimentos Balanceados</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
    document.body.appendChild(containerIndex);

    indexListener();
}

function breadCrumb(categoria = "all"){
  if(document.getElementById("containerBreadCrumb")){
    document.getElementById("containerBreadCrumb").remove();
  }
  let containerBreadCrumb = document.createElement("div");
  document.body.appendChild(containerBreadCrumb);
  containerBreadCrumb.id = "containerBreadCrumb";
  containerBreadCrumb.className = "container pt-4 ps-5";
  if(categoria === "all"){
    containerBreadCrumb.innerHTML = `
                                  <ol class="breadcrumb" style="--bs-breadcrumb-divider: '>';">
                                    <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">Productos</li>
                                  </ol>`;
  }
  else{
    containerBreadCrumb.innerHTML = `
                                  <ol class="breadcrumb" style="--bs-breadcrumb-divider: '>';">
                                    <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                                    <li class="breadcrumb-item"><a href="#" id="linkProductos">Productos</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">${categoria}</li>
                                  </ol>`;

    let linkProductos = document.getElementById("linkProductos");
    linkProductos.onclick = function() {
      breadCrumb();
      listarProductos()
    };

  }
}

function listarProductos(auxLista = []) {
  if (document.getElementById("containerProductos")) {
    document.getElementById("containerProductos").remove();
  }

  let containerProductos = document.createElement("div");
  document.body.append(containerProductos);
  containerProductos.id = "containerProductos";
  containerProductos.className = "row justify-content-md-center container-fluid contenedor-productos p-3";
  if (auxLista.length == 0) {
    auxLista = listaProductos;
  }
  for (const producto of auxLista) {
    let column = document.createElement("div");
    column.id = `card-${producto.id}`;
    column.className = "card col-sm-12 col-md-5 col-lg-3 m-1 p-3 text-center shadow-sm";
    column.innerHTML = `<img class="img-product" src="${producto.imgRoute}" alt="${producto.nombre}">
                        <h4 class="card-text">${producto.nombre}</h4>
                        <h5 class="card-text"><b>$${producto.precio.toLocaleString()}</b></h5>
                      `;
    containerProductos.append(column);
    column.append(addButtonComprar(producto));
  }
}

function mostrarCarrito(){
  let containerCarrito = document.getElementById("containerCarrito");
  if(carrito.productos.length === 0){
    containerCarrito.innerHTML = `<p>El carrito está vacío.</p>`;
  }
  else{
    containerCarrito.innerHTML = "";
    containerCarrito.className = "container-fluid";

    let cantCarrito = document.getElementById("cantCarrito");
    cantCarrito.innerHTML = carrito.calcularCantTotalProductos();

    for(const producto of carrito.productos){
      let row = document.createElement("div");
      row.id = `card-cart-${producto.id}`;
      row.className = "card-cart row mb-1 m-auto p-2 text-left position-relative";
      row.innerHTML = `
                        <div class="col-4 my-auto"><img class="card-cart-img" src="${producto.imgRoute}" alt="${producto.nombre}"></div>
                        <div class="col-8 p-0 lh-2 my-auto">
                          <p class="card-cart-text my-auto"><b>${producto.nombre}</b></p>
                          <p class="card-cart-text my-auto card-${producto.id}-cantidad">Cantidad: ${producto.cantidad}</p>
                          <p class="card-cart-text my-auto">$${producto.precio.toLocaleString()}</p>
                        </div>
                      `;
      containerCarrito.append(row);

      let botonEliminarProducto = document.createElement("button");
      row.appendChild(botonEliminarProducto);
      botonEliminarProducto.id = `botonEliminarProducto-${producto.id}`;
      botonEliminarProducto.className = "btn btn-outline-dark w-auto position-absolute end-0 bottom-0 my-2";
      botonEliminarProducto.textContent = "eliminar";
      
      console.log(botonEliminarProducto);

      // botonEliminarProducto.onclick = function () {
      //   console.log("test");
      // }

      botonEliminarProducto.addEventListener("click", function () {
        console.log("test");
      });

      //row.appendChild(addButtonEliminarProducto(producto));
    }

    function test(){
      console.log("test");
    }

    containerCarrito.innerHTML += `<div class="precio-total py-1"><h5><b>TOTAL: $${carrito.calcularPrecioTotal().toLocaleString()}</b></h5></div>`;

    containerCarrito.append(addButtonVaciarCarrito());
  }
}

//----------------------------------------------------------------------------------------------------------



//----AGREGAR-BOTONES---------------------------------------------------------------------------------------
function addButtonComprar(producto){
    let boton = document.createElement("button");
    boton.id = `botonProducto-${producto.id}`;
    boton.className = "btn btn-outline-primary position-absolute bottom-0 end-0 m-3";
    boton.textContent = "Comprar";

    boton.onclick = function() {
        carrito.agregarProducto(producto);
        saveCarrito(carrito);
        mostrarCarrito();

        Toastify({
            text: `"${producto.nombre}" agregado al carrito.`,
            duration: 2000,
            stopOnFocus: true,
            offset: {
              y: 75
            },
            style: {
                background: "#484D51"
              }
            }).showToast();
    }

    return boton;
}

function addButtonEliminarProducto(producto){
  let botonEliminarProducto = document.createElement("button");
  botonEliminarProducto.id = `botonEliminarProducto-${producto.id}`;
  botonEliminarProducto.className = "btn w-auto position-absolute end-0 bottom-0 my-2 boton-eliminar-producto";
  botonEliminarProducto.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50" style=" fill:#212529;">
  <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z"></path>
  </svg>`;

  botonEliminarProducto.onclick = function () {
    console.log("uwu");
    if(producto.cantidad===1){
      botonEliminarProducto.parentElement.remove();
    }else{
        let textCantidad = document.getElementById(`card-${producto.id}-cantidad`);
        textCantidad.innerHTML = `<p class="card-cart-text my-auto card-${producto.id}-cantidad">Cantidad: ${producto.cantidad - 1}</p>`;
    }
    carrito.eliminarProducto(producto);
    saveCarrito();

    if(carrito.productos.length === 0){
      emptyCarrito();
      mostrarCarrito();
    }
  }

  return botonEliminarProducto;
}

function addButtonVaciarCarrito(){
  let botonVaciarCarrito = document.createElement("button");
  botonVaciarCarrito.id = `botonVaciarCarrito`;
  botonVaciarCarrito.className = "btn border border-light rounded-pill position-absolute bottom-0 start-0 m-3";
  botonVaciarCarrito.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 50 50" style=" fill:#f8f9fa;">
  <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z"></path>
  </svg>`;

  botonVaciarCarrito.onclick = function () {
    swal.fire({
        title: "Esta seguro que desea vaciar el carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          swal.fire({
            title: "Carrito vaciado.",
            icon: "success",
          });
          emptyCarrito();
          mostrarCarrito();
        }
      });
  }

  return botonVaciarCarrito;
}
//----------------------------------------------------------------------------------------------------------