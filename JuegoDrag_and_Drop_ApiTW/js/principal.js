function PlayAudio() {
    var audio = document.getElementById('musicaFondo');
    audio.volume = 0.1; // Establece el volumen al 50%
    audio.play();
}


function PauseAudio(){
    document.getElementById('musicaFondo').pause();
}