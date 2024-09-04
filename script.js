console.log("Script started");

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 30;
const imagePrefix = 'https://strongeron.github.io/gsap-png-seq/images/';
let currentFormat = 'webp-combined';

const getImagePath = (frameIndex) => {
    const paddedIndex = frameIndex.toString().padStart(4, '0');
    switch (currentFormat) {
        case 'png':
            return `${imagePrefix}png/${paddedIndex}.png`;
        case 'webp':
            return `${imagePrefix}webp/${paddedIndex}.webp`;
        case 'webp-combined':
            const quality = frameIndex < 18 ? 'high' : 'low';
            return `${imagePrefix}webp-combined/${quality}/${paddedIndex}.webp`;
        default:
            return `${imagePrefix}webp-combined/high/${paddedIndex}.webp`;
    }
};

const preloadImages = () => {
    console.log("Preloading images for format:", currentFormat);
    for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = getImagePath(i);
        console.log("Preloading:", img.src);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const sequenceImg = document.getElementById('sequence');
    const frameCounter = document.getElementById('frame-counter');
    const formatSelector = document.getElementById('image-format');

    if (!sequenceImg || !frameCounter || !formatSelector) {
        console.error('Required elements not found');
        return;
    }

    function updateFrame(frameIndex) {
        const imagePath = getImagePath(frameIndex);
        console.log("Updating frame:", frameIndex, "Image path:", imagePath);
        sequenceImg.src = imagePath;
        frameCounter.textContent = `Frame: ${frameIndex + 1} / ${totalFrames}`;
    }

    function changeFormat(format) {
        console.log("Changing format to:", format);
        currentFormat = format;
        preloadImages();
        const progress = sequenceTl.progress();
        const frameIndex = Math.floor(progress * totalFrames);
        updateFrame(frameIndex);
    }

    const sequenceTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            markers: true,
        }
    });

    sequenceTl.to({}, {
        duration: totalFrames,
        onUpdate: function() {
            const progress = this.progress();
            const frameIndex = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);
            updateFrame(frameIndex);
        }
    });

    formatSelector.addEventListener('change', (e) => {
        changeFormat(e.target.value);
    });

    // Set initial frame
    updateFrame(0);

    preloadImages();
});

console.log("Script loaded");
