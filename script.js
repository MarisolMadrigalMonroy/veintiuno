var cartas = [];
var palos = ["spades", "hearts", "clubs", "diams"];
var numero = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var cartaDealer = []//var cartasJugador = [];
var cartaJugador = []//var cartasDealer = [];

var contadorCartas = 0;
var miDinero = 100;
var finDelJuego = false;

var mensaje = document.getElementById('mensaje'); //getElementById: El método devuelve el elemento que tiene el atributo ID con el valor especificado.
var impresion = document.getElementById('impresion');
var cartasDealer = document.getElementById('cartasDealer');
var cartasJugador = document.getElementById('cartasJugador');
var jValor = document.getElementById('jValor');
var dValor = document.getElementById('dValor');
var valorDinero = document.getElementById('dolares');

document.getElementById('apuesta').onchange = function() { //El atributo onchange se activa en el momento en que se cambia el valor del elemento.
  if (this.value < 0) { //this.value representa el valor seleccionado.
    this.value = 0;
  }
  if (this.value > miDinero) {
    this.value = miDinero;
  }
  mensaje.innerHTML = "Apuesta cambiada $" + this.value; //La propiedad Element.innerHTML devuelve o establece la sintaxis HTML describiendo los descendientes del elemento.
}

for (i in palos) {
  var palo = palos[i][0].toUpperCase();//El toUpperCase() método devuelve el valor convertido en mayúsculas de la cadena que realiza la llamada.
  var colorDeFondo = ( palo == "S" ||  palo == "C") ? "black" : "red";
  for (j in numero) {
    //impresion.innerHTML += "<span style='color:" + colorDeFondo + "'>&" + palos[i] + ";" + numero[j] + "</span> ";
    var valorDeLaCarta = (j > 9) ? 10 : parseInt(j) + 1; /*La función parseInt () analiza una cadena y devuelve un número entero.*/
    //var valorDeLaCarta = 1;
    var carta = {
      palo:palo,
      icon:palos[i],
      colorDeFondo:colorDeFondo,
      numeroDeLaCarta:numero[j],
      valorDeLaCarta:valorDeLaCarta
    }
    cartas.push(carta);
  }
}

//Función que se ejecuta cuando se da click en botón Iniciar
function Start() { 
  barajear(cartas); //Llama a la función "barajear" y envía el arreglo cartas
  nuevoJuego(); //Llama a la función "nuevoJuego"
  document.getElementById('start').style.display = 'none';
  valorDinero.innerHTML = miDinero; //La propiedad Element.innerHTML devuelve o establece la sintaxis HTML describiendo los descendientes del elemento.
}

//Limpia todo, comienza de cero
function nuevoJuego() {
  dValor.innerHTML = "?"; //La propiedad Element.innerHTML devuelve o establece la sintaxis HTML describiendo los descendientes del elemento.
  cartaJugador = [] //Limpiar los arreglos
  cartaDealer = []
  cartasDealer.innerHTML = ""; //La propiedad Element.innerHTML devuelve o establece la sintaxis HTML describiendo los descendientes del elemento.
  cartasJugador.innerHTML = "";//La propiedad Element.innerHTML devuelve o establece la sintaxis HTML describiendo los descendientes del elemento.
  var valorDeApuesta = document.getElementById('apuesta').value; //Toma el valor/monto de la apuesta
  miDinero=miDinero-valorDeApuesta; //Cada juego quita el valor que apuestas
  document.getElementById('dolares').innerHTML = miDinero; //A la variable dolares le asignas miDinero desde HTML
  document.getElementById('acciones').style.display = 'block'; //Despliega el bloque de acciones Mantener | Pedir | Duplicar
  mensaje.innerHTML = "Consigue hasta 21 y vence al dealer para ganar. <br> La apuesta actual es de $" + valorDeApuesta;
  document.getElementById('apuesta').disabled = true; //Mientras el juego está corriendo no puedes cambiar el monto.
  document.getElementById('montoMaximo').disabled = true; //Mientras el juego está corriendo no puedes dar click en botón monto máximo.
  cerrar(); //Llama a la función cerrar
  document.getElementById('terminar').style.display = 'none';
}

