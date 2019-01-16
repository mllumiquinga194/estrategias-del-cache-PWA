function crearUsuario(data) {

    let usuario = {
        name: data.name,
        gender: data.gender
    }

    return fetch('https://reqres.in/api/users', {
        method: 'POST',
        body: JSON.stringify(usuario), // DATA
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( resp => resp.json());
}

//si la url esta mal, me regresaria un error 404 la cual no entraria en el catch, tendria que volver a preguntar por el resp.ok en este caso.
fetch('https://swapi.co/api/people/1/')
    .then(resp => resp.json())
    // un error en este then() si lo capturaria el catch
    .then( crearUsuario )//El parametro o argumento que recibe este THEN() se lo mando de una vez a la funcion crearUsuario() :). ES6 COMPADRE!!!!
    .then( console.log )
    .catch(err => {
        console.log('Error en la petición');
        console.log(err);
    });