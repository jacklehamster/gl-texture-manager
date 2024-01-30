import { Slot } from "texture-slot-allocator";
import { MediaData, TextureId } from "..";

export interface ITextureManager {
  allocateSlotForImage(mediaInfo: MediaData): { slot: Slot, refreshCallback: () => void };
  setupTextureForVideo(textureId: TextureId): void;
  generateMipMap(textureId: TextureId): void;
}
