 let currentStream;
        let autoCaptureInterval; // Variable para almacenar el intervalo de captura automática

        // Obtener el elemento de video y solicitar acceso a la cámara web
        const visor = document.getElementById('visor');
        const capturarBoton = document.getElementById('capturar');
        const capturarAuto10Boton = document.getElementById('capturarAuto10');
        const cambiarCamaraBoton = document.getElementById('cambiarCamara');
        const galeria = document.getElementById('galeria');
        const refreshPageButton = document.getElementById('refreshPageButton');

        async function iniciarCamara() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } });
                visor.srcObject = stream;
                currentStream = stream;
            } catch (error) {
                console.error('Error al acceder a la cámara: ', error);
            }
        }

        // Función para cambiar la cámara
        async function cambiarCamara() {
            if (currentStream) {
                currentStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 1920, height: 1080 } });
                visor.srcObject = stream;
                currentStream = stream;
            } catch (error) {
                console.error('Error al cambiar la cámara: ', error);
            }
        }

        // Función para capturar una imagen con calidad personalizada
        function capturarImagen() {
            // Ajustar el tamaño del canvas para la captura en alta resolución
            const canvas = document.createElement('canvas');
            canvas.width = 1920; // Resolución deseada
            canvas.height = 1080; // Resolución deseada
            const ctx = canvas.getContext('2d');
            ctx.drawImage(visor, 0, 0, canvas.width, canvas.height);

            // Convertir la imagen a base64 con calidad personalizada
            const imagenDataUrl = canvas.toDataURL('image/jpeg', 0.9); // Cambia el valor 0.9 al nivel de calidad deseado (entre 0 y 1)

            // Crear una nueva imagen para la galería
            const nuevaImagen = document.createElement('img');
            nuevaImagen.src = imagenDataUrl;
            nuevaImagen.classList.add('imagen-galeria');

            // Agregar la imagen a la galería
            galeria.appendChild(nuevaImagen);

            // Agregar un evento de clic a la imagen para descargarla al hacer clic
            nuevaImagen.addEventListener('click', () => {
                descargarImagen(imagenDataUrl);
            });
        }

        // Función para descargar la imagen al hacer clic en la galería
        function descargarImagen(dataUrl) {
            const enlaceDescarga = document.createElement('a');
            enlaceDescarga.href = dataUrl;
            enlaceDescarga.download = 'captura.png';
            enlaceDescarga.style.display = 'none';
            document.body.appendChild(enlaceDescarga);
            enlaceDescarga.click();
            document.body.removeChild(enlaceDescarga);
        }
     // Función para realizar la captura automática 10 veces con un retraso inicial de 3 segundos
        function capturarAuto10() {
            setTimeout(function () {
                for (let i = 0; i < 10; i++) {
                    setTimeout(capturarImagen, i * 3000); // Capturar cada 3 segundos (3000 ms)
                }
            }, 3000); // Retraso inicial de 3 segundos (3000 ms)
        }

        // Llamar a la función para iniciar la cámara cuando se carga la página
        window.addEventListener('load', iniciarCamara);

        // Agregar eventos a los botones
        capturarBoton.addEventListener('click', capturarImagen);
        capturarAuto10Boton.addEventListener('click', capturarAuto10);
        cambiarCamaraBoton.addEventListener('click', cambiarCamara);

        // Agregar evento de clic para el botón de recarga
        refreshPageButton.addEventListener('click', function () {
            location.reload(); // Recargar la página
        });