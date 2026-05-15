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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { callAdminFunction } from "@/lib/adminAuth";
import type { AvisCache, Cabinet, Praticien } from "@/pages/admin/AdminPraticiens";
import { googleMapsPlaceUrl } from "@/lib/google-maps-url";
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setForm(fromPraticien(praticien));
  }, [praticien]);

  // Reset confirmation quand on change de fiche
  useEffect(() => {
    setDeleteConfirm("");
    setDeleteOpen(false);
  }, [praticien?.id]);

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
        <DerivedTagsBlock praticien={praticien} onRefreshed={onSaved} />
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
          {(() => {
            const verifyUrl = googleMapsPlaceUrl(
              `${form.prenom} ${form.nom} ${form.profession}`.trim(),
              form.google_place_id,
            );
            return verifyUrl ? (
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5"
              >
                Vérifier la fiche Google <ExternalLink className="w-3 h-3" />
              </a>
            ) : null;
          })()}

          {/* c) Note d'aide */}
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            💡 Si le praticien a plusieurs fiches Google (ancienne + nouvelle), veille à
            renseigner ici l'identifiant de la fiche active. Cas typiques : déménagement de
            cabinet ou changement d'activité avec création d'une nouvelle fiche.
          </p>

          {/* d) Bouton refresh désactivé */}
          <RefreshGoogleButton placeId={form.google_place_id.trim()} />
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

      {/* I. Zone de danger — suppression définitive (uniquement si fiche existante) */}
      {form.id && (() => {
        const isLive = form.statut_validation === "validee" || form.actif === true;
        const tooltipMsg = isLive
          ? "Désactivez la fiche (Actif = off) et repassez-la en brouillon avant de pouvoir la supprimer définitivement."
          : "";
        const button = (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLive || deleting}
            onClick={() => {
              setDeleteConfirm("");
              setDeleteOpen(true);
            }}
            className="border-[#B89B6F]/50 text-[#7A4A3A] hover:bg-[#D9C7A1]/15 hover:text-[#7A4A3A]"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Supprimer définitivement cette fiche
          </Button>
        );
        return (
          <>
            <Separator />
            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#7A4A3A]">
                Zone de danger
              </h3>
              <p className="text-xs text-muted-foreground">
                La suppression est irréversible et ne peut s'effectuer que sur une fiche en brouillon, refusée, ou désactivée.
              </p>
              {isLive ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-block">{button}</span>
                  </TooltipTrigger>
                  <TooltipContent>{tooltipMsg}</TooltipContent>
                </Tooltip>
              ) : (
                button
              )}
            </section>
          </>
        );
      })()}

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

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suppression définitive</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer définitivement la fiche de{" "}
              <span className="font-medium text-foreground">
                {form.prenom} {form.nom}
              </span>
              . Cette action est irréversible. Toutes les données associées seront perdues : bio, photo, tags dérivés, historique d'extraction, candidats taxonomie liés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-suppr" className="text-xs">
              Tapez <span className="font-mono font-semibold">SUPPRIMER</span> pour confirmer
            </Label>
            <Input
              id="confirm-suppr"
              autoFocus
              autoComplete="off"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="font-mono"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteConfirm !== "SUPPRIMER" || deleting}
              onClick={async (e) => {
                e.preventDefault();
                if (!form.id || deleteConfirm !== "SUPPRIMER") return;
                setDeleting(true);
                try {
                  await callAdminFunction("admin-delete-praticien", {
                    praticien_id: form.id,
                    confirmation: "SUPPRIMER",
                  });
                  toast.success("Fiche supprimée.");
                  setDeleteOpen(false);
                  onSaved();
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "Échec de la suppression",
                  );
                } finally {
                  setDeleting(false);
                }
              }}
              className="bg-[#7A4A3A] hover:bg-[#5E3829] text-white"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RefreshGoogleButton({ placeId }: { placeId: string }) {
  const [loading, setLoading] = useState(false);
  const disabled = !placeId;

  const onClick = async () => {
    if (!placeId) return;
    setLoading(true);
    try {
      const res = await callAdminFunction<{
        success?: boolean;
        summary?: { refreshed: number; errors: number };
        details?: Array<{ status: string; error?: string; rating?: number; count?: number }>;
      }>("refresh-google-reviews", { place_id: placeId });
      const d = res.details?.[0];
      if (d?.status === "refreshed") {
        toast.success(
          `Avis rafraîchis ✓${d.rating ? ` — ${d.rating.toFixed(1)} ★ · ${d.count ?? 0} avis` : ""}`,
        );
      } else if (d?.status === "error") {
        toast.error(`Erreur Google : ${d.error ?? "inconnue"}`);
      } else {
        toast.message("Aucune mise à jour effectuée");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const button = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
      ) : (
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
      )}
      Rafraîchir maintenant
    </Button>
  );

  if (disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="inline-block mt-2">{button}</span>
        </TooltipTrigger>
        <TooltipContent>Renseigne d'abord un google_place_id</TooltipContent>
      </Tooltip>
    );
  }
  return <div className="inline-block mt-2">{button}</div>;
}

function statusColor(status: string): string {
  switch (status) {
    case "success":
      return "bg-[#9EB8A5]/20 text-[#2B2B2B] border-[#9EB8A5]";
    case "review":
      return "bg-[#D9C7A1]/30 text-[#2B2B2B] border-[#B89B6F]";
    case "error":
      return "bg-destructive/15 text-destructive border-destructive/40";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function DerivedTagsBlock({
  praticien,
  onRefreshed,
}: {
  praticien: Praticien | null;
  onRefreshed: () => void;
}) {
  const [loading, setLoading] = useState(false);
  if (!praticien) {
    return (
      <p className="text-xs text-muted-foreground italic">
        Tags dérivés disponibles après la première sauvegarde.
      </p>
    );
  }
  const status = praticien.tags_extraction_status ?? "pending";
  const extractedAt = praticien.tags_extracted_at
    ? new Date(praticien.tags_extracted_at).toLocaleString("fr-FR")
    : "—";
  const onClick = async () => {
    setLoading(true);
    try {
      const res = await callAdminFunction<{
        status?: string;
        specialites?: string[];
        problematiques?: string[];
      }>("admin-reextract-tags", { praticien_id: praticien.id });
      const ns = res.specialites?.length ?? 0;
      const np = res.problematiques?.length ?? 0;
      toast.success(
        `Extraction ${res.status} · ${ns} spécialités · ${np} problématiques`,
      );
      onRefreshed();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur d'extraction");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Tags dérivés (filtre /patients)
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border ${statusColor(status)}`}
        >
          {status}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="text-[11px] text-muted-foreground">Spécialités dérivées</div>
        <div className="flex flex-wrap gap-1">
          {(praticien.specialites_derivees ?? []).length === 0 ? (
            <span className="text-xs italic text-muted-foreground">aucune</span>
          ) : (
            (praticien.specialites_derivees ?? []).map((t) => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="text-[11px] text-muted-foreground">Problématiques dérivées</div>
        <div className="flex flex-wrap gap-1">
          {(praticien.problematiques_derivees ?? []).length === 0 ? (
            <span className="text-xs italic text-muted-foreground">aucune</span>
          ) : (
            (praticien.problematiques_derivees ?? []).map((t) => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-muted-foreground">
          Dernière extraction : {extractedAt}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={onClick}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          )}
          Réextraire les tags
        </Button>
      </div>
    </div>
  );
}