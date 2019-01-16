// Peticion GET
// https://reqres.in/api/users
// https://reqres.in/api/users

let usuario = {
    nombre: 'Marcos',
    edad: 27
}

fetch( 'https://reqres.in/api/users', {
    method: 'POST',
    body: JSON.stringify( usuario ), // DATA
    headers: {
        'Content-Type': 'application/json'
    }    
})
// como yo se que resp.json() es una promesa, puedo concatenar otro THEN()
.then( resp => resp.json())
.then( console.log )
.catch( err => {
    console.log( 'Error en la petición' );
    console.log( err );
});
