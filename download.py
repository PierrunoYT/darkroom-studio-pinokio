"""Download one model group from models.json into comfyui/models.

    python ../download.py <group id>      (run from comfyui/ in its venv; download.js does this)

Files already in place are skipped, so shared text encoders and VAEs download once. Files land
flat in their ComfyUI folder, renamed where two repos ship different files under the same name.
"""

import json
import os
import shutil
import sys
from pathlib import Path

from huggingface_hub import hf_hub_download
from huggingface_hub.errors import GatedRepoError

ROOT = Path(__file__).resolve().parent
MODELS = ROOT / "comfyui" / "models"
STAGING = MODELS / ".darkroom-downloads"


def main() -> int:
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
        except GatedRepoError:
            print(f"\n{f['repo']} is gated. Accept its license at https://huggingface.co/{f['repo']}, "
                  "then log in with `hf auth login` in a Pinokio terminal (or set HF_TOKEN) and download again.")
            return 1
        dest.parent.mkdir(parents=True, exist_ok=True)
        os.replace(path, dest)

    shutil.rmtree(STAGING, ignore_errors=True)
    print(f"\nDone. In Darkroom, click Connect / refresh models to see {group['title']}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