//Crea un nuevo juego para que no se repartan las cartas
function repartir() { 
  contadorCartas++; //Aumenta el contador de las cartas en cada juego
  /*Todavía se puede llevar un juego con 17 cartas
    Dealer: 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3 = 12 cartas
    Jugador: 4, 4, 4, 4, 5, 5 = 6 cartas. 
    Total 18 cartas
    52 cartas - 18 cartas = 34 cartas*/
  if (contadorCartas > 34) {
    console.log("NUEVA BARAJA");
    barajear(cartas); //Llamar a la función barajear cartas
    contadorCartas = 0; //Dejar el contador de cartas vacío
    mensaje.innerHTML = "Barajear de nuevo"; //Aparece en la página cuando rebasas las 34 cartas
  }
}


function cerrar() {
  //Da las primeras dos cartas para iniciar el juego, al dealer y al jugador.
  for (x = 0; x < 2; x++) {
    //Se le da una carta al dealer
    cartaDealer.push(cartas[contadorCartas]);
    //x te da la posición para dibujar la carta
    cartasDealer.innerHTML += figuraDeLaCarta(contadorCartas, x);
    /*si x está en cero eso significa que es la primer carta del dealer y por eso
    tenemos el '<div id="portada" style="left:100px;"></div>' que hace que la
    primera carta se vea boca abajo*/
    if (x == 0) {
      cartasDealer.innerHTML += '<div id="portada" style="left:100px;"></div>';
    }
    repartir(); //Llama a la función repartir
    cartaJugador.push(cartas[contadorCartas]); //Empuja una carta arreglo del jugador
    cartasJugador.innerHTML += figuraDeLaCarta(contadorCartas, x); //Le da la posición según x
    repartir(); //Llama a la función repartir
  }
  var acumuladoJugador = checktotal(cartaJugador); //Llama a la función checktotal
  if (acumuladoJugador == 21 && cartaJugador.length == 2) {
    terminarDeJugar(); //Llama a la función terminar de jugar
  }
  jValor.innerHTML = acumuladoJugador; //Muestra en pantalla cuánto tiene cada jugador
}

function figuraDeLaCarta(j, x) {
  var hpos  = (x > 0) ? x * 80 + 100 : 100;
  return '<div class="icard ' + cartas[j].icon + '" style="left:' + hpos  + 'px;">  <div class="top-card palo">' + cartas[j].numeroDeLaCarta + '<br></div>  <div class="content-card palo"></div>  <div class="bottom-card palo">' + cartas[j].numeroDeLaCarta + '<br></div> </div>';
}

function montoMaximo() {
  document.getElementById('apuesta').value = miDinero;
  mensaje.innerHTML = "Apuesta cambiada $" + miDinero;
}

function accionDeLaCarta(a) {
  console.log(a);
  switch (a) {
    case 'pedir':
      nuevaCarta(); // agregar una nueva carta a la mano del jugador
      break;
    case 'mantener':
      terminarDeJugar(); // jugar todas y calcular
      break;
    case 'duplicar':
      var valorDeApuesta = parseInt(document.getElementById('apuesta').value);
      if ((miDinero-valorDeApuesta) < 0) {
        valorDeApuesta = valorDeApuesta + miDinero;
        miDinero=0;
      } else {
        miDinero= miDinero-valorDeApuesta;
        valorDeApuesta = valorDeApuesta * 2;
      }
      document.getElementById('dolares').innerHTML = miDinero;
      document.getElementById('apuesta').value=valorDeApuesta;
      nuevaCarta(); // agregar una nueva carta a la mano del jugador
      terminarDeJugar(); // jugar todas y calcular
      break;
    default:
      console.log('terminado');
      terminarDeJugar(); // jugar todas y calcular
  }
}
/*Sabe cuando pierdes por pedir más cartas */
function nuevaCarta() {
  cartaJugador.push(cartas[contadorCartas]);
  cartasJugador.innerHTML += figuraDeLaCarta(contadorCartas, (cartaJugador.length - 1));
  repartir();
  var valorDeRetorno = checktotal(cartaJugador);
  jValor.innerHTML = valorDeRetorno;
  if (valorDeRetorno > 21) {
    mensaje.innerHTML = "perdiste!";
    terminarDeJugar();
  }
}

