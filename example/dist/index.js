// /Users/vincent/gl-texture-manager/example/node_modules/gl-texture-manager/dist/index.js
class Z {
  z;
  b;
  k;
  N;
  width;
  height;
  isVideo;
  #z = new Set;
  constructor(z, b, k, N) {
    this.id = z;
    this.texImgSrc = b;
    this.refreshRate = k;
    this.canvasImgSrc = N;
    const y = b;
    if (this.isVideo = !!(y.videoWidth || y.videoHeight), this.width = y.naturalWidth ?? y.videoWidth ?? y.displayWidth ?? y.width?.baseValue?.value ?? y.width, this.height = y.naturalHeight ?? y.videoHeight ?? y.displayHeight ?? y.height?.baseValue?.value ?? y.height, this.canvasImgSrc = N, !this.width || !this.height)
      throw new Error("Invalid image");
  }
  refresh() {
    this.refreshCallback?.();
  }
  static createFromCanvas(z, b) {
    return new Z(z, b);
  }
  static async loadImage(z, b) {
    const k = await new Promise((N, y) => {
      const U = new Image;
      U.crossOrigin = "anonymous";
      const w = (j) => y(j.error);
      U.addEventListener("error", w), U.addEventListener("load", () => N(U), { once: true }), U.src = b;
    });
    return new Z(z, k, undefined, k);
  }
  static async loadVideo(z, b, k, N = 30, y = 1, U = Number.MAX_SAFE_INTEGER) {
    const w = await new Promise((P, W) => {
      const F = document.createElement("video");
      if (F.loop = true, k !== undefined)
        F.volume = k;
      F.addEventListener("loadedmetadata", () => {
        F.play(), F.playbackRate = y, P(F);
      }, { once: true }), document.addEventListener("focus", () => F.play()), F.addEventListener("error", (h) => W(h.error)), F.src = b;
    }), j = new Z(z, w, Math.min(N * y, U));
    return j.#z.add(() => w.pause()), j;
  }
  static async loadWebcam(z, b) {
    const k = await new Promise((U, w) => {
      const j = document.createElement("video");
      j.loop = true, j.addEventListener("loadedmetadata", () => j.play()), j.addEventListener("playing", () => U(j), { once: true }), j.addEventListener("error", (P) => w(P.error));
    }), N = new Z(z, k);
    let y = false;
    return navigator.mediaDevices.getUserMedia({ video: { deviceId: b } }).then((U) => {
      if (!y)
        k.srcObject = U, N.#z.add(() => U.getTracks().forEach((w) => w.stop()));
    }), N.#z.add(() => {
      y = true, k.pause();
    }), N;
  }
  dispose() {
    this.#z.forEach((z) => z()), this.#z.clear();
  }
}
var S = function(z) {
  return z;
};

