// Struttura sezioni footer con link navigazione
export const FOOTER_SECTIONS = [
  {
    title: "Piattaforma",
    links: [
      { text: "Link", href: "#" },
      { text: "Dataset Disponibili", href: "#" },
      { text: "Chatbot AI", href: "#" }
    ]
  },
  {
    title: "Risorse",
    links: [
      { text: "Documentazione", href: "#" },
      { text: "Guide", href: "#" },
      { text: "FAQ", href: "#" }
    ]
  },
  {
    title: "Supporto",
    links: [
      { text: "Centro Assistenza", href: "#" },
      { text: "Contatti", href: "#" },
      { text: "Privacy & Termini", href: "#" }
    ]
  }
] as const;
