from pathlib import Path
import subprocess,json,hashlib
hook=Path('src/hooks/usePraticiensCabinet.ts');section=Path('src/components/SectionPraticiensDuCabinet.tsx')
originals={hook:hook.read_bytes(),section:section.read_bytes()}
mutants=[('pagination',hook,originals[hook].decode().replace('if (all.length === count) return all;','if (all.length <= count) return all;'),'CAUSE plafond'),('scope',hook,originals[hook].decode().replace('const current = receipt.visit === visit ? receipt : null;','const current = receipt;'),'CAUSE premier commit'),('generation',hook,originals[hook].decode().replace(' && generation.current === attempt',''),'COURSE deux reprises'),('literal-json',section,originals[section].decode().replace(r'.replace(/</g, "\\u003c")',''),'CAUSE JSONLD')]
results=[]
try:
 for name,p,mutant,pattern in mutants:
  assert mutant.encode()!=originals[p],name
  p.write_text(mutant)
  r=subprocess.run(['node','.ci/cabinet-network-read/node_modules/vitest/vitest.mjs','run','--config','.ci/cabinet-network-read/vitest.config.ts','--reporter=verbose','-t',pattern],capture_output=True,text=True)
  Path('.ci/cabinet-network-read/proof/inverse-'+name+'.log').write_text(r.stdout+r.stderr)
  results.append({'name':name,'code':r.returncode,'sensitive':r.returncode==1,'mutant_sha256':hashlib.sha256(mutant.encode()).hexdigest()})
  p.write_bytes(originals[p])
finally:
 for p,b in originals.items():p.write_bytes(b)
Path('.ci/cabinet-network-read/proof/inverses.json').write_text(json.dumps({'results':results,'restored':[{ 'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'exact':p.read_bytes()==b}for p,b in originals.items()]},indent=2)+'\n')
assert all(r['sensitive'] for r in results)
print(json.dumps(results))
