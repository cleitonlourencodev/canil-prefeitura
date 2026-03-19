const STORAGE_KEYS = {
  animais: 'pv_animais',
  blog: 'pv_blog_posts',
  denuncias: 'pv_denuncias',
  interesses: 'pv_interesses_adocao',
  usuarios: 'pv_usuarios',
  auditoria: 'pv_auditoria_logs',
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
  auditoria: [],
};

let carouselIndex = 0;
let carouselTimer = null;
let depoimentoIndex = 0;
let depoimentoTimer = null;
let petDestinoId = null;
let blogPaginaAtual = 1;
let projetoPaginaAtual = 1;
let petsPaginaAtual = 1;
let auditoriaPaginaAtual = 1;
let rankingPaginaAtual = 1;

const CARDS_POR_PAGINA = 12;
const PETS_CARDS_POR_PAGINA = 24;
const AUDITORIA_LOGS_POR_PAGINA = 25;
const RANKING_PETS_POR_PAGINA = 10;

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

const SUPABASE_STORAGE_TABLE = 'app_storage';
const VOLATILE_PERSIST_KEYS = new Set([
  'canil_lembrar_login',
  'canil_lembrar_senha',
]);

const persistentStorageCache = new Map();
const sessionStorageCache = new Map();
let supabaseClient = null;

function getSupabaseConfig() {
  return window.CANIL_SUPABASE_CONFIG || null;
}

function canUseSupabase() {
  const config = getSupabaseConfig();
  return Boolean(
    config
    && typeof config.url === 'string'
    && typeof config.anonKey === 'string'
    && window.supabase
    && typeof window.supabase.createClient === 'function',
  );
}

const persistentStorage = {
  async init() {
    if (!canUseSupabase()) {
      console.warn('[Canil] Supabase não configurado. Persistência remota desativada.');
      return;
    }

    const config = getSupabaseConfig();
    supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabaseClient
      .from(SUPABASE_STORAGE_TABLE)
      .select('chave, valor');

    if (error) {
      console.error('[Canil] Falha ao carregar dados do Supabase:', error.message);
      return;
    }

    (data || []).forEach((item) => {
      persistentStorageCache.set(item.chave, String(item.valor ?? ''));
    });
  },

  getItem(chave) {
    const key = String(chave || '');
    return persistentStorageCache.has(key) ? persistentStorageCache.get(key) : null;
  },

  setItem(chave, valor) {
    const key = String(chave || '');
    const value = String(valor ?? '');
    persistentStorageCache.set(key, value);

    if (!supabaseClient || VOLATILE_PERSIST_KEYS.has(key)) return;

    void supabaseClient
      .from(SUPABASE_STORAGE_TABLE)
      .upsert({ chave: key, valor: value }, { onConflict: 'chave' })
      .then(({ error }) => {
        if (error) {
          console.error('[Canil] Falha ao salvar chave no Supabase:', key, error.message);
        }
      });
  },

  removeItem(chave) {
    const key = String(chave || '');
    persistentStorageCache.delete(key);

    if (!supabaseClient || VOLATILE_PERSIST_KEYS.has(key)) return;

    void supabaseClient
      .from(SUPABASE_STORAGE_TABLE)
      .delete()
      .eq('chave', key)
      .then(({ error }) => {
        if (error) {
          console.error('[Canil] Falha ao remover chave do Supabase:', key, error.message);
        }
      });
  },
};

const sessionStore = {
  getItem(chave) {
    const key = String(chave || '');
    return sessionStorageCache.has(key) ? sessionStorageCache.get(key) : null;
  },

  setItem(chave, valor) {
    const key = String(chave || '');
    sessionStorageCache.set(key, String(valor ?? ''));
  },

  removeItem(chave) {
    sessionStorageCache.delete(String(chave || ''));
  },
};

document.addEventListener('DOMContentLoaded', async () => {
  await persistentStorage.init();
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

  const pagina = window.location.pathname.split('/').pop() || 'index.html';
  if (pagina === 'pets.html' || pagina === 'blog.html' || pagina === 'sistema.html') {
    return;
  }

  const seletorAnimado = '.painel, .blog-item, .pet-post, .passo-card, .indicadores article, .secao-topo, .slider-12-card, .item-gestao';
  const animados = new WeakSet();

  const marcar = (raiz = document) => {
    raiz.querySelectorAll?.(seletorAnimado).forEach((el) => {
      if (animados.has(el)) return;
      el.classList.add('reveal-on-scroll');

      // Evita cards invisíveis ao abrir a página: se já está no viewport, revela na hora.
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const jaVisivel = rect.top < viewportH * 0.92 && rect.bottom > 0;

      if (jaVisivel) {
        el.classList.add('in-view');
      } else {
        observer.observe(el);
      }

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
  if (!persistentStorage.getItem(STORAGE_KEYS.animais)) {
    persistentStorage.setItem(STORAGE_KEYS.animais, JSON.stringify(seeds.animais));
  }
  if (!persistentStorage.getItem(STORAGE_KEYS.blog)) {
    persistentStorage.setItem(STORAGE_KEYS.blog, JSON.stringify(seeds.posts));
  }
  if (!persistentStorage.getItem(STORAGE_KEYS.denuncias)) {
    persistentStorage.setItem(STORAGE_KEYS.denuncias, JSON.stringify([]));
  }
  if (!persistentStorage.getItem(STORAGE_KEYS.interesses)) {
    persistentStorage.setItem(STORAGE_KEYS.interesses, JSON.stringify([]));
  }
  if (!persistentStorage.getItem(STORAGE_KEYS.usuarios)) {
    persistentStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(seeds.usuarios));
  }
  if (!persistentStorage.getItem(STORAGE_KEYS.auditoria)) {
    persistentStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify([]));
  }
}

function carregarEstado() {
  estado.animais = readJSON(STORAGE_KEYS.animais, []);
  estado.posts = readJSON(STORAGE_KEYS.blog, []);
  estado.denuncias = readJSON(STORAGE_KEYS.denuncias, []);
  estado.interesses = readJSON(STORAGE_KEYS.interesses, []);
  estado.usuarios = readJSON(STORAGE_KEYS.usuarios, []);
  estado.auditoria = readJSON(STORAGE_KEYS.auditoria, []);
  
  // Normalizar espécies de pets existentes
  normalizarEspeciePets();
}

function normalizarEspeciePets() {
  let houveMudanca = false;
  estado.animais.forEach((pet) => {
    if (pet.especie) {
      const especieAnterior = pet.especie;
      pet.especie = normalizarEspecie(pet.especie);
      if (especieAnterior !== pet.especie) {
        houveMudanca = true;
      }
    }
  });
  
  if (houveMudanca) {
    persistentStorage.setItem(STORAGE_KEYS.animais, JSON.stringify(estado.animais));
  }
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
  // (corrige dados corrompidos no persistentStorage de sessoes anteriores)
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
    persistentStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(estado.usuarios));
  }

  const jaMigrado = persistentStorage.getItem(STORAGE_KEYS.seedUpgradeV2) === '1';
  const jaMigradoV3 = persistentStorage.getItem(STORAGE_KEYS.seedUpgradeV3) === '1';
  const jaMigradoV4 = persistentStorage.getItem(STORAGE_KEYS.seedUpgradeV4) === '1';

  if (!jaMigrado) {
    estado.animais = mergeById(estado.animais, [...seeds.animais, ...extraSeeds.animais]);
    estado.posts = mergeById(estado.posts, [...seeds.posts, ...extraSeeds.posts]);
    estado.usuarios = mergeById(estado.usuarios, seeds.usuarios);
    persistentStorage.setItem(STORAGE_KEYS.seedUpgradeV2, '1');
  }

  if (!jaMigradoV3) {
    estado.animais = mergeById(estado.animais, flowSeeds.animais);
    estado.posts = mergeById(estado.posts, flowSeeds.posts);
    estado.interesses = mergeById(estado.interesses, flowSeeds.interesses);
    estado.denuncias = mergeById(estado.denuncias, flowSeeds.denuncias);
    persistentStorage.setItem(STORAGE_KEYS.seedUpgradeV3, '1');
  }

  if (!jaMigradoV4) {
    estado.animais = mergeById(estado.animais, testemunhoSeeds.animais);
    persistentStorage.setItem(STORAGE_KEYS.seedUpgradeV4, '1');
  }

  estado.posts = estado.posts.map((post) => ({
    autor: 'Equipe Canil de Vilhena',
    capa: '',
    conteudo: post.resumo || '',
    publicado: true,
    ...post,
  }));

  estado.usuarios = estado.usuarios.map((usuario) => ({
    ...usuario,
    cpf: normalizarCpf(usuario.cpf || ''),
    email: String(usuario.email || '').trim().toLowerCase(),
    contato: String(usuario.contato || '').trim(),
    login: String(usuario.login || '').trim().toLowerCase(),
  }));

  estado.animais = estado.animais.map((pet) => {
    const statusNormalizado = normalizarStatus(pet.status);
    const tituloHistoria = String(pet.historiaTitulo || '').trim();
    const textoHistoria = String(pet.historiaAdocao || '').trim();
    const criadoEm = String(pet.criadoEm || pet.atualizadoEm || new Date().toISOString());
    const adocaoEm = statusNormalizado === 'adotado'
      ? String(pet.adocaoEm || pet.atualizadoEm || criadoEm)
      : '';

    const atualizado = {
      ...pet,
      status: statusNormalizado,
      criadoEm,
      adocaoEm,
      historiaTitulo: tituloHistoria,
      historiaAdocao: textoHistoria,
      historiaPublicado: Boolean(pet.historiaPublicado),
      historiaPublicadoEm: pet.historiaPublicadoEm || '',
      historiaAtualizadoEm: pet.historiaAtualizadoEm || '',
    };

    if (statusNormalizado !== 'adotado') {
      atualizado.adotante = '';
      atualizado.telefoneAdotante = '';
      atualizado.adocaoEm = '';
      atualizado.historiaPublicado = false;
      atualizado.historiaPublicadoEm = '';
    }

    return atualizado;
  });

  salvarEstado();
}

function salvarEstado() {
  persistentStorage.setItem(STORAGE_KEYS.animais, JSON.stringify(estado.animais));
  persistentStorage.setItem(STORAGE_KEYS.blog, JSON.stringify(estado.posts));
  persistentStorage.setItem(STORAGE_KEYS.denuncias, JSON.stringify(estado.denuncias));
  persistentStorage.setItem(STORAGE_KEYS.interesses, JSON.stringify(estado.interesses));
  persistentStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(estado.usuarios));
  persistentStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify(estado.auditoria));
}

