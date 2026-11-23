const path = require("path")
const models = require("./models.json")

// One entry per model group; a check mark when every file of the group is already in comfyui/models.
// The first entry saves a Hugging Face token for gated repos (download.js also asks when one is needed).
const downloadMenu = (info) => ({
  icon: "fa-solid fa-download",
  text: "Download Models",
  menu: [{
    icon: "fa-solid fa-key",
    text: "<div><strong>Hugging Face token</strong><div>Set or replace the token used for gated models</div></div>",
    href: "token.js",
    mode: "refresh"
  }].concat(models.map((m) => {
    let have = m.files.every((f) => info.exists(`comfyui/models/${f.folder}/${f.name || path.basename(f.file)}`))
    return {
      icon: have ? "fa-solid fa-check" : "fa-solid fa-download",
      text: `<div><strong>${m.title}</strong><div>${have ? "Downloaded" : m.size}${m.note ? " · " + m.note : ""}</div></div>`,
      href: "download.js",
      params: { model: m.id },
      mode: "refresh"
    }
  }))
})

module.exports = {
  version: "7.0",
  title: "Darkroom",
  description: "Local image generation studio: a dark Gradio UI on top of a bundled ComfyUI backend. https://github.com/PierrunoYT/darkroom-studio",
  icon: "icon.png",
  menu: async (kernel, info) => {
    let installed = info.exists("app/.venv") && info.exists("comfyui/env")
    let running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js"),
      download: info.running("download.js")
    }
    let downloading = {
      icon: "fa-solid fa-terminal",
      text: "Downloading",
      href: "download.js",
    }
    if (running.install) {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Installing",
        href: "install.js",
      }]
    } else if (installed) {
      if (running.start) {
        let local = info.local("start.js")
        let items = []
        if (local && local.url) {
          items.push({
            default: true,
            icon: "fa-solid fa-rocket",
            text: "Open Darkroom",
            href: local.url,
          })
        }
        if (local && local.comfy_url) {
          items.push({
            icon: "fa-solid fa-diagram-project",
            text: "Open ComfyUI",
            href: local.comfy_url,
          })
        }
        items.push({
          default: !(local && local.url),
          icon: "fa-solid fa-terminal",
          text: "Terminal",
          href: "start.js",
        })
        items.push(running.download ? downloading : downloadMenu(info))
        return items
      } else if (running.download) {
        return [{ ...downloading, default: true }]
      } else if (running.update) {
        return [{
          default: true,
          icon: "fa-solid fa-terminal",
          text: "Updating",
          href: "update.js",
        }]
      } else if (running.reset) {
        return [{
          default: true,
          icon: "fa-solid fa-terminal",
          text: "Resetting",
          href: "reset.js",
        }]
      } else {
        return [{
          default: true,
          icon: "fa-solid fa-power-off",
          text: "<div><strong>Start</strong><div>Bundled ComfyUI + Darkroom</div></div>",
          href: "start.js",
          params: { backend: "local" }
        }, {
          icon: "fa-solid fa-cloud",
          text: "<div><strong>Start Darkroom only</strong><div>Use an external or Modal ComfyUI (COMFYUI_URL / Connection tab)</div></div>",
          href: "start.js",
          params: { backend: "external" }
        }, downloadMenu(info), {
          icon: "fa-solid fa-plug",
          text: "Update",
          href: "update.js",
        }, {
          icon: "fa-solid fa-plug",
          text: "Install",
          href: "install.js",
        }, {
          icon: "fa-regular fa-circle-xmark",
          text: "<div><strong>Reset</strong><div>Remove Darkroom and venvs (keeps ComfyUI models)</div></div>",
          href: "reset.js",
          confirm: "Are you sure you wish to reset the app?"
        }]
      }
    } else {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.js",
      }]
    }
  }
}
