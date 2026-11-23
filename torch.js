// Installs GPU-matched torch + torchvision + torchaudio into args.venv under args.path.
module.exports = {
  run: [
    {
      when: "{{gpu === 'nvidia' && platform !== 'darwin'}}",
      method: "shell.run",
      params: {
        venv: "{{args && args.venv ? args.venv : null}}",
        path: "{{args && args.path ? args.path : '.'}}",
        message: "uv pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/cu128"
      },
      next: null
    },
    {
      when: "{{gpu === 'amd' && platform === 'linux'}}",
      method: "shell.run",
      params: {
        venv: "{{args && args.venv ? args.venv : null}}",
        path: "{{args && args.path ? args.path : '.'}}",
        message: "uv pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/rocm6.4"
      },
      next: null
    },
    {
      when: "{{platform === 'darwin'}}",
      method: "shell.run",
      params: {
        venv: "{{args && args.venv ? args.venv : null}}",
        path: "{{args && args.path ? args.path : '.'}}",
        message: "uv pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0"
      },
      next: null
    },
    {
      method: "shell.run",
      params: {
        venv: "{{args && args.venv ? args.venv : null}}",
        path: "{{args && args.path ? args.path : '.'}}",
        message: "uv pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/cpu"
      }
    }
  ]
}
