/* ==========================================================================
   Configuração editável do site
   --------------------------------------------------------------------------
   Este arquivo concentra os dados institucionais e os links usados em todo o
   site. Ao confirmar uma informação com a associação, atualize aqui.
   ========================================================================== */

window.AMMG_CONFIG = {
  /* Enquanto a associação não aprovar o site, mantemos o aviso de prévia.
     Troque para false somente depois da validação. */
  isProposal: true,
  version: "prévia 1.0",
  updated: "2026-11-10",

  org: {
    name: "Associação de Mulheres Maria da Glória",
    shortName: "Maria da Glória",
    legalName: "Associação de Mulheres Maria da Glória",
    cnpj: "48.269.348/0001-05",
    founded: "22/08/2022",
    foundedISO: "2022-08-22",
    cozinhaSolidaria: "CS017254",
    mealsPerDay: 800,
    daysOfWeek: "segunda a sábado",
    email: "angelacomunal@yahoo.com.br",
    phone: null,
    whatsapp: null,
    instagram: null,
    facebook: null,
    pix: null,
    address: {
      street: "Rua Santa Teresa, 681, Casa 89",
      district: "Vila São José — Morro da Cruz",
      city: "Porto Alegre",
      state: "RS",
      cep: "91520-713",
      full: "Rua Santa Teresa, 681, Casa 89 — Vila São José, Morro da Cruz, Porto Alegre/RS — CEP 91520-713"
    },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua%20Santa%20Teresa%2C%20681%2C%20Casa%2089%2C%20Vila%20S%C3%A3o%20Jos%C3%A9%2C%20Porto%20Alegre%2C%20RS",
    mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=-51.170%2C-30.083%2C-51.155%2C-30.073&layer=mapnik&marker=-30.0782045%2C-51.1623248"
  },

  links: {
    pucrs: "https://www.pucrs.br/pastoral/6a-edicao-do-onibus-do-bem-ammg/",
    sul21: "https://sul21.com.br/noticias/geral/2022/04/associacao-de-mulheres-inaugura-cozinha-solidaria-no-morro-da-cruz/",
    avesol: "https://www.avesol.org.br/2022/12/voluntariado-comunitario-avesol-e.html",
    koinos: "https://koinos.org.br/2024/11/18/projeto-socioassistenciais/",
    cutrs: "https://rs.cut.org.br/noticias/cozinhas-solidarias-recebem-homenagem-na-assembleia-legislativa-do-rs-880a",
    afaso: "https://www.afaso.org.br/post/afaso-finaliza-projeto-mulheres-em-movimento-com-apoio-de-emenda-parlamentar",
    cnpj: "https://monitorcnpj.com.br/cnpj/48269348000105/",
    cozinhasSolidarias: "https://cozinhasolidarias.digital/csv1/cozinha/consulta-externa/"
  },

  forms: {
    volunteerSubject: "Quero ser voluntário(a) — site Maria da Glória",
    contactSubject: "Contato pelo site — Maria da Glória"
  },

  speechSummary: "Associação de Mulheres Maria da Glória. Cozinha comunitária no Morro da Cruz, em Porto Alegre. Servimos cerca de oitocentas refeições por dia, de segunda a sábado. Oferecemos cursos de corte e costura, culinária, confeitaria e economia solidária. Para conseguir uma refeição, vá até a Rua Santa Teresa, seiscentos e oitenta e um, Casa oitenta e nove, Vila São José. Para ajudar, envie um e-mail para angelacomunal arroba yahoo ponto com ponto br.",

  features: {
    tour: true,
    speech: true,
    share: true,
    proposalBar: true
  }
};
