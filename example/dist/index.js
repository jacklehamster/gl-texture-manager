// /Users/vincent/gl-texture-manager/example/node_modules/gl-texture-manager/dist/index.js
class Z {
  z;
  b;
  k;
  y;
  width;
  height;
  isVideo;
  #z = new Set;
  constructor(z, b, k, y) {
    this.id = z;
    this.texImgSrc = b;
    this.refreshRate = k;
    this.canvasImgSrc = y;
    const N = b;
    if (this.isVideo = !!(N.videoWidth || N.videoHeight), this.width = N.naturalWidth ?? N.videoWidth ?? N.displayWidth ?? N.width?.baseValue?.value ?? N.width, this.height = N.naturalHeight ?? N.videoHeight ?? N.displayHeight ?? N.height?.baseValue?.value ?? N.height, this.canvasImgSrc = y, !this.width || !this.height)
      throw new Error("Invalid image");
  }
  refresh() {
    this.refreshCallback?.();
  }
  static createFromCanvas(z, b) {
    return new Z(z, b, undefined, b);
  }
  static async loadImage(z, b) {
    const k = await new Promise((y, N) => {
      const U = new Image;
      U.crossOrigin = "anonymous";
      const w = (j) => N(j.error);
      U.addEventListener("error", w), U.addEventListener("load", () => y(U), { once: true }), U.src = b;
    });
    return new Z(z, k, undefined, k);
  }
  static async loadVideo(z, b, k, y = 30, N = 1, U = Number.MAX_SAFE_INTEGER) {
    const w = await new Promise((P, H) => {
      const F = document.createElement("video");
      if (F.loop = true, k !== undefined)
        F.volume = k;
      F.addEventListener("loadedmetadata", () => {
        F.play(), F.playbackRate = N, P(F);
      }, { once: true }), document.addEventListener("focus", () => F.play()), F.addEventListener("error", (h) => H(h.error)), F.src = b;
    }), j = new Z(z, w, Math.min(y * N, U));
    return j.#z.add(() => w.pause()), j;
  }
  static async loadWebcam(z, b) {
    const k = await new Promise((U, w) => {
      const j = document.createElement("video");
      j.loop = true, j.addEventListener("loadedmetadata", () => j.play()), j.addEventListener("playing", () => U(j), { once: true }), j.addEventListener("error", (P) => w(P.error));
    }), y = new Z(z, k);
    let N = false;
    return navigator.mediaDevices.getUserMedia({ video: { deviceId: b } }).then((U) => {
      if (!N)
        k.srcObject = U, y.#z.add(() => U.getTracks().forEach((w) => w.stop()));
    }), y.#z.add(() => {
      N = true, k.pause();
    }), y;
  }
  dispose() {
    this.#z.forEach((z) => z()), this.#z.clear();
  }
}
var T = function(z) {
  return z;
};

