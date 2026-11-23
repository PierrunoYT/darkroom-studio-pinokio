module.exports = {
  run: [{
    method: "shell.run",
    params: {
      message: "git pull"
    }
  }, {
    method: "shell.run",
    params: {
      path: "app",
      message: ["git pull", "uv sync"]
    }
  }, {
    method: "shell.run",
    params: {
      venv: "env",
      path: "comfyui",
      message: ["git pull", "uv pip install -r requirements.txt"]
    }
  }]
}
