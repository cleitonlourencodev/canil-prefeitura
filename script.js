const STORAGE_KEYS = {
  animais: 'pv_animais',
  blog: 'pv_blog_posts',
  denuncias: 'pv_denuncias',
  interesses: 'pv_interesses_adocao',
  usuarios: 'pv_usuarios',
  seedUpgradeV2: 'pv_seed_upgrade_v2',
  seedUpgradeV3: 'pv_seed_upgrade_v3',
  seedUpgradeV4: 'pv_seed_upgrade_v4',
};

const SESSION_KEYS = {
  usuario: 'pv_sessao_usuario',
  abaSistema: 'pv_sistema_aba_ativa',
  menuSistemaColapsado: 'pv_sistema_menu_colapsado',
  historiasAba: 'pv_sistema_historias_aba',
};

const ETAPAS_INTERESSE = ['novo', 'em triagem', 'contato realizado', 'visita agendada', 'concluido', 'arquivado'];
const ETAPAS_DENUNCIA = ['nova', 'em analise', 'equipe acionada', 'resolvida', 'arquivada'];
const PRIORIDADES_FLUXO = ['alta', 'media', 'baixa'];

const FALLBACK_FOTO =
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80';

let estado = {
  animais: [],
  posts: [],
  denuncias: [],
  interesses: [],
  usuarios: [],
};

let carouselIndex = 0;
let carouselTimer = null;
let depoimentoIndex = 0;
let depoimentoTimer = null;
let petDestinoId = null;
let blogPaginaAtual = 1;
let projetoPaginaAtual = 1;
let petsPaginaAtual = 1;

const CARDS_POR_PAGINA = 12;
const PETS_CARDS_POR_PAGINA = 24;

const depoimentosHome = [
  {
    nome: 'Larissa e Thor',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    texto: 'Adotar pelo Canil de Vilhena foi acolhedor e organizado. O Thor chegou com tudo explicado e hoje é parte da família.',
  },
  {
    nome: 'Família Rocha e Mel',
    foto: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=700&q=80',
    texto: 'A equipe ajudou no processo inteiro e acompanhou os primeiros dias. A Mel está super adaptada com as crianças.',
  },
  {
    nome: 'Bruno e Nala',
    foto: 'https://images.unsplash.com/photo-1518715308788-a7ef08d1f43d?auto=format&fit=crop&w=700&q=80',
    texto: 'Eu tinha dúvidas sobre rotina em apartamento e o blog ajudou demais. A Nala se tornou meu xodó.',
  },
];

const seeds = {
  posts: [
    {
      id: 'post-1',
      titulo: '5 passos para uma adoção responsável',
      resumo:
        'Entenda rotina, gastos, adaptação da casa e como preparar toda a família para receber um novo companheiro.',
      categoria: 'Adoção',
      data: '2026-02-08',
    },
    {
      id: 'post-2',
      titulo: 'Adaptação dos primeiros 7 dias',
      resumo:
        'Saiba como reduzir ansiedade do pet recém-adotado com espaço seguro, horários previsíveis e acolhimento gradual.',
      categoria: 'Bem-estar',
      data: '2026-01-29',
    },
    {
      id: 'post-3',
      titulo: 'Vacinas essenciais para cães e gatos',
      resumo:
        'Calendário básico de imunização e sinais de alerta para manter a saúde do pet em dia.',
      categoria: 'Saúde',
      data: '2026-01-20',
    },
    {
      id: 'post-4',
      titulo: 'Como apresentar o pet para crianças',
      resumo:
        'Orientações práticas para criar convivência respeitosa e segura entre animais e crianças.',
      categoria: 'Família',
      data: '2026-01-12',
    },
    {
      id: 'post-5',
      titulo: 'Checklist da casa antes da adoção',
      resumo:
        'Itens de segurança, alimentação e higiene que evitam estresse no início da nova rotina.',
      categoria: 'Preparação',
      data: '2025-12-22',
    },
  ],
  animais: [
    {
      id: 'pet-nina',
      nome: 'Nina',
      especie: 'cão',
      idade: 2,
      porte: 'Médio',
      sexo: 'Fêmea',
      status: 'disponível',
      energia: 'Alta',
      temperamento: 'Brincalhona, sociável e muito carinhosa',
      vacinado: true,
      castrado: true,
      descricao:
        'Nina ama passeios, se dá bem com outros cães e adora pessoas. Excelente para famílias ativas.',
      bairroResgate: 'Cristo Rei',
      observacaoInterna: 'Responder bem ao treino com petiscos. Evitar longos períodos sozinha.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: {
        x: 50,
        y: 45,
        zoom: 1.14,
        brilho: 106,
        contraste: 106,
        saturacao: 115,
      },
      atualizadoEm: '2026-02-10T10:18:00.000Z',
    },
    {
      id: 'pet-luke',
      nome: 'Luke',
      especie: 'cão',
      idade: 4,
      porte: 'Grande',
      sexo: 'Macho',
      status: 'em tratamento',
      energia: 'Média',
      temperamento: 'Leal, atento e calmo no dia a dia',
      vacinado: true,
      castrado: false,
      descricao:
        'Luke foi resgatado recentemente e está em recuperação de pele. Já aceita coleira e comandos básicos.',
      bairroResgate: 'Jardim América',
      observacaoInterna: 'Manter medicação dermatológica até liberação veterinária.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1575859431774-2e57ed632664?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 1,
      fotoPerfilAjuste: {
        x: 52,
        y: 38,
        zoom: 1.2,
        brilho: 100,
        contraste: 103,
        saturacao: 102,
      },
      atualizadoEm: '2026-02-10T08:02:00.000Z',
    },
    {
      id: 'pet-luna',
      nome: 'Luna',
      especie: 'gato',
      idade: 1.5,
      porte: 'Pequeno',
      sexo: 'Fêmea',
      status: 'disponível',
      energia: 'Média',
      temperamento: 'Curiosa, dócil e observadora',
      vacinado: true,
      castrado: true,
      descricao:
        'Luna gosta de ambientes tranquilos, usa caixa de areia e se adapta bem em apartamento.',
      bairroResgate: 'Bela Vista',
      observacaoInterna: 'Acompanha bem com enriquecimento ambiental e arranhador vertical.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: {
        x: 50,
        y: 44,
        zoom: 1.16,
        brilho: 108,
        contraste: 108,
        saturacao: 120,
      },
      atualizadoEm: '2026-02-09T16:30:00.000Z',
    },
    {
      id: 'pet-bento',
      nome: 'Bento',
      especie: 'cão',
      idade: 0.8,
      porte: 'Pequeno',
      sexo: 'Macho',
      status: 'disponível',
      energia: 'Alta',
      temperamento: 'Divertido, esperto e cheio de energia',
      vacinado: true,
      castrado: false,
      descricao:
        'Bento é um filhote ativo, adora brincar e aprende rápido. Ideal para quem tem tempo de interação diária.',
      bairroResgate: 'São José',
      observacaoInterna: 'Treino de socialização em andamento. Já responde ao nome.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1546975490-e8b92a360b24?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 2,
      fotoPerfilAjuste: {
        x: 48,
        y: 46,
        zoom: 1.22,
        brilho: 111,
        contraste: 110,
        saturacao: 124,
      },
      atualizadoEm: '2026-02-08T13:42:00.000Z',
    },
    {
      id: 'pet-amelie',
      nome: 'Amélie',
      especie: 'gato',
      idade: 3,
      porte: 'Pequeno',
      sexo: 'Fêmea',
      status: 'adotado',
      energia: 'Baixa',
      temperamento: 'Tranquila e muito afetuosa',
      vacinado: true,
      castrado: true,
      descricao:
        'Amélie encontrou um lar e segue em acompanhamento pós-adoção com excelente adaptação.',
      bairroResgate: 'Parque São Paulo',
      observacaoInterna: 'Adoção concluída com checklist completo e orientações entregues.',
      adotante: 'Marina C.',
      telefoneAdotante: '(69) 9 9123-4400',
      galeria: [
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: {
        x: 52,
        y: 47,
        zoom: 1.1,
        brilho: 102,
        contraste: 102,
        saturacao: 106,
      },
      atualizadoEm: '2026-02-05T11:05:00.000Z',
    },
  ],
  usuarios: [
    {
      id: 'usr-admin',
      nome: 'Administrador do Sistema',
      login: 'admin',
      senhaHash: encode('admin123'),
      perfil: 'admin',
      ativo: true,
      criadoEm: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr-vet',
      nome: 'Dra. Paula Mendes',
      login: 'paula.vet',
      senhaHash: encode('vet12345'),
      perfil: 'veterinario',
      ativo: true,
      criadoEm: '2026-01-15T00:00:00.000Z',
    },
  ],
};

const extraSeeds = {
  posts: [
    {
      id: 'post-6',
      titulo: 'Passeios seguros: guia rápido para iniciantes',
      resumo: 'Equipamentos, tempo ideal e sinais de estresse para um passeio positivo.',
      categoria: 'Rotina',
      data: '2026-02-15',
      autor: 'Equipe Canil de Vilhena',
      capa: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
      conteudo:
        'Passear com segurança começa com guia adequada, identificação e atenção ao clima. Em dias quentes, prefira horários mais frescos. Observe o comportamento do pet: bocejos excessivos, tentativa de fuga e respiração ofegante podem indicar estresse. O ideal é construir uma rotina gradual para reforçar confiança e socialização.',
      publicado: true,
    },
    {
      id: 'post-7',
      titulo: 'Como preparar seu primeiro fim de semana com o novo pet',
      resumo: 'Checklist prático para tornar os primeiros dias leves para todos.',
      categoria: 'Adaptação',
      data: '2026-02-12',
      autor: 'Equipe Canil de Vilhena',
      capa: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
      conteudo:
        'Organize um espaço tranquilo, mantenha água e alimentação em horários previsíveis e evite visitas excessivas no início. O pet precisa reconhecer cheiros e sons da casa com calma. Brinquedos de enriquecimento e passeios curtos ajudam a reduzir ansiedade. A consistência da rotina acelera o vínculo.',
      publicado: true,
    },
    {
      id: 'post-8',
      titulo: 'Convivência com outros pets: primeiros encontros',
      resumo: 'Estratégias para integração gradual e segura entre animais.',
      categoria: 'Comportamento',
      data: '2026-02-03',
      autor: 'Equipe Canil de Vilhena',
      capa: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
      conteudo:
        'Apresente os pets em ambiente neutro e com controle de distância. Reforço positivo e sessões curtas são mais eficientes do que aproximações forçadas. Observe postura corporal e interrompa antes do desconforto crescer. Com tempo e previsibilidade, a convivência tende a se estabilizar.',
      publicado: true,
    },
  ],
  animais: [
    {
      id: 'pet-bidu',
      nome: 'Bidu',
      especie: 'cão',
      idade: 1.2,
      porte: 'Pequeno',
      sexo: 'Macho',
      status: 'disponível',
      energia: 'Média',
      temperamento: 'Sociável, curioso e afetuoso',
      vacinado: true,
      castrado: true,
      descricao: 'Bidu adora companhia e passeios curtos. Excelente para apartamento com rotina estável.',
      bairroResgate: 'Centro',
      observacaoInterna: 'Boa adaptação com guia peitoral.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 50, y: 46, zoom: 1.12, brilho: 107, contraste: 106, saturacao: 114 },
      atualizadoEm: '2026-02-18T10:20:00.000Z',
    },
    {
      id: 'pet-frida',
      nome: 'Frida',
      especie: 'gato',
      idade: 2.4,
      porte: 'Pequeno',
      sexo: 'Fêmea',
      status: 'disponível',
      energia: 'Baixa',
      temperamento: 'Calma, observadora e dócil',
      vacinado: true,
      castrado: true,
      descricao: 'Frida gosta de ambientes silenciosos e rotina previsível. Ideal para companhia tranquila.',
      bairroResgate: 'Nova Esperança',
      observacaoInterna: 'Adaptação ótima com arranhador.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1571566882372-1598d88abd90?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 52, y: 42, zoom: 1.15, brilho: 103, contraste: 104, saturacao: 109 },
      atualizadoEm: '2026-02-18T08:35:00.000Z',
    },
    {
      id: 'pet-simba',
      nome: 'Simba',
      especie: 'cão',
      idade: 3.1,
      porte: 'Grande',
      sexo: 'Macho',
      status: 'disponível',
      energia: 'Média',
      temperamento: 'Companheiro, leal e brincalhão',
      vacinado: true,
      castrado: true,
      descricao: 'Simba é equilibrado e obediente. Vai bem com rotina de passeios e interação diária.',
      bairroResgate: 'São Cristóvão',
      observacaoInterna: 'Bom com crianças acima de 8 anos.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1583337130417-3346a1f3d3b1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 50, y: 45, zoom: 1.16, brilho: 106, contraste: 107, saturacao: 112 },
      atualizadoEm: '2026-02-17T16:10:00.000Z',
    },
    {
      id: 'pet-pipoca',
      nome: 'Pipoca',
      especie: 'gato',
      idade: 0.9,
      porte: 'Pequeno',
      sexo: 'Fêmea',
      status: 'disponível',
      energia: 'Alta',
      temperamento: 'Brincalhona e curiosa',
      vacinado: true,
      castrado: false,
      descricao: 'Pipoca é jovem, ativa e cheia de personalidade. Ama brinquedos interativos.',
      bairroResgate: 'Parque Industrial',
      observacaoInterna: 'Em processo final para castração.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1615796153287-2f5b9f2f0b44?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 1,
      fotoPerfilAjuste: { x: 51, y: 43, zoom: 1.19, brilho: 109, contraste: 110, saturacao: 121 },
      atualizadoEm: '2026-02-16T12:44:00.000Z',
    },
    {
      id: 'pet-jorge',
      nome: 'Jorge',
      especie: 'cão',
      idade: 5,
      porte: 'Médio',
      sexo: 'Macho',
      status: 'disponível',
      energia: 'Baixa',
      temperamento: 'Calmo, companheiro e gentil',
      vacinado: true,
      castrado: true,
      descricao: 'Jorge é ideal para rotina tranquila e gosta de ficar perto das pessoas.',
      bairroResgate: 'Cidade Verde',
      observacaoInterna: 'Ótimo comportamento em ambiente interno.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 50, y: 45, zoom: 1.11, brilho: 104, contraste: 103, saturacao: 104 },
      atualizadoEm: '2026-02-15T09:05:00.000Z',
    },
  ],
};

