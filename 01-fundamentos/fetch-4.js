let img = document.querySelector('img');

// Lo importante es saber que puedo hacer fetch a recursos como imagenes o pdf y poderlo almacenar en cache del navegador para futuras lecturas!
fetch('superman.png')
.then( resp => resp.blob() ) // Hacer esto es lo mismo que hacer esto:
// .then( resp => {
//     return resp.blob;
// })
.then( imagen => {
    // URL.createObjectURL( imagen ) esta funcion me crea un url que sea valido para ponerlo como src o recurso en la etiqueta IMG de html.
    var imgPath = URL.createObjectURL( imagen );
    img.src = imgPath;
});