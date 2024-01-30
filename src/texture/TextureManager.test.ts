import { beforeEach, describe, expect, it, jest } from 'bun:test';
import { TextureManager } from './TextureManager';
import "../../test/GLMock";
import "../../test/MockCanvas";
import { GL } from "../Constants";

describe('TextureManager', () => {
  let gl: Partial<GL>;
  let textureManager: TextureManager;

  beforeEach(() => {
    // Mock WebGL methods
    gl = {
      createTexture: jest.fn().mockReturnValue({}),
      bindTexture: jest.fn(),
      texImage2D: jest.fn(),
      getParameter: jest.fn().mockReturnValue(16),
      uniform1iv: jest.fn(),
      uniform1f: jest.fn(),
      generateMipmap: jest.fn(),
      activeTexture: jest.fn(),
      texParameteri: jest.fn(),
    };

    textureManager = new TextureManager({ gl: gl as GL });
  });

  it('should construct properly', () => {
    expect(textureManager).toBeDefined();
    expect(textureManager['gl']).toBe(gl as WebGL2RenderingContext);
  });

  it('should create a new texture if it does not exist', () => {
    const textureId = 'TEXTURE0';
    textureManager['getTexture'](textureId);

    expect(gl.createTexture).toHaveBeenCalled();
    expect(gl.bindTexture).toHaveBeenCalled();//toHaveBeenCalledWith(GL.TEXTURE_2D, {});
    expect(gl.texImage2D).toHaveBeenCalled();//toHaveBeenCalledWith(GL.TEXTURE_2D, 0, GL.RGBA, /* other arguments */);
    expect(textureManager['texturesById'][textureId]).toBeDefined();
  });

  it('should not create a new texture if it already exists', () => {
    const textureId = 'TEXTURE0';
    textureManager['texturesById'][textureId] = {};

    textureManager['getTexture'](textureId);

    expect(gl.createTexture).not.toHaveBeenCalled();
  });
});