class v {
  renderProcedures = { image: S((z, b) => this.loadImage(z, b.src)), video: S((z, b) => this.loadVideo(z, b.src, b.volume, b.fps, b.playSpeed)), draw: S((z, b) => this.drawImage(z, b.draw)), canvas: S((z, b) => this.loadCanvas(z, b.canvas)), webcam: S((z, b) => this.loadWebCam(z, b.deviceId)) };
  async postProcess(z, b) {
    if (z.canvasImgSrc) {
      const k = new OffscreenCanvas(z.width, z.height), N = k.getContext("2d");
      if (N)
        N.drawImage(z.canvasImgSrc, 0, 0), await b(N);
      const y = z.id;
      return z.dispose(), Z.createFromCanvas(y, k);
    }
    return z;
  }
  async renderMedia(z, b) {
    const k = await this.renderProcedures[b.type](z, b), { postProcessing: N } = b;
    return N ? this.postProcess(k, N) : k;
  }
  async drawImage(z, b) {
    const k = new OffscreenCanvas(1, 1);
    return b(k.getContext("2d")), Z.createFromCanvas(z, k);
  }
  async loadCanvas(z, b) {
    return Z.createFromCanvas(z, b);
  }
  async loadImage(z, b) {
    return await Z.loadImage(z, b);
  }
  async loadVideo(z, b, k, N, y, U) {
    return await Z.loadVideo(z, b, k, N, y, U);
  }
  async loadWebCam(z, b) {
    return await Z.loadWebcam(z, b);
  }
}
var H = globalThis.WebGL2RenderingContext ?? {};
var n = function(z, b = (k) => k.key) {
  var k = [];
  return M(z, "", true, (N) => k.push(N), b), k.join("");
};
var L = function(z) {
  if (z === null)
    return true;
  var b = E(z.left), k = E(z.right);
  if (Math.abs(b - k) <= 1 && L(z.left) && L(z.right))
    return true;
  return false;
};
var R = function(z, b, k, N, y) {
  const U = y - N;
  if (U > 0) {
    const w = N + Math.floor(U / 2), j = b[w], P = k[w], W = { key: j, data: P, parent: z };
    return W.left = R(W, b, k, N, w), W.right = R(W, b, k, w + 1, y), W;
  }
  return null;
};
var Q = function(z) {
  if (z === null)
    return 0;
  const b = Q(z.left), k = Q(z.right);
  return z.balanceFactor = b - k, Math.max(b, k) + 1;
};
var f = function(z, b, k, N, y) {
  if (k >= N)
    return;
  const U = z[k + N >> 1];
  let w = k - 1, j = N + 1;
  while (true) {
    do
      w++;
    while (y(z[w], U) < 0);
    do
      j--;
    while (y(z[j], U) > 0);
    if (w >= j)
      break;
    let P = z[w];
    z[w] = z[j], z[j] = P, P = b[w], b[w] = b[j], b[j] = P;
  }
  f(z, b, k, j, y), f(z, b, j + 1, N, y);
};
var p = function(z, b) {
  return Math.max(b, Math.pow(2, Math.ceil(Math.log(z) / Math.log(2))));
};
var u = function(z, b, k, N) {
  if (k < 1)
    throw new Error("Invalid count");
  const y = p(z, N.min), U = p(b, N.min), w = new Map;
  let j = N.min;
  for (let P = 1;P <= k; P++) {
    j = p(y * P, N.min);
    const W = p(U * Math.ceil(k / P), N.min);
    w.set(j, W);
  }
  for (let P = j;P <= N.max; P *= 2)
    if (!w.has(P))
      w.set(P, U);
  return w;
};
var M = function(z, b, k, N, y) {
  if (z) {
    N(`${b}${k ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 "}${y(z)}\n`);
    const U = b + (k ? "    " : "\u2502   ");
    if (z.left)
      M(z.left, U, false, N, y);
    if (z.right)
      M(z.right, U, true, N, y);
  }
};
var E = function(z) {
  return z ? 1 + Math.max(E(z.left), E(z.right)) : 0;
};
var O = function(z, b) {
  return z > b ? 1 : z < b ? -1 : 0;
};
var T = function(z) {
  var b = z.right;
  if (z.right = b.left, b.left)
    b.left.parent = z;
  if (b.parent = z.parent, b.parent)
    if (b.parent.left === z)
      b.parent.left = b;
    else
      b.parent.right = b;
  if (z.parent = b, b.left = z, z.balanceFactor += 1, b.balanceFactor < 0)
    z.balanceFactor -= b.balanceFactor;
  if (b.balanceFactor += 1, z.balanceFactor > 0)
    b.balanceFactor += z.balanceFactor;
  return b;
};
var _ = function(z) {
  var b = z.left;
  if (z.left = b.right, z.left)
    z.left.parent = z;
  if (b.parent = z.parent, b.parent)
    if (b.parent.left === z)
      b.parent.left = b;
    else
      b.parent.right = b;
  if (z.parent = b, b.right = z, z.balanceFactor -= 1, b.balanceFactor > 0)
    z.balanceFactor -= b.balanceFactor;
  if (b.balanceFactor -= 1, z.balanceFactor < 0)
    b.balanceFactor += z.balanceFactor;
  return b;
};

