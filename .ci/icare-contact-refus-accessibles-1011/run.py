from pathlib import Path
import subprocess,json,hashlib,sys,datetime,re,shutil
root=Path(__file__).resolve().parents[2];q=Path(__file__).resolve().parent
args=sys.argv[1:];phase=args.pop(0)
if not re.fullmatch('[a-z0-9-]+',phase):raise SystemExit('phase refusee')
for name in ['empty-env','cache','proofs']:
 p=q/name;p.mkdir(exist_ok=True)
 if p.is_symlink() or p.resolve()!=p:raise SystemExit('repertoire local lie refuse')
if list((q/'empty-env').iterdir()):raise SystemExit('env non vide')
# Reuse an explicit existing tools directory; never install or replace dependencies.
tools_arg=next((a for a in args if a.startswith('--tools-dir=')),None)
if tools_arg:
 args.remove(tools_arg);tools=Path(tools_arg.split('=',1)[1]).resolve()
 if (q/'node_modules').exists():
  if (q/'node_modules').resolve()!=tools:raise SystemExit('outillage existant different')
 else:(q/'node_modules').symlink_to(tools,target_is_directory=True)
else:tools=(q/'node_modules').resolve() if (q/'node_modules').exists() else root/'node_modules'
if not (tools/'vitest/vitest.mjs').is_file():raise SystemExit('Fournir --tools-dir= vers node_modules deja present; aucune installation')
node_name=shutil.which('node')
if not node_name:raise SystemExit('Node deja present requis')
node=Path(node_name);out=q/'proofs'/phase;out.mkdir(exist_ok=False)
names=['src/pages/Contact.tsx', 'src/lib/contact.ts', 'src/components/LinkedInLink.tsx', 'src/lib/utils.ts', 'src/components/BrandName.tsx', 'src/lib/analytics.ts', 'src/lib/siteUrl.ts', 'src/integrations/supabase/client.ts', 'src/integrations/supabase/previewAuthStorage.ts', 'src/integrations/supabase/types.ts', 'src/lib/routes.ts', 'src/components/SeoHead.tsx', 'src/components/ui/checkbox.tsx', 'src/components/ui/label.tsx', 'src/components/ui/textarea.tsx', 'src/components/ui/input.tsx', 'src/components/ui/button.tsx', 'src/components/Layout.tsx', 'src/components/Footer.tsx', 'src/assets/rivage-logo.png', 'src/components/Header.tsx', 'src/components/ui/navigation-menu.tsx', 'src/lib/espacePatients.ts', 'src/locales/fr.json', 'src/locales/en.json', 'src/vite-env.d.ts', 'tsconfig.app.json', 'tsconfig.node.json', 'tsconfig.json', 'package.json', 'package-lock.json', 'tests/advisor/Contact.refusApplicatifs.test.tsx']
names+=['.ci/icare-contact-refus-accessibles-1011/'+n for n in ['baseline.mjs','baseline.d.mts','bootstrap.mjs','closedEnvironment.ts','ports.ts','layout.tsx','testing.tsx','vitest.config.mjs','run.py','tsconfig.product.json','tsconfig.qa.json']]
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
packages=['react','react-dom','react-router-dom','react-i18next','i18next','@radix-ui/react-checkbox','@radix-ui/react-label','@radix-ui/react-slot','lucide-react','class-variance-authority','clsx','tailwind-merge','@supabase/supabase-js']
toolpackages=['vitest','vite','typescript','jsdom','@testing-library/react','@testing-library/dom','@testing-library/jest-dom']
def snapshot():
 if (q/'empty-env').is_symlink() or list((q/'empty-env').iterdir()):raise SystemExit('env non vide ou lie')
 toolfiles=[node,tools/'vitest/vitest.mjs',tools/'typescript/bin/tsc',tools/'typescript/lib/_tsc.js']+[root/'node_modules'/n/'package.json' for n in packages]+[tools/n/'package.json' for n in toolpackages]
 return {'files':[{'path':n,'bytes':(root/n).stat().st_size,'sha256':sha(root/n)} for n in names],'tools':[{'path':str(p.resolve()),'bytes':p.stat().st_size,'sha256':sha(p)} for p in toolfiles],'appVersions':{n:json.loads((root/'node_modules'/n/'package.json').read_text())['version'] for n in packages},'toolVersions':{n:json.loads((tools/n/'package.json').read_text())['version'] for n in toolpackages}}
pins=snapshot();stamp=datetime.datetime.now(datetime.timezone.utc).isoformat();(out/'before.json').write_text(json.dumps({'at':stamp,**pins},indent=2)+'\n');(q/'ACTIVE_PINS.json').write_text(json.dumps(pins,indent=2)+'\n')
if '--prepare-only' in args:
 (out/'result.json').write_text(json.dumps({'exit':0,'prepareOnly':True},indent=2)+'\n');print('PREPARED',len(names));raise SystemExit(0)
cmd=[str(node),'--import',str(q/'bootstrap.mjs')];expected=None
if phase.startswith('types-'):
 kind='qa' if phase.startswith('types-qa') else 'product';cmd += [str(tools/'typescript/bin/tsc'),'-p',str(q/('tsconfig.'+kind+'.json'))]
else:
 exp=next((a for a in args if a.startswith('--expected=')),None)
 if not exp:raise SystemExit('--expected= nombre exact de cas actifs requis')
 args.remove(exp);expected=int(exp.split('=')[1]);cmd += [str(tools/'vitest/vitest.mjs'),'run','--config',str(q/'vitest.config.mjs'),'--reporter=default','--reporter=json','--outputFile='+str(out/'vitest.json')]+args
r=subprocess.run(cmd,cwd=root,env={'PATH':'/usr/local/bin:/usr/bin:/bin','TZ':'UTC','HOME':str(q/'empty-env'),'TMPDIR':str(q/'cache'),'XDG_CACHE_HOME':str(q/'cache')},capture_output=True,text=True)
(out/'stdout.txt').write_text(r.stdout);(out/'stderr.txt').write_text(r.stderr);after=snapshot();(out/'after.json').write_text(json.dumps(after,indent=2)+'\n');same=pins==after;collection=True;active=[]
if expected is not None:
 try:
  report=json.loads((out/'vitest.json').read_text());results=report['testResults'];assert len(results)==1 and results[0]['name'].endswith('/tests/advisor/Contact.refusApplicatifs.test.tsx')
  active=[a for a in results[0]['assertionResults'] if a['status'] in ['passed','failed']];collection=len(active)==expected
 except (OSError,ValueError,KeyError,AssertionError):collection=False
(out/'result.json').write_text(json.dumps({'at':stamp,'command':cmd,'workerExit':r.returncode,'sourceToolConfigUnchanged':same,'expectedActive':expected,'activeCases':[{'name':a['fullName'],'status':a['status']} for a in active],'collectionExact':collection,'beforeSHA256':sha(out/'before.json')},indent=2)+'\n')
if not phase.startswith('types-') and (q/'GRAPH_OBSERVED.json').exists():(out/'graph.json').write_bytes((q/'GRAPH_OBSERVED.json').read_bytes())
print(r.stdout[:1800]);print(r.stderr[-1800:]);print('EXIT',r.returncode,'UNCHANGED',same,'COLLECTION',collection)
if not same or not collection:raise SystemExit(2)
raise SystemExit(r.returncode)