const flowSeeds = {
  posts: [
    {
      id: 'post-9',
      titulo: 'Adoção responsável: checklist atualizado para famílias',
      resumo: 'Guia prático com itens essenciais para receber um pet em casa com segurança e acolhimento.',
      categoria: 'Adoção',
      data: '2026-03-02',
      autor: 'Equipe Canil de Vilhena',
      capa: 'https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=1200&q=80',
      conteudo:
        'Antes da adoção, prepare ambiente seguro, rotina de alimentação e horários de adaptação. O acolhimento nos primeiros dias é decisivo para o bem-estar do animal e da família. A equipe técnica recomenda acompanhamento inicial para orientar comportamento, socialização e saúde preventiva.',
      publicado: true,
    },
    {
      id: 'post-10',
      titulo: 'Convivência entre pets: integração gradual funciona melhor',
      resumo: 'Dicas de aproximação segura para quem já tem animais e vai adotar mais um companheiro.',
      categoria: 'Comportamento',
      data: '2026-02-27',
      autor: 'Equipe Canil de Vilhena',
      capa: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80',
      conteudo:
        'A integração entre animais deve ocorrer em etapas curtas, com supervisão e reforço positivo. Evitar contato forçado reduz estresse e favorece adaptação consistente. O processo é mais eficiente quando a família mantém previsibilidade de rotina e espaços individuais no início.',
      publicado: true,
    },
    {
      id: 'post-11',
      titulo: 'Adoções de fevereiro: mais finais felizes em Vilhena',
      resumo: 'Balanço mensal mostra avanço nas adoções e destaca histórias de recuperação e cuidado.',
      categoria: 'Notícia',
      data: '2026-02-25',
      autor: 'Assessoria do Canil Municipal',
      capa: 'https://images.unsplash.com/photo-1558944351-cb5e2b3c84a4?auto=format&fit=crop&w=1200&q=80',
      conteudo:
        'O mês de fevereiro registrou novas adoções responsáveis com acompanhamento técnico da equipe. Além da adoção, o monitoramento pós-lar reforça a política de bem-estar animal e amplia a conscientização da população sobre guarda responsável.',
      publicado: true,
    },
  ],
  animais: [
    {
      id: 'pet-farofa',
      nome: 'Farofa',
      especie: 'cão',
      idade: 2.7,
      porte: 'Médio',
      sexo: 'Fêmea',
      status: 'disponível',
      energia: 'Média',
      temperamento: 'Carinhosa, dócil e companheira',
      vacinado: true,
      castrado: true,
      descricao: 'Farofa gosta de rotina tranquila, se adapta bem a famílias e adora interação com adultos e crianças.',
      bairroResgate: 'Bodanese',
      observacaoInterna: 'Boa adaptação com guia e comandos básicos.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 50, y: 44, zoom: 1.15, brilho: 106, contraste: 106, saturacao: 112 },
      atualizadoEm: '2026-03-03T10:12:00.000Z',
    },
    {
      id: 'pet-tobias',
      nome: 'Tobias',
      especie: 'cão',
      idade: 1.9,
      porte: 'Pequeno',
      sexo: 'Macho',
      status: 'disponível',
      energia: 'Alta',
      temperamento: 'Brincalhão, alegre e muito sociável',
      vacinado: true,
      castrado: true,
      descricao: 'Tobias é ativo e ideal para famílias com rotina de passeios e brincadeiras diárias.',
      bairroResgate: 'Jardim Eldorado',
      observacaoInterna: 'Excelente resposta a treino com reforço positivo.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1583512603784-a8e6f2a6f6f9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 49, y: 43, zoom: 1.18, brilho: 108, contraste: 109, saturacao: 118 },
      atualizadoEm: '2026-03-01T15:40:00.000Z',
    },
    {
      id: 'pet-margarida',
      nome: 'Margarida',
      especie: 'gato',
      idade: 4.2,
      porte: 'Pequeno',
      sexo: 'Fêmea',
      status: 'adotado',
      energia: 'Baixa',
      temperamento: 'Calma, afetuosa e observadora',
      vacinado: true,
      castrado: true,
      descricao: 'Margarida encontrou um lar e está em adaptação excelente, com retorno positivo da família adotante.',
      bairroResgate: 'Centro',
      observacaoInterna: 'Adoção concluída com orientações pós-adoção entregues.',
      adotante: 'Luciana e Paulo',
      telefoneAdotante: '(69) 9 9888-4421',
      galeria: [
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 51, y: 45, zoom: 1.13, brilho: 104, contraste: 104, saturacao: 109 },
      atualizadoEm: '2026-02-28T09:10:00.000Z',
    },
    {
      id: 'pet-bolota',
      nome: 'Bolota',
      especie: 'cão',
      idade: 6.1,
      porte: 'Grande',
      sexo: 'Macho',
      status: 'em tratamento',
      energia: 'Baixa',
      temperamento: 'Gentil e tranquilo',
      vacinado: true,
      castrado: false,
      descricao: 'Bolota está em recuperação veterinária e ainda não está apto para adoção.',
      bairroResgate: 'Parque Cidade Nova',
      observacaoInterna: 'Acompanhamento clínico quinzenal.',
      adotante: '',
      telefoneAdotante: '',
      galeria: [
        'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 50, y: 42, zoom: 1.12, brilho: 101, contraste: 102, saturacao: 103 },
      atualizadoEm: '2026-02-26T11:30:00.000Z',
    },
  ],
  interesses: [
    {
      id: 'int-seed-1',
      petId: 'pet-nina',
      petNome: 'Nina',
      nome: 'Fernanda Souza',
      whatsapp: '(69) 9 9154-2201',
      email: 'fernanda.souza@email.com',
      cidade: 'Vilhena - Centro',
      mensagem: 'Tenho rotina estável, casa com quintal seguro e experiência com cães de médio porte.',
      criadoEm: '2026-03-03T14:20:00.000Z',
      origem: 'site',
    },
    {
      id: 'int-seed-2',
      petId: 'pet-luna',
      petNome: 'Luna',
      nome: 'Ricardo Nunes',
      whatsapp: '(69) 9 9231-4409',
      email: 'ricardo.nunes@email.com',
      cidade: 'Vilhena - Bodanese',
      mensagem: 'Moro em apartamento, trabalho em home office e posso acompanhar adaptação da gata com calma.',
      criadoEm: '2026-03-02T10:05:00.000Z',
      origem: 'site',
    },
    {
      id: 'int-seed-3',
      petId: 'pet-simba',
      petNome: 'Simba',
      nome: 'João Pedro Lima',
      whatsapp: '(69) 9 9941-3312',
      email: 'joaopedro.lima@email.com',
      cidade: 'Vilhena - Jardim América',
      mensagem: 'Tenho espaço e disponibilidade para passeios diários. Família já aprovada para adoção.',
      criadoEm: '2026-03-01T17:48:00.000Z',
      origem: 'site',
    },
    {
      id: 'int-seed-4',
      petId: 'pet-farofa',
      petNome: 'Farofa',
      nome: 'Camila Azevedo',
      whatsapp: '(69) 9 9811-2203',
      email: 'camila.azevedo@email.com',
      cidade: 'Vilhena - Cristo Rei',
      mensagem: 'Casa ampla, família presente e disponibilidade para acompanhamento veterinário inicial.',
      criadoEm: '2026-03-01T08:32:00.000Z',
      origem: 'site',
    },
  ],
  denuncias: [
    {
      id: 'den-seed-1',
      local: 'Avenida Major Amarante, próximo à praça',
      descricao: 'Cachorro aparentemente abandonado há dois dias, sem coleira e com sinais de desnutrição.',
      contato: 'Ana Paula • (69) 9 9300-1188',
      origem: 'contato',
      criadoEm: '2026-03-03T09:40:00.000Z',
    },
    {
      id: 'den-seed-2',
      local: 'Bairro Jardim Primavera, rua sem saída',
      descricao: 'Ninhada de gatos em terreno baldio, sem acesso regular a água e alimento.',
      contato: 'Rogério • (69) 9 9455-7722',
      origem: 'contato',
      criadoEm: '2026-03-02T16:12:00.000Z',
    },
    {
      id: 'den-seed-3',
      local: 'Setor 19, área de comércio',
      descricao: 'Animal com ferimento visível na pata traseira circulando entre veículos estacionados.',
      contato: '(69) 9 9110-5533',
      origem: 'contato',
      criadoEm: '2026-03-01T11:07:00.000Z',
    },
  ],
};

const testemunhoSeeds = {
  animais: [
    {
      id: 'pet-amora',
      nome: 'Amora',
      especie: 'cão',
      idade: 2.3,
      porte: 'Médio',
      sexo: 'Fêmea',
      status: 'adotado',
      energia: 'Média',
      temperamento: 'Doce, companheira e atenta',
      vacinado: true,
      castrado: true,
      descricao: 'Amora foi adotada por uma família com rotina ativa e já participa de passeios diários no bairro.',
      bairroResgate: 'Jardim das Oliveiras',
      observacaoInterna: 'Adoção consolidada com retorno positivo no acompanhamento.',
      adotante: 'Família Almeida',
      telefoneAdotante: '(69) 9 9766-4012',
      galeria: [
        'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 50, y: 44, zoom: 1.14, brilho: 106, contraste: 107, saturacao: 113 },
      atualizadoEm: '2026-03-04T09:15:00.000Z',
    },
    {
      id: 'pet-kiara',
      nome: 'Kiara',
      especie: 'gato',
      idade: 1.8,
      porte: 'Pequeno',
      sexo: 'Fêmea',
      status: 'adotado',
      energia: 'Média',
      temperamento: 'Afetuosa e muito curiosa',
      vacinado: true,
      castrado: true,
      descricao: 'Kiara foi adotada por tutores experientes e está adaptada ao novo lar com enriquecimento ambiental.',
      bairroResgate: 'Centro',
      observacaoInterna: 'Adaptação excelente após a primeira semana.',
      adotante: 'Carolina e Denise',
      telefoneAdotante: '(69) 9 9881-2274',
      galeria: [
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 51, y: 44, zoom: 1.13, brilho: 104, contraste: 105, saturacao: 110 },
      atualizadoEm: '2026-03-03T14:05:00.000Z',
    },
    {
      id: 'pet-paco',
      nome: 'Paco',
      especie: 'cão',
      idade: 3.6,
      porte: 'Grande',
      sexo: 'Macho',
      status: 'adotado',
      energia: 'Baixa',
      temperamento: 'Gentil, tranquilo e obediente',
      vacinado: true,
      castrado: true,
      descricao: 'Paco ganhou um lar com quintal amplo e rotina calma, ideal para seu perfil.',
      bairroResgate: 'São José',
      observacaoInterna: 'Sem intercorrências no pós-adoção.',
      adotante: 'Rafael e Luan',
      telefoneAdotante: '(69) 9 9122-7390',
      galeria: [
        'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 49, y: 43, zoom: 1.12, brilho: 103, contraste: 104, saturacao: 106 },
      atualizadoEm: '2026-03-02T11:22:00.000Z',
    },
    {
      id: 'pet-mimo',
      nome: 'Mimo',
      especie: 'gato',
      idade: 2.1,
      porte: 'Pequeno',
      sexo: 'Macho',
      status: 'adotado',
      energia: 'Baixa',
      temperamento: 'Calmo e muito carinhoso',
      vacinado: true,
      castrado: true,
      descricao: 'Mimo foi adotado por casal idoso e se adaptou muito bem ao ambiente interno.',
      bairroResgate: 'Jardim Eldorado',
      observacaoInterna: 'Acompanhamento finalizado com avaliação positiva.',
      adotante: 'Dona Sônia e Sr. Carlos',
      telefoneAdotante: '(69) 9 9550-1804',
      galeria: [
        'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 50, y: 45, zoom: 1.12, brilho: 105, contraste: 105, saturacao: 109 },
      atualizadoEm: '2026-03-01T10:35:00.000Z',
    },
    {
      id: 'pet-lola',
      nome: 'Lola',
      especie: 'cão',
      idade: 1.5,
      porte: 'Pequeno',
      sexo: 'Fêmea',
      status: 'adotado',
      energia: 'Alta',
      temperamento: 'Alegre e muito brincalhona',
      vacinado: true,
      castrado: true,
      descricao: 'Lola foi adotada por família com crianças e está plenamente integrada à rotina da casa.',
      bairroResgate: 'Parque Cidade Nova',
      observacaoInterna: 'Tutor responsável e plano vacinal em dia.',
      adotante: 'Família Santos',
      telefoneAdotante: '(69) 9 9410-6721',
      galeria: [
        'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80',
      ],
      fotoPerfilIndex: 0,
      fotoPerfilAjuste: { x: 50, y: 44, zoom: 1.16, brilho: 108, contraste: 109, saturacao: 117 },
      atualizadoEm: '2026-02-28T16:40:00.000Z',
    },
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  bootstrapDados();
  carregarEstado();
  garantirDadosBase();
  configurarMenuMobile();
  configurarAnimacoesEntrada();

  const pagina = obterPaginaAtual();
  if (pagina === 'index.html' || pagina === '') {
    configurarHome();
  }
  if (pagina === 'pets.html') {
    configurarPets();
  }
  if (pagina === 'projeto.html') {
    configurarProjeto();
  }
  if (pagina === 'blog.html') {
    configurarBlog();
  }
  if (pagina === 'blog-post.html') {
    configurarBlogPost();
  }
  if (pagina === 'contato.html') {
    configurarContato();
  }
  if (pagina === 'adocao.html') {
    configurarAdocao();
  }
  if (pagina === 'sistema.html') {
    configurarSistema();
  }
});

function configurarMenuMobile() {
  const header = document.querySelector('.topo .topo-conteudo');
  const nav = header?.querySelector('nav');
  if (!header || !nav) return;

  if (header.querySelector('.menu-toggle')) return;

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'menu-toggle';
  botao.setAttribute('aria-label', 'Abrir menu de navegação');
  botao.setAttribute('aria-expanded', 'false');
  botao.innerHTML = '<span></span><span></span><span></span>';
  header.insertBefore(botao, nav);

  const fecharMenu = () => {
    header.classList.remove('menu-aberto');
    botao.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  botao.addEventListener('click', () => {
    const aberto = header.classList.toggle('menu-aberto');
    botao.setAttribute('aria-expanded', String(aberto));
    document.body.classList.toggle('menu-open', aberto);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      fecharMenu();
    }
  });
}

function configurarAnimacoesEntrada() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const seletorAnimado = '.painel, .blog-item, .pet-post, .passo-card, .indicadores article, .secao-topo, .slider-12-card, .item-gestao';
  const animados = new WeakSet();

  const marcar = (raiz = document) => {
    raiz.querySelectorAll?.(seletorAnimado).forEach((el) => {
      if (animados.has(el)) return;
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
      animados.add(el);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  marcar(document);

  const mutacao = new MutationObserver((changes) => {
    changes.forEach((change) => {
      change.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(seletorAnimado)) {
          if (!animados.has(node)) {
            node.classList.add('reveal-on-scroll');
            observer.observe(node);
            animados.add(node);
          }
        }
        marcar(node);
      });
    });
  });

  mutacao.observe(document.body, { childList: true, subtree: true });
}

function encode(texto) {
  return window.btoa(unescape(encodeURIComponent(texto)));
}

function decode(texto) {
  try {
    return decodeURIComponent(escape(window.atob(texto)));
  } catch {
    return '';
  }
}

function bootstrapDados() {
  if (!localStorage.getItem(STORAGE_KEYS.animais)) {
    localStorage.setItem(STORAGE_KEYS.animais, JSON.stringify(seeds.animais));
  }
  if (!localStorage.getItem(STORAGE_KEYS.blog)) {
    localStorage.setItem(STORAGE_KEYS.blog, JSON.stringify(seeds.posts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.denuncias)) {
    localStorage.setItem(STORAGE_KEYS.denuncias, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.interesses)) {
    localStorage.setItem(STORAGE_KEYS.interesses, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.usuarios)) {
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(seeds.usuarios));
  }
}

function carregarEstado() {
  estado.animais = readJSON(STORAGE_KEYS.animais, []);
  estado.posts = readJSON(STORAGE_KEYS.blog, []);
  estado.denuncias = readJSON(STORAGE_KEYS.denuncias, []);
  estado.interesses = readJSON(STORAGE_KEYS.interesses, []);
  estado.usuarios = readJSON(STORAGE_KEYS.usuarios, []);
}

function garantirDadosBase() {
  const mergeById = (listaAtual, listaSeed) => {
    const mapa = new Map(listaAtual.map((item) => [item.id, item]));
    listaSeed.forEach((seedItem) => {
      if (!mapa.has(seedItem.id)) {
        listaAtual.push(seedItem);
      }
    });
    return listaAtual;
  };

  // Sempre garante que usuarios-seed estejam com ativo/senhaHash/perfil corretos
  // (corrige dados corrompidos no localStorage de sessoes anteriores)
  let usuariosSeedAlterado = false;
  seeds.usuarios.forEach((seedUser) => {
    const idx = estado.usuarios.findIndex((u) => u.id === seedUser.id);
    if (idx >= 0) {
      const atual = estado.usuarios[idx];
      if (!atual.ativo || atual.senhaHash !== seedUser.senhaHash || atual.perfil !== seedUser.perfil) {
        estado.usuarios[idx] = { ...atual, ativo: seedUser.ativo, perfil: seedUser.perfil, senhaHash: seedUser.senhaHash };
        usuariosSeedAlterado = true;
      }
    } else {
      estado.usuarios.push({ ...seedUser });
      usuariosSeedAlterado = true;
    }
  });
  if (usuariosSeedAlterado) {
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(estado.usuarios));
  }

  const jaMigrado = localStorage.getItem(STORAGE_KEYS.seedUpgradeV2) === '1';
  const jaMigradoV3 = localStorage.getItem(STORAGE_KEYS.seedUpgradeV3) === '1';
  const jaMigradoV4 = localStorage.getItem(STORAGE_KEYS.seedUpgradeV4) === '1';

  if (!jaMigrado) {
    estado.animais = mergeById(estado.animais, [...seeds.animais, ...extraSeeds.animais]);
    estado.posts = mergeById(estado.posts, [...seeds.posts, ...extraSeeds.posts]);
    estado.usuarios = mergeById(estado.usuarios, seeds.usuarios);
    localStorage.setItem(STORAGE_KEYS.seedUpgradeV2, '1');
  }

  if (!jaMigradoV3) {
    estado.animais = mergeById(estado.animais, flowSeeds.animais);
    estado.posts = mergeById(estado.posts, flowSeeds.posts);
    estado.interesses = mergeById(estado.interesses, flowSeeds.interesses);
    estado.denuncias = mergeById(estado.denuncias, flowSeeds.denuncias);
    localStorage.setItem(STORAGE_KEYS.seedUpgradeV3, '1');
  }

  if (!jaMigradoV4) {
    estado.animais = mergeById(estado.animais, testemunhoSeeds.animais);
    localStorage.setItem(STORAGE_KEYS.seedUpgradeV4, '1');
  }

  estado.posts = estado.posts.map((post) => ({
    autor: 'Equipe Canil de Vilhena',
    capa: '',
    conteudo: post.resumo || '',
    publicado: true,
    ...post,
  }));

  estado.animais = estado.animais.map((pet) => {
    const statusNormalizado = normalizarStatus(pet.status);
    const tituloHistoria = String(pet.historiaTitulo || '').trim();
    const textoHistoria = String(pet.historiaAdocao || '').trim();

    const atualizado = {
      ...pet,
      status: statusNormalizado,
      historiaTitulo: tituloHistoria,
      historiaAdocao: textoHistoria,
      historiaPublicado: Boolean(pet.historiaPublicado),
      historiaPublicadoEm: pet.historiaPublicadoEm || '',
      historiaAtualizadoEm: pet.historiaAtualizadoEm || '',
    };

    if (statusNormalizado !== 'adotado') {
      atualizado.adotante = '';
      atualizado.telefoneAdotante = '';
      atualizado.historiaPublicado = false;
      atualizado.historiaPublicadoEm = '';
    }

    return atualizado;
  });

  salvarEstado();
}

function salvarEstado() {
  localStorage.setItem(STORAGE_KEYS.animais, JSON.stringify(estado.animais));
  localStorage.setItem(STORAGE_KEYS.blog, JSON.stringify(estado.posts));
  localStorage.setItem(STORAGE_KEYS.denuncias, JSON.stringify(estado.denuncias));
  localStorage.setItem(STORAGE_KEYS.interesses, JSON.stringify(estado.interesses));
  localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(estado.usuarios));
}

function readJSON(chave, padrao) {
  try {
    return JSON.parse(localStorage.getItem(chave) ?? JSON.stringify(padrao));
  } catch {
    return padrao;
  }
}

function obterPaginaAtual() {
  const segmento = window.location.pathname.split('/').pop();
  return segmento || 'index.html';
}

function formatarData(valor) {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    return 'Data não informada';
  }
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function slugStatus(status) {
  return String(status).toLowerCase().replace(/\s+/g, '-');
}

function escaparHtml(valor) {
  return String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizarStatus(status) {
  const base = String(status || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  if (base === 'disponivel') return 'disponível';
  if (base === 'em tratamento') return 'em tratamento';
  if (base === 'adotado') return 'adotado';
  return String(status || '').toLowerCase().trim();
}

function normalizarEtapaFluxo(valor, tipo) {
  const etapas = tipo === 'interesse' ? ETAPAS_INTERESSE : ETAPAS_DENUNCIA;
  const base = String(valor || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  return etapas.find((item) => item === base) || etapas[0];
}

function rotuloEtapaFluxo(valor) {
  const mapa = {
    novo: 'Novo',
    'em triagem': 'Em triagem',
    'contato realizado': 'Contato realizado',
    'visita agendada': 'Visita agendada',
    concluido: 'Concluído',
    arquivado: 'Arquivado',
    nova: 'Nova',
    'em analise': 'Em análise',
    'equipe acionada': 'Equipe acionada',
    resolvida: 'Resolvida',
    arquivada: 'Arquivada',
  };
  return mapa[valor] || valor;
}

function normalizarPrioridadeFluxo(valor) {
  const base = String(valor || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  return PRIORIDADES_FLUXO.find((item) => item === base) || 'media';
}

function rotuloPrioridadeFluxo(valor) {
  const mapa = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
  return mapa[valor] || 'Média';
}

function pesoPrioridadeFluxo(valor) {
  const mapa = { alta: 3, media: 2, baixa: 1 };
  return mapa[normalizarPrioridadeFluxo(valor)] || 2;
}

function tempoAbertoHumano(criadoEm) {
  const inicio = new Date(criadoEm);
  if (Number.isNaN(inicio.getTime())) return 'SLA indisponível';
  const diffMs = Date.now() - inicio.getTime();
  const diffHoras = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const dias = Math.floor(diffHoras / 24);
  const horas = diffHoras % 24;
  if (dias <= 0) return `${horas}h em aberto`;
  return `${dias}d ${horas}h em aberto`;
}

function prioridadeSugeridaDenuncia(descricao, local) {
  const texto = `${descricao || ''} ${local || ''}`.toLowerCase();
  if (/ferimento|sangue|atropel|agonia|grave|agress|risco|violencia/.test(texto)) return 'alta';
  if (/filhote|abandono|sem agua|sem comida|desnutri|doente/.test(texto)) return 'media';
  return 'baixa';
}

function ordenarFluxoPorPrioridadeESla(lista) {
  return [...lista].sort((a, b) => {
    const prioridade = pesoPrioridadeFluxo(b.prioridadeAtendimento) - pesoPrioridadeFluxo(a.prioridadeAtendimento);
    if (prioridade !== 0) return prioridade;
    return new Date(a.criadoEm || 0).getTime() - new Date(b.criadoEm || 0).getTime();
  });
}

function fotoPerfilDoPet(pet) {
  const lista = Array.isArray(pet.galeria) && pet.galeria.length ? pet.galeria : [FALLBACK_FOTO];
  return lista[pet.fotoPerfilIndex ?? 0] || lista[0] || FALLBACK_FOTO;
}

function estiloFotoPerfil(pet) {
  const ajuste = pet.fotoPerfilAjuste || {};
  const x = Number(ajuste.x ?? 50);
  const y = Number(ajuste.y ?? 50);
  const zoom = Number(ajuste.zoom ?? 1);
  const brilho = Number(ajuste.brilho ?? 100);
  const contraste = Number(ajuste.contraste ?? 100);
  const saturacao = Number(ajuste.saturacao ?? 100);

  return {
    objectPosition: `${x}% ${y}%`,
    transform: `scale(${zoom})`,
    filter: `brightness(${brilho}%) contrast(${contraste}%) saturate(${saturacao}%)`,
  };
}

function aplicarEstiloFoto(img, pet) {
  const estilo = estiloFotoPerfil(pet);
  img.style.objectPosition = estilo.objectPosition;
  img.style.transform = estilo.transform;
  img.style.filter = estilo.filter;
}

function criarTagStatus(status) {
  const classe = slugStatus(status);
  return `<span class="tag ${classe}">${status}</span>`;
}

function linkAdocao(petId) {
  return `adocao.html?pet=${encodeURIComponent(petId)}`;
}

function animaisPublicosDisponiveis() {
  return estado.animais.filter((pet) => normalizarStatus(pet.status) === 'disponível');
}

function postsPublicados() {
  return estado.posts
    .filter((post) => post.publicado !== false)
    .sort((a, b) => new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime());
}

function configurarHome() {
  renderIndicadoresHome();
  renderDepoimentos();
  renderHomeBlog();
  renderCarousel();
}

function configurarProjeto() {
  projetoPaginaAtual = 1;
  renderTestemunhosProjeto();
}

function renderTestemunhosProjeto() {
  const alvo = document.getElementById('projeto-testemunhos');
  const paginacao = document.getElementById('projeto-paginacao');
  if (!alvo) return;

  const adotados = estado.animais
    .filter((pet) => normalizarStatus(pet.status) === 'adotado' && Boolean(pet.historiaPublicado))
    .sort((a, b) => new Date(b.atualizadoEm || 0).getTime() - new Date(a.atualizadoEm || 0).getTime());

  if (!adotados.length) {
    alvo.innerHTML = `
      <article class="painel testemunho-card">
        <h3>Em breve, novas histórias de adoção</h3>
        <p class="testemunho-texto">Ainda não há histórias publicadas pela equipe. Assim que uma adoção for marcada como postada no sistema, ela aparecerá aqui automaticamente.</p>
      </article>
    `;
    if (paginacao) paginacao.innerHTML = '';
    return;
  }

  const totalPaginas = Math.max(1, Math.ceil(adotados.length / CARDS_POR_PAGINA));
  projetoPaginaAtual = Math.min(Math.max(1, projetoPaginaAtual), totalPaginas);
  const inicio = (projetoPaginaAtual - 1) * CARDS_POR_PAGINA;
  const paginaAtualItens = adotados.slice(inicio, inicio + CARDS_POR_PAGINA);

  const construirFrase = (pet) => {
    const historiaSalva = String(pet.historiaAdocao || '').trim();
    if (historiaSalva) return historiaSalva;

    const tipo = String(pet.especie || '').toLowerCase().includes('gato') ? 'gata' : 'cão';
    const nomePet = pet.nome || 'esse pet';
    return `"Adotar ${nomePet} foi uma das decisões mais bonitas da nossa vida. Hoje esse ${tipo} é parte da família e enche a casa de alegria todos os dias."`;
  };

  alvo.innerHTML = paginaAtualItens
    .map((pet) => {
      const adotante = pet.adotante?.trim() || 'Família adotante';
      const frase = construirFrase(pet);
      const titulo = String(pet.historiaTitulo || '').trim() || `${pet.nome} encontrou um lar cheio de amor`;

      return `
        <article class="painel testemunho-card">
          <img src="${fotoPerfilDoPet(pet)}" alt="${pet.nome}" class="testemunho-foto">
          <h3>"${titulo}"</h3>
          <p class="testemunho-texto">${frase}</p>
          <p class="testemunho-autor">${adotante} • Adotou ${pet.nome}</p>
        </article>
      `;
    })
    .join('');

  renderPaginacaoNumerica({
    alvo: paginacao,
    totalPaginas,
    paginaAtual: projetoPaginaAtual,
    onChange: (novaPagina) => {
      projetoPaginaAtual = novaPagina;
      renderTestemunhosProjeto();
      document.getElementById('projeto-testemunhos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });
}

function renderIndicadoresHome() {
  const totalResgatados = estado.animais.length;
  const totalDisponiveis = animaisPublicosDisponiveis().length;
  const totalAdocoes = estado.animais.filter((pet) => normalizarStatus(pet.status) === 'adotado').length;

  setText('contador-resgates', `${totalResgatados}+`);
  setText('contador-adoções', `${totalAdocoes}+`);
  setText('contador-disponiveis', String(totalDisponiveis));
}

function renderDepoimentos() {
  const track = document.getElementById('home-depoimentos-track');
  const dotsEl = document.getElementById('home-depoimentos-dots');
  if (!track || !dotsEl) return;

  if (!depoimentosHome.length) {
    track.innerHTML = `<div class="vazio">Sem depoimentos no momento.</div>`;
    dotsEl.innerHTML = '';
    return;
  }

  depoimentoIndex = Math.min(depoimentoIndex, depoimentosHome.length - 1);
  const depoimento = depoimentosHome[depoimentoIndex];

  track.innerHTML = `
    <article class="depoimento-item destaque">
      <img src="${depoimento.foto}" alt="${depoimento.nome}" />
      <div>
        <strong>${depoimento.nome}</strong>
        <p>${depoimento.texto}</p>
      </div>
    </article>
  `;

  dotsEl.innerHTML = depoimentosHome
    .map(
      (_, index) =>
        `<button class="dot ${index === depoimentoIndex ? 'ativo' : ''}" data-depo-dot="${index}" aria-label="Ir para depoimento ${index + 1}"></button>`,
    )
    .join('');

  const prev = document.getElementById('depo-prev');
  const next = document.getElementById('depo-next');

  if (prev) {
    prev.onclick = () => {
      depoimentoIndex = (depoimentoIndex - 1 + depoimentosHome.length) % depoimentosHome.length;
      renderDepoimentos();
      iniciarAutoDepoimentos(depoimentosHome.length);
    };
  }

  if (next) {
    next.onclick = () => {
      depoimentoIndex = (depoimentoIndex + 1) % depoimentosHome.length;
      renderDepoimentos();
      iniciarAutoDepoimentos(depoimentosHome.length);
    };
  }

  dotsEl.querySelectorAll('[data-depo-dot]').forEach((dot) => {
    dot.addEventListener('click', () => {
      depoimentoIndex = Number(dot.getAttribute('data-depo-dot'));
      renderDepoimentos();
      iniciarAutoDepoimentos(depoimentosHome.length);
    });
  });

  iniciarAutoDepoimentos(depoimentosHome.length);
}

function renderHomeBlog() {
  const alvo = document.getElementById('home-blog');
  if (!alvo) return;

  const itens = postsPublicados().slice(0, 3);
  if (!itens.length) {
    alvo.innerHTML = `<div class="vazio">Sem conteúdos cadastrados.</div>`;
    return;
  }

  alvo.innerHTML = itens
    .map(
      (post) => `
      <article class="blog-item">
        <a class="blog-link" href="blog-post.html?id=${encodeURIComponent(post.id)}">
          ${post.capa ? `<img class="blog-capa" src="${post.capa}" alt="Capa do artigo ${post.titulo}" />` : ''}
          <span class="tag">${post.categoria || 'Notícia'}</span>
          <div class="blog-item-corpo">
            <h4>${post.titulo}</h4>
            <p class="blog-item-texto">${post.resumo}</p>
          </div>
          <span class="link-leia">Ler artigo completo →</span>
        </a>
      </article>
    `,
    )
    .join('');
}

function renderCarousel() {
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('home-carousel-dots');
  const activePets = animaisPublicosDisponiveis();
  if (!track || !dotsEl || activePets.length === 0) {
    if (track) track.innerHTML = `<div class="vazio">Nenhum pet para exibir no momento.</div>`;
    if (dotsEl) dotsEl.innerHTML = '';
    return;
  }

  // Lógica de sorteio semanal sem repetição
  const MAX_CAROUSEL = 5;
  const SEGUNDOS_EM_UMA_SEMANA = 604800000; // 7 dias em ms
  const hoje = new Date().getTime();

  let carouselInfo = JSON.parse(localStorage.getItem('pv_semana_pets_info')) || null;
  let jaMostrados = JSON.parse(localStorage.getItem('pv_pets_ja_mostrados')) || [];
  
  // Limpa o array de já mostrados de IDs que não estão mais ativos
  const activeIds = activePets.map(p => p.id);
  jaMostrados = jaMostrados.filter(id => activeIds.includes(id));
  
  if (!carouselInfo || (hoje - carouselInfo.inicioSemana) > SEGUNDOS_EM_UMA_SEMANA || !carouselInfo.petIds.every(id => activeIds.includes(id))) {
      // Semana virou, ou dados estão corrompidos, ou pets que estavam na vitrine não estão mais disponíveis. Sortear novos!
      let disponiveisParaSorteio = activePets.filter(p => !jaMostrados.includes(p.id));
      
      // Se não há o suficiente, reseta a lista
      if (disponiveisParaSorteio.length < MAX_CAROUSEL) {
          jaMostrados = [];
          disponiveisParaSorteio = [...activePets];
      }
      
      // Embaralhar
      const embaralhados = disponiveisParaSorteio.sort(() => 0.5 - Math.random());
      const selecionados = embaralhados.slice(0, MAX_CAROUSEL);
      
      const idsSelecionados = selecionados.map(p => p.id);
      
      carouselInfo = {
          inicioSemana: hoje,
          petIds: idsSelecionados
      };
      
      jaMostrados.push(...idsSelecionados);
      
      localStorage.setItem('pv_semana_pets_info', JSON.stringify(carouselInfo));
      localStorage.setItem('pv_pets_ja_mostrados', JSON.stringify(jaMostrados));
  }
  
  const pets = carouselInfo.petIds.map(id => activePets.find(p => p.id === id)).filter(Boolean);

  if (!pets.length) {
    track.innerHTML = `<div class="vazio">Nenhum pet para mostrar no momento.</div>`;
    dotsEl.innerHTML = '';
    return;
  }

  carouselIndex = Math.min(carouselIndex, pets.length - 1);
  const pet = pets[carouselIndex];
  const foto = fotoPerfilDoPet(pet);
  const estiloImg = estiloFotoPerfil(pet);

  track.innerHTML = `
    <article class="carousel-item">
      <div class="media-post">
        <img src="${foto}" alt="${pet.nome}" id="carousel-image" />
      </div>
      <div class="carousel-lado">
        <div class="profile-head">
          <div class="left">
            <span class="avatar-slot"><img class="avatar-mini" src="${foto}" alt="Avatar ${pet.nome}" /></span>
            <div>
              <strong>${pet.nome}</strong>
              <p class="texto-suave">${pet.especie} • ${pet.idade} anos • ${pet.porte}</p>
            </div>
          </div>
          <a class="btn btn-principal" href="${linkAdocao(pet.id)}">Adotar</a>
        </div>
        <div class="meta">
          ${criarTagStatus(pet.status)}
          <span class="tag">Energia ${pet.energia}</span>
          <span class="tag">${pet.sexo}</span>
        </div>
        <p class="carousel-descricao">${pet.descricao}</p>
        <div class="acoes">
          <a class="btn btn-secundario" href="pets.html">Ver perfil completo</a>
        </div>
      </div>
    </article>
  `;

  const img = document.getElementById('carousel-image');
  if (img) {
    img.style.objectPosition = estiloImg.objectPosition;
    img.style.transform = estiloImg.transform;
    img.style.filter = estiloImg.filter;
  }

  dotsEl.innerHTML = pets
    .map(
      (_, index) =>
        `<button class="dot ${index === carouselIndex ? 'ativo' : ''}" data-dot="${index}" aria-label="Ir para destaque ${index + 1}"></button>`,
    )
    .join('');

  const prev = document.getElementById('carousel-prev');
  const next = document.getElementById('carousel-next');

  if (prev) {
    prev.disabled = pets.length <= 1;
    prev.onclick = () => {
      carouselIndex = (carouselIndex - 1 + pets.length) % pets.length;
      renderCarousel();
      iniciarAutoCarousel();
    };
  }

  if (next) {
    next.disabled = pets.length <= 1;
    next.onclick = () => {
      carouselIndex = (carouselIndex + 1) % pets.length;
      renderCarousel();
      iniciarAutoCarousel();
    };
  }

  dotsEl.querySelectorAll('[data-dot]').forEach((dot) => {
    dot.addEventListener('click', () => {
      carouselIndex = Number(dot.getAttribute('data-dot'));
      renderCarousel();
      iniciarAutoCarousel();
    });
  });

  track.onmouseenter = () => {
    if (carouselTimer) clearInterval(carouselTimer);
  };
  track.onmouseleave = () => {
    iniciarAutoCarousel(pets.length);
  };

  iniciarAutoCarousel(pets.length);
}

function iniciarAutoCarousel(total = 0) {
  if (carouselTimer) {
    clearInterval(carouselTimer);
  }
  if (total <= 1) return;

  carouselTimer = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % total;
    renderCarousel();
  }, 5500);
}

function iniciarAutoDepoimentos(total = 0) {
  if (depoimentoTimer) {
    clearInterval(depoimentoTimer);
  }
  if (total <= 1) return;

  depoimentoTimer = setInterval(() => {
    depoimentoIndex = (depoimentoIndex + 1) % total;
    renderDepoimentos();
  }, 6200);
}

function configurarPets() {
  const busca = document.getElementById('busca');
  const filtroEspecie = document.getElementById('filtro-especie');
  const filtroPorte = document.getElementById('filtro-porte');
  const filtroSexo = document.getElementById('filtro-sexo');
  const btnFiltrar = document.getElementById('btn-filtrar');

  const atualizar = () => {
    petDestinoId = null;
    petsPaginaAtual = 1;
    if (btnFiltrar) btnFiltrar.textContent = 'Buscar Match ✨';
    renderFeedPets();
  };

  [busca, filtroEspecie, filtroPorte, filtroSexo].forEach((el) => {
    el?.addEventListener('input', atualizar);
    el?.addEventListener('change', atualizar);
  });

  btnFiltrar?.addEventListener('click', () => {
    const candidatos = obterPetsFiltradosFeed();
    const lista = document.getElementById('lista-animais');

    if (!candidatos.length) {
      petDestinoId = null;
      if (btnFiltrar) btnFiltrar.textContent = 'Buscar Match ✨';
      renderFeedPets();
      if (lista) {
        lista.innerHTML = `<div class="vazio">Nenhum pet compatível com os filtros atuais para sortear. Ajuste os filtros e tente novamente.</div>`;
      }
      return;
    }

    const escolhido = candidatos[Math.floor(Math.random() * candidatos.length)];
    petDestinoId = escolhido.id;
    if (btnFiltrar) btnFiltrar.textContent = 'Sortear outro match ✨';
    renderFeedPets();
    lista?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  renderFeedPets();
}

function obterPetsFiltradosFeed() {
  const termo = (document.getElementById('busca')?.value || '').trim().toLowerCase();
  const especie = document.getElementById('filtro-especie')?.value || 'todos';
  const porte = document.getElementById('filtro-porte')?.value || 'todos';
  const sexo = document.getElementById('filtro-sexo')?.value || 'todos';
  const normalizarTexto = (valor) =>
    String(valor || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const especieFiltro = normalizarTexto(especie);
  const sexoFiltro = normalizarTexto(sexo);

  return animaisPublicosDisponiveis().filter((pet) => {
    const bag = [pet.nome, pet.descricao, pet.temperamento, pet.energia].join(' ').toLowerCase();
    const especiePet = normalizarTexto(pet.especie);
    const sexoPet = normalizarTexto(pet.sexo);
    const bateTexto = termo ? bag.includes(termo) : true;
    const bateEspecie = especieFiltro === 'todos' ? true : especiePet === especieFiltro;
    const batePorte = porte === 'todos' ? true : pet.porte === porte;
    const bateSexo = sexoFiltro === 'todos' ? true : sexoPet === sexoFiltro;

    return bateTexto && bateEspecie && batePorte && bateSexo;
  });
}

function renderFeedPets() {
  const lista = document.getElementById('lista-animais');
  const paginacao = document.getElementById('pets-paginacao');
  if (!lista) return;

  const filtrados = obterPetsFiltradosFeed();
  const petDestino = petDestinoId ? filtrados.find((pet) => pet.id === petDestinoId) : null;

  if (petDestinoId && !petDestino) {
    petDestinoId = null;
  }

  const pets = petDestino ? [petDestino] : filtrados;
  lista.classList.toggle('destino-ativo', Boolean(petDestino));

  if (!pets.length) {
    lista.innerHTML = `<div class="vazio">Nenhum pet encontrado com os filtros atuais.</div>`;
    if (paginacao) paginacao.innerHTML = '';
    return;
  }

  const totalPaginasPets = Math.max(1, Math.ceil(filtrados.length / PETS_CARDS_POR_PAGINA));
  petsPaginaAtual = Math.min(Math.max(1, petsPaginaAtual), totalPaginasPets);
  const inicio = (petsPaginaAtual - 1) * PETS_CARDS_POR_PAGINA;
  const petsPaginados = petDestino ? [petDestino] : filtrados.slice(inicio, inicio + PETS_CARDS_POR_PAGINA);

  const faixaDestino = petDestino
    ? `<div class="destino-banner">✨ O destino escolheu <strong>${petDestino.nome}</strong> para você! ✨</div>`
    : '';

  lista.innerHTML = `${faixaDestino}${petsPaginados
    .map((pet) => {
      const fotoPerfil = fotoPerfilDoPet(pet);
      const galeria = Array.isArray(pet.galeria) && pet.galeria.length ? pet.galeria : [FALLBACK_FOTO];
      const tags = `<span class="tag">${pet.porte}</span> <span class="tag">Energia ${pet.energia}</span> <span class="tag">${pet.sexo}</span>`;
      const cardDestinoClass = petDestino && pet.id === petDestino.id ? ' pet-post-destino' : '';

      return `
        <article class="pet-post${cardDestinoClass}" data-pet-id="${pet.id}">
          <header class="pet-post-head">
            <div class="left">
              <span class="avatar-slot"><img class="avatar-mini" src="${fotoPerfil}" alt="Avatar ${pet.nome}" /></span>
              <div class="pet-identidade">
                <strong>${pet.nome}</strong>
                <p class="texto-suave">${pet.especie} • ${pet.idade} anos • ${pet.sexo}</p>
              </div>
            </div>
            ${criarTagStatus(pet.status)}
          </header>

          <div class="pet-media-wrap">
            <div class="pet-media">
              <img src="${fotoPerfil}" alt="Foto principal de ${pet.nome}" data-main-image="${pet.id}" />
            </div>
          </div>

          <div class="pet-thumbs">
            ${galeria
              .map(
                (foto, index) =>
                  `<img src="${foto}" alt="Miniatura ${index + 1} de ${pet.nome}" data-thumb="${pet.id}" data-foto="${foto}" class="${index === (pet.fotoPerfilIndex ?? 0) ? 'ativo' : ''}" />`,
              )
              .join('')}
          </div>

          <div class="pet-caption">
            <div class="meta">${tags}</div>
            <p class="pet-bio">${pet.descricao}</p>
            <div class="pet-resumo">
              <article class="pet-info-item">
                <strong>Temperamento</strong>
                <span>${pet.temperamento}</span>
              </article>
              <article class="pet-info-item">
                <strong>Saúde</strong>
                <span>${pet.vacinado ? 'Vacinado' : 'Vacinação pendente'} • ${pet.castrado ? 'Castrado' : 'Não castrado'}</span>
              </article>
              <article class="pet-info-item">
                <strong>Porte e idade</strong>
                <span>${pet.porte} • ${pet.idade} anos</span>
              </article>
              <article class="pet-info-item">
                <strong>Perfil ideal</strong>
                <span>${pet.energia === 'Alta' ? 'Família ativa e rotina de brincadeiras' : pet.energia === 'Média' ? 'Rotina equilibrada com passeios diários' : 'Ambiente tranquilo e acolhedor'}</span>
              </article>
            </div>
            <a class="btn btn-principal btn-card-adotar" href="${linkAdocao(pet.id)}">Adotar ${pet.nome}</a>
          </div>
        </article>
      `;
    })
    .join('')}`;

  if (petDestino) {
    if (paginacao) paginacao.innerHTML = '';
  } else {
    renderPaginacaoNumerica({
      alvo: paginacao,
      totalPaginas: totalPaginasPets,
      paginaAtual: petsPaginaAtual,
      onChange: (novaPagina) => {
        petsPaginaAtual = novaPagina;
        renderFeedPets();
        document.getElementById('lista-animais')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    });
  }

  lista.querySelectorAll('[data-main-image]').forEach((img) => {
    const petId = img.getAttribute('data-main-image');
    const pet = estado.animais.find((item) => item.id === petId);
    if (pet) aplicarEstiloFoto(img, pet);
  });

  lista.querySelectorAll('[data-thumb]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const petId = thumb.getAttribute('data-thumb');
      const foto = thumb.getAttribute('data-foto');
      const card = thumb.closest('.pet-post');
      if (!card || !foto || !petId) return;

      const main = card.querySelector('[data-main-image]');
      if (main) {
        main.setAttribute('src', foto);
        const pet = estado.animais.find((item) => item.id === petId);
        if (pet) {
          const idx = pet.galeria.indexOf(foto);
          if (idx >= 0) {
            pet.fotoPerfilIndex = idx;
            aplicarEstiloFoto(main, pet);
          }
        }
      }

      card.querySelectorAll('[data-thumb]').forEach((item) => item.classList.remove('ativo'));
      thumb.classList.add('ativo');
    });
  });
}

function configurarBlog() {
  const lista = document.getElementById('blog-lista-completa');
  const paginacao = document.getElementById('blog-paginacao');
  if (!lista) return;

  blogPaginaAtual = 1;

  const render = () => {
    const categoriaSelecionada = document.getElementById('filtro-categoria-blog')?.value || 'todas';
    const postsFiltrados = postsPublicados().filter((post) =>
      categoriaSelecionada === 'todas' ? true : String(post.categoria || '').toLowerCase() === categoriaSelecionada.toLowerCase(),
    );

    if (!postsFiltrados.length) {
      lista.innerHTML = `<div class="vazio">Sem artigos no momento.</div>`;
      if (paginacao) paginacao.innerHTML = '';
      return;
    }

    const totalPaginas = Math.max(1, Math.ceil(postsFiltrados.length / CARDS_POR_PAGINA));
    blogPaginaAtual = Math.min(Math.max(1, blogPaginaAtual), totalPaginas);
    const inicio = (blogPaginaAtual - 1) * CARDS_POR_PAGINA;
    const postsPaginaAtual = postsFiltrados.slice(inicio, inicio + CARDS_POR_PAGINA);

    lista.innerHTML = postsPaginaAtual
      .map(
        (post) => `
      <article class="blog-item">
        <a class="blog-link" href="blog-post.html?id=${encodeURIComponent(post.id)}">
          ${post.capa ? `<img class="blog-capa" src="${post.capa}" alt="Capa do artigo ${post.titulo}" />` : ''}
          <span class="badge">${post.categoria}</span>
          <h3>${post.titulo}</h3>
          <p>${post.resumo}</p>
          <p class="texto-suave">Publicado em ${formatarData(post.data)} • ${post.autor || 'Equipe Canil de Vilhena'}</p>
          <span class="link-leia">Ler artigo completo →</span>
        </a>
      </article>
    `,
      )
      .join('');

    renderPaginacaoNumerica({
      alvo: paginacao,
      totalPaginas,
      paginaAtual: blogPaginaAtual,
      onChange: (novaPagina) => {
        blogPaginaAtual = novaPagina;
        render();
        document.getElementById('blog-lista-completa')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    });
  };

  const filtroCategoria = document.getElementById('filtro-categoria-blog');
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', () => {
      blogPaginaAtual = 1;
      render();
    });
  }

  render();
}

function renderPaginacaoNumerica({ alvo, totalPaginas, paginaAtual, onChange }) {
  if (!alvo) return;
  if (totalPaginas <= 1) {
    alvo.innerHTML = '';
    return;
  }

  const anteriorDesabilitado = paginaAtual <= 1;
  const proximaDesabilitado = paginaAtual >= totalPaginas;

  const botoes = Array.from({ length: totalPaginas }, (_, index) => {
    const numero = index + 1;
    const ativo = numero === paginaAtual;
    return `<button type="button" class="pager-btn ${ativo ? 'ativo' : ''}" data-pagina="${numero}" aria-label="Ir para a página ${numero}" aria-current="${ativo ? 'page' : 'false'}">${numero}</button>`;
  }).join('');

  alvo.innerHTML = `
    <nav class="paginacao-numerica" aria-label="Navegação de páginas">
      <button type="button" class="pager-btn pager-btn-nav" data-pagina-nav="anterior" ${anteriorDesabilitado ? 'disabled' : ''} aria-label="Ir para a página anterior">Anterior</button>
      ${botoes}
      <button type="button" class="pager-btn pager-btn-nav" data-pagina-nav="proxima" ${proximaDesabilitado ? 'disabled' : ''} aria-label="Ir para a próxima página">Próxima</button>
    </nav>
  `;

  alvo.querySelector('[data-pagina-nav="anterior"]')?.addEventListener('click', () => {
    if (paginaAtual <= 1) return;
    onChange(paginaAtual - 1);
  });

  alvo.querySelector('[data-pagina-nav="proxima"]')?.addEventListener('click', () => {
    if (paginaAtual >= totalPaginas) return;
    onChange(paginaAtual + 1);
  });

  alvo.querySelectorAll('[data-pagina]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pagina = Number(btn.getAttribute('data-pagina'));
      if (!Number.isFinite(pagina) || pagina === paginaAtual) return;
      onChange(pagina);
    });
  });
}

function configurarBlogPost() {
  const alvo = document.getElementById('blog-post-detalhe');
  if (!alvo) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const post = postsPublicados().find((item) => item.id === id);

  if (!post) {
    alvo.innerHTML = `
      <article class="painel leitura-blog">
        <h1 class="titulo-pagina">Post não encontrado</h1>
        <p class="texto-suave">Esse conteúdo pode ter sido removido ou ainda não foi publicado.</p>
        <a class="btn btn-secundario" href="blog.html">Voltar para o blog</a>
      </article>
    `;
    return;
  }

  const relacionados = postsPublicados()
    .filter((item) => item.id !== post.id)
    .slice(0, 3)
    .map(
      (item) => `
      <a class="blog-rel-item" href="blog-post.html?id=${encodeURIComponent(item.id)}">
        <strong>${item.titulo}</strong>
        <span>${formatarData(item.data)}</span>
      </a>
    `,
    )
    .join('');

  alvo.innerHTML = `
    <article class="painel leitura-blog">
      <a class="link-suave" href="blog.html">← Voltar para o blog</a>
      <h1 class="titulo-pagina">${post.titulo}</h1>
      <p class="texto-suave">${post.categoria} • ${formatarData(post.data)} • ${post.autor || 'Equipe Canil de Vilhena'}</p>
      ${post.capa ? `<img class="leitura-capa" src="${post.capa}" alt="Capa do artigo ${post.titulo}" />` : ''}
      <div class="leitura-conteudo">${post.conteudo.split('\n').map((linha) => `<p>${linha}</p>`).join('')}</div>
      <div class="leitura-footer">
        <h3>Leituras relacionadas</h3>
        <div class="blog-rel-grid">${relacionados || '<div class="vazio">Sem conteúdos relacionados.</div>'}</div>
      </div>
    </article>
  `;
}

function configurarContato() {
  const form = document.getElementById('form-denuncia');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const local = inputValue('denuncia-assunto') || inputValue('denuncia-local');
    const descricao = inputValue('denuncia-descricao');
    const nomeContato = inputValue('denuncia-nome');
    const telefoneContato = inputValue('denuncia-telefone') || inputValue('denuncia-contato');
    const contato = [nomeContato, telefoneContato].filter(Boolean).join(' • ');

    if (!local || !descricao) {
      setStatus('status-denuncia', 'Preencha o assunto e a descrição da ocorrência.', 'erro');
      return;
    }

    estado.denuncias.unshift({
      id: `den-${crypto.randomUUID()}`,
      local,
      descricao,
      contato,
      origem: 'contato',
      statusAtendimento: 'nova',
      prioridadeAtendimento: prioridadeSugeridaDenuncia(descricao, local),
      criadoEm: new Date().toISOString(),
    });

    salvarEstado();
    form.reset();
    setStatus('status-denuncia', 'Denúncia enviada com sucesso. Obrigado por ajudar.', 'ok');
  });
}

function configurarAdocao() {
  const params = new URLSearchParams(window.location.search);
  const petId = params.get('pet');
  const resumo = document.getElementById('resumo-adocao');
  const form = document.getElementById('form-adocao');

  const pet = animaisPublicosDisponiveis().find((item) => item.id === petId) || null;

  if (resumo) {
    if (!pet) {
      resumo.innerHTML = `
        <h3>Pet não selecionado</h3>
        <p class="texto-suave">Escolha um pet na página de feed para iniciar a etapa de adoção.</p>
        <a class="btn btn-secundario" href="pets.html">Ir para pets</a>
      `;
    } else {
      resumo.innerHTML = `
        <h3>Você está iniciando adoção de ${pet.nome}</h3>
        <div class="resumo-adocao-card">
          <img src="${fotoPerfilDoPet(pet)}" alt="${pet.nome}" />
          <div>
            <p class="texto-suave">${pet.especie} • ${pet.idade} anos • ${pet.porte}</p>
            <div class="meta">
              ${criarTagStatus(pet.status)}
              <span class="tag">Energia ${pet.energia}</span>
            </div>
            <p>${pet.descricao}</p>
          </div>
        </div>
      `;
    }
  }

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!pet) {
      setStatus('status-adocao', 'Selecione um pet antes de enviar interesse.', 'erro');
      return;
    }

    const payload = {
      id: `int-${crypto.randomUUID()}`,
      petId: pet.id,
      petNome: pet.nome,
      nome: inputValue('adocao-nome'),
      whatsapp: inputValue('adocao-whatsapp'),
      email: inputValue('adocao-email'),
      cidade: inputValue('adocao-cidade'),
      mensagem: inputValue('adocao-mensagem'),
      criadoEm: new Date().toISOString(),
      origem: 'site',
      statusAtendimento: 'novo',
      prioridadeAtendimento: 'media',
    };

    if (!payload.nome || !payload.whatsapp || !payload.email || !payload.cidade || !payload.mensagem) {
      setStatus('status-adocao', 'Preencha todos os campos obrigatórios.', 'erro');
      return;
    }

    estado.interesses.unshift(payload);
    salvarEstado();
    form.reset();
    setStatus('status-adocao', 'Interesse enviado! A equipe retornará em breve.', 'ok');
  });
}

