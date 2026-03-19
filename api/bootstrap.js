// api/bootstrap.js
// Ponto de entrada para seed inicial e migrações de dados. Não requer auth.
// Auto-protegido: só insere dados se ainda não existirem no banco.

const { getSupabaseAdmin } = require('./_supabase');

// ─── Seeds de usuários (senhas em base64 — altere após o primeiro acesso) ───
const SEED_USUARIOS = [
  {
    id: 'usr-admin',
    nome: 'Administrador do Sistema',
    login: 'admin',
    senhaHash: Buffer.from('admin123').toString('base64'),
    perfil: 'admin',
    ativo: true,
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-vet',
    nome: 'Dra. Paula Mendes',
    login: 'paula.vet',
    senhaHash: Buffer.from('vet12345').toString('base64'),
    perfil: 'veterinario',
    ativo: true,
    criadoEm: '2026-01-15T00:00:00.000Z',
  },
];

// ─── Seeds iniciais de animais ───
const SEED_ANIMAIS = [
  {
    id: 'pet-nina', nome: 'Nina', especie: 'cão', idade: 2, porte: 'Médio', sexo: 'Fêmea',
    status: 'disponível', energia: 'Alta', temperamento: 'Brincalhona, sociável e muito carinhosa',
    vacinado: true, castrado: true,
    descricao: 'Nina ama passeios, se dá bem com outros cães e adora pessoas. Excelente para famílias ativas.',
    bairroResgate: 'Cristo Rei', observacaoInterna: 'Responder bem ao treino com petiscos. Evitar longos períodos sozinha.',
    adotante: '', telefoneAdotante: '',
    galeria: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80'],
    fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 45, zoom: 1.14, brilho: 106, contraste: 106, saturacao: 115 },
    atualizadoEm: '2026-02-10T10:18:00.000Z',
  },
  {
    id: 'pet-luke', nome: 'Luke', especie: 'cão', idade: 4, porte: 'Grande', sexo: 'Macho',
    status: 'em tratamento', energia: 'Média', temperamento: 'Leal, atento e calmo no dia a dia',
    vacinado: true, castrado: false,
    descricao: 'Luke foi resgatado recentemente e está em recuperação de pele. Já aceita coleira e comandos básicos.',
    bairroResgate: 'Jardim América', observacaoInterna: 'Manter medicação dermatológica até liberação veterinária.',
    adotante: '', telefoneAdotante: '',
    galeria: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1575859431774-2e57ed632664?auto=format&fit=crop&w=1200&q=80'],
    fotoPerfilIndex: 1, fotoPerfilAjuste: { x: 52, y: 38, zoom: 1.2, brilho: 100, contraste: 103, saturacao: 102 },
    atualizadoEm: '2026-02-10T08:02:00.000Z',
  },
  {
    id: 'pet-luna', nome: 'Luna', especie: 'gato', idade: 1.5, porte: 'Pequeno', sexo: 'Fêmea',
    status: 'disponível', energia: 'Média', temperamento: 'Curiosa, dócil e observadora',
    vacinado: true, castrado: true,
    descricao: 'Luna gosta de ambientes tranquilos, usa caixa de areia e se adapta bem em apartamento.',
    bairroResgate: 'Bela Vista', observacaoInterna: 'Acompanha bem com enriquecimento ambiental e arranhador vertical.',
    adotante: '', telefoneAdotante: '',
    galeria: ['https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80'],
    fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 44, zoom: 1.16, brilho: 108, contraste: 108, saturacao: 120 },
    atualizadoEm: '2026-02-09T16:30:00.000Z',
  },
  {
    id: 'pet-bento', nome: 'Bento', especie: 'cão', idade: 0.8, porte: 'Pequeno', sexo: 'Macho',
    status: 'disponível', energia: 'Alta', temperamento: 'Divertido, esperto e cheio de energia',
    vacinado: true, castrado: false,
    descricao: 'Bento é um filhote ativo, adora brincar e aprende rápido. Ideal para quem tem tempo de interação diária.',
    bairroResgate: 'São José', observacaoInterna: 'Treino de socialização em andamento. Já responde ao nome.',
    adotante: '', telefoneAdotante: '',
    galeria: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1546975490-e8b92a360b24?auto=format&fit=crop&w=1200&q=80'],
    fotoPerfilIndex: 2, fotoPerfilAjuste: { x: 48, y: 46, zoom: 1.22, brilho: 111, contraste: 110, saturacao: 124 },
    atualizadoEm: '2026-02-08T13:42:00.000Z',
  },
  {
    id: 'pet-amelie', nome: 'Amélie', especie: 'gato', idade: 3, porte: 'Pequeno', sexo: 'Fêmea',
    status: 'adotado', energia: 'Baixa', temperamento: 'Tranquila e muito afetuosa',
    vacinado: true, castrado: true,
    descricao: 'Amélie encontrou um lar e segue em acompanhamento pós-adoção com excelente adaptação.',
    bairroResgate: 'Parque São Paulo', observacaoInterna: 'Adoção concluída com checklist completo e orientações entregues.',
    adotante: 'Marina C.', telefoneAdotante: '(69) 9 9123-4400',
    galeria: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80'],
    fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 52, y: 47, zoom: 1.1, brilho: 102, contraste: 102, saturacao: 106 },
    atualizadoEm: '2026-02-05T11:05:00.000Z',
  },
];

