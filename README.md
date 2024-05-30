
# Image filters and Convolutions

Este proyecto, lo realizé para entender un poco sobre las redes neuronales convolucionales (CNN) y la aplicación de operaciones de convolución utilizando Kernels sobre la matriz de pixeles de una imagen.
Los kernels utilizados son matrices de 3x3 y los canvas resultantes, tienen 1 pixel menos en cada borde para facilitar el cálculo.

Las operaciones de convolución se aplican primero sobre todos los canales por igual, resultando en imagenes en escala de grises, y luego si se realizan las operaciones sobre cada canal RGBA para un resultado a color.

Esta práctica se realizó utilizando vanilla JS y Canvas HTML.

Al obtener un array unidimensional de la API de Canvas, debemos realizar una traducción de la posición de los pixeles desde la posición que tendrían en la matriz del Canvas, que sería una matriz (Canvas.ancho * Canvas.alto) al vector obtenido de la propiedad ctx.getImageData.data de Canvas.

La fórmula para calcular la posición en el vector es la siguiente:
>        índice = ((i * canvasFuente.width) + j) * 4;

Donde i y j son las posiciones de cada pixel, al realizar un recorrido por la matriz del canvas, ignorando los pixels del borde, por lo que iniciaremos el ciclo for en 1 para ambos casos, y el 4 es para desplazar 4 posiciones, debido a que en el vector tenemos en orden los canales de rojo, verde, azul y opacidad, RGBA respectivamente.

![example of convolution](https://miro.medium.com/v2/resize:fit:720/format:webp/1*-OM6jQTMNACDX2vAh_lvMQ.png)

![example of convolution](https://github.com/NeroDovahkiin/convolutionCanvas/blob/master/img/example.png)

### LIVE DEMO:
[Github pages demo](https://nerodovahkiin.github.io/convolutionCanvas/)