function configurarSistema() {
  configurarLoginSistema();
}

function configurarLoginSistema() {
  const form = document.getElementById('form-login-sistema');
  const btnLogout = document.getElementById('btn-logout');

  // Preenche campos se "lembrar" estava marcado anteriormente
  const loginSalvo = localStorage.getItem('canil_lembrar_login');
  const senhaSalva = localStorage.getItem('canil_lembrar_senha');
  if (loginSalvo && senhaSalva) {
    const inputLogin = document.getElementById('login-usuario');
    const inputSenha = document.getElementById('login-senha');
    const inputLembrar = document.getElementById('login-lembrar');
    if (inputLogin) inputLogin.value = loginSalvo;
    if (inputSenha) inputSenha.value = decode(senhaSalva);
    if (inputLembrar) inputLembrar.checked = true;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const login = inputValue('login-usuario').toLowerCase();
    const senha = inputValue('login-senha');
    const lembrar = document.getElementById('login-lembrar')?.checked;

    const usuario = estado.usuarios.find((item) => item.login.toLowerCase() === login && item.ativo);
    if (!usuario || decode(usuario.senhaHash) !== senha) {
      setStatus('status-login', 'Usuário ou senha inválidos.', 'erro');
      return;
    }

    // Gerencia o "lembrar login"
    if (lembrar) {
      localStorage.setItem('canil_lembrar_login', login);
      localStorage.setItem('canil_lembrar_senha', encode(senha));
    } else {
      localStorage.removeItem('canil_lembrar_login');
      localStorage.removeItem('canil_lembrar_senha');
    }

    sessionStorage.setItem(SESSION_KEYS.usuario, JSON.stringify(usuario));
    setStatus('status-login', 'Acesso liberado.', 'ok');
    renderSistemaAutenticado();
  });

  btnLogout?.addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEYS.usuario);
    sessionStorage.removeItem(SESSION_KEYS.abaSistema);
    mostrarAreaSistema(false);
    setText('usuario-logado', '');
    if (btnLogout) { btnLogout.style.display = 'none'; }
    const formLogin = document.getElementById('form-login-sistema');
    // Só limpa os campos se não estava lembrando
    if (!localStorage.getItem('canil_lembrar_login')) {
      formLogin?.reset();
    }
  });

  const usuarioLogado = readSessionUser();
  if (usuarioLogado) {
    renderSistemaAutenticado();
  } else {
    mostrarAreaSistema(false);
  }
}

