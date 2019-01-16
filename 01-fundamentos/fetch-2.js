// Peticion GET
// https://reqres.in/api/users

fetch( 'https://reqres.in/api/users' )
.then( resp => resp.json())
.then( resObj => console.log( resObj ) );

// Prueba
//  Con esta prueba lo que estoy haciendo es traerme todo el codigo HTML de https://www.wikipedia.org y copiarlo en mi pagina.
// fetch( 'https://www.wikipedia.org' )
// .then( resp => resp.text() )
// .then( html => {

//     console.log( html );
//     document.open();
//     document.write( html );
//     document.close();
    
// });