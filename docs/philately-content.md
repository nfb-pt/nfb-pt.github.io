# Conteúdos de Filatelia

Os artigos e o diretório são Markdown, em `content/pt/filatelia/` e `content/en/philately/`. As páginas correspondentes usam o mesmo `translationKey`. As descrições são os resumos dos cartões; `weight` define a ordem da listagem. Não é necessário editar templates.

## Páginas temporariamente ocultas

`selos-de-portugal.md` / `portuguese-stamps.md` e `inteiros-postais.md` / `postal-stationery.md` têm `draft: true`. Não entram na construção normal, na pesquisa ou no sitemap. Para as recuperar, rever o conteúdo e retirar esse campo em ambas as línguas. Os ficheiros e as imagens foram conservados. A imagem de selos portugueses serve também o novo diretório.

## Artigos e bibliografia

Começar uma coleção, História Postal, Filatelia Temática e Maximafilia são introduções com exercícios propostos pelo NFB e ligações para aprofundamento. Literatura Filatélica contém um roteiro de leituras comentadas, não uma lista de obras que o Núcleo afirma possuir. Ao acrescentar uma obra, indicar título, autor/editor quando confirmado, edição, utilidade, idioma e ligação para a entidade responsável. Não copiar capas ou PDFs sem autorização.

Os convites à adesão remetem para a página de sócios existente. Não anunciam cursos, biblioteca, avaliações, preços ou outros serviços que não tenham sido confirmados.

## Filatelia em Portugal

Editar `filatelia-em-portugal.md` e `philately-in-portugal.md`. Cada entrada é uma ligação Markdown acompanhada de uma descrição curta. Manter os grupos de entidades, associações, lojas, leilões e pesquisa. Conservar o nome próprio das instituições na tradução; traduzir a descrição. Antes de acrescentar uma entrada, consultar uma fonte da própria entidade, confirmar o destino e registar a data de revisão.

A lista inicial foi pesquisada em 23 de setembro de 2026. Não pressupõe filiação do NFB nas entidades listadas nem patrocínios comerciais. Evitar copiar preços, horários, dirigentes ou calendários para não criar dados facilmente desatualizados.

## Fontes da primeira edição

As ligações de leitura estão também publicadas nos artigos. Foram consultadas páginas dos CTT, da American Philatelic Society, do National Postal Museum e das comissões da FIP. São textos introdutórios originais, com exercícios próprios; os regulamentos da FIP são indicados para aprofundamento e para quem pretenda expor, não como obrigação para colecionar por prazer.

- [CTT — organizar uma coleção](https://www.ctt.pt/particulares/filatelia/organizar-uma-colecao).
- [APS — primeiros passos](https://stamps.org/learn/getting-started), [materiais](https://stamps.org/learn/getting-started/tools-needed-to-get-started) e [conservação e organização](https://stamps.org/learn/getting-started/how-to-soak-sort-and-store-stamps).
- [National Postal Museum — cartas e envelopes](https://postalmuseum.si.edu/exhibition/about-philately/covers-and-letters) e [conservação de cartas](https://postalmuseum.si.edu/sites/default/files/preserving-your-letters1.pdf).
- [FIP — orientações de temática](https://www.f-i-p.ch/wp-content/uploads/TH_GUIDELINES_2018_New_FINAL.pdf), [maximafilia](https://www.f-i-p.ch/wp-content/uploads/Maximaphily.pdf) e [regulamentos](https://www.f-i-p.ch/regulations/).
- [CTT — plano editorial](https://www.ctt.pt/particulares/filatelia/plano-editorial/), [Mundifil 2024 identificado pelo comerciante](https://montrafilatelica.com/index.php?controller=product&id_product=309&id_product_attribute=0&rewrite=catalogo-portugal-mundifil-ano-2020), [APRL](https://stamps.org/services/library) e [arquivo Filatelicamente na Universidade do Porto](https://www.up.pt/arquivoweb/www.fep.up.pt/docentes/cpimenta/lazer/WebFilatelicamente/public_html/index.html).

As descrições do diretório baseiam-se nos sites ligados em cada entrada. O endereço do Clube Filatélico de Portugal redireciona para Squarespace. Filatelicamente é explicitamente identificado como arquivo histórico. O portal do Ateneu usa JavaScript. Não foram copiados contactos de diretórios antigos.

A verificação direta encontrou respostas 410 nas duas páginas inicialmente selecionadas da TRINDADE Colecionismo, substituídas por Filatelia Maçãs e Montra Filatélica, que responderam 200. A introdução temática no subdomínio da comissão respondeu 500 e foi substituída pelo PDF acessível no site principal da FIP. Frazão Auctions e Portal do Colecionador responderam 200 na consulta direta, depois de a ferramenta de pesquisa não os conseguir abrir.

A página da Académica e Stamps Portugal responderam 406 à consulta automatizada; a página de cartas do National Postal Museum respondeu 403. As três foram consultadas através da pesquisa web, que disponibilizou conteúdo das próprias entidades. Estes bloqueios não equivalem a ligações inexistentes; devem ser revistos num navegador quando se atualizar a lista. A disponibilidade externa não é garantida pela construção Hugo.

## Verificação desta atualização

`npm test` passou, incluindo produção, PDFs, Pagefind, conteúdo, traduções e testes de funcionalidades. Após a substituição das fontes indisponíveis, `npm run build` e `npm run check` passaram novamente: 97 fontes publicadas, 102 ficheiros HTML e 3438 referências internas. `npm run format:check` passou; foram também retirados espaços finais preexistentes dos campos vazios `hero_caption`, sem alterar o conteúdo da homepage.

As quatro páginas em rascunho foram confirmadas como ausentes dos ficheiros HTML, XML e JSON publicados e das ligações geradas. Uma verificação temporária em Chrome percorreu as 14 páginas PT/EN (duas listagens e doze artigos) a 320, 768 e 1366 px, confirmando imagens carregadas, seletor de idioma, seis cartões em cada listagem e ausência de deslocação horizontal. Foram revistas capturas da listagem portuguesa e do diretório inglês em telemóvel. Não houve publicação externa.