function readJSON(chave, padrao) {
  try {
    return JSON.parse(persistentStorage.getItem(chave) ?? JSON.stringify(padrao));
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

function formatarDataHora(valor) {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    return 'Data não informada';
  }
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

function escaparCsv(valor) {
  const texto = String(valor ?? '');
  const seguro = texto.replace(/"/g, '""');
  return `"${seguro}"`;
}

function registrarAuditoria({ acao = '', entidade = '', alvoId = '', detalhes = '', metadados = null } = {}) {
  if (!acao || !entidade) return;

  const usuario = readSessionUser() || obterUsuarioSessaoAtual() || null;
  const registro = {
    id: `audit-${crypto.randomUUID()}`,
    acao: String(acao).trim().toLowerCase(),
    entidade: String(entidade).trim().toLowerCase(),
    alvoId: String(alvoId || '').trim(),
    detalhes: String(detalhes || '').trim(),
    usuarioId: String(usuario?.id || '').trim(),
    usuarioNome: String(usuario?.nome || 'Site público').trim(),
    usuarioLogin: String(usuario?.login || 'site-publico').trim(),
    usuarioPerfil: String(usuario?.perfil || 'publico').trim().toLowerCase(),
    criadoEm: new Date().toISOString(),
    metadados: metadados && typeof metadados === 'object' ? metadados : null,
  };

  estado.auditoria = Array.isArray(estado.auditoria) ? estado.auditoria : [];
  estado.auditoria.unshift(registro);
  if (estado.auditoria.length > 1200) {
    estado.auditoria = estado.auditoria.slice(0, 1200);
  }

  persistentStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify(estado.auditoria));
  renderListaAuditoriaSistema();
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

function normalizarEspecie(especie) {
  const base = String(especie || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  if (base === 'cachorro' || base === 'cao') return 'cão';
  if (base === 'gato') return 'gato';
  return String(especie || '').toLowerCase().trim();
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

function normalizarCpf(valor) {
  return String(valor || '').replace(/\D/g, '');
}

function formatarCpf(valor) {
  const cpf = normalizarCpf(valor);
  if (cpf.length !== 11) return cpf || 'CPF não informado';
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
}

function validarCpf(valor) {
  const cpf = normalizarCpf(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digitoVerificador = (base, fatorInicial) => {
    let total = 0;
    for (let i = 0; i < base.length; i += 1) {
      total += Number(base[i]) * (fatorInicial - i);
    }
    const resto = (total * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = digitoVerificador(cpf.slice(0, 9), 10);
  const d2 = digitoVerificador(cpf.slice(0, 10), 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

function validarEmailBasico(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim().toLowerCase());
}

function formatarContato(valor) {
  const digitos = String(valor || '').replace(/\D/g, '');
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7, 11)}`;
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6, 10)}`;
  }
  return String(valor || '').trim() || 'Contato não informado';
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

  let carouselInfo = JSON.parse(persistentStorage.getItem('pv_semana_pets_info')) || null;
  let jaMostrados = JSON.parse(persistentStorage.getItem('pv_pets_ja_mostrados')) || [];
  
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
      
      persistentStorage.setItem('pv_semana_pets_info', JSON.stringify(carouselInfo));
      persistentStorage.setItem('pv_pets_ja_mostrados', JSON.stringify(jaMostrados));
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

    registrarAuditoria({
      acao: 'criar',
      entidade: 'denuncia',
      detalhes: `Denúncia registrada via site público: ${local}`,
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
    registrarAuditoria({
      acao: 'criar',
      entidade: 'interesse',
      alvoId: payload.id,
      detalhes: `Interesse de adoção enviado para ${pet.nome}.`,
    });
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
  const loginSalvo = persistentStorage.getItem('canil_lembrar_login');
  const senhaSalva = persistentStorage.getItem('canil_lembrar_senha');
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
      persistentStorage.setItem('canil_lembrar_login', login);
      persistentStorage.setItem('canil_lembrar_senha', encode(senha));
    } else {
      persistentStorage.removeItem('canil_lembrar_login');
      persistentStorage.removeItem('canil_lembrar_senha');
    }

    sessionStore.setItem(SESSION_KEYS.usuario, JSON.stringify(usuario));
    registrarAuditoria({
      acao: 'login',
      entidade: 'sistema',
      alvoId: usuario.id,
      detalhes: 'Login realizado no sistema interno.',
    });
    setStatus('status-login', 'Acesso liberado.', 'ok');
    renderSistemaAutenticado();
  });

  btnLogout?.addEventListener('click', () => {
    const usuarioSaindo = readSessionUser();
    if (usuarioSaindo) {
      registrarAuditoria({
        acao: 'logout',
        entidade: 'sistema',
        alvoId: usuarioSaindo.id,
        detalhes: 'Logout realizado no sistema interno.',
      });
    }
    sessionStore.removeItem(SESSION_KEYS.usuario);
    sessionStore.removeItem(SESSION_KEYS.abaSistema);
    mostrarAreaSistema(false);
    renderUsuarioLogadoTopbar(null);
    if (btnLogout) { btnLogout.style.display = 'none'; }
    const formLogin = document.getElementById('form-login-sistema');
    // Só limpa os campos se não estava lembrando
    if (!persistentStorage.getItem('canil_lembrar_login')) {
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
    renderUsuarioLogadoTopbar(usuario);
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
    ['Auditoria', configurarAuditoriaSistema],
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

    const salvo = sessionStore.getItem(SESSION_KEYS.menuSistemaColapsado) === '1';
    aplicarEstado(salvo);
  };

  if (botao.dataset.menuConfigurado !== 'true') {
    botao.dataset.menuConfigurado = 'true';
    botao.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 900px)').matches) return;

      const ficouColapsado = !area.classList.contains('menu-colapsado');
      aplicarEstado(ficouColapsado);
      sessionStore.setItem(SESSION_KEYS.menuSistemaColapsado, ficouColapsado ? '1' : '0');
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

  const usuarioSessao = obterUsuarioSessaoAtual() || readSessionUser();
  const ehAdmin = usuarioEhAdmin(usuarioSessao);

  const abasAdmin = ['tab-config', 'tab-auditoria'];
  abasAdmin.forEach((abaId) => {
    const botao = botoes.find((b) => b.getAttribute('data-target') === abaId);
    const painel = paineis.find((p) => p.id === abaId);

    if (botao) {
      botao.hidden = !ehAdmin;
      botao.style.display = ehAdmin ? '' : 'none';
    }

    if (painel) {
      painel.hidden = !ehAdmin;
      painel.style.display = ehAdmin ? '' : 'none';
    }
  });

  const resolverAbaPermitida = (aba) => {
    if (!aba) return 'tab-dashboard';
    if (abasAdmin.includes(aba) && !ehAdmin) return 'tab-dashboard';
    return aba;
  };

  const abaSalva = resolverAbaPermitida(sessionStore.getItem(SESSION_KEYS.abaSistema) || 'tab-dashboard');
  ativarAbaSistema(abaSalva);
  sessionStore.setItem(SESSION_KEYS.abaSistema, abaSalva);

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      const aba = resolverAbaPermitida(botao.getAttribute('data-target') || 'tab-dashboard');
      ativarAbaSistema(aba);
      sessionStore.setItem(SESSION_KEYS.abaSistema, aba);
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
    const agoraIso = new Date().toISOString();
    const petAnterior = estado.animais.find((item) => item.id === id);
    const statusNormalizado = normalizarStatus(inputValue('status-animal'));
    const eraAdotado = normalizarStatus(petAnterior?.status || '') === 'adotado';
    const adotanteNome = statusNormalizado === 'adotado' ? inputValue('adotante') : '';
    const telefoneAdotante = statusNormalizado === 'adotado' ? inputValue('telefone-adotante') : '';

    if (statusNormalizado === 'adotado' && !adotanteNome) {
      setStatus('status-sistema', 'Para status Adotado, informe obrigatoriamente o nome do adotante.', 'erro');
      return;
    }

    const pet = {
      id,
      nome: inputValue('nome-animal'),
      especie: normalizarEspecie(inputValue('especie-animal')),
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
      criadoEm: String(petAnterior?.criadoEm || agoraIso),
      adocaoEm: statusNormalizado === 'adotado'
        ? String(eraAdotado ? (petAnterior?.adocaoEm || petAnterior?.atualizadoEm || agoraIso) : agoraIso)
        : '',
      historiaAdocao: petAnterior?.historiaAdocao || '',
      historiaTitulo: petAnterior?.historiaTitulo || '',
      historiaPublicado: statusNormalizado === 'adotado' ? Boolean(petAnterior?.historiaPublicado) : false,
      historiaPublicadoEm: statusNormalizado === 'adotado' ? String(petAnterior?.historiaPublicadoEm || '') : '',
      historiaAtualizadoEm: String(petAnterior?.historiaAtualizadoEm || ''),
      galeria: galeriaAtual.length ? galeriaAtual : [FALLBACK_FOTO],
      fotoPerfilIndex: perfilIndexAtual,
      fotoPerfilAjuste: obterAjusteAtual(),
      atualizadoEm: agoraIso,
    };

    if (!pet.nome || !pet.especie || !pet.descricao || !pet.temperamento) {
      setStatus('status-sistema', 'Preencha os campos obrigatórios do pet.', 'erro');
      return;
    }

    const idx = estado.animais.findIndex((item) => item.id === id);
    if (idx >= 0) {
      estado.animais[idx] = pet;
      registrarAuditoria({
        acao: 'editar',
        entidade: 'pet',
        alvoId: pet.id,
        detalhes: `Pet ${pet.nome} atualizado (status: ${pet.status}).`,
      });
      setStatus('status-sistema', 'Pet atualizado com sucesso.', 'ok');
    } else {
      estado.animais.unshift(pet);
      registrarAuditoria({
        acao: 'criar',
        entidade: 'pet',
        alvoId: pet.id,
        detalhes: `Pet ${pet.nome} cadastrado (status: ${pet.status}).`,
      });
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
  const selectOrdenacao = document.getElementById('filtro-admin-ordenacao');
  const selectCampoData = document.getElementById('filtro-admin-campo-data');
  const inputDataInicio = document.getElementById('filtro-admin-data-inicio');
  const inputDataFim = document.getElementById('filtro-admin-data-fim');
  const atualizarListaGestao = () => renderListaGestaoPets();

  inputBusca?.addEventListener('input', atualizarListaGestao);
  selectStatus?.addEventListener('change', atualizarListaGestao);
  selectOrdenacao?.addEventListener('change', atualizarListaGestao);
  selectCampoData?.addEventListener('change', atualizarListaGestao);
  inputDataInicio?.addEventListener('change', atualizarListaGestao);
  inputDataFim?.addEventListener('change', atualizarListaGestao);
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
    registrarAuditoria({
      acao: 'excluir',
      entidade: 'pet',
      alvoId: pet.id,
      detalhes: `Pet ${pet.nome} removido do sistema.`,
    });
    salvarEstado();
    renderListaGestaoPets();
    renderDashboardSistema();
    renderPainelOperacaoListas();
    setStatus('status-sistema', 'Pet removido com sucesso.', 'ok');
  };

  window.__sistemaPets = { carregarPetNoForm, excluirPet };
  resetForm();
}

function normalizarTextoBusca(valor) {
  return String(valor || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function timestampValido(valor) {
  const data = new Date(valor);
  const numero = data.getTime();
  return Number.isNaN(numero) ? null : numero;
}

function timestampDataInput(valor, fimDoDia = false) {
  if (!valor) return null;
  const sufixo = fimDoDia ? 'T23:59:59.999' : 'T00:00:00.000';
  return timestampValido(`${valor}${sufixo}`);
}

function timestampCampoDataPet(pet, campo) {
  if (campo === 'cadastro') return timestampValido(pet.criadoEm || pet.atualizadoEm);
  if (campo === 'atualizacao') return timestampValido(pet.atualizadoEm || pet.criadoEm);
  if (campo === 'adocao') {
    if (normalizarStatus(pet.status) !== 'adotado') return null;
    return timestampValido(pet.adocaoEm || pet.atualizadoEm || pet.criadoEm);
  }
  return null;
}

function obterPetsGestaoFiltradosOrdenados() {
  const busca = normalizarTextoBusca(document.getElementById('filtro-admin-busca')?.value || '');
  const statusFiltro = normalizarStatus(document.getElementById('filtro-admin-status')?.value || 'todos');
  const ordenacao = document.getElementById('filtro-admin-ordenacao')?.value || 'atualizacao-desc';
  const campoData = document.getElementById('filtro-admin-campo-data')?.value || 'nenhum';
  const dataInicio = timestampDataInput(document.getElementById('filtro-admin-data-inicio')?.value || '');
  const dataFim = timestampDataInput(document.getElementById('filtro-admin-data-fim')?.value || '', true);

  const filtrados = estado.animais.filter((pet) => {
    const statusPet = normalizarStatus(pet.status);
    const bag = normalizarTextoBusca(
      [
        pet.nome,
        pet.especie,
        pet.porte,
        pet.status,
        pet.temperamento,
        pet.id,
        pet.adotante,
      ].join(' '),
    );

    const bateBusca = !busca || bag.includes(busca);
    const bateStatus = statusFiltro === 'todos' ? true : statusPet === statusFiltro;

    if (!bateBusca || !bateStatus) return false;
    if (campoData === 'nenhum' || (dataInicio === null && dataFim === null)) return true;

    const dataPet = timestampCampoDataPet(pet, campoData);
    if (dataPet === null) return false;
    if (dataInicio !== null && dataPet < dataInicio) return false;
    if (dataFim !== null && dataPet > dataFim) return false;

    return true;
  });

  const porNome = (a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', { sensitivity: 'base' });
  const porCadastro = (a, b) => (timestampValido(a.criadoEm || a.atualizadoEm) || 0) - (timestampValido(b.criadoEm || b.atualizadoEm) || 0);
  const porAtualizacao = (a, b) => (timestampValido(a.atualizadoEm || a.criadoEm) || 0) - (timestampValido(b.atualizadoEm || b.criadoEm) || 0);
  const porAdocao = (a, b) => {
    const adocaoA = timestampCampoDataPet(a, 'adocao');
    const adocaoB = timestampCampoDataPet(b, 'adocao');
    if (adocaoA === null && adocaoB === null) return porNome(a, b);
    if (adocaoA === null) return 1;
    if (adocaoB === null) return -1;
    return adocaoA - adocaoB;
  };

  const ordenados = [...filtrados];
  if (ordenacao === 'nome-asc') ordenados.sort(porNome);
  if (ordenacao === 'nome-desc') ordenados.sort((a, b) => porNome(b, a));
  if (ordenacao === 'cadastro-asc') ordenados.sort(porCadastro);
  if (ordenacao === 'cadastro-desc') ordenados.sort((a, b) => porCadastro(b, a));
  if (ordenacao === 'atualizacao-asc') ordenados.sort(porAtualizacao);
  if (ordenacao === 'atualizacao-desc') ordenados.sort((a, b) => porAtualizacao(b, a));
  if (ordenacao === 'adocao-asc') ordenados.sort(porAdocao);
  if (ordenacao === 'adocao-desc') ordenados.sort((a, b) => porAdocao(b, a));

  return ordenados;
}

function renderListaGestaoPets() {
  const lista = document.getElementById('lista-animais-sistema');
  const qtd = document.getElementById('qtd-cadastrados');
  if (!lista) return;

  const petsFiltrados = obterPetsGestaoFiltradosOrdenados();
  if (qtd) qtd.textContent = `${petsFiltrados.length}/${estado.animais.length} registros`;

  if (!estado.animais.length) {
    lista.innerHTML = `<div class="vazio">Nenhum pet cadastrado.</div>`;
    return;
  }

  if (!petsFiltrados.length) {
    lista.innerHTML = `<div class="vazio">Nenhum pet encontrado com os filtros selecionados.</div>`;
    return;
  }

  lista.innerHTML = petsFiltrados
    .map(
      (pet) => `
      <article class="item-gestao">
        <img src="${fotoPerfilDoPet(pet)}" alt="${pet.nome}" />
        <div>
          <h4>${pet.nome}</h4>
          <p>${pet.especie} • ${pet.idade} anos • ${pet.porte} • ${pet.status}</p>
          <p>Cadastro: ${formatarData(pet.criadoEm || pet.atualizadoEm)} • Adoção: ${normalizarStatus(pet.status) === 'adotado' ? formatarData(pet.adocaoEm || pet.atualizadoEm || pet.criadoEm) : '—'}</p>
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

function obterFiltrosDashboard() {
  return {
    periodo: inputValue('dash-filtro-periodo') || '90',
    statusAnimal: normalizarStatus(inputValue('dash-filtro-status-animal') || 'todos'),
    fluxo: inputValue('dash-filtro-fluxo') || 'todos',
  };
}

function resetarPaginacaoDashboard() {
  rankingPaginaAtual = 1;
}

function limitePeriodoDashboard(periodo) {
  if (!periodo || periodo === 'todos') return null;
  const dias = Number(periodo);
  if (!Number.isFinite(dias) || dias <= 0) return null;
  return Date.now() - (dias * 24 * 60 * 60 * 1000);
}

function dentroDoPeriodoDashboard(valorData, limiteTimestamp) {
  if (!limiteTimestamp) return true;
  const ts = timestampValido(valorData);
  return ts != null && ts >= limiteTimestamp;
}

function mesesPorPeriodoDashboard(periodo) {
  if (periodo === '30') return 4;
  if (periodo === '90') return 6;
  if (periodo === '180') return 8;
  return 12;
}

function mesAnoChave(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${data.getFullYear()}-${mes}`;
}

function rotuloMesAno(data) {
  return data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
}

function gerarJanelaMensalDashboard(periodo) {
  const totalMeses = mesesPorPeriodoDashboard(periodo);
  const agora = new Date();
  const base = new Date(agora.getFullYear(), agora.getMonth(), 1);

  return Array.from({ length: totalMeses }, (_, idx) => {
    const data = new Date(base.getFullYear(), base.getMonth() - (totalMeses - 1 - idx), 1);
    return {
      chave: mesAnoChave(data),
      rotulo: rotuloMesAno(data),
      inicio: data.getTime(),
    };
  });
}

function contarSerieMensalDashboard(lista, dataResolver, janelaMensal) {
  const mapa = Object.fromEntries(janelaMensal.map((item) => [item.chave, 0]));

  lista.forEach((item) => {
    const bruto = dataResolver(item);
    const data = new Date(bruto || 0);
    if (Number.isNaN(data.getTime())) return;
    const chave = mesAnoChave(data);
    if (Object.prototype.hasOwnProperty.call(mapa, chave)) {
      mapa[chave] += 1;
    }
  });

  return janelaMensal.map((item) => mapa[item.chave]);
}

function etapaInteresseFinalizada(etapa) {
  return etapa === 'concluido' || etapa === 'arquivado';
}

function etapaDenunciaFinalizada(etapa) {
  return etapa === 'resolvida' || etapa === 'arquivada';
}

function aplicarFiltroFluxo(lista, tipo, filtroFluxo) {
  if (filtroFluxo === 'todos') return lista;

  return lista.filter((item) => {
    const etapa = normalizarEtapaFluxo(item.statusAtendimento, tipo);
    const finalizado = tipo === 'interesse' ? etapaInteresseFinalizada(etapa) : etapaDenunciaFinalizada(etapa);
    return filtroFluxo === 'finalizados' ? finalizado : !finalizado;
  });
}

function configurarEventosDashboard() {
  if (window.__dashboardEventosConfigurados) return;
  window.__dashboardEventosConfigurados = true;

  ['dash-filtro-periodo', 'dash-filtro-status-animal', 'dash-filtro-fluxo'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', () => {
      resetarPaginacaoDashboard();
      renderDashboardSistema();
    });
  });

  document.querySelectorAll('[data-print-dashboard-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-print-dashboard-target');
      if (!target) return;
      imprimirAreaDashboard(target);
    });
  });

  const btnImprimirTudo = document.getElementById('btn-dash-imprimir-tudo');
  if (btnImprimirTudo) {
    btnImprimirTudo.addEventListener('click', () => {
      imprimirAreaDashboard('tab-dashboard');
    });
  }
}

function imprimirAreaDashboard(targetId) {
  const area = document.getElementById(targetId);
  if (!area) return;

  area.classList.add('print-area-ativa');
  window.print();
  window.setTimeout(() => {
    area.classList.remove('print-area-ativa');
  }, 250);
}

function renderGraficoDashboard(canvasId, configuracao) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (canvas._chartInstance) {
    canvas._chartInstance.destroy();
  }

  canvas._chartInstance = new window.Chart(ctx, configuracao);
}

function montarRelatorioIndicadoresDashboard({
  totalPets,
  adotados,
  totalInteresses,
  interessesConcluidos,
  totalDenuncias,
  denunciasResolvidas,
  mediaDiasAdocao,
  protocolosAbertos,
  postsPublicados,
}) {
  const alvo = document.getElementById('relatorio-indicadores');
  if (!alvo) return;

  const taxaAdocao = totalPets ? (adotados / totalPets) * 100 : 0;
  const taxaConclusaoInteresses = totalInteresses ? (interessesConcluidos / totalInteresses) * 100 : 0;
  const taxaResolucaoDenuncias = totalDenuncias ? (denunciasResolvidas / totalDenuncias) * 100 : 0;

  const cards = [
    ['Taxa de Adoção', `${taxaAdocao.toFixed(1)}%`],
    ['Conclusão de Pedidos', `${taxaConclusaoInteresses.toFixed(1)}%`],
    ['Resolução de Denúncias', `${taxaResolucaoDenuncias.toFixed(1)}%`],
    ['Média de Dias até Adoção', `${mediaDiasAdocao.toFixed(1)} dias`],
    ['Protocolos em Aberto', String(protocolosAbertos)],
    ['Posts Publicados no Período', String(postsPublicados)],
  ];

  alvo.innerHTML = cards
    .map(([rotulo, valor]) => `
      <article class="relatorio-kpi">
        <p class="rotulo">${escaparHtml(rotulo)}</p>
        <p class="valor">${escaparHtml(valor)}</p>
      </article>
    `)
    .join('');
}

function renderRelatorioRankingDashboard(listaPets) {
  const tbody = document.getElementById('relatorio-ranking-pets');
  if (!tbody) return;

  const ranking = listaPets
    .map((pet) => {
      const cadastroTs = timestampValido(pet.criadoEm || pet.atualizadoEm);
      const dias = cadastroTs == null ? 0 : Math.max(0, Math.floor((Date.now() - cadastroTs) / (24 * 60 * 60 * 1000)));
      return { pet, dias };
    })
    .sort((a, b) => b.dias - a.dias);

  if (!ranking.length) {
    tbody.innerHTML = '<tr><td colspan="4">Nenhum pet encontrado para os filtros atuais.</td></tr>';
    return;
  }

  tbody.innerHTML = ranking
    .map(({ pet, dias }) => `
      <tr>
        <td>${escaparHtml(pet.nome || 'Pet sem nome')}</td>
        <td>${escaparHtml(normalizarStatus(pet.status) || '—')}</td>
        <td>${escaparHtml(formatarData(pet.criadoEm || pet.atualizadoEm))}</td>
        <td>${dias}</td>
      </tr>
    `)
    .join('');
}

function renderDashboardSistema() {
  configurarEventosDashboard();

  const filtros = obterFiltrosDashboard();
  const limite = limitePeriodoDashboard(filtros.periodo);

  const petsFiltrados = estado.animais.filter((pet) => {
    if (filtros.statusAnimal !== 'todos' && normalizarStatus(pet.status) !== filtros.statusAnimal) {
      return false;
    }
    return dentroDoPeriodoDashboard(pet.criadoEm || pet.atualizadoEm, limite);
  });

  const interessesBase = estado.interesses
    .filter((item) => dentroDoPeriodoDashboard(item.criadoEm, limite));
  const denunciasBase = estado.denuncias
    .filter((item) => dentroDoPeriodoDashboard(item.criadoEm, limite));

  const interessesFiltrados = aplicarFiltroFluxo(interessesBase, 'interesse', filtros.fluxo);
  const denunciasFiltradas = aplicarFiltroFluxo(denunciasBase, 'denuncia', filtros.fluxo);

  const total = petsFiltrados.length;
  const disponiveis = petsFiltrados.filter((p) => normalizarStatus(p.status) === 'disponível').length;
  const adotados = petsFiltrados.filter((p) => normalizarStatus(p.status) === 'adotado').length;
  const pedidos = interessesFiltrados.filter((item) => {
    const etapa = normalizarEtapaFluxo(item.statusAtendimento, 'interesse');
    return !etapaInteresseFinalizada(etapa);
  }).length;
  const denunciasAbertas = denunciasFiltradas.filter((item) => {
    const etapa = normalizarEtapaFluxo(item.statusAtendimento, 'denuncia');
    return !etapaDenunciaFinalizada(etapa);
  }).length;
  const usuariosAtivos = estado.usuarios.filter((usuario) => usuario.ativo).length;

  setText('dash-total-pets', String(total));
  setText('dash-disponiveis', String(disponiveis));
  setText('dash-adotados', String(adotados));
  setText('dash-pedidos', String(pedidos));
  setText('dash-denuncias-abertas', String(denunciasAbertas));
  setText('dash-usuarios-ativos', String(usuariosAtivos));

  const janelaMensal = gerarJanelaMensalDashboard(filtros.periodo);
  const labelsMensais = janelaMensal.map((item) => item.rotulo);

  const serieResgates = contarSerieMensalDashboard(
    petsFiltrados,
    (item) => item.criadoEm || item.atualizadoEm,
    janelaMensal,
  );
  const serieAdocoes = contarSerieMensalDashboard(
    petsFiltrados.filter((item) => normalizarStatus(item.status) === 'adotado'),
    (item) => item.adocaoEm || item.atualizadoEm || item.criadoEm,
    janelaMensal,
  );

  renderGraficoDashboard('grafico-dashboard', {
    type: 'bar',
    data: {
      labels: labelsMensais,
      datasets: [
        {
          label: 'Resgates',
          data: serieResgates,
          backgroundColor: 'rgba(82,178,207,0.72)',
          borderRadius: 6,
        },
        {
          label: 'Adoções',
          data: serieAdocoes,
          backgroundColor: 'rgba(255,112,150,0.72)',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });

  const statusLabels = ['Disponível', 'Adotado', 'Em tratamento', 'Outros'];
  const statusValores = [
    petsFiltrados.filter((p) => normalizarStatus(p.status) === 'disponível').length,
    petsFiltrados.filter((p) => normalizarStatus(p.status) === 'adotado').length,
    petsFiltrados.filter((p) => normalizarStatus(p.status) === 'em tratamento').length,
    petsFiltrados.filter((p) => {
      const status = normalizarStatus(p.status);
      return status !== 'disponível' && status !== 'adotado' && status !== 'em tratamento';
    }).length,
  ];

  renderGraficoDashboard('grafico-status-pets', {
    type: 'doughnut',
    data: {
      labels: statusLabels,
      datasets: [{
        data: statusValores,
        backgroundColor: ['#52b2cf', '#ff7096', '#f0ad4e', '#8f9aa6'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
    },
  });

  const fluxoLabels = ['Novo(a)', 'Em triagem', 'Contato/Acompanhamento', 'Finalizado', 'Arquivado'];
  const interessesPorEtapa = [0, 0, 0, 0, 0];
  const denunciasPorEtapa = [0, 0, 0, 0, 0];

  interessesFiltrados.forEach((item) => {
    const etapa = normalizarEtapaFluxo(item.statusAtendimento, 'interesse');
    if (etapa === 'novo') interessesPorEtapa[0] += 1;
    else if (etapa === 'em triagem') interessesPorEtapa[1] += 1;
    else if (etapa === 'contato realizado' || etapa === 'visita agendada') interessesPorEtapa[2] += 1;
    else if (etapa === 'concluido') interessesPorEtapa[3] += 1;
    else if (etapa === 'arquivado') interessesPorEtapa[4] += 1;
  });

  denunciasFiltradas.forEach((item) => {
    const etapa = normalizarEtapaFluxo(item.statusAtendimento, 'denuncia');
    if (etapa === 'nova') denunciasPorEtapa[0] += 1;
    else if (etapa === 'em triagem') denunciasPorEtapa[1] += 1;
    else if (etapa === 'em acompanhamento') denunciasPorEtapa[2] += 1;
    else if (etapa === 'resolvida') denunciasPorEtapa[3] += 1;
    else if (etapa === 'arquivada') denunciasPorEtapa[4] += 1;
  });

  renderGraficoDashboard('grafico-fluxo', {
    type: 'bar',
    data: {
      labels: fluxoLabels,
      datasets: [
        {
          label: 'Interesses',
          data: interessesPorEtapa,
          backgroundColor: '#52b2cf',
          borderRadius: 6,
        },
        {
          label: 'Denúncias',
          data: denunciasPorEtapa,
          backgroundColor: '#6C4B9E',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });

  const contagemEspecie = {};
  petsFiltrados.forEach((pet) => {
    const especie = (String(pet.especie || 'Não informado').trim() || 'Não informado');
    contagemEspecie[especie] = (contagemEspecie[especie] || 0) + 1;
  });

  const especiesOrdenadas = Object.entries(contagemEspecie)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const especiesLabels = especiesOrdenadas.map(([nome]) => nome);
  const especiesValores = especiesOrdenadas.map(([, qtd]) => qtd);

  renderGraficoDashboard('grafico-especie', {
    type: 'bar',
    data: {
      labels: especiesLabels.length ? especiesLabels : ['Sem dados'],
      datasets: [{
        label: 'Cadastros',
        data: especiesValores.length ? especiesValores : [0],
        backgroundColor: 'rgba(47,143,91,0.75)',
        borderRadius: 6,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });

  const interessesConcluidos = interessesFiltrados
    .filter((item) => normalizarEtapaFluxo(item.statusAtendimento, 'interesse') === 'concluido').length;
  const denunciasResolvidas = denunciasFiltradas
    .filter((item) => normalizarEtapaFluxo(item.statusAtendimento, 'denuncia') === 'resolvida').length;

  const adocoesComData = petsFiltrados
    .filter((pet) => normalizarStatus(pet.status) === 'adotado')
    .map((pet) => {
      const cadastro = timestampValido(pet.criadoEm || pet.atualizadoEm);
      const adocao = timestampValido(pet.adocaoEm || pet.atualizadoEm || pet.criadoEm);
      if (cadastro == null || adocao == null) return null;
      return Math.max(0, (adocao - cadastro) / (24 * 60 * 60 * 1000));
    })
    .filter((valor) => typeof valor === 'number');

  const mediaDiasAdocao = adocoesComData.length
    ? adocoesComData.reduce((acc, valor) => acc + valor, 0) / adocoesComData.length
    : 0;

  const postsPublicados = estado.posts.filter((post) => {
    if (!post.publicado) return false;
    return dentroDoPeriodoDashboard(post.data || post.criadoEm, limite);
  }).length;

  montarRelatorioIndicadoresDashboard({
    totalPets: total,
    adotados,
    totalInteresses: interessesFiltrados.length,
    interessesConcluidos,
    totalDenuncias: denunciasFiltradas.length,
    denunciasResolvidas,
    mediaDiasAdocao,
    protocolosAbertos: pedidos + denunciasAbertas,
    postsPublicados,
  });

  renderRelatorioRankingDashboard(
    petsFiltrados.filter((pet) => normalizarStatus(pet.status) !== 'adotado'),
  );

  renderListaHistoriasAdocaoSistema();
  renderPainelOperacaoListas();
}

function configurarPainelOperacao() {
  const btnExportar = document.getElementById('btn-exportar-dados');
  if (btnExportar && btnExportar.dataset.exportarConfigurado !== 'true') {
    btnExportar.dataset.exportarConfigurado = 'true';
    btnExportar.addEventListener('click', () => {
      const snapshot = {
        meta: {
          sistema: 'Canil Prefeitura de Vilhena',
          versao: 'backup-v1',
          exportadoEm: new Date().toISOString(),
          geradoPor: readSessionUser()?.login || 'sistema',
        },
        storageKeys: STORAGE_KEYS,
        estado: {
          animais: estado.animais,
          posts: estado.posts,
          denuncias: estado.denuncias,
          interesses: estado.interesses,
          usuarios: estado.usuarios,
          auditoria: estado.auditoria,
        },
        persistentStorage: {
          animais: readJSON(STORAGE_KEYS.animais, []),
          posts: readJSON(STORAGE_KEYS.blog, []),
          denuncias: readJSON(STORAGE_KEYS.denuncias, []),
          interesses: readJSON(STORAGE_KEYS.interesses, []),
          usuarios: readJSON(STORAGE_KEYS.usuarios, []),
          auditoria: readJSON(STORAGE_KEYS.auditoria, []),
        },
      };

      const conteudo = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([conteudo], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const data = new Date();
      const sufixo = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}_${String(data.getHours()).padStart(2, '0')}${String(data.getMinutes()).padStart(2, '0')}${String(data.getSeconds()).padStart(2, '0')}`;

      link.href = url;
      link.download = `backup-canil-vilhena-${sufixo}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      registrarAuditoria({
        acao: 'exportar',
        entidade: 'sistema',
        detalhes: 'Backup completo do banco de dados exportado.',
      });

      setStatus('status-sistema', 'Backup exportado com sucesso.', 'ok');
    });
  }

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
  const idFiltroEtapa = tipo === 'interesse' ? 'filtro-interesse-status' : 'filtro-denuncia-status';
  const valorFiltroAtual = inputValue(idFiltroEtapa);
  const filtroPorEtapaAtivo = Boolean(valorFiltroAtual && valorFiltroAtual !== 'todos');
  const etapaAtualFiltro = normalizarEtapaFluxo(valorFiltroAtual || etapas[0], tipo);

  const chips = etapas
    .map((etapa) => {
      const qtd = lista.filter((item) => normalizarEtapaFluxo(item.statusAtendimento, tipo) === etapa).length;
      const ativo = filtroPorEtapaAtivo && etapaAtualFiltro === etapa;
      return `
        <button
          type="button"
          class="fluxo-chip ${ativo ? 'ativo' : ''}"
          data-fluxo-ir-etapa="${etapa}"
          data-fluxo-tipo="${tipo}"
          title="Filtrar lista por ${rotuloEtapaFluxo(etapa)}"
        >
          ${rotuloEtapaFluxo(etapa)}: <strong>${qtd}</strong>
        </button>
      `;
    })
    .join('');

  alvo.innerHTML = `<div class="resumo-fluxo-linha">${chips}</div>`;

  alvo.querySelectorAll('[data-fluxo-ir-etapa]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const etapa = botao.getAttribute('data-fluxo-ir-etapa');
      const tipoFluxo = botao.getAttribute('data-fluxo-tipo');
      const idFiltro = tipoFluxo === 'interesse' ? 'filtro-interesse-status' : 'filtro-denuncia-status';
      const filtro = document.getElementById(idFiltro);
      if (!(filtro instanceof HTMLSelectElement) || !etapa) return;

      filtro.value = etapa;
      renderPainelOperacaoListas();

      if (tipoFluxo === 'interesse') {
        setStatus('status-interesses-admin', `Filtro aplicado: fase ${rotuloEtapaFluxo(etapa)}.`, 'ok');
      } else {
        setStatus('status-denuncias-admin', `Filtro aplicado: fase ${rotuloEtapaFluxo(etapa)}.`, 'ok');
      }
    });
  });
}

function avancarParaProximaEtapaFluxo(item, tipo) {
  const etapas = tipo === 'interesse' ? ETAPAS_INTERESSE : ETAPAS_DENUNCIA;
  const atual = normalizarEtapaFluxo(item.statusAtendimento, tipo);
  const indiceAtual = etapas.indexOf(atual);
  if (indiceAtual < 0 || indiceAtual >= etapas.length - 1) return false;

  item.statusAtendimento = etapas[indiceAtual + 1];
  return true;
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
      (item) => {
        const etapaAtual = normalizarEtapaFluxo(item.statusAtendimento, 'interesse');
        const indiceAtual = ETAPAS_INTERESSE.indexOf(etapaAtual);
        const proximaEtapa = indiceAtual >= 0 && indiceAtual < ETAPAS_INTERESSE.length - 1 ? ETAPAS_INTERESSE[indiceAtual + 1] : '';

        return `
      <article class="blog-item fluxo-item">
        <div class="fluxo-topo">
          <h4>${item.nome} • ${item.petNome || 'Pet não identificado'}</h4>
          <div class="fluxo-topo-tags">
            <span class="fluxo-prioridade prioridade-${slugStatus(normalizarPrioridadeFluxo(item.prioridadeAtendimento))}">${rotuloPrioridadeFluxo(normalizarPrioridadeFluxo(item.prioridadeAtendimento))}</span>
            <span class="fluxo-status status-${slugStatus(etapaAtual)}">${rotuloEtapaFluxo(etapaAtual)}</span>
          </div>
        </div>
        <p class="texto-suave">Protocolo ${item.id} • ${formatarData(item.criadoEm)} • <span class="fluxo-sla">${tempoAbertoHumano(item.criadoEm)}</span></p>
        <p>${item.cidade} • ${item.whatsapp} • ${item.email}</p>
        <p>${item.mensagem}</p>
        <div class="item-acoes fluxo-acoes">
          <select class="fluxo-select" data-status-interesse="${item.id}">
            ${ETAPAS_INTERESSE.map((etapa) => `<option value="${etapa}" ${etapaAtual === etapa ? 'selected' : ''}>${rotuloEtapaFluxo(etapa)}</option>`).join('')}
          </select>
          <select class="fluxo-select" data-prioridade-interesse="${item.id}">
            ${PRIORIDADES_FLUXO.map((prioridade) => `<option value="${prioridade}" ${normalizarPrioridadeFluxo(item.prioridadeAtendimento) === prioridade ? 'selected' : ''}>Prioridade ${rotuloPrioridadeFluxo(prioridade)}</option>`).join('')}
          </select>
          <button class="mini-btn btn-proxima-fase" type="button" data-proxima-fase-interesse="${item.id}" ${proximaEtapa ? '' : 'disabled'}>
            ${proximaEtapa ? `Proxima fase: ${rotuloEtapaFluxo(proximaEtapa)}` : 'Fluxo finalizado'}
          </button>
          <button class="mini-btn remover" type="button" data-arquivar-interesse="${item.id}">Arquivar</button>
        </div>
      </article>
    `;
      },
    )
    .join('');

  alvo.querySelectorAll('[data-status-interesse]').forEach((el) => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-status-interesse');
      const item = estado.interesses.find((registro) => registro.id === id);
      if (!item) return;
      item.statusAtendimento = normalizarEtapaFluxo(el.value, 'interesse');
      registrarAuditoria({
        acao: 'editar',
        entidade: 'interesse',
        alvoId: item.id,
        detalhes: `Etapa alterada para ${rotuloEtapaFluxo(item.statusAtendimento)}.`,
      });
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
      registrarAuditoria({
        acao: 'arquivar',
        entidade: 'interesse',
        alvoId: item.id,
        detalhes: 'Pedido de adoção arquivado.',
      });
      salvarEstado();
      renderPainelOperacaoListas();
      renderDashboardSistema();
      setStatus('status-interesses-admin', 'Pedido arquivado.', 'ok');
    });
  });

  alvo.querySelectorAll('[data-proxima-fase-interesse]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-proxima-fase-interesse');
      const item = estado.interesses.find((registro) => registro.id === id);
      if (!item) return;

      const avancou = avancarParaProximaEtapaFluxo(item, 'interesse');
      if (!avancou) {
        setStatus('status-interesses-admin', 'Este pedido já está na etapa final do fluxo.', 'aviso');
        return;
      }

      salvarEstado();
      registrarAuditoria({
        acao: 'editar',
        entidade: 'interesse',
        alvoId: item.id,
        detalhes: `Pedido avançado para ${rotuloEtapaFluxo(item.statusAtendimento)}.`,
      });
      renderPainelOperacaoListas();
      renderDashboardSistema();
      setStatus('status-interesses-admin', `Pedido avançado para ${rotuloEtapaFluxo(item.statusAtendimento)}.`, 'ok');
    });
  });

  alvo.querySelectorAll('[data-prioridade-interesse]').forEach((el) => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-prioridade-interesse');
      const item = estado.interesses.find((registro) => registro.id === id);
      if (!item) return;
      item.prioridadeAtendimento = normalizarPrioridadeFluxo(el.value);
      registrarAuditoria({
        acao: 'editar',
        entidade: 'interesse',
        alvoId: item.id,
        detalhes: `Prioridade alterada para ${rotuloPrioridadeFluxo(item.prioridadeAtendimento)}.`,
      });
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
      (item) => {
        const etapaAtual = normalizarEtapaFluxo(item.statusAtendimento, 'denuncia');
        const indiceAtual = ETAPAS_DENUNCIA.indexOf(etapaAtual);
        const proximaEtapa = indiceAtual >= 0 && indiceAtual < ETAPAS_DENUNCIA.length - 1 ? ETAPAS_DENUNCIA[indiceAtual + 1] : '';

        return `
      <article class="blog-item fluxo-item">
        <div class="fluxo-topo">
          <h4>${item.local}</h4>
          <div class="fluxo-topo-tags">
            <span class="fluxo-prioridade prioridade-${slugStatus(normalizarPrioridadeFluxo(item.prioridadeAtendimento))}">${rotuloPrioridadeFluxo(normalizarPrioridadeFluxo(item.prioridadeAtendimento))}</span>
            <span class="fluxo-status status-${slugStatus(etapaAtual)}">${rotuloEtapaFluxo(etapaAtual)}</span>
          </div>
        </div>
        <p>${item.descricao}</p>
        <p class="texto-suave">Contato: ${item.contato || 'Anônimo'} • ${formatarData(item.criadoEm)} • Protocolo ${item.id} • <span class="fluxo-sla">${tempoAbertoHumano(item.criadoEm)}</span></p>
        <div class="item-acoes fluxo-acoes">
          <select class="fluxo-select" data-status-denuncia="${item.id}">
            ${ETAPAS_DENUNCIA.map((etapa) => `<option value="${etapa}" ${etapaAtual === etapa ? 'selected' : ''}>${rotuloEtapaFluxo(etapa)}</option>`).join('')}
          </select>
          <select class="fluxo-select" data-prioridade-denuncia="${item.id}">
            ${PRIORIDADES_FLUXO.map((prioridade) => `<option value="${prioridade}" ${normalizarPrioridadeFluxo(item.prioridadeAtendimento) === prioridade ? 'selected' : ''}>Prioridade ${rotuloPrioridadeFluxo(prioridade)}</option>`).join('')}
          </select>
          <button class="mini-btn btn-proxima-fase" type="button" data-proxima-fase-denuncia="${item.id}" ${proximaEtapa ? '' : 'disabled'}>
            ${proximaEtapa ? `Proxima fase: ${rotuloEtapaFluxo(proximaEtapa)}` : 'Fluxo finalizado'}
          </button>
          <button class="mini-btn" type="button" data-resolver-denuncia="${item.id}">Marcar resolvida</button>
        </div>
      </article>
    `;
      },
    )
    .join('');

  alvo.querySelectorAll('[data-status-denuncia]').forEach((el) => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-status-denuncia');
      const item = estado.denuncias.find((registro) => registro.id === id);
      if (!item) return;
      item.statusAtendimento = normalizarEtapaFluxo(el.value, 'denuncia');
      registrarAuditoria({
        acao: 'editar',
        entidade: 'denuncia',
        alvoId: item.id,
        detalhes: `Etapa alterada para ${rotuloEtapaFluxo(item.statusAtendimento)}.`,
      });
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
      registrarAuditoria({
        acao: 'resolver',
        entidade: 'denuncia',
        alvoId: item.id,
        detalhes: 'Denúncia marcada como resolvida.',
      });
      salvarEstado();
      renderPainelOperacaoListas();
      setStatus('status-denuncias-admin', 'Denúncia marcada como resolvida.', 'ok');
    });
  });

  alvo.querySelectorAll('[data-proxima-fase-denuncia]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-proxima-fase-denuncia');
      const item = estado.denuncias.find((registro) => registro.id === id);
      if (!item) return;

      const avancou = avancarParaProximaEtapaFluxo(item, 'denuncia');
      if (!avancou) {
        setStatus('status-denuncias-admin', 'Esta denúncia já está na etapa final do fluxo.', 'aviso');
        return;
      }

      salvarEstado();
      registrarAuditoria({
        acao: 'editar',
        entidade: 'denuncia',
        alvoId: item.id,
        detalhes: `Denúncia avançada para ${rotuloEtapaFluxo(item.statusAtendimento)}.`,
      });
      renderPainelOperacaoListas();
      setStatus('status-denuncias-admin', `Denúncia avançada para ${rotuloEtapaFluxo(item.statusAtendimento)}.`, 'ok');
    });
  });

  alvo.querySelectorAll('[data-prioridade-denuncia]').forEach((el) => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-prioridade-denuncia');
      const item = estado.denuncias.find((registro) => registro.id === id);
      if (!item) return;
      item.prioridadeAtendimento = normalizarPrioridadeFluxo(el.value);
      registrarAuditoria({
        acao: 'editar',
        entidade: 'denuncia',
        alvoId: item.id,
        detalhes: `Prioridade alterada para ${rotuloPrioridadeFluxo(item.prioridadeAtendimento)}.`,
      });
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
  if (!sessionStore.getItem(SESSION_KEYS.historiasAba)) {
    sessionStore.setItem(SESSION_KEYS.historiasAba, 'nao-postados');
  }
  botoesAba.forEach((botao) => {
    if (!(botao instanceof HTMLButtonElement) || botao.dataset.historiasAbaConfigurado === 'true') return;
    botao.dataset.historiasAbaConfigurado = 'true';
    botao.addEventListener('click', () => {
      const aba = botao.getAttribute('data-historias-aba') || 'nao-postados';
      sessionStore.setItem(SESSION_KEYS.historiasAba, aba);
      renderListaHistoriasAdocaoSistema();
    });
  });

  renderListaHistoriasAdocaoSistema();
}

