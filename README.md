# Darkroom Pinokio launcher

1-click [Pinokio](https://pinokio.co) launcher for [Darkroom](https://github.com/PierrunoYT/darkroom-studio), a local
image generation studio: a dark Gradio UI on top of a [ComfyUI](https://github.com/comfyanonymous/ComfyUI) backend.

## What it installs

| Folder     | Contents                                                                      |
|------------|-------------------------------------------------------------------------------|
| `app/`     | Darkroom, cloned from GitHub; `uv sync` creates `app/.venv` (Python 3.12)     |
| `comfyui/` | ComfyUI, with GPU-matched torch (CUDA 12.8, ROCm, MPS or CPU) in `comfyui/env` |

## Usage

1. **Install** clones both repos and installs their dependencies.
2. **Start** launches ComfyUI on a free port, then Darkroom pointed at it, and opens Darkroom.
   **Start Darkroom only** skips the bundled ComfyUI and uses `COMFYUI_URL` (default `http://127.0.0.1:8188`) or the
   URL you enter in Darkroom's **Connection** tab, e.g. a ComfyUI on Modal.
3. Put models in `comfyui/models/...` (see the Darkroom README for which files each model needs), then click
   **Connect / refresh models** in Darkroom.

While running, the menu also links to the ComfyUI web UI. Images are saved to `~/Pictures/Darkroom`.

- **Update** pulls the launcher, Darkroom and ComfyUI and reinstalls dependencies.
- **Reset** deletes `app/` and `comfyui/env`; ComfyUI and its downloaded models are kept.

## API

Darkroom is a Gradio app, so its functions are reachable through the Gradio client API. Use the URL shown by
**Open Darkroom** (below `http://127.0.0.1:7860`); list the endpoints and parameters with the "Use via API" link at
the bottom of the page, or `view_api()`.

### Python

```python
from gradio_client import Client

client = Client("http://127.0.0.1:7860/")
client.view_api()  # prints every endpoint with its parameters
```

### JavaScript

```javascript
import { Client } from "@gradio/client";

const client = await Client.connect("http://127.0.0.1:7860/");
console.log(await client.view_api());
```

### Curl

```sh
curl http://127.0.0.1:7860/gradio_api/info
```

The ComfyUI backend has its own HTTP API at the ComfyUI URL, e.g. `curl <comfyui-url>/object_info`.