function renderSistemaAutenticado() {
  // Transição visual imediata — garante que acontece antes de qualquer outro código
  mostrarAreaSistema(true);
  window.scrollTo(0, 0);

  const usuario = readSessionUser();
  if (usuario) {
    setText('usuario-logado', `${usuario.nome} (${usuario.perfil})`);
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.style.display = '';
      btnLogout.removeAttribute('hidden');
    }
  }

  // Configura módulos com proteção para evitar que erros isolados travem o sistema
  const modulos = [
    ['MenuLateral', configurarMenuLateralSistema],
    ['Tabs', configurarTabsSistema],
    ['CardsSuspensos', configurarCardsSuspensosSistema],
    ['FormPet', configurarFormularioPet],
    ['PainelOp', configurarPainelOperacao],
    ['Blog', configurarBlogSistema],
    ['Usuarios', configurarUsuariosSistema],
    ['Dashboard', renderDashboardSistema],
    ['ListaPets', renderListaGestaoPets],
    ['HistoriasAdocao', configurarHistoriasAdocaoSistema],
  ];

  modulos.forEach(([nome, fn]) => {
    try {
      fn();
    } catch (e) {
      console.warn(`[Sistema] Erro no módulo ${nome}:`, e);
    }
  });
}

function configurarMenuLateralSistema() {
  const area = document.getElementById('area-sistema');
  const botao = document.getElementById('btn-toggle-menu-sistema');
  if (!area || !botao) return;

  const aplicarEstado = (colapsado) => {
    area.classList.toggle('menu-colapsado', colapsado);
    botao.setAttribute('aria-expanded', colapsado ? 'false' : 'true');
    botao.setAttribute('aria-label', colapsado ? 'Expandir menu lateral' : 'Recolher menu lateral');
    botao.setAttribute('title', colapsado ? 'Expandir menu' : 'Recolher menu');
  };

  const sincronizarComViewport = () => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      aplicarEstado(false);
      return;
    }

    const salvo = sessionStorage.getItem(SESSION_KEYS.menuSistemaColapsado) === '1';
    aplicarEstado(salvo);
  };

  if (botao.dataset.menuConfigurado !== 'true') {
    botao.dataset.menuConfigurado = 'true';
    botao.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 900px)').matches) return;

      const ficouColapsado = !area.classList.contains('menu-colapsado');
      aplicarEstado(ficouColapsado);
      sessionStorage.setItem(SESSION_KEYS.menuSistemaColapsado, ficouColapsado ? '1' : '0');
    });
  }

  if (!window.__menuSistemaResizeConfigurado) {
    window.addEventListener('resize', sincronizarComViewport);
    window.__menuSistemaResizeConfigurado = true;
  }

  sincronizarComViewport();
}