function renderListaHistoriasAdocaoSistema() {
  const lista = document.getElementById('lista-historias-adocao');
  const badge = document.getElementById('qtd-historias');
  if (!lista) return;

  const abaAtual = sessionStore.getItem(SESSION_KEYS.historiasAba) || 'nao-postados';
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
      registrarAuditoria({
        acao: 'editar',
        entidade: 'historia',
        alvoId: pet.id,
        detalhes: `História de adoção de ${pet.nome} salva.`,
      });
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
        registrarAuditoria({
          acao: 'despublicar',
          entidade: 'historia',
          alvoId: pet.id,
          detalhes: `História de adoção de ${pet.nome} removida do site.`,
        });
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
      registrarAuditoria({
        acao: 'publicar',
        entidade: 'historia',
        alvoId: pet.id,
        detalhes: `História de adoção de ${pet.nome} publicada no site.`,
      });
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
      registrarAuditoria({
        acao: 'limpar',
        entidade: 'historia',
        alvoId: pet.id,
        detalhes: `Texto da história de ${pet.nome} foi limpo.`,
      });
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
      registrarAuditoria({
        acao: 'editar',
        entidade: 'post',
        alvoId: id,
        detalhes: `Post \"${post.titulo}\" atualizado.`,
      });
      setStatus('status-blog', 'Post atualizado com sucesso.', 'ok');
    } else {
      estado.posts.unshift(post);
      registrarAuditoria({
        acao: 'criar',
        entidade: 'post',
        alvoId: id,
        detalhes: `Post \"${post.titulo}\" criado.`,
      });
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
      registrarAuditoria({
        acao: 'excluir',
        entidade: 'post',
        alvoId: post.id,
        detalhes: `Post \"${post.titulo}\" excluído.`,
      });
      salvarEstado();
      renderListaBlogSistema();
      setStatus('status-blog', 'Post excluído com sucesso.', 'ok');
    });
  });
}

