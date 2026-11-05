import type { Localized } from "@/i18n/config";
import type { TeamMemberId } from "./team";

export const categories = ["residential", "development", "public", "hospitality", "office", "renovation"] as const;
export const statuses = ["concept", "approved", "construction", "delivered"] as const;
export const mediaKinds = ["renders", "construction", "plans", "beforeAfter"] as const;

export type CategoryKey = (typeof categories)[number];
export type StatusKey = (typeof statuses)[number];
export type MediaKey = (typeof mediaKinds)[number];

/** Illustrations SVG provisoires (voir components/project-visual.tsx). */
export type VisualKind = "villa" | "tower" | "pavilion" | "resort" | "office" | "house" | "interior" | "aerial";

export type Project = {
  slug: string;
  number: string;
  name: string;
  city: Localized;
  country: Localized;
  category: CategoryKey;
  status: StatusKey;
  /** Année de référence du projet ou de livraison, selon son statut. */
  year: number;
  period: string;
  /** Surface de plancher, en m². */
  surface: number;
  visual: VisualKind;
  summary: Localized;
  concept: { lead: Localized; body: Localized };
  facts: { label: Localized; value: Localized }[];
  renders: { visual: VisualKind; caption: Localized }[];
  construction: { date: string; label: Localized; progress: number }[];
  plans: { kind: "plan" | "section"; caption: Localized }[];
  beforeAfter: boolean;
  team: TeamMemberId[];
};

