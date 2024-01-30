import { TextureManager } from "gl-texture-manager";
import Bao from "baojs";
import serveStatic from "serve-static-bun";

const app = new Bao();
console.log(TextureManager);

app.get("/*any", serveStatic("/", { middlewareMode: "bao" }));

const server = app.listen({ port: 3000 });
console.log(`Listening on http://localhost:${server.port}`);
