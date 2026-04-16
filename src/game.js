import * as THREE from "https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js";
import { Player } from "./player.js";
import { World } from "./world.js";
import { BlockType } from "./blocks.js";

export class Game {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.setupScene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    // Create world and player
    this.world = new World(this.scene);
    this.player = new Player(this.camera, this.world);
    
    // Handle window resize
    window.addEventListener("resize", () => this.onWindowResize());
    
    // Handle controls and interactions
    this.setupInputHandling();
    
    // Raycast for block interactions
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
  }
  
  setupScene() {
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 100, 500);
    
    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.camera.far = 500;
    this.scene.add(directionalLight);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
  }
  
  setupInputHandling() {
    // Mouse movement
    this.renderer.domElement.addEventListener("mousemove", (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Left click - break block
    document.addEventListener("mousedown", (e) => {
      if (e.button === 0 && document.pointerLockElement) {
        this.breakBlock();
      }
    });
    
    // Right click - place block
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (document.pointerLockElement) {
        this.placeBlock();
      }
    });
    
    // Pointer lock
    this.renderer.domElement.addEventListener("click", () => {
      this.renderer.domElement.requestPointerLock =
        this.renderer.domElement.requestPointerLock ||
        this.renderer.domElement.mozRequestPointerLock;
      this.renderer.domElement.requestPointerLock();
    });
    
    // Block selection (1-4 keys)
    document.addEventListener("keydown", (e) => {
      if (e.key >= "1" && e.key <= "4") {
        const blockIndex = parseInt(e.key) - 1;
        this.player.setSelectedBlock(blockIndex);
        this.updateSelectedBlockDisplay();
      }
      
      // Reset spawn (R key)
      if (e.key === "r" || e.key === "R") {
        this.player.resetToSpawn();
      }
    });
  }
  
  breakBlock() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const blocks = this.world.getBlockMeshes();
    const intersects = this.raycaster.intersectObjects(blocks, false);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const normal = intersects[0].face.normal;
      const blockPos = new THREE.Vector3()
        .copy(point)
        .sub(normal.multiplyScalar(0.5))
        .floor();
      
      this.world.removeBlock(blockPos);
    }
  }
  
  placeBlock() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const blocks = this.world.getBlockMeshes();
    const intersects = this.raycaster.intersectObjects(blocks, false);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const normal = intersects[0].face.normal;
      const blockPos = new THREE.Vector3()
        .copy(point)
        .add(normal.multiplyScalar(0.5))
        .floor();
      
      this.world.addBlock(blockPos, this.player.selectedBlockType);
    }
  }
  
  updateSelectedBlockDisplay() {
    const blockNames = ["Grass", "Stone", "Wood", "Dirt"];
    const selectedDiv = document.getElementById("selected-block");
    if (selectedDiv) {
      selectedDiv.textContent = `Selected: ${blockNames[this.player.selectedBlockType]} (${this.player.selectedBlockType + 1})`;
    }
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  start() {
    this.animate();
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Update player
    this.player.update();
    
    // Update camera
    this.camera.position.copy(this.player.position);
    this.camera.position.y += 1.6; // Eye height
    
    // Update world
    this.world.update(this.camera.position);
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
}
