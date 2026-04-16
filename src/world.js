import * as THREE from "https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js";
import {
  BLOCK_SIZE,
  BlockType,
  TRANSPARENT_BLOCKS,
  getBlockColor,
  isBlockSolid
} from "./blocks.js";
import { SimplexNoise } from "./noise.js";

export class World {
  constructor(scene) {
    this.scene = scene;
    this.blocks = new Map();
    this.chunkSize = 16;
    this.worldMinY = 0;
    this.worldMaxY = 86;
    this.seaLevel = 24;
    this.viewDistanceChunks = 1;
    this.unloadDistanceChunks = 2;
    this.seed = 1337;
    this.heightNoise = new SimplexNoise(this.seed + 11);
    this.detailNoise = new SimplexNoise(this.seed + 29);
    this.biomeNoise = new SimplexNoise(this.seed + 71);
    this.caveNoise = new SimplexNoise(this.seed + 131);
    this.loadedChunks = new Set();
    this.chunkBlocks = new Map();
    this.lastChunkX = Number.NaN;
    this.lastChunkZ = Number.NaN;

    this.opaqueMesh = null;
    this.transparentMesh = null;

    this.ensureChunksAround(new THREE.Vector3(0, 50, 0), true);
  }

  chunkKey(cx, cz) {
    return `${cx},${cz}`;
  }

  blockKey(x, y, z) {
    return `${x},${y},${z}`;
  }

  ensureChunksAround(playerPos, force = false) {
    const centerChunkX = Math.floor(playerPos.x / this.chunkSize);
    const centerChunkZ = Math.floor(playerPos.z / this.chunkSize);

    if (!force && centerChunkX === this.lastChunkX && centerChunkZ === this.lastChunkZ) {
      return;
    }

    this.lastChunkX = centerChunkX;
    this.lastChunkZ = centerChunkZ;

    let changed = false;
    for (let dz = -this.viewDistanceChunks; dz <= this.viewDistanceChunks; dz++) {
      for (let dx = -this.viewDistanceChunks; dx <= this.viewDistanceChunks; dx++) {
        const cx = centerChunkX + dx;
        const cz = centerChunkZ + dz;
        const cKey = this.chunkKey(cx, cz);
        if (!this.loadedChunks.has(cKey)) {
          this.generateChunk(cx, cz);
          changed = true;
        }
      }
    }

    for (const cKey of Array.from(this.loadedChunks)) {
      const [cx, cz] = cKey.split(",").map(Number);
      const dist = Math.max(Math.abs(cx - centerChunkX), Math.abs(cz - centerChunkZ));
      if (dist > this.unloadDistanceChunks) {
        const keys = this.chunkBlocks.get(cKey);
        if (keys) {
          for (const blockKey of keys) {
            this.blocks.delete(blockKey);
          }
        }
        this.chunkBlocks.delete(cKey);
        this.loadedChunks.delete(cKey);
        changed = true;
      }
    }

    if (changed) {
      this.rebuildMesh();
    }
  }

  generateChunk(cx, cz) {
    const cKey = this.chunkKey(cx, cz);
    const keys = new Set();
    const xStart = cx * this.chunkSize;
    const zStart = cz * this.chunkSize;

    for (let x = xStart; x < xStart + this.chunkSize; x++) {
      for (let z = zStart; z < zStart + this.chunkSize; z++) {
        const biome = this.getBiome(x, z);
        const terrainHeight = this.getTerrainHeight(x, z, biome);

        for (let y = this.worldMinY; y <= terrainHeight; y++) {
          if (y > this.worldMinY + 2 && y < terrainHeight - 2 && this.isCave(x, y, z)) {
            continue;
          }
          let type = this.pickTerrainBlock(biome, y, terrainHeight);

          if (type === BlockType.STONE) {
            type = this.pickOre(x, y, z);
          }

          this.addBlockDirect(new THREE.Vector3(x, y, z), type, cKey, keys);
        }

        if (terrainHeight < this.seaLevel) {
          for (let y = terrainHeight + 1; y <= this.seaLevel; y++) {
            this.addBlockDirect(new THREE.Vector3(x, y, z), BlockType.WATER, cKey, keys);
          }
        }

        if (biome === "forest" && terrainHeight > this.seaLevel + 1) {
          const treeChance = this.detailNoise.perlin(x * 0.19, z * 0.19);
          if (treeChance > 0.53) {
            this.placeTree(x, terrainHeight + 1, z, cKey, keys);
          }
        }
      }
    }

    this.chunkBlocks.set(cKey, keys);
    this.loadedChunks.add(cKey);
  }

