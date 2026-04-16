import * as THREE from "https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js";
import { BLOCK_SIZE, getBlockColor, BlockType } from "./blocks.js";

export class World {
  constructor(scene) {
    this.scene = scene;
    this.blocks = new Map(); // Store blocks as "x,y,z" keys
    this.blocksMesh = null;
    this.chunkSize = 16;
    this.loadedChunks = new Set();
    
    // Noise function constants
    this.noiseScale = 0.1;
    this.maxHeight = 64;
    
    // Generate initial terrain
    this.generateTerrain();
  }
  
  generateTerrain() {
    // Create a simple heightmap-based terrain
    for (let x = -32; x < 32; x++) {
      for (let z = -32; z < 32; z++) {
        const height = Math.floor(this.getNoiseHeight(x, z));
        for (let y = 0; y < height; y++) {
          const blockType = y < height - 1 ? (y === 0 ? BlockType.DIRT : BlockType.STONE) : BlockType.GRASS;
          this.addBlockDirect(new THREE.Vector3(x, y, z), blockType);
        }
      }
    }
    this.rebuildMesh();
  }
  
  getNoiseHeight(x, z) {
    // Simple perlin-like noise (uses sine waves for simplicity)
    const freq1 = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 10;
    const freq2 = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 15;
    const freq3 = Math.sin(x * 0.02 + 1000) * Math.cos(z * 0.02 + 1000) * 8;
    return Math.max(5, freq1 + freq2 + freq3 + 30);
  }
  
  addBlockDirect(pos, type) {
    const key = `${pos.x},${pos.y},${pos.z}`;
    if (!this.blocks.has(key)) {
      this.blocks.set(key, type);
    }
  }
  
  addBlock(pos, type) {
    const key = `${pos.x},${pos.y},${pos.z}`;
    this.blocks.set(key, type);
    this.rebuildMesh();
  }
  
  removeBlock(pos) {
    const key = `${pos.x},${pos.y},${pos.z}`;
    this.blocks.delete(key);
    this.rebuildMesh();
  }
  
  getBlock(pos) {
    const key = `${pos.x},${pos.y},${pos.z}`;
    return this.blocks.get(key);
  }
  
  getGroundLevel(playerPos) {
    const x = Math.floor(playerPos.x);
    const z = Math.floor(playerPos.z);
    
    for (let y = Math.floor(playerPos.y); y >= -64; y--) {
      if (this.getBlock(new THREE.Vector3(x, y, z))) {
        return y;
      }
    }
    return -64;
  }
  
  rebuildMesh() {
    // Remove old mesh
    if (this.blocksMesh) {
      this.scene.remove(this.blocksMesh);
      this.blocksMesh.geometry.dispose();
      this.blocksMesh.material.dispose();
    }
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const indices = [];
    let vertexCount = 0;
    
    // Iterate through all blocks
    for (const [key, type] of this.blocks) {
      const [x, y, z] = key.split(",").map(Number);
      const pos = new THREE.Vector3(x, y, z);
      
      // Check which faces should be rendered (not adjacent to another block)
      const faces = this.getVisibleFaces(pos);
      
      if (faces.length === 0) continue;
      
      const baseColor = new THREE.Color(getBlockColor(type));
      
      for (const face of faces) {
        const verts = this.getFaceVertices(pos, face);
        const faceColor = this.getFaceColor(baseColor, face, x, y, z);
        
        for (const vert of verts) {
          positions.push(vert.x, vert.y, vert.z);
          colors.push(faceColor.r, faceColor.g, faceColor.b);
        }
        
        // Add indices for the face (two triangles)
        const base = vertexCount;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 2, base + 3, base);
        vertexCount += 4;
      }
    }
    
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    geometry.computeVertexNormals();
    
    // Standard material makes the terrain react better to directional lighting.
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.02
    });
    this.blocksMesh = new THREE.Mesh(geometry, material);
    this.blocksMesh.castShadow = true;
    this.blocksMesh.receiveShadow = true;
    
    this.scene.add(this.blocksMesh);
  }
  
  getVisibleFaces(pos) {
    const faces = [];
    const directions = [
      { name: "top", normal: new THREE.Vector3(0, 1, 0), offset: new THREE.Vector3(0, 1, 0) },
      { name: "bottom", normal: new THREE.Vector3(0, -1, 0), offset: new THREE.Vector3(0, -1, 0) },
      { name: "front", normal: new THREE.Vector3(0, 0, 1), offset: new THREE.Vector3(0, 0, 1) },
      { name: "back", normal: new THREE.Vector3(0, 0, -1), offset: new THREE.Vector3(0, 0, -1) },
      { name: "right", normal: new THREE.Vector3(1, 0, 0), offset: new THREE.Vector3(1, 0, 0) },
      { name: "left", normal: new THREE.Vector3(-1, 0, 0), offset: new THREE.Vector3(-1, 0, 0) }
    ];
    
    for (const dir of directions) {
      const neighbor = new THREE.Vector3().copy(pos).add(dir.offset);
      if (!this.getBlock(neighbor)) {
        // Add slight shading variation for face direction
        let shade = 1.0;
        if (dir.name === "top") shade = 1.2;
        if (dir.name === "bottom") shade = 0.8;
        faces.push({ ...dir, shade });
      }
    }
    
    return faces;
  }

  getFaceColor(baseColor, face, x, y, z) {
    const noise = this.getColorNoise(x, y, z);
    const color = baseColor.clone();
    color.offsetHSL(0, 0, noise);
    color.multiplyScalar(face.shade);
    return color;
  }

  getColorNoise(x, y, z) {
    const wave = Math.sin(x * 1.73 + z * 2.11 + y * 0.69) * 0.035;
    const wave2 = Math.cos(x * 0.53 - z * 0.91) * 0.025;
    return wave + wave2;
  }
  
  getFaceVertices(pos, face) {
    const s = BLOCK_SIZE / 2;
    
    const baseVertices = {
      top: [
        new THREE.Vector3(-s, s, -s),
        new THREE.Vector3(s, s, -s),
        new THREE.Vector3(s, s, s),
        new THREE.Vector3(-s, s, s)
      ],
      bottom: [
        new THREE.Vector3(-s, -s, s),
        new THREE.Vector3(s, -s, s),
        new THREE.Vector3(s, -s, -s),
        new THREE.Vector3(-s, -s, -s)
      ],
      front: [
        new THREE.Vector3(-s, -s, s),
        new THREE.Vector3(s, -s, s),
        new THREE.Vector3(s, s, s),
        new THREE.Vector3(-s, s, s)
      ],
      back: [
        new THREE.Vector3(s, -s, -s),
        new THREE.Vector3(-s, -s, -s),
        new THREE.Vector3(-s, s, -s),
        new THREE.Vector3(s, s, -s)
      ],
      right: [
        new THREE.Vector3(s, -s, -s),
        new THREE.Vector3(s, -s, s),
        new THREE.Vector3(s, s, s),
        new THREE.Vector3(s, s, -s)
      ],
      left: [
        new THREE.Vector3(-s, -s, s),
        new THREE.Vector3(-s, -s, -s),
        new THREE.Vector3(-s, s, -s),
        new THREE.Vector3(-s, s, s)
      ]
    };
    
    const vertices = baseVertices[face.name] || [];
    return vertices.map(v => {
      const vert = new THREE.Vector3().copy(v);
      vert.add(pos);
      return vert;
    });
  }
  
  getBlockMeshes() {
    return this.blocksMesh ? [this.blocksMesh] : [];
  }
  
  update(cameraPos) {
    // Could implement chunk loading/unloading here
  }
}
