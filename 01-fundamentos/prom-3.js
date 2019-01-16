function retornaTrue(){
    return true;
}

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
            resolve( numero + 1 );
        }, 300);
    });
}

let cosas = [ sumarLento( 5 ), sumarRapido( 10 ), true, 'true', retornaTrue() ]

//Me devuelve un arreglo con las respuestas de todas las cosas que yo mande en sus argumentos.
//bien puede ser promesas, funciones normales, string, TODO!!

//Si alguna de esas promesas falla, TODO falla
Promise.all( cosas )
.then( respuestas => {
    console.log( respuestas );
}).catch( console.log );

// sumarLento( 5 ).then( console.log ); 
// sumarRapido( 10 ).then( console.log ); 