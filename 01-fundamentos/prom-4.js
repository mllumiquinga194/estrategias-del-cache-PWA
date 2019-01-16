function sumarLento( numero ){
    return new Promise ( function( resolve, reject ){

        setTimeout( function(){
            resolve( numero + 1);
            // reject('Sumar lento Falló');
        }, 800);
    });
}

let sumarRapido = numero => {
    return new Promise( (resolve, reject) => {

        setTimeout( () => {
            // resolve( numero + 1 );
            reject( 'Sumar rápido falló' );
        }, 300);
    });
}

let cosas = [ sumarLento( 5 ), sumarRapido( 10 ) ]


//Pone a competir todo lo que yo le mando en sus argumentos, en este caso, promesas, y me devuelve la que primero responda. si responden dos al mismo tiempo, me devuelve la que este de primera a la derecha!!!
//Si alguna de esas promesas falla, TODO falla, pero si hay alguna que resolvio primero que alguna que haya fallado, entonces devuelve el resultado de la que se resolvio sin mostrar la falla
Promise.race( cosas )
.then( respuesta => {
    console.log( respuesta );
}).catch( console.log );

