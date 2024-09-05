console.log("Script started");

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 31; // 0000 to 0030
const imagePrefix = 'https://strongeron.github.io/gsap-png-seq/images/';
let currentFormat = 'dynamic';
let frameQuality = [];

const getImagePath = (frameIndex) => {
    const paddedIndex = frameIndex.toString().padStart(4, '0');
    switch (currentFormat) {
        case 'png':
            return `${imagePrefix}png/${paddedIndex}.png`;
        case 'webp':
            return `${imagePrefix}webp/${paddedIndex}.webp`;
        case 'dynamic':
            return frameQuality[frameIndex] || `${imagePrefix}webp-combined/low/${paddedIndex}.webp`;
        default:
            return `${imagePrefix}webp-combined/low/${paddedIndex}.webp`;
    }
};

const determineFrameQualities = async () => {
    frameQuality = [];
    for (let i = 0; i < totalFrames; i++) {
        const paddedIndex = i.toString().padStart(4, '0');
        const highPngPath = `${imagePrefix}webp-combined/high/${paddedIndex}.png`;
        const lowWebpPath = `${imagePrefix}webp-combined/low/${paddedIndex}.webp`;
        
        console.log(`Checking high PNG for frame ${i}: ${highPngPath}`);
        try {
            const highPngResponse = await fetch(highPngPath, { method: 'HEAD' });
            if (highPngResponse.ok) {
                console.log(`High PNG found for frame ${i}`);
                frameQuality[i] = highPngPath;
                continue;
            }
        } catch (error) {
            console.log(`High PNG frame ${i} not found, using low WebP`);
        }
        
        console.log(`Using low WebP for frame ${i}: ${lowWebpPath}`);
        frameQuality[i] = lowWebpPath;
    }
    console.log("Frame qualities:", frameQuality);
};

const preloadImages = () => {
    console.log("Preloading images for format:", currentFormat);
    for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = getImagePath(i);
        console.log("Preloading:", img.src);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const sequenceImg = document.getElementById('sequence');
    const frameCounter = document.getElementById('frame-counter');
    const formatSelector = document.getElementById('image-format');

    if (!sequenceImg || !frameCounter || !formatSelector) {
        console.error('Required elements not found');
        return;
    }

    await determineFrameQualities();

    function updateFrame(frameIndex) {
        const imagePath = getImagePath(frameIndex);
        console.log("Updating frame:", frameIndex, "Image path:", imagePath);
        sequenceImg.src = imagePath;
        frameCounter.textContent = `Frame: ${frameIndex + 1} / ${totalFrames}`;
    }

    function changeFormat(format) {
        console.log("Changing format to:", format);
        currentFormat = format;
        if (format === 'dynamic') {
            determineFrameQualities().then(() => {
                preloadImages();
                const progress = sequenceTl.progress();
                const frameIndex = Math.floor(progress * (totalFrames - 1));
                updateFrame(frameIndex);
            });
        } else {
            preloadImages();
            const progress = sequenceTl.progress();
            const frameIndex = Math.floor(progress * (totalFrames - 1));
            updateFrame(frameIndex);
        }
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
        duration: totalFrames - 1,
        onUpdate: function() {
            const progress = this.progress();
            const frameIndex = Math.min(Math.floor(progress * (totalFrames - 1)), totalFrames - 1);
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
