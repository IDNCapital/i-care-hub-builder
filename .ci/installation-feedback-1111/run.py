"""Local, bounded checks. Requires already available dependencies; never installs."""
from pathlib import Path
import datetime, hashlib, json, re, shutil, subprocess, sys
root = Path(__file__).resolve().parents[2]
qa = Path(__file__).resolve().parent
phase = sys.argv[1] if len(sys.argv) > 1 else ''
if phase not in ['dom', 'types-product', 'types-qa', 'types-project-explicit']:
    raise SystemExit('Expected dom, types-product, types-qa or types-project-explicit')
for name in ['empty-env', 'cache', 'proofs']:
    local = qa / name
    local.mkdir(exist_ok=True)
    if local.is_symlink() or local.resolve() != local:
        raise SystemExit('Local directory must not be a symlink')
if list((qa / 'empty-env').iterdir()):
    raise SystemExit('Empty environment directory required')
# Optional explicit local tool cache. No installation and no automatic substitution.
tool_arg = next((a for a in sys.argv[2:] if a.startswith('--tools-dir=')), None)
if tool_arg:
    tools = Path(tool_arg.split('=', 1)[1]).resolve()
    link = qa / 'node_modules'
    if link.exists() and link.resolve() != tools:
        raise SystemExit('Existing local tools differ')
    if not link.exists():
        link.symlink_to(tools, target_is_directory=True)
else:
    tools = qa / 'node_modules'
node = shutil.which('node')
if not node or not (tools / 'vitest/vitest.mjs').is_file():
    raise SystemExit('Existing Node and Vitest required; use --tools-dir=')
node = Path(node).resolve()
out = qa / 'proofs' / (phase + '-' + datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
out.mkdir(exist_ok=False)
source_names = ['src/components/FormulaireInteretInstallation.tsx', 'src/lib/publicProjectOffer.ts', 'src/lib/installation.ts', 'src/lib/routes.ts', 'src/lib/utils.ts', 'src/vite-env.d.ts', 'tsconfig.app.json', 'tests/advisor/FormulaireInteretInstallation.langue.test.tsx']
source_names += ['src/components/ui/' + n + '.tsx' for n in ['button', 'input', 'label', 'textarea', 'checkbox', 'select']]
source_names += [str(p.relative_to(root)) for p in qa.iterdir() if p.is_file()]
packages = ['react', 'react-dom', 'react-i18next', 'i18next', 'react-router-dom', 'lucide-react', '@radix-ui/react-select', '@radix-ui/react-checkbox']
tool_packages = ['vitest', 'vite', 'jsdom', 'typescript', '@testing-library/dom', '@testing-library/jest-dom']
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
def snapshot():
    files = [root / name for name in source_names] + [node]
    files += [tools / name / 'package.json' for name in tool_packages]
    files += [root / 'node_modules' / name / 'package.json' for name in packages]
    return [{'path': str(p), 'sha256': sha(p)} for p in files]
before = snapshot()
(out / 'before.json').write_text(json.dumps(before, indent=2) + '\n')
cmd = [str(node), '--import', str(qa / 'bootstrap.mjs')]
if phase == 'dom':
    cmd += [str(tools / 'vitest/vitest.mjs'), 'run', '--config', str(qa / 'vitest.config.mjs'), '--reporter=default', '--reporter=json', '--outputFile=' + str(out / 'vitest.json')]
elif phase == 'types-project-explicit':
    cmd += [str(tools / 'typescript/bin/tsc'), '-p', str(root / 'tsconfig.app.json'), '--types', 'react,react-dom']
else:
    kind = phase.removeprefix('types-')
    cmd += [str(tools / 'typescript/bin/tsc'), '-p', str(qa / ('tsconfig.' + kind + '.json'))]
run = subprocess.run(cmd, cwd=root, env={'PATH': '/usr/local/bin:/usr/bin:/bin', 'TZ': 'UTC', 'TMPDIR': str(qa / 'cache'), 'XDG_CACHE_HOME': str(qa / 'cache')}, text=True, capture_output=True)
(out / 'stdout.txt').write_text(run.stdout)
(out / 'stderr.txt').write_text(run.stderr)
after = snapshot()
(out / 'after.json').write_text(json.dumps(after, indent=2) + '\n')
collection = True
if phase == 'dom':
    report = json.loads((out / 'vitest.json').read_text())
    collection = report['numTotalTests'] == 12 and report['numPassedTests'] == 12 and report['numPendingTests'] == 0 and len(report['testResults']) == 1
result = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'phase': phase, 'command': cmd, 'workerExit': run.returncode, 'sourceToolsUnchanged': before == after, 'exactCollection': collection, 'out': str(out)}
(out / 'result.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
if run.returncode or before != after or not collection:
    print(run.stdout[-2000:]); print(run.stderr[-2000:]); raise SystemExit(1)
