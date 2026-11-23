// Removes Darkroom and its venv, and ComfyUI's venv. ComfyUI itself (and the models in
// comfyui/models) is kept so multi-GB downloads survive a reset; Install recreates the venv.
module.exports = {
  run: [{
    method: "fs.rm",
    params: {
      path: "app"
    }
  }, {
    method: "fs.rm",
    params: {
      path: "comfyui/env"
    }
  }]
}
