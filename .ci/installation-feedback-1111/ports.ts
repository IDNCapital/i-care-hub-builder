export const blocked: string[] = [];
type Result = { data: { ok?: boolean; error?: string } | null; error: Error | null };
export const fixtureCalls: unknown[] = [];
export let fixtureReply: (() => Promise<Result>) | undefined;
export function replyWith(reply?: () => Promise<Result>) { fixtureReply = reply; fixtureCalls.length = 0; }
export const supabase = { functions: { invoke: async <T,>(_name: string, options: unknown): Promise<{ data: T | null; error: Error | null }> => {
  if (!fixtureReply) { blocked.push('Unexpected fixture invoke'); throw new Error('No fixture reply'); }
  fixtureCalls.push({ name: _name, options });
  return await fixtureReply() as { data: T | null; error: Error | null };
} } };
export const Analytics = { formSubmission: (...args: unknown[]) => { fixtureCalls.push({ analytics: args }); } };
export const useProfessions = () => ({
  data: [
    { id: 'profession-fictive', slug: 'autre-profession', nom_inclusif_pluriel: 'Autre' },
    { id: 'psychologue', slug: 'psychologue', nom_inclusif_pluriel: 'Psychologues' },
    { id: 'unknown', slug: 'fixture-unknown', nom_inclusif_pluriel: 'Profession fictive' },
  ],
});
export const useCabinetsInstallation = () => ({
  data: [
    { id: 'archive', slug: 'i-ca-re-floirac', slug_installation: 'floirac', name: 'Floirac' },
    { id: 'archive-alias', slug: 'example-cabinet', slug_installation: 'floirac', name: 'Alias archivé' },
    { id: 'public', slug: 'cabinet-fictif', slug_installation: 'ville-fictive', name: 'Cabinet fictif' },
  ],
});
