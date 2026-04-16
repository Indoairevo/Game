// Simple Perlin-like noise function for terrain generation
export class SimplexNoise {
  constructor(seed = 0) {
    this.seed = seed;
    this.permutation = [];
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }
    // Fisher-Yates shuffle with seed
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((Math.sin(seed + i) + 1) * 0.5 * i);
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
    this.p = [...this.permutation, ...this.permutation];
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  perlin(x, y, z = 0) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = this.fade(xf);
    const v = this.fade(yf);
    const w = this.fade(zf);

    const a = this.p[xi] + yi;
    const aa = this.p[a] + zi;
    const ab = this.p[a + 1] + zi;
    const b = this.p[xi + 1] + yi;
    const ba = this.p[b] + zi;
    const bb = this.p[b + 1] + zi;

    const g1 = this.grad(this.p[aa], xf, yf, zf);
    const g2 = this.grad(this.p[ba], xf - 1, yf, zf);
    const g3 = this.grad(this.p[ab], xf, yf - 1, zf);
    const g4 = this.grad(this.p[bb], xf - 1, yf - 1, zf);

    const lerp1 = this.lerp(u, g1, g2);
    const lerp2 = this.lerp(u, g3, g4);
    return this.lerp(v, lerp1, lerp2);
  }
}
