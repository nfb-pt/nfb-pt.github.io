# Ilustrações dos cartões

Onze imagens geradas com a ferramenta integrada `image_gen`, uma chamada por imagem, sem fotografias ou imagens de referência externas. A direção visual acompanha a imagem de Literatura Filatélica: verde-petróleo, sálvia e terracota, papel e tecido, composições centradas. São ilustrações de peças imaginárias; não documentam o acervo, dirigentes, instalações ou encontros reais do Núcleo.

Os ficheiros originais ficam em `assets/images/cards/`. Hugo cria variantes WebP de 600 e 1200 px, sem ampliar os originais, e usa `srcset` e carregamento diferido. As mesmas imagens são usadas em PT/EN, com texto alternativo traduzido. A imagem de Literatura Filatélica e as restantes imagens existentes foram conservadas.

## Ficheiros e páginas

| Imagem                                          | Página PT                                      | Página EN                                       |
| ----------------------------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `assets/images/cards/about-introduction.png`    | `content/pt/sobre/apresentacao.md`             | `content/en/about/about-us.md`                  |
| `assets/images/cards/about-history.png`         | `content/pt/sobre/historia.md`                 | `content/en/about/history.md`                   |
| `assets/images/cards/about-board.png`           | `content/pt/sobre/direcao.md`                  | `content/en/about/board.md`                     |
| `assets/images/cards/about-membership.png`      | `content/pt/sobre/ser-socio.md`                | `content/en/about/membership.md`                |
| `assets/images/cards/starting-a-collection.png` | `content/pt/filatelia/comecar-uma-colecao.md`  | `content/en/philately/starting-a-collection.md` |
| `assets/images/cards/portuguese-stamps.png`     | `content/pt/filatelia/selos-de-portugal.md`    | `content/en/philately/portuguese-stamps.md`     |
| `assets/images/cards/postal-history.png`        | `content/pt/filatelia/historia-postal.md`      | `content/en/philately/postal-history.md`        |
| `assets/images/cards/thematic-philately.png`    | `content/pt/filatelia/filatelia-tematica.md`   | `content/en/philately/thematic-philately.md`    |
| `assets/images/cards/maximaphily.png`           | `content/pt/filatelia/maximafilia.md`          | `content/en/philately/maximaphily.md`           |
| `assets/images/cards/postal-stationery.png`     | `content/pt/filatelia/inteiros-postais.md`     | `content/en/philately/postal-stationery.md`     |
| `assets/images/cards/collectors-meeting.png`    | `content/pt/atividades/encontro-demo/index.md` | `content/en/activities/sample-meeting/index.md` |

## Prompts

Cada prompt enviado é a concatenação do texto comum abaixo com o assunto específico, sem outras instruções.

### Texto comum

Use case: stylized-concept. Asset type: one finished landscape website card image, 16:10 aspect ratio. Style: refined contemporary editorial still-life illustration with softly realistic dimensional forms, tactile clothbound books and printed paper textures, matching an elegant philatelic literature illustration. Pale cool sage background, soft diffuse studio light, understated shadows, deep petrol green #173e45, sage #c3d3bd, off-white and restrained terracotta #b74735. Keep the composition compact and centred, all main objects inside generous margins for responsive 16:10 card cropping. Cultured, clean and professional, not antique brown/sepia, not cartoon. No readable text, lettering, numbers, logos, watermarks, real stamp reproductions or real publication covers. Imaginary designs only. Subject:

### about-introduction

A welcoming introduction to a philatelic association: an open dark petrol-green stamp album displaying a few imaginary stamps with arches, plants and birds, a magnifying glass and a small closed reference book. Balanced close still life, no people.

### about-history

Association history and memory: a neat archival box, a restrained stack of folded correspondence tied with cotton ribbon, a dark green clothbound album and a small grouping of imaginary stamps. Clean pale sage background, not dusty, not sepia, no readable historic documents or dates.

### about-board

Collective stewardship and association board: three slim clothbound notebooks and three elegant pencils carefully arranged around a small open stamp album on a meeting tabletop. Suggest planning together, but NO people, hands, portraits, nameplates or official documents.

### about-membership

Joining a collecting community: an inviting open green clothbound stamp album, several beautifully spaced mounted imaginary stamps, and generous empty mounting spaces ready for new pieces. Beside it a small selection of loose imaginary stamps and a slim collector's tweezer. No membership cards, forms or people.

### starting-a-collection

A beginner's first stamp collection: a small petrol-green stockbook with only a few stamp mounts, five neatly spaced imaginary botanical and architectural stamps, proper slim stamp tongs and a magnifying glass. Modest manageable starter kit, not a crowded expert collection.

### portuguese-stamps

Portuguese stamp collecting, represented symbolically through SIX LARGE imaginary postage stamps: geometric Portuguese-style tiles, a stylized stone arch, a traditional sailing boat, an olive branch, a lighthouse and a swallow. Neatly arranged on a green stockbook page, one or two loose in foreground. Entirely invented stamp designs, no real issues, denomination, national arms or writing.

### postal-history

Postal history: three elegant off-white envelopes, imaginary postage stamps and subtle circular cancellation marks, laid across a minimal abstract route diagram with fine curved lines linking small unlabelled dots. Show letters and their journeys, no actual map, addresses, dates or identifiable routes.

### thematic-philately

Thematic philately: a carefully curated album page with six distinct imaginary BOTANICAL stamps showing different flowers, leaves and trees in sage, petrol-green and terracotta engraving-like drawings. A tiny pressed olive leaf beside the album visually connects collecting to one nature theme. No text or denominations.

### maximaphily

Maximaphily clearly visualised: one elegant picture postcard shown face up, with a large engraved-style terracotta flower illustration. A SMALL perforated imaginary stamp bearing THE SAME flower is affixed at the top right on the illustrated face, and one subtle circular postal cancellation overlaps BOTH that stamp and the postcard. A second postcard peeks out beneath. No readable words, no actual postal issue.

### postal-stationery

Postal stationery clearly visualised: two off-white prepaid correspondence cards and one matching envelope. On each, the upper-right corner contains a small flat PRINTED ink postage indicium with a generic engraved botanical motif, visibly integrated into the card paper, NOT an adhesive stamp and NO perforated edges. Restrained blank address lines, small postal cancellation detail, no readable text, numbers or genuine postal designs.

### collectors-meeting

A collectors' meeting, symbolically shown as a welcoming shared tabletop: three partially open stamp albums angled toward different seats around the table, a few loose imaginary stamps in the centre, two magnifying glasses and stamp tongs. Slightly elevated wide view. No people, no hands, no actual club venue or signage.
