function toggleContent(button) {
    var content = button.previousElementSibling;
    content.classList.toggle("expanded");

    if (content.classList.contains("expanded")) {
        button.textContent = "Leer menos";
    } else {
        button.textContent = "Leer más";
    }
}