// Initialize tilt effect on photo
VanillaTilt.init(document.querySelector(".photo-container"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
  })
  
  // Love button effect
  const loveButton = document.getElementById("love-button")
  loveButton.addEventListener("click", function () {
    this.classList.add("heartbeat")
  
    // Create floating hearts
    for (let i = 0; i < 15; i++) {
      createFloatingHeart()
    }
  
    // Remove animation class after animation completes
    setTimeout(() => {
      this.classList.remove("heartbeat")
    }, 1500)
  })
  
  // Create floating heart elements
  function createFloatingHeart() {
    const heart = document.createElement("div")
    heart.innerHTML = "❤️"
    heart.style.position = "fixed"
    heart.style.fontSize = Math.random() * 20 + 10 + "px"
    heart.style.left = Math.random() * window.innerWidth + "px"
    heart.style.top = window.innerHeight + "px"
    heart.style.opacity = Math.random() * 0.5 + 0.5
    heart.style.animation = `float ${Math.random() * 3 + 2}s ease-out forwards`
    heart.style.transform = `rotate(${Math.random() * 60 - 30}deg)`
    heart.style.zIndex = "1000"
  
    document.body.appendChild(heart)
  
    // Remove heart after animation
    setTimeout(() => {
      document.body.removeChild(heart)
    }, 5000)
  }
  
  // Initialize Three.js scenes
  let loveScene, loveCamera, loveRenderer
  let flowerScene, flowerCamera, flowerRenderer
  let photoBackgroundScene, photoBackgroundCamera, photoBackgroundRenderer
  let photoBottomScene, photoBottomCamera, photoBottomRenderer
  let heart,
    flowers = []
  const photoHearts = []
  let photoBouquet
  
  // Set up the 3D love scene
  function initLoveScene() {
    // Create scene
    loveScene = new THREE.Scene()
    loveScene.background = new THREE.Color(0xffe6f0)
  
    // Create camera
    loveCamera = new THREE.PerspectiveCamera(
      75,
      document.getElementById("love-scene").clientWidth / document.getElementById("love-scene").clientHeight,
      0.1,
      1000,
    )
    loveCamera.position.z = 5
  
    // Create renderer
    loveRenderer = new THREE.WebGLRenderer({ antialias: true })
    loveRenderer.setSize(
      document.getElementById("love-scene").clientWidth,
      document.getElementById("love-scene").clientHeight,
    )
    document.getElementById("love-scene").appendChild(loveRenderer.domElement)
  
    // Create heart
    const heartShape = new THREE.Shape()
  
    // Heart shape coordinates
    heartShape.moveTo(0, 0)
    heartShape.bezierCurveTo(0, -0.5, -1, -1.5, -2, -1.5)
    heartShape.bezierCurveTo(-3, -1.5, -3, 0, -3, 0)
    heartShape.bezierCurveTo(-3, 1, -2, 2, 0, 3)
    heartShape.bezierCurveTo(2, 2, 3, 1, 3, 0)
    heartShape.bezierCurveTo(3, 0, 3, -1.5, 2, -1.5)
    heartShape.bezierCurveTo(1, -1.5, 0, -0.5, 0, 0)
  
    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    }
  
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)
    const material = new THREE.MeshStandardMaterial({
      color: 0xff4081,
      metalness: 0.3,
      roughness: 0.4,
    })
  
    heart = new THREE.Mesh(geometry, material)
    heart.scale.set(0.5, 0.5, 0.5)
    loveScene.add(heart)
  
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    loveScene.add(ambientLight)
  
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    loveScene.add(pointLight)
  
    // Handle window resize
    window.addEventListener("resize", () => {
      loveCamera.aspect =
        document.getElementById("love-scene").clientWidth / document.getElementById("love-scene").clientHeight
      loveCamera.updateProjectionMatrix()
      loveRenderer.setSize(
        document.getElementById("love-scene").clientWidth,
        document.getElementById("love-scene").clientHeight,
      )
    })
  }
  
  // Set up the 3D flower scene
  function initFlowerScene() {
    // Create scene
    flowerScene = new THREE.Scene()
    flowerScene.background = new THREE.Color(0xf3e5f5)
  
    // Create camera
    flowerCamera = new THREE.PerspectiveCamera(
      75,
      document.getElementById("flower-scene").clientWidth / document.getElementById("flower-scene").clientHeight,
      0.1,
      1000,
    )
    flowerCamera.position.z = 10
  
    // Create renderer
    flowerRenderer = new THREE.WebGLRenderer({ antialias: true })
    flowerRenderer.setSize(
      document.getElementById("flower-scene").clientWidth,
      document.getElementById("flower-scene").clientHeight,
    )
    document.getElementById("flower-scene").appendChild(flowerRenderer.domElement)
  
    // Create flowers
    for (let i = 0; i < 5; i++) {
      createFlower(Math.random() * 8 - 4, Math.random() * 4 - 2, Math.random() * 4 - 6)
    }
  
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    flowerScene.add(ambientLight)
  
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    flowerScene.add(pointLight)
  
    // Handle window resize
    window.addEventListener("resize", () => {
      flowerCamera.aspect =
        document.getElementById("flower-scene").clientWidth / document.getElementById("flower-scene").clientHeight
      flowerCamera.updateProjectionMatrix()
      flowerRenderer.setSize(
        document.getElementById("flower-scene").clientWidth,
        document.getElementById("flower-scene").clientHeight,
      )
    })
  }
  
  // Set up the 3D photo background scene
  function initPhotoBackgroundScene() {
    // Create scene
    photoBackgroundScene = new THREE.Scene()
  
    // Create camera
    photoBackgroundCamera = new THREE.PerspectiveCamera(
      75,
      document.querySelector(".photo-section").clientWidth / document.querySelector(".photo-section").clientHeight,
      0.1,
      1000,
    )
    photoBackgroundCamera.position.z = 5
  
    // Create renderer with alpha
    photoBackgroundRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    photoBackgroundRenderer.setSize(
      document.querySelector(".photo-section").clientWidth,
      document.querySelector(".photo-section").clientHeight,
    )
    photoBackgroundRenderer.setClearColor(0x000000, 0) // transparent background
    document.getElementById("photo-background-scene").appendChild(photoBackgroundRenderer.domElement)
  
    // Create floating hearts
    for (let i = 0; i < 10; i++) {
      createBackgroundHeart(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * -3 - 2)
    }
  
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    photoBackgroundScene.add(ambientLight)
  
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    photoBackgroundScene.add(pointLight)
  
    // Handle window resize
    window.addEventListener("resize", () => {
      photoBackgroundCamera.aspect =
        document.querySelector(".photo-section").clientWidth / document.querySelector(".photo-section").clientHeight
      photoBackgroundCamera.updateProjectionMatrix()
      photoBackgroundRenderer.setSize(
        document.querySelector(".photo-section").clientWidth,
        document.querySelector(".photo-section").clientHeight,
      )
    })
  }
  
  // Set up the 3D photo bottom scene
  function initPhotoBottomScene() {
    // Create scene
    photoBottomScene = new THREE.Scene()
    photoBottomScene.background = new THREE.Color(0xfce4ec)
  
    // Create camera
    photoBottomCamera = new THREE.PerspectiveCamera(
      75,
      document.getElementById("photo-bottom-scene").clientWidth /
        document.getElementById("photo-bottom-scene").clientHeight,
      0.1,
      1000,
    )
    photoBottomCamera.position.z = 5
  
    // Create renderer
    photoBottomRenderer = new THREE.WebGLRenderer({ antialias: true })
    photoBottomRenderer.setSize(
      document.getElementById("photo-bottom-scene").clientWidth,
      document.getElementById("photo-bottom-scene").clientHeight,
    )
    document.getElementById("photo-bottom-scene").appendChild(photoBottomRenderer.domElement)
  
    // Create flower bouquet
    createFlowerBouquet(0, 0, 0)
  
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    photoBottomScene.add(ambientLight)
  
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    photoBottomScene.add(pointLight)
  
    // Handle window resize
    window.addEventListener("resize", () => {
      photoBottomCamera.aspect =
        document.getElementById("photo-bottom-scene").clientWidth /
        document.getElementById("photo-bottom-scene").clientHeight
      photoBottomCamera.updateProjectionMatrix()
      photoBottomRenderer.setSize(
        document.getElementById("photo-bottom-scene").clientWidth,
        document.getElementById("photo-bottom-scene").clientHeight,
      )
    })
  }
  
  // Create a flower
  function createFlower(x, y, z) {
    const flowerGroup = new THREE.Group()
  
    // Flower center
    const centerGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const centerMaterial = new THREE.MeshStandardMaterial({ color: 0xffeb3b })
    const center = new THREE.Mesh(centerGeometry, centerMaterial)
    flowerGroup.add(center)
  
    // Flower petals
    const petalColors = [0xff80ab, 0xf06292, 0xec407a, 0xe91e63, 0xd81b60]
  
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const petalGeometry = new THREE.ConeGeometry(0.4, 1.2, 16)
      const petalMaterial = new THREE.MeshStandardMaterial({
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        flatShading: true,
      })
  
      const petal = new THREE.Mesh(petalGeometry, petalMaterial)
      petal.position.set(Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0)
      petal.rotation.z = -angle
      petal.rotation.x = Math.PI / 2
      flowerGroup.add(petal)
    }
  
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 16)
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 })
    const stem = new THREE.Mesh(stemGeometry, stemMaterial)
    stem.position.y = -1.5
    flowerGroup.add(stem)
  
    // Position the flower
    flowerGroup.position.set(x, y, z)
    flowerGroup.rotation.x = Math.random() * 0.5 - 0.25
    flowerGroup.rotation.z = Math.random() * 0.5 - 0.25
  
    flowerScene.add(flowerGroup)
    flowers.push(flowerGroup)
  }
  
  // Create a background heart
  function createBackgroundHeart(x, y, z) {
    const heartShape = new THREE.Shape()
  
    // Heart shape coordinates
    heartShape.moveTo(0, 0)
    heartShape.bezierCurveTo(0, -0.5, -1, -1.5, -2, -1.5)
    heartShape.bezierCurveTo(-3, -1.5, -3, 0, -3, 0)
    heartShape.bezierCurveTo(-3, 1, -2, 2, 0, 3)
    heartShape.bezierCurveTo(2, 2, 3, 1, 3, 0)
    heartShape.bezierCurveTo(3, 0, 3, -1.5, 2, -1.5)
    heartShape.bezierCurveTo(1, -1.5, 0, -0.5, 0, 0)
  
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    }
  
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)
  
    // Random pink/red color
    const colors = [0xff80ab, 0xf06292, 0xec407a, 0xe91e63, 0xd81b60, 0xc2185b]
    const material = new THREE.MeshStandardMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      metalness: 0.3,
      roughness: 0.4,
    })
  
    const heartMesh = new THREE.Mesh(geometry, material)
  
    // Scale and position
    const scale = Math.random() * 0.2 + 0.1
    heartMesh.scale.set(scale, scale, scale)
    heartMesh.position.set(x, y, z)
  
    // Random rotation
    heartMesh.rotation.x = Math.random() * Math.PI
    heartMesh.rotation.y = Math.random() * Math.PI
    heartMesh.rotation.z = Math.random() * Math.PI
  
    photoBackgroundScene.add(heartMesh)
    photoHearts.push({
      mesh: heartMesh,
      rotSpeed: Math.random() * 0.02 + 0.01,
      floatSpeed: Math.random() * 0.01 + 0.005,
    })
  }
  
  // Create a flower bouquet
  function createFlowerBouquet(x, y, z) {
    photoBouquet = new THREE.Group()
  
    // Create multiple flowers in a bouquet arrangement
    const flowerCount = 7
    const flowerColors = [0xff80ab, 0xf06292, 0xec407a, 0xe91e63, 0xd81b60, 0xc2185b]
  
    for (let i = 0; i < flowerCount; i++) {
      const flowerGroup = new THREE.Group()
  
      // Flower center
      const centerGeometry = new THREE.SphereGeometry(0.3, 32, 32)
      const centerMaterial = new THREE.MeshStandardMaterial({ color: 0xffeb3b })
      const center = new THREE.Mesh(centerGeometry, centerMaterial)
      flowerGroup.add(center)
  
      // Flower petals
      const petalColor = flowerColors[Math.floor(Math.random() * flowerColors.length)]
  
      for (let j = 0; j < 8; j++) {
        const angle = (j / 8) * Math.PI * 2
        const petalGeometry = new THREE.ConeGeometry(0.25, 0.8, 16)
        const petalMaterial = new THREE.MeshStandardMaterial({
          color: petalColor,
          flatShading: true,
        })
  
        const petal = new THREE.Mesh(petalGeometry, petalMaterial)
        petal.position.set(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0)
        petal.rotation.z = -angle
        petal.rotation.x = Math.PI / 2
        flowerGroup.add(petal)
      }
  
      // Stem
      const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 16)
      const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 })
      const stem = new THREE.Mesh(stemGeometry, stemMaterial)
      stem.position.y = -1
      flowerGroup.add(stem)
  
      // Position each flower in the bouquet
      const angle = (i / flowerCount) * Math.PI * 2
      const radius = 0.7
      flowerGroup.position.set(Math.cos(angle) * radius * 0.7, Math.sin(angle) * radius + 0.5, Math.random() * 0.5 - 0.25)
  
      // Random rotation
      flowerGroup.rotation.x = Math.random() * 0.3 - 0.15
      flowerGroup.rotation.y = Math.random() * 0.3 - 0.15
      flowerGroup.rotation.z = Math.random() * 0.3 - 0.15
  
      photoBouquet.add(flowerGroup)
    }
  
    // Add ribbon
    const ribbonGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 100, 16)
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0xe91e63,
      metalness: 0.3,
      roughness: 0.4,
    })
    const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial)
    ribbon.position.y = -0.5
    ribbon.scale.set(0.8, 0.8, 0.8)
    photoBouquet.add(ribbon)
  
    // Position the entire bouquet
    photoBouquet.position.set(x, y, z)
    photoBouquet.rotation.x = -0.2 // Tilt forward slightly
  
    photoBottomScene.add(photoBouquet)
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate)
  
    // Animate heart
    if (heart) {
      heart.rotation.y += 0.01
      heart.position.y = Math.sin(Date.now() * 0.001) * 0.2
    }
  
    // Animate flowers
    flowers.forEach((flower, index) => {
      flower.rotation.y += 0.005 * ((index % 3) + 1)
      flower.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002
    })
  
    // Animate background hearts
    photoHearts.forEach((heart) => {
      heart.mesh.rotation.y += heart.rotSpeed
      heart.mesh.position.y += Math.sin(Date.now() * 0.001) * heart.floatSpeed
    })
  
    // Animate flower bouquet
    if (photoBouquet) {
      photoBouquet.rotation.y += 0.005
      photoBouquet.position.y = Math.sin(Date.now() * 0.0005) * 0.1
    }
  
    // Render scenes
    if (loveRenderer) loveRenderer.render(loveScene, loveCamera)
    if (flowerRenderer) flowerRenderer.render(flowerScene, flowerCamera)
    if (photoBackgroundRenderer) photoBackgroundRenderer.render(photoBackgroundScene, photoBackgroundCamera)
    if (photoBottomRenderer) photoBottomRenderer.render(photoBottomScene, photoBottomCamera)
  }
  
  // Initialize everything when the page loads
  window.addEventListener("load", () => {
    initLoveScene()
    initFlowerScene()
    initPhotoBackgroundScene()
    initPhotoBottomScene()
    animate()
  })
  
  
