import * as THREE from "https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js";
import { Player } from "./player.js";
import { World } from "./world.js";
import { HOTBAR_BLOCKS, BLOCK_NAMES, BlockType } from "./blocks.js";
import { MobManager } from "./mobs.js";
import { AudioManager } from "./audio.js";

export class Game {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.pointer = new THREE.Vector2(0, 0);
    this.isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    this.setupScene();
    this.clock = new THREE.Clock();
    this.timeOfDay = 0.18;
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    // Create world and player
    this.world = new World(this.scene);
    this.player = new Player(this.camera, this.world);
    this.player.onJump = () => this.audio.playJump();
    this.mobManager = new MobManager(this.scene);
    this.audio = new AudioManager();

    this.clouds = [];
    this.createClouds();
    
    // Handle window resize
    window.addEventListener("resize", () => this.onWindowResize());
    
    // Handle controls and interactions
    this.setupInputHandling();
    this.setupTouchControls();
    this.updateSelectedBlockDisplay();
    this.updateMobDisplay();
    this.updateSoundDisplay();
    
    // Raycast for block interactions
    this.raycaster = new THREE.Raycaster();
  }
  
  setupScene() {
    this.daySky = new THREE.Color(0x89bfd9);
    this.nightSky = new THREE.Color(0x101829);
    this.dayFog = new THREE.Color(0x89bfd9);
    this.nightFog = new THREE.Color(0x171f2f);
    this.scene.background = this.daySky.clone();
    this.scene.fog = new THREE.Fog(this.dayFog.clone(), 80, 360);
    
    const hemiLight = new THREE.HemisphereLight(0xb8e7ff, 0x49614a, 0.58);
    this.scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xfff2d6, 0.95);
    sun.position.set(120, 180, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = -180;
    sun.shadow.camera.right = 180;
    sun.shadow.camera.top = 180;
    sun.shadow.camera.bottom = -180;
    sun.shadow.camera.far = 520;
    sun.shadow.bias = -0.0005;
    this.scene.add(sun);
    this.sunLight = sun;

    const bounce = new THREE.DirectionalLight(0xa6d2ff, 0.2);
    bounce.position.set(-60, 45, -80);
    this.scene.add(bounce);
    this.bounceLight = bounce;
  }

  createClouds() {
    const cloudGeo = new THREE.PlaneGeometry(14, 6);
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      depthWrite: false
    });

    for (let i = 0; i < 20; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat.clone());
      cloud.rotation.x = -Math.PI / 2;
      cloud.position.set((Math.random() - 0.5) * 220, 70 + Math.random() * 18, (Math.random() - 0.5) * 220);
      cloud.userData.speed = 2.5 + Math.random() * 4.5;
      cloud.userData.phase = Math.random() * Math.PI * 2;
      this.clouds.push(cloud);
      this.scene.add(cloud);
    }
  }
  
  setupInputHandling() {
    const unlockAudio = () => this.audio.unlock();
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio, { passive: true });

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
    if (!this.isTouchDevice) {
      this.renderer.domElement.addEventListener("click", () => {
        this.renderer.domElement.requestPointerLock =
          this.renderer.domElement.requestPointerLock ||
          this.renderer.domElement.mozRequestPointerLock;
        this.renderer.domElement.requestPointerLock();
      });
    }
    
    // Block selection (1-4 keys)
    document.addEventListener("keydown", (e) => {
      if (e.key >= "1" && e.key <= String(HOTBAR_BLOCKS.length)) {
        const blockIndex = parseInt(e.key) - 1;
        this.player.setSelectedBlock(HOTBAR_BLOCKS[blockIndex]);
        this.updateSelectedBlockDisplay();
      }

      if (e.key === "m" || e.key === "M") {
        this.audio.setEnabled(!this.audio.enabled);
        this.updateSoundDisplay();
      }
      
      // Reset spawn (R key)
      if (e.key === "r" || e.key === "R") {
        this.player.resetToSpawn();
      }
    });
  }

  setupTouchControls() {
    if (!this.isTouchDevice) {
      return;
    }

    document.body.classList.add("is-touch");

    const stick = document.getElementById("move-stick");
    const knob = stick ? stick.querySelector(".stick-knob") : null;
    const jumpButton = document.getElementById("touch-jump");
    const breakButton = document.getElementById("touch-break");
    const placeButton = document.getElementById("touch-place");
    const blockButton = document.getElementById("touch-block");
    const soundButton = document.getElementById("touch-sound");

    this.renderer.domElement.addEventListener("touchstart", () => {
      this.audio.unlock();
    }, { passive: true });

    if (jumpButton) {
      jumpButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.player.jump();
      }, { passive: false });
    }

    if (breakButton) {
      breakButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.breakBlock();
      }, { passive: false });
    }

    if (placeButton) {
      placeButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.placeBlock();
      }, { passive: false });
    }

    if (blockButton) {
      blockButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const currentIndex = Math.max(0, HOTBAR_BLOCKS.indexOf(this.player.selectedBlockType));
        const next = (currentIndex + 1) % HOTBAR_BLOCKS.length;
        this.player.setSelectedBlock(HOTBAR_BLOCKS[next]);
        this.updateSelectedBlockDisplay();
      }, { passive: false });
    }

    if (soundButton) {
      soundButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.audio.setEnabled(!this.audio.enabled);
        this.updateSoundDisplay();
      }, { passive: false });
    }

    if (stick && knob) {
      let stickTouchId = null;
      const stickRadius = 44;

      const updateStick = (touch) => {
        const rect = stick.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = touch.clientX - cx;
        const dy = touch.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const clamped = Math.min(stickRadius, dist);
        const nx = (dx / dist) * clamped;
        const ny = (dy / dist) * clamped;

        knob.style.transform = `translate(${nx}px, ${ny}px)`;
        this.player.setMoveInput(nx / stickRadius, -ny / stickRadius);
      };

      const resetStick = () => {
        knob.style.transform = "translate(0px, 0px)";
        this.player.setMoveInput(0, 0);
      };

      stick.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (stickTouchId !== null) return;
        const touch = e.changedTouches[0];
        stickTouchId = touch.identifier;
        updateStick(touch);
      }, { passive: false });

      stick.addEventListener("touchmove", (e) => {
        if (stickTouchId === null) return;
        for (const touch of e.changedTouches) {
          if (touch.identifier === stickTouchId) {
            e.preventDefault();
            updateStick(touch);
            break;
          }
        }
      }, { passive: false });

      const onStickEnd = (e) => {
        if (stickTouchId === null) return;
        for (const touch of e.changedTouches) {
          if (touch.identifier === stickTouchId) {
            stickTouchId = null;
            resetStick();
            break;
          }
        }
      };

      stick.addEventListener("touchend", onStickEnd, { passive: false });
      stick.addEventListener("touchcancel", onStickEnd, { passive: false });
    }

    let lookTouchId = null;
    let lastX = 0;
    let lastY = 0;

    this.renderer.domElement.addEventListener("touchstart", (e) => {
      for (const touch of e.changedTouches) {
        if (touch.clientX > window.innerWidth * 0.35) {
          lookTouchId = touch.identifier;
          lastX = touch.clientX;
          lastY = touch.clientY;
          break;
        }
      }
    }, { passive: true });

    this.renderer.domElement.addEventListener("touchmove", (e) => {
      if (lookTouchId === null) return;
      for (const touch of e.changedTouches) {
        if (touch.identifier === lookTouchId) {
          const dx = touch.clientX - lastX;
          const dy = touch.clientY - lastY;
          this.player.addLookDelta(dx, dy);
          lastX = touch.clientX;
          lastY = touch.clientY;
          e.preventDefault();
          break;
        }
      }
    }, { passive: false });

    const clearLookTouch = (e) => {
      if (lookTouchId === null) return;
      for (const touch of e.changedTouches) {
        if (touch.identifier === lookTouchId) {
          lookTouchId = null;
          break;
        }
      }
    };

    this.renderer.domElement.addEventListener("touchend", clearLookTouch, { passive: true });
    this.renderer.domElement.addEventListener("touchcancel", clearLookTouch, { passive: true });
  }
  
  breakBlock() {
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const mobIntersects = this.raycaster.intersectObjects(this.mobManager.getMeshes(), true);
    const blocks = this.world.getBlockMeshes();
    const intersects = this.raycaster.intersectObjects(blocks, false);

    const nearestMob = mobIntersects.length > 0 ? mobIntersects[0] : null;
    const nearestBlock = intersects.length > 0 ? intersects[0] : null;

    if (nearestMob && (!nearestBlock || nearestMob.distance < nearestBlock.distance)) {
      if (this.mobManager.hitMobByMesh(nearestMob.object)) {
        this.audio.playMobHit();
        this.updateMobDisplay();
      }
      return;
    }

    if (nearestBlock) {
      const point = nearestBlock.point;
      const normal = nearestBlock.face.normal;
      const blockPos = new THREE.Vector3()
        .copy(point)
        .sub(normal.multiplyScalar(0.5))
        .floor();

      const removed = this.world.removeBlock(blockPos);
      if (removed !== BlockType.AIR) {
        this.audio.playBreak();
      }
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
      
      const added = this.world.addBlock(blockPos, this.player.selectedBlockType);
      if (added) {
        this.audio.playPlace();
      }
    }
  }
  
  updateSelectedBlockDisplay() {
    const selectedType = this.player.selectedBlockType;
    const index = HOTBAR_BLOCKS.indexOf(selectedType);
    const slot = index >= 0 ? index + 1 : 1;
    const name = BLOCK_NAMES[selectedType] ?? "Unknown";
    const selectedDiv = document.getElementById("selected-block");
    if (selectedDiv) {
      selectedDiv.textContent = `Selected: ${name} (${slot})`;
    }
  }

  updateMobDisplay() {
    const mobDiv = document.getElementById("mob-count");
    if (mobDiv) {
      mobDiv.textContent = `Mobs nearby: ${this.mobManager.getCount()}`;
    }
  }

  updateSoundDisplay() {
    const soundDiv = document.getElementById("sound-state");
    if (soundDiv) {
      soundDiv.textContent = `Sound: ${this.audio.enabled ? "On" : "Off"}`;
    }
  }

  updateEnvironment(delta) {
    this.timeOfDay += delta * 0.025;
    const cycle = this.timeOfDay % 1;
    const sunAngle = cycle * Math.PI * 2;
    const daylight = Math.max(0.08, Math.sin(sunAngle) * 0.6 + 0.45);

    this.sunLight.position.set(Math.cos(sunAngle) * 180, 110 * daylight + 10, Math.sin(sunAngle) * 180);
    this.sunLight.intensity = 0.25 + daylight * 1.05;
    this.bounceLight.intensity = 0.1 + daylight * 0.22;
    this.renderer.toneMappingExposure = 0.7 + daylight * 0.72;

    const sky = this.nightSky.clone().lerp(this.daySky, daylight);
    const fog = this.nightFog.clone().lerp(this.dayFog, daylight);
    this.scene.background.copy(sky);
    this.scene.fog.color.copy(fog);

    for (const cloud of this.clouds) {
      cloud.position.x += cloud.userData.speed * delta;
      cloud.position.z += Math.sin(this.clock.elapsedTime * 0.15 + cloud.userData.phase) * 0.02;
      if (cloud.position.x > 120) {
        cloud.position.x = -120;
      }
      cloud.material.opacity = 0.12 + daylight * 0.16;
    }
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }
  
  start() {
    this.animate();
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.clock.getDelta(), 0.05);
    
    // Update player
    this.player.update();
    
    // Update camera
    this.camera.position.copy(this.player.position);
    this.camera.position.y += 1.6; // Eye height
    
    // Update world
    this.world.update(this.camera.position);
    this.mobManager.update(delta, this.player.position, this.world);
    this.updateMobDisplay();
    this.updateEnvironment(delta);
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
}
