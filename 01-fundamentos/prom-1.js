function sumarUno(numero, callback) {

    if (numero === 6) {
        callback('Numero muy alto');
        return;
    }

    setTimeout(function () {
        callback(null, numero + 1);
    }, 800);
}

sumarUno(5, function (err, nuevoValor) {

    if (err) {
        console.log(err);
        return

    }

    sumarUno(nuevoValor, function (err, nuevoValor2) {

        if (err) {
            console.log(err);
            return

        }

        console.log(nuevoValor2);

    });

});
