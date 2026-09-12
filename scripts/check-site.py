"""Check actual generated HTML/XML/CSS using only the Python standard library."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote, urljoin
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path('public').resolve()
BASE = 'https://nfb-pt.github.io'
errors = []
class Page(HTMLParser):
    def __init__(self, file):
        super().__init__(); self.file=file; self.links=[]; self.ids=set(); self.h1=0; self.lang=''; self.canonical=[]; self.main=0; self.alias=False; self.alt=[]; self.images=[]; self.description=False; self.robots=''
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag=='html': self.lang=a.get('lang')
        if tag=='h1': self.h1+=1
        if tag=='main': self.main+=1
        if tag=='meta' and a.get('http-equiv')=='refresh': self.alias=True
        if tag=='meta' and a.get('name')=='description': self.description=bool(a.get('content'))
        if tag=='meta' and a.get('name')=='robots': self.robots=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
        if tag=='link' and a.get('hreflang'): self.alt.append((a.get('hreflang'), a.get('href')))
        if tag=='img':
            self.images.append(a)
            if 'alt' not in a: errors.append(f'{self.file}: image missing alt')
            if not a.get('width') or not a.get('height'): errors.append(f'{self.file}: image missing dimensions')
        for key in ('href','src'):
            if a.get(key): self.links.append(a[key])
        if a.get('srcset'):
            self.links.extend(part.strip().split()[0] for part in a['srcset'].split(','))
        if tag=='meta' and a.get('property')=='og:image': self.links.append(a.get('content',''))

pages={}
for file in ROOT.rglob('*.html'):
    p=Page(file.relative_to(ROOT));text=file.read_text();p.feed(text);pages[file]=p
    if p.alias: continue
    if 'pagefind' in file.parts: continue
    expected='en' if file.relative_to(ROOT).parts[0]=='en' else 'pt-PT'
    if p.lang!=expected: errors.append(f'{p.file}: lang={p.lang}, expected {expected}')
    if p.main!=1 or p.h1!=1: errors.append(f'{p.file}: expected one main and one h1')
    if not p.description: errors.append(f'{p.file}: missing description')
    if len(p.canonical)!=1 or not p.canonical[0].startswith(BASE+'/'): errors.append(f'{p.file}: invalid canonical')
    if '[A COMPLETAR' in text: errors.append(f'{p.file}: exposed source placeholder')
    if 'credit' not in str(p.file) and re.search(r'TODO Group|todogroup|OSPO|Linux Foundation',text): errors.append(f'{p.file}: stale organisation reference')

checked=0
for file,p in pages.items():
    source='/'+file.relative_to(ROOT).as_posix()
    for link in p.links:
        u=urlparse(urljoin(BASE+source,link))
        if u.scheme not in ('http','https') or u.netloc!=urlparse(BASE).netloc: continue
        dest=ROOT/unquote(u.path).lstrip('/')
        if dest.is_dir(): dest=dest/'index.html'
        checked+=1
        if not dest.exists(): errors.append(f'{p.file}: broken link/asset {link}')
        elif u.fragment and dest in pages and unquote(u.fragment) not in pages[dest].ids: errors.append(f'{p.file}: missing anchor {link}')
    for lang,url in p.alt:
        u=urlparse(url);dest=ROOT/unquote(u.path).strip('/')
        if dest.is_dir():dest=dest/'index.html'
        if dest in pages and lang!='x-default' and pages[dest].lang!=lang: errors.append(f'{p.file}: hreflang target mismatch {url}')
for file in ROOT.rglob('*.css'):
    for link in re.findall(r'url\([\'"]?([^\)\'\"]+)',file.read_text()):
        if link.startswith('data:'):continue
        source='/'+file.relative_to(ROOT).as_posix();u=urlparse(urljoin(BASE+source,link))
        if u.netloc==urlparse(BASE).netloc and not (ROOT/u.path.lstrip('/')).is_file():errors.append(f'{file.name}: missing CSS asset {link}')
for file in ROOT.rglob('*.xml'):
    try:ET.parse(file)
    except ET.ParseError as e:errors.append(f'{file}: invalid XML {e}')
if not (ROOT/'pagefind/pagefind-entry.json').is_file():errors.append('Missing Pagefind index')
if any((ROOT/p).exists() for p in ['ja','zh-cn','zh-CN','img/logo-b.svg','img/social-share.png']):errors.append('Obsolete theme/localisation assets in output')
if errors:
    print('\n'.join(sorted(set(errors))));sys.exit(1)
print(f'Generated site: {len(pages)} HTML files, {checked} internal references, HTML semantics, metadata, CSS assets and XML checked.')
