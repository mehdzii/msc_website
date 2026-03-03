/* global THREE */

function initThreeBg() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
    container.appendChild(renderer.domElement);

    // COLORS
    let themeColors = {
        light: {
            shapes: 0x1E88E5, // MSC Club Blue
            particles: 0x42A5F5,
            symbols: '#1E88E5'
        },
        dark: {
            shapes: 0x64B5F6, // Light Blue
            particles: 0x42A5F5,
            symbols: '#64B5F6'
        }
    };

    // Check initial theme from body attribute
    let currentTheme = document.body.getAttribute('data-bs-theme') || 'light';
    let colors = themeColors[currentTheme];

    // GROUPS
    const shapesGroup = new THREE.Group();
    const symbolsGroup = new THREE.Group();
    scene.add(shapesGroup);
    scene.add(symbolsGroup);

    // MATERIALS
    let shapeMaterial = new THREE.MeshBasicMaterial({
        color: colors.shapes,
        wireframe: true,
        transparent: true,
        opacity: currentTheme === 'light' ? 0.3 : 0.6
    });

    // 1. Shapes
    const sphereGeo = new THREE.SphereGeometry(6, 16, 16);
    const sphere = new THREE.Mesh(sphereGeo, shapeMaterial);
    sphere.position.set(-18, 5, -10);
    shapesGroup.add(sphere);

    const torusGeo = new THREE.TorusGeometry(5, 1.5, 16, 50);
    const torus = new THREE.Mesh(torusGeo, shapeMaterial);
    torus.position.set(20, -6, -5);
    shapesGroup.add(torus);

    const boxGeo = new THREE.BoxGeometry(6, 6, 6);
    const box = new THREE.Mesh(boxGeo, shapeMaterial);
    box.position.set(15, 12, -15);
    shapesGroup.add(box);

    const dodecaGeo = new THREE.DodecahedronGeometry(4);
    const dodeca = new THREE.Mesh(dodecaGeo, shapeMaterial);
    dodeca.position.set(-20, -12, -8);
    shapesGroup.add(dodeca);

    // 2. Math Symbols (Sprites)
    const mathSymbols = ['π', '∫', 'Σ', 'λ', 'φ', 'Δ', '∞', '∇', 'θ', '∑'];

    function createSymbolSprite(symbol, colorStr) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = colorStr;
        ctx.font = 'bold 72px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: currentTheme === 'light' ? 0.25 : 0.7
        });
        return new THREE.Sprite(spriteMat);
    }

    let symbolSprites = [];
    for (let i = 0; i < 25; i++) {
        const sym = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
        const sprite = createSymbolSprite(sym, colors.symbols);
        sprite.position.set(
            (Math.random() - 0.5) * 70,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 40 - 10
        );
        const scale = Math.random() * 2 + 1.5;
        sprite.scale.set(scale, scale, 1);
        symbolsGroup.add(sprite);
        symbolSprites.push({ obj: sprite, text: sym });
    }

    // 3. Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 500;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 120;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    let particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: colors.particles,
        transparent: true,
        opacity: currentTheme === 'light' ? 0.3 : 0.7,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMaterial);
    scene.add(particlesMesh);

    // 4. Parallax setup (Removed per user request to keep models static)

    // Handle Theme Change
    window.addEventListener('themeChanged', (e) => {
        currentTheme = e.detail.theme;
        colors = themeColors[currentTheme];

        // Update Shapes
        shapeMaterial.color.setHex(colors.shapes);
        shapeMaterial.opacity = currentTheme === 'light' ? 0.3 : 0.6;

        // Update Particles
        particlesMaterial.color.setHex(colors.particles);
        particlesMaterial.opacity = currentTheme === 'light' ? 0.3 : 0.7;

        // Update Symbols
        symbolSprites.forEach(item => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = colors.symbols;
            ctx.font = 'bold 72px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.text, 64, 64);
            const texture = new THREE.CanvasTexture(canvas);

            // Dispose old texture to prevent memory leak
            if (item.obj.material.map) item.obj.material.map.dispose();

            item.obj.material.map = texture;
            item.obj.material.opacity = currentTheme === 'light' ? 0.25 : 0.7;
            item.obj.material.needsUpdate = true;
        });
    });

    // Resize Event
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Rotate shapes
        sphere.rotation.y += 0.005;
        sphere.rotation.x += 0.002;

        torus.rotation.y -= 0.003;
        torus.rotation.z += 0.004;

        box.rotation.x += 0.004;
        box.rotation.y += 0.004;

        dodeca.rotation.z -= 0.003;
        dodeca.rotation.y -= 0.005;

        // Float symbols gently
        symbolsGroup.position.y = Math.sin(elapsedTime * 0.5) * 2;
        symbolsGroup.children.forEach((sprite, i) => {
            sprite.position.y += Math.sin(elapsedTime + i) * 0.01;
        });

        // Parallax easing removed - models remain static relative to cursor

        // Rotate particles slowly
        particlesMesh.rotation.y = elapsedTime * 0.02;

        renderer.render(scene, camera);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', initThreeBg);
