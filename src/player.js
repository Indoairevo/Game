import * as THREE from "https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js";

export class Player {
  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    this.position = new THREE.Vector3(0, 50, 0);
    this.velocity = new THREE.Vector3();
    this.isGrounded = false;
    this.pitch = 0;
    this.yaw = Math.PI;
    this.touchMove = new THREE.Vector2();
    
    // Movement state
    this.keys = {};
    this.sensitivity = 0.0026;
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
      if (e.key === " ") {
        this.jump();
      }
    });
    
    document.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    
    // Mouse movement
    document.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement) {
        this.addLookDelta(e.movementX, e.movementY);
      }
    });

    this.applyLook();
  }
  
  update() {
    const forward = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.sin(this.yaw - Math.PI / 2), 0, Math.cos(this.yaw - Math.PI / 2));
    
    // Calculate movement direction
    const moveDirection = new THREE.Vector3();
    let moveX = 0;
    let moveY = 0;

    if (this.keys["w"]) moveY += 1;
    if (this.keys["s"]) moveY -= 1;
    if (this.keys["a"]) moveX -= 1;
    if (this.keys["d"]) moveX += 1;

    moveX += this.touchMove.x;
    moveY += this.touchMove.y;

    const moveVec = new THREE.Vector2(moveX, moveY);
    if (moveVec.length() > 1) {
      moveVec.normalize();
      moveX = moveVec.x;
      moveY = moveVec.y;
    }

    moveDirection.addScaledVector(right, moveX);
    moveDirection.addScaledVector(forward, moveY);
    
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

  setMoveInput(x, y) {
    this.touchMove.set(
      Math.max(-1, Math.min(1, x)),
      Math.max(-1, Math.min(1, y))
    );
  }

  addLookDelta(deltaX, deltaY) {
    this.yaw -= deltaX * this.sensitivity;
    this.pitch -= deltaY * this.sensitivity;
    this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch));
    this.applyLook();
  }

  applyLook() {
    const euler = new THREE.Euler(this.pitch, this.yaw, 0, "YXZ");
    this.camera.quaternion.setFromEuler(euler);
  }

  jump() {
    if (this.isGrounded) {
      this.velocity.y = this.jumpVelocity;
      this.isGrounded = false;
    }
  }
  
  resetToSpawn() {
    this.position.copy(this.spawnPoint);
    this.velocity.set(0, 0, 0);
  }
}
