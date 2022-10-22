var fila = "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td class='delete'></td></tr>";
var productos = null;
function codigoCat(catstr) {
  var code = "null";
  switch (catstr) {
    case "electronicos":
      code = "c1";
      break;
    case "joyeria":
      code = "c2";
      break;
    case "caballeros":
      code = "c3";
      break;
    case "damas":
      code = "c4";
      break;
  }
  return code;
}
var orden = 0;

function listarProductos(productos) {
  var precio = document.getElementById("price");
  precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
  var num = productos.length;
  var listado = document.getElementById("listado");
  var ids, titles, prices, descriptions, categories, fotos, deletes;
  var tbody = document.getElementById("tbody"),
    nfila = 0;
  tbody.innerHTML = "";
  var catcode;
  for (i = 0; i < num; i++) tbody.innerHTML += fila;
  var tr;
  ids = document.getElementsByClassName("id");
  titles = document.getElementsByClassName("title");
  descriptions = document.getElementsByClassName("description");
  categories = document.getElementsByClassName("category");
  fotos = document.getElementsByClassName("foto");
  prices = document.getElementsByClassName("price");
  deletes = document.getElementsByClassName("delete");
  if (orden === 0) {
    orden = -1;
    precio.innerHTML = "Precio";
  } else if (orden == 1) {
    ordenarAsc(productos, "price");
    precio.innerHTML = "Precio A";
    precio.style.color = "darkgreen";
  } else if (orden == -1) {
    ordenarDesc(productos, "price");
    precio.innerHTML = "Precio D";
    precio.style.color = "blue";
  }

  listado.style.display = "block";
  for (nfila = 0; nfila < num; nfila++) {
    ids[nfila].innerHTML = productos[nfila].id;
    titles[nfila].innerHTML = productos[nfila].title;
    descriptions[nfila].innerHTML = productos[nfila].description;
    categories[nfila].innerHTML = productos[nfila].category;
    catcode = codigoCat(productos[nfila].category);
    tr = categories[nfila].parentElement;
    tr.setAttribute("class", catcode);
    prices[nfila].innerHTML = "$" + productos[nfila].price;
    fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
    fotos[nfila].firstChild.setAttribute("onclick", "window.open('" + productos[nfila].image + "');");
    deletes[nfila].innerHTML = "<button type='button' onclick=eliminar(" + productos[nfila].id + ")>Eliminar</button>";
  }
}

function obtenerProductos() {
  fetch("https://api-generator.retool.com/Mr4pNk/productos")
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      productos.forEach((producto) => {
        producto.price = parseFloat(producto.price);
      });
      listarProductos(data);
    });
}

function ordenarDesc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return -1;
    if (a[p_key] < b[p_key]) return 1;
    return 0;
  });
}

function ordenarAsc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return 1;
    if (a[p_key] < b[p_key]) return -1;
    return 0;
  });
}

function checking(element) {
  var classCheck;
  if (element.id == "c1") {
    classCheck = "c1";
  } else {
    if (element.id == "c2") {
      classCheck = "c2";
    } else {
      if (element.id == "c3") {
        classCheck = "c3";
      } else {
        if (element.id == "c4") {
          classCheck = "c4";
        }
      }
    }
  }
  var rows = document.getElementsByClassName(classCheck);
  if (element.checked) {
    for (let index = 0; index < rows.length; index++) {
      rows[index].style.display = "table-row";
    }
  } else {
    for (let index = 0; index < rows.length; index++) {
      rows[index].style.display = "none";
    }
  }
}
function eliminar(id) {
  var url = "https://api-generator.retool.com/Mr4pNk/productos/" + id;
  fetch(url, { method: "DELETE" })
    .then((response) => response.json())
    .then((data) => {
      orden = 0;
      obtenerProductos();
    });
}
function insertarProducto() {
  var data = {
    title: document.getElementById("nombre-i").value,
    price: document.getElementById("precio-i").value,
    description: document.getElementById("desc-i").value,
    image: document.getElementById("foto-i").value,
    category: document.getElementById("foto-i").value,
  };
  fetch("https://api-generator.retool.com/Mr4pNk/productos", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json)
    .then((data) => {
      document.getElementById("insert-form").reset();
      orden = 0;
      obtenerProductos();
    });
}

//curl -X POST -H 'Content-Type: application/json' -d '{"key":"value"}' https://api-generator.retool.com/Mr4pNk/productos