function mostrarAreaSistema(autenticado) {
  const login = document.getElementById('login-sistema');
  const area = document.getElementById('area-sistema');
  if (!login || !area) return;

  if (autenticado) {
    login.hidden = true;
    login.style.display = 'none';
    area.hidden = false;
    area.style.display = 'block';
  } else {
    login.hidden = false;
    login.style.display = '';
    area.hidden = true;
    area.style.display = 'none';
  }
}

function abrirCardSuspenso(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (modal.__closeTimer) {
    window.clearTimeout(modal.__closeTimer);
    modal.__closeTimer = null;
  }

  modal.hidden = false;
  window.requestAnimationFrame(() => {
    modal.classList.add('aberto');
  });
  document.body.classList.add('modal-aberto');
}

function fecharCardSuspenso(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove('aberto');
  modal.__closeTimer = window.setTimeout(() => {
    modal.hidden = true;
    modal.__closeTimer = null;

    const aberto = document.querySelector('.modal-suspenso.aberto:not([hidden])');
    if (!aberto) {
      document.body.classList.remove('modal-aberto');
    }
  }, 220);
}

function configurarCardsSuspensosSistema() {
  const modais = [...document.querySelectorAll('.modal-suspenso')];
  if (!modais.length) return;

  modais.forEach((modal) => {
    if (modal.dataset.modalConfigurado === 'true') return;
    modal.dataset.modalConfigurado = 'true';

    modal.addEventListener('click', (event) => {
      if (event.target === modal && modal.id) {
        fecharCardSuspenso(modal.id);
      }
    });
  });

  document.querySelectorAll('[data-fechar-modal]').forEach((botao) => {
    if (botao.dataset.modalFecharConfigurado === 'true') return;
    botao.dataset.modalFecharConfigurado = 'true';

    botao.addEventListener('click', () => {
      const modalId = botao.getAttribute('data-fechar-modal');
      if (modalId) fecharCardSuspenso(modalId);
    });
  });

  if (!window.__sistemaModalEscConfigurado) {
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const aberto = document.querySelector('.modal-suspenso:not([hidden])');
      if (!aberto || !aberto.id) return;
      fecharCardSuspenso(aberto.id);
    });
    window.__sistemaModalEscConfigurado = true;
  }
}

function configurarTabsSistema() {
  const botoes = [...document.querySelectorAll('.tab-btn[data-target]')];
  const paineis = [...document.querySelectorAll('.sistema-tab')];
  if (!botoes.length || !paineis.length) return;

  const abaSalva = sessionStorage.getItem(SESSION_KEYS.abaSistema) || 'tab-dashboard';
  ativarAbaSistema(abaSalva);

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      const aba = botao.getAttribute('data-target') || 'tab-dashboard';
      ativarAbaSistema(aba);
      sessionStorage.setItem(SESSION_KEYS.abaSistema, aba);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  function ativarAbaSistema(aba) {
    botoes.forEach((b) => b.classList.toggle('ativo', b.getAttribute('data-target') === aba));
    paineis.forEach((p) => p.classList.toggle('ativo', p.id === aba));
  }
}

function configurarFormularioPet() {
  const form = document.getElementById('form-animal');
  const btnNovo = document.getElementById('btn-Novo-pet');
  const btnAddFotoArquivo = document.getElementById('btn-adicionar-foto-arquivo');
  const inputFotoArquivo = document.getElementById('foto-arquivo');
  const inputStatusAnimal = document.getElementById('status-animal');
  const inputAdotante = document.getElementById('adotante');
  const inputTelefoneAdotante = document.getElementById('telefone-adotante');
  const statusFotoId = 'status-foto';
  const controlesFoto = [
    'perfil-zoom',
    'perfil-brilho',
    'perfil-contraste',
    'perfil-saturacao',
  ];

  if (!form) return;

  let galeriaAtual = [];
  let perfilIndexAtual = 0;
  let dragAtivo = false;
  let dragInicio = { x: 50, y: 50, pointerX: 0, pointerY: 0, width: 1, height: 1 };

  const resetForm = () => {
    form.reset();
    setText('titulo-form', 'Novo pet');
    setInputValue('animal-id', '');
    galeriaAtual = [FALLBACK_FOTO];
    perfilIndexAtual = 0;
    definirControlesPadrao();
    renderGaleriaEdicao();
    atualizarPreviewPerfil();
    sincronizarCamposAdotantePorStatus();
    setStatus('status-sistema', '', 'limpo');
    setStatus(statusFotoId, '', 'limpo');
  };

  const setStatusFoto = (mensagem, tipo = 'ok') => setStatus(statusFotoId, mensagem, tipo);

  const sincronizarCamposAdotantePorStatus = () => {
    if (!(inputStatusAnimal instanceof HTMLSelectElement)) return;
    const adotado = normalizarStatus(inputStatusAnimal.value) === 'adotado';

    if (inputAdotante instanceof HTMLInputElement) {
      inputAdotante.disabled = !adotado;
      if (!adotado) inputAdotante.value = '';
      inputAdotante.placeholder = adotado
        ? 'Obrigatório para finalizar adoção'
        : 'Disponível somente quando status for Adotado';
    }

    if (inputTelefoneAdotante instanceof HTMLInputElement) {
      inputTelefoneAdotante.disabled = !adotado;
      if (!adotado) inputTelefoneAdotante.value = '';
      inputTelefoneAdotante.placeholder = adotado
        ? 'Ex: (69) 99999-9999'
        : 'Preenchido apenas para pets adotados';
    }
  };

  const obterAjusteAtual = () => ({
    x: Number(inputValue('perfil-pos-x') || 50),
    y: Number(inputValue('perfil-pos-y') || 50),
    zoom: Number(inputValue('perfil-zoom') || 1),
    brilho: Number(inputValue('perfil-brilho') || 100),
    contraste: Number(inputValue('perfil-contraste') || 100),
    saturacao: Number(inputValue('perfil-saturacao') || 100),
  });

  const aplicarAjusteNosControles = (ajuste = {}) => {
    setInputValue('perfil-pos-x', ajuste.x ?? 50);
    setInputValue('perfil-pos-y', ajuste.y ?? 50);
    setInputValue('perfil-zoom', ajuste.zoom ?? 1);
    setInputValue('perfil-brilho', ajuste.brilho ?? 100);
    setInputValue('perfil-contraste', ajuste.contraste ?? 100);
    setInputValue('perfil-saturacao', ajuste.saturacao ?? 100);
  };

  const definirControlesPadrao = () => {
    aplicarAjusteNosControles({ x: 50, y: 50, zoom: 1, brilho: 100, contraste: 100, saturacao: 100 });
  };

  const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));

  const lerArquivoComoDataUrl = (arquivo) =>
    new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(String(leitor.result || ''));
      leitor.onerror = () => reject(new Error('Falha ao ler arquivo de imagem.'));
      leitor.readAsDataURL(arquivo);
    });

  const carregarImagem = (src) =>
    new Promise((resolve, reject) => {
      const imagem = new Image();
      imagem.onload = () => resolve(imagem);
      imagem.onerror = () => reject(new Error('Arquivo selecionado nao e uma imagem valida.'));
      imagem.src = src;
    });

  const arquivoImagemParaDataUrl = async (arquivo) => {
    const nome = String(arquivo?.name || '').toLowerCase();
    const extensaoEhImagem = /\.(png|jpe?g|gif|webp|bmp|svg|avif|tiff?|ico|heic|heif|jfif|jpe|jif|jfi)$/i.test(nome);
    const tipoEhImagem = String(arquivo?.type || '').startsWith('image/');

    if (!arquivo || (!tipoEhImagem && !extensaoEhImagem)) {
      throw new Error('Selecione apenas arquivos de imagem.');
    }

    const dataUrlOriginal = await lerArquivoComoDataUrl(arquivo);
    const imagem = await carregarImagem(dataUrlOriginal);
    const maxLado = 1400;
    const escala = Math.min(1, maxLado / Math.max(imagem.width, imagem.height));

    if (escala === 1 && arquivo.size <= 900 * 1024) {
      return dataUrlOriginal;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(imagem.width * escala));
    canvas.height = Math.max(1, Math.round(imagem.height * escala));

    const contexto = canvas.getContext('2d');
    if (!contexto) {
      throw new Error('Nao foi possivel processar a imagem selecionada.');
    }

    contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.86);
  };

  const atualizarPreviewPerfil = () => {
    const preview = document.getElementById('preview-perfil');
    if (!preview) return;

    const foto = galeriaAtual[perfilIndexAtual] || FALLBACK_FOTO;
    preview.setAttribute('src', foto);

    const ajuste = obterAjusteAtual();
    preview.style.objectPosition = `${ajuste.x}% ${ajuste.y}%`;
    preview.style.transform = `scale(${ajuste.zoom})`;
    preview.style.filter = `brightness(${ajuste.brilho}%) contrast(${ajuste.contraste}%) saturate(${ajuste.saturacao}%)`;
  };

  const renderGaleriaEdicao = () => {
    const alvo = document.getElementById('galeria-edicao');
    if (!alvo) return;

    alvo.innerHTML = galeriaAtual
      .map(
        (foto, index) => `
        <article class="miniatura ${index === perfilIndexAtual ? 'ativa' : ''}">
          <img src="${foto}" alt="Foto ${index + 1}" />
          <div class="miniatura-acoes">
            <button class="mini-btn" type="button" data-set-perfil="${index}">Foto de perfil</button>
            <button class="mini-btn remover" type="button" data-remover-foto="${index}">Remover</button>
          </div>
        </article>
      `,
      )
      .join('');

    alvo.querySelectorAll('[data-set-perfil]').forEach((botao) => {
      botao.addEventListener('click', () => {
        const idx = Number(botao.getAttribute('data-set-perfil'));
        perfilIndexAtual = idx;
        renderGaleriaEdicao();
        atualizarPreviewPerfil();
      });
    });

    alvo.querySelectorAll('[data-remover-foto]').forEach((botao) => {
      botao.addEventListener('click', () => {
        if (galeriaAtual.length <= 1) return;

        const idx = Number(botao.getAttribute('data-remover-foto'));
        galeriaAtual = galeriaAtual.filter((_, i) => i !== idx);
        if (perfilIndexAtual >= galeriaAtual.length) {
          perfilIndexAtual = galeriaAtual.length - 1;
        }

        renderGaleriaEdicao();
        atualizarPreviewPerfil();
      });
    });
  };

  const adicionarArquivosSelecionados = async (arquivos) => {
    if (!arquivos.length) {
      setStatusFoto('Selecione uma ou mais fotos no seu computador.', 'erro');
      return;
    }

    let adicionadas = 0;
    let rejeitadas = 0;

    for (const arquivo of arquivos) {
      try {
        const dataUrl = await arquivoImagemParaDataUrl(arquivo);
        galeriaAtual.push(dataUrl);
        adicionadas += 1;
      } catch (_) {
        rejeitadas += 1;
      }
    }

    if (inputFotoArquivo) {
      inputFotoArquivo.value = '';
    }

    if (!adicionadas) {
      setStatusFoto('Nao foi possivel adicionar as fotos selecionadas.', 'erro');
      return;
    }

    renderGaleriaEdicao();
    atualizarPreviewPerfil();

    if (rejeitadas) {
      setStatusFoto(`${adicionadas} foto(s) adicionada(s). ${rejeitadas} arquivo(s) foram ignorados.`, 'ok');
      return;
    }

    setStatusFoto(`${adicionadas} foto(s) adicionada(s) do computador.`, 'ok');
  };

  btnAddFotoArquivo?.addEventListener('click', async () => {
    const arquivos = [...(inputFotoArquivo?.files || [])];
    if (!arquivos.length) {
      inputFotoArquivo?.click();
      return;
    }
    await adicionarArquivosSelecionados(arquivos);
  });

  inputFotoArquivo?.addEventListener('change', async () => {
    const arquivos = [...(inputFotoArquivo.files || [])];
    if (!arquivos.length) return;
    await adicionarArquivosSelecionados(arquivos);
  });

  controlesFoto.forEach((id) => {
    document.getElementById(id)?.addEventListener('input', atualizarPreviewPerfil);
  });

  const previewWrap = document.querySelector('.preview-perfil-wrap');
  const posXInput = document.getElementById('perfil-pos-x');
  const posYInput = document.getElementById('perfil-pos-y');

  if (previewWrap && posXInput && posYInput) {
    previewWrap.addEventListener('pointerdown', (event) => {
      const rect = previewWrap.getBoundingClientRect();
      dragAtivo = true;
      dragInicio = {
        x: Number(posXInput.value || 50),
        y: Number(posYInput.value || 50),
        pointerX: event.clientX,
        pointerY: event.clientY,
        width: Math.max(rect.width, 1),
        height: Math.max(rect.height, 1),
      };
      previewWrap.classList.add('arrastando');
      previewWrap.setPointerCapture(event.pointerId);
    });

    previewWrap.addEventListener('pointermove', (event) => {
      if (!dragAtivo) return;

      const deltaX = ((event.clientX - dragInicio.pointerX) / dragInicio.width) * 100;
      const deltaY = ((event.clientY - dragInicio.pointerY) / dragInicio.height) * 100;

      const novoX = limitar(dragInicio.x - deltaX, 0, 100);
      const novoY = limitar(dragInicio.y - deltaY, 0, 100);

      posXInput.value = String(novoX);
      posYInput.value = String(novoY);
      atualizarPreviewPerfil();
    });

    const finalizarArraste = (event) => {
      if (!dragAtivo) return;
      dragAtivo = false;
      previewWrap.classList.remove('arrastando');
      if (event.pointerId != null && previewWrap.hasPointerCapture(event.pointerId)) {
        previewWrap.releasePointerCapture(event.pointerId);
      }
    };

    previewWrap.addEventListener('pointerup', finalizarArraste);
    previewWrap.addEventListener('pointercancel', finalizarArraste);
    previewWrap.addEventListener('pointerleave', (event) => {
      if (event.buttons === 0) {
        finalizarArraste(event);
      }
    });

    // Scroll para zoom (roda do mouse)
    previewWrap.addEventListener('wheel', (event) => {
      event.preventDefault();
      const posZoom = document.getElementById('perfil-zoom');
      if (!posZoom) return;
      const delta = event.deltaY > 0 ? -0.05 : 0.05;
      posZoom.value = String(limitar(Number(posZoom.value) + delta, 0.5, 3));
      atualizarPreviewPerfil();
    }, { passive: false });

    // Pinça para zoom (dois dedos no celular)
    let ultimaDistToque = 0;
    previewWrap.addEventListener('touchstart', (event) => {
      if (event.touches.length === 2) {
        ultimaDistToque = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY,
        );
      }
    }, { passive: true });

    previewWrap.addEventListener('touchmove', (event) => {
      if (event.touches.length === 2) {
        event.preventDefault();
        const dist = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY,
        );
        if (ultimaDistToque > 0) {
          const posZoom = document.getElementById('perfil-zoom');
          if (posZoom) {
            const novoZoom = limitar(Number(posZoom.value) * (dist / ultimaDistToque), 0.5, 3);
            posZoom.value = String(novoZoom);
            atualizarPreviewPerfil();
          }
        }
        ultimaDistToque = dist;
      }
    }, { passive: false });

    previewWrap.addEventListener('touchend', () => { ultimaDistToque = 0; }, { passive: true });
  }

  document.getElementById('preset-filtros')?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const preset = target.getAttribute('data-filtro');
    if (!preset) return;

    if (preset === 'natural') {
      aplicarAjusteNosControles({ brilho: 100, contraste: 100, saturacao: 100 });
    }
    if (preset === 'vivo') {
      aplicarAjusteNosControles({ brilho: 105, contraste: 112, saturacao: 135 });
    }
    if (preset === 'quente') {
      aplicarAjusteNosControles({ brilho: 108, contraste: 106, saturacao: 122 });
    }
    if (preset === 'pb') {
      aplicarAjusteNosControles({ brilho: 102, contraste: 116, saturacao: 0 });
    }
    atualizarPreviewPerfil();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = inputValue('animal-id') || `pet-${crypto.randomUUID()}`;
    const petAnterior = estado.animais.find((item) => item.id === id);
    const statusNormalizado = normalizarStatus(inputValue('status-animal'));
    const adotanteNome = statusNormalizado === 'adotado' ? inputValue('adotante') : '';
    const telefoneAdotante = statusNormalizado === 'adotado' ? inputValue('telefone-adotante') : '';

    if (statusNormalizado === 'adotado' && !adotanteNome) {
      setStatus('status-sistema', 'Para status Adotado, informe obrigatoriamente o nome do adotante.', 'erro');
      return;
    }

    const pet = {
      id,
      nome: inputValue('nome-animal'),
      especie: inputValue('especie-animal'),
      idade: Number(inputValue('idade-animal')),
      porte: inputValue('porte-animal'),
      sexo: inputValue('sexo-animal'),
      status: statusNormalizado,
      energia: inputValue('energia-animal'),
      temperamento: inputValue('temperamento-animal'),
      vacinado: Boolean(document.getElementById('vacinado')?.checked),
      castrado: Boolean(document.getElementById('castrado')?.checked),
      descricao: inputValue('descricao-animal'),
      bairroResgate: inputValue('bairro-resgate'),
      observacaoInterna: inputValue('observacao-interna'),
      adotante: adotanteNome,
      telefoneAdotante: telefoneAdotante,
      historiaAdocao: petAnterior?.historiaAdocao || '',
      historiaTitulo: petAnterior?.historiaTitulo || '',
      historiaPublicado: statusNormalizado === 'adotado' ? Boolean(petAnterior?.historiaPublicado) : false,
      historiaPublicadoEm: statusNormalizado === 'adotado' ? String(petAnterior?.historiaPublicadoEm || '') : '',
      historiaAtualizadoEm: String(petAnterior?.historiaAtualizadoEm || ''),
      galeria: galeriaAtual.length ? galeriaAtual : [FALLBACK_FOTO],
      fotoPerfilIndex: perfilIndexAtual,
      fotoPerfilAjuste: obterAjusteAtual(),
      atualizadoEm: new Date().toISOString(),
    };

    if (!pet.nome || !pet.especie || !pet.descricao || !pet.temperamento) {
      setStatus('status-sistema', 'Preencha os campos obrigatórios do pet.', 'erro');
      return;
    }

    const idx = estado.animais.findIndex((item) => item.id === id);
    if (idx >= 0) {
      estado.animais[idx] = pet;
      setStatus('status-sistema', 'Pet atualizado com sucesso.', 'ok');
    } else {
      estado.animais.unshift(pet);
      setStatus('status-sistema', 'Pet cadastrado com sucesso.', 'ok');
    }

    salvarEstado();
    renderDashboardSistema();
    renderListaGestaoPets();
    renderPainelOperacaoListas();
    resetForm();
    fecharCardSuspenso('modal-pet');
  });

  btnNovo?.addEventListener('click', () => {
    resetForm();
    abrirCardSuspenso('modal-pet');
  });

  document.getElementById('btn-cancelar')?.addEventListener('click', () => {
    resetForm();
    fecharCardSuspenso('modal-pet');
  });

  // Filtros de busca na lista
  const inputBusca = document.getElementById('filtro-admin-busca');
  const selectStatus = document.getElementById('filtro-admin-status');
  const aplicarFiltros = () => {
    const busca = (inputBusca?.value || '').toLowerCase();
    const status = selectStatus?.value || 'todos';
    document.querySelectorAll('#lista-animais-sistema article.item-gestao').forEach((article) => {
      const texto = article.textContent.toLowerCase();
      const statusOk = status === 'todos' || texto.includes(status.toLowerCase());
      const buscaOk = !busca || texto.includes(busca);
      article.style.display = statusOk && buscaOk ? '' : 'none';
    });
  };
  inputBusca?.addEventListener('input', aplicarFiltros);
  selectStatus?.addEventListener('change', aplicarFiltros);
  inputStatusAnimal?.addEventListener('change', sincronizarCamposAdotantePorStatus);

  const carregarPetNoForm = (petId) => {
    const pet = estado.animais.find((item) => item.id === petId);
    if (!pet) return;

    setInputValue('animal-id', pet.id);
    setInputValue('nome-animal', pet.nome);
    setInputValue('especie-animal', pet.especie);
    setInputValue('idade-animal', pet.idade);
    setInputValue('porte-animal', pet.porte);
    setInputValue('sexo-animal', pet.sexo);
    setInputValue('status-animal', normalizarStatus(pet.status));
    setInputValue('energia-animal', pet.energia || 'Média');
    setInputValue('temperamento-animal', pet.temperamento || '');
    setInputValue('descricao-animal', pet.descricao || '');
    setInputValue('bairro-resgate', pet.bairroResgate || '');
    setInputValue('observacao-interna', pet.observacaoInterna || '');
    setInputValue('adotante', pet.adotante || '');
    setInputValue('telefone-adotante', pet.telefoneAdotante || '');

    const vacinado = document.getElementById('vacinado');
    const castrado = document.getElementById('castrado');
    if (vacinado) vacinado.checked = Boolean(pet.vacinado);
    if (castrado) castrado.checked = Boolean(pet.castrado);

    galeriaAtual = Array.isArray(pet.galeria) && pet.galeria.length ? [...pet.galeria] : [FALLBACK_FOTO];
    perfilIndexAtual = pet.fotoPerfilIndex ?? 0;

    aplicarAjusteNosControles(pet.fotoPerfilAjuste);
    renderGaleriaEdicao();
    atualizarPreviewPerfil();
    sincronizarCamposAdotantePorStatus();
    setText('titulo-form', `Editando ${pet.nome}`);
    abrirCardSuspenso('modal-pet');
  };

  const excluirPet = (petId) => {
    const pet = estado.animais.find((item) => item.id === petId);
    if (!pet) return;

    const confirmou = window.confirm(`Deseja remover o pet ${pet.nome}?`);
    if (!confirmou) return;

    estado.animais = estado.animais.filter((item) => item.id !== petId);
    salvarEstado();
    renderListaGestaoPets();
    renderDashboardSistema();
    renderPainelOperacaoListas();
    setStatus('status-sistema', 'Pet removido com sucesso.', 'ok');
  };

  window.__sistemaPets = { carregarPetNoForm, excluirPet };
  resetForm();
}

