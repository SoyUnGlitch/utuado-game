// VoxelWorld.js - Manages the voxel-based world for Utuado game
import * as THREE from 'three';

export class VoxelWorld {
    constructor(options) {
        this.chunkSize = options.chunkSize;
        this.worldSize = options.worldSize;
        this.blockSize = options.blockSize;
        this.scene = options.scene;
        
        // Initialize voxel data storage
        this.voxels = new Uint8Array(
            this.worldSize.width * 
            this.worldSize.height * 
            this.worldSize.depth
        );
        
        // Initialize chunks
        this.chunks = {};
        this.chunkMeshes = [];
        
        // Block types
        this.blockTypes = {
            0: { name: 'air', solid: false, color: 0x000000 },
            1: { name: 'grass', solid: true, color: 0x7CFC00 },
            2: { name: 'dirt', solid: true, color: 0x8B4513 },
            3: { name: 'stone', solid: true, color: 0x808080 },
            4: { name: 'water', solid: false, color: 0x0000FF, transparent: true, opacity: 0.7 },
            5: { name: 'sand', solid: true, color: 0xF5DEB3 },
            
            // Building blocks
            10: { name: 'solar_panel', solid: true, color: 0x1E90FF },
            11: { name: 'wind_turbine', solid: true, color: 0xFFFFFF },
            12: { name: 'hydro_plant', solid: true, color: 0x00FFFF },
            13: { name: 'farm', solid: true, color: 0x32CD32 },
            14: { name: 'greenhouse', solid: true, color: 0x98FB98 },
            15: { name: 'water_collector', solid: true, color: 0x4682B4 },
            16: { name: 'water_filter', solid: true, color: 0x87CEEB },
            17: { name: 'house', solid: true, color: 0xCD853F },
            18: { name: 'community_center', solid: true, color: 0xDDA0DD },
            19: { name: 'ai_hub', solid: true, color: 0x9370DB },
            20: { name: 'sensor_network', solid: true, color: 0x708090 }
        };
        
        // Building type to block type mapping
        this.buildingToBlockType = {
            'solar_panel': 10,
            'wind_turbine': 11,
            'hydro_plant': 12,
            'farm': 13,
            'greenhouse': 14,
            'water_collector': 15,
            'water_filter': 16,
            'house': 17,
            'community_center': 18,
            'ai_hub': 19,
            'sensor_network': 20
        };
    }
    
    // Get voxel at position
    getVoxel(x, y, z) {
        if (x < 0 || x >= this.worldSize.width ||
            y < 0 || y >= this.worldSize.height ||
            z < 0 || z >= this.worldSize.depth) {
            return 0; // Out of bounds = air
        }
        
        const index = this.getVoxelIndex(x, y, z);
        return this.voxels[index];
    }
    
    // Set voxel at position
    setVoxel(x, y, z, value) {
        if (x < 0 || x >= this.worldSize.width ||
            y < 0 || y >= this.worldSize.height ||
            z < 0 || z >= this.worldSize.depth) {
            return; // Out of bounds
        }
        
        const index = this.getVoxelIndex(x, y, z);
        this.voxels[index] = value;
        
        // Update affected chunks
        this.updateChunkForVoxel(x, y, z);
    }
    
    // Get index in voxel array
    getVoxelIndex(x, y, z) {
        return (y * this.worldSize.width * this.worldSize.depth) +
               (z * this.worldSize.width) +
               x;
    }
    
    // Generate terrain
    async generateTerrain() {
        return new Promise(resolve => {
            // Simple heightmap-based terrain generation
            for (let x = 0; x < this.worldSize.width; x++) {
                for (let z = 0; z < this.worldSize.depth; z++) {
                    // Generate height using simplex noise approximation
                    const height = this.generateHeight(x, z);
                    
                    // Fill terrain
                    for (let y = 0; y < this.worldSize.height; y++) {
                        let blockType = 0; // Air by default
                        
                        if (y < height - 3) {
                            blockType = 3; // Stone
                        } else if (y < height - 1) {
                            blockType = 2; // Dirt
                        } else if (y < height) {
                            blockType = 1; // Grass
                        } else if (y < 2 && height < 3) {
                            blockType = 4; // Water
                        }
                        
                        this.setVoxel(x, y, z, blockType);
                    }
                }
            }
            
            // Generate chunks
            this.generateChunks();
            
            resolve();
        });
    }
    
    // Simple height generation function
    generateHeight(x, z) {
        // Center of the map has higher elevation (mountain)
        const centerX = this.worldSize.width / 2;
        const centerZ = this.worldSize.depth / 2;
        
        // Distance from center
        const dx = x - centerX;
        const dz = z - centerZ;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Base height
        let height = 3;
        
        // Mountain in the center
        const mountainRadius = Math.min(this.worldSize.width, this.worldSize.depth) / 3;
        if (distance < mountainRadius) {
            const mountainHeight = 8;
            height += mountainHeight * (1 - distance / mountainRadius);
        }
        
        // Add some random variation
        height += Math.sin(x * 0.4) + Math.sin(z * 0.4);
        
        // Ensure height is within bounds
        return Math.max(1, Math.min(Math.floor(height), this.worldSize.height - 1));
    }
    
