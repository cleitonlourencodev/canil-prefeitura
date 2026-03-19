# Canil de Vilhena — Portal de Adoção

Site institucional com foco em:

- resgate de animais de rua e de maus-tratos,
- recuperação e cuidados veterinários,
- adoção responsável para famílias comprometidas.

## Estrutura do projeto

O projeto está separado em páginas exclusivas:

- `index.html` (Home, com amostras)
- `pets.html` (busca completa e perfis)
- `blog.html` (conteúdos)
- `projeto.html` (apresentação institucional)
- `contato.html` (canais de contato e denúncias)
- `adocao.html` (próxima etapa de adoção)
- `sistema.html` (gestão interna)

O botão **Funcionários** abre o sistema em nova guia.

## Funcionalidades

### Site público

- Home com pets em destaque (slides), prévia do blog e CTA para contato.
- Seções adicionais de fluxo de adoção, depoimentos e FAQ.
- Página Pets com busca completa:
	- texto livre (nome, descrição, temperamento e energia),
	- filtros por espécie, status e porte.
- Perfil completo público em modal com galeria organizada por miniaturas.
- Botão de adoção ao lado da foto/perfil, levando para `adocao.html` com pet pré-selecionado.
- Formulário oficial de denúncias exclusivamente em `contato.html`.
- Separação de privacidade: dados sensíveis ficam fora do site público.

### Sistema de funcionários

- Login interno com persistência remota via Supabase (frontend).
- Cadastro, edição e exclusão de animais com ficha completa.
- Galeria de fotos com definição de perfil e ajuste de enquadramento (posição X/Y).
- Editor da foto de perfil (zoom, brilho, contraste e saturação) com presets.
- Gestão de usuários do sistema (cadastro, ativação/inativação, reset de senha, perfis).
- Dashboard operacional com indicadores + listas de interesses de adoção e denúncias.

#### Credenciais temporárias

- Usuário: `admin`
- Senha: `admin123`

Usuário adicional para testes:

- Usuário: `paula.vet`
- Senha: `vet12345`

> Essas credenciais são apenas para desenvolvimento local. Na próxima etapa, substitua por autenticação real.

## Persistência de dados

As informações agora são persistidas no Supabase (tabela `public.app_storage`) por meio do arquivo `supabase-config.js`.

Arquivos SQL separados para criar estrutura e políticas:

- `sql/01_schema.sql`
- `sql/02_policies.sql`
- `sql/03_seed_inicial.sql`

Dados cobertos pelo storage remoto:

- animais cadastrados,
- posts do blog,
- denúncias registradas,
- interesses de adoção,
- usuários internos.

Observação: a sessão ativa da aba do sistema é mantida apenas em memória da página.

## Supabase (setup rápido)

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e execute, nesta ordem:
	- `sql/01_schema.sql`
	- `sql/02_policies.sql`
	- `sql/03_seed_inicial.sql`
3. Edite `supabase-config.js` com:
	- `url` do projeto
	- `anonKey` do projeto

## Deploy com GitHub + Vercel

1. Suba este repositório para o GitHub.
2. No Vercel, clique em **Add New Project** e importe o repositório.
3. Framework preset: **Other** (site estático).
4. Deploy.
5. Após qualquer alteração, faça push na branch `main` para novo deploy automático.

## Como executar

1. Abra `index.html` no VS Code.
2. Use **Go Live** (Live Server) ou abra diretamente no navegador.
3. Navegue pelas seções públicas normalmente.
4. Para a gestão interna, clique em **Funcionários**.
