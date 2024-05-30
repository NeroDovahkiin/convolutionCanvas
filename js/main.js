
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {

                pintarImagen(img)
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");
const canvas4 = document.getElementById("canvas4");
const canvas5 = document.getElementById("canvas5");
const canvas6 = document.getElementById("canvas6");
const canvas7 = document.getElementById("canvas7");
const canvas8 = document.getElementById("canvas8");
const canvas9 = document.getElementById("canvas9");
const canvas10 = document.getElementById("canvas10");
const canvas11 = document.getElementById("canvas11");
const canvas12 = document.getElementById("canvas12");
const canvas13 = document.getElementById("canvas13");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");
const ctx4 = canvas4.getContext("2d");
const ctx5 = canvas5.getContext("2d");
const ctx6 = canvas6.getContext("2d");
const ctx7 = canvas7.getContext("2d");
const ctx8 = canvas8.getContext("2d");
const ctx9 = canvas9.getContext("2d");
const ctx10 = canvas10.getContext("2d");
const ctx11 = canvas11.getContext("2d");
const ctx12 = canvas12.getContext("2d");
const ctx13 = canvas13.getContext("2d");

function pintarImagen(image) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    removeRed();
    removeBlue();
    removeGreen();
    removeAlpha();


    // Núcleo, Kernel detección de bordes
    const kernelBordes = [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1]
    ];

    // Núcleo, Kernel para enfocar
    const kernelFocus = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ];

    // Núcleo, Kernel para repujado, Embossed
    const kernelRepujado = [
        [-2, -1, 0],
        [-1, 1, 1],
        [0, 1, 2]
    ];

    // Núcleo, Kernel para repujado, Embossed
    const kernelBlur = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];

    // Detección de bordes
    convolucion(kernelBordes, canvas, canvas6);
    paintText(canvas6.getContext("2d"), "border detection");
    // Kernel de enfoque
    convolucion(kernelFocus, canvas, canvas7);
    paintText(canvas7.getContext("2d"), "Focus Kernel");
    // embossed
    convolucion(kernelRepujado, canvas, canvas8);
    paintText(canvas8.getContext("2d"), "Embossed Kernel");
    // Blur
    convolucionBlur(kernelBlur, canvas, canvas9);
    paintText(canvas9.getContext("2d"), "Blur Kernel");

    // Detección de bordes rgb
    convolucionColor(kernelBordes, canvas, canvas10);
    paintText(canvas10.getContext("2d"), "border detection");
    // Kernel de enfoque rgb
    convolucionColor(kernelFocus, canvas, canvas11);
    paintText(canvas11.getContext("2d"), "Focus Kernel");
    // embossed rgb
    convolucionColor(kernelRepujado, canvas, canvas12);
    paintText(canvas12.getContext("2d"), "Embossed Kernel");
    // Blur rgb
    convolucionColorBlur(kernelBlur, canvas, canvas13);
    paintText(canvas13.getContext("2d"), "Blur Kernel");
};


const removeRed = () => {

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 0; // remove red color from each pixel
    }
    ctx2.putImageData(imageData, 0, 0);
    paintText(ctx2, "remove Red channel");
};

const removeGreen = () => {

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i + 1] = 0;
    }
    ctx3.putImageData(imageData, 0, 0);
    paintText(ctx3, "remove Green channel");
};

const removeBlue = () => {

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i + 2] = 0;
    }
    ctx4.putImageData(imageData, 0, 0);
    paintText(ctx4, "remove Blue channel");
};

const removeAlpha = () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = 127;
    }
    ctx5.putImageData(imageData, 0, 0);
    paintText(ctx5, "Alpha 50%");
};

// pintar Texto en el canvas
function paintText(context, text) {
    context.fillStyle = "white";
    context.font = "bold 20px Arial Black";
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.fillText(text, (canvas.width / 2), (canvas.height - 10));
    context.strokeText(text, (canvas.width / 2), (canvas.height - 10));
}