  getBiome(x, z) {
    const heat = this.biomeNoise.perlin(x * 0.003, z * 0.003);
    const moisture = this.biomeNoise.perlin(x * 0.003 + 400, z * 0.003 + 400);
    if (heat > 0.25 && moisture < -0.05) {
      return "desert";
    }
    if (heat < -0.15) {
      return "snow";
    }
    if (moisture > 0.1) {
      return "forest";
    }
    return "plains";
  }

  getTerrainHeight(x, z, biome) {
    const continental = this.heightNoise.perlin(x * 0.006, z * 0.006) * 12;
    const hills = this.heightNoise.perlin(x * 0.018 + 250, z * 0.018 + 250) * 7;
    const detail = this.detailNoise.perlin(x * 0.06, z * 0.06) * 2.5;

    let base = 28;
    if (biome === "desert") {
      base = 24;
    } else if (biome === "snow") {
      base = 34;
    }
    const height = Math.floor(base + continental + hills + detail);
    return Math.max(6, Math.min(this.worldMaxY - 1, height));
  }

  isCave(x, y, z) {
    const v = this.caveNoise.perlin(x * 0.055, y * 0.07, z * 0.055);
    return v > 0.35;
  }

  pickTerrainBlock(biome, y, topY) {
    if (y === this.worldMinY) return BlockType.BEDROCK;
    if (y === topY) {
      if (biome === "desert") return BlockType.SAND;
      if (biome === "snow") return BlockType.SNOW;
      return BlockType.GRASS;
    }
    if (y >= topY - 3) {
      if (biome === "desert") return BlockType.SAND;
      return BlockType.DIRT;
    }
    return BlockType.STONE;
  }

  pickOre(x, y, z) {
    if (y > 52) return BlockType.STONE;
    const oreNoise = this.detailNoise.perlin(x * 0.085 + 91, y * 0.09 + 19, z * 0.085 + 53);
    if (y < 18 && oreNoise > 0.6) return BlockType.DIAMOND_ORE;
    if (y < 28 && oreNoise > 0.52) return BlockType.GOLD_ORE;
    if (y < 42 && oreNoise > 0.45) return BlockType.IRON_ORE;
    if (oreNoise > 0.38) return BlockType.COAL_ORE;
    return BlockType.STONE;
  }