class X {
  constructor(z, b = false) {
    this._comparator = z || O, this._root = null, this._size = 0, this._noDuplicates = !!b;
  }
  destroy() {
    return this.clear();
  }
  clear() {
    return this._root = null, this._size = 0, this;
  }
  get size() {
    return this._size;
  }
  contains(z) {
    if (this._root) {
      var b = this._root, k = this._comparator;
      while (b) {
        var N = k(z, b.key);
        if (N === 0)
          return true;
        else if (N < 0)
          b = b.left;
        else
          b = b.right;
      }
    }
    return false;
  }
  next(z) {
    var b = z;
    if (b)
      if (b.right) {
        b = b.right;
        while (b.left)
          b = b.left;
      } else {
        b = z.parent;
        while (b && b.right === z)
          z = b, b = b.parent;
      }
    return b;
  }
  prev(z) {
    var b = z;
    if (b)
      if (b.left) {
        b = b.left;
        while (b.right)
          b = b.right;
      } else {
        b = z.parent;
        while (b && b.left === z)
          z = b, b = b.parent;
      }
    return b;
  }
  forEach(z) {
    var b = this._root, k = [], N = false, y = 0;
    while (!N)
      if (b)
        k.push(b), b = b.left;
      else if (k.length > 0)
        b = k.pop(), z(b, y++), b = b.right;
      else
        N = true;
    return this;
  }
  range(z, b, k, N) {
    const y = [], U = this._comparator;
    let w = this._root, j;
    while (y.length !== 0 || w)
      if (w)
        y.push(w), w = w.left;
      else {
        if (w = y.pop(), j = U(w.key, b), j > 0)
          break;
        else if (U(w.key, z) >= 0) {
          if (k.call(N, w))
            return this;
        }
        w = w.right;
      }
    return this;
  }
  keys() {
    var z = this._root, b = [], k = [], N = false;
    while (!N)
      if (z)
        b.push(z), z = z.left;
      else if (b.length > 0)
        z = b.pop(), k.push(z.key), z = z.right;
      else
        N = true;
    return k;
  }
  values() {
    var z = this._root, b = [], k = [], N = false;
    while (!N)
      if (z)
        b.push(z), z = z.left;
      else if (b.length > 0)
        z = b.pop(), k.push(z.data), z = z.right;
      else
        N = true;
    return k;
  }
  at(z) {
    var b = this._root, k = [], N = false, y = 0;
    while (!N)
      if (b)
        k.push(b), b = b.left;
      else if (k.length > 0) {
        if (b = k.pop(), y === z)
          return b;
        y++, b = b.right;
      } else
        N = true;
    return null;
  }
  minNode() {
    var z = this._root;
    if (!z)
      return null;
    while (z.left)
      z = z.left;
    return z;
  }
  maxNode() {
    var z = this._root;
    if (!z)
      return null;
    while (z.right)
      z = z.right;
    return z;
  }
  min() {
    var z = this._root;
    if (!z)
      return null;
    while (z.left)
      z = z.left;
    return z.key;
  }
  max() {
    var z = this._root;
    if (!z)
      return null;
    while (z.right)
      z = z.right;
    return z.key;
  }
  isEmpty() {
    return !this._root;
  }
  pop() {
    var z = this._root, b = null;
    if (z) {
      while (z.left)
        z = z.left;
      b = { key: z.key, data: z.data }, this.remove(z.key);
    }
    return b;
  }
  popMax() {
    var z = this._root, b = null;
    if (z) {
      while (z.right)
        z = z.right;
      b = { key: z.key, data: z.data }, this.remove(z.key);
    }
    return b;
  }
  find(z) {
    var b = this._root, k = b, N, y = this._comparator;
    while (k)
      if (N = y(z, k.key), N === 0)
        return k;
      else if (N < 0)
        k = k.left;
      else
        k = k.right;
    return null;
  }
  insert(z, b) {
    if (!this._root)
      return this._root = { parent: null, left: null, right: null, balanceFactor: 0, key: z, data: b }, this._size++, this._root;
    var k = this._comparator, N = this._root, y = null, U = 0;
    if (this._noDuplicates)
      while (N)
        if (U = k(z, N.key), y = N, U === 0)
          return null;
        else if (U < 0)
          N = N.left;
        else
          N = N.right;
    else
      while (N)
        if (U = k(z, N.key), y = N, U <= 0)
          N = N.left;
        else
          N = N.right;
    var w = { left: null, right: null, balanceFactor: 0, parent: y, key: z, data: b }, j;
    if (U <= 0)
      y.left = w;
    else
      y.right = w;
    while (y) {
      if (U = k(y.key, z), U < 0)
        y.balanceFactor -= 1;
      else
        y.balanceFactor += 1;
      if (y.balanceFactor === 0)
        break;
      else if (y.balanceFactor < -1) {
        if (y.right.balanceFactor === 1)
          _(y.right);
        if (j = T(y), y === this._root)
          this._root = j;
        break;
      } else if (y.balanceFactor > 1) {
        if (y.left.balanceFactor === -1)
          T(y.left);
        if (j = _(y), y === this._root)
          this._root = j;
        break;
      }
      y = y.parent;
    }
    return this._size++, w;
  }
  remove(z) {
    if (!this._root)
      return null;
    var b = this._root, k = this._comparator, N = 0;
    while (b)
      if (N = k(z, b.key), N === 0)
        break;
      else if (N < 0)
        b = b.left;
      else
        b = b.right;
    if (!b)
      return null;
    var y = b.key, U, w;
    if (b.left) {
      U = b.left;
      while (U.left || U.right) {
        while (U.right)
          U = U.right;
        if (b.key = U.key, b.data = U.data, U.left)
          b = U, U = U.left;
      }
      b.key = U.key, b.data = U.data, b = U;
    }
    if (b.right) {
      w = b.right;
      while (w.left || w.right) {
        while (w.left)
          w = w.left;
        if (b.key = w.key, b.data = w.data, w.right)
          b = w, w = w.right;
      }
      b.key = w.key, b.data = w.data, b = w;
    }
    var j = b.parent, P = b, W;
    while (j) {
      if (j.left === P)
        j.balanceFactor -= 1;
      else
        j.balanceFactor += 1;
      if (j.balanceFactor < -1) {
        if (j.right.balanceFactor === 1)
          _(j.right);
        if (W = T(j), j === this._root)
          this._root = W;
        j = W;
      } else if (j.balanceFactor > 1) {
        if (j.left.balanceFactor === -1)
          T(j.left);
        if (W = _(j), j === this._root)
          this._root = W;
        j = W;
      }
      if (j.balanceFactor === -1 || j.balanceFactor === 1)
        break;
      P = j, j = j.parent;
    }
    if (b.parent)
      if (b.parent.left === b)
        b.parent.left = null;
      else
        b.parent.right = null;
    if (b === this._root)
      this._root = null;
    return this._size--, y;
  }
  load(z = [], b = [], k) {
    if (this._size !== 0)
      throw new Error("bulk-load: tree is not empty");
    const N = z.length;
    if (k)
      f(z, b, 0, N - 1, this._comparator);
    return this._root = R(null, z, b, 0, N), Q(this._root), this._size = N, this;
  }
  isBalanced() {
    return L(this._root);
  }
  toString(z) {
    return n(this._root, z);
  }
}
X.default = X;