function convolucion(kernel, canvasFuente, canvasDestino) {

    const ctxFuente = canvasFuente.getContext("2d");
    const imgDataFuente = ctxFuente.getImageData(0, 0, canvasFuente.width, canvasFuente.height);
    const pixelesFuente = imgDataFuente.data;

    canvasDestino.width = canvasFuente.width;
    canvasDestino.height = canvasFuente.height;

    const ctxDestino = canvasDestino.getContext("2d");
    const imgDataDestino = ctxDestino.getImageData(0, 0, canvasDestino.width, canvasDestino.height);
    const pixelesDestino = imgDataDestino.data;

    for (var i = 1; i < canvasFuente.height - 1; i++) {
        for (var j = 1; j < canvasFuente.width - 1; j++) {

            // posición en el arreglo js (idx es indice de x)
            var idx = ((i * canvasFuente.width) + j) * 4;

            //Casilla 1 (idx es indice para la multiplicacion)
            //var idxMult = (((i-1) * canvasFuente.width) + (j-1)) * 4;
            var casilla1 = kernel[0][0] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j - 1)) * 4];
            var casilla2 = kernel[0][1] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j)) * 4];
            var casilla3 = kernel[0][2] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j + 1)) * 4];
            var casilla4 = kernel[1][0] * pixelesFuente[(((i) * canvasFuente.width) + (j - 1)) * 4];
            var casilla5 = kernel[1][1] * pixelesFuente[(((i) * canvasFuente.width) + (j)) * 4];
            var casilla6 = kernel[1][2] * pixelesFuente[(((i) * canvasFuente.width) + (j + 1)) * 4];
            var casilla7 = kernel[2][0] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j - 1)) * 4];
            var casilla8 = kernel[2][1] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j)) * 4];
            var casilla9 = kernel[2][2] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j + 1)) * 4];

            const resultado = casilla1 + casilla2 + casilla3 + casilla4 + casilla5 + casilla6 + casilla7 + casilla8 + casilla9;

            /*
            pixelesDestino[idx] = pixelesFuente[idx]; // red
            pixelesDestino[idx + 1] = pixelesFuente[idx + 1]; // green
            pixelesDestino[idx + 2] = pixelesFuente[idx + 2]; // blue
            pixelesDestino[idx + 3] = pixelesFuente[idx + 3]; // alpha
            */

            pixelesDestino[idx] = resultado;
            pixelesDestino[idx + 1] = resultado;
            pixelesDestino[idx + 2] = resultado;
            pixelesDestino[idx + 3] = 255;
        }
    }
    ctxDestino.putImageData(imgDataDestino, 0, 0);
}

function convolucionBlur(kernel, canvasFuente, canvasDestino) {

    const ctxFuente = canvasFuente.getContext("2d");
    const imgDataFuente = ctxFuente.getImageData(0, 0, canvasFuente.width, canvasFuente.height);
    const pixelesFuente = imgDataFuente.data;

    canvasDestino.width = canvasFuente.width;
    canvasDestino.height = canvasFuente.height;

    const ctxDestino = canvasDestino.getContext("2d");
    const imgDataDestino = ctxDestino.getImageData(0, 0, canvasDestino.width, canvasDestino.height);
    const pixelesDestino = imgDataDestino.data;

    for (var i = 1; i < canvasFuente.height - 1; i++) {
        for (var j = 1; j < canvasFuente.width - 1; j++) {

            // posición en el arreglo js (idx es indice de x)
            var idx = ((i * canvasFuente.width) + j) * 4;

            var casilla1 = kernel[0][0] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j - 1)) * 4];
            var casilla2 = kernel[0][1] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j)) * 4];
            var casilla3 = kernel[0][2] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j + 1)) * 4];
            var casilla4 = kernel[1][0] * pixelesFuente[(((i) * canvasFuente.width) + (j - 1)) * 4];
            var casilla5 = kernel[1][1] * pixelesFuente[(((i) * canvasFuente.width) + (j)) * 4];
            var casilla6 = kernel[1][2] * pixelesFuente[(((i) * canvasFuente.width) + (j + 1)) * 4];
            var casilla7 = kernel[2][0] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j - 1)) * 4];
            var casilla8 = kernel[2][1] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j)) * 4];
            var casilla9 = kernel[2][2] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j + 1)) * 4];

            const resultado = (casilla1 + casilla2 + casilla3 + casilla4 + casilla5 + casilla6 + casilla7 + casilla8 + casilla9) / 9;

            pixelesDestino[idx] = resultado;
            pixelesDestino[idx + 1] = resultado;
            pixelesDestino[idx + 2] = resultado;
            pixelesDestino[idx + 3] = 255;
        }
    }
    ctxDestino.putImageData(imgDataDestino, 0, 0);
}

