#!/usr/bin/env python3
"""Compile pinned Tailwind v4 utilities without a repository npm installation."""
import json
from pathlib import Path
import subprocess
import tempfile

VERSION = "4.3.3"
directory = Path(__file__).resolve().parent.parent
script = directory / "steam-store-region.user.js"

# npm exec exposes the pinned CLI on PATH; resolve its sibling CSS package there.
# Imports in a workspace stylesheet cannot otherwise resolve npm's temporary cache.
compile_css = """
import json
from pathlib import Path
import shutil
import subprocess
import sys

binary = Path(shutil.which("tailwindcss")).resolve()
modules = next(parent for parent in binary.parents if parent.name == "node_modules")
package = modules / "tailwindcss"
assert json.loads((package / "package.json").read_text())["version"] == sys.argv[4]
source = Path(sys.argv[1]).read_text()
for name in ("theme", "utilities"):
    source = source.replace(f'"tailwindcss/{name}.css"', json.dumps(str(package / f"{name}.css")))
Path(sys.argv[2]).write_text(source)
subprocess.run([str(binary), "--input", sys.argv[2], "--output", sys.argv[3], "--minify"], check=True)
"""

with tempfile.TemporaryDirectory(prefix="steam-region-css-") as temp:
    output = Path(temp) / "tailwind.css"
    subprocess.run([
        "npm", "exec", "--yes", "--package", f"@tailwindcss/cli@{VERSION}",
        "--package", f"tailwindcss@{VERSION}", "--", "python3", "-c", compile_css,
        str(directory / "src/tailwind.css"), str(Path(temp) / "input.css"),
        str(output), VERSION,
    ], check=True, cwd=directory)
    css = output.read_text()

# Inline themes and component-local state avoid @property registration, whose
# behavior in shadow trees varies between browsers. Do not silently regress it.
assert f"tailwindcss v{VERSION}" in css
assert "@property" not in css and "--tw-" not in css
assert ":root" not in css and "@layer base" not in css
source = script.read_text()
start = source.index("    // tailwind:start\n") + len("    // tailwind:start\n")
end = source.index("    // tailwind:end", start)
script.write_text(source[:start] + "    const STYLES = " + json.dumps(css) + ";\n" + source[end:])
