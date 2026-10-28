import { act, Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import PreviewPraticien from '../../src/pages/PreviewPraticien';
const h = vi.hoisted(() => ({ errors: [] as Error[] }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  rpc: async (name: string, args: unknown) => { expect(name).toBe('get_praticien_preview'); expect(args).toEqual({p_slug:'a',p_token:'jeton-fictif'}); return {data:[{id:'a',slug:'a',prenom:'Exemple',nom:'Fictif',statut_validation:'brouillon',profession:'Profession',specialites:'incoherent',cabinet_slug:'lieu-fictif'}],error:null}; },
  from: (table: string) => { expect(table).toBe('projets'); const chain = {select:()=>chain,eq:()=>chain,maybeSingle:async()=>({data:null,error:null})};return chain; },
} }));
vi.mock('@/components/avis/SectionAvisGoogle',()=>({SectionAvisGoogle:()=>null}));
class Boundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(error:Error,_info:ErrorInfo){h.errors.push(error);}render(){return this.state.failed?<div>Erreur de rendu reçue par la recette</div>:this.props.children;}}
it('revue malformed specialites refuse avant enfant réel',async()=>{Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});h.errors=[];const network=vi.fn(()=>{throw Error('Réseau interdit');});vi.stubGlobal('fetch',network);const logs=vi.spyOn(console,'error').mockImplementation(()=>{});const host=document.createElement('div');document.body.append(host);const root=createRoot(host);try{await act(async()=>root.render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}} initialEntries={['/preview/a/jeton-fictif']}><Routes><Route path="/preview/:slug/:token" element={<Boundary><PreviewPraticien/></Boundary>}/></Routes></MemoryRouter>));expect(h.errors.map(e=>e.message)).toEqual([]);expect(document.body.textContent).toContain('Aperçu indisponible');}finally{await act(async()=>root.unmount());expect(network).not.toHaveBeenCalled();logs.mockRestore();vi.unstubAllGlobals();document.body.innerHTML='';Reflect.deleteProperty(globalThis,'IS_REACT_ACT_ENVIRONMENT');}});
