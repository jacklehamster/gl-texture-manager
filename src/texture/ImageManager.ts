import { Url } from "./TextureManager";
import { MediaData } from "./MediaData";
import { CanvasMedia, DrawMedia, ImageMedia, Media, MediaType, VideoMedia, WebcamMedia } from "./Media";
import { IImageManager } from "./IImageManager";

export type MediaId = number;

type DrawProcedure<T extends Media> = (imageId: MediaId, media: T) => Promise<MediaData>;

function createDrawProcedure<T extends Media>(procedure: DrawProcedure<T>): DrawProcedure<T> {
  return procedure;
}

export class ImageManager implements IImageManager {
  private readonly renderProcedures: Record<MediaType, DrawProcedure<Media>> = {
    image: createDrawProcedure<ImageMedia>((imageId, media) => this.loadImage(imageId, media.src)) as DrawProcedure<Media>,
    video: createDrawProcedure<VideoMedia>((imageId, media) => this.loadVideo(imageId, media.src, media.volume, media.fps, media.playSpeed)) as DrawProcedure<Media>,
    draw: createDrawProcedure<DrawMedia>((imageId, media) => this.drawImage(imageId, media.draw)) as DrawProcedure<Media>,
    canvas: createDrawProcedure<CanvasMedia>((imageId, media) => this.loadCanvas(imageId, media.canvas)) as DrawProcedure<Media>,
    webcam: createDrawProcedure<WebcamMedia>((imageId, media) => this.loadWebCam(imageId, media.deviceId)) as DrawProcedure<Media>,
  };

  private async postProcess(mediaData: MediaData, postProcessing: (context: OffscreenCanvasRenderingContext2D) => Promise<void> | void) {
    if (mediaData.canvasImgSrc) {
      const canvas = new OffscreenCanvas(mediaData.width, mediaData.height);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(mediaData.canvasImgSrc, 0, 0);
        await postProcessing(ctx);
      }
      const id = mediaData.id;
      mediaData.dispose();
      return MediaData.createFromCanvas(id, canvas);
    }
    return mediaData;
  }

  async renderMedia(imageId: MediaId, media: Media): Promise<MediaData> {
    const mediaData = await this.renderProcedures[media.type](imageId, media);
    const { postProcessing } = media;
    return postProcessing ? this.postProcess(mediaData, postProcessing) : mediaData;
  }

  async drawImage(
    imageId: MediaId,
    drawProcedure: (context: OffscreenCanvasRenderingContext2D) => void,
  ): Promise<MediaData> {
    const canvas = new OffscreenCanvas(1, 1);
    drawProcedure(canvas.getContext('2d')!);
    return MediaData.createFromCanvas(imageId, canvas);
  }

  async loadCanvas(
    imageId: MediaId,
    canvas: HTMLCanvasElement | OffscreenCanvas,
  ): Promise<MediaData> {
    return MediaData.createFromCanvas(imageId, canvas);
  }

  async loadImage(imageId: MediaId, src: Url): Promise<MediaData> {
    return await MediaData.loadImage(imageId, src);
  }

  async loadVideo(
    imageId: MediaId,
    src: Url,
    volume?: number,
    fps?: number,
    playSpeed?: number,
    maxRefreshRate?: number,
  ): Promise<MediaData> {
    return await MediaData.loadVideo(imageId, src, volume, fps, playSpeed, maxRefreshRate);
  }

  async loadWebCam(
    imageId: MediaId,
    deviceId: string | undefined,
  ): Promise<MediaData> {
    return await MediaData.loadWebcam(imageId, deviceId);
  }
}
