# SOLTREM — v15 (Pagamentos + Wi-Fi)

- Secção de pagamentos redesenhada: cartão Revolut destacado e MB WAY / SPIN em cartões individuais, sem bordas pesadas; layouts específicos para mobile e desktop.
- Ícone Wi-Fi revisto e integrado numa medalha verde, com palavra-passe e ação de copiar intactas.
- Menus, imagens, QR, preços e contactos mantidos a partir da v14.
- Para abrir: extrair o ZIP e abrir `index.html`.

# SOLTREM — Website mobile-first

Página estática sem instalação, sem npm e sem dependências externas. Uma única entrada pelo QR Code abre o `index.html`.

## Visualização

Extrai o ZIP inteiro. Abre `index.html` no Chrome. As pastas e ficheiros `assets/`, `styles.css`, `viewer.css`, `site.js`, `menu.js`, `comidas.html` e `bebidas.html` devem ficar todos juntos.

## Conteúdo

- Fotografias reais do bar a preto e branco e panorâmica histórica feita das fotografias fornecidas.
- Dois cartões para o menu (Comidas e Bebidas), com as imagens completas em resolução elevada; abre o menu e amplia com dois dedos ou botões.
- Wi-Fi: palavra-passe e botão copiar.
- Revolut: QR e ligação direta `https://revolut.me/marcocorreia73`.
- MB WAY e SPIN: número 965 342 288, com opção de copiar. Confirma a associação do número às contas correspondentes.
- Morada abre Maps e os contactos usam `tel:`.

## Publicação

Envia todo o conteúdo desta pasta para a raiz do repositório GitHub Pages (não apenas o `index.html`). Não é preciso fazer commit antes de veres se gostas. O QR Code do cliente deve apontar para o endereço público do site, não para o endereço local `file://`.

## Nota

O botão Revolut abre o endereço configurado; a confirmação do pagamento é sempre externa ao site. Os logos MB WAY e SPIN são versões SVG simplificadas, sem fundos opacos; antes do uso final, considera usar os ficheiros oficiais das marcas.

## Versão 13 — Sombras

Refinadas as sombras de menus, Wi-Fi, pagamentos, contactos, botões e diálogos. Foram removidas as sombras duras douradas que pareciam segundas bordas. Nenhum texto, preço, imagem, link ou comportamento foi alterado.