class v {
  renderProcedures = { image: T((z, b) => this.loadImage(z, b.src)), video: T((z, b) => this.loadVideo(z, b.src, b.volume, b.fps, b.playSpeed)), draw: T((z, b) => this.drawImage(z, b.draw)), canvas: T((z, b) => this.loadCanvas(z, b.canvas)), webcam: T((z, b) => this.loadWebCam(z, b.deviceId)) };
  async postProcess(z, b) {
    if (z.canvasImgSrc) {
      const k = new OffscreenCanvas(z.width, z.height);
      let y = k.getContext("2d");
      if (y)
        y.drawImage(z.canvasImgSrc, 0, 0), y = await b(y) ?? y;
      const N = z.id;
      return z.dispose(), Z.createFromCanvas(N, k);
    }
    return z;
  }
  async renderMedia(z, b) {
    const k = await this.renderProcedures[b.type](z, b), { postProcess: y } = b;
    return y ? this.postProcess(k, y) : k;
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
  async loadVideo(z, b, k, y, N, U) {
    return await Z.loadVideo(z, b, k, y, N, U);
  }
  async loadWebCam(z, b) {
    return await Z.loadWebcam(z, b);
  }
}
var W = globalThis.WebGL2RenderingContext ?? {};
var n = function(z, b = (k) => k.key) {
  var k = [];
  return M(z, "", true, (y) => k.push(y), b), k.join("");
};
var L = function(z) {
  if (z === null)
    return true;
  var b = p(z.left), k = p(z.right);
  if (Math.abs(b - k) <= 1 && L(z.left) && L(z.right))
    return true;
  return false;
};
var R = function(z, b, k, y, N) {
  const U = N - y;
  if (U > 0) {
    const w = y + Math.floor(U / 2), j = b[w], P = k[w], H = { key: j, data: P, parent: z };
    return H.left = R(H, b, k, y, w), H.right = R(H, b, k, w + 1, N), H;
  }
  return null;
};
var Q = function(z) {
  if (z === null)
    return 0;
  const b = Q(z.left), k = Q(z.right);
  return z.balanceFactor = b - k, Math.max(b, k) + 1;
};
var f = function(z, b, k, y, N) {
  if (k >= y)
    return;
  const U = z[k + y >> 1];
  let w = k - 1, j = y + 1;
  while (true) {
    do
      w++;
    while (N(z[w], U) < 0);
    do
      j--;
    while (N(z[j], U) > 0);
    if (w >= j)
      break;
    let P = z[w];
    z[w] = z[j], z[j] = P, P = b[w], b[w] = b[j], b[j] = P;
  }
  f(z, b, k, j, N), f(z, b, j + 1, y, N);
};
var S = function(z, b) {
  return Math.max(b, Math.pow(2, Math.ceil(Math.log(z) / Math.log(2))));
};
var O = function(z, b, k, y) {
  if (k < 1)
    throw new Error("Invalid count");
  const N = S(z, y.min), U = S(b, y.min), w = new Map;
  let j = y.min;
  for (let P = 1;P <= k; P++) {
    j = S(N * P, y.min);
    const H = S(U * Math.ceil(k / P), y.min);
    w.set(j, H);
  }
  for (let P = j;P <= y.max; P *= 2)
    if (!w.has(P))
      w.set(P, U);
  return w;
};
var M = function(z, b, k, y, N) {
  if (z) {
    y(`${b}${k ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 "}${N(z)}\n`);
    const U = b + (k ? "    " : "\u2502   ");
    if (z.left)
      M(z.left, U, false, y, N);
    if (z.right)
      M(z.right, U, true, y, N);
  }
};
var p = function(z) {
  return z ? 1 + Math.max(p(z.left), p(z.right)) : 0;
};
var u = function(z, b) {
  return z > b ? 1 : z < b ? -1 : 0;
};
var _ = function(z) {
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
var E = function(z) {
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
    this._comparator = z || u, this._root = null, this._size = 0, this._noDuplicates = !!b;
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
        var y = k(z, b.key);
        if (y === 0)
          return true;
        else if (y < 0)
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
    var b = this._root, k = [], y = false, N = 0;
    while (!y)
      if (b)
        k.push(b), b = b.left;
      else if (k.length > 0)
        b = k.pop(), z(b, N++), b = b.right;
      else
        y = true;
    return this;
  }
  range(z, b, k, y) {
    const N = [], U = this._comparator;
    let w = this._root, j;
    while (N.length !== 0 || w)
      if (w)
        N.push(w), w = w.left;
      else {
        if (w = N.pop(), j = U(w.key, b), j > 0)
          break;
        else if (U(w.key, z) >= 0) {
          if (k.call(y, w))
            return this;
        }
        w = w.right;
      }
    return this;
  }
  keys() {
    var z = this._root, b = [], k = [], y = false;
    while (!y)
      if (z)
        b.push(z), z = z.left;
      else if (b.length > 0)
        z = b.pop(), k.push(z.key), z = z.right;
      else
        y = true;
    return k;
  }
  values() {
    var z = this._root, b = [], k = [], y = false;
    while (!y)
      if (z)
        b.push(z), z = z.left;
      else if (b.length > 0)
        z = b.pop(), k.push(z.data), z = z.right;
      else
        y = true;
    return k;
  }
  at(z) {
    var b = this._root, k = [], y = false, N = 0;
    while (!y)
      if (b)
        k.push(b), b = b.left;
      else if (k.length > 0) {
        if (b = k.pop(), N === z)
          return b;
        N++, b = b.right;
      } else
        y = true;
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
    var b = this._root, k = b, y, N = this._comparator;
    while (k)
      if (y = N(z, k.key), y === 0)
        return k;
      else if (y < 0)
        k = k.left;
      else
        k = k.right;
    return null;
  }
  insert(z, b) {
    if (!this._root)
      return this._root = { parent: null, left: null, right: null, balanceFactor: 0, key: z, data: b }, this._size++, this._root;
    var k = this._comparator, y = this._root, N = null, U = 0;
    if (this._noDuplicates)
      while (y)
        if (U = k(z, y.key), N = y, U === 0)
          return null;
        else if (U < 0)
          y = y.left;
        else
          y = y.right;
    else
      while (y)
        if (U = k(z, y.key), N = y, U <= 0)
          y = y.left;
        else
          y = y.right;
    var w = { left: null, right: null, balanceFactor: 0, parent: N, key: z, data: b }, j;
    if (U <= 0)
      N.left = w;
    else
      N.right = w;
    while (N) {
      if (U = k(N.key, z), U < 0)
        N.balanceFactor -= 1;
      else
        N.balanceFactor += 1;
      if (N.balanceFactor === 0)
        break;
      else if (N.balanceFactor < -1) {
        if (N.right.balanceFactor === 1)
          E(N.right);
        if (j = _(N), N === this._root)
          this._root = j;
        break;
      } else if (N.balanceFactor > 1) {
        if (N.left.balanceFactor === -1)
          _(N.left);
        if (j = E(N), N === this._root)
          this._root = j;
        break;
      }
      N = N.parent;
    }
    return this._size++, w;
  }
  remove(z) {
    if (!this._root)
      return null;
    var b = this._root, k = this._comparator, y = 0;
    while (b)
      if (y = k(z, b.key), y === 0)
        break;
      else if (y < 0)
        b = b.left;
      else
        b = b.right;
    if (!b)
      return null;
    var N = b.key, U, w;
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
    var j = b.parent, P = b, H;
    while (j) {
      if (j.left === P)
        j.balanceFactor -= 1;
      else
        j.balanceFactor += 1;
      if (j.balanceFactor < -1) {
        if (j.right.balanceFactor === 1)
          E(j.right);
        if (H = _(j), j === this._root)
          this._root = H;
        j = H;
      } else if (j.balanceFactor > 1) {
        if (j.left.balanceFactor === -1)
          _(j.left);
        if (H = E(j), j === this._root)
          this._root = H;
        j = H;
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
    return this._size--, N;
  }
  load(z = [], b = [], k) {
    if (this._size !== 0)
      throw new Error("bulk-load: tree is not empty");
    const y = z.length;
    if (k)
      f(z, b, 0, y - 1, this._comparator);
    return this._root = R(null, z, b, 0, y), Q(this._root), this._size = y, this;
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
  constructor(z, b, k, y) {
    this.textureSizeLimits = k?.textureSizeLimits ?? y ?? { min: C, max: D }, this.size = z, this.slotNumber = b, this.parent = k, this.sibbling = undefined;
    const { x: N, y: U, textureIndex: w } = this.calculatePosition(z, b);
    this.x = N, this.y = U, this.textureIndex = w;
  }
  calculateTextureIndex(z, b) {
    const [k, y] = z, N = this.textureSizeLimits.max / k * (this.textureSizeLimits.max / y);
    return Math.floor(b / N);
  }
  calculatePosition(z, b) {
    const [k, y] = z, N = this.textureSizeLimits.max / k, U = this.textureSizeLimits.max / y, w = b % N * k, j = Math.floor(b / N) % U * y;
    return { x: w, y: j, textureIndex: this.calculateTextureIndex(z, b) };
  }
  getTag() {
    return A.getTag(this);
  }
  static getTag(z) {
    return `${z.size[0]}x${z.size[1]}-#${z.slotNumber}`;
  }
  static positionToTextureSlot(z, b, k, y, N) {
    const [U, w] = k, j = N.textureSizeLimits.max / U, P = N.textureSizeLimits.max / U * (N.textureSizeLimits.max / w) * y + b / w * j + z / U;
    return new A(k, P, N);
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
    const { x: z, y: b, size: k, textureIndex: y } = this, [N, U] = k;
    if (!this.canSplitHorizontally())
      throw new Error(`Cannot split texture slot of size ${N} horizontally`);
    const w = N / 2, j = A.positionToTextureSlot(z, b, [w, U], y, this), P = A.positionToTextureSlot(z + w, b, [w, U], y, this);
    return j.sibbling = P, P.sibbling = j, [j, P];
  }
  splitVertically() {
    const { x: z, y: b, size: k, textureIndex: y } = this, [N, U] = k;
    if (!this.canSplitVertically())
      throw new Error(`Cannot split texture slot of size ${U} vertically`);
    const w = U / 2, j = A.positionToTextureSlot(z, b, [N, w], y, this), P = A.positionToTextureSlot(z, b + w, [N, w], y, this);
    return j.sibbling = P, P.sibbling = j, [j, P];
  }
}
var x = false;
var C = 16;
var D = 4096;
var g = 16;

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
  constructor({ numTextureSheets: z, minTextureSize: b, maxTextureSize: k, excludeTexture: y } = {}, N) {
    if (this.numTextureSheets = z ?? g, this.minTextureSize = b ?? C, this.maxTextureSize = k ?? D, N)
      this.numTextureSheets = Math.min(this.numTextureSheets, N.getParameter(WebGL2RenderingContext.MAX_TEXTURE_IMAGE_UNITS)), this.maxTextureSize = Math.min(this.maxTextureSize, N.getParameter(WebGL2RenderingContext.MAX_TEXTURE_SIZE)), this.minTextureSize = Math.min(this.minTextureSize, this.maxTextureSize);
    for (let U = 0;U < this.numTextureSheets; U++) {
      if (y?.(U))
        continue;
      this.initialSlots.push(new A([this.maxTextureSize, this.maxTextureSize], U, undefined, { min: this.minTextureSize, max: this.maxTextureSize }));
    }
    this.initialSlots.forEach((U) => this.textureSlots.insert(U));
  }
  allocate(z, b, k = 1) {
    const { size: y, slotNumber: N, x: U, y: w, textureIndex: j } = this.allocateHelper(z, b, k);
    return { size: y, slotNumber: N, x: U, y: w, textureIndex: j };
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
    const y = O(z, b, k, { min: this.minTextureSize, max: this.maxTextureSize }), N = this.findSlot(y);
    if (!N)
      throw new Error(`Could not find a slot for texture to fit ${k} sprites of size ${z}x${b}`);
    this.textureSlots.remove(N);
    const [U, w] = this.bestFit(y, N);
    return this.fitSlot(N, U, w);
  }
  findSlot(z) {
    for (let b = 0;b < this.textureSlots.size; b++) {
      const k = this.textureSlots.at(b).key, [y, N] = k.size;
      if (z.get(y) <= N)
        return k;
    }
    return null;
  }
  calculateRatio(z, b) {
    return Math.max(z / b, b / z);
  }
  bestFit(z, b) {
    const [k, y] = b.size;
    let N = b.textureSizeLimits.max;
    return z.forEach((U, w) => {
      if (w <= k && U <= y) {
        const j = w * U, P = z.get(N) * N;
        if (j < P)
          N = w;
        else if (j === P) {
          if (this.calculateRatio(w, U) < this.calculateRatio(N, z.get(N)))
            N = w;
        }
      }
    }), [N, z.get(N)];
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
      const [y, N] = z.splitHorizontally();
      if (y.size[0] >= b)
        return this.textureSlots.insert(N), this.fitSlot(y, b, k);
    }
    return null;
  }
  trySplitVertically(z, b, k) {
    if (z.canSplitVertically()) {
      const [y, N] = z.splitVertically();
      if (y.size[1] >= k)
        return this.textureSlots.insert(N), this.fitSlot(y, b, k);
    }
    return null;
  }
  fitSlot(z, b, k) {
    if (this.allocatedTextures[z.getTag()] = z, z.size[0] > z.size[1]) {
      const y = this.trySplitHorizontally(z, b, k) ?? this.trySplitVertically(z, b, k);
      if (y)
        return y;
    } else {
      const y = this.trySplitVertically(z, b, k) ?? this.trySplitHorizontally(z, b, k);
      if (y)
        return y;
    }
    return z;
  }
}
var V = 15;
var $ = `TEXTURE${V}`;

class l {
  gl;
  texturesById = {};
  #z = new OffscreenCanvas(1, 1).getContext("2d");
  #b = new B({ excludeTexture: (z) => z === V });
  #k = new B({ excludeTexture: (z) => z !== V });
  #y = new Set;
  constructor({ gl: z, textureSlotAllocator: b = new B({ excludeTexture: (y) => y === V }), textureSlotAllocatorForVideo: k = new B({ excludeTexture: (y) => y !== V }) }) {
    this.gl = z, this.#b = b, this.#k = k, this.#z.imageSmoothingEnabled = true;
  }
  getTexture(z) {
    if (!this.texturesById[z]) {
      const b = this.gl.createTexture();
      if (!b)
        return;
      const k = z === $ ? this.#k : this.#b;
      this.texturesById[z] = b, this.gl.bindTexture(W.TEXTURE_2D, b), this.gl.texImage2D(W.TEXTURE_2D, 0, W.RGBA, k.maxTextureSize, k.maxTextureSize, 0, W.RGBA, W.UNSIGNED_BYTE, null), this.generateMipMap(z);
    }
    return this.texturesById[z];
  }
  loadTexture(z, b, k, y, N) {
    this.gl.activeTexture(W[b]), this.gl.bindTexture(W.TEXTURE_2D, k), this.applyTexImage2d(z, y, N), this.gl.texParameteri(W.TEXTURE_2D, W.TEXTURE_MIN_FILTER, W.LINEAR);
  }
  applyTexImage2d(z, [b, k, y, N], [U, w, j, P]) {
    if (y === j && N === P && !b && !k)
      this.gl.texSubImage2D(W.TEXTURE_2D, 0, U, w, j, P, W.RGBA, W.UNSIGNED_BYTE, z.texImgSrc);
    else {
      const H = this.#z.canvas;
      if (z.texImgSrc instanceof ImageData) {
        if (H.width = j || z.width, H.height = P || z.height, this.#z.putImageData(z.texImgSrc, 0, 0), b || k)
          console.warn("Offset not available when sending imageData");
      } else {
        const F = y || z.width, h = N || z.height;
        H.width = j || F, H.height = P || h, this.#z.drawImage(z.texImgSrc, b, k, F, h, 0, 0, H.width, H.height);
      }
      this.gl.texSubImage2D(W.TEXTURE_2D, 0, U, w, H.width, H.height, W.RGBA, W.UNSIGNED_BYTE, H);
    }
  }
  allocateSlotForImage(z) {
    const k = (z.isVideo ? this.#k : this.#b).allocate(z.width, z.height), y = `TEXTURE${k.textureIndex}`, N = this.getTexture(y);
    if (!N)
      throw new Error(`Invalid texture Id ${y}`);
    const U = this.assignImageToTexture(z, y, N, [0, 0, z.width, z.height], [k.x, k.y, k.size[0], k.size[1]]);
    return { slot: k, refreshCallback: U };
  }
  assignImageToTexture(z, b, k, y, N) {
    const U = y ?? [0, 0, z.width, z.height], w = N ?? [0, 0, U[2], U[3]], j = () => {
      this.gl.bindTexture(W.TEXTURE_2D, k), this.applyTexImage2d(z, U, w);
    };
    if (this.#y.has(z))
      j();
    else
      this.loadTexture(z, b, k, U, w), this.#y.add(z);
    return j;
  }
  setupTextureForVideo(z) {
    const b = this.getTexture(z);
    if (b)
      this.gl.activeTexture(W[z]), this.gl.bindTexture(W.TEXTURE_2D, b), this.gl.texParameteri(W.TEXTURE_2D, W.TEXTURE_MIN_FILTER, W.LINEAR), this.gl.texParameteri(W.TEXTURE_2D, W.TEXTURE_MAG_FILTER, W.LINEAR);
  }
  generateMipMap(z) {
    const b = this.getTexture(z);
    if (b)
      this.gl.activeTexture(W[z]), this.gl.bindTexture(W.TEXTURE_2D, b), this.gl.texParameteri(W.TEXTURE_2D, W.TEXTURE_MIN_FILTER, W.LINEAR_MIPMAP_LINEAR), this.gl.texParameteri(W.TEXTURE_2D, W.TEXTURE_MAG_FILTER, W.LINEAR), this.gl.generateMipmap(W.TEXTURE_2D);
  }
  dispose() {
    Object.values(this.texturesById).forEach((z) => {
      this.gl.deleteTexture(z);
    });
  }
}
export {
  l as TextureManager
};
