
fetch('https://reqres.in/api/users/1000')
.then( resp => {

    //  si solicito un usuario que no existe, ej. 1000. la url si existe pero el usuario, por ende el catch no tomara este error. tenemos que manejarlo nosotros.
    if( resp.ok ){
        return resp.json();
    }else{
        throw new Error('No existe el usuario 1000');
    }
})
.then(console.log)
.catch( err => {
    console.log('Error en la petición');
    console.log(err);
})