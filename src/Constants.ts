export type GL = WebGL2RenderingContext;
export const GL = globalThis.WebGL2RenderingContext ?? {} as any;