  placeTree(baseX, baseY, baseZ, cKey, keys) {
    const trunkHeight = 4 + Math.floor(Math.abs(this.detailNoise.perlin(baseX * 0.5, baseZ * 0.5)) * 2);
    for (let y = 0; y < trunkHeight; y++) {
      this.addBlockDirect(new THREE.Vector3(baseX, baseY + y, baseZ), BlockType.OAK_LOG, cKey, keys);
    }

    const top = baseY + trunkHeight;
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          const dist = Math.abs(x) + Math.abs(y) + Math.abs(z);
          if (dist <= 3) {
            this.addBlockDirect(new THREE.Vector3(baseX + x, top + y, baseZ + z), BlockType.OAK_LEAVES, cKey, keys);
          }
        }
      }
    }
  }

  addBlockDirect(pos, type, cKey = null, keys = null) {
    if (type === BlockType.AIR) return;
    const key = this.blockKey(pos.x, pos.y, pos.z);
    this.blocks.set(key, type);
    if (cKey) {
      if (!this.chunkBlocks.has(cKey)) {
        this.chunkBlocks.set(cKey, new Set());
      }
      this.chunkBlocks.get(cKey).add(key);
      if (keys) {
        keys.add(key);
      }
    }
  }

  addBlock(pos, type) {
    if (type === BlockType.AIR) return false;
    const x = Math.floor(pos.x);
    const y = Math.floor(pos.y);
    const z = Math.floor(pos.z);
    if (y <= this.worldMinY || y > this.worldMaxY) return false;
    const key = this.blockKey(x, y, z);
    if (this.blocks.get(key) === type) return false;
    this.blocks.set(key, type);

    const cx = Math.floor(x / this.chunkSize);
    const cz = Math.floor(z / this.chunkSize);
    const cKey = this.chunkKey(cx, cz);
    if (!this.chunkBlocks.has(cKey)) {
      this.chunkBlocks.set(cKey, new Set());
      this.loadedChunks.add(cKey);
    }
    this.chunkBlocks.get(cKey).add(key);
    this.rebuildMesh();
    return true;
  }

  removeBlock(pos) {
    const x = Math.floor(pos.x);
    const y = Math.floor(pos.y);
    const z = Math.floor(pos.z);
    const key = this.blockKey(x, y, z);
    const current = this.blocks.get(key) ?? BlockType.AIR;
    if (current === BlockType.AIR || current === BlockType.BEDROCK || current === BlockType.WATER || current === BlockType.LAVA) {
      return BlockType.AIR;
    }
    this.blocks.delete(key);

    const cx = Math.floor(x / this.chunkSize);
    const cz = Math.floor(z / this.chunkSize);
    const cKey = this.chunkKey(cx, cz);
    const set = this.chunkBlocks.get(cKey);
    if (set) {
      set.delete(key);
    }
    this.rebuildMesh();
    return current;
  }

  getBlock(pos) {
    const x = Math.floor(pos.x);
    const y = Math.floor(pos.y);
    const z = Math.floor(pos.z);
    const key = this.blockKey(x, y, z);
    return this.blocks.get(key) ?? BlockType.AIR;
  }

  getGroundLevel(playerPos) {
    const x = Math.floor(playerPos.x);
    const z = Math.floor(playerPos.z);

    for (let y = this.worldMaxY; y >= this.worldMinY; y--) {
      const type = this.getBlock(new THREE.Vector3(x, y, z));
      if (isBlockSolid(type)) {
        return y;
      }
    }
    return this.worldMinY;
  }

  rebuildMesh() {
    if (this.opaqueMesh) {
      this.scene.remove(this.opaqueMesh);
      this.opaqueMesh.geometry.dispose();
      this.opaqueMesh.material.dispose();
      this.opaqueMesh = null;
    }
    if (this.transparentMesh) {
      this.scene.remove(this.transparentMesh);
      this.transparentMesh.geometry.dispose();
      this.transparentMesh.material.dispose();
      this.transparentMesh = null;
    }

    const opaque = { positions: [], colors: [], indices: [], count: 0 };
    const transparent = { positions: [], colors: [], indices: [], count: 0 };

    for (const [key, type] of this.blocks) {
      const [x, y, z] = key.split(",").map(Number);
      const pos = new THREE.Vector3(x, y, z);
      const faces = this.getVisibleFaces(pos, type);
      if (faces.length === 0) continue;

      const baseColor = new THREE.Color(getBlockColor(type));
      const target = TRANSPARENT_BLOCKS.has(type) ? transparent : opaque;

      for (const face of faces) {
        const verts = this.getFaceVertices(pos, face);
        const faceColor = this.getFaceColor(baseColor, face, x, y, z);

        for (const vert of verts) {
          target.positions.push(vert.x, vert.y, vert.z);
          target.colors.push(faceColor.r, faceColor.g, faceColor.b);
        }

        const base = target.count;
        target.indices.push(base, base + 1, base + 2);
        target.indices.push(base + 2, base + 3, base);
        target.count += 4;
      }
    }

    if (opaque.count > 0) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(opaque.positions), 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(opaque.colors), 3));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(opaque.indices), 1));
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.9,
        metalness: 0.02
      });
      this.opaqueMesh = new THREE.Mesh(geometry, material);
      this.opaqueMesh.castShadow = true;
      this.opaqueMesh.receiveShadow = true;
      this.scene.add(this.opaqueMesh);
    }

    if (transparent.count > 0) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(transparent.positions), 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(transparent.colors), 3));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(transparent.indices), 1));
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.3,
        metalness: 0.05,
        transparent: true,
        opacity: 0.72,
        depthWrite: false
      });
      this.transparentMesh = new THREE.Mesh(geometry, material);
      this.transparentMesh.castShadow = false;
      this.transparentMesh.receiveShadow = true;
      this.scene.add(this.transparentMesh);
    }
  }

  getVisibleFaces(pos, type) {
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
      const neighborType = this.getBlock(neighbor);
      const neighborTransparent = TRANSPARENT_BLOCKS.has(neighborType);
      const currentTransparent = TRANSPARENT_BLOCKS.has(type);
      const sameType = neighborType === type;
      if (neighborType === BlockType.AIR || (neighborTransparent && !sameType) || (currentTransparent && neighborType !== type)) {
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
    const meshes = [];
    if (this.opaqueMesh) meshes.push(this.opaqueMesh);
    if (this.transparentMesh) meshes.push(this.transparentMesh);
    return meshes;
  }

  update(cameraPos) {
    this.ensureChunksAround(cameraPos, false);
  }
}
