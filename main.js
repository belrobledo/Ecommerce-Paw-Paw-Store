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

    calcularPrecioTotalProducto(){
      return this.cantidad * this.precio;
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

    let opcion1 = document.getElementById("bannerProductos");
    opcion1.onclick = function() {
        breadCrumb("Productos");
        listarProductos()};

    let opcion2 = document.getElementById("bannerGatos");
    opcion2.onclick = function() {
        auxLista = listaProductos.filter((elemento) => elemento.categoria == "Gatos");
        breadCrumb("Gatos");
        listarProductos(auxLista);};

    let opcion3 = document.getElementById("bannerPerros");
    opcion3.onclick = function() {
        auxLista = listaProductos.filter((elemento) => elemento.categoria == "Perros");
        breadCrumb("Perros");
        listarProductos(auxLista);};

    let opcion4 = document.getElementById("bannerPeces");
    opcion4.onclick = function() {
        auxLista = listaProductos.filter((elemento) => elemento.categoria == "Peces");
        breadCrumb("Peces");
        listarProductos(auxLista);};

    let busqueda = document.getElementById("searchButton");
    busqueda.onclick = function() {
        breadCrumb("Búsqueda");
        buscarProductoPorNombre();};
}

//----------------------------------------------------------------------------------------------------------



//-----BUSCAR-PRODUCTO-POR-NOMBRE---------------------------------------------------------------------------
function buscarProductoPorNombre(){
  let searchForm = document.getElementById("search");
  searchForm.addEventListener("submit", obtenerProductoIngresado);
}

