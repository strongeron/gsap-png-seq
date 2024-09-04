console.log("Script started");

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 30; // Updated to 30 frames
const imagePrefix = 'https://strongeron.github.io/gsap-png-seq/images/';
let currentFormat = 'webp-combined'; // Default format

const getImagePath = (frameIndex) => {
    switch (currentFormat) {
        case 'png':
            return `${imagePrefix}png/${(frameIndex + 1).toString().padStart(4, '0')}.png`;
        case 'webp':
            return `${imagePrefix}webp/${(frameIndex + 1).toString().padStart(4, '0')}.webp`;
        case 'webp-combined':
            const quality = frameIndex < 18 ? 'high' : 'low';
            return `${imagePrefix}webp-combined/${quality}_${(frameIndex + 1).toString().padStart(4, '0')}.webp`;
        default:
            return `${imagePrefix}webp-combined/high_${(frameIndex + 1).toString().padStart(4, '0')}.webp`;
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

// Hide header elements by default
gsap.set("#additional-elements", { opacity: 0, y: -50 });

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the frame counter element
    const sequenceImg = document.getElementById('sequence');
    const frameCounter = document.getElementById('frame-counter');
    const formatSelector = document.getElementById('image-format');

    if (!sequenceImg || !frameCounter || !formatSelector) {
        console.error('Required elements not found');
        return;
    }

    // Create a GSAP timeline for image sequence animation
    const sequenceTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5, // Adjusted for smoother scrolling
            markers: true,
            ease: "none", // Linear animation for consistent frame rate
        }
    });

    // Animate the frame number
    sequenceTl.to({}, {
        duration: totalFrames, // Assuming 30 fps
        onUpdate: function() {
            const progress = this.progress();
            const frameIndex = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);
            updateFrame(frameIndex);
        }
    });

    // Create a separate ScrollTrigger for header elements
    ScrollTrigger.create({
        trigger: ".scroll-container",
        start: "top+=35% top",
        end: "bottom bottom",
        markers: true,
        onEnter: () => animateHeaderElements(true),
        onLeaveBack: () => animateHeaderElements(false)
    });

    console.log("Animation setup complete");
});

function animateHeaderElements(show) {
    const header = document.querySelector('#additional-elements');
    const duration = 0.5;

    console.log(`Animating header elements: ${show ? 'show' : 'hide'}`);

    gsap.to(header, {
        opacity: show ? 1 : 0,
        y: show ? 0 : -50,
        duration: duration,
        ease: "power2.inOut" // Smooth easing for header animation
    });
}

// Add this function to handle format changes
const changeFormat = (format) => {
    currentFormat = format;
    preloadImages();
    // Reset animation or update current frame
    const progress = sequenceTl.progress();
    const frameIndex = Math.floor(progress * totalFrames);
    updateFrame(frameIndex);
};

function updateFrame(frameIndex) {
    const imagePath = getImagePath(frameIndex);
    console.log("Updating frame:", frameIndex, "Image path:", imagePath);
    sequenceImg.src = imagePath;
    frameCounter.textContent = `Frame: ${frameIndex + 1} / ${totalFrames}`;
    console.log("Frame:", frameIndex + 1);
}

// Add event listener for format selector
document.getElementById('image-format').addEventListener('change', (e) => {
    console.log("Format changed to:", e.target.value);
    changeFormat(e.target.value);
});

// Initial preload
preloadImages();