function convolucionColor(kernel, canvasFuente, canvasDestino) {

    const ctxFuente = canvasFuente.getContext("2d");
    const imgDataFuente = ctxFuente.getImageData(0, 0, canvasFuente.width, canvasFuente.height);
    const pixelesFuente = imgDataFuente.data;

    canvasDestino.width = canvasFuente.width;
    canvasDestino.height = canvasFuente.height;

    const ctxDestino = canvasDestino.getContext("2d");
    const imgDataDestino = ctxDestino.getImageData(0, 0, canvasDestino.width, canvasDestino.height);
    const pixelesDestino = imgDataDestino.data;

    for (var i = 1; i < canvasFuente.height - 1; i++) {
        for (var j = 1; j < canvasFuente.width - 1; j++) {

            // posición en el arreglo js (idx es indice de x)
            var idx = ((i * canvasFuente.width) + j) * 4;

            var casilla1_R = kernel[0][0] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j - 1)) * 4];
            var casilla2_R = kernel[0][1] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j)) * 4];
            var casilla3_R = kernel[0][2] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j + 1)) * 4];
            var casilla4_R = kernel[1][0] * pixelesFuente[(((i) * canvasFuente.width) + (j - 1)) * 4];
            var casilla5_R = kernel[1][1] * pixelesFuente[(((i) * canvasFuente.width) + (j)) * 4];
            var casilla6_R = kernel[1][2] * pixelesFuente[(((i) * canvasFuente.width) + (j + 1)) * 4];
            var casilla7_R = kernel[2][0] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j - 1)) * 4];
            var casilla8_R = kernel[2][1] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j)) * 4];
            var casilla9_R = kernel[2][2] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j + 1)) * 4];

            const resultadoR = (casilla1_R + casilla2_R + casilla3_R + casilla4_R + casilla5_R + casilla6_R + casilla7_R + casilla8_R + casilla9_R);

            var casilla1_G = kernel[0][0] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j - 1)) * 4 + 1];
            var casilla2_G = kernel[0][1] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j)) * 4 + 1];
            var casilla3_G = kernel[0][2] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j + 1)) * 4 + 1];
            var casilla4_G = kernel[1][0] * pixelesFuente[(((i) * canvasFuente.width) + (j - 1)) * 4 + 1];
            var casilla5_G = kernel[1][1] * pixelesFuente[(((i) * canvasFuente.width) + (j)) * 4 + 1];
            var casilla6_G = kernel[1][2] * pixelesFuente[(((i) * canvasFuente.width) + (j + 1)) * 4 + 1];
            var casilla7_G = kernel[2][0] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j - 1)) * 4 + 1];
            var casilla8_G = kernel[2][1] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j)) * 4 + 1];
            var casilla9_G = kernel[2][2] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j + 1)) * 4 + 1];

            const resultadoG = (casilla1_G + casilla2_G + casilla3_G + casilla4_G + casilla5_G + casilla6_G + casilla7_G + casilla8_G + casilla9_G);

            var casilla1_B = kernel[0][0] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j - 1)) * 4 + 2];
            var casilla2_B = kernel[0][1] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j)) * 4 + 2];
            var casilla3_B = kernel[0][2] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j + 1)) * 4 + 2];
            var casilla4_B = kernel[1][0] * pixelesFuente[(((i) * canvasFuente.width) + (j - 1)) * 4 + 2];
            var casilla5_B = kernel[1][1] * pixelesFuente[(((i) * canvasFuente.width) + (j)) * 4 + 2];
            var casilla6_B = kernel[1][2] * pixelesFuente[(((i) * canvasFuente.width) + (j + 1)) * 4 + 2];
            var casilla7_B = kernel[2][0] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j - 1)) * 4 + 2];
            var casilla8_B = kernel[2][1] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j)) * 4 + 2];
            var casilla9_B = kernel[2][2] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j + 1)) * 4 + 2];

            const resultadoB = (casilla1_B + casilla2_B + casilla3_B + casilla4_B + casilla5_B + casilla6_B + casilla7_B + casilla8_B + casilla9_B);

            pixelesDestino[idx] = resultadoR;
            pixelesDestino[idx + 1] = resultadoG;
            pixelesDestino[idx + 2] = resultadoB;
            pixelesDestino[idx + 3] = 255;
        }
    }
    ctxDestino.putImageData(imgDataDestino, 0, 0);
}


