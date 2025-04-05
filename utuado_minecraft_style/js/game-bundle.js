/* Consolidated game script for Utuado: Sustainable Future
 * This file combines all game logic into a single file for better compatibility
 * and easier loading across different browsers.
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Game configuration
    const config = {
        // Game settings
        dayLength: 60, // seconds per day
        seasonLength: 7, // days per season
        startingResources: {
            energy: 100,
            water: 100,
            food: 100,
            materials: 100,
            knowledge: 50
        },
        
        // World settings
        worldSize: {
            width: 32,
            height: 16,
            depth: 32
        },
        
        // Building settings
        buildings: {
            solar_panel: {
                name: "Solar Panel",
                description: "Generates energy from sunlight",
                cost: { materials: 15 },
                production: { energy: 5 },
                consumption: {},
                size: { width: 1, height: 1, depth: 1 },
                color: 0x3498db,
                model: "cube",
                requirements: {}
            },
            wind_turbine: {
                name: "Wind Turbine",
                description: "Generates energy from wind",
                cost: { materials: 20 },
                production: { energy: 7 },
                consumption: {},
                size: { width: 1, height: 3, depth: 1 },
                color: 0xecf0f1,
                model: "cylinder",
                requirements: {}
            },
            hydro_plant: {
                name: "Hydro Plant",
                description: "Generates energy from water",
                cost: { materials: 30 },
                production: { energy: 10 },
                consumption: { water: 2 },
                size: { width: 2, height: 1, depth: 2 },
                color: 0x2980b9,
                model: "cube",
                requirements: {}
            },
            farm: {
                name: "Farm",
                description: "Produces food",
                cost: { materials: 10 },
                production: { food: 5 },
                consumption: { water: 3 },
                size: { width: 2, height: 1, depth: 2 },
                color: 0x27ae60,
                model: "plane",
                requirements: {}
            },
            water_collector: {
                name: "Water Collector",
                description: "Collects and purifies water",
                cost: { materials: 15 },
                production: { water: 8 },
                consumption: { energy: 1 },
                size: { width: 2, height: 1, depth: 1 },
                color: 0x3498db,
                model: "cube",
                requirements: {}
            },
            greenhouse: {
                name: "Greenhouse",
                description: "Produces food regardless of season",
                cost: { materials: 25 },
                production: { food: 8 },
                consumption: { energy: 2, water: 4 },
                size: { width: 2, height: 2, depth: 2 },
                color: 0x2ecc71,
                model: "cube",
                requirements: {}
            },
            ai_center: {
                name: "AI Center",
                description: "Improves resource efficiency",
                cost: { materials: 40 },
                production: { knowledge: 5 },
                consumption: { energy: 8 },
                size: { width: 2, height: 2, depth: 2 },
                color: 0x9b59b6,
                model: "cube",
                requirements: { knowledge: 30 }
            },
            community_center: {
                name: "Community Center",
                description: "Increases happiness and knowledge",
                cost: { materials: 35 },
                production: { knowledge: 3 },
                consumption: { energy: 3, food: 2 },
                size: { width: 3, height: 2, depth: 3 },
                color: 0xe74c3c,
                model: "cube",
                requirements: {}
            }
        },
        
        // Events
        events: [
            {
                id: 'drought',
                title: 'Drought',
                description: 'A severe drought is affecting the region. Water resources are dwindling.',
                condition: (gameState, resources) => {
                    return gameState.currentSeason === 'summer' && Math.random() < 0.3;
                },
                choices: [
                    {
                        text: 'Implement water rationing',
                        effect: (gameState, resources) => {
                            resources.water -= 10;
                            gameState.happiness -= 5;
                            return 'You implemented water rationing. The community is less happy, but water resources are preserved.';
                        }
                    },
                    {
                        text: 'Use AI to optimize water distribution',
                        condition: (gameState) => gameState.aiLevel >= 2,
                        effect: (gameState, resources) => {
                            resources.water -= 5;
                            resources.energy -= 5;
                            return 'The AI system optimized water distribution, minimizing the impact of the drought.';
                        }
                    },
                    {
                        text: 'Do nothing',
                        effect: (gameState, resources) => {
                            resources.water -= 20;
                            return 'Water resources have been severely depleted.';
                        }
                    }
                ]
            },
            {
                id: 'storm',
                title: 'Tropical Storm',
                description: 'A tropical storm is approaching Utuado. Prepare for heavy rain and strong winds.',
                condition: (gameState, resources) => {
                    return (gameState.currentSeason === 'summer' || gameState.currentSeason === 'fall') && Math.random() < 0.3;
                },
                choices: [
                    {
                        text: 'Reinforce buildings',
                        effect: (gameState, resources) => {
                            resources.materials -= 15;
                            resources.energy -= 10;
                            return 'Buildings were reinforced and withstood the storm with minimal damage.';
                        }
                    },
                    {
                        text: 'Set up water collection systems',
                        effect: (gameState, resources) => {
                            resources.materials -= 5;
                            resources.energy -= 5;
                            resources.water += 30;
                            return 'You collected a significant amount of rainwater during the storm.';
                        }
                    },
                    {
                        text: 'Evacuate to higher ground',
                        effect: (gameState, resources) => {
                            gameState.happiness -= 10;
                            return 'The community evacuated safely, but morale has decreased.';
                        }
                    }
                ]
            }
        ]
    };

    // Game state
    const gameState = {
        running: false,
        paused: false,
        currentSeason: 'spring',
        currentDay: 1,
        dayTime: 0,
        totalTime: 0,
        happiness: 100,
        sustainability: 50,
        aiLevel: 1,
        buildings: [],
        events: [],
        selectedBuilding: null,
        
        // Get buildings by type
        getBuildingsByType: function(type) {
            return this.buildings.filter(building => building.type === type);
        },
        
        // Get AI level
        getAILevel: function() {
            return this.aiLevel;
        },
        
        // Get sustainability score
        getSustainability: function() {
            return this.sustainability;
        }
    };

    // Resources
    const resources = {
        energy: config.startingResources.energy,
        water: config.startingResources.water,
        food: config.startingResources.food,
        materials: config.startingResources.materials,
        knowledge: config.startingResources.knowledge
    };

    // UI elements
    const ui = {
        loadingScreen: document.getElementById('loading-screen'),
        startButton: document.getElementById('start-game'),
        gameContainer: document.getElementById('game-container'),
        canvas: document.getElementById('game-canvas'),
        resourcesPanel: document.getElementById('resources-panel'),
        seasonIndicator: document.getElementById('season-indicator'),
        buildingMenu: document.getElementById('building-menu'),
        closeBuildingMenu: document.getElementById('close-building-menu'),
        helpPanel: document.getElementById('help-panel'),
        toggleBuildingMenu: document.getElementById('toggle-building-menu'),
        toggleHelp: document.getElementById('toggle-help'),
        closeHelp: document.getElementById('close-help'),
        eventDialog: document.getElementById('event-dialog'),
        eventTitle: document.getElementById('event-title'),
        eventDescription: document.getElementById('event-description'),
        eventChoices: document.getElementById('event-choices'),
        
        // Update resource display
        updateResourceDisplay: function() {
            for (const [resource, value] of Object.entries(resources)) {
                const element = document.getElementById(resource);
                if (element) {
                    const valueElement = element.querySelector('.resource-value');
                    if (valueElement) {
                        valueElement.textContent = Math.floor(value);
                        
                        // Visual feedback for low resources
                        if (value < 20) {
                            valueElement.style.color = '#ff4d4d'; // Red for critical
                        } else if (value < 50) {
                            valueElement.style.color = '#ffcc00'; // Yellow for warning
                        } else {
                            valueElement.style.color = 'white'; // Normal
                        }
                    }
                }
            }
        },
        
        // Update season display
        updateSeasonDisplay: function() {
            const seasonText = document.querySelector('.season-text');
            const dayCounter = document.querySelector('.day-counter');
            
            if (seasonText) {
                seasonText.textContent = gameState.currentSeason.charAt(0).toUpperCase() + gameState.currentSeason.slice(1);
            }
            
            if (dayCounter) {
                dayCounter.textContent = `Day ${gameState.currentDay}`;
            }
            
            // Update colors based on season
            const seasonIndicator = document.getElementById('season-indicator');
            switch (gameState.currentSeason) {
                case 'spring':
                    seasonIndicator.style.backgroundColor = 'rgba(124, 252, 0, 0.5)'; // Bright green
                    break;
                case 'summer':
                    seasonIndicator.style.backgroundColor = 'rgba(255, 165, 0, 0.5)'; // Orange
                    break;
                case 'fall':
                    seasonIndicator.style.backgroundColor = 'rgba(218, 165, 32, 0.5)'; // Golden rod
                    break;
                case 'winter':
                    seasonIndicator.style.backgroundColor = 'rgba(135, 206, 235, 0.5)'; // Sky blue
                    break;
                default:
                    seasonIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            }
        },
        
        // Show notification
        showNotification: function(message, duration = 3000) {
            // Clear existing notification
            if (this.notificationTimeout) {
                clearTimeout(this.notificationTimeout);
            }
            
            // Check if notification element exists
            let notification = document.getElementById('notification');
            
            // Create notification element if it doesn't exist
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'notification';
                notification.style.position = 'fixed';
                notification.style.bottom = '70px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                notification.style.color = 'white';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '5px';
                notification.style.zIndex = '500';
                notification.style.transition = 'opacity 0.3s';
                document.body.appendChild(notification);
            }
            
            // Set message
            notification.textContent = message;
            notification.style.opacity = '1';
            
            // Hide after duration
            this.notificationTimeout = setTimeout(() => {
                notification.style.opacity = '0';
            }, duration);
        },
        
        // Show event dialog
        showEventDialog: function(event) {
            // Set title and description
            this.eventTitle.textContent = event.title;
            this.eventDescription.textContent = event.description;
            
            // Clear existing choices
            this.eventChoices.innerHTML = '';
            
            // Add choices
            event.choices.forEach((choice, index) => {
                // Check if choice has a condition
                if (choice.condition && !choice.condition(gameState, resources)) {
                    return; // Skip this choice if condition not met
                }
                
                const choiceElement = document.createElement('div');
                choiceElement.className = 'event-choice';
                choiceElement.textContent = choice.text;
                choiceElement.addEventListener('click', () => {
                    // Apply effect
                    const resultMessage = choice.effect(gameState, resources);
                    
                    // Hide dialog
                    this.hideEventDialog();
                    
                    // Show result
                    this.showNotification(resultMessage);
                    
                    // Update UI
                    this.updateResourceDisplay();
                    
                    // Record event
                    gameState.events.push({
                        event: event,
                        choice: choice,
                        time: gameState.totalTime
                    });
                });
                this.eventChoices.appendChild(choiceElement);
            });
            
            // Show dialog
            this.eventDialog.classList.remove('hidden');
            
            // Pause game
            pauseGame();
        },
        
        // Hide event dialog
        hideEventDialog: function() {
            this.eventDialog.classList.add('hidden');
            resumeGame();
        },
        
        // Update building menu
        updateBuildingMenu: function() {
            const buildingItems = document.querySelectorAll('.building-item');
            
            buildingItems.forEach(item => {
                const buildingType = item.dataset.building;
                const buildingData = config.buildings[buildingType];
                
                // Check if building requirements are met
                let requirementsMet = true;
                for (const [resource, value] of Object.entries(buildingData.requirements)) {
                    if (resources[resource] < value) {
                        requirementsMet = false;
                        break;
                    }
                }
                
                // Check if resources are sufficient
                let canAfford = true;
                for (const [resource, value] of Object.entries(buildingData.cost)) {
                    if (resources[resource] < value) {
                        canAfford = false;
                        break;
                    }
                }
                
                // Update appearance based on availability
                if (!requirementsMet) {
                    item.classList.add('locked');
                    item.title = 'Requirements not met';
                } else if (!canAfford) {
                    item.classList.add('unaffordable');
                    item.classList.remove('locked');
                    item.title = 'Not enough resources';
                } else {
                    item.classList.remove('locked', 'unaffordable');
                    item.title = buildingData.description;
                }
            });
        }
    };

    // Three.js variables
    let scene, camera, renderer, controls;
    let terrain, skybox;
    let raycaster, mouse;
    let buildingPreview = null;
    let clock = new THREE.Clock();

    // Initialize Three.js scene
    function initScene() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(20, 20, 20);
        camera.lookAt(0, 0, 0);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({
            canvas: ui.canvas,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        
        // Create controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 5;
        controls.maxDistance = 50;
        controls.maxPolarAngle = Math.PI / 2;
        
        // Create raycaster for mouse interaction
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        // Create lighting
        createLighting();
        
        // Create terrain
        createTerrain();
        
        // Create skybox
        createSkybox();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Handle mouse events
        ui.canvas.addEventListener('mousemove', onMouseMove);
        ui.canvas.addEventListener('click', onMouseClick);
    }

    // Create lighting
    function createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 10;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        scene.add(directionalLight);
    }

    // Create terrain
    function createTerrain() {
        // Create terrain geometry
        const geometry = new THREE.BoxGeometry(
            config.worldSize.width,
            config.worldSize.height / 8,
            config.worldSize.depth
        );
        
        // Create terrain material
        const material = new THREE.MeshLambertMaterial({
            color: 0x8B4513, // Brown
            flatShading: true
        });
        
        // Create terrain mesh
        terrain = new THREE.Mesh(geometry, material);
        terrain.position.y = -config.worldSize.height / 16;
        terrain.receiveShadow = true;
        scene.add(terrain);
        
        // Create grid helper
        const gridHelper = new THREE.GridHelper(
            Math.max(config.worldSize.width, config.worldSize.depth),
            Math.max(config.worldSize.width, config.worldSize.depth)
        );
        gridHelper.position.y = 0.01;
        scene.add(gridHelper);
    }

    // Create skybox
    function createSkybox() {
        // Simple skybox using a large sphere
        const geometry = new THREE.SphereGeometry(500, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x87CEEB, // Sky blue
            side: THREE.BackSide
        });
        
        skybox = new THREE.Mesh(geometry, material);
        scene.add(skybox);
    }

    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Handle mouse move
    function onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update building preview if a building is selected
        if (gameState.selectedBuilding && !gameState.paused) {
            updateBuildingPreview();
        }
    }

    // Handle mouse click
    function onMouseClick(event) {
        // Ignore if game is paused
        if (gameState.paused) return;
        
        // If a building is selected, place it
        if (gameState.selectedBuilding) {
            placeBuilding();
        }
    }

    // Update building preview
    function updateBuildingPreview() {
        // Cast ray from mouse position
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(terrain);
        
        // If ray intersects terrain, position preview at intersection point
        if (intersects.length > 0) {
            const intersect = intersects[0];
            
            // Create preview if it doesn't exist
            if (!buildingPreview) {
                const buildingData = config.buildings[gameState.selectedBuilding];
                
                // Create preview geometry based on building model
                let geometry;
                switch (buildingData.model) {
                    case 'cube':
                        geometry = new THREE.BoxGeometry(
                            buildingData.size.width,
                            buildingData.size.height,
                            buildingData.size.depth
                        );
                        break;
                    case 'cylinder':
                        geometry = new THREE.CylinderGeometry(
                            0.5,
                            0.5,
                            buildingData.size.height,
                            16
                        );
                        break;
                    case 'plane':
                        geometry = new THREE.PlaneGeometry(
                            buildingData.size.width,
                            buildingData.size.depth
                        );
                        geometry.rotateX(-Math.PI / 2);
                        break;
                    default:
                        geometry = new THREE.BoxGeometry(1, 1, 1);
                }
                
                // Create preview material
                const material = new THREE.MeshLambertMaterial({
                    color: buildingData.color,
                    transparent: true,
                    opacity: 0.5
                });
                
                // Create preview mesh
                buildingPreview = new THREE.Mesh(geometry, material);
                scene.add(buildingPreview);
            }
            
            // Position preview at intersection point
            // Round to grid coordinates
            buildingPreview.position.copy(intersect.point);
            buildingPreview.position.x = Math.round(buildingPreview.position.x);
            buildingPreview.position.z = Math.round(buildingPreview.position.z);
            
            // Adjust height based on building type
            const buildingData = config.buildings[gameState.selectedBuilding];
            buildingPreview.position.y = buildingData.size.height / 2;
            
            // Check if position is valid
            const isValid = checkBuildingPosition(buildingPreview.position, buildingData.size);
            
            // Update preview color based on validity
            buildingPreview.material.color.set(isValid ? buildingData.color : 0xFF0000);
        }
    }

    // Check if building position is valid
    function checkBuildingPosition(position, size) {
        // Check if building is within world bounds
        if (
            position.x - size.width / 2 < -config.worldSize.width / 2 ||
            position.x + size.width / 2 > config.worldSize.width / 2 ||
            position.z - size.depth / 2 < -config.worldSize.depth / 2 ||
            position.z + size.depth / 2 > config.worldSize.depth / 2
        ) {
            return false;
        }
        
        // Check if building overlaps with existing buildings
        for (const building of gameState.buildings) {
            const buildingData = config.buildings[building.type];
            const dx = Math.abs(position.x - building.position.x);
            const dz = Math.abs(position.z - building.position.z);
            
            if (
                dx < (size.width / 2 + buildingData.size.width / 2) &&
                dz < (size.depth / 2 + buildingData.size.depth / 2)
            ) {
                return false;
            }
        }
        
        return true;
    }

    // Place building
    function placeBuilding() {
        // Check if building preview exists and position is valid
        if (buildingPreview) {
            const buildingData = config.buildings[gameState.selectedBuilding];
            const isValid = checkBuildingPosition(buildingPreview.position, buildingData.size);
            
            if (isValid) {
                // Check if player can afford building
                let canAfford = true;
                for (const [resource, value] of Object.entries(buildingData.cost)) {
                    if (resources[resource] < value) {
                        canAfford = false;
                        break;
                    }
                }
                
                if (canAfford) {
                    // Deduct resources
                    for (const [resource, value] of Object.entries(buildingData.cost)) {
                        resources[resource] -= value;
                    }
                    
                    // Create building
                    const building = {
                        type: gameState.selectedBuilding,
                        position: buildingPreview.position.clone(),
                        rotation: buildingPreview.rotation.clone(),
                        mesh: null
                    };
                    
                    // Create building mesh
                    let geometry;
                    switch (buildingData.model) {
                        case 'cube':
                            geometry = new THREE.BoxGeometry(
                                buildingData.size.width,
                                buildingData.size.height,
                                buildingData.size.depth
                            );
                            break;
                        case 'cylinder':
                            geometry = new THREE.CylinderGeometry(
                                0.5,
                                0.5,
                                buildingData.size.height,
                                16
                            );
                            break;
                        case 'plane':
                            geometry = new THREE.PlaneGeometry(
                                buildingData.size.width,
                                buildingData.size.depth
                            );
                            geometry.rotateX(-Math.PI / 2);
                            break;
                        default:
                            geometry = new THREE.BoxGeometry(1, 1, 1);
                    }
                    
                    const material = new THREE.MeshLambertMaterial({
                        color: buildingData.color
                    });
                    
                    building.mesh = new THREE.Mesh(geometry, material);
                    building.mesh.position.copy(building.position);
                    building.mesh.rotation.copy(building.rotation);
                    building.mesh.castShadow = true;
                    building.mesh.receiveShadow = true;
                    
                    // Add building to scene and game state
                    scene.add(building.mesh);
                    gameState.buildings.push(building);
                    
                    // Update UI
                    ui.updateResourceDisplay();
                    ui.updateBuildingMenu();
                    
                    // Show notification
                    ui.showNotification(`${buildingData.name} built!`);
                    
                    // Update AI level if AI center was built
                    if (gameState.selectedBuilding === 'ai_center') {
                        gameState.aiLevel++;
                        ui.showNotification(`AI Level increased to ${gameState.aiLevel}!`);
                    }
                    
                    // Update sustainability score
                    updateSustainability();
                } else {
                    ui.showNotification('Not enough resources!');
                }
            } else {
                ui.showNotification('Invalid building position!');
            }
        }
    }

    // Update sustainability score
    function updateSustainability() {
        // Calculate sustainability based on building types and resource balance
        let sustainabilityScore = 50; // Base score
        
        // Add points for renewable energy buildings
        const solarPanels = gameState.getBuildingsByType('solar_panel').length;
        const windTurbines = gameState.getBuildingsByType('wind_turbine').length;
        const hydroPlants = gameState.getBuildingsByType('hydro_plant').length;
        
        sustainabilityScore += solarPanels * 2;
        sustainabilityScore += windTurbines * 3;
        sustainabilityScore += hydroPlants * 4;
        
        // Add points for food production
        const farms = gameState.getBuildingsByType('farm').length;
        const greenhouses = gameState.getBuildingsByType('greenhouse').length;
        
        sustainabilityScore += farms * 2;
        sustainabilityScore += greenhouses * 3;
        
        // Add points for water collection
        const waterCollectors = gameState.getBuildingsByType('water_collector').length;
        sustainabilityScore += waterCollectors * 3;
        
        // Add points for AI and community centers
        const aiCenters = gameState.getBuildingsByType('ai_center').length;
        const communityCenters = gameState.getBuildingsByType('community_center').length;
        
        sustainabilityScore += aiCenters * 5;
        sustainabilityScore += communityCenters * 4;
        
        // Adjust based on resource balance
        const resourceBalance = (
            resources.energy +
            resources.water +
            resources.food +
            resources.materials +
            resources.knowledge
        ) / 5;
        
        if (resourceBalance < 20) {
            sustainabilityScore -= 20;
        } else if (resourceBalance < 50) {
            sustainabilityScore -= 10;
        } else if (resourceBalance > 150) {
            sustainabilityScore += 10;
        }
        
        // Cap sustainability score
        gameState.sustainability = Math.max(0, Math.min(100, sustainabilityScore));
    }

    // Update game state
    function updateGameState(deltaTime) {
        // Update time
        gameState.totalTime += deltaTime;
        gameState.dayTime += deltaTime;
        
        // Check for day change
        if (gameState.dayTime >= config.dayLength) {
            // Reset day time
            gameState.dayTime = gameState.dayTime % config.dayLength;
            
            // Increment day
            gameState.currentDay++;
            
            // Check for season change
            if ((gameState.currentDay - 1) % config.seasonLength === 0) {
                // Cycle through seasons
                const seasons = ['spring', 'summer', 'fall', 'winter'];
                const currentIndex = seasons.indexOf(gameState.currentSeason);
                const nextIndex = (currentIndex + 1) % seasons.length;
                gameState.currentSeason = seasons[nextIndex];
                
                // Update skybox color based on season
                updateSeasonEffects();
                
                // Show notification
                ui.showNotification(`Season changed to ${gameState.currentSeason}!`);
            }
            
            // Show notification
            ui.showNotification(`Day ${gameState.currentDay}`);
            
            // Update UI
            ui.updateSeasonDisplay();
        }
        
        // Update resources based on buildings
        updateResources(deltaTime);
        
        // Check for events
        checkForEvents();
    }

    // Update resources based on buildings
    function updateResources(deltaTime) {
        // Calculate resource production and consumption
        const production = {
            energy: 0,
            water: 0,
            food: 0,
            materials: 0,
            knowledge: 0
        };
        
        const consumption = {
            energy: 0,
            water: 0,
            food: 0,
            materials: 0,
            knowledge: 0
        };
        
        // Calculate base production and consumption from buildings
        for (const building of gameState.buildings) {
            const buildingData = config.buildings[building.type];
            
            // Add production
            for (const [resource, value] of Object.entries(buildingData.production)) {
                production[resource] += value;
            }
            
            // Add consumption
            for (const [resource, value] of Object.entries(buildingData.consumption)) {
                consumption[resource] += value;
            }
        }
        
        // Apply season effects
        applySeasonEffects(production, consumption);
        
        // Apply AI level effects
        if (gameState.aiLevel > 1) {
            // AI improves efficiency
            for (const resource in production) {
                production[resource] *= (1 + (gameState.aiLevel - 1) * 0.1);
            }
            
            for (const resource in consumption) {
                consumption[resource] *= (1 - (gameState.aiLevel - 1) * 0.05);
            }
        }
        
        // Calculate net change per day
        const netChangePerDay = {
            energy: production.energy - consumption.energy,
            water: production.water - consumption.water,
            food: production.food - consumption.food,
            materials: production.materials - consumption.materials,
            knowledge: production.knowledge - consumption.knowledge
        };
        
        // Apply change based on time delta
        const changeRatio = deltaTime / config.dayLength;
        for (const resource in resources) {
            resources[resource] += netChangePerDay[resource] * changeRatio;
            
            // Ensure resources don't go below 0
            resources[resource] = Math.max(0, resources[resource]);
        }
        
        // Update UI
        ui.updateResourceDisplay();
    }

    // Apply season effects to resource production and consumption
    function applySeasonEffects(production, consumption) {
        switch (gameState.currentSeason) {
            case 'spring':
                // Balanced season
                break;
            case 'summer':
                // More energy from solar, less water
                production.energy *= 1.2;
                production.water *= 0.8;
                consumption.water *= 1.2;
                break;
            case 'fall':
                // More food from farms, less energy
                production.food *= 1.3;
                production.energy *= 0.9;
                break;
            case 'winter':
                // Less food and energy, more water
                production.food *= 0.7;
                production.energy *= 0.8;
                production.water *= 1.2;
                consumption.energy *= 1.3;
                break;
        }
    }

    // Update season visual effects
    function updateSeasonEffects() {
        switch (gameState.currentSeason) {
            case 'spring':
                skybox.material.color.set(0x87CEEB); // Sky blue
                break;
            case 'summer':
                skybox.material.color.set(0x1E90FF); // Dodger blue
                break;
            case 'fall':
                skybox.material.color.set(0xCD853F); // Peru
                break;
            case 'winter':
                skybox.material.color.set(0xB0C4DE); // Light steel blue
                break;
        }
    }

    // Check for events
    function checkForEvents() {
        // Only check for events once per day
        if (gameState.dayTime < 1) return;
        
        // Random chance for event
        if (Math.random() < 0.1) {
            // Filter events that meet conditions
            const possibleEvents = config.events.filter(event => {
                if (event.condition) {
                    return event.condition(gameState, resources);
                }
                return true;
            });
            
            // If there are possible events, trigger one randomly
            if (possibleEvents.length > 0) {
                const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
                ui.showEventDialog(randomEvent);
            }
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update controls
        controls.update();
        
        // Update game state if running
        if (gameState.running && !gameState.paused) {
            const deltaTime = clock.getDelta();
            updateGameState(deltaTime);
        }
        
        // Render scene
        renderer.render(scene, camera);
    }

    // Start game
    function startGame() {
        // Hide loading screen
        ui.loadingScreen.classList.add('hidden');
        
        // Show game container
        ui.gameContainer.classList.remove('hidden');
        
        // Set game state to running
        gameState.running = true;
        
        // Initialize scene
        initScene();
        
        // Start animation loop
        animate();
        
        // Update UI
        ui.updateResourceDisplay();
        ui.updateSeasonDisplay();
        ui.updateBuildingMenu();
        
        // Show welcome notification
        ui.showNotification('Welcome to Utuado: Sustainable Future!');
    }

    // Pause game
    function pauseGame() {
        gameState.paused = true;
    }

    // Resume game
    function resumeGame() {
        gameState.paused = false;
    }

    // Initialize UI
    function initUI() {
        // Building menu
        ui.toggleBuildingMenu.addEventListener('click', () => {
            ui.buildingMenu.classList.toggle('hidden');
            
            // If opening menu, pause game
            if (!ui.buildingMenu.classList.contains('hidden')) {
                pauseGame();
            } else {
                resumeGame();
            }
        });
        
        ui.closeBuildingMenu.addEventListener('click', () => {
            ui.buildingMenu.classList.add('hidden');
            resumeGame();
        });
        
        // Help panel
        ui.toggleHelp.addEventListener('click', () => {
            ui.helpPanel.classList.toggle('hidden');
            
            // If opening help, pause game
            if (!ui.helpPanel.classList.contains('hidden')) {
                pauseGame();
            } else {
                resumeGame();
            }
        });
        
        ui.closeHelp.addEventListener('click', () => {
            ui.helpPanel.classList.add('hidden');
            resumeGame();
        });
        
        // Building selection
        const buildingItems = document.querySelectorAll('.building-item');
        buildingItems.forEach(item => {
            item.addEventListener('click', () => {
                // Deselect all buildings
                buildingItems.forEach(i => i.classList.remove('selected'));
                
                // Select clicked building
                item.classList.add('selected');
                
                // Set selected building
                gameState.selectedBuilding = item.dataset.building;
                
                // Close building menu
                ui.buildingMenu.classList.add('hidden');
                resumeGame();
                
                // Show notification
                const buildingData = config.buildings[gameState.selectedBuilding];
                ui.showNotification(`Selected ${buildingData.name}`);
                
                // Remove existing preview
                if (buildingPreview) {
                    scene.remove(buildingPreview);
                    buildingPreview = null;
                }
            });
        });
    }

    // Simulate loading
    function simulateLoading() {
        const progressFill = document.querySelector('.progress-fill');
        const loadingText = document.querySelector('.loading-text');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                loadingText.textContent = 'Ready to play!';
                ui.startButton.classList.remove('hidden');
            }
            
            progressFill.style.width = `${progress}%`;
        }, 200);
    }

    // Initialize game
    function init() {
        // Simulate loading
        simulateLoading();
        
        // Initialize UI
        initUI();
        
        // Add start button event listener
        ui.startButton.addEventListener('click', startGame);
    }

    // Start initialization
    init();
});
