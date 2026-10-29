from pathlib import Path
import hashlib,json,tempfile,shutil,subprocess,datetime,os
root=Path.cwd();area=root/'.ci/icare-navigation-current';proof=area/'proof';proof.mkdir(parents=True,exist_ok=True);product=Path('src/components/Header.tsx');original=(root/product).read_text();base_sha=hashlib.sha256(original.encode()).hexdigest()
cases=[
 ('escape','CAUSE Escape','    document.addEventListener("keydown", onEscape);',''),
 ('navigation','CAUSE query','JSON.stringify([location.key, location.pathname, location.search, location.hash, lang])','JSON.stringify([location.pathname, lang])'),
 ('breakpoint','CAUSE breakpoint','    media.addEventListener("change", closeAtBreakpoint);',''),
 ('desktop-timer','DELTA un survol desktop','            key={`${visit.generation}:${formatGeneration}`}\n',''),
 ('focus-owner','CONTRAT Escape extérieur','() => document.activeElement === toggleRef.current || !!panelRef.current?.contains(document.activeElement)','() => true'),
 ('focus-visible','CONTRAT fermeture ne focalise','if (!target?.isConnected || !target.getClientRects().length || target.closest("[hidden], [inert]")) return;','if (!target) return;'),
]
selected=os.environ.get('INVERSE_NAMES','').split(',') if os.environ.get('INVERSE_NAMES') else None
receipt=proof/('inverses-'+','.join(selected)+'.json' if selected else 'inverses.json')
results=[]
for name,pattern,needle,replacement in cases:
 if selected and name not in selected:continue
 assert needle in original,name
 folder=Path(tempfile.mkdtemp(prefix='icare-nav-inverse-'+name+'-',dir='/private/tmp'))
 for p in (root/'src').rglob('*'):
  if p.is_file():out=folder/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,out)
 target=folder/'.ci/icare-navigation-current';target.mkdir(parents=True)
 for p in area.iterdir():
  if p.is_file():shutil.copy2(p,target/p.name)
 (folder/'node_modules').symlink_to((root/'node_modules').resolve(),target_is_directory=True)
 (folder/product).write_text(original.replace(needle,replacement,1))
 run=subprocess.run([str(root/'node_modules/.bin/vitest'),'run','--config','.ci/icare-navigation-current/vitest.config.ts','-t',pattern],cwd=folder,capture_output=True,text=True)
 output=run.stdout+run.stderr;(proof/f'inverse-{name}.log').write_text(output)
 causal=run.returncode==1 and '1 failed' in output and ('AssertionError' in output or 'Error: expect(' in output)
 results.append({'name':name,'pattern':pattern,'folder':str(folder),'exit':run.returncode,'causal':causal})
 assert hashlib.sha256((root/product).read_bytes()).hexdigest()==base_sha
 if not causal:
  receipt.write_text(json.dumps({'source':base_sha,'results':results},indent=2)+'\n');raise RuntimeError('Inverse non causal : '+name)
receipt.write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source':base_sha,'productUnchanged':True,'results':results},indent=2)+'\n');print(json.dumps(results))
