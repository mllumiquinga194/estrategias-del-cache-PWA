// Confirmar que podemos usar el SW
if( navigator.serviceWorker ){
    
    // Para registrar el SW. DEBE ESTAR SIEMPRE EN LA RAIZ
    navigator.serviceWorker.register('/sw.js');
}