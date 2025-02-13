document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("canvasCredits");
    var ctx = canvas.getContext("2d");

    var creditsPositionY = canvas.height;  // Ajusta la posición inicial de los créditos al final del canvas

    function drawCredits() {
        // Limpia el canvas en cada cuadro para evitar superposiciones
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#2b2b2b");
        gradient.addColorStop(1, "#1a1a1a");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "30px 'Press Start 2P', cursive";
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.textAlign = "center";

        // Actualiza la posición Y de los créditos en cada cuadro
        creditsPositionY -= 0.5;

        // Dibuja los créditos con la nueva posición Y
        ctx.fillText("👾Equipo PixelQuest👾", canvas.width / 2, 50 + creditsPositionY);
        ctx.font = "20px 'Roboto', sans-serif";
        ctx.fillText("- Gerardo Castañeda Martin", canvas.width / 2, 90 + creditsPositionY);
        ctx.fillText("- Ana Paulina Martinez Luevano", canvas.width / 2, 130 + creditsPositionY);
        ctx.fillText("- Michael Giovanny Miguel Padilla", canvas.width / 2, 170 + creditsPositionY);
        ctx.fillText("- Ahylin Aketzali Castorena Rodriguez", canvas.width / 2, 210 + creditsPositionY);
        ctx.fillText("- Michelle Monsterrat Gomez Lopez", canvas.width / 2, 250 + creditsPositionY);

        ctx.fillText("Información Académica:", canvas.width / 2, 320 + creditsPositionY);
        ctx.fillText("- Universidad: Universidad Autonoma de Aguascalientes", canvas.width / 2, 360 + creditsPositionY);
        ctx.fillText("- Carrera: Ingenieria en Sistemas Computacionales", canvas.width / 2, 400 + creditsPositionY);
        ctx.fillText("- Semestre: 6", canvas.width / 2, 440 + creditsPositionY);

        ctx.fillText("Otros Detalles:", canvas.width / 2, 510 + creditsPositionY);
        ctx.fillText("- Fecha: 09/03/2024", canvas.width / 2, 550 + creditsPositionY);
        ctx.fillText("- Ciudad: Aguascalientes", canvas.width / 2, 590 + creditsPositionY);

        // Restaura la posición inicial cuando los créditos salen del canvas
        if (creditsPositionY < -590) {
            creditsPositionY = canvas.height;
        }

        // Llama a la función en el siguiente cuadro de animación
        requestAnimationFrame(drawCredits);
    }

    // Llama a la función para iniciar la animación
    drawCredits();
});
