from hashlib import sha256
import json
from pathlib import Path
from shutil import which
import subprocess
import sys

root = Path(__file__).resolve().parents[2]
qa = Path(__file__).resolve().parent
node = which("node")
tools = qa / "node_modules"
test = "tests/advisor/Professionnels.refusAccessibles.test.tsx"
phases = {
    "red-main": (3, "N1 FR|N9"),
    "red-i18n": (2, "N10"),
    "green-main": (18, None),
    "types-project-app": (None, None),
    "types-project-node": (None, None),
    "types-baseline-app": (None, None),
    "types-baseline-node": (None, None),
    "types-explicit-app": (None, None),
    "types-explicit-node": (None, None),
    "types-product": (None, None),
    "types-qa": (None, None),
}
if len(sys.argv) != 2 or sys.argv[1] not in phases:
    raise SystemExit("Choisir red-main, red-i18n, green-main, types-project-app, types-project-node, types-product ou types-qa")
if not node or not (tools / "vitest/vitest.mjs").is_file():
    raise SystemExit("Node et outillage déjà présents requis")
phase = sys.argv[1]
expected, filter_text = phases[phase]
for name in ("empty-env", "cache", "proofs"):
    path = qa / name
    if path.is_symlink() or (path.exists() and not path.is_dir()):
        raise SystemExit("Répertoire local requis : " + name)
    path.mkdir(exist_ok=True)
if list((qa / "empty-env").iterdir()):
    raise SystemExit("Le répertoire d'environnement doit rester vide")
out = qa / "proofs" / phase
out.mkdir(exist_ok=False)

def hash_file(path):
    return sha256(path.read_bytes()).hexdigest()

ignored = {"cache", "proofs", "node_modules", "empty-env"}
generated = {"ACTIVE_PINS.json", "GRAPH_OBSERVED.json"}
sources = [
    path for base in (root / "src", root / "tests/advisor", qa) for path in sorted(base.rglob("*"))
    if path.is_file() and not ignored.intersection(path.relative_to(root).parts) and path.name not in generated
]
pins = [{"path": str(path.relative_to(root)), "bytes": path.stat().st_size, "sha256": hash_file(path)} for path in sources]
active = qa / "ACTIVE_PINS.json"
active.write_text(json.dumps({"files": pins}, indent=2) + "\n")
tool_files = [
    Path(node), tools / "vitest/vitest.mjs", tools / "vitest/package.json",
    tools / "vite/package.json", tools / "typescript/bin/tsc", tools / "typescript/lib/_tsc.js",
    tools / "jsdom/package.json", tools / "@testing-library/dom/package.json",
]
packages = ["react", "react-dom", "react-router-dom", "react-i18next", "i18next",
            "@radix-ui/react-select", "@radix-ui/react-checkbox"]
tool_files.extend(root / "node_modules" / name / "package.json" for name in packages)
config = [root / name for name in ("package.json", "package-lock.json", "tsconfig.app.json", "tsconfig.node.json", "tsconfig.json")]
def snapshot():
    return {str(path): hash_file(path) for path in [*sources, *config, active, *tool_files]}

before = snapshot()
(out / "ACTIVE_PINS.json").write_bytes(active.read_bytes())
command = [node, "--import", str(qa / "bootstrap.mjs")]
if expected is None:
    config_path = qa / ("tsconfig.product.json" if phase == "types-product" else "tsconfig.qa.json")
    if phase.startswith(("types-project-", "types-baseline-", "types-explicit-")):
        config_path = root / ("tsconfig.app.json" if phase.endswith("app") else "tsconfig.node.json")
        compiler = root / "node_modules/typescript/bin/tsc"
    else:
        compiler = tools / "typescript/bin/tsc"
    command.extend([str(compiler), "-p", str(config_path), "--noEmit"])
    if phase.startswith("types-explicit-"):
        command.extend(["--types", "vite/client,node,react,react-dom" if phase.endswith("app") else "node"])
else:
    command.extend([str(tools / "vitest/vitest.mjs"), "run", "--config", str(qa / "vitest.config.mjs"), test,
                    "--reporter=default", "--reporter=json", "--outputFile=" + str(out / "vitest.json")])
    if filter_text:
        command.extend(["-t", filter_text])
env = {"PATH": "/usr/local/bin:/usr/bin:/bin", "TZ": "UTC", "HOME": str(qa / "empty-env"),
       "TMPDIR": str(qa / "cache"), "XDG_CACHE_HOME": str(qa / "cache")}
(out / "command.json").write_text(json.dumps({"command": command, "cwd": str(root), "env": env}, indent=2) + "\n")
run = subprocess.run(command, cwd=root, env=env, capture_output=True, text=True)
(out / "stdout.txt").write_text(run.stdout)
(out / "stderr.txt").write_text(run.stderr)
unchanged = before == snapshot() and not list((qa / "empty-env").iterdir())
active_tests = []
collection = True
if expected is not None:
    try:
        results = json.loads((out / "vitest.json").read_text())["testResults"]
        assert len(results) == 1 and results[0]["name"].endswith("/" + test)
        active_tests = [
            {"name": item["fullName"], "status": item["status"]}
            for item in results[0]["assertionResults"] if item["status"] in ("passed", "failed")
        ]
        collection = len(active_tests) == expected
    except (OSError, ValueError, AssertionError, KeyError):
        collection = False
report = {"phase": phase, "workerExit": run.returncode, "pinsIdentical": unchanged,
          "expectedActive": expected, "collectionExact": collection, "activeCases": active_tests}
(out / "result.json").write_text(json.dumps(report, indent=2) + "\n")
print(run.stdout[-5000:])
print(run.stderr[-5000:])
print(json.dumps(report))
raise SystemExit(run.returncode if unchanged and collection else 2)
