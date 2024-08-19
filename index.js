//logica por parte del cliente y la interaccion con Socket.io



const socket = io();//cliente r ecibe el evento-Se actualiza la tabla en Html con la info de prod recibidos

socket.on('productos', productos => {

  const tbody = document.getElementById('Productos-body');

  tbody.innerHTML = '';



  productos.forEach(producto => {

    const row = tbody.insertRow();

    row.innerHTML = `

    

    <td>${producto._id}</td>

    <td>${producto.title}</td>

    <td>${producto.description}</td>

    <td>${producto.price}</td>

    <td>${producto.code}</td>

    <td>${producto.stock}</td>

    <td>${producto.category}</td>

    <td>${producto.status ? 'Activo' : 'Desactivo'}</td>

    <td>${producto.thumbnail.length > 0 ? producto.thumbnail[0] : 'No existe la imagen'}</td>

    



    `;

  });

})



const form = document.getElementById('Prod-Form');

//se capturan los valores del formulario y crea un objeto con esos datos

form.addEventListener('submit', function (event) {

  event.preventDefault();



  const title = document.getElementById('title').value

  const description = document.getElementById('description').value

  const price = document.getElementById('price').value

  const code = document.getElementById('code').value

  const stock = document.getElementById('stock').value

  const category = document.getElementById('category').value





  const producto = {

    title: title,

    description: description,

    price: price,

    code: code,

    stock: stock,

    category: category

  };

  // emision de evento de "Agregar producto" hacia el servidor con la info del nuevo producto a agregar

  socket.emit('agregarProducto', producto);



});