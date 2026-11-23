// args.backend: "local" (default) starts the bundled ComfyUI first and points Darkroom at it;
// "external" starts Darkroom only, using COMFYUI_URL / the Connection tab (e.g. a Modal ComfyUI).
module.exports = {
  daemon: true,
  run: [
    {
      when: "{{!args || args.backend !== 'external'}}",
      method: "shell.run",
      params: {
        venv: "env",
        env: {
          PYTORCH_ENABLE_MPS_FALLBACK: "1"
        },
        path: "comfyui",
        message: [
          "python main.py --listen 127.0.0.1 --port {{port}} --preview-method latent2rgb {{gpu === 'nvidia' || gpu === 'amd' || platform === 'darwin' ? '' : '--cpu'}}"
        ],
        on: [{
          // "To see the GUI go to: http://127.0.0.1:8189"
          event: "/(http:\\/\\/[0-9.:]+)/",
          done: true
        }]
      }
    },
    {
      when: "{{!args || args.backend !== 'external'}}",
      method: "local.set",
      params: {
        comfy_url: "{{input.event[1]}}"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        env: {
          COMFYUI_URL: "{{local.comfy_url ? local.comfy_url : (envs.COMFYUI_URL || 'http://127.0.0.1:8188')}}",
          DARKROOM_PORT: "{{port}}"
        },
        message: [
          "uv run darkroom"
        ],
        on: [{
          event: "/(http:\\/\\/[0-9.:]+)/",
          done: true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    }
  ]
}
