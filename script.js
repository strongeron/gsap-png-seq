console.log("Script started");

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 120;
const triggerFrame = 35;
const fps = 120; // Frames per second from Blender export
const duration = totalFrames / fps; // Duration of the animation in seconds
const imagePrefix = 'https://strongeron.github.io/gsap-png-seq/images/';
const imageExtension = '.png';

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

// Add this near the top of your file
let lastTime = 0;
let frameCount = 0;
const fpsElement = document.getElementById('fps-counter');

// Add this function
function updateFPS(currentTime) {
    frameCount++;
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime);
        fpsElement.textContent = `FPS: ${fps}`;
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(updateFPS);
}

// Start the FPS counter
requestAnimationFrame(updateFPS);

// Modify your existing animation code to update more frequently
sequenceTl.to({}, {
    duration: duration,
    onUpdate: function() {
        const progress = this.progress();
        const frameIndex = Math.round(progress * (totalFrames - 1));
        document.getElementById('sequence').src = imagePaths[frameIndex];
    },
    onUpdateParams: ["{self}"],
    ease: "none"
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

console.log("Animation setup complete");