// ─── Seeds iniciais de blog posts ───
const SEED_POSTS = [
  { id: 'post-1', titulo: '5 passos para uma adoção responsável', resumo: 'Entenda rotina, gastos, adaptação da casa e como preparar toda a família para receber um novo companheiro.', categoria: 'Adoção', data: '2026-02-08' },
  { id: 'post-2', titulo: 'Adaptação dos primeiros 7 dias', resumo: 'Saiba como reduzir ansiedade do pet recém-adotado com espaço seguro, horários previsíveis e acolhimento gradual.', categoria: 'Bem-estar', data: '2026-01-29' },
  { id: 'post-3', titulo: 'Vacinas essenciais para cães e gatos', resumo: 'Calendário básico de imunização e sinais de alerta para manter a saúde do pet em dia.', categoria: 'Saúde', data: '2026-01-20' },
  { id: 'post-4', titulo: 'Como apresentar o pet para crianças', resumo: 'Orientações práticas para criar convivência respeitosa e segura entre animais e crianças.', categoria: 'Família', data: '2026-01-12' },
  { id: 'post-5', titulo: 'Checklist da casa antes da adoção', resumo: 'Itens de segurança, alimentação e higiene que evitam estresse no início da nova rotina.', categoria: 'Preparação', data: '2025-12-22' },
];