function renderListaGestaoPets() {
  const lista = document.getElementById('lista-animais-sistema');
  const qtd = document.getElementById('qtd-cadastrados');
  if (!lista) return; if (qtd) qtd.textContent = `${estado.animais.length} registros`;

  if (!estado.animais.length) {
    lista.innerHTML = `<div class="vazio">Nenhum pet cadastrado.</div>`;
    return;
  }

  lista.innerHTML = estado.animais
    .map(
      (pet) => `
      <article class="item-gestao">
        <img src="${fotoPerfilDoPet(pet)}" alt="${pet.nome}" />
        <div>
          <h4>${pet.nome}</h4>
          <p>${pet.especie} • ${pet.idade} anos • ${pet.porte} • ${pet.status}</p>
          <p>${pet.temperamento}</p>
          <div class="item-acoes">
            <button class="mini-btn" type="button" data-editar-pet="${pet.id}">Editar</button>
            <button class="mini-btn remover" type="button" data-excluir-pet="${pet.id}">Excluir</button>
          </div>
        </div>
      </article>
    `,
    )
    .join('');

  lista.querySelectorAll('[data-editar-pet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-editar-pet');
      window.__sistemaPets?.carregarPetNoForm(id);
      const target = document.querySelector('[data-target="tab-animais"]');
      if (target instanceof HTMLButtonElement) {
        target.click();
      }
    });
  });

  lista.querySelectorAll('[data-excluir-pet]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-excluir-pet');
      window.__sistemaPets?.excluirPet(id);
    });
  });
}

function renderDashboardSistema() {
  const total = estado.animais.length;
  const disponiveis = estado.animais.filter((p) => p.status === 'disponivel' || p.status === 'disponível').length;
  const adotados = estado.animais.filter((p) => p.status === 'adotado').length;
  const pedidos = estado.interesses.filter((item) => {
    const etapa = normalizarEtapaFluxo(item.statusAtendimento, 'interesse');
    return etapa !== 'concluido' && etapa !== 'arquivado';
  }).length;

  setText('dash-total-pets', String(total));
  setText('dash-disponiveis', String(disponiveis));
  setText('dash-adotados', String(adotados));
  setText('dash-pedidos', String(pedidos));
  renderListaHistoriasAdocaoSistema();

  // Gráfico mensal com Chart.js
  const canvas = document.getElementById('grafico-dashboard');
  if (canvas && window.Chart) {
    const ctx = canvas.getContext('2d');
    if (canvas._chartInstance) canvas._chartInstance.destroy();

    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const agora = new Date();
    const labels = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(agora.getFullYear(), agora.getMonth() - 5 + i, 1);
      return meses[d.getMonth()];
    });

    const contarPorMes = (lista, campo) => labels.map((_, i) => {
      const d = new Date(agora.getFullYear(), agora.getMonth() - 5 + i, 1);
      return lista.filter((item) => {
        const dt = new Date(item[campo] || item.criadoEm || 0);
        return dt.getFullYear() === d.getFullYear() && dt.getMonth() === d.getMonth();
      }).length;
    });

    canvas._chartInstance = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Resgates', data: contarPorMes(estado.animais, 'atualizadoEm'), backgroundColor: 'rgba(82,178,207,0.7)', borderRadius: 6 },
          { label: 'Adoções', data: contarPorMes(estado.animais.filter((p) => p.status === 'adotado'), 'atualizadoEm'), backgroundColor: 'rgba(255,112,150,0.7)', borderRadius: 6 },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } },
    });
  }

  renderPainelOperacaoListas();
}

function configurarPainelOperacao() {
  const btnRejeitar = document.getElementById('btn-rejeitar-dados');
  btnRejeitar?.addEventListener('click', () => {
    const confirmou = window.confirm('ATENÇÃO: Isso apagará TODOS os dados e restaurará o banco padrão. Continuar?');
    if (!confirmou) return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
    window.location.reload();
  });

  configurarFluxoAtendimentoSistema();
  renderPainelOperacaoListas();
}

function configurarFluxoAtendimentoSistema() {
  const pares = [
    ['filtro-interesse-busca', 'input'],
    ['filtro-interesse-status', 'change'],
    ['filtro-interesse-prioridade', 'change'],
    ['filtro-denuncia-busca', 'input'],
    ['filtro-denuncia-status', 'change'],
    ['filtro-denuncia-prioridade', 'change'],
  ];

  pares.forEach(([id, evento]) => {
    const el = document.getElementById(id);
    if (!el || el.dataset.fluxoConfigurado === 'true') return;
    el.dataset.fluxoConfigurado = 'true';
    el.addEventListener(evento, () => renderPainelOperacaoListas());
  });
}

function garantirCamposFluxoAtendimento() {
  let alterou = false;

  estado.interesses.forEach((item) => {
    const etapa = normalizarEtapaFluxo(item.statusAtendimento, 'interesse');
    const prioridade = normalizarPrioridadeFluxo(item.prioridadeAtendimento);
    if (item.statusAtendimento !== etapa) {
      item.statusAtendimento = etapa;
      alterou = true;
    }
    if (item.prioridadeAtendimento !== prioridade) {
      item.prioridadeAtendimento = prioridade;
      alterou = true;
    }
  });

  estado.denuncias.forEach((item) => {
    const etapa = normalizarEtapaFluxo(item.statusAtendimento, 'denuncia');
    const prioridade = normalizarPrioridadeFluxo(item.prioridadeAtendimento);
    if (item.statusAtendimento !== etapa) {
      item.statusAtendimento = etapa;
      alterou = true;
    }
    if (item.prioridadeAtendimento !== prioridade) {
      item.prioridadeAtendimento = prioridade;
      alterou = true;
    }
  });

  if (alterou) salvarEstado();
}

function renderResumoFluxo(idAlvo, lista, tipo) {
  const alvo = document.getElementById(idAlvo);
  if (!alvo) return;

  const etapas = tipo === 'interesse' ? ETAPAS_INTERESSE : ETAPAS_DENUNCIA;
  const chips = etapas
    .map((etapa) => {
      const qtd = lista.filter((item) => normalizarEtapaFluxo(item.statusAtendimento, tipo) === etapa).length;
      return `<span class="fluxo-chip">${rotuloEtapaFluxo(etapa)}: <strong>${qtd}</strong></span>`;
    })
    .join('');

  alvo.innerHTML = `<div class="resumo-fluxo-linha">${chips}</div>`;
}

function renderPainelOperacaoListas() {
  garantirCamposFluxoAtendimento();
  renderListaInteresses('lista-interesses-sistema');
  renderListaDenuncias('lista-denuncias-sistema');
}

function renderListaInteresses(idAlvo) {
  const alvo = document.getElementById(idAlvo);
  if (!alvo) return;

  const busca = inputValue('filtro-interesse-busca').toLowerCase();
  const etapaFiltro = normalizarEtapaFluxo(inputValue('filtro-interesse-status') || 'novo', 'interesse');
  const prioridadeFiltro = normalizarPrioridadeFluxo(inputValue('filtro-interesse-prioridade') || 'media');
  const filtrarPorEtapa = inputValue('filtro-interesse-status') && inputValue('filtro-interesse-status') !== 'todos';
  const filtrarPorPrioridade = inputValue('filtro-interesse-prioridade') && inputValue('filtro-interesse-prioridade') !== 'todas';

  const interessesOrdenados = ordenarFluxoPorPrioridadeESla(estado.interesses);
  const filtrados = interessesOrdenados.filter((item) => {
    const bag = [item.nome, item.petNome, item.cidade, item.whatsapp, item.email, item.mensagem].join(' ').toLowerCase();
    const bateBusca = !busca || bag.includes(busca);
    const etapaAtual = normalizarEtapaFluxo(item.statusAtendimento, 'interesse');
    const prioridadeAtual = normalizarPrioridadeFluxo(item.prioridadeAtendimento);
    const bateEtapa = !filtrarPorEtapa || etapaAtual === etapaFiltro;
    const batePrioridade = !filtrarPorPrioridade || prioridadeAtual === prioridadeFiltro;
    return bateBusca && bateEtapa && batePrioridade;
  });

  const badge = document.getElementById('qtd-interesses');
  if (badge) badge.textContent = `${filtrados.length}/${estado.interesses.length} no fluxo`;

  renderResumoFluxo('resumo-interesses', interessesOrdenados, 'interesse');

  if (!filtrados.length) {
    alvo.innerHTML = `<div class="vazio">Nenhum interesse registrado ainda.</div>`;
    return;
  }

  alvo.innerHTML = filtrados
    .map(
      (item) => `
      <article class="blog-item fluxo-item">
        <div class="fluxo-topo">
          <h4>${item.nome} • ${item.petNome || 'Pet não identificado'}</h4>
          <div class="fluxo-topo-tags">
            <span class="fluxo-prioridade prioridade-${slugStatus(normalizarPrioridadeFluxo(item.prioridadeAtendimento))}">${rotuloPrioridadeFluxo(normalizarPrioridadeFluxo(item.prioridadeAtendimento))}</span>
            <span class="fluxo-status status-${slugStatus(normalizarEtapaFluxo(item.statusAtendimento, 'interesse'))}">${rotuloEtapaFluxo(normalizarEtapaFluxo(item.statusAtendimento, 'interesse'))}</span>
          </div>
        </div>
        <p class="texto-suave">Protocolo ${item.id} • ${formatarData(item.criadoEm)} • <span class="fluxo-sla">${tempoAbertoHumano(item.criadoEm)}</span></p>
        <p>${item.cidade} • ${item.whatsapp} • ${item.email}</p>
        <p>${item.mensagem}</p>
        <div class="item-acoes fluxo-acoes">
          <select class="fluxo-select" data-status-interesse="${item.id}">
            ${ETAPAS_INTERESSE.map((etapa) => `<option value="${etapa}" ${normalizarEtapaFluxo(item.statusAtendimento, 'interesse') === etapa ? 'selected' : ''}>${rotuloEtapaFluxo(etapa)}</option>`).join('')}
          </select>
          <select class="fluxo-select" data-prioridade-interesse="${item.id}">
            ${PRIORIDADES_FLUXO.map((prioridade) => `<option value="${prioridade}" ${normalizarPrioridadeFluxo(item.prioridadeAtendimento) === prioridade ? 'selected' : ''}>Prioridade ${rotuloPrioridadeFluxo(prioridade)}</option>`).join('')}
          </select>
          <button class="mini-btn remover" type="button" data-arquivar-interesse="${item.id}">Arquivar</button>
        </div>
      </article>
    `,
    )
    .join('');

  alvo.querySelectorAll('[data-status-interesse]').forEach((el) => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-status-interesse');
      const item = estado.interesses.find((registro) => registro.id === id);
      if (!item) return;
      item.statusAtendimento = normalizarEtapaFluxo(el.value, 'interesse');
      salvarEstado();
      renderPainelOperacaoListas();
      renderDashboardSistema();
      setStatus('status-interesses-admin', 'Etapa do pedido atualizada com sucesso.', 'ok');
    });
  });

  alvo.querySelectorAll('[data-arquivar-interesse]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-arquivar-interesse');
      const item = estado.interesses.find((registro) => registro.id === id);
      if (!item) return;
      item.statusAtendimento = 'arquivado';
      salvarEstado();
      renderPainelOperacaoListas();
      renderDashboardSistema();
      setStatus('status-interesses-admin', 'Pedido arquivado.', 'ok');
    });
  });

  alvo.querySelectorAll('[data-prioridade-interesse]').forEach((el) => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-prioridade-interesse');
      const item = estado.interesses.find((registro) => registro.id === id);
      if (!item) return;
      item.prioridadeAtendimento = normalizarPrioridadeFluxo(el.value);
      salvarEstado();
      renderPainelOperacaoListas();
      setStatus('status-interesses-admin', 'Prioridade do pedido atualizada.', 'ok');
    });
  });
}

