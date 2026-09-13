# Núcleo Filatélico de Braga

Website bilingue do **Núcleo Filatélico de Braga (NFB)**, uma associação de filatelia e colecionismo sediada em Braga, Portugal. Português europeu é a língua principal (`/`); a versão inglesa está em `/en/`.

O site é estático, construído com **Hugo Extended**, Markdown, SCSS e Pagefind. Mantém o tema Dot Org como submódulo, com adaptações na raiz do projeto. Não necessita de CMS, base de dados ou aplicação no servidor.

A identidade gráfica é provisória. As entradas marcadas **DEMO** são exemplos, não notícias, eventos, exposições ou publicações reais. O ano de 1981 foi fornecido no pedido de migração. Outros dados institucionais ainda desconhecidos estão identificados nas fontes com `[A COMPLETAR]`; não devem ser substituídos por informação presumida.

## Instalar e executar

Requisitos: Git, Node.js **22 ou posterior**, npm e Python **3.9 ou posterior** para os testes e a pré-visualização estática. Hugo Extended **0.166.0** é instalado localmente por npm; não é necessário substituir o Hugo global. Para gerar os PDFs automáticos da revista, instale também Google Chrome/Chromium (ou defina `CHROME_BIN` com o caminho do executável). O navegador é usado apenas na compilação. A primeira instalação requer acesso à rede para descarregar as dependências e o executável Hugo.

```sh
git clone --recurse-submodules https://github.com/nfb-pt/nfb-pt.github.io.git
cd nfb-pt.github.io
# Necessário se o clone não incluiu o tema:
git submodule update --init --recursive
npm ci
npm run start
```

Abra `http://localhost:1313/` ou `http://localhost:1313/en/`. O servidor acompanha alterações nos ficheiros. Para incluir rascunhos:

```sh
npm run start -- --buildDrafts
```

Para compilar e experimentar também a pesquisa:

```sh
npm run build
npm run preview
```

`build` gera `public/`, limpa ficheiros obsoletos, gera os PDFs de A Página do NFB e cria os índices Pagefind. `preview` volta a compilar e serve `http://127.0.0.1:4173/`. A cache fica em `.cache/hugo/`, excluída do Git.

O servidor Hugo de desenvolvimento não gera os PDFs nem os índices de pesquisa. Use `preview` para testar Pagefind. Não copie índices para os conteúdos nem para `static/`: isso deixaria resultados desatualizados.

Alternativamente, com Docker e o submódulo já inicializado, execute `./run-hugo-in-docker.sh`. O script usa Node 22, instala o Hugo fixado no lockfile e isola `node_modules` num volume Docker. O caminho Docker não foi executado durante a migração; o processo npm foi verificado em macOS.

## Onde está cada coisa

| Local                            | Responsabilidade                                             |
| -------------------------------- | ------------------------------------------------------------ |
| `config/_default/hugo.yaml`      | Hugo, importação do tema, taxonomias, paginação e sitemap    |
| `config/_default/languages.yaml` | Línguas, descrições, menus e imagens de partilha             |
| `config/_default/params.yaml`    | Caminhos dos logótipos e identidade comum                    |
| `config/production/hugo.yaml`    | URL de produção e minificação                                |
| `content/pt/`, `content/en/`     | Textos, dados das páginas e traduções                        |
| `i18n/pt.yaml`, `i18n/en.yaml`   | Botões, rótulos, acessibilidade e outros textos da interface |
| `archetypes/`                    | Modelos dos tipos de conteúdo                                |
| `layouts/`                       | Overrides e componentes Hugo locais                          |
| `assets/scss/_nfb.scss`          | Cores, espaçamento e adaptações visuais                      |
| `assets/scss/styles.scss`        | Importações dos componentes SCSS do tema                     |
| `assets/images/`                 | Imagens processadas e ilustrações                            |
| `static/images/brand/`           | Logótipos finais e imagens de partilha                       |
| `static/documents/`              | PDFs aprovados para distribuição                             |
| `themes/dot-org-hugo-theme/`     | Tema importado; não editar diretamente                       |
| `scripts/`                       | Compilação e verificações                                    |

O tema é importado uma única vez através de `module.imports`, a partir do submódulo local. Importam-se os templates, os assets e as fontes; os logótipos, ícones e imagens genéricas do tema ficam fora da publicação. Os overrides locais mantêm a base tipográfica e os padrões de cartões, secções e rodapé. A navegação usa JavaScript local pequeno para controlar estado e foco de forma acessível. O blogue usa os mesmos cartões e o mesmo template de artigo que as notícias, com autoria ligada aos perfis e uma listagem própria em `layouts/blog/list.html`.

## Português e inglês

As duas versões de cada página têm o **mesmo `translationKey`**, mesmo quando o nome do ficheiro e o URL diferem:

```text
content/pt/sobre/historia.md       → /sobre/historia/
content/en/about/history.md       → /en/about/history/
```

Ambas usam `translationKey: history`. Cada chave deve ser única dentro da sua língua. O seletor PT/EN utiliza as traduções nativas do Hugo e conserva a página equivalente. Quando falta uma tradução, a ligação conduz à homepage da outra língua; não inventa uma página nem traduz por JavaScript.

Para adicionar uma tradução, copie a página para a secção correspondente da outra língua, conserve a chave e traduza título, descrição, resumo, texto, legendas, texto alternativo e termos de categorias/temas. Os caminhos das imagens e dos PDFs podem ser partilhados. As páginas de termos também podem ter um `translationKey`; veja `content/pt/tags/filatelia/_index.md` e o equivalente inglês.

```sh
npm run check:translations
```

Este comando identifica traduções obrigatórias ausentes e falha se encontrar alguma. **Os artigos do blogue podem ser publicados apenas numa língua**: a tradução é opcional em `content/pt/blogue/` e `content/en/blog/`, exceto nos índices `_index.md`. As edições de A Página do NFB e as suas entradas também podem existir apenas numa língua. As restantes páginas publicadas, incluindo perfis de autor e secções, continuam a exigir PT/EN no CI. `npm run check` assinala as traduções obrigatórias ausentes sem bloquear o trabalho editorial. Rascunhos (`draft: true`) não entram nesta verificação estrita. Os ficheiros `_index.md` das secções definem `cascade.type`: novos conteúdos herdam o tipo correto em ambas as línguas.

| Tipo        | Secção PT     | Secção EN      |
| ----------- | ------------- | -------------- |
| Associação  | `sobre`       | `about`        |
| Recursos    | `filatelia`   | `philately`    |
| Notícias    | `noticias`    | `news`         |
| Blogue      | `blogue`      | `blog`         |
| Autores     | `autores`     | `authors`      |
| Atividades  | `atividades`  | `activities`   |
| Exposições  | `exposicoes`  | `exhibitions`  |
| Publicações | `publicacoes` | `publications` |
| Contactos   | `contactos`   | `contact`      |

Use português europeu e a grafia **atividades**, **colecionadores**, **contactos**, **direção**, **sócios**. Não traduza o nome próprio da associação.

## Criar conteúdos

A forma mais simples é copiar uma pasta de exemplo dentro da secção pretendida e editar o seu `index.md`. Também pode copiar um modelo de `archetypes/` para uma nova pasta. A parte entre `---` é YAML; o resto é Markdown. Não é necessário editar HTML.

Comece sempre com `draft: true`. Altere a chave de tradução nas duas cópias e confirme os dados antes de publicar. Para converter um exemplo DEMO em conteúdo real, substitua todo o texto de demonstração, retire `demo: true` e `noindex: true`, remova os temas de demonstração e retire `draft: true` apenas quando estiver aprovado. Entradas DEMO são visíveis para demonstrar o desenho, mas ficam fora de RSS, sitemap e pesquisa.

### Notícia

Exemplos: `content/pt/noticias/olhar-para-um-selo/index.md` e `content/en/news/a-closer-look/index.md`. Modelo: `archetypes/news.md`.

```yaml
---
title: "[A COMPLETAR]"
translationKey: noticia-chave-unica
draft: true
date: 2027-01-01T10:00:00+00:00 # Data de exemplo: substituir pela data real
summary: "[A COMPLETAR]"
description: "[A COMPLETAR]"
# author: Nome fornecido pelo autor
image: images/stamps/nome-descritivo.jpg
image_alt: "[A COMPLETAR]"
categories: []
tags: []
---
Texto da notícia em Markdown.
```

A data é a data de publicação. Datas futuras não são publicadas por defeito. O nome do autor só aparece se `author` estiver preenchido. As listas têm paginação; a homepage mostra as duas notícias mais recentes. Não precisa de acrescentar cada notícia ao menu.

### Artigo do blogue e autoria

O menu conserva **Notícias / News** e acrescenta **Blogue / Blog**. Use notícias para informação institucional e o blogue para artigos assinados pelos associados. Na homepage, os dois artigos mais recentes do idioma atual aparecem entre Notícias e Atividades, com os mesmos cartões das notícias. A listagem completa tem paginação e RSS próprio em `/blogue/index.xml` e `/en/blog/index.xml`.

Existem três artigos de exemplo, todos identificados como DEMO:

| Artigo PT                                    | Tradução EN                                    |
| -------------------------------------------- | ---------------------------------------------- |
| `blogue/um-caderno-para-a-colecao/index.md`  | Apenas português; demonstra também coautoria   |
| `blogue/escolher-um-tema/index.md`           | `blog/choosing-a-theme/index.md`               |
| `blogue/olhar-devagar-para-um-selo/index.md` | `blog/taking-time-to-look-at-a-stamp/index.md` |

Os perfis **Autor de exemplo A/B** são demonstrativos e não identificam associados reais. Para criar um autor, coloque uma página em `content/pt/autores/` e a equivalente em `content/en/authors/`, a partir do modelo `archetypes/authors.md`. Use o mesmo `author_id` estável e o mesmo `translationKey` nas duas versões. O título é o nome aprovado pelo associado, o texto Markdown é a biografia e `image`/`image_alt` permitem uma fotografia opcional. Confirme autorização para divulgar estes dados.

Para criar um artigo, copie `archetypes/blog.md` ou uma pasta de exemplo para `content/pt/blogue/nome-do-artigo/index.md` e edite:

```yaml
---
title: "[A COMPLETAR]"
translationKey: artigo-chave-unica
type: blog
draft: true
date: "2026-09-01T10:00:00+01:00" # Data de exemplo: substituir
# IDs de perfis existentes no idioma do artigo; não são nomes livres.
authors: [identificador-do-associado]
summary: "[A COMPLETAR]"
description: "[A COMPLETAR]"
image: images/stamps/nome-descritivo.jpg
image_alt: "[A COMPLETAR]"
tags: []
---
Texto do artigo em Markdown.
```

Para coautoria, use `authors: [primeiro-id, segundo-id]`. Cada artigo liga aos seus autores; cada perfil reúne automaticamente os artigos que assina no idioma atual. Os testes rejeitam autores em falta ou IDs duplicados. Não use os perfis DEMO como identificação de associados reais.

A tradução inglesa pode ser acrescentada mais tarde em `content/en/blog/`, conservando `translationKey`. Enquanto não existir, o artigo apresenta uma nota de idioma e o seletor EN conduz à homepage inglesa com um rótulo acessível que explica a ausência de tradução. As listas inglesas não repetem o artigo português. Não é necessário criar uma página inglesa vazia.

O associado pode entregar um texto e imagens ao responsável editorial ou propor os ficheiros num pull request. Mantenha o artigo como rascunho até à revisão. Ao adaptar um exemplo, substitua texto, datas e autores, retire `demo: true` e `noindex: true` e publique apenas depois da aprovação. Os exemplos DEMO não entram na pesquisa, sitemap ou RSS; artigos reais entram normalmente. A pesquisa mantém os idiomas separados.

### Atividade

Exemplo: `content/pt/atividades/encontro-demo/index.md`. Modelo: `archetypes/activities.md`.

Além do título, resumo e chave, pode usar:

```yaml
# Datas de exemplo; substituir por dados confirmados.
starts: 2027-01-01T15:00:00+00:00
ends: 2027-01-01T17:00:00+00:00
activity_kind: encontro
location: "[A COMPLETAR]"
```

`starts` e `ends` são as datas do evento, independentes de `date` (publicação). Inclua o fuso horário: Portugal continental usa `+00:00` no inverno e `+01:00` no verão. O fim não pode ser anterior ao início. Sem datas, o conteúdo aparece em «Datas a anunciar». Eventos cujo fim já passou aparecem nas atividades anteriores. Os exemplos DEMO têm um grupo separado. Os dois exemplos com `status: confirmed`, datas futuras e `homepage_example: true` também aparecem na homepage quando não há atividades reais agendadas, com um aviso DEMO explícito. São datas e programas fictícios: não anunciam eventos do Núcleo. Atividades reais têm sempre prioridade; retire `demo`, `noindex` e `homepage_example` quando substituir um exemplo por dados confirmados. `status: confirmed` apresenta o estado «Confirmada» nos cartões e na ficha.

**A passagem de próxima a anterior acontece na compilação**, não no navegador. Publique uma nova compilação quando for necessário atualizar a agenda.

### Exposição ou coleção

Exemplo: `content/pt/exposicoes/galeria-demo/index.md`. Modelo: `archetypes/exhibitions.md`.

Use `image` e `image_alt` para a imagem de destaque; `starts`, `ends` e `location` para dados confirmados. `exhibition_kind` permite classificar o conteúdo na fonte. A galeria é uma lista:

```yaml
gallery:
  - image: images/exhibitions/nome-descritivo.jpg
    alt: "[A COMPLETAR: descrição da imagem]"
    caption: "[A COMPLETAR: contexto e crédito]"
```

Apresente curadoria, participação, coleções ou prémios no texto apenas quando existir informação confirmada. `weight` controla a ordem de apresentação.

### Publicação e PDF

**A Página do NFB** tem um arquivo próprio em `/publicacoes/a-pagina/`, com pesquisa por palavras/autores, filtros de data, ano editorial e número, e edições em HTML/PDF. Literatura Filatélica também aparece na listagem de Publicações.

Para criar um número, como rascunho (dados ilustrativos):

```sh
npm run issue:new -- --year 2027 --volume 6 --number 1 --date 2027-03-01
```

O URL fica `/a-pagina/2027/1/`; o PDF automático, `/a-pagina/2027/1/a-pagina.pdf`. Cada entrada é um ficheiro Markdown, com autores dos mesmos perfis do blogue. O índice e as ligações nos perfis são gerados automaticamente. Existe uma edição completa DEMO, com tradução inglesa, em `content/pt/edicoes/2026-1/` e `content/en/issues/2026-1/`.

Veja **[o guia editorial de A Página do NFB](docs/a-pagina.md)** para criar edições, acrescentar artigos, publicar digitalizações, preparar texto para pesquisa, traduzir e gerar/imprimir PDFs.

Para outras publicações avulsas, use o modelo `archetypes/publications.md`:

```yaml
year: "[A COMPLETAR]"
issue: "[A COMPLETAR]"
image: images/publications/capa-descritiva.jpg
image_alt: "[A COMPLETAR]"
download: ""
# Preencher apenas depois de colocar um ficheiro aprovado em static/documents/:
# download: documents/nome-descritivo.pdf
# file_size: 2 MB
```

Sem `download`, o site mostra uma mensagem de indisponibilidade em vez de um botão que não funciona. Use PDFs com texto pesquisável, título e idioma nos metadados, e estrutura acessível sempre que possível. Confirme os direitos de distribuição. Ano e número só devem ser preenchidos com valores reais.

### Homepage, associação e contactos

Os textos da homepage estão no front matter de `content/pt/_index.md` e `content/en/_index.md`. Notícias, artigos do blogue, atividades, exposições e publicações são recolhidas automaticamente das respetivas secções.

Os textos institucionais ficam em `sobre/` e `about/`. As notas `editorial_notes` não são apresentadas no site. Nos contactos, preencha o mapa `contact` de cada língua com morada, email, telefone, local/horário e redes sociais confirmados. Valores `[A COMPLETAR]` são apresentados como «Por confirmar». O email torna-se uma ligação; os outros campos aceitam texto e ligações Markdown. O rodapé remete para esta página, sem duplicar valores desconhecidos.

## Imagens e identidade gráfica

Coloque imagens filatélicas em `assets/images/stamps/`, fotografias de exposições em `assets/images/exhibitions/` e capas em `assets/images/publications/`. Uma imagem exclusiva de uma página também pode ficar ao lado do seu `index.md`; nesse caso use `image: fotografia.jpg`.

| Uso             | Preparação recomendada                                                           |
| --------------- | -------------------------------------------------------------------------------- |
| Destaque/cartão | 1600 × 1000 px, assunto principal centrado; o cartão recorta para 16:10          |
| Galeria         | Até 1600 px no lado maior; preserva a proporção original                         |
| Capa            | Fotografia/scan vertical; incluir margens se necessário para o recorte do cartão |
| Hero            | Composição próxima de 900:760, com espaço à volta do assunto                     |
| Partilha social | 1200 × 630 px, PNG ou JPG                                                        |

Hugo cria variantes raster WebP até 600 e 1200 px, sem ampliar o original, com `srcset`, dimensões e carregamento diferido. A imagem principal carrega prioritariamente. SVGs mantêm-se vetoriais; use dimensões explícitas no elemento `<svg>`. Os nomes devem ser descritivos, sem espaços. Traduza o texto alternativo e as legendas.

As ilustrações atuais são **composições de selos imaginários**, incluindo a imagem de Literatura Filatélica gerada por IA, não fotografias de selos históricos. O registo de direitos está em `docs/image-rights.md`. Para novas imagens, registe autor, origem, licença/autorização e crédito obrigatório. Não copie imagens aleatórias da Internet.

### Substituir a identidade provisória

Coloque o logótipo aprovado em `static/images/brand/logo.svg` ou `logo.png` e defina em `config/_default/params.yaml`:

```yaml
logo: images/brand/logo.svg
logo_footer: images/brand/logo-light.svg # Opcional, para o fundo escuro
```

Sem `logo_footer`, o rodapé usa `logo`. Sem ambos, mantém-se a marca tipográfica provisória. Prepare um SVG com proporção aproximada de 240:64 e confirme a legibilidade a 145 px em telemóvel. Substitua também `static/favicon.svg`, `nfb-social.png` e `nfb-social-en.png` quando houver identidade oficial.

As cores e medidas estão em `assets/scss/_nfb.scss`: `--ink`, `--accent`, `--paper`, `--muted` e `--line`. As famílias Nunito e Oswald são servidas localmente pelo tema. Mantenha contraste adequado e estados de foco visíveis ao alterar cores.

## Pesquisa e metadados

Pagefind é executado depois de Hugo e gera índices independentes para `pt-PT` e `en`. O idioma do HTML determina a pesquisa; as entradas DEMO ficam de fora. A interface está traduzida e não requer serviço externo. O aviso informativo de Pagefind sobre a nova Component UI é esperado: mantemos a Default UI já usada pelo projeto, que continua suportada.

Títulos, descrições, URL canónico, `hreflang`, OpenGraph, cartões sociais, RSS e sitemap são gerados por Hugo. Rascunhos, pesquisa e demonstrações não entram no sitemap. A versão publicada usa `https://nfb-pt.github.io/`, correspondente ao repositório; altere `baseURL` se for adotado outro domínio. Não foram mantidos analytics nem redes sociais da organização anterior.

## Verificar alterações

```sh
npm run format
npm run format:check
npm test
npm audit
```

`npm test` compila, verifica fontes/traduções, ligações e recursos locais, dimensões/alt de imagens, idioma, metadados, placeholders expostos e XML. Também compila cenários isolados para eventos, paginação, falta de tradução, imagens raster, arquivos de edições e ligações PDF, e testa filtros/ordenação e criação segura de rascunhos da revista. Os cenários temporários são removidos no fim. As verificações não confirmam disponibilidade de sites externos nem substituem uma revisão humana dos factos.

Há testes opcionais de navegador em `scripts/check-browser.mjs`. Com `public/` servido na porta 4173 e Chrome iniciado com depuração na porta 9222, execute:

```sh
node scripts/check-browser.mjs
```

O script verifica PT/EN entre 320 e 1920 px, imagens, menu por teclado, páginas equivalentes e isolamento da pesquisa. Para usar uma instância isolada do Chrome noutra porta, defina, por exemplo, `NFB_CHROME_URL=http://127.0.0.1:9223`. Guarda capturas e resultados na pasta temporária do sistema. Veja `docs/quality-audit.md` para os resultados e limites da migração.

## Publicar

O diretório a publicar é **`public/` completo**, incluindo `pagefind/`. Não publique `content/`, dependências ou ficheiros de trabalho.

### GitHub Pages

O workflow `.github/workflows/pages.yaml` compila e testa em pull requests; publica alterações de `main` e execuções manuais. No repositório GitHub, selecione **Settings → Pages → Source → GitHub Actions**. O runner Ubuntu fornece Chrome para os PDFs. O checkout inicializa o submódulo, instala as versões do lockfile e publica o artefacto estático. É necessário que o ambiente `github-pages` permita a publicação.

A migração adiciona o workflow mas não executa um push nem altera configurações no GitHub. Para atualizar também a classificação temporal da agenda, desencadeie uma nova execução do workflow.

### Netlify

O processo existente foi preservado em `netlify.toml` e `Makefile`: `make production-build`, com saída em `public/`. O Netlify instala dependências e usa Node 22. A geração automática de PDFs exige agora Chrome/Chromium no ambiente de compilação, com `CHROME_BIN` configurado; veja [os requisitos da revista](docs/a-pagina.md#pdf-e-impressão). Em alternativa, publique neste alojamento o artefacto já compilado pelos GitHub Actions. Os previews recebem `DEPLOY_PRIME_URL` através de `HUGO_BASEURL`, incluindo URLs canónicos corretos para o preview. Se o Netlify passar a ser o alojamento principal, altere o URL de produção para o domínio confirmado. Nenhuma conta ou publicação Netlify foi configurada nesta migração.

### Outro alojamento estático

Execute `npm ci && npm run build` e envie o conteúdo de `public/`. O alojamento deve servir `index.html` nos diretórios e usar `404.html` para erros. Não há requisito de servidor de aplicação. A configuração atual destina-se à raiz de um domínio; publicar sob um subcaminho requer rever os caminhos das fontes do tema.

## Licenças e origem

Este projeto adapta o website [TODO Group](https://github.com/todogroup/todogroup.org), sob [CC BY 4.0](LICENSE). Foram alterados identidade, conteúdos, localização, componentes e processo de compilação. A atribuição permanece nas páginas de créditos, neste README e no histórico Git.

O [Dot Org Theme](https://github.com/cncf/dot-org-hugo-theme), © 2023 Cloud Native Computing Foundation, mantém-se no commit `57c1fc627edcc358d083274593919074623e38ec`, sob [MIT](licenses/Dot-Org-MIT.txt). Nunito e Oswald têm avisos [SIL OFL](licenses/). As ilustrações originais desta migração usam CC BY 4.0; direitos de futuros scans, fotografias e logótipos devem ser registados separadamente.

Não edite o submódulo diretamente. Para atualizar o tema, reveja o novo commit, atualize a referência do submódulo e execute os testes antes de integrar. O `override` npm de `adm-zip` para 0.6.1 corrige uma dependência do instalador Hugo 0.166.0; reavalie-o numa futura atualização.
