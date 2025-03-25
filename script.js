let currentIndex = 0;

const images = document.querySelectorAll('.carousel-images img');
const totalImages = images.length;

function showSlide(index) {
    const carouselImages = document.querySelector('.carousel-images');
    const offset = index * -100; // -100% para mover a imagem
    carouselImages.style.transform = `translateX(${offset}%)`;
}

function moveSlide(direction) {
    currentIndex = (currentIndex + direction + totalImages) % totalImages;
    showSlide(currentIndex);
}

// Iniciar o slideshow com um intervalo automático
setInterval(() => {
    moveSlide(1);
}, 5000); // Muda a imagem a cada 5 segundos