function renderListaDenuncias(idAlvo) {
  const alvo = document.getElementById(idAlvo);
  if (!alvo) return;

  const busca = inputValue('filtro-denuncia-busca').toLowerCase();
  const etapaFiltro = normalizarEtapaFluxo(inputValue('filtro-denuncia-status') || 'nova', 'denuncia');
  const prioridadeFiltro = normalizarPrioridadeFluxo(inputValue('filtro-denuncia-prioridade') || 'media');
  const filtrarPorEtapa = inputValue('filtro-denuncia-status') && inputValue('filtro-denuncia-status') !== 'todos';
  const filtrarPorPrioridade = inputValue('filtro-denuncia-prioridade') && inputValue('filtro-denuncia-prioridade') !== 'todas';

  const denunciasOrdenadas = ordenarFluxoPorPrioridadeESla(estado.denuncias);
  const filtradas = denunciasOrdenadas.filter((item) => {
    const bag = [item.local, item.descricao, item.contato].join(' ').toLowerCase();
    const bateBusca = !busca || bag.includes(busca);
    const etapaAtual = normalizarEtapaFluxo(item.statusAtendimento, 'denuncia');
    const prioridadeAtual = normalizarPrioridadeFluxo(item.prioridadeAtendimento);
    const bateEtapa = !filtrarPorEtapa || etapaAtual === etapaFiltro;
    const batePrioridade = !filtrarPorPrioridade || prioridadeAtual === prioridadeFiltro;
    return bateBusca && bateEtapa && batePrioridade;
  });

  const badge = document.getElementById('qtd-denuncias');
  if (badge) badge.textContent = `${filtradas.length}/${estado.denuncias.length} no fluxo`;

  renderResumoFluxo('resumo-denuncias', denunciasOrdenadas, 'denuncia');

  if (!filtradas.length) {
    alvo.innerHTML = `<div class="vazio">Nenhuma denúncia registrada ainda.</div>`;
    return;
  }

  alvo.innerHTML = filtradas
    .map(
      (item) => `
      <article class="blog-item fluxo-item">
        <div class="fluxo-topo">
          <h4>${item.local}</h4>
          <div class="fluxo-topo-tags">
            <span class="fluxo-prioridade prioridade-${slugStatus(normalizarPrioridadeFluxo(item.prioridadeAtendimento))}">${rotuloPrioridadeFluxo(normalizarPrioridadeFluxo(item.prioridadeAtendimento))}</span>
            <span class="fluxo-status status-${slugStatus(normalizarEtapaFluxo(item.statusAtendimento, 'denuncia'))}">${rotuloEtapaFluxo(normalizarEtapaFluxo(item.statusAtendimento, 'denuncia'))}</span>
          </div>
        </div>
        <p>${item.descricao}</p>
        <p class="texto-suave">Contato: ${item.contato || 'Anônimo'} • ${formatarData(item.criadoEm)} • Protocolo ${item.id} • <span class="fluxo-sla">${tempoAbertoHumano(item.criadoEm)}</span></p>
        <div class="item-acoes fluxo-acoes">
          <select class="fluxo-select" data-status-denuncia="${item.id}">
            ${ETAPAS_DENUNCIA.map((etapa) => `<option value="${etapa}" ${normalizarEtapaFluxo(item.statusAtendimento, 'denuncia') === etapa ? 'selected' : ''}>${rotuloEtapaFluxo(etapa)}</option>`).join('')}
          </select>
          <select class="fluxo-select" data-prioridade-denuncia="${item.id}">
            ${PRIORIDADES_FLUXO.map((prioridade) => `<option value="${prioridade}" ${normalizarPrioridadeFluxo(item.prioridadeAtendimento) === prioridade ? 'selected' : ''}>Prioridade ${rotuloPrioridadeFluxo(prioridade)}</option>`).join('')}
          </select>
          <button class="mini-btn" type="button" data-resolver-denuncia="${item.id}">Marcar resolvida</button>
        </div>
      </article>
    `,
    )
    .join('');

  alvo.querySelectorAll('[data-status-denuncia]').forEach((el) => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-status-denuncia');
      const item = estado.denuncias.find((registro) => registro.id === id);
      if (!item) return;
      item.statusAtendimento = normalizarEtapaFluxo(el.value, 'denuncia');
      salvarEstado();
      renderPainelOperacaoListas();
      setStatus('status-denuncias-admin', 'Etapa da denúncia atualizada com sucesso.', 'ok');
    });
  });

  alvo.querySelectorAll('[data-resolver-denuncia]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-resolver-denuncia');
      const item = estado.denuncias.find((registro) => registro.id === id);
      if (!item) return;
      item.statusAtendimento = 'resolvida';
      salvarEstado();
      renderPainelOperacaoListas();
      setStatus('status-denuncias-admin', 'Denúncia marcada como resolvida.', 'ok');
    });
  });

  alvo.querySelectorAll('[data-prioridade-denuncia]').forEach((el) => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-prioridade-denuncia');
      const item = estado.denuncias.find((registro) => registro.id === id);
      if (!item) return;
      item.prioridadeAtendimento = normalizarPrioridadeFluxo(el.value);
      salvarEstado();
      renderPainelOperacaoListas();
      setStatus('status-denuncias-admin', 'Prioridade da denúncia atualizada.', 'ok');
    });
  });
}

function configurarHistoriasAdocaoSistema() {
  const lista = document.getElementById('lista-historias-adocao');
  if (!lista) return;

  const busca = document.getElementById('filtro-historia-busca');
  if (busca && busca.dataset.historiasConfigurado !== 'true') {
    busca.dataset.historiasConfigurado = 'true';
    busca.addEventListener('input', () => renderListaHistoriasAdocaoSistema());
  }

  const botoesAba = [...document.querySelectorAll('[data-historias-aba]')];
  if (!sessionStorage.getItem(SESSION_KEYS.historiasAba)) {
    sessionStorage.setItem(SESSION_KEYS.historiasAba, 'nao-postados');
  }
  botoesAba.forEach((botao) => {
    if (!(botao instanceof HTMLButtonElement) || botao.dataset.historiasAbaConfigurado === 'true') return;
    botao.dataset.historiasAbaConfigurado = 'true';
    botao.addEventListener('click', () => {
      const aba = botao.getAttribute('data-historias-aba') || 'nao-postados';
      sessionStorage.setItem(SESSION_KEYS.historiasAba, aba);
      renderListaHistoriasAdocaoSistema();
    });
  });

  renderListaHistoriasAdocaoSistema();
}

function renderListaHistoriasAdocaoSistema() {
  const lista = document.getElementById('lista-historias-adocao');
  const badge = document.getElementById('qtd-historias');
  if (!lista) return;

  const abaAtual = sessionStorage.getItem(SESSION_KEYS.historiasAba) || 'nao-postados';
  const ehAbaPostados = abaAtual === 'postados';

  document.querySelectorAll('[data-historias-aba]').forEach((el) => {
    if (!(el instanceof HTMLButtonElement)) return;
    const ativo = el.getAttribute('data-historias-aba') === abaAtual;
    el.classList.toggle('ativo', ativo);
    el.setAttribute('aria-selected', ativo ? 'true' : 'false');
  });

  const adotados = estado.animais
    .filter((pet) => normalizarStatus(pet.status) === 'adotado')
    .sort((a, b) => new Date(b.atualizadoEm || 0).getTime() - new Date(a.atualizadoEm || 0).getTime());

  const busca = inputValue('filtro-historia-busca').toLowerCase();

  const filtrados = adotados.filter((pet) => {
    const estaPostado = Boolean(pet.historiaPublicado);
    if (ehAbaPostados && !estaPostado) return false;
    if (!ehAbaPostados && estaPostado) return false;

    const historia = String(pet.historiaAdocao || '').trim();
    const titulo = String(pet.historiaTitulo || '').trim();
    const bag = [pet.nome, pet.adotante, pet.descricao, titulo, historia].join(' ').toLowerCase();
    const bateBusca = !busca || bag.includes(busca);
    return bateBusca;
  });

  if (badge) {
    const rotulo = ehAbaPostados ? 'postados' : 'não postados';
    badge.textContent = `${filtrados.length}/${adotados.length} ${rotulo}`;
  }

  if (!adotados.length) {
    lista.innerHTML = `<div class="vazio">Nenhum pet marcado como adotado ainda.</div>`;
    return;
  }

  if (!filtrados.length) {
    lista.innerHTML = `<div class="vazio">Nenhum registro na aba ${ehAbaPostados ? 'Postados' : 'Não postados'} para o filtro atual.</div>`;
    return;
  }

  lista.innerHTML = filtrados
    .map(
      (pet) => `
      <article class="item-gestao historia-item">
        <img src="${fotoPerfilDoPet(pet)}" alt="${escaparHtml(pet.nome || 'Pet adotado')}" />
        <div class="historia-conteudo">
          <div class="historia-topo">
            <h4>${escaparHtml(pet.nome || 'Pet sem nome')} • ${escaparHtml(pet.adotante || 'Adotante não informado')}</h4>
            <span class="historia-publicacao ${pet.historiaPublicado ? 'postado' : 'nao-postado'}">${pet.historiaPublicado ? 'Postado' : 'Não postado'}</span>
          </div>
          <p class="texto-suave">Adotado em ${formatarData(pet.atualizadoEm || pet.criadoEm)} • ID ${escaparHtml(pet.id)}</p>
          <p class="texto-suave historia-meta-linha">Postado em: ${pet.historiaPublicadoEm ? formatarData(pet.historiaPublicadoEm) : '—'} • Última edição: ${pet.historiaAtualizadoEm ? formatarData(pet.historiaAtualizadoEm) : '—'}</p>
          <input type="text" class="historia-titulo-input" data-historia-titulo="${pet.id}" placeholder="Título da história no site" value="${escaparHtml(pet.historiaTitulo || '')}">
          <textarea class="historia-textarea" data-historia-texto="${pet.id}" rows="4" placeholder="Ex: A Luna chegou com medo, mas em duas semanas já dormia no sofá e brincava com as crianças.">${escaparHtml(pet.historiaAdocao || '')}</textarea>
          <div class="item-acoes historia-acoes">
            <button class="mini-btn" type="button" data-salvar-historia="${pet.id}">Salvar edição</button>
            <button class="mini-btn" type="button" data-toggle-publicacao-historia="${pet.id}">${pet.historiaPublicado ? 'Remover do site' : 'Postar no site'}</button>
            <button class="mini-btn" type="button" data-editar-pet-historia="${pet.id}">Abrir cadastro do pet</button>
            <button class="mini-btn remover" type="button" data-limpar-historia="${pet.id}">Limpar texto</button>
          </div>
        </div>
      </article>
    `,
    )
    .join('');

  lista.querySelectorAll('[data-salvar-historia]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-salvar-historia');
      const pet = estado.animais.find((item) => item.id === id);
      const campo = lista.querySelector(`[data-historia-texto="${id}"]`);
      const campoTitulo = lista.querySelector(`[data-historia-titulo="${id}"]`);
      if (!pet || !(campo instanceof HTMLTextAreaElement) || !(campoTitulo instanceof HTMLInputElement)) return;

      const historia = campo.value.trim();
      const titulo = campoTitulo.value.trim();

      pet.historiaAdocao = historia;
      pet.historiaTitulo = titulo;
      pet.historiaAtualizadoEm = new Date().toISOString();
      pet.atualizadoEm = new Date().toISOString();
      salvarEstado();
      renderListaHistoriasAdocaoSistema();
      renderTestemunhosProjeto();
      setStatus('status-historias-admin', 'Edição da história salva com sucesso.', 'ok');
    });
  });

  lista.querySelectorAll('[data-toggle-publicacao-historia]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-toggle-publicacao-historia');
      const pet = estado.animais.find((item) => item.id === id);
      const campo = lista.querySelector(`[data-historia-texto="${id}"]`);
      const campoTitulo = lista.querySelector(`[data-historia-titulo="${id}"]`);
      if (!pet || !(campo instanceof HTMLTextAreaElement) || !(campoTitulo instanceof HTMLInputElement)) return;

      if (pet.historiaPublicado) {
        pet.historiaPublicado = false;
        pet.historiaAtualizadoEm = new Date().toISOString();
        pet.historiaPublicadoEm = '';
        pet.atualizadoEm = new Date().toISOString();
        salvarEstado();
        renderListaHistoriasAdocaoSistema();
        renderTestemunhosProjeto();
        setStatus('status-historias-admin', 'História removida do site. Ela não aparece mais na página pública.', 'ok');
        return;
      }

      const historia = campo.value.trim();
      const tituloDigitado = campoTitulo.value.trim();
      const tituloPadrao = `${pet.nome || 'Pet'} encontrou um lar cheio de amor`;

      if (!String(pet.adotante || '').trim()) {
        setStatus('status-historias-admin', 'Antes de postar, informe o nome do adotante no cadastro do pet.', 'erro');
        return;
      }

      if (!historia) {
        setStatus('status-historias-admin', 'Antes de postar, escreva a história de adoção.', 'erro');
        return;
      }

      pet.historiaAdocao = historia;
      pet.historiaTitulo = tituloDigitado || tituloPadrao;
      pet.historiaPublicado = true;
      pet.historiaAtualizadoEm = new Date().toISOString();
      pet.historiaPublicadoEm = new Date().toISOString();
      pet.atualizadoEm = new Date().toISOString();
      salvarEstado();
      renderListaHistoriasAdocaoSistema();
      renderTestemunhosProjeto();
      setStatus('status-historias-admin', 'História postada com sucesso e publicada no site.', 'ok');
    });
  });

  lista.querySelectorAll('[data-limpar-historia]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-limpar-historia');
      const pet = estado.animais.find((item) => item.id === id);
      if (!pet) return;

      pet.historiaAdocao = '';
      pet.historiaTitulo = '';
      pet.historiaPublicado = false;
      pet.historiaPublicadoEm = '';
      pet.historiaAtualizadoEm = new Date().toISOString();
      pet.atualizadoEm = new Date().toISOString();
      salvarEstado();
      renderListaHistoriasAdocaoSistema();
      renderTestemunhosProjeto();
      setStatus('status-historias-admin', 'Texto limpo e história removida do site.', 'ok');
    });
  });

  lista.querySelectorAll('[data-editar-pet-historia]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-editar-pet-historia');
      window.__sistemaPets?.carregarPetNoForm(id);
      const aba = document.querySelector('[data-target="tab-animais"]');
      if (aba instanceof HTMLButtonElement) aba.click();
    });
  });
}