function terminarDeJugar() {
  finDelJuego = true;
  document.getElementById('portada').style.display = 'none';/*Si configura style.display = 'none', oculta todo el elemento, mientras que visibility:hidden significa que el contenido del elemento será invisible, pero el elemento permanece en su posición y tamaño originales. */
  document.getElementById('acciones').style.display = 'none';
  document.getElementById('terminar').style.display = 'block';
  document.getElementById('apuesta').disabled = false;
  document.getElementById('montoMaximo').disabled = false;
  mensaje.innerHTML = "Juego terminado<br>";
  var ganancias = 1;
  var valorDeLaCasa = checktotal(cartaDealer);
  dValor.innerHTML = valorDeLaCasa;
  /*Si el valor de la casa es menor a 17 entonces el dealer va a intentar ganar
  y pedir más cartas*/
  while (valorDeLaCasa < 17) {
    cartaDealer.push(cartas[contadorCartas]);
    cartasDealer.innerHTML += figuraDeLaCarta(contadorCartas, (cartaDealer.length - 1));
    repartir();
    valorDeLaCasa = checktotal(cartaDealer);
    dValor.innerHTML = valorDeLaCasa;
  }

  //¿Quién ganó?
  var acumuladoJugador = checktotal(cartaJugador);
  if (acumuladoJugador == 21 && cartaJugador.length == 2) {
    mensaje.innerHTML = "Jugador veintiuno";
    ganancias = 1.5;
  }

  /*valorDeApuesta sabe quién fue el ganador y por cuánto */
  var valorDeApuesta = parseInt(document.getElementById('apuesta').value) * ganancias;
  if ((acumuladoJugador < 22 && valorDeLaCasa < acumuladoJugador) || (valorDeLaCasa > 21 && acumuladoJugador < 22)) {
    mensaje.innerHTML += '<span style="color:green;">Tú ganasté +$' + valorDeApuesta + '</span>';
    miDinero= miDinero+ (valorDeApuesta * 2);
  } else if (acumuladoJugador > 21) {
    mensaje.innerHTML += '<span style="color:red;">El dealer ganó. Tú perdisté -$' + valorDeApuesta + '</span>';
  } else if (acumuladoJugador == valorDeLaCasa) {
    mensaje.innerHTML += '<span style="color:blue;">EMPATE. La casa gana.</span>';
    miDinero= miDinero+ valorDeApuesta;
  } else {
    mensaje.innerHTML += '<span style="color:red;">El dealer ganó. Tú perdisté -$' + valorDeApuesta + '</span>';
  }
  jValor.innerHTML = acumuladoJugador;
  valorDinero.innerHTML = miDinero;
}

//Función que regresa el "marcador"
/*Esta función regresa el valor del marcador, la carta original del as vale
1, pero si se encuentra en la partida se le da el valor de 10 hasta que sea +21
entonces se convierte en un 1 por ejemplo pasa de 22 a 12, el as vale 1 */
function checktotal(arregloDeCartas) {
  var retorno = 0;
  var valorDelAs = false;
  for (var i in arregloDeCartas) {
    if (arregloDeCartas[i].numeroDeLaCarta == 'A' && !valorDelAs) {
      valorDelAs = true;
      retorno = retorno + 10; 
    }
    retorno = retorno + arregloDeCartas[i].valorDeLaCarta;
  }

  if (valorDelAs && retorno > 21) {
    retorno = retorno - 10;
  }
  return retorno;
}

//Función que "revuelve" las cartas, con el parámetro cartas
function barajear(arreglo) { 
  /* Los arreglos son índice cero, por lo tanto el "arreglo" de cartas va de 0 a 51, son 52 cartas,
  entonces, length va de 1 a 52, es índice 1, por lo cual al quitarte 1 hacemos que sea 51 y al 
  hacerlo >=0 hacemos que llegué hasta 0 y recorra todas las cartas. */
  for (var i = arreglo.length - 1; i >= 0; i--) {
    /* Para asegurarnos que pasará a través de todas las cartas
    floor toma el valor y lo redondea hacia abajo, entonces si hay un 39.99 se va a 39, por lo que,
    51.99 es 51, queda en la última carta y esa carta la intercambia con la que se encuentra en la 
    posición del valor random. Y al disminuir el contador de i aseguramos que vaya de 51 hacia 0 en orden.*/
    var j = Math.floor(Math.random() * (i + 1)); 
    /* Hacemos un intercambio de variables para intercambiar los valores del arreglo y así 
    mezclar las cartas */
    var aux = arreglo[i];
    arreglo[i] = arreglo[j];
    arreglo[j] = aux;
  }
  return arreglo;
}

function impresionCard() {
  impresion.innerHTML += "<span style='color:" + cartas[contadorCartas].colorDeFondo + "'>" + cartas[contadorCartas].numeroCarta + "&" + cartas[contadorCartas].icon + ";</span>  ";
}