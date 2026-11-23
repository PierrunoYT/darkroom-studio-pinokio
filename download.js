// args.model: a group id from models.json (picked in the Download Models menu).
// When a gated repo needs a token, download.py prints DARKROOM_TOKEN_NEEDED <repo>; this asks for a token
// with token.js and retries. Cancelling the token dialog stops the download.
module.exports = {
  run: [{
    id: "download",
    method: "shell.run",
    params: {
      venv: "env",
      path: "comfyui",
      env: {
        HF_XET_HIGH_PERFORMANCE: "1"
      },
      message: "python ../download.py {{args.model}}",
      on: [{
        event: "/DARKROOM_(DONE|TOKEN_NEEDED) ?(\\S*)/",
        kill: true
      }]
    }
  }, {
    method: "local.set",
    params: {
      status: "{{input && input.event ? input.event[1] : 'FAILED'}}",
      repo: "{{input && input.event ? input.event[2] : ''}}"
    }
  }, {
    method: "jump",
    params: {
      id: "{{local.status === 'TOKEN_NEEDED' ? 'token' : 'end'}}"
    }
  }, {
    id: "token",
    method: "script.start",
    params: {
      uri: "token.js",
      params: {
        repo: "{{local.repo}}"
      }
    }
  }, {
    method: "jump",
    params: {
      id: "download"
    }
  }, {
    id: "end",
    method: "log",
    params: {
      raw: "{{local.status === 'DONE' ? 'Download finished.' : 'Download failed; see the output above.'}}"
    }
  }]
}
