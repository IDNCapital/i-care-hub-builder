import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { callAdminFunction } from "@/lib/adminAuth";
import type { AvisCache, Cabinet, Praticien } from "@/pages/admin/AdminPraticiens";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STATUTS = [
  "brouillon",
  "preview_envoyee",
  "validee",
  "refusee",
  "non_repondeuse",
  "en_attente_infos",
  "en_attente_resolution",
] as const;

const STATUTS_LABELS: Record<string, string> = {
  brouillon: "Brouillon",
  preview_envoyee: "Preview envoyée",
  validee: "Validée",
  refusee: "Refusée",
  non_repondeuse: "Non répondeuse",
  en_attente_infos: "En attente infos",
  en_attente_resolution: "En attente résolution",
};

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type FormState = {
  id: string | null;
  prenom: string;
  nom: string;
  slug: string;
  slugManual: boolean;
  genre: string;
  cabinet_slug: string;
  profession: string;
  specialitesText: string;
  problematiquesText: string;
  bio_courte: string;
  bio_courte_en: string;
  bio_longue: string;
  bio_longue_en: string;
  photo_url: string;
  lien_rdv: string;
  google_place_id: string;
  google_kgmid: string;
  google_cid: string;
  statut_validation: string;
  date_envoi_preview: string;
  date_validation: string;
  notes_internes: string;
  actif: boolean;
  ordre_affichage: number;
};

function fromPraticien(p: Praticien | null): FormState {
  if (!p) {
    return {
      id: null,
      prenom: "",
      nom: "",
      slug: "",
      slugManual: false,
      genre: "non-precise",
      cabinet_slug: "",
      profession: "",
      specialitesText: "",
      problematiquesText: "",
      bio_courte: "",
      bio_courte_en: "",
      bio_longue: "",
      bio_longue_en: "",
      photo_url: "",
      lien_rdv: "",
      google_place_id: "",
      google_kgmid: "",
      google_cid: "",
      statut_validation: "brouillon",
      date_envoi_preview: "",
      date_validation: "",
      notes_internes: "",
      actif: true,
      ordre_affichage: 0,
    };
  }
  return {
    id: p.id,
    prenom: p.prenom,
    nom: p.nom,
    slug: p.slug,
    slugManual: true,
    genre: p.genre ?? "non-precise",
    cabinet_slug: p.cabinet_slug,
    profession: p.profession,
    specialitesText: (p.specialites ?? []).join(", "),
    problematiquesText: (p.problematiques ?? []).join(", "),
    bio_courte: p.bio_courte ?? "",
    bio_courte_en: p.bio_courte_en ?? "",
    bio_longue: p.bio_longue ?? "",
    bio_longue_en: p.bio_longue_en ?? "",
    photo_url: p.photo_url ?? "",
    lien_rdv: p.lien_rdv ?? "",
    google_place_id: p.google_place_id ?? "",
    google_kgmid: p.google_kgmid ?? "",
    google_cid: p.google_cid ?? "",
    statut_validation: p.statut_validation,
    date_envoi_preview: p.date_envoi_preview ? p.date_envoi_preview.slice(0, 10) : "",
    date_validation: p.date_validation ? p.date_validation.slice(0, 10) : "",
    notes_internes: p.notes_internes ?? "",
    actif: p.actif,
    ordre_affichage: p.ordre_affichage ?? 0,
  };
}