class A {
  size;
  slotNumber;
  x;
  y;
  textureIndex;
  parent;
  sibbling;
  textureSizeLimits;
  constructor(z, b, k, N) {
    this.textureSizeLimits = k?.textureSizeLimits ?? N ?? { min: C, max: l }, this.size = z, this.slotNumber = b, this.parent = k, this.sibbling = undefined;
    const { x: y, y: U, textureIndex: w } = this.calculatePosition(z, b);
    this.x = y, this.y = U, this.textureIndex = w;
  }
  calculateTextureIndex(z, b) {
    const [k, N] = z, y = this.textureSizeLimits.max / k * (this.textureSizeLimits.max / N);
    return Math.floor(b / y);
  }
  calculatePosition(z, b) {
    const [k, N] = z, y = this.textureSizeLimits.max / k, U = this.textureSizeLimits.max / N, w = b % y * k, j = Math.floor(b / y) % U * N;
    return { x: w, y: j, textureIndex: this.calculateTextureIndex(z, b) };
  }
  getTag() {
    return A.getTag(this);
  }
  static getTag(z) {
    return `${z.size[0]}x${z.size[1]}-#${z.slotNumber}`;
  }
  static positionToTextureSlot(z, b, k, N, y) {
    const [U, w] = k, j = y.textureSizeLimits.max / U, P = y.textureSizeLimits.max / U * (y.textureSizeLimits.max / w) * N + b / w * j + z / U;
    return new A(k, P, y);
  }
  getPosition() {
    return { x: this.x, y: this.y, size: this.size, textureIndex: this.textureIndex };
  }
  canSplitHorizontally() {
    const [, z] = this.size;
    return z > this.textureSizeLimits.min;
  }
  canSplitVertically() {
    const [z] = this.size;
    return z > this.textureSizeLimits.min;
  }
  splitHorizontally() {
    const { x: z, y: b, size: k, textureIndex: N } = this, [y, U] = k;
    if (!this.canSplitHorizontally())
      throw new Error(`Cannot split texture slot of size ${y} horizontally`);
    const w = y / 2, j = A.positionToTextureSlot(z, b, [w, U], N, this), P = A.positionToTextureSlot(z + w, b, [w, U], N, this);
    return j.sibbling = P, P.sibbling = j, [j, P];
  }
  splitVertically() {
    const { x: z, y: b, size: k, textureIndex: N } = this, [y, U] = k;
    if (!this.canSplitVertically())
      throw new Error(`Cannot split texture slot of size ${U} vertically`);
    const w = U / 2, j = A.positionToTextureSlot(z, b, [y, w], N, this), P = A.positionToTextureSlot(z, b + w, [y, w], N, this);
    return j.sibbling = P, P.sibbling = j, [j, P];
  }
}
var x = false;
var C = 16;
var l = 4096;
var $ = 16;