function obterUsuarioSessaoAtual() {
  const sessao = readSessionUser();
  if (!sessao) return null;
  return estado.usuarios.find((item) => item.id === sessao.id)
    || estado.usuarios.find((item) => item.login === sessao.login)
    || null;
}

function usuarioEhAdmin(usuario) {
  return String(usuario?.perfil || '').toLowerCase() === 'admin';
}

function rotuloPerfilAcesso(perfil) {
  const mapa = {
    admin: 'Administrador',
    veterinario: 'Veterinario(a)',
    cuidador: 'Cuidador(a)',
  };
  return mapa[String(perfil || '').toLowerCase()] || String(perfil || 'Usuário');
}

function renderUsuarioLogadoTopbar(usuario) {
  const alvo = document.getElementById('usuario-logado');
  if (!alvo) return;

  if (!usuario) {
    alvo.textContent = '';
    return;
  }

  const nome = escaparHtml(usuario.nome || 'Usuário');
  const perfilClasse = String(usuario.perfil || '').toLowerCase();
  const perfilRotulo = escaparHtml(rotuloPerfilAcesso(usuario.perfil));
  alvo.innerHTML = `${nome} <span class="usuario-perfil-selo perfil-${perfilClasse} selo-topbar">${perfilRotulo}</span>`;
}