function parseTags(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function PraticienDrawer({
  praticien,
  cabinets,
  cache,
  onSaved,
  onCancel,
}: {
  praticien: Praticien | null;
  cabinets: Cabinet[];
  cache: Map<string, AvisCache>;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => fromPraticien(praticien));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(fromPraticien(praticien));
  }, [praticien]);

  // Auto-slug si pas en mode manual
  useEffect(() => {
    if (!form.slugManual) {
      const auto = slugify(`${form.prenom} ${form.nom}`);
      if (auto !== form.slug) {
        setForm((f) => ({ ...f, slug: auto }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.prenom, form.nom]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const cacheEntry = useMemo(
    () => (form.google_place_id ? cache.get(form.google_place_id) : undefined),
    [form.google_place_id, cache],
  );

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo trop lourde (max 5 Mo)");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Format non supporté (JPEG, PNG ou WebP)");
      return;
    }
    setUploading(true);
    try {
      const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
      const slug = form.slug || slugify(`${form.prenom} ${form.nom}`) || crypto.randomUUID();
      const path = `${slug}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("praticiens-photos")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("praticiens-photos").getPublicUrl(path);
      update("photo_url", data.publicUrl);
      toast.success("Photo téléversée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec du téléversement");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    // Validation client
    const errors: string[] = [];
    if (!form.prenom.trim()) errors.push("Prénom requis");
    if (!form.nom.trim()) errors.push("Nom requis");
    if (!form.profession.trim()) errors.push("Profession requise");
    if (!form.cabinet_slug) errors.push("Cabinet requis");
    if (!form.slug || !/^[a-z0-9-]+$/.test(form.slug)) errors.push("Slug invalide");
    if (errors.length > 0) {
      toast.error(errors.join(" · "));
      return;
    }

    setSaving(true);
    try {
      await callAdminFunction("admin-upsert-praticien", {
        id: form.id,
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        slug: form.slug,
        genre: form.genre === "non-precise" ? null : form.genre,
        cabinet_slug: form.cabinet_slug,
        profession: form.profession.trim(),
        specialites: parseTags(form.specialitesText),
        problematiques: parseTags(form.problematiquesText),
        bio_courte: form.bio_courte || null,
        bio_courte_en: form.bio_courte_en || null,
        bio_longue: form.bio_longue || null,
        bio_longue_en: form.bio_longue_en || null,
        photo_url: form.photo_url || null,
        lien_rdv: form.lien_rdv || null,
        google_place_id: form.google_place_id.trim() || null,
        google_kgmid: form.google_kgmid.trim() || null,
        google_cid: form.google_cid.trim() || null,
        statut_validation: form.statut_validation,
        date_envoi_preview: form.date_envoi_preview || null,
        date_validation: form.date_validation || null,
        notes_internes: form.notes_internes || null,
        actif: form.actif,
        ordre_affichage: Number(form.ordre_affichage) || 0,
      });
      toast.success("Fiche enregistrée");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur d'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* A. Identité */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">A. Identité</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Prénom *</Label>
            <Input
              value={form.prenom}
              onChange={(e) => update("prenom", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Nom *</Label>
            <Input
              value={form.nom}
              onChange={(e) => update("nom", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) => {
              update("slug", slugify(e.target.value));
              update("slugManual", true);
            }}
            className="mt-1 font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Auto-généré depuis prénom+nom. Modifiable.
          </p>
        </div>
        <div>
          <Label>Genre</Label>
          <RadioGroup
            value={form.genre}
            onValueChange={(v) => update("genre", v)}
            className="flex gap-4 mt-1"
          >
            {[
              { v: "F", l: "Femme" },
              { v: "M", l: "Homme" },
              { v: "X", l: "Non binaire" },
              { v: "non-precise", l: "Non précisé" },
            ].map((opt) => (
              <label key={opt.v} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <RadioGroupItem value={opt.v} />
                {opt.l}
              </label>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label>Cabinet *</Label>
          <Select
            value={form.cabinet_slug}
            onValueChange={(v) => update("cabinet_slug", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choisir un cabinet" />
            </SelectTrigger>
            <SelectContent>
              {cabinets.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name} <span className="text-muted-foreground ml-1">({c.city})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      {/* B. Profession & Spécialités */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">B. Profession & Spécialités</h3>
        <div>
          <Label>Profession *</Label>
          <Input
            value={form.profession}
            onChange={(e) => update("profession", e.target.value)}
            className="mt-1"
            placeholder="Ex: Sophrologue, Psychologue…"
          />
        </div>
        <div>
          <Label>Spécialités</Label>
          <Input
            value={form.specialitesText}
            onChange={(e) => update("specialitesText", e.target.value)}
            className="mt-1"
            placeholder="séparées par virgules"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {parseTags(form.specialitesText).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
        <div>
          <Label>Problématiques accompagnées</Label>
          <Input
            value={form.problematiquesText}
            onChange={(e) => update("problematiquesText", e.target.value)}
            className="mt-1"
            placeholder="séparées par virgules"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {parseTags(form.problematiquesText).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* C. Bio */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">C. Bio</h3>
        <div>
          <Label>Bio courte FR</Label>
          <Textarea
            rows={3}
            value={form.bio_courte}
            onChange={(e) => update("bio_courte", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Bio courte EN <span className="text-xs text-muted-foreground">(optionnel)</span></Label>
          <Textarea
            rows={3}
            value={form.bio_courte_en}
            onChange={(e) => update("bio_courte_en", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Bio longue FR</Label>
          <Textarea
            rows={8}
            value={form.bio_longue}
            onChange={(e) => update("bio_longue", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Bio longue EN <span className="text-xs text-muted-foreground">(optionnel)</span></Label>
          <Textarea
            rows={8}
            value={form.bio_longue_en}
            onChange={(e) => update("bio_longue_en", e.target.value)}
            className="mt-1"
          />
        </div>
      </section>

      <Separator />

      {/* D. Photo */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">D. Photo</h3>
        <div className="flex items-center gap-4">
          {form.photo_url ? (
            <img
              src={form.photo_url}
              alt="aperçu"
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted border flex items-center justify-center text-xs text-muted-foreground">
              Aucune
            </div>
          )}
          <div className="flex-1 space-y-2">
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  e.currentTarget.value = "";
                }}
              />
              <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                <span>
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Téléverser
                </span>
              </Button>
            </label>
            {form.photo_url && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => update("photo_url", "")}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Retirer la photo
              </Button>
            )}
            <p className="text-xs text-muted-foreground">JPEG/PNG/WebP, 5 Mo max.</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* E. Prise de RDV */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">E. Prise de RDV</h3>
        <div>
          <Label>Lien RDV</Label>
          <Input
            value={form.lien_rdv}
            onChange={(e) => update("lien_rdv", e.target.value)}
            className="mt-1"
            placeholder="https://www.doctolib.fr/…"
          />
        </div>
      </section>

      <Separator />

      {/* F. Identifiants Google */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">F. Identifiants Google</h3>
        <div>
          <Label>google_place_id <span className="text-xs text-muted-foreground">(format ChIJ…)</span></Label>
          <Input
            value={form.google_place_id}
            onChange={(e) => update("google_place_id", e.target.value)}
            className="mt-1 font-mono text-xs"
          />

          {/* a) Indicateur cache */}
          <div className="mt-2 text-xs">
            {!form.google_place_id ? (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <AlertCircle className="w-3.5 h-3.5" /> Aucun Place ID
              </span>
            ) : cacheEntry && cacheEntry.rating ? (
              <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cache disponible · {cacheEntry.rating} ★ · {cacheEntry.user_ratings_total ?? 0} avis · MAJ{" "}
                {new Date(cacheEntry.last_updated_at).toLocaleDateString("fr-FR")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-orange-700 dark:text-orange-400">
                <AlertCircle className="w-3.5 h-3.5" /> Pas encore en cache
              </span>
            )}
          </div>

          {/* b) Lien vérification fiche Google */}
          {form.google_place_id && (
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(form.google_place_id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5"
            >
              Vérifier la fiche Google <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* c) Note d'aide */}
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            💡 Si le praticien a plusieurs fiches Google (ancienne + nouvelle), veille à
            renseigner ici l'identifiant de la fiche active. Cas typiques : déménagement de
            cabinet ou changement d'activité avec création d'une nouvelle fiche.
          </p>

          {/* d) Bouton refresh désactivé */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-block mt-2">
                <Button type="button" variant="outline" size="sm" disabled>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Rafraîchir maintenant
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Edge Function refresh-google-reviews à venir</TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Label>google_kgmid <span className="text-xs text-muted-foreground">(format /g/11…)</span></Label>
          <Input
            value={form.google_kgmid}
            onChange={(e) => update("google_kgmid", e.target.value)}
            className="mt-1 font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Utilisé pour les liens cliquables vers la fiche GBP (témoignages, cabinets).
          </p>
        </div>

        <div>
          <Label>google_cid <span className="text-xs text-muted-foreground">(backup décimal)</span></Label>
          <Input
            value={form.google_cid}
            onChange={(e) => update("google_cid", e.target.value)}
            className="mt-1 font-mono text-xs"
          />
        </div>
      </section>

      <Separator />

      {/* G. Statut & Suivi */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">G. Statut & Suivi</h3>
        <div>
          <Label>Statut de validation</Label>
          <Select
            value={form.statut_validation}
            onValueChange={(v) => update("statut_validation", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUTS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Date envoi preview</Label>
            <Input
              type="date"
              value={form.date_envoi_preview}
              onChange={(e) => update("date_envoi_preview", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Date de validation</Label>
            <Input
              type="date"
              value={form.date_validation}
              onChange={(e) => update("date_validation", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label>Notes internes</Label>
          <Textarea
            rows={3}
            value={form.notes_internes}
            onChange={(e) => update("notes_internes", e.target.value)}
            className="mt-1"
          />
        </div>
      </section>

      <Separator />

      {/* H. Affichage */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">H. Affichage</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="actif">Actif</Label>
          <Switch
            id="actif"
            checked={form.actif}
            onCheckedChange={(v) => update("actif", v)}
          />
        </div>
        <div>
          <Label>Ordre d'affichage</Label>
          <Input
            type="number"
            value={form.ordre_affichage}
            onChange={(e) => update("ordre_affichage", Number(e.target.value))}
            className="mt-1 w-32"
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background pb-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          <X className="w-4 h-4 mr-1.5" /> Annuler
        </Button>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
          Enregistrer
        </Button>
      </div>
    </div>
  );
}