# Foto institucional do formulário (/forms)

Para o lado esquerdo da tela do formulário, que hoje mostra um gradiente de reserva. A página procura o arquivo **`public/forms/escritorio.jpg`**; assim que ele existir, aparece sozinho, sem mexer em código.

## Especificação do arquivo

- Formato retrato, **4:5** (ex.: 1600 × 2000 px). A área visível no desktop é a metade esquerda da tela (cerca de 720 × 900 px), cortada com `cover` e centralizada.
- JPG, até uns 400 KB depois de otimizar. Uma única foto serve para o tema claro e para o escuro (no escuro o código escurece um pouco por cima).
- **Espaço livre** em dois lugares: canto superior esquerdo (a logo em branco fica ali) e faixa inferior (a frase de apoio). A pessoa fica no centro e um pouco à direita.
- Sem texto, sem logotipos legíveis, sem marca d'água. A tela do notebook não pode mostrar nada legível.

## Prompt (inglês, para gerador de imagem)

```
Photorealistic editorial photograph, shot on a full-frame camera with a 35mm lens at f/2.8, natural daylight.

A young white woman in her late 20s, a marketing professional who looks like a game developer: stylish and nerdy, round black-framed glasses, over-ear headphones resting on her head, an oversized soft knit sweater in muted charcoal over a plain t-shirt, small enamel pin on the collar. She is seated facing the camera, looking toward the lens with a relaxed, focused expression and a hint of a smile, working on a silver MacBook (the back of the laptop faces the camera, no logo visible, the screen is not visible). One hand is on the trackpad, the other holds a ceramic coffee cup, steam barely visible.

The camera sits slightly lower and wider than eye level, at an open three-quarter angle, so the whole scene reads: her wooden desk in the foreground with a few small green plants (a pothos in a terracotta pot, a small succulent), a notebook and a pen, warm natural oak wood with visible grain.

Setting: a modern big-tech style office that is cozy and human, floor-to-ceiling glass walls and glass partitions, light wood floors and wood details, soft daylight coming through the glass from the left, a few indoor plants. In the background, softly out of focus, a long corporate meeting table in light wood with ergonomic chairs and a wall-mounted display turned off, seen through glass. No other people in focus, no one in the background.

Color palette: warm neutrals, honey wood, soft greens, charcoal and off-white, with a tiny accent of deep red (the coffee cup is matte dark red). Calm, premium, institutional, trustworthy. Gentle depth of field, natural skin texture, realistic hands with five fingers, no retouching look. Composition for a 4:5 vertical crop: subject centered slightly right, clear empty space in the upper-left corner and along the bottom edge.

No text, no signage, no logos, no watermark.
```

### Negative prompt (se o gerador aceitar)

```
text, letters, logo, watermark, Apple logo, readable screen, extra fingers, deformed hands, plastic skin, oversaturated, neon colors, cyberpunk, gaming RGB lighting, cluttered desk, stock photo smile, looking away, crowded office, fisheye distortion
```

## Variações úteis

- **Mais quente:** trocar "natural daylight" por "late morning golden light".
- **Mais sóbria:** trocar o suéter por uma camisa de linho cinza e tirar o pin.
- **Se o rosto sair artificial:** pedir `candid, mid-laugh, looking slightly off-camera` e escolher a melhor entre quatro gerações.

## Antes de publicar

- Se for uma pessoa gerada por IA, não apresentar como equipe, cliente nem depoimento. A página não tem legenda nem nome na foto, e não deve ter.
- Conferir mãos, vidro e reflexos (erros comuns), e se a tela do notebook está ilegível.
- Salvar como `public/forms/escritorio.jpg`.
