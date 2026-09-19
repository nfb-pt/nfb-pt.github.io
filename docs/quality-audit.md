# Auditoria final da migração

Verificação local efetuada em 12 de setembro de 2026, com Node 24.11.0, Hugo Extended 0.166.0 e Pagefind 1.5.2, em macOS. O workflow de publicação usa Node 22; a execução remota ainda não ocorreu.

## Resultados executados

- `npm ci`: instalação limpa concluída a partir do lockfile.
- `npm run format:check`: passou, incluindo templates Hugo, SCSS, YAML e JavaScript.
- `npm test`: compilação de produção e todos os testes passaram. Sem avisos ou erros de Hugo.
- Conteúdos: 62 ficheiros publicados de origem, 31 pares PT/EN, sem traduções em falta. As páginas adicionais de taxonomia, RSS, sitemap, erro e redirecionamento são geradas por Hugo.
- Saída: 83 ficheiros HTML verificados, incluindo redirecionamentos, e 2525 referências internas verificadas. Sem ligações ou recursos locais em falta; sem placeholders editoriais expostos.
- Validação de idioma (`pt-PT` / `en`), um `main` e um `h1` por página, títulos/descrições, canónicos, destinos `hreflang`, texto alternativo, dimensões, fontes CSS e XML.
- Cenários isolados: atividades próximas/anteriores/sem data, filtragem da agenda da homepage, segunda página de notícias, fallback quando falta tradução, `srcset` WebP e ligação de descarga.
- `npm audit`: zero vulnerabilidades reportadas. O instalador Hugo tem um override documentado de `adm-zip` 0.6.1.
- Tema: mesmo commit da auditoria inicial, sem alterações no submódulo.

Pagefind emite uma mensagem informativa sobre a nova Component UI. A Default UI existente continua suportada e foi mantida intencionalmente. Foram indexadas duas línguas; exemplos DEMO não são indexados.

## Navegador e apresentação

Testes reais em Chrome headless, com `scripts/check-browser.mjs`:

- Homepage PT e EN a 320, 390, 768, 1366 e 1920 px: sem deslocação horizontal; todas as imagens carregam.
- Menu móvel aberto por Enter; Escape fecha o menu e devolve o foco ao botão. `aria-expanded` acompanha o estado.
- Seletor conserva páginas equivalentes: história e galeria, nos dois sentidos.
- Páginas de contactos, atividades, publicação e notícia inglesa verificadas a 390 px.
- Pesquisa «coleção»: apenas resultados portugueses. Pesquisa «collection»: apenas resultados ingleses.
- Preferência de movimento reduzido emulada; o SCSS desativa transições/animações nesse modo.
- Capturas da homepage portuguesa e inglesa em telemóvel e portátil, e captura integral da homepage portuguesa, revistas visualmente. O teste guarda capturas e resultados no diretório temporário do sistema.

A verificação final detetou e corrigiu um problema do formatador que unia classes CSS dos cartões. Existe uma verificação de regressão na análise do HTML e a suite de navegador confirma os seis cartões da homepage em cada língua.

Contrastes calculados a partir das cores SCSS: texto principal sobre branco 12,24:1; verde sobre branco 11,59:1; vermelho sobre branco 5,60:1; texto secundário sobre branco 6,31:1; texto do rodapé 10,32:1; rótulo DEMO 6,75:1. Isto não substitui uma auditoria completa de acessibilidade com tecnologias de apoio.

CSS final: aproximadamente 21 KB sem compressão HTTP. JavaScript comum de navegação: 734 bytes minificados. Pagefind só carrega a interface na página de pesquisa. O diretório publicado completo tem cerca de 2 MB. Não foram medidos Core Web Vitals em produção.

## Ocorrências antigas intencionais

A pesquisa de nomes/termos antigos foi feita nas fontes e no HTML publicado. Restam apenas:

- README, páginas PT/EN de créditos e licenças: atribuição do trabalho original sob CC BY 4.0 e MIT.
- `docs/migration-audit.md`: inventário histórico das línguas e organização originais, necessário para documentar a auditoria solicitada.
- `scripts/check-site.py`: termos de regressão que devem ser rejeitados no HTML.
- Tema importado e respetivo histórico: preservados intactos, com assets institucionais antigos excluídos da publicação.
- `Prompt`: ficheiro de trabalho do utilizador, já existente e não versionado; não alterado nem publicado.

Não há navegação, dados, imagens ou conteúdo editorial da organização anterior no site publicado, para além da atribuição legal nas páginas de créditos. Não há versões japonesa ou chinesa.

## Limites e dados pendentes

Não foram executados Docker, GitHub Actions, publicação GitHub Pages/Netlify, testes em Safari/Firefox nem avaliação com leitor de ecrã. Não foi feito push ou alterada qualquer configuração externa. Os links externos não foram testados exaustivamente; os testes automáticos cobrem as referências internas.