    // Generate chunks
    generateChunks() {
        // Calculate number of chunks
        const chunksX = Math.ceil(this.worldSize.width / this.chunkSize);
        const chunksY = Math.ceil(this.worldSize.height / this.chunkSize);
        const chunksZ = Math.ceil(this.worldSize.depth / this.chunkSize);
        
        // Generate each chunk
        for (let cx = 0; cx < chunksX; cx++) {
            for (let cy = 0; cy < chunksY; cy++) {
                for (let cz = 0; cz < chunksZ; cz++) {
                    this.generateChunk(cx, cy, cz);
                }
            }
        }
    }
    
    // Generate a single chunk
    generateChunk(cx, cy, cz) {
        const chunkId = `${cx},${cy},${cz}`;
        
        // Skip if chunk already exists
        if (this.chunks[chunkId]) {
            return;
        }
        
        // Calculate chunk bounds
        const startX = cx * this.chunkSize;
        const startY = cy * this.chunkSize;
        const startZ = cz * this.chunkSize;
        const endX = Math.min(startX + this.chunkSize, this.worldSize.width);
        const endY = Math.min(startY + this.chunkSize, this.worldSize.height);
        const endZ = Math.min(startZ + this.chunkSize, this.worldSize.depth);
        
        // Create geometry for the chunk
        const geometry = this.generateChunkGeometry(startX, startY, startZ, endX, endY, endZ);
        
        // Skip empty chunks
        if (geometry.attributes.position.count === 0) {
            return;
        }
        
        // Create mesh
        const mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({
                vertexColors: true,
                transparent: true
            })
        );
        
        // Add to scene
        this.scene.add(mesh);
        
        // Store chunk data
        this.chunks[chunkId] = {
            mesh,
            startX,
            startY,
            startZ,
            endX,
            endY,
            endZ
        };
        