function usuarioPodeEditar(usuarioSessao, usuarioAlvo) {
  if (!usuarioSessao || !usuarioAlvo) return false;
  if (usuarioEhAdmin(usuarioSessao)) return true;
  return usuarioSessao.id === usuarioAlvo.id;
}

function atualizarSessaoUsuarioSeNecessario(usuarioAtualizado) {
  const sessao = readSessionUser();
  if (!sessao || !usuarioAtualizado) return;
  if (sessao.id !== usuarioAtualizado.id && sessao.login !== usuarioAtualizado.login) return;

  sessionStore.setItem(SESSION_KEYS.usuario, JSON.stringify(usuarioAtualizado));
  renderUsuarioLogadoTopbar(usuarioAtualizado);
}

function configurarUsuariosSistema() {
  const form = document.getElementById('form-usuario');
  if (!form) return;

  const inputCpf = document.getElementById('usuario-cpf');
  const inputPerfil = document.getElementById('usuario-perfil');
  const inputSenha = document.getElementById('usuario-senha');
  const inputConfirmar = document.getElementById('usuario-senha-confirmar');
  const tituloForm = document.getElementById('titulo-form-usuario');
  const btnSalvar = document.getElementById('btn-salvar-usuario');
  const btnNovo = document.getElementById('btn-novo-usuario');

  const usuarioSessao = obterUsuarioSessaoAtual();
  const ehAdmin = usuarioEhAdmin(usuarioSessao);

  const aplicarModoFormulario = (editando = false) => {
    const idEdicao = inputValue('usuario-id-edicao');
    const usuarioAlvo = idEdicao ? estado.usuarios.find((item) => item.id === idEdicao) : null;
    const podeEditar = usuarioAlvo ? usuarioPodeEditar(usuarioSessao, usuarioAlvo) : ehAdmin;

    if (tituloForm) {
      tituloForm.textContent = editando ? 'Editar usuário' : 'Cadastrar novo usuário';
    }
    if (btnSalvar) {
      btnSalvar.textContent = editando ? 'Salvar alterações' : 'Cadastrar usuário';
    }

    if (inputCpf instanceof HTMLInputElement) {
      inputCpf.disabled = editando;
    }

    if (inputPerfil instanceof HTMLSelectElement) {
      inputPerfil.disabled = editando ? !ehAdmin : !ehAdmin;
    }

    if (inputSenha instanceof HTMLInputElement && inputConfirmar instanceof HTMLInputElement) {
      const senhaObrigatoria = !editando;
      inputSenha.required = senhaObrigatoria;
      inputConfirmar.required = senhaObrigatoria;
      inputSenha.placeholder = senhaObrigatoria ? 'Mínimo 6 caracteres' : 'Preencha apenas para alterar';
      inputConfirmar.placeholder = senhaObrigatoria ? 'Repita a senha escolhida' : 'Repita a nova senha';
    }

    form.querySelectorAll('input, select, button[type="submit"]').forEach((campo) => {
      if (!(campo instanceof HTMLElement)) return;
      if (campo.id === 'btn-salvar-usuario') {
        campo.toggleAttribute('disabled', !podeEditar);
      }
    });
  };

  const reset = () => {
    form.reset();
    setInputValue('usuario-id-edicao', '');
    if (inputCpf instanceof HTMLInputElement) inputCpf.disabled = false;
    aplicarModoFormulario(false);
    setStatus('status-usuario', '', 'limpo');
  };

  const carregarUsuarioNoForm = (usuarioId) => {
    const usuario = estado.usuarios.find((item) => item.id === usuarioId);
    if (!usuario) return;

    if (!usuarioPodeEditar(usuarioSessao, usuario)) {
      setStatus('status-usuario', 'Você só pode editar sua própria conta.', 'erro');
      return;
    }

    setInputValue('usuario-id-edicao', usuario.id);
    setInputValue('usuario-nome', usuario.nome || '');
    setInputValue('usuario-cpf', formatarCpf(usuario.cpf || usuario.id));
    setInputValue('usuario-email', usuario.email || '');
    setInputValue('usuario-contato', usuario.contato || '');
    setInputValue('usuario-login', usuario.login || '');
    setInputValue('usuario-perfil', usuario.perfil || '');
    setInputValue('usuario-senha', '');
    setInputValue('usuario-senha-confirmar', '');

    aplicarModoFormulario(true);
    abrirCardSuspenso('modal-usuario');
  };

  if (btnNovo) {
    btnNovo.hidden = !ehAdmin;
    if (btnNovo.dataset.usuarioNovoConfigurado !== 'true') {
      btnNovo.dataset.usuarioNovoConfigurado = 'true';
      btnNovo.addEventListener('click', () => {
        if (!ehAdmin) {
          setStatus('status-usuario', 'Somente administradores podem criar usuários.', 'erro');
          return;
        }
        reset();
        abrirCardSuspenso('modal-usuario');
      });
    }
  }

  document.getElementById('btn-cancelar-usuario')?.addEventListener('click', () => {
    reset();
    fecharCardSuspenso('modal-usuario');
  });

  if (inputCpf instanceof HTMLInputElement && inputCpf.dataset.maskCpfConfigurado !== 'true') {
    inputCpf.dataset.maskCpfConfigurado = 'true';
    inputCpf.addEventListener('input', () => {
      if (inputCpf.disabled) return;
      const cpf = normalizarCpf(inputCpf.value).slice(0, 11);
      if (!cpf) {
        inputCpf.value = '';
        return;
      }

      let texto = cpf;
      if (cpf.length > 3) texto = `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
      if (cpf.length > 6) texto = `${texto.slice(0, 7)}.${texto.slice(7)}`;
      if (cpf.length > 9) texto = `${texto.slice(0, 11)}-${texto.slice(11)}`;
      inputCpf.value = texto;
    });
  }

  const filtrosUsuarios = [
    ['filtro-usuario-busca', 'input'],
    ['filtro-usuario-perfil', 'change'],
    ['filtro-usuario-status', 'change'],
    ['filtro-usuario-ordenacao', 'change'],
  ];

  filtrosUsuarios.forEach(([id, evento]) => {
    const el = document.getElementById(id);
    if (!el || el.dataset.usuarioFiltroConfigurado === 'true') return;
    el.dataset.usuarioFiltroConfigurado = 'true';
    el.addEventListener(evento, () => renderListaUsuariosSistema());
  });

  if (form.dataset.usuarioSubmitConfigurado !== 'true') {
    form.dataset.usuarioSubmitConfigurado = 'true';
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const idEdicao = inputValue('usuario-id-edicao');
      const editando = Boolean(idEdicao);
      const usuarioAlvo = editando ? estado.usuarios.find((item) => item.id === idEdicao) : null;

      if (!editando && !ehAdmin) {
        setStatus('status-usuario', 'Somente administradores podem criar usuários.', 'erro');
        return;
      }

      if (editando && (!usuarioAlvo || !usuarioPodeEditar(usuarioSessao, usuarioAlvo))) {
        setStatus('status-usuario', 'Você não tem permissão para editar este usuário.', 'erro');
        return;
      }

      const nome = inputValue('usuario-nome');
      const cpfNovo = normalizarCpf(inputValue('usuario-cpf'));
      const cpfFinal = editando ? normalizarCpf(usuarioAlvo?.cpf || usuarioAlvo?.id) : cpfNovo;
      const email = inputValue('usuario-email').toLowerCase();
      const contato = inputValue('usuario-contato');
      const login = inputValue('usuario-login').toLowerCase();
      const perfilDigitado = inputValue('usuario-perfil');
      const perfil = editando && !ehAdmin ? String(usuarioAlvo?.perfil || '') : perfilDigitado;
      const senha = inputValue('usuario-senha');
      const confirmar = inputValue('usuario-senha-confirmar');

      if (!nome || !cpfFinal || !email || !contato || !login || !perfil) {
        setStatus('status-usuario', 'Preencha todos os campos obrigatórios do usuário.', 'erro');
        return;
      }

      if (!editando && !validarCpf(cpfFinal)) {
        setStatus('status-usuario', 'Informe um CPF válido para o usuário.', 'erro');
        return;
      }

      if (!validarEmailBasico(email)) {
        setStatus('status-usuario', 'Informe um e-mail válido.', 'erro');
        return;
      }

      if (senha || confirmar) {
        if (senha !== confirmar) {
          setStatus('status-usuario', 'As senhas não conferem.', 'erro');
          return;
        }
        if (senha.length < 6) {
          setStatus('status-usuario', 'A senha precisa ter ao menos 6 caracteres.', 'erro');
          return;
        }
      } else if (!editando) {
        setStatus('status-usuario', 'Defina uma senha para o novo usuário.', 'erro');
        return;
      }

      const existeCpf = estado.usuarios.some(
        (item) => normalizarCpf(item.cpf || item.id) === cpfFinal && item.id !== idEdicao,
      );
      if (existeCpf) {
        setStatus('status-usuario', 'Já existe um usuário com esse CPF.', 'erro');
        return;
      }

      const existeLogin = estado.usuarios.some(
        (item) => String(item.login || '').toLowerCase() === login && item.id !== idEdicao,
      );
      if (existeLogin) {
        setStatus('status-usuario', 'Já existe um usuário com esse login.', 'erro');
        return;
      }

      const base = editando && usuarioAlvo ? { ...usuarioAlvo } : {};
      const usuarioAtualizado = {
        ...base,
        id: cpfFinal,
        cpf: cpfFinal,
        nome,
        email,
        contato,
        login,
        perfil,
        senhaHash: base.senhaHash || '',
        ativo: editando ? Boolean(base.ativo) : true,
        criadoEm: base.criadoEm || new Date().toISOString(),
      };

      if (senha) {
        usuarioAtualizado.senhaHash = encode(senha);
      }

      if (!usuarioAtualizado.senhaHash) {
        setStatus('status-usuario', 'Defina uma senha válida para o usuário.', 'erro');
        return;
      }

      if (editando && usuarioAlvo) {
        const idx = estado.usuarios.findIndex((item) => item.id === usuarioAlvo.id);
        if (idx < 0) return;
        estado.usuarios[idx] = usuarioAtualizado;
        registrarAuditoria({
          acao: 'editar',
          entidade: 'usuario',
          alvoId: usuarioAtualizado.id,
          detalhes: `Usuário ${usuarioAtualizado.login} atualizado (${rotuloPerfilAcesso(usuarioAtualizado.perfil)}).`,
        });
        setStatus('status-usuario', 'Usuário atualizado com sucesso.', 'ok');
      } else {
        estado.usuarios.unshift(usuarioAtualizado);
        registrarAuditoria({
          acao: 'criar',
          entidade: 'usuario',
          alvoId: usuarioAtualizado.id,
          detalhes: `Usuário ${usuarioAtualizado.login} cadastrado (${rotuloPerfilAcesso(usuarioAtualizado.perfil)}).`,
        });
        setStatus('status-usuario', 'Usuário cadastrado com sucesso.', 'ok');
      }

      salvarEstado();
      atualizarSessaoUsuarioSeNecessario(usuarioAtualizado);
      renderListaUsuariosSistema();
      reset();
      fecharCardSuspenso('modal-usuario');
    });
  }

  window.__sistemaUsuarios = { carregarUsuarioNoForm };
  reset();
  renderListaUsuariosSistema();
}

function obterUsuariosFiltradosSistema() {
  const busca = normalizarTextoBusca(inputValue('filtro-usuario-busca'));
  const perfilFiltro = inputValue('filtro-usuario-perfil') || 'todos';
  const statusFiltro = inputValue('filtro-usuario-status') || 'todos';
  const ordenacao = inputValue('filtro-usuario-ordenacao') || 'recentes';

  const filtrados = estado.usuarios.filter((usuario) => {
    const bag = normalizarTextoBusca(
      [
        usuario.nome,
        usuario.login,
        usuario.email,
        usuario.contato,
        formatarCpf(usuario.cpf || usuario.id),
        usuario.perfil,
        usuario.ativo ? 'ativo' : 'inativo',
      ].join(' '),
    );

    const bateBusca = !busca || bag.includes(busca);
    const batePerfil = perfilFiltro === 'todos' || String(usuario.perfil || '') === perfilFiltro;
    const bateStatus =
      statusFiltro === 'todos'
      || (statusFiltro === 'ativo' && Boolean(usuario.ativo))
      || (statusFiltro === 'inativo' && !usuario.ativo);

    return bateBusca && batePerfil && bateStatus;
  });

  const porNome = (a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', { sensitivity: 'base' });
  const porCriacao = (a, b) => new Date(a.criadoEm || 0).getTime() - new Date(b.criadoEm || 0).getTime();
  const porAtivo = (a, b) => Number(Boolean(b.ativo)) - Number(Boolean(a.ativo));

  const ordenados = [...filtrados];
  if (ordenacao === 'recentes') ordenados.sort((a, b) => porCriacao(b, a));
  if (ordenacao === 'antigos') ordenados.sort(porCriacao);
  if (ordenacao === 'nome-asc') ordenados.sort(porNome);
  if (ordenacao === 'nome-desc') ordenados.sort((a, b) => porNome(b, a));
  if (ordenacao === 'ativos-primeiro') ordenados.sort((a, b) => porAtivo(a, b) || porCriacao(b, a));
  if (ordenacao === 'inativos-primeiro') ordenados.sort((a, b) => porAtivo(b, a) || porCriacao(b, a));

  return ordenados;
}

function renderListaUsuariosSistema() {
  const lista = document.getElementById('lista-usuarios');
  const qtd = document.getElementById('qtd-usuarios');
  if (!lista || !qtd) return;

  const usuarioSessao = obterUsuarioSessaoAtual();
  const ehAdmin = usuarioEhAdmin(usuarioSessao);

  const usuariosFiltrados = obterUsuariosFiltradosSistema();
  qtd.textContent = `${usuariosFiltrados.length}/${estado.usuarios.length} usuários`;

  if (!estado.usuarios.length) {
    lista.innerHTML = `<div class="vazio">Nenhum usuário cadastrado.</div>`;
    return;
  }

  if (!usuariosFiltrados.length) {
    lista.innerHTML = `<div class="vazio">Nenhum usuário encontrado com os filtros atuais.</div>`;
    return;
  }

  lista.innerHTML = usuariosFiltrados
    .map((usuario) => {
      const cpfExibicao = formatarCpf(usuario.cpf || usuario.id);
      const emailExibicao = String(usuario.email || '').trim() || 'E-mail não informado';
      const contatoExibicao = formatarContato(usuario.contato);
      const podeEditar = usuarioPodeEditar(usuarioSessao, usuario);
      const perfilClasse = String(usuario.perfil || '').toLowerCase();
      const perfilRotulo = rotuloPerfilAcesso(usuario.perfil);
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
            <h4>${usuario.nome} <span class="usuario-perfil-selo perfil-${perfilClasse}">${perfilRotulo}</span></h4>
            <p>${usuario.login} • ${usuario.perfil} • ${usuario.ativo ? 'Ativo' : 'Inativo'}</p>
            <p>CPF: ${cpfExibicao} • ${emailExibicao} • ${contatoExibicao}</p>
            <p class="texto-suave">Criado em ${formatarData(usuario.criadoEm)}</p>
            <div class="item-acoes">
              ${podeEditar ? `<button class="mini-btn" type="button" data-editar-usuario="${usuario.id}">Editar</button>` : ''}
              ${ehAdmin ? `
              <button class="mini-btn" type="button" data-toggle-usuario="${usuario.id}">
                ${usuario.ativo ? 'Inativar' : 'Ativar'}
              </button>
              ` : ''}
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  lista.querySelectorAll('[data-editar-usuario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-editar-usuario');
      window.__sistemaUsuarios?.carregarUsuarioNoForm(id);
    });
  });

  lista.querySelectorAll('[data-toggle-usuario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!ehAdmin) {
        setStatus('status-usuario', 'Somente administradores podem ativar ou inativar usuários.', 'erro');
        return;
      }
      const id = btn.getAttribute('data-toggle-usuario');
      const usuario = estado.usuarios.find((item) => item.id === id);
      if (!usuario) return;

      usuario.ativo = !usuario.ativo;
      registrarAuditoria({
        acao: usuario.ativo ? 'ativar' : 'inativar',
        entidade: 'usuario',
        alvoId: usuario.id,
        detalhes: `Conta ${usuario.login} ${usuario.ativo ? 'ativada' : 'inativada'}.`,
      });
      salvarEstado();
      renderListaUsuariosSistema();
      atualizarSessaoUsuarioSeNecessario(usuario);
      setStatus('status-usuario', `Usuário ${usuario.ativo ? 'ativado' : 'inativado'} com sucesso.`, 'ok');
    });
  });

}

function configurarAuditoriaSistema() {
  const lista = document.getElementById('lista-auditoria');
  if (!lista) return;

  const usuarioSessao = obterUsuarioSessaoAtual();
  if (!usuarioEhAdmin(usuarioSessao)) return;

  const filtros = [
    ['filtro-auditoria-busca', 'input'],
    ['filtro-auditoria-entidade', 'change'],
    ['filtro-auditoria-ator', 'change'],
  ];

  filtros.forEach(([id, evento]) => {
    const el = document.getElementById(id);
    if (!el || el.dataset.auditoriaFiltroConfigurado === 'true') return;
    el.dataset.auditoriaFiltroConfigurado = 'true';
    el.addEventListener(evento, () => {
      auditoriaPaginaAtual = 1;
      renderListaAuditoriaSistema();
    });
  });

  const btnExportarCsv = document.getElementById('btn-exportar-auditoria-csv');
  if (btnExportarCsv && btnExportarCsv.dataset.auditoriaCsvConfigurado !== 'true') {
    btnExportarCsv.dataset.auditoriaCsvConfigurado = 'true';
    btnExportarCsv.addEventListener('click', () => {
      const logs = obterLogsAuditoriaFiltrados();
      if (!logs.length) {
        setStatus('status-auditoria', 'Não há logs para exportar com os filtros atuais.', 'aviso');
        return;
      }

      const cabecalho = ['Data/Hora', 'Ação', 'Entidade', 'Alvo', 'Usuário', 'Login', 'Perfil', 'Detalhes'];
      const linhas = logs.map((item) => [
        formatarDataHora(item.criadoEm),
        item.acao,
        item.entidade,
        item.alvoId || '',
        item.usuarioNome || '',
        item.usuarioLogin || '',
        rotuloPerfilAcesso(item.usuarioPerfil || 'publico'),
        item.detalhes || '',
      ]);

      const conteudoCsv = [cabecalho, ...linhas]
        .map((colunas) => colunas.map((coluna) => escaparCsv(coluna)).join(';'))
        .join('\n');

      const blob = new Blob(['\uFEFF', conteudoCsv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const data = new Date();
      const sufixo = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}_${String(data.getHours()).padStart(2, '0')}${String(data.getMinutes()).padStart(2, '0')}${String(data.getSeconds()).padStart(2, '0')}`;

      link.href = url;
      link.download = `auditoria-canil-vilhena-${sufixo}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      registrarAuditoria({
        acao: 'exportar-csv',
        entidade: 'auditoria',
        detalhes: `Exportação CSV da auditoria com ${logs.length} registros.`,
      });
      setStatus('status-auditoria', 'Arquivo CSV exportado com sucesso.', 'ok');
    });
  }

  const btnLimpar = document.getElementById('btn-limpar-auditoria');
  if (btnLimpar && btnLimpar.dataset.auditoriaLimparConfigurado !== 'true') {
    btnLimpar.dataset.auditoriaLimparConfigurado = 'true';
    btnLimpar.addEventListener('click', () => {
      const confirmou = window.confirm('Deseja limpar todo o histórico de auditoria?');
      if (!confirmou) return;

      estado.auditoria = [];
      auditoriaPaginaAtual = 1;
      persistentStorage.setItem(STORAGE_KEYS.auditoria, JSON.stringify(estado.auditoria));
      registrarAuditoria({
        acao: 'limpar-logs',
        entidade: 'auditoria',
        detalhes: 'Histórico de auditoria limpo manualmente.',
      });
      setStatus('status-auditoria', 'Logs de auditoria limpos.', 'ok');
      renderListaAuditoriaSistema();
    });
  }

  renderListaAuditoriaSistema();
}

function obterLogsAuditoriaFiltrados() {
  const busca = normalizarTextoBusca(inputValue('filtro-auditoria-busca'));
  const entidadeFiltro = inputValue('filtro-auditoria-entidade') || 'todas';
  const perfilFiltro = inputValue('filtro-auditoria-ator') || 'todos';

  const registros = Array.isArray(estado.auditoria) ? [...estado.auditoria] : [];
  registros.sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime());

  return registros.filter((item) => {
    const bag = normalizarTextoBusca([
      item.acao,
      item.entidade,
      item.alvoId,
      item.detalhes,
      item.usuarioNome,
      item.usuarioLogin,
      item.usuarioPerfil,
    ].join(' '));

    const bateBusca = !busca || bag.includes(busca);
    const bateEntidade = entidadeFiltro === 'todas' || String(item.entidade || '') === entidadeFiltro;
    const batePerfil = perfilFiltro === 'todos' || String(item.usuarioPerfil || '') === perfilFiltro;

    return bateBusca && bateEntidade && batePerfil;
  });
}

function renderListaAuditoriaSistema() {
  const lista = document.getElementById('lista-auditoria');
  const badge = document.getElementById('qtd-auditoria');
  const paginacao = document.getElementById('auditoria-paginacao');
  if (!lista || !badge) return;

  const usuarioSessao = obterUsuarioSessaoAtual();
  if (!usuarioEhAdmin(usuarioSessao)) {
    lista.innerHTML = '';
    badge.textContent = '';
    if (paginacao) paginacao.innerHTML = '';
    return;
  }

  const logsFiltrados = obterLogsAuditoriaFiltrados();
  const total = Array.isArray(estado.auditoria) ? estado.auditoria.length : 0;
  badge.textContent = `${logsFiltrados.length}/${total} registros`;

  if (!total) {
    lista.innerHTML = '<div class="vazio">Nenhum log de auditoria registrado ainda.</div>';
    if (paginacao) paginacao.innerHTML = '';
    return;
  }

  if (!logsFiltrados.length) {
    lista.innerHTML = '<div class="vazio">Nenhum log encontrado com os filtros atuais.</div>';
    if (paginacao) paginacao.innerHTML = '';
    return;
  }

  const totalPaginas = Math.max(1, Math.ceil(logsFiltrados.length / AUDITORIA_LOGS_POR_PAGINA));
  auditoriaPaginaAtual = Math.min(Math.max(1, auditoriaPaginaAtual), totalPaginas);
  const inicio = (auditoriaPaginaAtual - 1) * AUDITORIA_LOGS_POR_PAGINA;
  const logsPaginados = logsFiltrados.slice(inicio, inicio + AUDITORIA_LOGS_POR_PAGINA);

  lista.innerHTML = logsPaginados
    .map((item) => {
      const acao = escaparHtml(String(item.acao || '').replace(/-/g, ' '));
      const entidade = escaparHtml(item.entidade || 'sistema');
      const detalhes = escaparHtml(item.detalhes || 'Sem detalhes');
      const alvo = escaparHtml(item.alvoId || '—');
      const usuario = escaparHtml(item.usuarioNome || 'Usuário não identificado');
      const login = escaparHtml(item.usuarioLogin || '—');
      const perfil = escaparHtml(rotuloPerfilAcesso(item.usuarioPerfil || 'publico'));
      const quando = formatarDataHora(item.criadoEm);

      return `
        <article class="painel auditoria-item">
          <div class="auditoria-topo">
            <h4>${acao} • ${entidade}</h4>
            <span class="badge">${quando}</span>
          </div>
          <p class="texto-suave">Usuário: <strong>${usuario}</strong> (${login}) • Perfil: ${perfil}</p>
          <p class="texto-suave">Alvo: ${alvo}</p>
          <p>${detalhes}</p>
        </article>
      `;
    })
    .join('');

  renderPaginacaoNumerica({
    alvo: paginacao,
    totalPaginas,
    paginaAtual: auditoriaPaginaAtual,
    onChange: (novaPagina) => {
      auditoriaPaginaAtual = novaPagina;
      renderListaAuditoriaSistema();
      document.getElementById('lista-auditoria')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });
}

function readSessionUser() {
  try {
    const bruto = sessionStore.getItem(SESSION_KEYS.usuario);
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

  let carouselInfo = JSON.parse(persistentStorage.getItem("pv_semana_pets_info_12")) || null; let jaMostrados = JSON.parse(persistentStorage.getItem("pv_pets_ja_mostrados_12")) || [];
  
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
      
      persistentStorage.setItem("pv_semana_pets_info_12", JSON.stringify(carouselInfo));
      persistentStorage.setItem("pv_pets_ja_mostrados_12", JSON.stringify(jaMostrados));
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