Faltam dados reais aprovados de contactos, direção, história detalhada, adesão, agenda, notícias, exposições, PDFs e imagens. Estão identificados nas fontes e apresentados honestamente na interface. O logótipo continua provisório. O ano de 1981 foi fornecido pelo utilizador.

A agenda é calculada durante a compilação; precisa de nova publicação para refletir a passagem do tempo. A configuração de alojamento assume a raiz do domínio. Os caminhos das fontes herdadas devem ser revistos se o site passar a um subdiretório.

## Atualização: blogue com vários autores

Implementação posterior à migração inicial: menu Notícias mantido e Blogue/Blog acrescentado; os dois artigos mais recentes do idioma atual aparecem entre Notícias e Atividades. Foram adicionados três artigos DEMO em português, dois com tradução inglesa, e dois perfis de autor DEMO em ambas as línguas. O artigo «Um caderno para acompanhar a coleção» existe apenas em português e demonstra coautoria.

Verificações executadas nesta atualização:

- `npm run format:check` e `npm test` passaram. O build continua sem erros/avisos de Hugo, com a mensagem informativa esperada do Pagefind.
- 75 fontes publicadas verificadas: 37 pares PT/EN e um artigo apenas em português; nenhuma tradução obrigatória em falta. 100 ficheiros HTML e respetivas referências internas validados.
- Testes isolados confirmam paginação própria do blogue, artigos por autor, RSS sem DEMO, separação entre notícias/blogue e entre línguas, aceitação de artigos sem tradução e rejeição de páginas institucionais sem tradução ou artigos com autores inexistentes.
- Chrome: homepage PT/EN a 320, 390, 768, 1200, 1366 e 1920 px, sem deslocação horizontal. O menu mantém uma única linha a 1200 px. A homepage tem agora oito cartões, incluindo dois artigos do blogue.
- Ordem Notícias → Blogue → Atividades confirmada no navegador; listagem inglesa com dois artigos; coautoria com duas ligações de perfil; tradução existente conserva a página equivalente e ausência de tradução conduz à homepage da outra língua sem declarar uma tradução inexistente nos metadados.
- Capturas da homepage, listagem, artigo móvel e perfil de autor revistas visualmente. Os testes existentes de teclado e pesquisa nas duas línguas continuam a passar.

As contagens e a exigência universal de tradução descritas na auditoria inicial acima são históricas; a exceção atual aplica-se apenas a artigos dentro de `blogue/` ou `blog/`. Perfis de autor, secções e restantes páginas continuam a exigir as duas línguas. Não houve alterações no tema importado nem publicação externa.

## Atualização: A Página do NFB

O boletim foi substituído pelo arquivo de A Página do NFB; os URLs antigos mantêm redirecionamentos. Publicações inclui Literatura Filatélica em PT/EN. A edição completa de demonstração contém nove entradas e usa os perfis de autoria do blogue. As traduções das edições também são opcionais, além das do blogue: arquivos, secções e perfis continuam bilingues.

Verificações executadas nesta atualização:

- `npm test` e `npm run format:check` passaram; Hugo sem erros/avisos novos. 97 fontes publicadas, 104 ficheiros HTML e 3395 referências internas verificadas, sem traduções obrigatórias em falta.
- Arquivo JSON inclui texto completo e autores. Testes confirmam pesquisa sem distinção de acentos/maiúsculas, combinação de palavras, intervalo de meses, ano civil/editorial, número, formato e quatro ordenações. Testes de navegador encontram uma palavra apenas presente no poema, mostram o estado vazio e repõem os resultados ao limpar filtros.
- Cenários Hugo isolados verificam ordenação de várias edições, PDF fornecido para digitalização, descoberta de uma edição portuguesa no arquivo inglês quando não há tradução, ligações nos perfis e redirecionamento antigo. O comando de criação foi testado para formatos digital/scan, rascunhos, datas inválidas e recusa de substituição de conteúdo existente.
- Chrome: arquivo e revista PT/EN a 320, 390, 768, 1366 e 1920 px, sem deslocação horizontal; índice com nove entradas, três artigos de destaque e coautoria confirmados. Capturas da revista em telemóvel e portátil revistas visualmente. Os testes anteriores da homepage, menu por teclado, traduções e pesquisa Pagefind continuam a passar.
- PDFs PT/EN produzidos localmente com Chrome. `pdfinfo` confirma formato A4 e estrutura marcada; `pdftotext` confirma texto extraível, conteúdos e numeração. A capa PDF foi renderizada com Poppler e revista visualmente. Os estilos de impressão ocultam cabeçalho, rodapé do site e ferramentas de navegação. Não se afirma conformidade PDF/UA.