        // Add to mesh list for raycasting
        this.chunkMeshes.push(mesh);
    }
    
    // Generate geometry for a chunk
    generateChunkGeometry(startX, startY, startZ, endX, endY, endZ) {
        // Arrays to store geometry data
        const positions = [];
        const normals = [];
        const colors = [];
        const indices = [];
        
        // For each voxel in the chunk
        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                for (let z = startZ; z < endZ; z++) {
                    const voxelType = this.getVoxel(x, y, z);
                    
                    // Skip air blocks
                    if (voxelType === 0) continue;
                    
                    // Get block type data
                    const blockType = this.blockTypes[voxelType];
                    
                    // For each face of the cube
                    for (let face = 0; face < 6; face++) {
                        // Check if face is visible (adjacent to air or transparent block)
                        const [nx, ny, nz] = this.getFaceDirection(face);
                        const adjacentVoxelType = this.getVoxel(x + nx, y + ny, z + nz);
                        
                        if (adjacentVoxelType === 0 || 
                            (this.blockTypes[adjacentVoxelType].transparent && !blockType.transparent)) {
                            // Add face
                            const vertexCount = positions.length / 3;
                            
                            // Add vertices for face
                            this.addFaceVertices(positions, x, y, z, face);
                            
                            // Add face normal
                            for (let i = 0; i < 4; i++) {
                                normals.push(nx, ny, nz);
                            }
                            
                            // Add vertex colors
                            const color = new THREE.Color(blockType.color);
                            for (let i = 0; i < 4; i++) {
                                colors.push(color.r, color.g, color.b);
                            }
                            
                            // Add indices for face (two triangles)
                            indices.push(
                                vertexCount, vertexCount + 1, vertexCount + 2,
                                vertexCount + 2, vertexCount + 3, vertexCount
                            );
                        }
                    }
                }
            }
        }
        
        // Create buffer geometry
        const geometry = new THREE.BufferGeometry();
        
        // Set attributes
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setIndex(indices);
        
        return geometry;
    }
    
    // Get direction vector for cube face
    getFaceDirection(face) {
        switch (face) {
            case 0: return [1, 0, 0];  // Right
            case 1: return [-1, 0, 0]; // Left
            case 2: return [0, 1, 0];  // Top
            case 3: return [0, -1, 0]; // Bottom
            case 4: return [0, 0, 1];  // Front
            case 5: return [0, 0, -1]; // Back
        }
    }
    
    // Add vertices for a cube face
    addFaceVertices(positions, x, y, z, face) {
        const size = this.blockSize;
        
        switch (face) {
            case 0: // Right face (x+)
                positions.push(
                    x + size, y, z,
                    x + size, y + size, z,
                    x + size, y + size, z + size,
                    x + size, y, z + size
                );
                break;
            case 1: // Left face (x-)
                positions.push(
                    x, y, z + size,
                    x, y + size, z + size,
                    x, y + size, z,
                    x, y, z
                );
                break;
            case 2: // Top face (y+)
                positions.push(
                    x, y + size, z,
                    x + size, y + size, z,
                    x + size, y + size, z + size,
                    x, y + size, z + size
                );
                break;
            case 3: // Bottom face (y-)
                positions.push(
                    x, y, z + size,
                    x + size, y, z + size,
                    x + size, y, z,
                    x, y, z
                );
                break;
            case 4: // Front face (z+)
                positions.push(
                    x + size, y, z + size,
                    x + size, y + size, z + size,
                    x, y + size, z + size,
                    x, y, z + size
                );
                break;
            case 5: // Back face (z-)
                positions.push(
                    x, y, z,
                    x, y + size, z,
                    x + size, y + size, z,
                    x + size, y, z
                );
                break;
        }
    }
    
    // Update chunk containing voxel
    updateChunkForVoxel(x, y, z) {
        // Calculate chunk coordinates
        const cx = Math.floor(x / this.chunkSize);
        const cy = Math.floor(y / this.chunkSize);
        const cz = Math.floor(z / this.chunkSize);
        
        // Update chunk
        this.updateChunk(cx, cy, cz);
        
        // Check if voxel is on chunk boundary and update adjacent chunks
        if (x % this.chunkSize === 0 && cx > 0) {
            this.updateChunk(cx - 1, cy, cz);
        }
        if (x % this.chunkSize === this.chunkSize - 1 && cx < Math.ceil(this.worldSize.width / this.chunkSize) - 1) {
            this.updateChunk(cx + 1, cy, cz);
        }
        if (y % this.chunkSize === 0 && cy > 0) {
            this.updateChunk(cx, cy - 1, cz);
        }
        if (y % this.chunkSize === this.chunkSize - 1 && cy < Math.ceil(this.worldSize.height / this.chunkSize) - 1) {
            this.updateChunk(cx, cy + 1, cz);
        }
        if (z % this.chunkSize === 0 && cz > 0) {
            this.updateChunk(cx, cy, cz - 1);
        }
        if (z % this.chunkSize === this.chunkSize - 1 && cz < Math.ceil(this.worldSize.depth / this.chunkSize) - 1) {
            this.updateChunk(cx, cy, cz + 1);
        }
    }
    
    // Update a chunk
    updateChunk(cx, cy, cz) {
        const chunkId = `${cx},${cy},${cz}`;
        
        // Get existing chunk
        const chunk = this.chunks[chunkId];
        
        // If chunk exists, remove it
        if (chunk) {
            // Remove from scene
            this.scene.remove(chunk.mesh);
            
            // Remove from mesh list
            const index = this.chunkMeshes.indexOf(chunk.mesh);
            if (index !== -1) {
                this.chunkMeshes.splice(index, 1);
            }
            
            // Dispose geometry
            chunk.mesh.geometry.dispose();
            
            // Delete chunk
            delete this.chunks[chunkId];
        }
        
        // Regenerate chunk
        this.generateChunk(cx, cy, cz);
    }
    
    // Place a building
    placeBuilding(x, y, z, buildingType) {
        // Check if position is valid
        if (x < 0 || x >= this.worldSize.width ||
            y < 0 || y >= this.worldSize.height ||
            z < 0 || z >= this.worldSize.depth) {
            return false;
        }
        
        // Check if position is empty
        if (this.getVoxel(x, y, z) !== 0) {
            return false;
        }
        
        // Get block type for building
        const blockType = this.buildingToBlockType[buildingType];
        if (!blockType) {
            return false;
        }
        
        // Place building
        this.setVoxel(x, y, z, blockType);
        
        return true;
    }
    
    // Remove a voxel
    removeVoxel(x, y, z) {
        // Check if position is valid
        if (x < 0 || x >= this.worldSize.width ||
            y < 0 || y >= this.worldSize.height ||
            z < 0 || z >= this.worldSize.depth) {
            return false;
        }
        
        // Set to air
        this.setVoxel(x, y, z, 0);
        
        return true;
    }
    
    // Get voxel position from raycaster intersect
    getVoxelPositionFromIntersect(intersect) {
        // Get hit position
        const point = intersect.point;
        
        // Add a small offset in the direction of the normal
        const normal = intersect.face.normal;
        point.x -= normal.x * 0.5;
        point.y -= normal.y * 0.5;
        point.z -= normal.z * 0.5;
        
        // Convert to voxel coordinates
        const x = Math.floor(point.x);
        const y = Math.floor(point.y);
        const z = Math.floor(point.z);
        
        return new THREE.Vector3(x, y, z);
    }
    
    // Get all chunk meshes for raycasting
    getMeshes() {
        return this.chunkMeshes;
    }
}
