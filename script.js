console.log("Script started");

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 30; // Updated to 30 frames
const triggerFrame = 10; // Adjusted for 30 frames, you can fine-tune this
const fps = 30; // Adjusted for 30 frames
const duration = totalFrames / fps; // Duration of the animation in seconds
const imagePrefix = 'https://strongeron.github.io/gsap-png-seq/images/';
const imageExtension = '.webp'; // Changed to .webp

const imagePaths = Array.from({ length: totalFrames }, (_, i) => 
    `${imagePrefix}${(i + 1).toString().padStart(4, '0')}${imageExtension}`
);

console.log("Image paths created:", imagePaths[0], "...", imagePaths[imagePaths.length - 1]);

// Preload images
const preloadImages = () => {
    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
};

preloadImages();
console.log("Images preloaded");

// Hide header elements by default
gsap.set("#additional-elements", { opacity: 0, y: -50 });

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the frame counter element
    const frameCounter = document.getElementById('frame-counter');
    const sequenceImg = document.getElementById('sequence');

    if (!frameCounter || !sequenceImg) {
        console.error('Frame counter or sequence image element not found');
        return;
    }

    // Create a GSAP timeline for image sequence animation
    const sequenceTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1, // This controls the smoothness of the animation. Adjust as needed.
            markers: true // This adds visual markers for debugging. Remove in production.
        }
    });

    // Animate the frame number
    sequenceTl.to({}, {
        duration: duration,
        onUpdate: function() {
            const progress = this.progress();
            const frameIndex = Math.round(progress * (totalFrames - 1));
            sequenceImg.src = imagePaths[frameIndex];
            frameCounter.textContent = `Frame: ${frameIndex + 1} / ${totalFrames}`;
            console.log("Frame:", frameIndex + 1);
        }
    });

    // Create a separate ScrollTrigger for header elements
    ScrollTrigger.create({
        trigger: ".scroll-container",
        start: `top+=${triggerFrame / totalFrames * 100}% top`,
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
        ease: show ? "power2.out" : "power2.in"
    });
}