O navegador é agora uma dependência de compilação quando há PDFs automáticos. O runner Ubuntu dos GitHub Actions já o disponibiliza; outros ambientes precisam de Chrome/Chromium e podem usar `CHROME_BIN`. Esta alteração não foi executada nos GitHub Actions/Netlify nem publicada externamente. Nenhuma edição histórica foi inventada: datas, ano editorial e número da edição atual são exemplos DEMO. Digitalizações precisam de transcrição Markdown para pesquisa no site; o índice não extrai texto dos PDFs.

## Atualização: exemplos de atividades e Literatura Filatélica

Foram acrescentadas duas atividades DEMO PT/EN, com datas e programas ilustrativos e estado «Confirmada · exemplo». A homepage apresenta estes exemplos apenas quando não há atividades reais futuras, com aviso explícito; as datas mantêm a classificação temporal na compilação. O exemplo anterior sem data permanece na listagem.

Literatura Filatélica tem agora uma ilustração gerada por IA, sem reproduções de livros ou selos reais. O mesmo ficheiro serve PT/EN, com textos alternativos traduzidos e versões WebP de aproximadamente 21 KB (600 px) e 88 KB (1200 px). O prompt foi registado em `docs/literature-image.md`.

`npm test` e `npm run format:check` passaram: 101 fontes publicadas, 108 ficheiros HTML e 3604 referências internas. O cenário isolado confirma a prioridade das atividades reais sobre os exemplos. Os testes de Chrome passaram em PT/EN entre 320 e 1920 px, com dez cartões na homepage atual, sem imagens quebradas ou deslocação horizontal. Capturas da homepage e de Publicações foram revistas visualmente.

A espera ilimitada por `Image.decode()` no teste de navegador foi substituída por uma verificação limitada do carregamento efetivo: a primeira podia ficar pendente num separador oculto durante alterações de imagens responsivas. A revisão concluída usou uma instância isolada de Chrome headless. Não houve publicação externa.

## Atualização do nome oficial

Foi adotado o nome fornecido pelo utilizador: **Núcleo Filatélico e de Coleccionismo de Braga**. A sigla NFB e o foco na filatelia mantêm-se. O nome foi corrigido em PT/EN, na configuração, marca tipográfica, rodapé, conteúdos institucionais, metadados, revista, capa provisória, cartões de partilha e README. A grafia «Coleccionismo» é preservada no nome próprio.

`npm test` e `npm run format:check` passaram. O PDF gerado contém o nome completo. A pesquisa nas fontes e no HTML/XML/JSON publicado não encontrou o nome anterior (ficheiros de trabalho do utilizador e tema excluídos). Os testes Chrome PT/EN entre 320 e 1920 px passaram; capturas da homepage móvel e de portátil, e do cartão social, foram revistas visualmente. O nome do cabeçalho usa agora o título configurado e uma largura limitada para acomodar o texto. Não houve publicação externa.

## Atualização: ilustrações dos cartões

Foram geradas onze ilustrações com `image_gen`: quatro para Sobre o NFB, seis para Filatelia e uma para o Encontro de colecionadores. Os ficheiros estão em `assets/images/cards/`, com inventário e prompts em `docs/card-images.md`. Todas foram revistas visualmente e associadas às páginas PT/EN através de front matter, com texto alternativo traduzido. A imagem existente de Literatura Filatélica foi conservada.

`npm test` e `npm run format:check` passaram: 108 ficheiros HTML e 3736 referências internas verificados. Hugo criou 22 variantes WebP de 600/1200 px, com aproximadamente 18–177 KB por variante. Não foram alterados templates, SCSS, dependências ou o tema.

Uma verificação Chrome das seis listagens PT/EN confirmou todos os cartões ilustrados, imagens carregadas e textos alternativos preenchidos, sem deslocação horizontal a 320, 390, 768, 1366 e 1920 px. Capturas de Sobre o NFB e Filatelia em portátil, e de Atividades em telemóvel, foram revistas visualmente. Não houve publicação externa.

## Atualização: Notícias e Artigos

Notícias e artigos assinados partilham agora uma secção PT/EN, com listagem paginada por data e três entradas na homepage, antes das Atividades. Os URL dos artigos e os perfis de autor foram preservados. Os antigos índices do blogue redirecionam para a secção conjunta; os feeds RSS antigos continuam disponíveis e incluem notícias e artigos, excluindo DEMO. As pastas e tipos internos mantêm-se para compatibilidade editorial.

`npm test` passou, incluindo produção, PDF, Pagefind, traduções, referências internas e cenários de paginação conjunta, autoria e RSS. `npm run format:check` passou. Os testes Chrome PT/EN passaram entre 320 e 1920 px, incluindo os redirecionamentos dos dois idiomas, navegação por teclado e pesquisa. Foram revistas capturas da homepage em telemóvel e portátil e da secção conjunta na homepage completa. Não houve publicação externa.