// Projets FICTIFS : contenu provisoire, à remplacer par les vrais projets.
export const projects: Project[] = [
  {
    slug: "villa-lagune",
    number: "01",
    name: "Villa Lagune",
    city: { fr: "Assinie", en: "Assinie" },
    country: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" },
    category: "residential",
    status: "delivered",
    year: 2025,
    period: "2023 — 2025",
    surface: 620,
    visual: "villa",
    summary: {
      fr: "Une villa en porte-à-faux tournée vers la lagune, pensée pour vivre dehors à l'ombre.",
      en: "A cantilevered villa facing the lagoon, designed for shaded outdoor living.",
    },
    concept: {
      lead: {
        fr: "Deux volumes superposés qui s'ouvrent sur la lagune, pour vivre dehors à l'ombre.",
        en: "Two stacked volumes opening onto the lagoon, for living outdoors in the shade.",
      },
      body: {
        fr: "Le niveau supérieur se projette en porte-à-faux et protège la terrasse du soleil de l'après-midi. Les façades vitrées s'effacent entièrement pour laisser passer la brise de la lagune. Les matériaux locaux, bois et pierre de latérite, ancrent la maison dans son paysage.",
        en: "The upper level cantilevers out to shade the terrace from the afternoon sun. The glazed façades slide away entirely to let the lagoon breeze through. Local materials, timber and laterite stone, root the house in its landscape.",
      },
    },
    facts: [
      { label: { fr: "Terrain", en: "Plot" }, value: { fr: "2 400 m²", en: "2,400 m²" } },
      { label: { fr: "Niveaux", en: "Levels" }, value: { fr: "R+1, toit-terrasse", en: "2 floors, roof terrace" } },
      { label: { fr: "Programme", en: "Programme" }, value: { fr: "5 chambres, piscine, ponton", en: "5 bedrooms, pool, jetty" } },
      { label: { fr: "Durée du chantier", en: "Construction time" }, value: { fr: "15 mois", en: "15 months" } },
      { label: { fr: "Client", en: "Client" }, value: { fr: "Particulier, résident en France", en: "Private client based in France" } },
    ],
    renders: [
      { visual: "villa", caption: { fr: "Façade côté lagune", en: "Lagoon façade" } },
      { visual: "interior", caption: { fr: "Séjour ouvert", en: "Open living room" } },
      { visual: "aerial", caption: { fr: "Vue aérienne et ponton", en: "Aerial view and jetty" } },
    ],
    construction: [
      { date: "2024-03", label: { fr: "Terrassement et fondations", en: "Earthworks and foundations" }, progress: 0.1 },
      { date: "2024-06", label: { fr: "Gros œuvre, rez-de-chaussée", en: "Structure, ground floor" }, progress: 0.45 },
      { date: "2024-10", label: { fr: "Étage et porte-à-faux", en: "Upper floor and cantilever" }, progress: 0.8 },
      { date: "2025-02", label: { fr: "Menuiseries et finitions", en: "Joinery and finishes" }, progress: 0.9 },
      { date: "2025-06", label: { fr: "Livraison", en: "Handover" }, progress: 1 },
    ],
    plans: [
      { kind: "plan", caption: { fr: "Plan du rez-de-chaussée", en: "Ground floor plan" } },
      { kind: "section", caption: { fr: "Coupe A-A", en: "Section A-A" } },
    ],
    beforeAfter: true,
    team: ["mo-kassi"],
  },
  {
    slug: "residence-plateau-sky",
    number: "02",
    name: "Résidence Plateau Sky",
    city: { fr: "Abidjan", en: "Abidjan" },
    country: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" },
    category: "development",
    status: "construction",
    year: 2026,
    period: "2024 — 2026",
    surface: 9400,
    visual: "tower",
    summary: {
      fr: "84 logements sur 14 niveaux, avec loggias profondes et jardin suspendu.",
      en: "84 apartments over 14 floors, with deep loggias and a sky garden.",
    },
    concept: {
      lead: {
        fr: "Une tour élancée dont chaque logement possède sa pièce extérieure.",
        en: "A slender tower where every apartment has its own outdoor room.",
      },
      body: {
        fr: "Les loggias profondes protègent les façades du soleil et prolongent les séjours vers l'extérieur. Au 8e niveau, un jardin suspendu partagé offre une vue dégagée sur la lagune Ébrié. Le socle accueille commerces et parkings.",
        en: "Deep loggias shield the façades from the sun and extend the living rooms outdoors. On the 8th floor, a shared sky garden looks out over the Ébrié lagoon. The podium houses shops and parking.",
      },
    },
    facts: [
      { label: { fr: "Logements", en: "Apartments" }, value: { fr: "84, du T2 au T5", en: "84, from 1 to 4 bedrooms" } },
      { label: { fr: "Niveaux", en: "Levels" }, value: { fr: "R+13, 2 sous-sols", en: "14 floors, 2 basements" } },
      { label: { fr: "Client", en: "Client" }, value: { fr: "Promoteur immobilier", en: "Property developer" } },
      { label: { fr: "Livraison prévue", en: "Expected delivery" }, value: { fr: "Fin 2026", en: "Late 2026" } },
    ],
    renders: [
      { visual: "tower", caption: { fr: "Vue depuis le boulevard", en: "View from the boulevard" } },
      { visual: "interior", caption: { fr: "Séjour et loggia", en: "Living room and loggia" } },
    ],
    construction: [
      { date: "2024-09", label: { fr: "Fondations profondes", en: "Deep foundations" }, progress: 0.1 },
      { date: "2025-04", label: { fr: "Sous-sols et socle", en: "Basements and podium" }, progress: 0.3 },
      { date: "2025-11", label: { fr: "Structure, niveau 8", en: "Structure, level 8" }, progress: 0.65 },
    ],
    plans: [{ kind: "plan", caption: { fr: "Plan d'étage courant", en: "Typical floor plan" } }],
    beforeAfter: false,
    team: ["mo-kassi"],
  },
  {
    slug: "villa-legacy",
    number: "03",
    name: "Villa Legacy",
    city: { fr: "Bingerville", en: "Bingerville" },
    country: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" },
    category: "residential",
    status: "approved",
    year: 2026,
    period: "Octobre 2026",
    surface: 250,
    visual: "villa",
    summary: {
      fr: "Une villa duplex contemporaine à Bingerville, conçue autour de volumes sobres, d'une relation fluide entre intérieur et extérieur et d'espaces de vie généreux.",
      en: "A contemporary duplex villa in Bingerville, designed around restrained volumes, a fluid indoor-outdoor relationship and generous living spaces.",
    },
    concept: {
      lead: {
        fr: "Une architecture contemporaine qui associe volumes maîtrisés, lumière naturelle et ouverture sur les espaces extérieurs.",
        en: "Contemporary architecture combining carefully composed volumes, natural light and openness to outdoor spaces.",
      },
      body: {
        fr: "Villa Legacy développe un programme résidentiel sur deux niveaux. Le rez-de-chaussée rassemble les espaces de réception, la cuisine, une suite et les espaces de service, en lien avec la terrasse et la piscine. À l'étage, trois chambres, des dressings, des salles d'eau et une salle de sport composent un espace nuit indépendant. Le dossier architectural présente le projet en phase de conception validée ; les travaux n'ont pas encore commencé.",
        en: "Villa Legacy organizes a two-level residential programme. The ground floor brings together reception areas, the kitchen, a suite and service spaces, connected to the terrace and swimming pool. Upstairs, three bedrooms, dressing rooms, bathrooms and a gym form a separate private area. The architectural dossier presents the project at an approved design stage; construction has not yet started.",
      },
    },
    facts: [
      { label: { fr: "Programme", en: "Programme" }, value: { fr: "Villa duplex · 4 espaces de couchage", en: "Duplex villa · 4 sleeping rooms" } },
      { label: { fr: "Niveaux", en: "Levels" }, value: { fr: "Rez-de-chaussée + 1 étage", en: "Ground floor + 1 upper floor" } },
      { label: { fr: "Espaces complémentaires", en: "Additional spaces" }, value: { fr: "Piscine, garage, salle de sport, dressings", en: "Swimming pool, garage, gym, dressing rooms" } },
      { label: { fr: "Surface annoncée", en: "Stated floor area" }, value: { fr: "250 m²", en: "250 m²" } },
      { label: { fr: "État du projet", en: "Project stage" }, value: { fr: "Projet validé · travaux non commencés", en: "Approved design · construction not started" } },
    ],
    renders: [],
    construction: [],
    plans: [],
    beforeAfter: false,
    team: [],
  },
  {
    slug: "hotel-dune-rose",
    number: "04",
    name: "Hôtel Dune Rose",
    city: { fr: "Saly", en: "Saly" },
    country: { fr: "Sénégal", en: "Senegal" },
    category: "hospitality",
    status: "concept",
    year: 2027,
    period: "2027",
    surface: 5800,
    visual: "resort",
    summary: {
      fr: "Un hôtel de 60 clés posé sur la dune, face à l'océan.",
      en: "A 60-key hotel set on the dune, facing the ocean.",
    },
    concept: {
      lead: {
        fr: "Des terrasses en gradins qui suivent la pente de la dune jusqu'à la plage.",
        en: "Stepped terraces that follow the slope of the dune down to the beach.",
      },
      body: {
        fr: "Chaque chambre ouvre sur l'océan grâce aux niveaux décalés. Les enduits teintés reprennent la couleur du sable. Le restaurant et la piscine forment le cœur de l'hôtel, à l'abri du vent.",
        en: "Every room opens to the ocean thanks to the staggered levels. Tinted renders echo the colour of the sand. The restaurant and pool form the heart of the hotel, sheltered from the wind.",
      },
    },
    facts: [
      { label: { fr: "Chambres", en: "Rooms" }, value: { fr: "60 clés, dont 8 suites", en: "60 keys, including 8 suites" } },
      { label: { fr: "Client", en: "Client" }, value: { fr: "Groupe hôtelier", en: "Hotel group" } },
    ],
    renders: [{ visual: "resort", caption: { fr: "Terrasses côté océan", en: "Ocean-side terraces" } }],
    construction: [],
    plans: [],
    beforeAfter: false,
    team: ["mo-kassi"],
  },
  {
    slug: "tour-atlantis",
    number: "05",
    name: "Tour Atlantis",
    city: { fr: "Lomé", en: "Lomé" },
    country: { fr: "Togo", en: "Togo" },
    category: "office",
    status: "construction",
    year: 2026,
    period: "2024 — 2026",
    surface: 12600,
    visual: "office",
    summary: {
      fr: "Un immeuble de bureaux à façade bioclimatique sur le front de mer.",
      en: "An office building with a bioclimatic façade on the seafront.",
    },
    concept: {
      lead: {
        fr: "Une double peau de lames verticales qui filtre le soleil et la chaleur.",
        en: "A double skin of vertical fins that filters sun and heat.",
      },
      body: {
        fr: "Les lames orientées réduisent les besoins en climatisation. Les plateaux libres de 900 m² s'adaptent à tous les usages. Le hall traversant relie la ville au front de mer.",
        en: "The angled fins reduce cooling needs. Open 900 m² floor plates adapt to any use. A through-lobby connects the city to the seafront.",
      },
    },
    facts: [
      { label: { fr: "Niveaux", en: "Levels" }, value: { fr: "R+12", en: "13 floors" } },
      { label: { fr: "Plateaux", en: "Floor plates" }, value: { fr: "900 m² libres", en: "900 m² open plan" } },
      { label: { fr: "Client", en: "Client" }, value: { fr: "Investisseur privé", en: "Private investor" } },
    ],
    renders: [{ visual: "office", caption: { fr: "Façade sur mer", en: "Seafront façade" } }],
    construction: [
      { date: "2024-11", label: { fr: "Terrassement", en: "Earthworks" }, progress: 0.1 },
      { date: "2025-07", label: { fr: "Structure, niveau 6", en: "Structure, level 6" }, progress: 0.45 },
    ],
    plans: [{ kind: "plan", caption: { fr: "Plan d'étage type", en: "Typical floor plan" } }],
    beforeAfter: false,
    team: ["mo-kassi"],
  },
  {
    slug: "maison-kaya",
    number: "06",
    name: "Maison Kaya",
    city: { fr: "Grand-Bassam", en: "Grand-Bassam" },
    country: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" },
    category: "renovation",
    status: "delivered",
    year: 2024,
    period: "2023 — 2024",
    surface: 280,
    visual: "house",
    summary: {
      fr: "La rénovation d'une maison coloniale du quartier historique.",
      en: "The renovation of a colonial house in the historic district.",
    },
    concept: {
      lead: {
        fr: "Restaurer la maison d'origine et y glisser une extension contemporaine.",
        en: "Restoring the original house and slipping in a contemporary extension.",
      },
      body: {
        fr: "Les varangues et les persiennes d'origine ont été restaurées à l'identique. À l'arrière, une extension légère en bois accueille la cuisine et une chambre ouverte sur le jardin.",
        en: "The original verandas and shutters were restored like for like. At the back, a light timber extension houses the kitchen and a bedroom opening onto the garden.",
      },
    },
    facts: [
      { label: { fr: "Programme", en: "Programme" }, value: { fr: "Maison familiale, 4 chambres", en: "Family home, 4 bedrooms" } },
      { label: { fr: "Durée du chantier", en: "Construction time" }, value: { fr: "11 mois", en: "11 months" } },
      { label: { fr: "Client", en: "Client" }, value: { fr: "Particulier", en: "Private client" } },
    ],
    renders: [],
    construction: [
      { date: "2023-09", label: { fr: "Dépose et diagnostic", en: "Strip-out and survey" }, progress: 0.2 },
      { date: "2024-02", label: { fr: "Restauration des façades", en: "Façade restoration" }, progress: 0.6 },
      { date: "2024-08", label: { fr: "Livraison", en: "Handover" }, progress: 1 },
    ],
    plans: [{ kind: "plan", caption: { fr: "Plan après travaux", en: "Plan after works" } }],
    beforeAfter: true,
    team: ["mo-kassi"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}

export function projectMedia(project: Project): MediaKey[] {
  const media: MediaKey[] = [];
  if (project.renders.length) media.push("renders");
  if (project.construction.length) media.push("construction");
  if (project.plans.length) media.push("plans");
  if (project.beforeAfter) media.push("beforeAfter");
  return media;
}