function configurarBlogSistema() {
  const form = document.getElementById('form-blog');
  const btnNovo = document.getElementById('btn-novo-post');
  const inputCapaArquivo = document.getElementById('blog-capa-arquivo');
  const nomeCapa = document.getElementById('blog-capa-nome');
  if (!form) return;

  let capaEdicaoAtual = '';

  const atualizarNomeCapa = (nomeArquivo = '', possuiCapaAtual = false) => {
    if (!nomeCapa) return;
    if (nomeArquivo) {
      nomeCapa.textContent = nomeArquivo;
      return;
    }
    nomeCapa.textContent = possuiCapaAtual ? 'Capa atual mantida' : 'Nenhum arquivo selecionado';
  };

  const lerArquivoComoDataUrl = (arquivo) =>
    new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(String(leitor.result || ''));
      leitor.onerror = () => reject(new Error('Falha ao ler o arquivo da capa.'));
      leitor.readAsDataURL(arquivo);
    });

  const carregarImagem = (src) =>
    new Promise((resolve, reject) => {
      const imagem = new Image();
      imagem.onload = () => resolve(imagem);
      imagem.onerror = () => reject(new Error('Arquivo de capa invalido.'));
      imagem.src = src;
    });

  const arquivoCapaParaDataUrl = async (arquivo) => {
    if (!arquivo || !String(arquivo.type || '').startsWith('image/')) {
      throw new Error('Selecione apenas arquivos de imagem para a capa.');
    }

    const dataUrlOriginal = await lerArquivoComoDataUrl(arquivo);
    const imagem = await carregarImagem(dataUrlOriginal);
    const maxLado = 1600;
    const escala = Math.min(1, maxLado / Math.max(imagem.width, imagem.height));

    if (escala === 1 && arquivo.size <= 950 * 1024) {
      return dataUrlOriginal;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(imagem.width * escala));
    canvas.height = Math.max(1, Math.round(imagem.height * escala));

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Nao foi possivel processar a capa selecionada.');
    }

    ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.86);
  };

  const reset = () => {
    form.reset();
    setInputValue('blog-id', '');
    capaEdicaoAtual = '';
    atualizarNomeCapa('', false);
    setInputValue('blog-autor', readSessionUser()?.nome || 'Equipe Canil de Vilhena');
    const publicado = document.getElementById('blog-publicado');
    if (publicado) publicado.checked = true;
    setText('titulo-form-blog', 'Novo post');
    setStatus('status-blog', '', 'limpo');
  };

  if (inputCapaArquivo && inputCapaArquivo.dataset.nomeConfigurado !== 'true') {
    inputCapaArquivo.dataset.nomeConfigurado = 'true';
    inputCapaArquivo.addEventListener('change', () => {
      const nomeArquivo = inputCapaArquivo.files?.[0]?.name || '';
      atualizarNomeCapa(nomeArquivo, Boolean(capaEdicaoAtual));
    });
  }

  btnNovo?.addEventListener('click', () => {
    reset();
    abrirCardSuspenso('modal-blog');
  });

  document.getElementById('btn-cancelar-blog')?.addEventListener('click', () => {
    reset();
    fecharCardSuspenso('modal-blog');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let capaProcessada = capaEdicaoAtual;
    const arquivoSelecionado = inputCapaArquivo?.files?.[0] || null;
    if (arquivoSelecionado) {
      try {
        capaProcessada = await arquivoCapaParaDataUrl(arquivoSelecionado);
      } catch (erro) {
        setStatus('status-blog', 'Nao foi possivel processar a imagem de capa selecionada.', 'erro');
        return;
      }
    }

    const id = inputValue('blog-id') || `post-${crypto.randomUUID()}`;
    const post = {
      id,
      titulo: inputValue('blog-titulo'),
      categoria: inputValue('blog-categoria'),
      autor: inputValue('blog-autor') || 'Equipe Canil de Vilhena',
      capa: capaProcessada,
      resumo: inputValue('blog-resumo'),
      conteudo: inputValue('blog-conteudo'),
      data: new Date().toISOString(),
      publicado: Boolean(document.getElementById('blog-publicado')?.checked),
    };

    if (!post.titulo || !post.categoria || !post.resumo || !post.conteudo) {
      setStatus('status-blog', 'Preencha título, categoria, resumo e conteúdo.', 'erro');
      return;
    }

    const idx = estado.posts.findIndex((item) => item.id === id);
    if (idx >= 0) {
      const dataOriginal = estado.posts[idx].data;
      estado.posts[idx] = { ...estado.posts[idx], ...post, data: dataOriginal };
      setStatus('status-blog', 'Post atualizado com sucesso.', 'ok');
    } else {
      estado.posts.unshift(post);
      setStatus('status-blog', 'Post criado com sucesso.', 'ok');
    }

    salvarEstado();
    renderListaBlogSistema();
    reset();
    fecharCardSuspenso('modal-blog');
  });

  renderListaBlogSistema();
  reset();
}

function renderListaBlogSistema() {
  const lista = document.getElementById('lista-blog-sistema');
  const qtd = document.getElementById('qtd-posts');
  if (!lista || !qtd) return;

  const postsOrdenados = [...estado.posts].sort((a, b) => new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime());
  qtd.textContent = `${postsOrdenados.length} posts`;

  if (!postsOrdenados.length) {
    lista.innerHTML = `<div class="vazio">Nenhum post cadastrado.</div>`;
    return;
  }

  lista.innerHTML = postsOrdenados
    .map(
      (post) => `
      <article class="blog-item">
        <h4>${post.titulo}</h4>
        <p>${post.categoria} • ${formatarData(post.data)} • ${post.publicado ? 'Publicado' : 'Rascunho'}</p>
        <p>${post.resumo}</p>
        <div class="item-acoes">
          <button class="mini-btn" type="button" data-editar-post="${post.id}">Editar</button>
          <button class="mini-btn remover" type="button" data-excluir-post="${post.id}">Excluir</button>
        </div>
      </article>
    `,
    )
    .join('');

  lista.querySelectorAll('[data-editar-post]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-editar-post');
      const post = estado.posts.find((item) => item.id === id);
      if (!post) return;

      setInputValue('blog-id', post.id);
      setInputValue('blog-titulo', post.titulo);
      setInputValue('blog-categoria', post.categoria);
      setInputValue('blog-autor', post.autor || 'Equipe Canil de Vilhena');
      capaEdicaoAtual = post.capa || '';
      atualizarNomeCapa('', Boolean(capaEdicaoAtual));
      setInputValue('blog-resumo', post.resumo || '');
      setInputValue('blog-conteudo', post.conteudo || '');
      const publicado = document.getElementById('blog-publicado');
      if (publicado) publicado.checked = post.publicado !== false;
      setText('titulo-form-blog', `Editando: ${post.titulo}`);
      abrirCardSuspenso('modal-blog');

      const aba = document.querySelector('[data-target="tab-blog"]');
      if (aba instanceof HTMLButtonElement) aba.click();
    });
  });

  lista.querySelectorAll('[data-excluir-post]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-excluir-post');
      const post = estado.posts.find((item) => item.id === id);
      if (!post) return;

      const confirmou = window.confirm(`Deseja excluir o post "${post.titulo}"?`);
      if (!confirmou) return;

      estado.posts = estado.posts.filter((item) => item.id !== id);
      salvarEstado();
      renderListaBlogSistema();
      setStatus('status-blog', 'Post excluído com sucesso.', 'ok');
    });
  });
}

function configurarUsuariosSistema() {
  const form = document.getElementById('form-usuario');
  if (!form) return;

  const reset = () => {
    form.reset();
    setStatus('status-usuario', '', 'limpo');
  };

  document.getElementById('btn-novo-usuario')?.addEventListener('click', () => {
    reset();
    abrirCardSuspenso('modal-usuario');
  });

  document.getElementById('btn-cancelar-usuario')?.addEventListener('click', () => {
    reset();
    fecharCardSuspenso('modal-usuario');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = inputValue('usuario-nome');
    const login = inputValue('usuario-login').toLowerCase();
    const perfil = inputValue('usuario-perfil');
    const senha = inputValue('usuario-senha');
    const confirmar = inputValue('usuario-senha-confirmar');

    if (!nome || !login || !perfil || !senha || !confirmar) {
      setStatus('status-usuario', 'Preencha todos os campos do usuário.', 'erro');
      return;
    }

    if (senha !== confirmar) {
      setStatus('status-usuario', 'As senhas não conferem.', 'erro');
      return;
    }

    if (senha.length < 6) {
      setStatus('status-usuario', 'A senha precisa ter ao menos 6 caracteres.', 'erro');
      return;
    }

    const existe = estado.usuarios.some((item) => item.login.toLowerCase() === login);
    if (existe) {
      setStatus('status-usuario', 'Já existe um usuário com esse login.', 'erro');
      return;
    }

    estado.usuarios.unshift({
      id: `usr-${crypto.randomUUID()}`,
      nome,
      login,
      perfil,
      senhaHash: encode(senha),
      ativo: true,
      criadoEm: new Date().toISOString(),
    });

    salvarEstado();
    reset();
    setStatus('status-usuario', 'Usuário cadastrado com sucesso.', 'ok');
    renderListaUsuariosSistema();
    fecharCardSuspenso('modal-usuario');
  });

  renderListaUsuariosSistema();
}

function renderListaUsuariosSistema() {
  const lista = document.getElementById('lista-usuarios');
  const qtd = document.getElementById('qtd-usuarios');
  if (!lista || !qtd) return;

  qtd.textContent = `${estado.usuarios.length} usuários`;

  if (!estado.usuarios.length) {
    lista.innerHTML = `<div class="vazio">Nenhum usuário cadastrado.</div>`;
    return;
  }

  lista.innerHTML = estado.usuarios
    .map((usuario) => {
      const iniciais = usuario.nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((item) => item[0])
        .join('')
        .toUpperCase();

      return `
        <article class="item-gestao">
          <div class="avatar-usuario">${iniciais || 'U'}</div>
          <div>
            <h4>${usuario.nome}</h4>
            <p>${usuario.login} • ${usuario.perfil} • ${usuario.ativo ? 'Ativo' : 'Inativo'}</p>
            <p class="texto-suave">Criado em ${formatarData(usuario.criadoEm)}</p>
            <div class="item-acoes">
              <button class="mini-btn" type="button" data-toggle-usuario="${usuario.id}">
                ${usuario.ativo ? 'Inativar' : 'Ativar'}
              </button>
              <button class="mini-btn" type="button" data-reset-usuario="${usuario.id}">Resetar senha</button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  lista.querySelectorAll('[data-toggle-usuario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-toggle-usuario');
      const usuario = estado.usuarios.find((item) => item.id === id);
      if (!usuario) return;

      usuario.ativo = !usuario.ativo;
      salvarEstado();
      renderListaUsuariosSistema();
    });
  });

  lista.querySelectorAll('[data-reset-usuario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-reset-usuario');
      const usuario = estado.usuarios.find((item) => item.id === id);
      if (!usuario) return;

      usuario.senhaHash = encode('123456');
      salvarEstado();
      setStatus('status-usuario', `Senha de ${usuario.login} redefinida para 123456.`, 'ok');
    });
  });
}

function readSessionUser() {
  try {
    const bruto = sessionStorage.getItem(SESSION_KEYS.usuario);
    if (!bruto) return null;
    return JSON.parse(bruto);
  } catch {
    return null;
  }
}

function setStatus(id, mensagem, tipo = 'ok') {
  const el = document.getElementById(id);
  if (!el) return;

  const texto = String(mensagem || '').trim();
  if (tipo === 'limpo' || !texto) {
    el.textContent = '';
    el.className = '';
    el.removeAttribute('role');
    return;
  }

  el.textContent = texto;
  el.className = 'status-mensagem';
  if (tipo === 'erro') {
    el.classList.add('status-erro');
  } else if (tipo === 'aviso') {
    el.classList.add('status-aviso');
  } else {
    el.classList.add('status-ok');
  }
  el.setAttribute('role', 'status');
}

function inputValue(id) {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) {
    return '';
  }
  return String(el.value || '').trim();
}

function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) {
    return;
  }
  el.value = value == null ? '' : String(value);
}

function setText(id, valor) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = String(valor);
}



function renderCarousel12() {
  const track = document.getElementById("slider-12-track");
  const dotsEl = document.getElementById('slider-12-dots');
  const prev = document.getElementById('slider-12-prev');
  const next = document.getElementById('slider-12-next');
  if (!track) return;
  
  const activePets = animaisPublicosDisponiveis();
  if (activePets.length === 0) {
    slider12TotalPets = 0;
    if (slider12Timer) clearInterval(slider12Timer);
    if (dotsEl) dotsEl.innerHTML = '';
    if (prev) prev.disabled = true;
    if (next) next.disabled = true;
    track.innerHTML = `<div class="vazio">Nenhum pet para exibir no momento.</div>`;
    return;
  }

  const MAX_CAROUSEL = 12;
  const SEGUNDOS_EM_UMA_SEMANA = 604800000;
  const hoje = new Date().getTime();

  let carouselInfo = JSON.parse(localStorage.getItem("pv_semana_pets_info_12")) || null; let jaMostrados = JSON.parse(localStorage.getItem("pv_pets_ja_mostrados_12")) || [];
  
  const activeIds = activePets.map(p => p.id);
  jaMostrados = jaMostrados.filter(id => activeIds.includes(id));

  if (!carouselInfo || (hoje - carouselInfo.inicioSemana) > SEGUNDOS_EM_UMA_SEMANA || !carouselInfo.petIds.every(id => activeIds.includes(id))) {
      let disponiveisParaSorteio = activePets.filter(p => !jaMostrados.includes(p.id));
      
      if (disponiveisParaSorteio.length < MAX_CAROUSEL) {
          jaMostrados = [];
          disponiveisParaSorteio = [...activePets];
      }
      
      const embaralhados = disponiveisParaSorteio.sort(() => 0.5 - Math.random());
      const selecionados = embaralhados.slice(0, MAX_CAROUSEL);
      
      const idsSelecionados = selecionados.map(p => p.id);
      
      carouselInfo = {
          inicioSemana: hoje,
          petIds: idsSelecionados
      };
      jaMostrados.push(...idsSelecionados);
      
      localStorage.setItem("pv_semana_pets_info_12", JSON.stringify(carouselInfo));
      localStorage.setItem("pv_pets_ja_mostrados_12", JSON.stringify(jaMostrados));
  }

  const pets = carouselInfo.petIds.map(id => activePets.find(p => p.id === id)).filter(Boolean);

  if (!pets.length) {
    slider12TotalPets = 0;
    if (slider12Timer) clearInterval(slider12Timer);
    if (dotsEl) dotsEl.innerHTML = '';
    if (prev) prev.disabled = true;
    if (next) next.disabled = true;
    track.innerHTML = `<div class="vazio">Nenhum pet para mostrar no momento.</div>`;
    return;
  }

  slider12TotalPets = pets.length;
  slider12Index = 0;
  track.style.transform = 'translateX(0)';

  track.innerHTML = pets.map(pet => {
    const foto = fotoPerfilDoPet(pet);
    const estilo = estiloFotoPerfil(pet);
    const filterStyle = `filter: ${estilo.filter}; transform: ${estilo.transform}; object-position: ${estilo.objectPosition};`;
    const corPorte = pet.porte === "Pequeno" ? "var(--secondary)" : pet.porte === "Médio" ? "var(--primary)" : "var(--tertiary)";
    
    return `
      <div class="slider-12-card">
        <div style="position: relative; overflow: hidden; height: 220px;">
          <img src="${foto}" alt="${pet.nome}" style="${filterStyle} width: 100%; height: 100%; object-fit: cover;">
          <span class="tag" style="position: absolute; top: 1rem; left: 1rem; background: ${corPorte}; color: #fff;">${pet.especie} &bull; ${pet.porte}</span>
        </div>
        <div class="slider-12-info">
          <h3>${pet.nome}</h3>
          <p>${pet.descricao ? pet.descricao.substring(0, 80) : "Um adorável animal buscando um lar."}...</p>
          <a href="${linkAdocao(pet.id)}" class="btn btn-principal" style="text-align: center; width: 100%; box-sizing: border-box;">Quero adotar</a>
        </div>
      </div>
    `;
  }).join("");

  atualizarSlider12Transform(pets.length);
  atualizarSlider12Controles(pets.length);
  iniciarAutoSlider12(pets.length);
}

let slider12Timer;
let slider12Index = 0;
let slider12TotalPets = 0;

function slider12CardsPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function slider12MaxIndex(totalPets) {
  const cardsPerView = slider12CardsPerView();
  return Math.max(0, Math.ceil(totalPets / cardsPerView) - 1);
}

function atualizarSlider12Transform(totalPets) {
  const track = document.getElementById('slider-12-track');
  if (!track) return;

  const maxIndex = slider12MaxIndex(totalPets);
  slider12Index = Math.min(slider12Index, maxIndex);

  if (maxIndex === 0) {
    track.style.transform = 'translateX(0)';
  } else {
    const translatePercentage = slider12Index * 100;
    const gapOffset = slider12Index * 1.5;
    track.style.transform = `translateX(calc(-${translatePercentage}% - ${gapOffset}rem))`;
  }
}

function atualizarSlider12Controles(totalPets) {
  const dotsEl = document.getElementById('slider-12-dots');
  const prev = document.getElementById('slider-12-prev');
  const next = document.getElementById('slider-12-next');
  const maxIndex = slider12MaxIndex(totalPets);
  const totalPaginas = maxIndex + 1;
  const desabilitar = totalPaginas <= 1;

  if (prev) {
    prev.disabled = desabilitar;
    prev.onclick = () => {
      slider12Index = slider12Index <= 0 ? maxIndex : slider12Index - 1;
      atualizarSlider12Transform(totalPets);
      atualizarSlider12Controles(totalPets);
      iniciarAutoSlider12(totalPets);
    };
  }

  if (next) {
    next.disabled = desabilitar;
    next.onclick = () => {
      slider12Index = slider12Index >= maxIndex ? 0 : slider12Index + 1;
      atualizarSlider12Transform(totalPets);
      atualizarSlider12Controles(totalPets);
      iniciarAutoSlider12(totalPets);
    };
  }

  if (dotsEl) {
    dotsEl.innerHTML = Array.from({ length: totalPaginas }, (_, index) => {
      const ativo = index === slider12Index ? 'ativo' : '';
      return `<button class="dot ${ativo}" data-slider12-dot="${index}" aria-label="Ir para página ${index + 1} do slider"></button>`;
    }).join('');

    dotsEl.querySelectorAll('[data-slider12-dot]').forEach((dot) => {
      dot.addEventListener('click', () => {
        slider12Index = Number(dot.getAttribute('data-slider12-dot'));
        atualizarSlider12Transform(totalPets);
        atualizarSlider12Controles(totalPets);
        iniciarAutoSlider12(totalPets);
      });
    });
  }
}

function iniciarAutoSlider12(totalPets) {
  if (slider12Timer) clearInterval(slider12Timer);
  const track = document.getElementById("slider-12-track");
  if (!track || totalPets <= 3) return;

  track.onmouseenter = () => {
    if (slider12Timer) clearInterval(slider12Timer);
  };
  track.onmouseleave = () => {
    iniciarAutoSlider12(totalPets);
  };

  slider12Timer = setInterval(() => {
    const maxIndex = slider12MaxIndex(totalPets);
    
    slider12Index++;
    if (slider12Index > maxIndex) {
      slider12Index = 0;
    }

    atualizarSlider12Transform(totalPets);
    atualizarSlider12Controles(totalPets);
  }, 4000);
}

window.addEventListener('resize', () => {
  const track = document.getElementById('slider-12-track');
  if (!track || !slider12TotalPets) return;
  atualizarSlider12Transform(slider12TotalPets);
  atualizarSlider12Controles(slider12TotalPets);
});










