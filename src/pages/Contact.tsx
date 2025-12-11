import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Building2,
  Users,
  Briefcase,
} from "lucide-react";

const contactTypes = [
  {
    id: "professionnel",
    icon: Users,
    title: "Professionnel de santé",
    description: "Vous souhaitez rejoindre un cabinet I-CA.RE",
  },
  {
    id: "collectivite",
    icon: Building2,
    title: "Collectivité / Institution",
    description: "Vous représentez une commune ou une institution",
  },
  {
    id: "investisseur",
    icon: Briefcase,
    title: "Investisseur",
    description: "Vous êtes intéressé par nos opportunités d'investissement",
  },
];

export default function Contact() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    organisation: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      toast.error("Veuillez sélectionner un type de contact");
      return;
    }
    toast.success("Votre message a été envoyé avec succès !");
    setFormData({
      nom: "",
      email: "",
      telephone: "",
      organisation: "",
      message: "",
    });
    setSelectedType(null);
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact — I-CA.RE</title>
        <meta name="description" content="Contactez I-CA.RE pour rejoindre un cabinet, collaborer sur un projet territorial ou découvrir nos opportunités d'investissement." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              Contactez-nous
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              Une question, un projet ? Notre équipe est à votre écoute.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="flex items-start gap-4 p-6 bg-secondary rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Adresse</h3>
                <p className="text-muted-foreground">Bordeaux, France</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-secondary rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a href="mailto:contact@i-care.fr" className="text-muted-foreground hover:text-foreground transition-colors">
                  contact@i-care.fr
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-secondary rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Téléphone</h3>
                <a href="tel:+33500000000" className="text-muted-foreground hover:text-foreground transition-colors">
                  05 00 00 00 00
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title mb-4">Envoyez-nous un message</h2>
              <p className="text-muted-foreground">
                Sélectionnez votre profil pour que nous puissions vous répondre de la manière la plus adaptée.
              </p>
            </div>

            {/* Contact Type Selection */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {contactTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <type.icon className={`w-8 h-8 mb-4 ${
                    selectedType === type.id ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <h3 className="font-semibold mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom complet *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organisation">
                    {selectedType === "collectivite"
                      ? "Commune / Institution"
                      : selectedType === "investisseur"
                      ? "Société"
                      : "Cabinet / Établissement"}
                  </Label>
                  <Input
                    id="organisation"
                    value={formData.organisation}
                    onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Décrivez votre projet ou votre demande..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" variant="hero" className="w-full">
                Envoyer le message
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
