#!/usr/bin/env python3
"""Compile the pinned Tailwind utilities and embed them in the standalone script."""
import json
from pathlib import Path
import subprocess
import tempfile

directory = Path(__file__).resolve().parent.parent
script = directory / 'steam-store-region.user.js'
with tempfile.TemporaryDirectory(prefix='steam-region-css-') as temp:
    output = Path(temp) / 'tailwind.css'
    subprocess.run([
        'npm', 'exec', '--yes', '--package', 'tailwindcss@3.4.17', '--',
        'tailwindcss', '--input', str(directory / 'src/tailwind.css'),
        '--content', str(script), '--output', str(output), '--minify',
    ], check=True, cwd=directory)
    css = output.read_text()
source = script.read_text()
start = source.index('    // tailwind:start\n') + len('    // tailwind:start\n')
end = source.index('    // tailwind:end', start)
script.write_text(source[:start] + '    const STYLES = ' + json.dumps(css) + ';\n' + source[end:])
