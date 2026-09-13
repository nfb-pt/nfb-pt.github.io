# Editar A Página do NFB

O arquivo está em `/publicacoes/a-pagina/` e `/en/publications/a-pagina/`. A secção Publicações inclui também Literatura Filatélica. Os endereços antigos do boletim redirecionam para o arquivo; `/a-pagina/` é um atalho.

Cada número é um **leaf bundle Hugo**: uma pasta com `index.md` para os dados da edição e outros ficheiros Markdown para as entradas. Não é necessário alterar templates. A edição de setembro de 2026, ano editorial 1, número 1 é inteiramente **DEMO**, incluindo datas, numeração, textos e perfis de autoria. Não representa uma edição real do Núcleo.

## Criar um número digital

Exemplo de comando, com dados meramente ilustrativos:

```sh
npm run issue:new -- --year 2027 --volume 6 --number 1 --date 2027-03-01
```

Cria `content/pt/edicoes/2027-1/`, como rascunho, com oito entradas iniciais. Copie `artigo.md` para acrescentar outros artigos, alterando as respetivas chaves e âncoras. O comando recusa substituir pastas existentes.

```text
content/pt/edicoes/2027-1/
  index.md          Dados da edição, apresentação
  editorial.md      Editorial
  atividades.md     Relato ou agenda
  artigo.md         Artigo de filatelia/colecionismo
  socios.md         Avisos e informações
  curiosidades.md   Curiosidades
  passatempos.md    Passatempos
  braga.md          Artigo sobre Braga
  poema.md          Poema
  fotografia.jpg   Imagem opcional da edição
```

O `index.md` contém:

```yaml
title: A Página do NFB — número 1/2027
translationKey: a-pagina-2027-1
type: magazine
magazine_id: a-pagina
url: /a-pagina/2027/1/
edition_year: 2027
issue_date: "2027-03-01"
volume: 6
number: 1
format: digital
generate_pdf: true
draft: true
description: "[A COMPLETAR]"
coverline: "[A COMPLETAR]"
# image: fotografia.jpg
# image_alt: Descrição da imagem
```

**Não confunda estes campos:** `issue_date` é a data apresentada, usada nos filtros e na ordenação; `volume` é o «Ano» editorial da publicação; `number` é o número; `edition_year` identifica o ano no URL. O ano editorial pode, por exemplo, ser 6 quando o ano civil é 2027. Depois de publicar, conserve `edition_year`, `number` e `url`, mesmo que seja necessário corrigir a data. Este esquema admite um número único por ano civil. Se houver números duplos ou suplementos, defina uma convenção antes de os publicar e adapte a validação.

Cada entrada usa este front matter:

```yaml
title: Título do artigo
translationKey: a-pagina-2027-1-artigo
anchor: artigo
section: article
authors: [identificador-do-associado]
weight: 30
# image: fotografia.jpg
# image_alt: Descrição da imagem
```

O texto seguinte é Markdown. `weight` ordena o índice e a leitura. `anchor` deve ser única dentro da edição e manter-se depois da publicação: a ligação ao artigo será `/a-pagina/2027/1/#artigo`. `translationKey` é única por língua. Para mais artigos, use, por exemplo, `artigo-2` nos identificadores e `weight: 40`, ajustando os restantes pesos. Pode omitir secções que não existam numa edição; o índice adapta-se.

Valores de `section`: `editorial`, `activities`, `article`, `members`, `curiosity`, `puzzle`, `braga`, `poem`. Os rótulos são traduzidos automaticamente. Use `###` para subtítulos dentro dos artigos, pois o título da entrada já é um `h2`.

`authors` usa exatamente os IDs dos perfis do blogue, incluindo coautoria. Cada perfil passa a listar também os contributos para a revista no idioma atual. O comando deixa a lista vazia: preencha-a com os autores confirmados antes de publicar. Para poemas, duas espaços no fim de uma linha Markdown conservam a quebra de verso. Textos e imagens precisam dos respetivos direitos de publicação.

Preencha todos os textos, confirme metadados e autores, reveja a apresentação com `npm start -- --buildDrafts` e retire `draft: true` apenas quando a edição estiver pronta. Os rascunhos e as suas entradas ficam fora do arquivo publicado. `npm test` verifica a edição pronta.

## Tradução inglesa

```sh
npm run issue:new -- --year 2027 --volume 6 --number 1 --date 2027-03-01 --lang en
```

Cria a pasta equivalente em `content/en/issues/2027-1/` e o URL `/en/a-pagina/2027/1/`. Conserve os mesmos identificadores de edição, `translationKey` das entradas e âncoras. Traduza os textos, título, descrição, chamada de capa e textos alternativos. Os perfis de autoria devem existir nas duas línguas.