// ─── Seeds extras (migração v2) ───
const EXTRA_ANIMAIS = [
  { id: 'pet-bidu', nome: 'Bidu', especie: 'cão', idade: 1.2, porte: 'Pequeno', sexo: 'Macho', status: 'disponível', energia: 'Média', temperamento: 'Sociável, curioso e afetuoso', vacinado: true, castrado: true, descricao: 'Bidu adora companhia e passeios curtos. Excelente para apartamento com rotina estável.', bairroResgate: 'Centro', observacaoInterna: 'Boa adaptação com guia peitoral.', adotante: '', telefoneAdotante: '', galeria: ['https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 46, zoom: 1.12, brilho: 107, contraste: 106, saturacao: 114 }, atualizadoEm: '2026-02-18T10:20:00.000Z' },
  { id: 'pet-frida', nome: 'Frida', especie: 'gato', idade: 2.4, porte: 'Pequeno', sexo: 'Fêmea', status: 'disponível', energia: 'Baixa', temperamento: 'Calma, observadora e dócil', vacinado: true, castrado: true, descricao: 'Frida gosta de ambientes silenciosos e rotina previsível. Ideal para companhia tranquila.', bairroResgate: 'Nova Esperança', observacaoInterna: 'Adaptação ótima com arranhador.', adotante: '', telefoneAdotante: '', galeria: ['https://images.unsplash.com/photo-1571566882372-1598d88abd90?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 52, y: 42, zoom: 1.15, brilho: 103, contraste: 104, saturacao: 109 }, atualizadoEm: '2026-02-18T08:35:00.000Z' },
  { id: 'pet-simba', nome: 'Simba', especie: 'cão', idade: 3.1, porte: 'Grande', sexo: 'Macho', status: 'disponível', energia: 'Média', temperamento: 'Companheiro, leal e brincalhão', vacinado: true, castrado: true, descricao: 'Simba é equilibrado e obediente. Vai bem com rotina de passeios e interação diária.', bairroResgate: 'São Cristóvão', observacaoInterna: 'Bom com crianças acima de 8 anos.', adotante: '', telefoneAdotante: '', galeria: ['https://images.unsplash.com/photo-1583337130417-3346a1f3d3b1?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 45, zoom: 1.16, brilho: 106, contraste: 107, saturacao: 112 }, atualizadoEm: '2026-02-17T16:10:00.000Z' },
  { id: 'pet-pipoca', nome: 'Pipoca', especie: 'gato', idade: 0.9, porte: 'Pequeno', sexo: 'Fêmea', status: 'disponível', energia: 'Alta', temperamento: 'Brincalhona e curiosa', vacinado: true, castrado: false, descricao: 'Pipoca é jovem, ativa e cheia de personalidade. Ama brinquedos interativos.', bairroResgate: 'Parque Industrial', observacaoInterna: 'Em processo final para castração.', adotante: '', telefoneAdotante: '', galeria: ['https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1615796153287-2f5b9f2f0b44?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 1, fotoPerfilAjuste: { x: 51, y: 43, zoom: 1.19, brilho: 109, contraste: 110, saturacao: 121 }, atualizadoEm: '2026-02-16T12:44:00.000Z' },
  { id: 'pet-jorge', nome: 'Jorge', especie: 'cão', idade: 5, porte: 'Médio', sexo: 'Macho', status: 'disponível', energia: 'Baixa', temperamento: 'Calmo, companheiro e gentil', vacinado: true, castrado: true, descricao: 'Jorge é ideal para rotina tranquila e gosta de ficar perto das pessoas.', bairroResgate: 'Cidade Verde', observacaoInterna: 'Ótimo comportamento em ambiente interno.', adotante: '', telefoneAdotante: '', galeria: ['https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 45, zoom: 1.11, brilho: 104, contraste: 103, saturacao: 104 }, atualizadoEm: '2026-02-15T09:05:00.000Z' },
];

const EXTRA_POSTS = [
  { id: 'post-6', titulo: 'Passeios seguros: guia rápido para iniciantes', resumo: 'Equipamentos, tempo ideal e sinais de estresse para um passeio positivo.', categoria: 'Rotina', data: '2026-02-15', autor: 'Equipe Canil de Vilhena', capa: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80', conteudo: 'Passear com segurança começa com guia adequada, identificação e atenção ao clima. Em dias quentes, prefira horários mais frescos. Observe o comportamento do pet: bocejos excessivos, tentativa de fuga e respiração ofegante podem indicar estresse. O ideal é construir uma rotina gradual para reforçar confiança e socialização.', publicado: true },
  { id: 'post-7', titulo: 'Como preparar seu primeiro fim de semana com o novo pet', resumo: 'Checklist prático para tornar os primeiros dias leves para todos.', categoria: 'Adaptação', data: '2026-02-12', autor: 'Equipe Canil de Vilhena', capa: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80', conteudo: 'Organize um espaço tranquilo, mantenha água e alimentação em horários previsíveis e evite visitas excessivas no início. O pet precisa reconhecer cheiros e sons da casa com calma. Brinquedos de enriquecimento e passeios curtos ajudam a reduzir ansiedade. A consistência da rotina acelera o vínculo.', publicado: true },
  { id: 'post-8', titulo: 'Convivência com outros pets: primeiros encontros', resumo: 'Estratégias para integração gradual e segura entre animais.', categoria: 'Comportamento', data: '2026-02-03', autor: 'Equipe Canil de Vilhena', capa: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80', conteudo: 'Apresente os pets em ambiente neutro e com controle de distância. Reforço positivo e sessões curtas são mais eficientes do que aproximações forçadas. Observe postura corporal e interrompa antes do desconforto crescer. Com tempo e previsibilidade, a convivência tende a se estabilizar.', publicado: true },
];

// ─── Seeds do fluxo v3 ───
const FLOW_ANIMAIS = [
  { id: 'pet-farofa', nome: 'Farofa', especie: 'cão', idade: 2.7, porte: 'Médio', sexo: 'Fêmea', status: 'disponível', energia: 'Média', temperamento: 'Carinhosa, dócil e companheira', vacinado: true, castrado: true, descricao: 'Farofa gosta de rotina tranquila, se adapta bem a famílias e adora interação com adultos e crianças.', bairroResgate: 'Bodanese', observacaoInterna: 'Boa adaptação com guia e comandos básicos.', adotante: '', telefoneAdotante: '', galeria: ['https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 44, zoom: 1.15, brilho: 106, contraste: 106, saturacao: 112 }, atualizadoEm: '2026-03-03T10:12:00.000Z' },
  { id: 'pet-tobias', nome: 'Tobias', especie: 'cão', idade: 1.9, porte: 'Pequeno', sexo: 'Macho', status: 'disponível', energia: 'Alta', temperamento: 'Brincalhão, alegre e muito sociável', vacinado: true, castrado: true, descricao: 'Tobias é ativo e ideal para famílias com rotina de passeios e brincadeiras diárias.', bairroResgate: 'Jardim Eldorado', observacaoInterna: 'Excelente resposta a treino com reforço positivo.', adotante: '', telefoneAdotante: '', galeria: ['https://images.unsplash.com/photo-1583512603784-a8e6f2a6f6f9?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 49, y: 43, zoom: 1.18, brilho: 108, contraste: 109, saturacao: 118 }, atualizadoEm: '2026-03-01T15:40:00.000Z' },
  { id: 'pet-margarida', nome: 'Margarida', especie: 'gato', idade: 4.2, porte: 'Pequeno', sexo: 'Fêmea', status: 'adotado', energia: 'Baixa', temperamento: 'Calma, afetuosa e observadora', vacinado: true, castrado: true, descricao: 'Margarida encontrou um lar e está em adaptação excelente, com retorno positivo da família adotante.', bairroResgate: 'Centro', observacaoInterna: 'Adoção concluída com orientações pós-adoção entregues.', adotante: 'Luciana e Paulo', telefoneAdotante: '(69) 9 9888-4421', galeria: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 51, y: 45, zoom: 1.13, brilho: 104, contraste: 104, saturacao: 109 }, atualizadoEm: '2026-02-28T09:10:00.000Z' },
  { id: 'pet-bolota', nome: 'Bolota', especie: 'cão', idade: 6.1, porte: 'Grande', sexo: 'Macho', status: 'em tratamento', energia: 'Baixa', temperamento: 'Gentil e tranquilo', vacinado: true, castrado: false, descricao: 'Bolota está em recuperação veterinária e ainda não está apto para adoção.', bairroResgate: 'Parque Cidade Nova', observacaoInterna: 'Acompanhamento clínico quinzenal.', adotante: '', telefoneAdotante: '', galeria: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 42, zoom: 1.12, brilho: 101, contraste: 102, saturacao: 103 }, atualizadoEm: '2026-02-26T11:30:00.000Z' },
];

const FLOW_POSTS = [
  { id: 'post-9', titulo: 'Adoção responsável: checklist atualizado para famílias', resumo: 'Guia prático com itens essenciais para receber um pet em casa com segurança e acolhimento.', categoria: 'Adoção', data: '2026-03-02', autor: 'Equipe Canil de Vilhena', capa: 'https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=1200&q=80', conteudo: 'Antes da adoção, prepare ambiente seguro, rotina de alimentação e horários de adaptação. O acolhimento nos primeiros dias é decisivo para o bem-estar do animal e da família. A equipe técnica recomenda acompanhamento inicial para orientar comportamento, socialização e saúde preventiva.', publicado: true },
  { id: 'post-10', titulo: 'Convivência entre pets: integração gradual funciona melhor', resumo: 'Dicas de aproximação segura para quem já tem animais e vai adotar mais um companheiro.', categoria: 'Comportamento', data: '2026-02-27', autor: 'Equipe Canil de Vilhena', capa: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80', conteudo: 'A integração entre animais deve ocorrer em etapas curtas, com supervisão e reforço positivo. Evitar contato forçado reduz estresse e favorece adaptação consistente. O processo é mais eficiente quando a família mantém previsibilidade de rotina e espaços individuais no início.', publicado: true },
  { id: 'post-11', titulo: 'Adoções de fevereiro: mais finais felizes em Vilhena', resumo: 'Balanço mensal mostra avanço nas adoções e destaca histórias de recuperação e cuidado.', categoria: 'Notícia', data: '2026-02-25', autor: 'Assessoria do Canil Municipal', capa: 'https://images.unsplash.com/photo-1558944351-cb5e2b3c84a4?auto=format&fit=crop&w=1200&q=80', conteudo: 'O mês de fevereiro registrou novas adoções responsáveis com acompanhamento técnico da equipe. Além da adoção, o monitoramento pós-lar reforça a política de bem-estar animal e amplia a conscientização da população sobre guarda responsável.', publicado: true },
];

const FLOW_INTERESSES = [
  { id: 'int-seed-1', petId: 'pet-nina', petNome: 'Nina', nome: 'Fernanda Souza', whatsapp: '(69) 9 9154-2201', email: 'fernanda.souza@email.com', cidade: 'Vilhena - Centro', mensagem: 'Tenho rotina estável, casa com quintal seguro e experiência com cães de médio porte.', criadoEm: '2026-03-03T14:20:00.000Z', origem: 'site' },
  { id: 'int-seed-2', petId: 'pet-luna', petNome: 'Luna', nome: 'Ricardo Nunes', whatsapp: '(69) 9 9231-4409', email: 'ricardo.nunes@email.com', cidade: 'Vilhena - Bodanese', mensagem: 'Moro em apartamento, trabalho em home office e posso acompanhar adaptação da gata com calma.', criadoEm: '2026-03-02T10:05:00.000Z', origem: 'site' },
  { id: 'int-seed-3', petId: 'pet-simba', petNome: 'Simba', nome: 'João Pedro Lima', whatsapp: '(69) 9 9941-3312', email: 'joaopedro.lima@email.com', cidade: 'Vilhena - Jardim América', mensagem: 'Tenho espaço e disponibilidade para passeios diários. Família já aprovada para adoção.', criadoEm: '2026-03-01T17:48:00.000Z', origem: 'site' },
  { id: 'int-seed-4', petId: 'pet-farofa', petNome: 'Farofa', nome: 'Camila Azevedo', whatsapp: '(69) 9 9811-2203', email: 'camila.azevedo@email.com', cidade: 'Vilhena - Cristo Rei', mensagem: 'Casa ampla, família presente e disponibilidade para acompanhamento veterinário inicial.', criadoEm: '2026-03-01T08:32:00.000Z', origem: 'site' },
];

const FLOW_DENUNCIAS = [
  { id: 'den-seed-1', local: 'Avenida Major Amarante, próximo à praça', descricao: 'Cachorro aparentemente abandonado há dois dias, sem coleira e com sinais de desnutrição.', contato: 'Ana Paula • (69) 9 9300-1188', origem: 'contato', criadoEm: '2026-03-03T09:40:00.000Z' },
  { id: 'den-seed-2', local: 'Bairro Jardim Primavera, rua sem saída', descricao: 'Ninhada de gatos em terreno baldio, sem acesso regular a água e alimento.', contato: 'Rogério • (69) 9 9455-7722', origem: 'contato', criadoEm: '2026-03-02T16:12:00.000Z' },
  { id: 'den-seed-3', local: 'Setor 19, área de comércio', descricao: 'Animal com ferimento visível na pata traseira circulando entre veículos estacionados.', contato: '(69) 9 9110-5533', origem: 'contato', criadoEm: '2026-03-01T11:07:00.000Z' },
];

// ─── Seeds de testemunhos v4 ───
const TESTEMUNHO_ANIMAIS = [
  { id: 'pet-amora', nome: 'Amora', especie: 'cão', idade: 2.3, porte: 'Médio', sexo: 'Fêmea', status: 'adotado', energia: 'Média', temperamento: 'Doce, companheira e atenta', vacinado: true, castrado: true, descricao: 'Amora foi adotada por uma família com rotina ativa e já participa de passeios diários no bairro.', bairroResgate: 'Jardim das Oliveiras', observacaoInterna: 'Adoção consolidada com retorno positivo no acompanhamento.', adotante: 'Família Almeida', telefoneAdotante: '(69) 9 9766-4012', galeria: ['https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 44, zoom: 1.14, brilho: 106, contraste: 107, saturacao: 113 }, atualizadoEm: '2026-03-04T09:15:00.000Z' },
  { id: 'pet-kiara', nome: 'Kiara', especie: 'gato', idade: 1.8, porte: 'Pequeno', sexo: 'Fêmea', status: 'adotado', energia: 'Média', temperamento: 'Afetuosa e muito curiosa', vacinado: true, castrado: true, descricao: 'Kiara foi adotada por tutores experientes e está adaptada ao novo lar com enriquecimento ambiental.', bairroResgate: 'Centro', observacaoInterna: 'Adaptação excelente após a primeira semana.', adotante: 'Carolina e Denise', telefoneAdotante: '(69) 9 9881-2274', galeria: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 51, y: 44, zoom: 1.13, brilho: 104, contraste: 105, saturacao: 110 }, atualizadoEm: '2026-03-03T14:05:00.000Z' },
  { id: 'pet-paco', nome: 'Paco', especie: 'cão', idade: 3.6, porte: 'Grande', sexo: 'Macho', status: 'adotado', energia: 'Baixa', temperamento: 'Gentil, tranquilo e obediente', vacinado: true, castrado: true, descricao: 'Paco ganhou um lar com quintal amplo e rotina calma, ideal para seu perfil.', bairroResgate: 'São José', observacaoInterna: 'Sem intercorrências no pós-adoção.', adotante: 'Rafael e Luan', telefoneAdotante: '(69) 9 9122-7390', galeria: ['https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 49, y: 43, zoom: 1.12, brilho: 103, contraste: 104, saturacao: 106 }, atualizadoEm: '2026-03-02T11:22:00.000Z' },
  { id: 'pet-mimo', nome: 'Mimo', especie: 'gato', idade: 2.1, porte: 'Pequeno', sexo: 'Macho', status: 'adotado', energia: 'Baixa', temperamento: 'Calmo e muito carinhoso', vacinado: true, castrado: true, descricao: 'Mimo foi adotado por casal idoso e se adaptou muito bem ao ambiente interno.', bairroResgate: 'Jardim Eldorado', observacaoInterna: 'Acompanhamento finalizado com avaliação positiva.', adotante: 'Dona Sônia e Sr. Carlos', telefoneAdotante: '(69) 9 9550-1804', galeria: ['https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 45, zoom: 1.12, brilho: 105, contraste: 105, saturacao: 109 }, atualizadoEm: '2026-03-01T10:35:00.000Z' },
  { id: 'pet-lola', nome: 'Lola', especie: 'cão', idade: 1.5, porte: 'Pequeno', sexo: 'Fêmea', status: 'adotado', energia: 'Alta', temperamento: 'Alegre e muito brincalhona', vacinado: true, castrado: true, descricao: 'Lola foi adotada por família com crianças e está plenamente integrada à rotina da casa.', bairroResgate: 'Parque Cidade Nova', observacaoInterna: 'Tutor responsável e plano vacinal em dia.', adotante: 'Família Santos', telefoneAdotante: '(69) 9 9410-6721', galeria: ['https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80'], fotoPerfilIndex: 0, fotoPerfilAjuste: { x: 50, y: 44, zoom: 1.16, brilho: 108, contraste: 109, saturacao: 117 }, atualizadoEm: '2026-02-28T16:40:00.000Z' },
];

// ─── Utilitário ───
function safeParse(valor, padrao) {
  try {
    const parsed = JSON.parse(valor);
    return parsed !== null && parsed !== undefined ? parsed : padrao;
  } catch {
    return padrao;
  }
}

function mergeById(listaAtual, listaSeed) {
  const mapa = new Map(listaAtual.map((item) => [item.id, item]));
  listaSeed.forEach((seedItem) => {
    if (!mapa.has(seedItem.id)) {
      listaAtual.push(seedItem);
    }
  });
  return listaAtual;
}

// ─── Handler principal ───
module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Método não permitido.' }));
    return;
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Erro de configuração do servidor.' }));
    return;
  }

  // Carrega estado atual do banco
  const { data: rows, error: fetchError } = await supabase
    .from('app_storage')
    .select('chave, valor');

  if (fetchError) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: fetchError.message || 'Erro ao ler banco de dados.' }));
    return;
  }

  const current = Object.fromEntries((rows || []).map((r) => [r.chave, r.valor]));

  // Estado atual ou defaults
  let animais = safeParse(current['pv_animais'], null);
  let posts = safeParse(current['pv_blog_posts'], null);
  let denuncias = safeParse(current['pv_denuncias'], null);
  let interesses = safeParse(current['pv_interesses_adocao'], null);
  let usuarios = safeParse(current['pv_usuarios'], null);

  const isNewAnimais = animais === null;
  const isNewPosts = posts === null;
  const isNewDenuncias = denuncias === null;
  const isNewInteresses = interesses === null;
  const isNewUsuarios = usuarios === null;
  const isNewAuditoria = !current['pv_auditoria_logs'];

  // Inicializa com defaults se ausente
  animais = animais ?? [...SEED_ANIMAIS];
  posts = posts ?? [...SEED_POSTS];
  denuncias = denuncias ?? [];
  interesses = interesses ?? [];
  usuarios = usuarios ?? [...SEED_USUARIOS];

  // Migrações de versão
  const runV2 = current['pv_seed_upgrade_v2'] !== '1';
  const runV3 = current['pv_seed_upgrade_v3'] !== '1';
  const runV4 = current['pv_seed_upgrade_v4'] !== '1';

  if (runV2) {
    animais = mergeById(animais, [...SEED_ANIMAIS, ...EXTRA_ANIMAIS]);
    posts = mergeById(posts, [...SEED_POSTS, ...EXTRA_POSTS]);
    usuarios = mergeById(usuarios, SEED_USUARIOS);
  }

  if (runV3) {
    animais = mergeById(animais, FLOW_ANIMAIS);
    posts = mergeById(posts, FLOW_POSTS);
    interesses = mergeById(interesses, FLOW_INTERESSES);
    denuncias = mergeById(denuncias, FLOW_DENUNCIAS);
  }

  if (runV4) {
    animais = mergeById(animais, TESTEMUNHO_ANIMAIS);
  }

  // Monta lista de upserts necessários
  const upserts = [];

  if (isNewAuditoria) {
    upserts.push({ chave: 'pv_auditoria_logs', valor: '[]' });
  }
  if (isNewDenuncias || runV3) {
    upserts.push({ chave: 'pv_denuncias', valor: JSON.stringify(denuncias) });
  }
  if (isNewInteresses || runV3) {
    upserts.push({ chave: 'pv_interesses_adocao', valor: JSON.stringify(interesses) });
  }
  if (isNewAnimais || runV2 || runV3 || runV4) {
    upserts.push({ chave: 'pv_animais', valor: JSON.stringify(animais) });
  }
  if (isNewPosts || runV2 || runV3) {
    upserts.push({ chave: 'pv_blog_posts', valor: JSON.stringify(posts) });
  }
  if (isNewUsuarios || runV2) {
    upserts.push({ chave: 'pv_usuarios', valor: JSON.stringify(usuarios) });
  }
  if (runV2) upserts.push({ chave: 'pv_seed_upgrade_v2', valor: '1' });
  if (runV3) upserts.push({ chave: 'pv_seed_upgrade_v3', valor: '1' });
  if (runV4) upserts.push({ chave: 'pv_seed_upgrade_v4', valor: '1' });

  if (upserts.length > 0) {
    const { error: upsertError } = await supabase
      .from('app_storage')
      .upsert(upserts, { onConflict: 'chave' });

    if (upsertError) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: upsertError.message || 'Erro ao salvar seeds.' }));
      return;
    }
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, seeded: upserts.length > 0 }));
};
