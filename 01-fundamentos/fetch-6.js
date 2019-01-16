
//si la url esta mal, me regresaria un error 404 la cual no entraria en el catch, tendria que volver a preguntar por el resp.ok en este caso.
fetch('no-encontrado.html')
.then( resp => resp.text())
// un error en este then() si lo capturaria el catch
.then( html => {

    let body = document.querySelector('body');
    body.innerHTML = html;
})
.catch( err => {
    console.log('Error en la petición');
    console.log(err);
})