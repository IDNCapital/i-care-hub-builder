"""Compare unchanged guards and transport with the reserved bundle main."""
from pathlib import Path
import datetime, hashlib, json, re, subprocess
root = Path(__file__).resolve().parents[2]
path = 'src/components/FormulaireInteretInstallation.tsx'
base = '939c0eca669cb092b33ec9e5700c2240b9a54ccc'
before = subprocess.check_output(['git', 'show', base + ':' + path], cwd=root, text=True)
after = (root / path).read_text()
def between(text, start, end):
    return text[text.index(start):text.index(end, text.index(start))]
def guard_lines(text):
    return [line for line in text.splitlines() if 'isPublicProjectOffer(' in line]
def invocation_payload(text):
    # The SDK result shape evolves independently of the function name and its payload.
    return between(text, '        "submit-demande-installation",', '\n      );')
def ville_selection(text):
    return next(line.strip() for line in text.splitlines() if line.lstrip().startswith('const villeToSend ='))
def conversion_apres_recu(text):
    guard = 'if (receipt === "recorded" && !website) {'
    return (text.count('Analytics.formSubmission(') == 1
            and guard in text
            and 'Analytics.formSubmission("demande_installation", window.location.pathname)' in between(text, guard, '} catch'))
conditions = lambda text: re.findall(r'if \((.*?)\) (?:next\.|\{)', between(text, '    const next: FieldErrors', '    setErrors(next);'))
known = []
for name in ['20260515202715_8d36da8e-c754-4863-8032-ee685c65ff6b.sql', '20260807152425_e6d67baa-8870-48ba-bd01-a16bd12fde2d.sql']:
    known += re.findall(r"^\s*\('([^']+)'", (root / 'supabase/migrations' / name).read_text(), flags=re.M)
map_text = between(after, 'const englishProfessions:', '\nconst copy =')
missing = [slug for slug in known if not re.search(r'(?:"' + re.escape(slug) + r'"|\b' + re.escape(slug) + r'):\s*"', map_text)]
result = {
    'at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'base': base,
    'invocationAndPayloadExact': invocation_payload(before) == invocation_payload(after) and ville_selection(before) == ville_selection(after),
    'analyticsSeulementApresRecu': conversion_apres_recu(after),
    'publicOfferGuardsExact': guard_lines(before) == guard_lines(after),
    'validationConditionsExact': conditions(before) == conditions(after),
    'knownMigrationProfessionSlugs': known, 'missingProfessionTranslations': missing,
    'baseSHA256': hashlib.sha256(before.encode()).hexdigest(), 'afterSHA256': hashlib.sha256(after.encode()).hexdigest(),
}
print(json.dumps(result, ensure_ascii=False, indent=2))
assert all(result[key] for key in ['invocationAndPayloadExact', 'analyticsSeulementApresRecu', 'publicOfferGuardsExact', 'validationConditionsExact']) and not missing
