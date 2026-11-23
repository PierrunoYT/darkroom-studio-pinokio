// app/      Darkroom (Gradio UI), installed with uv into its own .venv (needs Python 3.12+)
// comfyui/  ComfyUI backend with GPU torch in comfyui/env
module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    {
      when: "{{!exists('app')}}",
      method: "shell.run",
      params: {
        message: "git clone https://github.com/PierrunoYT/darkroom-studio app"
      }
    },
    {
      // uv reads .python-version and pyproject.toml and fetches Python 3.12 if needed.
      method: "shell.run",
      params: {
        path: "app",
        message: "uv sync"
      }
    },
    {
      when: "{{!exists('comfyui')}}",
      method: "shell.run",
      params: {
        message: "git clone https://github.com/comfyanonymous/ComfyUI comfyui"
      }
    },
    // GPU torch first, so ComfyUI's unpinned torch requirement is already satisfied.
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "comfyui"
        }
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "comfyui",
        message: "uv pip install -r requirements.txt"
      }
    }
  ]
}
