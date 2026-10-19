export interface Project {
  name: string;
  logo: string;
  year: string;
  decoration: string;
  rotation: string;
  bright: boolean;
  invert: boolean;
  category?: 'partnership' | 'case';
  description?: string;
  /** O que a TZOLKIN fez no projeto. Só preencher com informação confirmada. */
  role?: string;
  /** Estágio atual do projeto (ex.: "Em operação"). TODO(PO): confirmar por projeto. */
  stage?: string;
  instagram?: string;
  instagramPostUrl?: string;
  website?: string;
  location?: string;
  gallery?: string[];
}

export const projects: Project[] = [
  {
    name: "Powerhouse Brasil",
    logo: "/logo-powerhouse.png",
    year: "2024",
    decoration: "/bg-institutional.png",
    rotation: "rotate-[12deg]",
    bright: true,
    invert: false,
    category: 'case',
    description: "Aceleradora de negócios e educação corporativa.",
    role: "Infraestrutura.",
    website: "https://powerhousebrasil.com.br/",
    gallery: []
  },
  {
    name: "Kalidash",
    logo: "/logo-kalidash.webp",
    year: "2024",
    decoration: "/bg-ecommerce.png",
    rotation: "rotate-[30deg]",
    bright: false,
    invert: false,
    category: 'case',
    description: "Gestão e dashboards.",
    role: "Construção do ecossistema de visualização de dados.",
    website: "https://kalidash.com/",
    gallery: []
  },
  {
    name: "NovoDash",
    logo: "",
    year: "2024",
    decoration: "/bg-optimization.png",
    rotation: "rotate-[45deg]",
    bright: false,
    invert: false,
    category: 'case',
    description: "Plataforma analítica e de BI.",
    role: "Desenvolvimento da plataforma.",
    website: "https://novodash.com/",
    gallery: []
  },
  {
    name: "KidStok",
    logo: "/logo-kidstok.png",
    year: "2024",
    decoration: "/bg-ecommerce.png",
    rotation: "rotate-[37deg]",
    bright: false,
    invert: false,
    category: 'case',
    description: "Rede de franquias de moda infantil.",
    instagram: "https://www.instagram.com/kidstok/",
    instagramPostUrl: "https://www.instagram.com/p/DRM2Nr0keFb/",
    website: "https://kidstok.com.br/",
    location: "Brasil (Franquia)",
    gallery: ["/projects/kidstok-website.png", "/projects/kidstok-instagram.png"]
  },
  {
    name: "Instituto Vale",
    logo: "/logo-vale.png",
    year: "2024",
    decoration: "/bg-institutional.png",
    rotation: "rotate-[21deg]",
    bright: false,
    invert: false,
    category: 'partnership',
    description: "Uma das maiores mineradoras do mundo. Foco em minério de ferro, pelotas e níquel.",
    instagram: "https://www.instagram.com/valenobrasil/",
    website: "http://www.vale.com/",
    location: "Global",
    gallery: ["/projects/vale-website.png", "/projects/vale-website.png"]
  },
  {
    name: "Mr. Fit",
    logo: "/logo-mr-fit.png",
    year: "2024",
    decoration: "/bg-optimization.png",
    rotation: "rotate-[5deg]",
    bright: false,
    invert: false,
    category: 'partnership',
    description: "Franquia de alimentação saudável, oferecendo refeições equilibradas e fit.",
    instagram: "https://www.instagram.com/mrfitfranquiasoficial/",
    website: "https://www.mrfit.com.br/",
    location: "Pampulha - MG",
    gallery: ["/projects/mr-fit-website.png", "/projects/mr-fit-website.png"]
  },
  {
    name: "Assinatura Marca Própria",
    logo: "",
    year: "2024",
    decoration: "/bg-institutional.png",
    rotation: "rotate-[25deg]",
    bright: false,
    invert: false,
    category: 'case',
    description: "Projeto de assinatura de marca própria.",
    role: "Arquitetura de software.",
    website: "https://assinaturamarcapropria.com/",
    gallery: []
  }
];
