"""Download one model group from models.json into comfyui/models.

    python ../download.py <group id>      (run from comfyui/ in its venv; download.js does this)
    python ../download.py --login         (saves the HF_TOKEN environment variable as the Hugging Face login)

Files already in place are skipped, so shared text encoders and VAEs download once. Files land
flat in their ComfyUI folder, renamed where two repos ship different files under the same name.

The last line is a marker for download.js: DARKROOM_DONE, or DARKROOM_TOKEN_NEEDED <repo> when a
gated repo needs a Hugging Face token (or the saved one is invalid), so it can ask for one and retry.
"""

import json
import os
import shutil
import sys
from pathlib import Path

from huggingface_hub import hf_hub_download, login
from huggingface_hub.errors import GatedRepoError, HfHubHTTPError

ROOT = Path(__file__).resolve().parent
MODELS = ROOT / "comfyui" / "models"
STAGING = MODELS / ".darkroom-downloads"


def main() -> int:
    if sys.argv[1:] == ["--login"]:
        try:
            login(token=os.environ["HF_TOKEN"].strip())
        except (KeyError, ValueError, HfHubHTTPError) as e:
            print(f"Hugging Face login failed: {e}")
            return 1
        print("Saved the Hugging Face token.")
        return 0
    groups = {g["id"]: g for g in json.loads((ROOT / "models.json").read_text(encoding="utf-8"))}
    if len(sys.argv) != 2 or sys.argv[1] not in groups:
        print(f"usage: download.py <{'|'.join(groups)}>")
        return 2
    group = groups[sys.argv[1]]
    print(f"Downloading {group['title']} (about {group['size']})")
    if group.get("note"):
        print(f"Note: {group['note']}")

    for f in group["files"]:
        dest = MODELS / f["folder"] / f.get("name", Path(f["file"]).name)
        if dest.exists():
            print(f"have {dest.relative_to(MODELS)}")
            continue
        print(f"downloading {f['repo']}/{f['file']} -> {dest.relative_to(MODELS)}")
        try:
            path = hf_hub_download(f["repo"], f["file"], local_dir=STAGING)
        except HfHubHTTPError as e:
            status = e.response.status_code if e.response is not None else None
            if not isinstance(e, GatedRepoError) and status not in (401, 403):
                raise
            print(f"\n{f['repo']} needs a Hugging Face token with access to it. Accept its license at "
                  f"https://huggingface.co/{f['repo']}, then enter a token.")
            print(f"DARKROOM_TOKEN_NEEDED {f['repo']}")
            return 1
        dest.parent.mkdir(parents=True, exist_ok=True)
        os.replace(path, dest)

    shutil.rmtree(STAGING, ignore_errors=True)
    print(f"\nDone. In Darkroom, click Connect / refresh models to see {group['title']}.")
    print("DARKROOM_DONE")
    return 0


if __name__ == "__main__":
    sys.exit(main())
