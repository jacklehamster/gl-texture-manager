// To recognize dom types (see https://bun.sh/docs/typescript#dom-types):
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />


import { GL } from '@/Constants';
import { MediaData } from './MediaData';
import { Slot, ITextureSlotAllocator, TextureSlotAllocator, TextureIndex } from "texture-slot-allocator";

export type TextureId = `TEXTURE${TextureIndex}`;
export const TEXTURE_INDEX_FOR_VIDEO: TextureIndex = 15;
const TEXTURE_ID_FOR_VIDEO: TextureId = `TEXTURE${TEXTURE_INDEX_FOR_VIDEO}`;

export type Url = string;

interface Props {
  gl: GL;
  textureSlotAllocator?: ITextureSlotAllocator;
  textureSlotAllocatorForVideo?: ITextureSlotAllocator;
}

export class TextureManager {
  private gl: GL;
  private texturesById: Record<TextureId | string, WebGLTexture> = {};
  #tempContext = (new OffscreenCanvas(1, 1)).getContext('2d')!;
  #textureSlotAllocator: ITextureSlotAllocator = new TextureSlotAllocator({
    excludeTexture: tex => tex === TEXTURE_INDEX_FOR_VIDEO,
  });
  #textureSlotAllocatorForVideo: ITextureSlotAllocator = new TextureSlotAllocator({
    excludeTexture: tex => tex !== TEXTURE_INDEX_FOR_VIDEO,
  });
  #activeMedias: Set<MediaData> = new Set();

  constructor({
    gl,
    textureSlotAllocator = new TextureSlotAllocator({
      excludeTexture: tex => tex === TEXTURE_INDEX_FOR_VIDEO,
    }),
    textureSlotAllocatorForVideo = new TextureSlotAllocator({
      excludeTexture: tex => tex !== TEXTURE_INDEX_FOR_VIDEO,
    })
  }: Props) {
    this.gl = gl;
    this.#textureSlotAllocator = textureSlotAllocator;
    this.#textureSlotAllocatorForVideo = textureSlotAllocatorForVideo
    this.#tempContext.imageSmoothingEnabled = true;
  }

  private getTexture(textureId: TextureId) {
    if (!this.texturesById[textureId]) {
      const texture = this.gl.createTexture();
      if (!texture) {
        return;
      }
      const allocator: ITextureSlotAllocator = textureId === TEXTURE_ID_FOR_VIDEO ? this.#textureSlotAllocatorForVideo : this.#textureSlotAllocator;
      this.texturesById[textureId] = texture;
      this.gl.bindTexture(GL.TEXTURE_2D, texture);
      this.gl.texImage2D(
        GL.TEXTURE_2D,
        0,
        GL.RGBA,
        allocator.maxTextureSize,
        allocator.maxTextureSize,
        0,
        GL.RGBA,
        GL.UNSIGNED_BYTE,
        null,
      );
      this.generateMipMap(textureId);
    }
    return this.texturesById[textureId];
  }

  private loadTexture(
    mediaInfo: MediaData,
    textureId: TextureId,
    texture: WebGLTexture,
    sourceRect: [number, number, number, number],
    destRect: [number, number, number, number],
  ): void {
    this.gl.activeTexture(GL[textureId]);
    this.gl.bindTexture(GL.TEXTURE_2D, texture);
    this.applyTexImage2d(mediaInfo, sourceRect, destRect);
    this.gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
  }

  applyTexImage2d(
    mediaInfo: MediaData,
    [srcX, srcY, srcWidth, srcHeight]: number[],
    [dstX, dstY, dstWidth, dstHeight]: number[],
  ): void {
    if (srcWidth === dstWidth && srcHeight === dstHeight && !srcX && !srcY) {
      this.gl.texSubImage2D(
        GL.TEXTURE_2D,
        0,
        dstX,
        dstY,
        dstWidth,
        dstHeight,
        GL.RGBA,
        GL.UNSIGNED_BYTE,
        mediaInfo.texImgSrc,
      );
    } else {
      const canvas = this.#tempContext.canvas;
      if (mediaInfo.texImgSrc instanceof ImageData) {
        canvas.width = dstWidth || mediaInfo.width;
        canvas.height = dstHeight || mediaInfo.height;
        this.#tempContext.putImageData(mediaInfo.texImgSrc, 0, 0);
        if (srcX || srcY) {
          console.warn('Offset not available when sending imageData');
        }
      } else {
        const sourceWidth = srcWidth || mediaInfo.width;
        const sourceHeight = srcHeight || mediaInfo.height;
        canvas.width = dstWidth || sourceWidth;
        canvas.height = dstHeight || sourceHeight;
        this.#tempContext.drawImage(
          mediaInfo.texImgSrc,
          srcX,
          srcY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          canvas.width,
          canvas.height,
        );
      }
      this.gl.texSubImage2D(
        GL.TEXTURE_2D,
        0,
        dstX,
        dstY,
        canvas.width,
        canvas.height,
        GL.RGBA,
        GL.UNSIGNED_BYTE,
        canvas,
      );
    }
  }

  allocateSlotForImage(mediaInfo: MediaData): { slot: Slot, refreshCallback: () => void } {
    const allocator: ITextureSlotAllocator = mediaInfo.isVideo ? this.#textureSlotAllocatorForVideo : this.#textureSlotAllocator;
    const slot = allocator.allocate(mediaInfo.width, mediaInfo.height);
    const textureId: TextureId = `TEXTURE${slot.textureIndex}`;
    const webGLTexture = this.getTexture(textureId);
    if (!webGLTexture) {
      throw new Error(`Invalid texture Id ${textureId}`);
    }

    const refreshCallback = this.assignImageToTexture(
      mediaInfo,
      textureId,
      webGLTexture,
      [0, 0, mediaInfo.width, mediaInfo.height],
      [slot.x, slot.y, slot.size[0], slot.size[1]],
    );
    return { slot, refreshCallback };
  }

  private assignImageToTexture(
    imageInfo: MediaData,
    textureId: TextureId,
    texture: WebGLTexture,
    sourceRect?: [number, number, number, number],
    destRect?: [number, number, number, number],
  ): () => void {
    const srcRect = sourceRect ?? [0, 0, imageInfo.width, imageInfo.height];
    const dstRect = destRect ?? [0, 0, srcRect[2], srcRect[3]];
    const refreshTexture = () => {
      this.gl.bindTexture(GL.TEXTURE_2D, texture);
      this.applyTexImage2d(imageInfo, srcRect, dstRect);
    };

    if (this.#activeMedias.has(imageInfo)) {
      refreshTexture();
    } else {
      this.loadTexture(imageInfo, textureId, texture, srcRect, dstRect);
      this.#activeMedias.add(imageInfo);
    }
    return refreshTexture;
  }

  setupTextureForVideo(textureId: TextureId) {
    const texture = this.getTexture(textureId);
    if (texture) {
      this.gl.activeTexture(GL[textureId]);
      this.gl.bindTexture(GL.TEXTURE_2D, texture);
      this.gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
      this.gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    }
  }

  generateMipMap(textureId: TextureId) {
    const texture = this.getTexture(textureId);
    if (texture) {
      this.gl.activeTexture(GL[textureId]);
      this.gl.bindTexture(GL.TEXTURE_2D, texture);
      this.gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
      this.gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
      this.gl.generateMipmap(GL.TEXTURE_2D);
    }
  }

  dispose() {
    Object.values(this.texturesById).forEach(texture => {
      this.gl.deleteTexture(texture);
    });
  }
}
