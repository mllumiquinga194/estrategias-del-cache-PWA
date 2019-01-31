
// indexedDB: Reforzamiento
// Para crear una base de datos ('nombre', numero de version)
let request = window.indexedDB.open('mi-database', 1);

// se actualiza cuando se crea o se sube de version de la base de datos
request.onupgradeneeded = event => {
    console.log('Actuaizacion de la base de datos');

    // para obtener la base de datos
    let db = event.target.result;

    db.createObjectStore('heroes',{

        keyPath: 'id'
    });
    
}

// Manejo de errores
request.onerror = event => {

    console.log('DB Error: ', event.target.error);
    
};

// Insertar datos
request.onsuccess = event => {

    // Referencia a la base de datos
    let db = event.target.result;

    // Arreglo con la informacion que queremos postear a la DB
    let heroesData = [
        {id: '1111', heroe: 'SpiderMan', mensaje: 'Aquí su nuevo amigo'},
        {id: '2222', heroe: 'IronMan', mensaje: 'Aquí en mi nuevo Mark 50'}
    ];

    // Para grabar en la base de datos
    // ('Lugar a grabar', 'readwrite/readonly', )
    let heroesTransaction = db.transaction( 'heroes', 'readwrite' );

    // Para manejar el error de la transaccion
    heroesTransaction.onerror = event => {
        console.log('Error al guardar', event.target.error);
    };

    // Informa sobre el exito de la transaccon
    heroesTransaction.oncomplete = event => {
        console.log('Transaccion Hecha', event);
    };

    // ya tengo la transaccion y ahora necesito un objeto de esa transaccion
    let heroesStore = heroesTransaction.objectStore('heroes');

    for ( let heroe of heroesData ){
        heroesStore.add( heroe );
    }

    heroesStore.onsuccess = event => {
        console.log('nuevo item agregado a la base de datos');        
    };
    
};