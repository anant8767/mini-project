// Check for WebGL support
        const isWebGLAvailable = (() => {
            try {
                const canvas = document.createElement('canvas');
                return !!(window.WebGLRenderingContext && 
                    (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
            } catch(e) {
                return false;
            }
        })();

        // Hero 3D Globe Scene
        if (isWebGLAvailable) {
            const heroCanvas = document.getElementById('hero-canvas');
            const heroScene = new THREE.Scene();
            const heroCamera = new THREE.PerspectiveCamera(75, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
            const heroRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
            
            heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
            heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Create Earth-like sphere
            const geometry = new THREE.SphereGeometry(2, 64, 64);
            const material = new THREE.MeshPhongMaterial({
                color: 0x2194ce,
                emissive: 0x112244,
                specular: 0x4488ff,
                shininess: 25,
                wireframe: false
            });
            const globe = new THREE.Mesh(geometry, material);
            heroScene.add(globe);

            // Add wireframe overlay
            const wireframeGeo = new THREE.SphereGeometry(2.01, 32, 32);
            const wireframeMat = new THREE.MeshBasicMaterial({
                color: 0x88ccff,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const wireframe = new THREE.Mesh(wireframeGeo, wireframeMat);
            heroScene.add(wireframe);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            heroScene.add(ambientLight);

            const pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(5, 5, 5);
            heroScene.add(pointLight);

            const pointLight2 = new THREE.PointLight(0x4488ff, 0.5);
            pointLight2.position.set(-5, -5, -5);
            heroScene.add(pointLight2);

            heroCamera.position.z = 5;

            // Particles around globe
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 1000;
            const posArray = new Float32Array(particlesCount * 3);

            for(let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 15;
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.02,
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });

            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            heroScene.add(particlesMesh);

            // Animation
            let mouseX = 0;
            let mouseY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            });

            function animateHero() {
                requestAnimationFrame(animateHero);

                globe.rotation.y += 0.002;
                globe.rotation.x += 0.001;
                wireframe.rotation.y -= 0.003;
                wireframe.rotation.x -= 0.001;

                particlesMesh.rotation.y += 0.0005;

                // Mouse interaction
                globe.rotation.y += mouseX * 0.0005;
                globe.rotation.x += mouseY * 0.0005;

                heroRenderer.render(heroScene, heroCamera);
            }

            animateHero();

            // Handle resize
            window.addEventListener('resize', () => {
                heroCamera.aspect = heroCanvas.clientWidth / heroCanvas.clientHeight;
                heroCamera.updateProjectionMatrix();
                heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
            });
        } else {
            // Fallback for no WebGL
            const heroCanvas = document.getElementById('hero-canvas');
            heroCanvas.style.background = 'linear-gradient(135deg, #003366, #0066cc)';
        }

        // Background Floating Shapes
        if (isWebGLAvailable) {
            const bgCanvas = document.getElementById('bg-canvas');
            const bgScene = new THREE.Scene();
            const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
            
            bgRenderer.setSize(window.innerWidth, window.innerHeight);
            bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            bgCamera.position.z = 10;

            // Create floating shapes
            const shapes = [];
            const shapeTypes = [
                new THREE.BoxGeometry(0.5, 0.5, 0.5),
                new THREE.SphereGeometry(0.3, 32, 32),
                new THREE.TetrahedronGeometry(0.4)
            ];

            for(let i = 0; i < 20; i++) {
                const geometry = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                const material = new THREE.MeshPhongMaterial({
                    color: Math.random() * 0xffffff,
                    transparent: true,
                    opacity: 0.15,
                    shininess: 100
                });
                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.x = (Math.random() - 0.5) * 20;
                mesh.position.y = (Math.random() - 0.5) * 20;
                mesh.position.z = (Math.random() - 0.5) * 20;

                mesh.userData = {
                    velocity: {
                        x: (Math.random() - 0.5) * 0.01,
                        y: (Math.random() - 0.5) * 0.01,
                        z: (Math.random() - 0.5) * 0.01
                    },
                    rotation: {
                        x: Math.random() * 0.02,
                        y: Math.random() * 0.02,
                        z: Math.random() * 0.02
                    }
                };

                bgScene.add(mesh);
                shapes.push(mesh);
            }

            // Lighting for background
            const bgAmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
            bgScene.add(bgAmbientLight);

            const bgPointLight = new THREE.PointLight(0xffffff, 0.5);
            bgPointLight.position.set(10, 10, 10);
            bgScene.add(bgPointLight);

            function animateBg() {
                requestAnimationFrame(animateBg);

                shapes.forEach(shape => {
                    // Move shapes
                    shape.position.x += shape.userData.velocity.x;
                    shape.position.y += shape.userData.velocity.y;
                    shape.position.z += shape.userData.velocity.z;

                    // Bounce off boundaries
                    if (Math.abs(shape.position.x) > 10) shape.userData.velocity.x *= -1;
                    if (Math.abs(shape.position.y) > 10) shape.userData.velocity.y *= -1;
                    if (Math.abs(shape.position.z) > 10) shape.userData.velocity.z *= -1;

                    // Rotate shapes
                    shape.rotation.x += shape.userData.rotation.x;
                    shape.rotation.y += shape.userData.rotation.y;
                    shape.rotation.z += shape.userData.rotation.z;
                });

                bgRenderer.render(bgScene, bgCamera);
            }

            animateBg();

            // Handle resize
            window.addEventListener('resize', () => {
                bgCamera.aspect = window.innerWidth / window.innerHeight;
                bgCamera.updateProjectionMatrix();
                bgRenderer.setSize(window.innerWidth, window.innerHeight);
            });
        }

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Mobile Menu Toggle
        document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
            document.querySelector('nav').classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                document.querySelector('nav').classList.remove('active');
            });
        });

        // Contact Form Submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message. We will get back to you soon!');
            this.reset();
        });

        // Smooth Scrolling for Anchor Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Enhanced Sticky Header
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            const currentScroll = window.pageYOffset;
            
            if(currentScroll > 100) {
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
            
            lastScroll = currentScroll;
        });

        // Add parallax effect to cards on mouse move
        document.querySelectorAll('.program-card, .faculty-card, .news-item').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });