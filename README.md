# Canil Municipal de Vilhena (RO)

Site público e sistema de gestão do Canil Municipal: divulga pets para adoção,
publica conteúdo no blog, recebe denúncias e ainda tem uma área restrita para a
equipe gerenciar tudo isso.

O projeto é **HTML, CSS e JavaScript puros** (sem framework e sem etapa de build),
com **banco SQLite local** versionado junto do código. Não depende de nenhum
serviço externo: não há Supabase, Vercel ou nuvem.

---

## Como rodar

Requisitos: **Node.js 20 ou superior**. O banco usa `better-sqlite3` (um único
pacote nativo), por isso instala apenas uma dependência e roda em qualquer
ambiente Node, incluindo o Node 20 do Vercel.

```bash
npm run dev
```

Abre em <http://localhost:4173> com site **e** sistema funcionando.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe site + API em `http://localhost:4173` |
| `npm start` | Igual ao `dev` |
| `npm run seed` | Cria `db/canil.sqlite` com os dados de demonstração |
| `npm run seed:reset` | Limpa o banco e recria do zero |
| `npm run db:check` | Mostra o conteúdo e a cobertura temporal do banco |
| `npm test` | Testes de API, páginas e marcação (servidor precisa estar no ar) |
| `npm run test:navegador` | Renderiza as páginas em um Chrome/Edge headless de verdade |
| `npm run images:download` | Rebaixa fotos de pets do Wikimedia Commons |
| `npm run images:optimize` | Redimensiona e recomprime `uploads/pets` e `image` |

### Testes

```bash
npm run dev          # em um terminal
npm test             # em outro
```

- `scripts/testes-api.js` — rotas, permissões, login, upload e integridade das imagens
- `scripts/testes-paginas.js` — sintaxe, links, e coerência entre dados e fotos
- `scripts/testes-dom.js` — IDs e atributos que o script usa x HTML que existe
- `scripts/testes-navegador.js` — de verdade: abre cada página, faz login e
  verifica se os cards renderizam e se nenhuma imagem quebra

### Acesso ao sistema

Abra `http://localhost:4173/sistema.html`.

| Perfil | Login | Senha |
| --- | --- | --- |
| Administrador | `admin` | `admin123` |
| Veterinária | `paula.vet` | `vet12345` |
| Atendente | `carlos.atend` | `atend123` |

> These are demo credentials. Change the `senhaHash` (base64) in `api/_seed.js`
> and run `npm run seed:reset`.

---

## Estrutura

```
├── index.html          Página inicial
├── pets.html           Feed de pets para adoção
├── adocao.html         Formulário de interesse em adoção
├── blog.html / blog-post.html
├── projeto.html        Projeto do canil + histórias de adoção
├── contato.html        Denúncias de maus-tratos
├── sistema.html        Área restrita da equipe
├── style.css
├── script.js           Toda a lógica do front-end
│
├── api/                API em Node puro (handlers simples)
│   ├── _db.js          Conexão SQLite, JWT e utilidades
│   ├── _seed.js        Dados de demonstração (fonte da verdade)
│   ├── bootstrap.js    Carrega os dados iniciais
│   ├── login.js        Autenticação
│   ├── storage.js      Persistência chave/valor
│   └── upload.js       Envio de imagens
│
├── scripts/            Ferramentas de desenvolvimento
│   ├── server.js       Servidor único (estático + API)
│   ├── seed.js         Cria/recria o banco
│   ├── db-check.js     Inspeção do banco
│   ├── testes-*.js     Testes de API, páginas, DOM e navegador
│   └── otimizar-*.ps1  Recompressão das imagens
│
├── db/canil.sqlite     Banco de dados (versionado)
├── uploads/pets/       Fotos dos pets e capas do blog
└── image/              Logo e imagens do layout
```

---

## Banco de dados

O arquivo `db/canil.sqlite` fica no repositório de propósito: como o projeto é
uma amostra, o estado do sistema viaja junto com o código e qualquer pessoa
consegue rodar sem configurar nada.

Duas tabelas:

- **`app_storage`** — pares `chave`/`valor`. O front-end do site lê e escreve por
  aqui (`pv_animais`, `pv_blog_posts`, `pv_usuarios`, …), exatamente o mesmo
  contrato que o site usava antes.
- **`uploads`** — registro das imagens enviadas pelo painel do sistema.

Os dados iniciais ficam em `api/_seed.js`. Se você editar esse arquivo, rode
`npm run seed:reset` para recarregar o banco.

No deploy da Vercel, se o SQLite local estiver ausente ou vazio, a leitura de
`/api/storage` busca o snapshot versionado em
[`db/canil.sqlite`](./db/canil.sqlite) diretamente no GitHub (`main`). Se o
GitHub estiver indisponível, os dados iniciais de `api/_seed.js` são usados.
Essa leitura não grava alterações no GitHub: para publicar novos dados nessa
fonte, atualize e envie o banco ao repositório.

As datas do seed são calculadas em torno da data em que o seed roda: pets são
distribuídos ao longo do último ano (a maioria nos últimos 90 dias) para que o
painel, que filtra por período, sempre mostre movimento.

### O que tem no banco de demonstração

| Conjunto | Quantidade | Observação |
| --- | --- | --- |
| Pets | 26 | 14 disponíveis, 2 em tratamento, 10 adotados |
| Posts do blog | 11 | com capa local e texto completo |
| Histórias de adoção | 5 | 4 publicadas na página "O Projeto" |
| Interesses em adoção | 7 | em todas as etapas do fluxo |
| Denúncias | 4 | abertas, em análise e resolvidas |
| Usuários | 3 | admin, veterinária e atendente |

### Segurança aplicada

- Senhas em base64 (apenas para demonstração — em produção use hash com salt).
- Sessão por JWT HS256 assinado localmente; a chave fica em `db/.segredo-local`,
  gerada no primeiro acesso e fora do Git.
- Leitura de `/api/storage` é pública, mas nunca devolve `senhaHash`.
- Escrita exige sessão, exceto para os formulários públicos do site
  (interesse em adoção, denúncia e auditoria).
- O banco não é servido pelo servidor web (retorna 403).

---

## Imagens

Todas as fotos estão em `uploads/pets/` e são versionadas no repositório — o
site não depende de nenhuma hospedagem de imagem externa.

Os arquivos vieram do [Wikimedia Commons](https://commons.wikimedia.org/) com
licenças livres. Os créditos (autor, licença e página de origem de cada foto)
estão em `uploads/indice-fotos.json`.

Para adicionar fotos novas, basta colocá-las em `uploads/pets/` e referenciar o
caminho no cadastro do pet — o sistema aceita JPEG, PNG, WEBP e GIF de até 6 MB.

---

## Deploy

Como o banco é um arquivo local, qualquer hospedagem com Node serve o projeto
direto:

```bash
npm install   # instala a unica dependencia: better-sqlite3
npm run dev
```

Em ambientes onde o sistema de arquivos é somente leitura, defina
`CANIL_DB_PATH` apontando para um diretório gravável.

---

## Observações

- As senhas e os dados pessoais aqui são fictícios.
- `db/.segredo-local` e os arquivos `*.sqlite-wal` / `*.sqlite-shm` não devem ir
  para o Git.