class B {
  textureSlots = new X((z, b) => {
    const k = z.size[0] * z.size[1] - b.size[0] * b.size[1];
    if (k !== 0)
      return k;
    return z.slotNumber - b.slotNumber;
  }, false);
  allocatedTextures = {};
  minTextureSize;
  maxTextureSize;
  numTextureSheets;
  initialSlots = [];
  constructor({ numTextureSheets: z, minTextureSize: b, maxTextureSize: k, excludeTexture: N } = {}, y) {
    if (this.numTextureSheets = z ?? $, this.minTextureSize = b ?? C, this.maxTextureSize = k ?? l, y)
      this.numTextureSheets = Math.min(this.numTextureSheets, y.getParameter(WebGL2RenderingContext.MAX_TEXTURE_IMAGE_UNITS)), this.maxTextureSize = Math.min(this.maxTextureSize, y.getParameter(WebGL2RenderingContext.MAX_TEXTURE_SIZE)), this.minTextureSize = Math.min(this.minTextureSize, this.maxTextureSize);
    for (let U = 0;U < this.numTextureSheets; U++) {
      if (N?.(U))
        continue;
      this.initialSlots.push(new A([this.maxTextureSize, this.maxTextureSize], U, undefined, { min: this.minTextureSize, max: this.maxTextureSize }));
    }
    this.initialSlots.forEach((U) => this.textureSlots.insert(U));
  }
  allocate(z, b, k = 1) {
    const { size: N, slotNumber: y, x: U, y: w, textureIndex: j } = this.allocateHelper(z, b, k);
    return { size: N, slotNumber: y, x: U, y: w, textureIndex: j };
  }
  deallocate(z) {
    if (!this.isSlotUsed(z))
      throw new Error("Slot is not allocated");
    const b = this.allocatedTextures[A.getTag(z)];
    this.deallocateHelper(b);
  }
  get countUsedTextureSheets() {
    return this.initialSlots.filter((z) => this.isSlotUsed(z)).length;
  }
  allocateHelper(z, b, k = 1) {
    const N = u(z, b, k, { min: this.minTextureSize, max: this.maxTextureSize }), y = this.findSlot(N);
    if (!y)
      throw new Error(`Could not find a slot for texture to fit ${k} sprites of size ${z}x${b}`);
    this.textureSlots.remove(y);
    const [U, w] = this.bestFit(N, y);
    return this.fitSlot(y, U, w);
  }
  findSlot(z) {
    for (let b = 0;b < this.textureSlots.size; b++) {
      const k = this.textureSlots.at(b).key, [N, y] = k.size;
      if (z.get(N) <= y)
        return k;
    }
    return null;
  }
  calculateRatio(z, b) {
    return Math.max(z / b, b / z);
  }
  bestFit(z, b) {
    const [k, N] = b.size;
    let y = b.textureSizeLimits.max;
    return z.forEach((U, w) => {
      if (w <= k && U <= N) {
        const j = w * U, P = z.get(y) * y;
        if (j < P)
          y = w;
        else if (j === P) {
          if (this.calculateRatio(w, U) < this.calculateRatio(y, z.get(y)))
            y = w;
        }
      }
    }), [y, z.get(y)];
  }
  isSlotUsed(z) {
    return !!this.allocatedTextures[A.getTag(z)];
  }
  deallocateHelper(z) {
    if (z.parent && z.sibbling && !this.isSlotUsed(z.sibbling)) {
      const b = z.sibbling;
      if (this.textureSlots.remove(b), x && this.textureSlots.find(z))
        throw new Error("Slot is not expected to be in the tree");
      const k = z.parent;
      this.deallocateHelper(k);
      return;
    }
    this.textureSlots.insert(z), delete this.allocatedTextures[z.getTag()];
  }
  trySplitHorizontally(z, b, k) {
    if (z.canSplitHorizontally()) {
      const [N, y] = z.splitHorizontally();
      if (N.size[0] >= b)
        return this.textureSlots.insert(y), this.fitSlot(N, b, k);
    }
    return null;
  }
  trySplitVertically(z, b, k) {
    if (z.canSplitVertically()) {
      const [N, y] = z.splitVertically();
      if (N.size[1] >= k)
        return this.textureSlots.insert(y), this.fitSlot(N, b, k);
    }
    return null;
  }
  fitSlot(z, b, k) {
    if (this.allocatedTextures[z.getTag()] = z, z.size[0] > z.size[1]) {
      const N = this.trySplitHorizontally(z, b, k) ?? this.trySplitVertically(z, b, k);
      if (N)
        return N;
    } else {
      const N = this.trySplitVertically(z, b, k) ?? this.trySplitHorizontally(z, b, k);
      if (N)
        return N;
    }
    return z;
  }
}
var V = 15;
var g = `TEXTURE${V}`;