function convolucionColorBlur(kernel, canvasFuente, canvasDestino) {

    const ctxFuente = canvasFuente.getContext("2d");
    const imgDataFuente = ctxFuente.getImageData(0, 0, canvasFuente.width, canvasFuente.height);
    const pixelesFuente = imgDataFuente.data;

    canvasDestino.width = canvasFuente.width;
    canvasDestino.height = canvasFuente.height;

    const ctxDestino = canvasDestino.getContext("2d");
    const imgDataDestino = ctxDestino.getImageData(0, 0, canvasDestino.width, canvasDestino.height);
    const pixelesDestino = imgDataDestino.data;

    for (var i = 1; i < canvasFuente.height - 1; i++) {
        for (var j = 1; j < canvasFuente.width - 1; j++) {

            // posición en el arreglo js (idx es indice de x)
            var idx = ((i * canvasFuente.width) + j) * 4;

            var casilla1_R = kernel[0][0] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j - 1)) * 4];
            var casilla2_R = kernel[0][1] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j)) * 4];
            var casilla3_R = kernel[0][2] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j + 1)) * 4];
            var casilla4_R = kernel[1][0] * pixelesFuente[(((i) * canvasFuente.width) + (j - 1)) * 4];
            var casilla5_R = kernel[1][1] * pixelesFuente[(((i) * canvasFuente.width) + (j)) * 4];
            var casilla6_R = kernel[1][2] * pixelesFuente[(((i) * canvasFuente.width) + (j + 1)) * 4];
            var casilla7_R = kernel[2][0] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j - 1)) * 4];
            var casilla8_R = kernel[2][1] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j)) * 4];
            var casilla9_R = kernel[2][2] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j + 1)) * 4];

            const resultadoR = (casilla1_R + casilla2_R + casilla3_R + casilla4_R + casilla5_R + casilla6_R + casilla7_R + casilla8_R + casilla9_R) / 9;

            var casilla1_G = kernel[0][0] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j - 1)) * 4 + 1];
            var casilla2_G = kernel[0][1] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j)) * 4 + 1];
            var casilla3_G = kernel[0][2] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j + 1)) * 4 + 1];
            var casilla4_G = kernel[1][0] * pixelesFuente[(((i) * canvasFuente.width) + (j - 1)) * 4 + 1];
            var casilla5_G = kernel[1][1] * pixelesFuente[(((i) * canvasFuente.width) + (j)) * 4 + 1];
            var casilla6_G = kernel[1][2] * pixelesFuente[(((i) * canvasFuente.width) + (j + 1)) * 4 + 1];
            var casilla7_G = kernel[2][0] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j - 1)) * 4 + 1];
            var casilla8_G = kernel[2][1] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j)) * 4 + 1];
            var casilla9_G = kernel[2][2] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j + 1)) * 4 + 1];

            const resultadoG = (casilla1_G + casilla2_G + casilla3_G + casilla4_G + casilla5_G + casilla6_G + casilla7_G + casilla8_G + casilla9_G) / 9;

            var casilla1_B = kernel[0][0] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j - 1)) * 4 + 2];
            var casilla2_B = kernel[0][1] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j)) * 4 + 2];
            var casilla3_B = kernel[0][2] * pixelesFuente[(((i - 1) * canvasFuente.width) + (j + 1)) * 4 + 2];
            var casilla4_B = kernel[1][0] * pixelesFuente[(((i) * canvasFuente.width) + (j - 1)) * 4 + 2];
            var casilla5_B = kernel[1][1] * pixelesFuente[(((i) * canvasFuente.width) + (j)) * 4 + 2];
            var casilla6_B = kernel[1][2] * pixelesFuente[(((i) * canvasFuente.width) + (j + 1)) * 4 + 2];
            var casilla7_B = kernel[2][0] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j - 1)) * 4 + 2];
            var casilla8_B = kernel[2][1] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j)) * 4 + 2];
            var casilla9_B = kernel[2][2] * pixelesFuente[(((i + 1) * canvasFuente.width) + (j + 1)) * 4 + 2];

            const resultadoB = (casilla1_B + casilla2_B + casilla3_B + casilla4_B + casilla5_B + casilla6_B + casilla7_B + casilla8_B + casilla9_B) / 9;

            pixelesDestino[idx] = resultadoR;
            pixelesDestino[idx + 1] = resultadoG;
            pixelesDestino[idx + 2] = resultadoB;
            pixelesDestino[idx + 3] = 255;
        }
    }
    ctxDestino.putImageData(imgDataDestino, 0, 0);
}