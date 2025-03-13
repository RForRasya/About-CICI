// Initialize tilt effect on photo
VanillaTilt.init(document.querySelector(".photo-container"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
});

// Love button effect
const loveButton = document.getElementById('love-button');
loveButton.addEventListener('click', function() {
    this.classList.add('heartbeat');
    
    // Create floating hearts
    for (let i = 0; i < 15; i++) {
        createFloatingHeart();
    }
    
    // Remove animation class after animation completes
    setTimeout(() => {
        this.classList.remove('heartbeat');
    }, 1500);
});

// Create floating heart elements
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.opacity = Math.random() * 0.5 + 0.5;
    heart.style.animation = `float ${Math.random() * 3 + 2}s ease-out forwards`;
    heart.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
    heart.style.zIndex = '1000';
    
    document.body.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        document.body.removeChild(heart);
    }, 5000);
}

// Initialize Three.js scenes
let loveScene, loveCamera, loveRenderer;
let flowerScene, flowerCamera, flowerRenderer;
let heart, flowers = [];

// Set up the 3D love scene
function initLoveScene() {
    // Create scene
    loveScene = new THREE.Scene();
    loveScene.background = new THREE.Color(0xffe6f0);
    
    // Create camera
    loveCamera = new THREE.PerspectiveCamera(75, document.getElementById('love-scene').clientWidth / document.getElementById('love-scene').clientHeight, 0.1, 1000);
    loveCamera.position.z = 5;
    
    // Create renderer
    loveRenderer = new THREE.WebGLRenderer({ antialias: true });
    loveRenderer.setSize(document.getElementById('love-scene').clientWidth, document.getElementById('love-scene').clientHeight);
    document.getElementById('love-scene').appendChild(loveRenderer.domElement);
    
    // Create heart
    const heartShape = new THREE.Shape();
    
    // Heart shape coordinates
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.5, -1, -1.5, -2, -1.5);
    heartShape.bezierCurveTo(-3, -1.5, -3, 0, -3, 0);
    heartShape.bezierCurveTo(-3, 1, -2, 2, 0, 3);
    heartShape.bezierCurveTo(2, 2, 3, 1, 3, 0);
    heartShape.bezierCurveTo(3, 0, 3, -1.5, 2, -1.5);
    heartShape.bezierCurveTo(1, -1.5, 0, -0.5, 0, 0);
    
    const extrudeSettings = {
        depth: 0.5,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1
    };
    
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xff4081,
        metalness: 0.3,
        roughness: 0.4
    });
    
    heart = new THREE.Mesh(geometry, material);
    heart.scale.set(0.5, 0.5, 0.5);
    loveScene.add(heart);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    loveScene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    loveScene.add(pointLight);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        loveCamera.aspect = document.getElementById('love-scene').clientWidth / document.getElementById('love-scene').clientHeight;
        loveCamera.updateProjectionMatrix();
        loveRenderer.setSize(document.getElementById('love-scene').clientWidth, document.getElementById('love-scene').clientHeight);
    });
}

// Set up the 3D flower scene
function initFlowerScene() {
    // Create scene
    flowerScene = new THREE.Scene();
    flowerScene.background = new THREE.Color(0xf3e5f5);
    
    // Create camera
    flowerCamera = new THREE.PerspectiveCamera(75, document.getElementById('flower-scene').clientWidth / document.getElementById('flower-scene').clientHeight, 0.1, 1000);
    flowerCamera.position.z = 10;
    
    // Create renderer
    flowerRenderer = new THREE.WebGLRenderer({ antialias: true });
    flowerRenderer.setSize(document.getElementById('flower-scene').clientWidth, document.getElementById('flower-scene').clientHeight);
    document.getElementById('flower-scene').appendChild(flowerRenderer.domElement);
    
    // Create flowers
    for (let i = 0; i < 5; i++) {
        createFlower(
            Math.random() * 8 - 4,
            Math.random() * 4 - 2,
            Math.random() * 4 - 6
        );
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    flowerScene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    flowerScene.add(pointLight);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        flowerCamera.aspect = document.getElementById('flower-scene').clientWidth / document.getElementById('flower-scene').clientHeight;
        flowerCamera.updateProjectionMatrix();
        flowerRenderer.setSize(document.getElementById('flower-scene').clientWidth, document.getElementById('flower-scene').clientHeight);
    });
}

// Create a flower
function createFlower(x, y, z) {
    const flowerGroup = new THREE.Group();
    
    // Flower center
    const centerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    flowerGroup.add(center);
    
    // Flower petals
    const petalColors = [0xff80ab, 0xf06292, 0xec407a, 0xe91e63, 0xd81b60];
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const petalGeometry = new THREE.ConeGeometry(0.4, 1.2, 16);
        const petalMaterial = new THREE.MeshStandardMaterial({ 
            color: petalColors[Math.floor(Math.random() * petalColors.length)],
            flatShading: true
        });
        
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.set(
            Math.cos(angle) * 0.8,
            Math.sin(angle) * 0.8,
            0
        );
        petal.rotation.z = -angle;
        petal.rotation.x = Math.PI / 2;
        flowerGroup.add(petal);
    }
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1.5;
    flowerGroup.add(stem);
    
    // Position the flower
    flowerGroup.position.set(x, y, z);
    flowerGroup.rotation.x = Math.random() * 0.5 - 0.25;
    flowerGroup.rotation.z = Math.random() * 0.5 - 0.25;
    
    flowerScene.add(flowerGroup);
    flowers.push(flowerGroup);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Animate heart
    if (heart) {
        heart.rotation.y += 0.01;
        heart.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    // Animate flowers
    flowers.forEach((flower, index) => {
        flower.rotation.y += 0.005 * (index % 3 + 1);
        flower.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
    });
    
    // Render scenes
    if (loveRenderer) loveRenderer.render(loveScene, loveCamera);
    if (flowerRenderer) flowerRenderer.render(flowerScene, flowerCamera);
}

// Initialize everything when the page loads
window.addEventListener('load', () => {
    initLoveScene();
    initFlowerScene();
    animate();
});