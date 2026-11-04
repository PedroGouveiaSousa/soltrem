# SOLTREM — Site de menus v5 (mobile-first)

Site estático para clientes que leem o QR Code nas mesas do SOLTREM.

## Como testar (sem fazer commit)

1. Extrai o ZIP inteiro para uma pasta.
2. Abre `index.html` no Chrome ou noutro navegador.
3. Testa **Comidas** e **Bebidas**, os botões de troca dentro do visualizador, o zoom `+` / `−`, o gesto de pinça, o botão **Fechar** e o voltar à página inicial.
4. No Chrome podes testar o aspeto de telemóvel com `F12` → barra de dispositivos. Para testar gestos de toque a sério, abre num telemóvel.

Não precisas de instalar dependências ou iniciar um servidor. Os menus estão na pasta `assets/`.

## Depois de aprovares

Copia estes ficheiros e a pasta `assets` para a raiz do repositório que o GitHub Pages publica. Só depois faz commit. O QR Code deve apontar para o URL público da página inicial `index.html`.

## O que mudou face à v4

- Os dois menus são o foco da página e aparecem logo no ecrã do telemóvel.
- Logótipo original, apenas uma vez, sem sobreposição sobre as fotografias.
- Paleta consistente: creme, verde floresta e detalhes dourados.
- Fotografias reais do espaço em preto e branco, sem imagens de catálogo.
- Visualizador em ecrã completo no telemóvel, com botões grandes e alinhados, alternância direta entre Comidas/Bebidas e zoom por pinça ou botões.
- Os dois cartazes aprovados são mantidos como imagens, sem qualquer alteração aos preços.
- Acessibilidade: links funcionam sem JavaScript, Escape fecha o visualizador, foco visível e respeito por `prefers-reduced-motion`.
- Sem frameworks, dependências externas, anúncios ou análises.

## Nota

O horário é o indicado na conversa: segunda a sexta 07:30–20:30, sábado 07:30–15:00, domingo encerrado. Confirma antes de publicar.
