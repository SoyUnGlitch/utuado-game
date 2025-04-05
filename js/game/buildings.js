// Building system for Utuado game
import * as THREE from 'three';

// Building System class
class BuildingSystem {
    constructor(scene, assets) {
        // Building types
        this.buildingTypes = {
            SOLAR_PANEL: 'solar_panel',
            WIND_TURBINE: 'wind_turbine',
            HYDRO_PLANT: 'hydro_plant',
            FARM: 'farm',
            WATER_COLLECTOR: 'water_collector',
            UNIVERSITY: 'university'
        };
        
        // Building data
        this.buildingData = {
            solar_panel: {
                name: 'Solar Panel',
                description: 'Produces energy from sunlight',
                cost: { materials: 15, knowledge: 5 },
                production: { energy: 10 },
                size: { width: 5, length: 5, height: 1 },
                model: null
            },
            wind_turbine: {
                name: 'Wind Turbine',
                description: 'Produces energy from wind',
                cost: { materials: 20, knowledge: 10 },
                production: { energy: 15 },
                size: { width: 3, length: 3, height: 15 },
                model: null
            },
            hydro_plant: {
                name: 'Micro Hydro Plant',
                description: 'Produces energy from water',
                cost: { materials: 25, knowledge: 15 },
                production: { energy: 20, water: -5 },
                size: { width: 8, length: 8, height: 4 },
                model: null
            },
            farm: {
                name: 'Sustainable Farm',
                description: 'Produces food',
                cost: { materials: 10, water: 10 },
                production: { food: 15, water: -5 },
                size: { width: 10, length: 10, height: 2 },
                model: null
            },
            water_collector: {
                name: 'Water Collector',
                description: 'Collects and purifies water',
                cost: { materials: 15, knowledge: 5 },
                production: { water: 15 },
                size: { width: 6, length: 6, height: 3 },
                model: null
            },
            university: {
                name: 'Research Center',
                description: 'Produces knowledge',
                cost: { materials: 30, energy: 10 },
                production: { knowledge: 10, energy: -5 },
                size: { width: 12, length: 12, height: 6 },
                model: null
            }
        };
        
        // Store references to the scene and assets
        this.scene = scene;
        this.assets = assets;
        
        // Track placed buildings
        this.buildings = [];
        
        // Building models
        this.buildingModels = {};
        
        // Grid size for placement
        this.gridSize = 5;
        
        // Currently selected building type for placement
        this.selectedBuildingType = null;
        
        // Placement preview mesh
        this.previewMesh = null;
        
        // Raycaster for building placement
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }
    
    // Initialize building models
    async initBuildings() {
        console.log('Initializing buildings...');
        
        // Register building assets for loading
        this.assets.register();
        
        // Create building models
        await this.createBuildingModels();
        
        // Mark building assets as loaded
        this.assets.loaded();
    }
    
    // Create building models
    async createBuildingModels() {
        // In a full implementation, this would load detailed 3D models for buildings
        // For now, we'll create simple geometric shapes
        
        // Solar Panel - flat blue rectangle
        const solarPanelGeometry = new THREE.BoxGeometry(
            this.buildingData.solar_panel.size.width,
            this.buildingData.solar_panel.size.height,
            this.buildingData.solar_panel.size.length
        );
        const solarPanelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1565c0,
            metalness: 0.8,
            roughness: 0.2
        });
        this.buildingModels[this.buildingTypes.SOLAR_PANEL] = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
        this.buildingModels[this.buildingTypes.SOLAR_PANEL].castShadow = true;
        this.buildingModels[this.buildingTypes.SOLAR_PANEL].receiveShadow = true;
        
        // Wind Turbine - tall cylinder with blades
        const windTurbineBaseGeometry = new THREE.CylinderGeometry(1, 1.5, 15, 8);
        const windTurbineBaseMaterial = new THREE.MeshStandardMaterial({ color: 0xeceff1 });
        const windTurbineBase = new THREE.Mesh(windTurbineBaseGeometry, windTurbineBaseMaterial);
        windTurbineBase.castShadow = true;
        windTurbineBase.receiveShadow = true;
        
        const windTurbineBladeGeometry = new THREE.BoxGeometry(1, 0.2, 7);
        const windTurbineBladeMaterial = new THREE.MeshStandardMaterial({ color: 0xeceff1 });
        
        const windTurbineBlades = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(windTurbineBladeGeometry, windTurbineBladeMaterial);
            blade.position.set(0, 0, 3.5);
            blade.castShadow = true;
            blade.receiveShadow = true;
            
            const bladeGroup = new THREE.Group();
            bladeGroup.add(blade);
            bladeGroup.rotation.y = (Math.PI * 2 / 3) * i;
            windTurbineBlades.add(bladeGroup);
        }
        windTurbineBlades.position.set(0, 7.5, 0);
        
        const windTurbine = new THREE.Group();
        windTurbine.add(windTurbineBase);
        windTurbine.add(windTurbineBlades);
        this.buildingModels[this.buildingTypes.WIND_TURBINE] = windTurbine;
        
        // Hydro Plant - blue box with water wheel
        const hydroPlantBaseGeometry = new THREE.BoxGeometry(
            this.buildingData.hydro_plant.size.width,
            this.buildingData.hydro_plant.size.height,
            this.buildingData.hydro_plant.size.length
        );
        const hydroPlantBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x0288d1 });
        const hydroPlantBase = new THREE.Mesh(hydroPlantBaseGeometry, hydroPlantBaseMaterial);
        hydroPlantBase.castShadow = true;
        hydroPlantBase.receiveShadow = true;
        
        const waterWheelGeometry = new THREE.CylinderGeometry(3, 3, 1, 8);
        const waterWheelMaterial = new THREE.MeshStandardMaterial({ color: 0x795548 });
        const waterWheel = new THREE.Mesh(waterWheelGeometry, waterWheelMaterial);
        waterWheel.rotation.x = Math.PI / 2;
        waterWheel.position.set(0, 2, 4);
        waterWheel.castShadow = true;
        waterWheel.receiveShadow = true;
        
        const hydroPlant = new THREE.Group();
        hydroPlant.add(hydroPlantBase);
        hydroPlant.add(waterWheel);
        this.buildingModels[this.buildingTypes.HYDRO_PLANT] = hydroPlant;
        
        // Farm - green plots with small structures
        const farmBaseGeometry = new THREE.BoxGeometry(
            this.buildingData.farm.size.width,
            0.5,
            this.buildingData.farm.size.length
        );
        const farmBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x33691e });
        const farmBase = new THREE.Mesh(farmBaseGeometry, farmBaseMaterial);
        farmBase.receiveShadow = true;
        
        const farmHouseGeometry = new THREE.BoxGeometry(3, 3, 3);
        const farmHouseMaterial = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
        const farmHouse = new THREE.Mesh(farmHouseGeometry, farmHouseMaterial);
        farmHouse.position.set(-3, 1.5, -3);
        farmHouse.castShadow = true;
        farmHouse.receiveShadow = true;
        
        const farmRoofGeometry = new THREE.ConeGeometry(3, 2, 4);
        const farmRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
        const farmRoof = new THREE.Mesh(farmRoofGeometry, farmRoofMaterial);
        farmRoof.position.set(-3, 4, -3);
        farmRoof.castShadow = true;
        farmRoof.receiveShadow = true;
        
        // Create crop rows
        const cropRowGeometry = new THREE.BoxGeometry(8, 0.5, 1);
        const cropRowMaterial = new THREE.MeshStandardMaterial({ color: 0x558b2f });
        
        const cropRows = new THREE.Group();
        for (let i = 0; i < 5; i++) {
            const cropRow = new THREE.Mesh(cropRowGeometry, cropRowMaterial);
            cropRow.position.set(0, 0.5, -3 + i * 2);
            cropRow.castShadow = true;
            cropRow.receiveShadow = true;
            cropRows.add(cropRow);
        }
        
        const farm = new THREE.Group();
        farm.add(farmBase);
        farm.add(farmHouse);
        farm.add(farmRoof);
        farm.add(cropRows);
        this.buildingModels[this.buildingTypes.FARM] = farm;
        
        // Water Collector - blue cylinders with pipes
        const waterCollectorBaseGeometry = new THREE.CylinderGeometry(
            3,
            3,
            this.buildingData.water_collector.size.height,
            16
        );
        const waterCollectorBaseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x0277bd,
            transparent: true,
            opacity: 0.8
        });
        const waterCollectorBase = new THREE.Mesh(waterCollectorBaseGeometry, waterCollectorBaseMaterial);
        waterCollectorBase.castShadow = true;
        waterCollectorBase.receiveShadow = true;
        
        const waterCollectorRoofGeometry = new THREE.ConeGeometry(3.5, 1, 16);
        const waterCollectorRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x0277bd });
        const waterCollectorRoof = new THREE.Mesh(waterCollectorRoofGeometry, waterCollectorRoofMaterial);
        waterCollectorRoof.position.set(0, 2, 0);
        waterCollectorRoof.castShadow = true;
        waterCollectorRoof.receiveShadow = true;
        
        const pipeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 5, 8);
        const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x0277bd });
        const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(2.5, 0, 0);
        pipe.castShadow = true;
        pipe.receiveShadow = true;
        
        const waterCollector = new THREE.Group();
        waterCollector.add(waterCollectorBase);
        waterCollector.add(waterCollectorRoof);
        waterCollector.add(pipe);
        this.buildingModels[this.buildingTypes.WATER_COLLECTOR] = waterCollector;
        
        // University - large building with multiple sections
        const universityBaseGeometry = new THREE.BoxGeometry(
            this.buildingData.university.size.width,
            this.buildingData.university.size.height,
            this.buildingData.university.size.length
        );
        const universityBaseMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 });
        const universityBase = new THREE.Mesh(universityBaseGeometry, universityBaseMaterial);
        universityBase.castShadow = true;
        universityBase.receiveShadow = true;
        
        const universityRoofGeometry = new THREE.BoxGeometry(12, 1, 12);
        const universityRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x880e4f });
        const universityRoof = new THREE.Mesh(universityRoofGeometry, universityRoofMaterial);
        universityRoof.position.set(0, 3.5, 0);
        universityRoof.castShadow = true;
        universityRoof.receiveShadow = true;
        
        const universityTowerGeometry = new THREE.BoxGeometry(3, 4, 3);
        const universityTowerMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 });
        const universityTower = new THREE.Mesh(universityTowerGeometry, universityTowerMaterial);
        universityTower.position.set(0, 6, 0);
        universityTower.castShadow = true;
        universityTower.receiveShadow = true;
        
        const universityTowerRoofGeometry = new THREE.ConeGeometry(2.5, 2, 4);
        const universityTowerRoofMaterial = new THREE.MeshStandardMaterial({ color: 0x880e4f });
        const universityTowerRoof = new THREE.Mesh(universityTowerRoofGeometry, universityTowerRoofMaterial);
        universityTowerRoof.position.set(0, 9, 0);
        universityTowerRoof.castShadow = true;
        universityTowerRoof.receiveShadow = true;
        
        const university = new THREE.Group();
        university.add(universityBase);
        university.add(universityRoof);
        university.add(universityTower);
        university.add(universityTowerRoof);
        this.buildingModels[this.buildingTypes.UNIVERSITY] = university;
    }
    
    // Select a building type for placement
    selectBuildingType(type) {
        if (this.buildingTypes[type] || this.buildingData[type]) {
            this.selectedBuildingType = type;
            this.createPlacementPreview();
            return true;
        }
        return false;
    }
    
    // Create a preview mesh for building placement
    createPlacementPreview() {
        // Remove existing preview if any
        if (this.previewMesh) {
            this.scene.remove(this.previewMesh);
        }
        
        if (!this.selectedBuildingType) return;
        
        // Clone the building model for preview
        this.previewMesh = this.buildingModels[this.selectedBuildingType].clone();
        
        // Make it semi-transparent
        this.previewMesh.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 0.5;
            }
        });
        
        this.scene.add(this.previewMesh);
    }
    
    // Update placement preview position based on mouse position
    updatePlacementPreview(mouseX, mouseY, camera) {
        if (!this.previewMesh || !this.selectedBuildingType) return;
        
        // Convert mouse position to normalized device coordinates
        this.mouse.x = (mouseX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(mouseY / window.innerHeight) * 2 + 1;
        
        // Set up raycaster
        this.raycaster.setFromCamera(this.mouse, camera);
        
        // Find intersections with the terrain
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        for (let i = 0; i < intersects.length; i++) {
            // Skip intersections with buildings or the preview itself
            if (intersects[i].object === this.previewMesh || 
                intersects[i].object.parent === this.previewMesh ||
                this.isBuilding(intersects[i].object)) {
                continue;
            }
            
            // Get intersection point
            const point = intersects[i].point;
            
            // Snap to grid
            const snappedX = Math.round(point.x / this.gridSize) * this.gridSize;
            const snappedZ = Math.round(point.z / this.gridSize) * this.gridSize;
            
            // Position the preview
            this.previewMesh.position.set(snappedX, point.y, snappedZ);
            
            // Check if placement is valid
            const isValid = this.isValidPlacement(snappedX, point.y, snappedZ);
            
            // Update preview color based on validity
            this.previewMesh.traverse((child) => {
                if (child.isMesh) {
                    child.material.color.set(isValid ? 0x4caf50 : 0xf44336);
                }
            });
            
            break;
        }
    }
    
    // Check if an object is a building
    isBuilding(object) {
        // Check if the object or its parent is in our buildings array
        for (const building of this.buildings) {
            if (object === building.model || object.parent === building.model) {
                return true;
            }
        }
        return false;
    }
    
    // Check if a placement position is valid
    isValidPlacement(x, y, z) {
        if (!this.selectedBuildingType) return false;
        
        const buildingData = this.buildingData[this.selectedBuildingType];
        const halfWidth = buildingData.size.width / 2;
        const halfLength = buildingData.size.length / 2;
        
        // Check for collisions with existing buildings
        for (const building of this.buildings) {
            const buildingPos = building.model.position;
            const buildingData = this.buildingData[building.type];
            const bHalfWidth = buildingData.size.width / 2;
            const bHalfLength = buildingData.size.length / 2;
            
            // Simple box collision check
            if (Math.abs(x - buildingPos.x) < (halfWidth + bHalfWidth) &&
                Math.abs(z - buildingPos.z) < (halfLength + bHalfLength)) {
                return false;
            }
        }
        
        // Additional checks could be added here (terrain type, slope, etc.)
        
        return true;
    }
    
    // Place a building at the current preview position
    placeBuilding(resources) {
        if (!this.previewMesh || !this.selectedBuildingType) return false;
        
        const position = this.previewMesh.position.clone();
        
        // Check if placement is valid
        if (!this.isValidPlacement(position.x, position.y, position.z)) {
            return false;
        }
        
        // Check if player can afford the building
        const cost = this.buildingData[this.selectedBuildingType].cost;
        if (!resources.canAfford(cost)) {
            return false;
        }
        
        // Deduct resources
        resources.purchase(cost);
        
        // Create the actual building
        const buildingModel = this.buildingModels[this.selectedBuildingType].clone();
        buildingModel.position.copy(position);
        this.scene.add(buildingModel);
        
        // Add to buildings array
        this.buildings.push({
            type: this.selectedBuildingType,
            model: buildingModel,
            position: position,
            rotation: buildingModel.rotation.clone(),
            health: 100,
            efficiency: 100
        });
        
        // Reset selection
        this.scene.remove(this.previewMesh);
        this.previewMesh = null;
        this.selectedBuildingType = null;
        
        return true;
    }
    
    // Cancel building placement
    cancelPlacement() {
        if (this.previewMesh) {
            this.scene.remove(this.previewMesh);
            this.previewMesh = null;
        }
        this.selectedBuildingType = null;
    }
    
    // Get all buildings
    getBuildings() {
        return [...this.buildings];
    }
    
    // Get building data
    getBuildingData(type) {
        return this.buildingData[type];
    }
    
    // Update building animations and effects
    updateBuildings(deltaTime) {
        // Update animations for buildings
        for (const building of this.buildings) {
            if (building.type === this.buildingTypes.WIND_TURBINE) {
                // Rotate wind turbine blades
                const blades = building.model.children[1];
                blades.rotation.y += 0.01 * deltaTime;
            } else if (building.type === this.buildingTypes.HYDRO_PLANT) {
                // Rotate water wheel
                const waterWheel = building.model.children[1];
                waterWheel.rotation.z += 0.005 * deltaTime;
            }
        }
        
        // Update preview if active
        if (this.previewMesh) {
            // Add subtle floating animation to preview
            this.previewMesh.position.y += Math.sin(Date.now() * 0.002) * 0.01;
        }
    }
}

// Export the BuildingSystem class
export { BuildingSystem };
