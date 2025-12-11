import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  Wifi,
  Car,
  Shield,
  Sparkles,
  Accessibility,
  Volume2,
  Users,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Heart,
  Brain,
  Activity,
  MessageCircle,
  Ear,
} from "lucide-react";
import medicalOffice from "@/assets/medical-office.jpg";

const benefits = [
  { icon: Building2, title: "Cabinets neufs ou entièrement rénovés" },
  { icon: Sparkles, title: "Ergonomie métier adaptée à votre pratique" },
  { icon: Volume2, title: "Isolation acoustique optimale" },
  { icon: Shield, title: "Maintenance incluse" },
  { icon: Users, title: "Respect de l'intimité patient" },
  { icon: Building2, title: "Espaces communs optimisés" },
  { icon: Wifi, title: "Internet fibre + domotique" },
  { icon: Car, title: "Parking / accès transports" },
  { icon: Accessibility, title: "Accessibilité PMR complète" },
];

const professions = [
  {
    icon: Stethoscope,
    name: "Médecin Généraliste",
    description: "Cabinets pensés pour la consultation de médecine générale, avec salle d'examen équipée.",
  },
  {
    icon: Heart,
    name: "Infirmier(ère)",
    description: "Espaces adaptés aux soins infirmiers, avec stockage sécurisé du matériel.",
  },
  {
    icon: Activity,
    name: "Kinésithérapeute",
    description: "Plateaux techniques spacieux, équipements de rééducation possibles.",
  },
  {
    icon: Brain,
    name: "Ostéopathe",
    description: "Cabinets calmes et lumineux, idéaux pour les séances de manipulation.",
  },
  {
    icon: MessageCircle,
    name: "Psychologue",
    description: "Isolation acoustique renforcée, atmosphère apaisante pour les consultations.",
  },
  {
    icon: Ear,
    name: "Orthophoniste",
    description: "Espaces dédiés aux séances de rééducation, insonorisés et adaptés.",
  },
];

const projects = [
  {
    name: "Floirac",
    location: "Gironde",
    status: "En cours",
    available: ["Médecin généraliste", "Infirmier", "Kiné"],
    surface: "20-45 m²",
    delivery: "T3 2025",
  },
  {
    name: "Bordeaux Bastide",
    location: "Gironde",
    status: "Disponible",
    available: ["Psychologue", "Orthophoniste"],
    surface: "18-25 m²",
    delivery: "Immédiat",
  },
  {
    name: "Toulouse Saint-Cyprien",
    location: "Haute-Garonne",
    status: "Études",
    available: ["Toutes professions"],
    surface: "À définir",
    delivery: "2026",
  },
];

export default function Professionnels() {
  const [formData, setFormData] = useState({
    profession: "",
    nom: "",
    email: "",
    telephone: "",
    ville: "",
    disponibilite: "",
    besoins: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Votre candidature a été envoyée avec succès !");
    setFormData({
      profession: "",
      nom: "",
      email: "",
      telephone: "",
      ville: "",
      disponibilite: "",
      besoins: "",
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Professionnels de Santé — Rejoindre I-CA.RE</title>
        <meta name="description" content="Découvrez les avantages de rejoindre un cabinet I-CA.RE : locaux modernes, loyers encadrés, emplacements stratégiques. Candidatez dès maintenant." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium mb-4 block">Pour les professionnels de santé</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
                Exercez dans les meilleures conditions
              </h1>
              <p className="text-xl text-muted-foreground mb-8 opacity-0 animate-fade-up stagger-1">
                Des cabinets modernes, au cœur des quartiers, avec un accompagnement dédié pour vous concentrer sur l'essentiel : vos patients.
              </p>
              <Button variant="hero" asChild className="opacity-0 animate-fade-up stagger-2">
                <a href="#candidature">
                  Déposer ma candidature
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
            <div>
              <img
                src={medicalOffice}
                alt="Cabinet médical moderne I-CA.RE"
                className="rounded-3xl shadow-elevated w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Pourquoi rejoindre I-CA.RE ?</h2>
            <p className="section-subtitle mx-auto">
              Nous avons conçu nos espaces avec des professionnels de santé pour répondre à leurs besoins réels.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="font-medium">{benefit.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Projects */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Projets disponibles</h2>
            <p className="section-subtitle mx-auto">
              Découvrez nos centres en cours de commercialisation et à venir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.name} className="card-premium">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    project.status === "Disponible" 
                      ? "bg-green-100 text-green-800" 
                      : project.status === "En cours"
                      ? "bg-primary/20 text-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-sm text-muted-foreground">{project.location}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{project.name}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Professions recherchées :</span>
                    <p className="font-medium">{project.available.join(", ")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Surfaces :</span>
                    <p className="font-medium">{project.surface}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Livraison :</span>
                    <p className="font-medium">{project.delivery}</p>
                  </div>
                </div>
                <Button className="w-full mt-6" asChild>
                  <a href="#candidature">Je suis intéressé(e)</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profession-specific */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Des espaces adaptés à votre métier</h2>
            <p className="section-subtitle mx-auto">
              Chaque profession a ses spécificités. Nos cabinets sont conçus pour y répondre.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professions.map((profession) => (
              <div key={profession.name} className="card-premium">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-5">
                  <profession.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{profession.name}</h3>
                <p className="text-muted-foreground">{profession.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="candidature" className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">Rejoignez un futur cabinet</h2>
              <p className="text-background/70">
                Remplissez ce formulaire pour nous faire part de votre intérêt. Notre équipe vous recontactera rapidement.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-background">Profession *</Label>
                  <select
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-background/20 bg-background/10 text-background"
                    required
                  >
                    <option value="">Sélectionnez</option>
                    <option value="medecin">Médecin généraliste</option>
                    <option value="infirmier">Infirmier(ère)</option>
                    <option value="kine">Kinésithérapeute</option>
                    <option value="osteo">Ostéopathe</option>
                    <option value="psy">Psychologue</option>
                    <option value="ortho">Orthophoniste</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-background">Nom complet *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-background">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-background">Téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ville" className="text-background">Ville souhaitée *</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    placeholder="Ex: Bordeaux, Toulouse..."
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disponibilite" className="text-background">Disponibilité</Label>
                  <select
                    id="disponibilite"
                    value={formData.disponibilite}
                    onChange={(e) => setFormData({ ...formData, disponibilite: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-background/20 bg-background/10 text-background"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="immediat">Immédiate</option>
                    <option value="3mois">Dans 3 mois</option>
                    <option value="6mois">Dans 6 mois</option>
                    <option value="1an">Dans 1 an ou plus</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="besoins" className="text-background">Besoins spécifiques</Label>
                <Textarea
                  id="besoins"
                  value={formData.besoins}
                  onChange={(e) => setFormData({ ...formData, besoins: e.target.value })}
                  placeholder="Surface souhaitée, équipements particuliers, contraintes..."
                  rows={4}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
              </div>

              <Button type="submit" variant="hero" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Envoyer ma candidature
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
