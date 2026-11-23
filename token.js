// Asks for a Hugging Face token and saves it as the Hugging Face login (HF_HOME), which download.py uses for
// gated repos. args.repo (set by download.js) names the repo that needed it. The token goes through an
// environment variable, so it never appears in the terminal or the logs.
module.exports = {
  run: [{
    method: "input",
    params: {
      title: "Hugging Face token",
      description: "{{args && args.repo ? args.repo + ' is gated. Accept its license at https://huggingface.co/' + args.repo + ', then' : 'Some models come from gated repos.'}} Create a Read token at https://huggingface.co/settings/tokens and paste it here.",
      form: [{
        type: "password",
        key: "token",
        title: "Token",
        placeholder: "hf_...",
        required: true
      }]
    }
  }, {
    method: "shell.run",
    params: {
      venv: "env",
      path: "comfyui",
      env: {
        HF_TOKEN: "{{input.token}}"
      },
      message: "python ../download.py --login"
    }
  }]
}
