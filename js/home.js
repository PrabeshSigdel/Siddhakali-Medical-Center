(function () {
    const track = document.getElementById('track');
    const thumbs = Array.from(document.querySelectorAll('.thumb'));
    const bar = document.getElementById('bar');
    const counter = document.getElementById('counter');

    if (!track || !bar || !counter) {
        return;
    }

    if (window.__homeCarouselTimer) {
        clearInterval(window.__homeCarouselTimer);
    }

    const total = thumbs.length || track.children.length;
    let current = 0;

    function goTo(index) {
        current = (index + total) % total;
        track.style.left = `-${current * 100}%`;
        
        if (thumbs.length) {
            thumbs.forEach((thumb, thumbIndex) => {
                thumb.classList.toggle('active', thumbIndex === current);
            });
        }
        
        bar.style.width = `${((current + 1) / total) * 100}%`;
        counter.textContent = `0${current + 1} / 0${total}`;
    }

    function startAutoSlide() {
        window.__homeCarouselTimer = setInterval(function () {
            goTo(current + 1);
        }, 4500);
    }

    function restartAutoSlide() {
        clearInterval(window.__homeCarouselTimer);
        startAutoSlide();
    }

    document.querySelectorAll('[id^="next"]').forEach(button => {
        button.addEventListener('click', function () {
            goTo(current + 1);
            restartAutoSlide();
        });
    });

    document.querySelectorAll('[id^="prev"]').forEach(button => {
        button.addEventListener('click', function () {
            goTo(current - 1);
            restartAutoSlide();
        });
    });

    if (thumbs.length) {
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', function () {
                goTo(index);
                restartAutoSlide();
            });
        });
    }

    goTo(0);
    startAutoSlide();
})();