class D {
  gl;
  texturesById = {};
  #z = new OffscreenCanvas(1, 1).getContext("2d");
  #b = new B({ excludeTexture: (z) => z === V });
  #k = new B({ excludeTexture: (z) => z !== V });
  #N = new Set;
  constructor({ gl: z, textureSlotAllocator: b = new B({ excludeTexture: (N) => N === V }), textureSlotAllocatorForVideo: k = new B({ excludeTexture: (N) => N !== V }) }) {
    this.gl = z, this.#b = b, this.#k = k, this.#z.imageSmoothingEnabled = true;
  }
  getTexture(z) {
    if (!this.texturesById[z]) {
      const b = this.gl.createTexture();
      if (!b)
        return;
      const k = z === g ? this.#k : this.#b;
      this.texturesById[z] = b, this.gl.bindTexture(H.TEXTURE_2D, b), this.gl.texImage2D(H.TEXTURE_2D, 0, H.RGBA, k.maxTextureSize, k.maxTextureSize, 0, H.RGBA, H.UNSIGNED_BYTE, null), this.generateMipMap(z);
    }
    return this.texturesById[z];
  }
  loadTexture(z, b, k, N, y) {
    this.gl.activeTexture(H[b]), this.gl.bindTexture(H.TEXTURE_2D, k), this.applyTexImage2d(z, N, y), this.gl.texParameteri(H.TEXTURE_2D, H.TEXTURE_MIN_FILTER, H.LINEAR);
  }
  applyTexImage2d(z, [b, k, N, y], [U, w, j, P]) {
    if (N === j && y === P && !b && !k)
      this.gl.texSubImage2D(H.TEXTURE_2D, 0, U, w, j, P, H.RGBA, H.UNSIGNED_BYTE, z.texImgSrc);
    else {
      const W = this.#z.canvas;
      if (z.texImgSrc instanceof ImageData) {
        if (W.width = j || z.width, W.height = P || z.height, this.#z.putImageData(z.texImgSrc, 0, 0), b || k)
          console.warn("Offset not available when sending imageData");
      } else {
        const F = N || z.width, h = y || z.height;
        W.width = j || F, W.height = P || h, this.#z.drawImage(z.texImgSrc, b, k, F, h, 0, 0, W.width, W.height);
      }
      this.gl.texSubImage2D(H.TEXTURE_2D, 0, U, w, W.width, W.height, H.RGBA, H.UNSIGNED_BYTE, W);
    }
  }
  allocateSlotForImage(z) {
    const k = (z.isVideo ? this.#k : this.#b).allocate(z.width, z.height), N = `TEXTURE${k.textureIndex}`, y = this.getTexture(N);
    if (!y)
      throw new Error(`Invalid texture Id ${N}`);
    const U = this.assignImageToTexture(z, N, y, [0, 0, z.width, z.height], [k.x, k.y, k.size[0], k.size[1]]);
    return { slot: k, refreshCallback: U };
  }
  assignImageToTexture(z, b, k, N, y) {
    const U = N ?? [0, 0, z.width, z.height], w = y ?? [0, 0, U[2], U[3]], j = () => {
      this.gl.bindTexture(H.TEXTURE_2D, k), this.applyTexImage2d(z, U, w);
    };
    if (this.#N.has(z))
      j();
    else
      this.loadTexture(z, b, k, U, w), this.#N.add(z);
    return j;
  }
  setupTextureForVideo(z) {
    const b = this.getTexture(z);
    if (b)
      this.gl.activeTexture(H[z]), this.gl.bindTexture(H.TEXTURE_2D, b), this.gl.texParameteri(H.TEXTURE_2D, H.TEXTURE_MIN_FILTER, H.LINEAR), this.gl.texParameteri(H.TEXTURE_2D, H.TEXTURE_MAG_FILTER, H.LINEAR);
  }
  generateMipMap(z) {
    const b = this.getTexture(z);
    if (b)
      this.gl.activeTexture(H[z]), this.gl.bindTexture(H.TEXTURE_2D, b), this.gl.texParameteri(H.TEXTURE_2D, H.TEXTURE_MIN_FILTER, H.LINEAR_MIPMAP_LINEAR), this.gl.texParameteri(H.TEXTURE_2D, H.TEXTURE_MAG_FILTER, H.LINEAR), this.gl.generateMipmap(H.TEXTURE_2D);
  }
  dispose() {
    Object.values(this.texturesById).forEach((z) => {
      this.gl.deleteTexture(z);
    });
  }
}
export {
  D as TextureManager
};
