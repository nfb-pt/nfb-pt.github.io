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
