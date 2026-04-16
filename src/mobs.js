import * as THREE from "https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js";

class Mob {
  constructor(type, mesh) {
    this.type = type;
    this.mesh = mesh;
    this.hp = type === "cow" ? 4 : 3;
    this.maxHp = this.hp;
    this.velocity = new THREE.Vector3();
    this.wanderDir = new THREE.Vector3(1, 0, 0);
    this.nextTurnIn = 0.5 + Math.random() * 2.4;
    this.speed = type === "cow" ? 1.4 : 1.8;
    this.bob = Math.random() * Math.PI * 2;
  }
}

export class MobManager {
  constructor(scene) {
    this.scene = scene;
    this.mobs = [];
    this.maxMobs = 12;
    this.spawnRadius = 26;
    this.despawnRadius = 44;

    this.cowMaterial = new THREE.MeshStandardMaterial({
      color: 0x9f7f60,
      roughness: 0.86,
      metalness: 0.02
    });
    this.slimeMaterial = new THREE.MeshStandardMaterial({
      color: 0x77d66f,
      roughness: 0.35,
      metalness: 0.02,
      transparent: true,
      opacity: 0.86
    });
  }

  createMobMesh(type) {
    if (type === "cow") {
      const group = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 1.5), this.cowMaterial);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.52, 0.52), this.cowMaterial);
      const legGeo = new THREE.BoxGeometry(0.18, 0.55, 0.18);

      const legs = [
        new THREE.Mesh(legGeo, this.cowMaterial),
        new THREE.Mesh(legGeo, this.cowMaterial),
        new THREE.Mesh(legGeo, this.cowMaterial),
        new THREE.Mesh(legGeo, this.cowMaterial)
      ];

      body.position.set(0, 1.15, 0);
      head.position.set(0, 1.2, 0.95);
      legs[0].position.set(0.3, 0.62, 0.48);
      legs[1].position.set(-0.3, 0.62, 0.48);
      legs[2].position.set(0.3, 0.62, -0.48);
      legs[3].position.set(-0.3, 0.62, -0.48);

      group.add(body, head, ...legs);
      group.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      return group;
    }

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), this.slimeMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  spawnMob(playerPos, world) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * this.spawnRadius;
    const x = Math.floor(playerPos.x + Math.cos(angle) * radius);
    const z = Math.floor(playerPos.z + Math.sin(angle) * radius);
    const ground = world.getGroundLevel(new THREE.Vector3(x, world.worldMaxY, z));
    const y = ground + 1;

    const type = Math.random() > 0.45 ? "cow" : "slime";
    const mesh = this.createMobMesh(type);
    mesh.position.set(x + 0.5, y, z + 0.5);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    mesh.userData.isMob = true;

    const mob = new Mob(type, mesh);
    this.mobs.push(mob);
    this.scene.add(mesh);
  }

  getMeshes() {
    return this.mobs.map((mob) => mob.mesh);
  }

  hitMobByMesh(mesh) {
    const idx = this.mobs.findIndex((mob) => {
      if (mob.mesh === mesh) return true;
      let cursor = mesh;
      while (cursor && cursor.parent) {
        cursor = cursor.parent;
        if (cursor === mob.mesh) {
          return true;
        }
      }
      return false;
    });
    if (idx === -1) return false;

    const mob = this.mobs[idx];
    mob.hp -= 1;
    mob.velocity.y = 0.13;
    if (mob.hp <= 0) {
      this.scene.remove(mob.mesh);
      this.mobs.splice(idx, 1);
    }
    return true;
  }

  update(delta, playerPos, world) {
    if (this.mobs.length < this.maxMobs && Math.random() < 0.025) {
      this.spawnMob(playerPos, world);
    }

    for (let i = this.mobs.length - 1; i >= 0; i--) {
      const mob = this.mobs[i];
      const pos = mob.mesh.position;
      const dx = pos.x - playerPos.x;
      const dz = pos.z - playerPos.z;
      const dist = Math.hypot(dx, dz);

      if (dist > this.despawnRadius) {
        this.scene.remove(mob.mesh);
        this.mobs.splice(i, 1);
        continue;
      }

      mob.nextTurnIn -= delta;
      if (mob.nextTurnIn <= 0) {
        const ang = Math.random() * Math.PI * 2;
        mob.wanderDir.set(Math.cos(ang), 0, Math.sin(ang));
        mob.nextTurnIn = 0.8 + Math.random() * 2.4;
      }

      const speed = mob.speed * delta;
      pos.addScaledVector(mob.wanderDir, speed);

      const ground = world.getGroundLevel(new THREE.Vector3(pos.x, world.worldMaxY, pos.z));
      const targetY = ground + 1;
      mob.velocity.y -= 6.2 * delta;
      pos.y += mob.velocity.y * delta;
      if (pos.y < targetY) {
        pos.y = targetY;
        mob.velocity.y = 0;
      }

      mob.bob += delta * 5;
      const squash = mob.type === "slime" ? 1 + Math.sin(mob.bob) * 0.05 : 1;
      mob.mesh.scale.set(1 / squash, squash, 1 / squash);
      mob.mesh.rotation.y = Math.atan2(mob.wanderDir.x, mob.wanderDir.z);
    }
  }

  getCount() {
    return this.mobs.length;
  }
}