A tradução de uma edição é opcional. Sem tradução, o arquivo inglês inclui a edição portuguesa com indicação do idioma, mantendo o original acessível. Assim que se publicar uma tradução com a mesma `translationKey`, o arquivo inglês passa a mostrar essa versão. O seletor PT/EN mantém a edição equivalente quando existe; na sua ausência, conduz à homepage da outra língua. As secções e os perfis de autor continuam a exigir tradução.

## Digitalizar uma edição antiga

```sh
npm run issue:new -- --year 2021 --volume 6 --number 1 --date 2021-03-01 --format scan
```

Os valores são apenas um exemplo. Confirme os dados impressos na edição original. Coloque o ficheiro, por exemplo, em `static/documents/a-pagina/2021/1/original.pdf` e preencha:

```yaml
format: scan
pdf: documents/a-pagina/2021/1/original.pdf
# Não usar generate_pdf neste caso.
```

O PDF é disponibilizado sem alterações. Acrescente a descrição e uma **transcrição revista** no corpo de `index.md`, ou divida a transcrição por entradas Markdown com autoria e âncoras. Uma digitalização que apenas contém imagens não permite pesquisar as palavras impressas no site. Faça OCR, corrija os erros e inclua o texto em Markdown; não basta incorporar uma camada OCR no PDF, porque este arquivo pesquisa o conteúdo HTML. Pode incluir a capa como imagem para facilitar a identificação.

## Pesquisa e ordenação

O arquivo gera `archive.json` durante a compilação. A pesquisa local abrange título, descrição, apresentação, texto das entradas e nomes dos autores. Não distingue maiúsculas nem acentos e combina todas as palavras introduzidas. Os filtros combinam intervalo de meses, ano civil, ano editorial, número e formato. A ordenação oferece data crescente/decrescente, ano editorial/número ou número/data. Não é um motor de pesquisa aproximada nem pesquisa o interior de ficheiros PDF.

Sem JavaScript, todas as edições continuam listadas por data, com ligações para leitura e PDF. A pesquisa geral Pagefind também indexa as edições HTML reais, separando os idiomas; o arquivo local inclui os exemplos DEMO para permitir experimentar os filtros, enquanto Pagefind exclui demonstrações.

## PDF e impressão

`generate_pdf: true` cria automaticamente `/a-pagina/2027/1/a-pagina.pdf` durante `npm run build`. Não é necessário manter duas versões do texto. O script `scripts/build-magazine-pdfs.mjs` abre o HTML num **Chrome/Chromium instalado**, aguarda fontes e imagens e imprime com os estilos A4 da revista. O PDF inclui texto selecionável, marcação estrutural, índice com ligações e numeração de páginas. A qualidade de leitura e as quebras de página devem ser revistas em cada edição; a geração automática não constitui certificação PDF/UA nem paginação tipográfica manual.

O botão **Imprimir / guardar PDF** abre o diálogo de impressão do navegador com esses mesmos estilos. O leitor pode escolher papel ou guardar PDF. Desative os cabeçalhos e rodapés automáticos do navegador e ative gráficos de fundo para obter um resultado mais próximo do PDF gerado. A disponibilidade de numeração nas margens depende do navegador; a compilação usa Chrome.

Requisitos de compilação:

- macOS: Google Chrome no local habitual é detetado automaticamente.
- Linux: são detetados `/usr/bin/google-chrome`, `google-chrome-stable`, `chromium` e `chromium-browser`.
- Outro local: defina `CHROME_BIN` com o caminho absoluto do executável.
- GitHub Actions: o runner `ubuntu-latest` disponibiliza Chrome. O site publicado continua totalmente estático; Chrome só é usado na compilação.
- Outros ambientes, incluindo Netlify: disponibilize Chrome/Chromium na imagem de compilação e defina `CHROME_BIN`. Em alternativa, compile nos GitHub Actions e publique o artefacto estático nesse alojamento. O build falha com uma mensagem explícita se uma edição pedir PDF automático e não houver navegador.

Para fornecer um PDF paginado manualmente, retire `generate_pdf` e use `pdf: documents/...pdf`, mantendo `format: digital` e os artigos HTML. Um número digital também pode omitir ambos os campos e oferecer apenas HTML/impressão.

`npm start` permite trabalhar sem Chrome, mas não gera PDFs nem Pagefind. Use `npm run preview` para experimentar os downloads e a pesquisa geral. Nunca edite os PDFs em `public/`: são resultados de compilação e serão substituídos.

Os estilos próprios da revista estão em `assets/scss/magazine.scss`; os componentes Hugo em `layouts/magazine/`, `layouts/publications/` e `layouts/partials/magazine/`. A capa gráfica temporária está em `assets/images/publications/a-pagina-cover.svg`.
