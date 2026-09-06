// DOUBLE DE FRONTIERE, explicitement qualifie : satisfait l'import statique de
// scripts/prerender.mjs. Les tests s'arretent avant toute capture, ce handler
// ne doit jamais servir de requete.
export default function handler(req, res) {
  res.statusCode = 500;
  res.end("double de frontiere serve-handler : ne doit pas etre atteint dans ces tests");
}
