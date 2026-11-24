/* ==========================================================================
   Conteúdo editável do site
   --------------------------------------------------------------------------
   Cardápio: os pratos são exemplos para demonstrar o recurso. O cardápio
   oficial deve ser confirmado pela associação antes de ser publicado.
   Notícias: registros públicos com links para as fontes originais.
   Passeio: passos do tour guiado.
   ========================================================================== */

window.AMMG_DATA = {
  menu: [
    {
      id: "seg",
      label: "Segunda",
      short: "Seg",
      principal: "Frango com legumes",
      sides: ["Arroz branco", "Feijão", "Salada de alface e tomate"],
      dessert: "Laranja",
      note: "Exemplo ilustrativo."
    },
    {
      id: "ter",
      label: "Terça",
      short: "Ter",
      principal: "Macarrão com molho de tomate",
      sides: ["Lentilha", "Carne moída com abóbora", "Repolho refogado"],
      dessert: "Banana",
      note: "Exemplo ilustrativo."
    },
    {
      id: "qua",
      label: "Quarta",
      short: "Qua",
      principal: "Omelete de legumes",
      sides: ["Arroz integral", "Feijão preto", "Cenoura ralada"],
      dessert: "Mamão",
      note: "Exemplo ilustrativo."
    },
    {
      id: "qui",
      label: "Quinta",
      short: "Qui",
      principal: "Galinhada",
      sides: ["Salada de beterraba", "Farofa", "Arroz"],
      dessert: "Laranja",
      note: "Exemplo ilustrativo."
    },
    {
      id: "sex",
      label: "Sexta",
      short: "Sex",
      principal: "Frango ao molho",
      sides: ["Purê de batata", "Arroz", "Salada verde"],
      dessert: "Maçã",
      note: "Exemplo ilustrativo."
    },
    {
      id: "sab",
      label: "Sábado",
      short: "Sáb",
      principal: "Feijão com legumes",
      sides: ["Arroz", "Couve refogada", "Farofa"],
      dessert: "Laranja",
      note: "Exemplo ilustrativo."
    }
  ],

  news: [
    {
      id: "onibus-do-bem",
      date: "2025-11-01",
      dateLabel: "1 de novembro de 2025",
      category: "parcerias",
      categoryLabel: "Parcerias",
      title: "Ônibus do Bem leva voluntários, tinta e carinho à associação",
      summary: "Voluntários pintaram paredes, cuidaram do jardim, prepararam bolos e pães e organizaram recreação para as crianças.",
      body: [
        "No dia 1º de novembro de 2025, a 6ª edição do Ônibus do Bem reuniu voluntários na associação. O grupo pintou paredes, cuidou do jardim, preparou bolos e pães e organizou recreação para as crianças.",
        "A ação também fortaleceu os laços entre a universidade, a comunidade e as mulheres que mantêm a cozinha funcionando todos os dias."
      ],
      source: {
        label: "PUCRS — Centro de Pastoral e Solidariedade",
        url: "https://www.pucrs.br/pastoral/6a-edicao-do-onibus-do-bem-ammg/"
      },
      image: "assets/img/hero-grupo.webp",
      imageAlt: "Voluntários e moradores reunidos no pátio da associação. Foto: PUCRS, 2025."
    },
    {
      id: "koinos-projetos",
      date: "2024-11-18",
      dateLabel: "18 de novembro de 2024",
      category: "cursos",
      categoryLabel: "Cursos",
      title: "Horta, educação somática e galpão multifuncional",
      summary: "Projetos socioassistenciais apresentam ações de formação, alimentação e infraestrutura no Morro da Cruz.",
      body: [
        "Em novembro de 2024, a Koinós apresentou projetos socioassistenciais que incluem a associação, com ações de horta, educação somática e construção de um galpão multifuncional.",
        "As iniciativas se somam à rotina da cozinha e dos cursos, ampliando espaços de formação e cuidado no Morro da Cruz."
      ],
      source: {
        label: "Koinós — Conexões que transformam",
        url: "https://koinos.org.br/2024/11/18/projeto-socioassistenciais/"
      },
      image: "assets/img/refeicao-comunitaria.webp",
      imageAlt: "Refeição comunitária servida em prato. Foto: Koinós, 2024."
    },
    {
      id: "inauguracao-cozinha",
      date: "2022-04-24",
      dateLabel: "24 de abril de 2022",
      category: "cozinha",
      categoryLabel: "Cozinha",
      title: "A cozinha comunitária abriu as portas",
      summary: "No primeiro dia, mais de 300 refeições foram servidas à comunidade.",
      body: [
        "A cozinha comunitária foi inaugurada no domingo, 24 de abril de 2022. No primeiro dia, mais de 300 pessoas da comunidade receberam refeições.",
        "O projeto foi construído coletivamente durante a pandemia e se tornou uma das principais frentes de atuação da associação."
      ],
      source: {
        label: "Sul21",
        url: "https://sul21.com.br/noticias/geral/2022/04/associacao-de-mulheres-inaugura-cozinha-solidaria-no-morro-da-cruz/"
      },
      image: "assets/img/cozinha.webp",
      imageAlt: "Cozinha comunitária da associação durante a inauguração, em 2022. Foto: Sul21."
    },
    {
      id: "avesol-voluntariado",
      date: "2022-12-12",
      dateLabel: "12 de dezembro de 2022",
      category: "parcerias",
      categoryLabel: "Parcerias",
      title: "Voluntariado da AVESOL visita a associação",
      summary: "A visita fortaleceu a parceria e conheceu de perto o trabalho da cozinha comunitária.",
      body: [
        "Em dezembro de 2022, o Programa de Voluntariado da AVESOL e o Núcleo AVESOL-PUCRS visitaram a associação.",
        "A equipe conheceu a cozinha comunitária, as cestas básicas e os cursos voltados a famílias em situação de vulnerabilidade social."
      ],
      source: {
        label: "AVESOL",
        url: "https://www.avesol.org.br/2022/12/voluntariado-comunitario-avesol-e.html"
      },
      image: "assets/img/avesol-grupo.webp",
      imageAlt: "Voluntários e moradoras reunidos na associação. Foto: AVESOL, 2022."
    },
    {
      id: "cut-homenagem",
      date: "2024-11-06",
      dateLabel: "6 de novembro de 2024",
      category: "reconhecimento",
      categoryLabel: "Reconhecimento",
      title: "Cozinhas solidárias recebem homenagem na Assembleia Legislativa",
      summary: "A Associação de Mulheres Maria da Glória foi uma das cozinhas homenageadas na Assembleia Legislativa do RS.",
      body: [
        "A Associação de Mulheres Maria da Glória foi uma das cozinhas parceiras do projeto CUT Comunidade homenageadas em sessão na Assembleia Legislativa do Rio Grande do Sul.",
        "A homenagem reconheceu o trabalho das cozinhas solidárias no enfrentamento à fome."
      ],
      source: {
        label: "CUT-RS",
        url: "https://rs.cut.org.br/noticias/cozinhas-solidarias-recebem-homenagem-na-assembleia-legislativa-do-rs-880a"
      }
    },
    {
      id: "afaso-mulheres",
      date: "2025-06-16",
      dateLabel: "16 de junho de 2025",
      category: "cursos",
      categoryLabel: "Cursos",
      title: "Projeto Mulheres em Movimento conclui formação com 65 mulheres",
      summary: "O projeto apoiado pela AFASO envolveu 65 mulheres do Morro da Cruz e arredores, incluindo a Associação Maria da Glória.",
      body: [
        "O projeto Mulheres em Movimento, apoiado pela AFASO, foi concluído em maio de 2025 após doze meses de atividades.",
        "Ao todo, 65 mulheres das comunidades Morro da Cruz e arredores participaram, incluindo mulheres ligadas à Associação Maria da Glória."
      ],
      source: {
        label: "AFASO",
        url: "https://www.afaso.org.br/post/afaso-finaliza-projeto-mulheres-em-movimento-com-apoio-de-emenda-parlamentar"
      }
    }
  ],

  tour: [
    {
      selector: "#inicio",
      title: "Este é o início",
      text: "Aqui você encontra o nome da associação, as principais informações e os botões para começar. Role a página para continuar."
    },
    {
      selector: "#atalhos",
      title: "Escolha o que você precisa",
      text: "Estes quatro botões grandes levam direto aos assuntos mais procurados: refeições, doações, voluntariado e contato."
    },
    {
      selector: "#refeicoes",
      title: "Como conseguir uma refeição",
      text: "Veja os passos, o endereço e o cardápio de exemplo. O horário oficial ainda será confirmado pela associação."
    },
    {
      selector: "#noticias",
      title: "Mural de notícias",
      text: "Aqui estão notícias públicas sobre a associação. Clique em uma notícia para ler o resumo e abrir a fonte."
    },
    {
      selector: "#ajudar",
      title: "Como ajudar",
      text: "Você pode doar alimentos, ser voluntário ou apoiar financeiramente. O site explica cada forma com calma."
    },
    {
      selector: "#transparencia",
      title: "Transparência",
      text: "Dados públicos, fontes e uma lista do que ainda falta publicar. Nada aqui foi inventado."
    },
    {
      selector: "#visite",
      title: "Visite e fale com a gente",
      text: "Endereço, mapa e formulário de contato. O formulário abre o seu aplicativo de e-mail."
    },
    {
      selector: ".help-fab__btn",
      title: "Ajuda sempre à mão",
      text: "Sempre que precisar, clique no botão Ajuda. Ele abre o passeio, as opções de acessibilidade e o contato."
    }
  ]
};