function obtenerProductoIngresado(event){
  document.getElementById("searchResult") && document.getElementById("searchResult").remove();
  document.getElementById("containerProductos") && document.getElementById("containerProductos").remove();

  event.preventDefault();
  let formulario = event.target;
  let auxLista = [];
  let nombre = formulario.children[0].value;
  auxLista = listaProductos.filter((elemento) => elemento.nombre.toLowerCase().includes(nombre.trim().toLowerCase()));
  //"includes" para que pueda buscar por un fragmento del string y no solo por la palabra completa.
  if(auxLista.length === 0){
      let resultado = document.createElement("p");
      resultado.id = "searchResult";
      resultado.className = "text-center";
      resultado.innerText = "No se encontraron productos que coincidan con la búsqueda.";
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
                      <p class="textbanner-title"><b>Gatos</b></p>
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
                      <p class="textbanner-title"><b>Perros</b></p>
                      <button class="btn btn-outline-light textbanner-button">Ver productos para Perros</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-md-6 p-3">
                <div class="textbanner-link" href="index.html" title="Peces" id="bannerPeces">
                  <div class="textbanner mid img-4">
                    <!--img as bg in styles.scss-->
                    <div class="textbanner-text">
                      <p class="textbanner-title"><b>Peces</b></p>
                      <button class="btn btn-outline-light textbanner-button">Ver productos para Peces</button>
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

function breadCrumb(categoria = "Productos"){
  clearScreen();

  let containerBreadCrumb = document.createElement("div");
  document.body.appendChild(containerBreadCrumb);
  containerBreadCrumb.id = "containerBreadCrumb";
  containerBreadCrumb.className = "container pt-4 ps-5";
  if(categoria === "Productos" || categoria === "Checkout" || categoria === "Ticket"){
    containerBreadCrumb.innerHTML = `
                                  <ol class="breadcrumb" style="--bs-breadcrumb-divider: '>';">
                                    <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">${categoria}</li>
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
  document.getElementById("cantCarrito").innerHTML = carrito.calcularCantTotalProductos();

  if(carrito.productos.length === 0){
    containerCarrito.innerHTML = `<p class="ms-4">El carrito está vacío.</p>`;
  }
  else{
    containerCarrito.innerHTML = "";
    containerCarrito.className = "container-fluid";

    for(const producto of carrito.productos){
      let row = document.createElement("div");
      row.id = `card-cart-${producto.id}`;
      row.className = "card-cart row mb-1 m-auto p-2 text-left position-relative";
      row.innerHTML = `
                        <div class="col-4 my-auto"><img class="card-cart-img" src="${producto.imgRoute}" alt="${producto.nombre}"></div>
                        <div class="col-8 p-0 lh-2 my-auto">
                          <p class="card-cart-text my-auto"><b>${producto.nombre}</b></p>
                          <p class="card-cart-text my-auto" id="card-${producto.id}-cantidad">Cantidad: ${producto.cantidad}</p>
                          <p class="card-cart-text my-auto">$${producto.precio.toLocaleString()}</p>
                        </div>
                      `;
      containerCarrito.append(row);
      row.appendChild(addButtonEliminarProducto(producto));
    }
    containerCarrito.innerHTML += `<div class="precio-total py-1"><h5><b id="precioTotal">TOTAL: $${carrito.calcularPrecioTotal().toLocaleString()}</b></h5></div>`;

    containerCarrito.append(addButtonVaciarCarrito());
    containerCarrito.append(addButtonCheckout());
  }
}

function mostrarCheckout(){
  breadCrumb("Checkout");

  let containerCheckout = document.createElement("div");
  containerCheckout.id = "containerCheckout";
  containerCheckout.className = "container";
  document.body.append(containerCheckout);
  containerCheckout.innerHTML = `
  <div class="row g-5">
      <div class="col-md-5 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Tu Carrito</span>
          <span class="badge bg-primary rounded-pill">${carrito.calcularCantTotalProductos()}</span>
        </h4>
        <ul class="list-group mb-3" id="listCheckout">
        </ul>
      </div>

      <div class="col-md-7">
        <h4 class="mb-3">Datos del Envío</h4>
        <form>
          <div class="row g-3">
            <div class="col-sm-6">
              <label for="nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="nombre" required>
            </div>
            <div class="col-sm-6">
              <label for="apellido" class="form-label">Apellido</label>
              <input type="text" class="form-control" id="apellido" required>
            </div>
            <div class="col-12">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" placeholder="nombre@ejemplo.com">
            </div>
            <div class="col-9">
              <label for="direccion" class="form-label">Dirección</label>
              <input type="text" class="form-control" id="direccion" placeholder="Calle 123, Ciudad, Provincia" required>
            </div>
            <div class="col-md-3">
              <label for="cp" class="form-label">Código Postal</label>
              <input type="text" class="form-control" id="cp" required>
            </div>
          </div><br>
          <hr class="my-4">

          <h4 class="mb-3">Forma de Pago</h4>
          <div class="my-3">
            <div class="form-check">
              <input id="credit" name="metodoPago" type="radio" class="form-check-input" checked required>
              <label class="form-check-label" for="credit">Tarjeta de Crédito</label>
            </div>
            <div class="form-check">
              <input id="debit" name="metodoPago" type="radio" class="form-check-input" required>
              <label class="form-check-label" for="debit">Tarjeta de Débito</label>
            </div>
          </div>
          <div class="row gy-3">
            <div class="col-md-6">
              <label for="cc-nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="cc-nombre" required>
              <small class="text-muted">Nombre como figura en la tarjeta</small>
            </div>
            <div class="col-md-6">
              <label for="cc-numero" class="form-label">Credit card number</label>
              <input type="text" class="form-control" id="cc-numero" placeholder="xxxx-xxxx-xxxx-xxxx" required>
            </div>
            <div class="col-md-3">
              <label for="cc-vencimiento" class="form-label">Vencimiento</label>
              <input type="text" class="form-control" id="cc-vencimiento" placeholder="mm/aa" required>
            </div>
            <div class="col-md-3">
              <label for="cc-cvv" class="form-label">CVV</label>
              <input type="text" class="form-control" id="cc-cvv" placeholder="xxx" required>
            </div>
          </div>

          <hr class="my-4">
          <button class="w-100 btn btn-primary btn-lg" type="submit" id="botonPagar">Finalizar Compra</button>
        </form>
      </div>
    </div>
  `; //Este formulario con datos de envio y pago no realiza ninguna comprobacion u accion ya que no esta incluido en el alcance de este proyecto.

  let listCheckout = document.getElementById("listCheckout");
  for (const producto of carrito.productos) {
    listCheckout.innerHTML += `
                              <li class="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                  <h6 class="my-0">${producto.nombre}</h6>
                                  <small class="text-muted">${producto.cantidad} x $${producto.precio.toLocaleString()}</small>
                                </div>
                                <span class="text-muted">$${producto.calcularPrecioTotalProducto().toLocaleString()}</span>
                              </li>
                              `;
    
  }

  listCheckout.innerHTML += `
                            <li class="list-group-item d-flex justify-content-between">
                              <span>Total (ARS$)</span>
                              <strong>$${carrito.calcularPrecioTotal().toLocaleString()}</strong>
                            </li>
                            `;
  listenerBotonPagar();
}

function mostrarTicket(){
  breadCrumb("Ticket");

  let containerTicket = document.createElement("div");
  containerTicket.id = "containerTicket";
  containerTicket.className = "container col-12";
  document.body.append(containerTicket);
  containerTicket.innerHTML = `<h3 class="my-4 text-success">Gracias por su compra!</h3><h5 class="my-2">Resumen:</h5>`;
  for(const producto of carrito.productos){
    let row = document.createElement("div");
    row.id = `card-ticket-${producto.id}`;
    row.className = "card-ticket row mb-1 m-auto p-2 text-left position-relative border rounded";
    row.innerHTML = `
                      <div class="col-2 my-auto"><img class="card-ticket-img m-2 ms-5" src="${producto.imgRoute}" alt="${producto.nombre}"></div>
                      <div class="col-10 p-0 lh-2 my-auto">
                        <p class="card-ticket-text my-auto"><b>${producto.nombre}</b></p>
                        <p class="card-ticket-text my-auto" id="card-${producto.id}-cantidad">Cantidad: ${producto.cantidad}</p>
                        <p class="card-ticket-text my-auto">$${producto.precio.toLocaleString()}</p>
                      </div>
                    `;
    containerTicket.append(row);
  }
  containerTicket.innerHTML += `<div class="precio-total py-1"><h5 class="my-2">TOTAL: $${carrito.calcularPrecioTotal().toLocaleString()}</h5></div>
                                <a href="index.html"><p class="text-end">Seguir comprando</p></a>
                                `;
  emptyCarrito();
  mostrarCarrito();
}

function clearScreen(){
  document.getElementById("containerIndex") && document.getElementById("containerIndex").remove();
  document.getElementById("containerBreadCrumb") && document.getElementById("containerBreadCrumb").remove();
  document.getElementById("searchResult") && document.getElementById("searchResult").remove();
  document.getElementById("containerProductos") && document.getElementById("containerProductos").remove();
  document.getElementById("containerCheckout") && document.getElementById("containerCheckout").remove();
}
//----------------------------------------------------------------------------------------------------------



//----AGREGAR-BOTONES---------------------------------------------------------------------------------------
function addButtonComprar(producto) {
  let botonComprar = document.createElement("button");
  botonComprar.id = `botonProducto-${producto.id}`;
  botonComprar.className = "btn btn-outline-primary position-absolute bottom-0 end-0 m-3";
  botonComprar.textContent = "Comprar";

  botonComprar.onclick = function () {
    carrito.agregarProducto(producto);
    saveCarrito(carrito);
    mostrarCarrito();

    Toastify({
      text: `"${producto.nombre}" agregado al carrito.`,
      duration: 1200,
      stopOnFocus: true,
      offset: {
        y: 75,
      },
      style: {
        background: "#484D51",
      },
    }).showToast();
  };

  return botonComprar;
}

function addButtonEliminarProducto(producto){
  let botonEliminarProducto = document.createElement("button");
  botonEliminarProducto.id = `botonEliminarProducto-${producto.id}`;
  botonEliminarProducto.className = "btn border-hidden w-auto position-absolute end-0 bottom-0 my-2 boton-eliminar-producto";
  botonEliminarProducto.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50" style=" fill:#212529;">
    <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z"></path>
    </svg>`;

  botonEliminarProducto.setAttribute("onclick", `eliminarProductoCarrito(${producto.id})`);

  return botonEliminarProducto;
}

function eliminarProductoCarrito(idProducto){
  let producto = carrito.productos.find((elemento) => elemento.id === idProducto);

  carrito.eliminarProducto(producto);
  saveCarrito();
  if(carrito.productos.length === 0){
    emptyCarrito();
  }

  mostrarCarrito();
}

function addButtonVaciarCarrito(){
  let botonVaciarCarrito = document.createElement("button");
  botonVaciarCarrito.id = `botonVaciarCarrito`;
  botonVaciarCarrito.className = "btn btn-light opacity-75 position-absolute bottom-0 start-0 m-3";
  botonVaciarCarrito.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="29" height="29" viewBox="0 0 50 50" style=" fill:#212529;">
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

function addButtonCheckout(){
  let botonCheckout = document.createElement("button");
  botonCheckout.id = `botonCheckout`;
  botonCheckout.className = "btn btn-light opacity-75 position-absolute bottom-0 end-0 m-3 p-2";
  botonCheckout.setAttribute("data-bs-toggle", "offcanvas");
  botonCheckout.setAttribute("data-bs-target", "#offcanvasNavbarLight");
  botonCheckout.textContent = "Finalizar Compra";

  botonCheckout.onclick = function () {
    mostrarCheckout();
  }

  return botonCheckout;
}

function listenerBotonPagar(){
  let botonPagar = document.getElementById("botonPagar");
  botonPagar.onclick = function () {
    mostrarTicket();
  }
}
//----------------------------------------------------------------------------------------------------------