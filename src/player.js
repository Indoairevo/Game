import * as THREE from "https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js";

export class Player {
  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    this.position = new THREE.Vector3(0, 50, 0);
    this.velocity = new THREE.Vector3();
    this.euler = new THREE.Euler(0, 0, 0, "YXZ");
    this.isGrounded = false;
    
    // Movement state
    this.keys = {};
    this.sensitivity = 0.005;
    this.speed = 0.15;
    this.sprintMultiplier = 2;
    this.jumpVelocity = 0.2;
    this.gravity = -0.01;
    
    // Selected block
    this.selectedBlockType = 0;
    
    // Spawn point
    this.spawnPoint = new THREE.Vector3(0, 50, 0);
    
    this.setupControls();
  }
  
  setupControls() {
    document.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === " " && this.isGrounded) {
        this.velocity.y = this.jumpVelocity;
        this.isGrounded = false;
      }
    });
    
    document.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    
    // Mouse movement
    document.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement) {
        this.euler.setFromQuaternion(this.camera.quaternion);
        this.euler.rotateY(-e.movementX * this.sensitivity);
        this.euler.rotateX(-e.movementY * this.sensitivity);
        
        // Clamp vertical rotation
        this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
        
        this.camera.quaternion.setFromEuler(this.euler);
      }
    });
  }
  
  update() {
    // Get forward and right vectors
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(this.camera.up, forward).normalize();
    
    // Calculate movement direction
    let moveDirection = new THREE.Vector3();
    
    if (this.keys["w"]) moveDirection.add(forward);
    if (this.keys["s"]) moveDirection.sub(forward);
    if (this.keys["a"]) moveDirection.sub(right);
    if (this.keys["d"]) moveDirection.add(right);
    
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      
      let speed = this.speed;
      if (this.keys["shift"]) {
        speed *= this.sprintMultiplier;
      }
      
      moveDirection.multiplyScalar(speed);
    }
    
    // Vertical movement (Q/E for descent/ascent in creative mode)
    let verticalMovement = 0;
    if (this.keys["q"]) {
      verticalMovement -= this.speed;
    }
    if (this.keys["e"]) {
      verticalMovement += this.speed;
    }
    
    // Apply movement
    this.position.add(moveDirection);
    this.position.y += verticalMovement;
    
    // Simple gravity and collision (only when not using Q/E)
    if (verticalMovement === 0) {
      this.velocity.y += this.gravity;
      this.position.y += this.velocity.y;
      
      // Keep player above ground
      const groundLevel = this.world.getGroundLevel(this.position) + 1.6;
      if (this.position.y <= groundLevel) {
        this.position.y = groundLevel;
        this.velocity.y = 0;
        this.isGrounded = true;
      } else {
        this.isGrounded = false;
      }
    } else {
      this.velocity.y = 0;
    }
  }
  
  setSelectedBlock(index) {
    this.selectedBlockType = Math.max(0, Math.min(3, index));
  }
  
  resetToSpawn() {
    this.position.copy(this.spawnPoint);
    this.velocity.set(0, 0, 0);
  }
}
