import { MediaId } from "./MediaId";
import { Media } from "./Media";
import { MediaData } from "./MediaData";
import { Url } from "./TextureManager";

export interface IImageManager {
  renderMedia(imageId: MediaId, media: Media): Promise<MediaData>;
  drawImage(
    imageId: MediaId,
    drawProcedure: (context: OffscreenCanvasRenderingContext2D) => void,
  ): Promise<MediaData>;
  loadCanvas(
    imageId: MediaId,
    canvas: HTMLCanvasElement | OffscreenCanvas,
  ): Promise<MediaData>;
  loadVideo(
    imageId: MediaId,
    src: Url,
    volume?: number,
    fps?: number,
    playSpeed?: number,
    maxRefreshRate?: number,
  ): Promise<MediaData>;
  loadWebCam(
    imageId: MediaId,
    deviceId: string | undefined,
  ): Promise<MediaData>;
}
