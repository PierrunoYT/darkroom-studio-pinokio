// args.model: a group id from models.json (picked in the Download Models menu).
module.exports = {
  run: [{
    method: "shell.run",
    params: {
      venv: "env",
      path: "comfyui",
      env: {
        HF_XET_HIGH_PERFORMANCE: "1"
      },
      message: "python ../download.py {{args.model}}"
    }
  }]
}
