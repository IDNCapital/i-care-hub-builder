from pathlib import Path
import subprocess,json,hashlib
product=Path('src/components/CarteCabinets.tsx')
fixed=product.read_bytes();text=fixed.decode()
mutants=[
 ('partial-receipt',text.replace('if (sources.length === count) {','if (sources.length <= count) {'),'CAUSE une collection'),
 ('stale-context',text.replace(' || currentContext.current !== contextKey',''),'CONTEXTE'),
 ('duplicate-slug',text.replace(' || slugs.has(row.slug)',''),'CONTRAT slug répété'),
]
results=[]
try:
 for name,mutant,pattern in mutants:
  assert mutant!=text,name
  product.write_text(mutant)
  r=subprocess.run(['node','.ci/cabinets-map-read/node_modules/vitest/vitest.mjs','run','--config','.ci/cabinets-map-read/vitest.config.ts','--reporter=verbose','-t',pattern],capture_output=True,text=True)
  Path('.ci/cabinets-map-read/proof/inverse-'+name+'.log').write_text(r.stdout+r.stderr)
  results.append({'name':name,'code':r.returncode,'sensitive':r.returncode==1,'mutant_sha256':hashlib.sha256(mutant.encode()).hexdigest()})
finally:
 product.write_bytes(fixed)
Path('.ci/cabinets-map-read/proof/inverses.json').write_text(json.dumps({'results':results,'restored_exact':product.read_bytes()==fixed,'fixed_sha256':hashlib.sha256(fixed).hexdigest()},indent=2)+'\n')
assert all(x['sensitive'] for x in results)
print(json.dumps(results))
