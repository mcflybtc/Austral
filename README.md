
# Lyra Orrery (Next.js + Tailwind + shadcn/ui + astronomy.ts)

Aplicação Next.js que usa `src/lib/astronomy.ts` como **fonte de verdade** para dados astronômicos.

## Rodar localmente
Requisitos: Node.js 18+ e npm.

```bash
npm install
npm run dev
```
Acesse <http://localhost:3000> para ver a interface. O botão "Gerar dados reais" utiliza componentes do shadcn/ui e chama o arquivo `astronomy.ts` via rotas API.

## Verificar API
As rotas REST estão em `/app/api/*`. Exemplo para posições:

```bash
curl "http://localhost:3000/api/positions?lat=-3.7&lon=-38.5"
```

## Build
```bash
npm run build
npm start
```

## Testes
```bash
npm test
```

## Publicar no GitHub (sem Git instalado)
- Faça download deste `.tar.gz` ou `.zip`.
- Descompacte localmente.
- **Abra um repositório no GitHub** (novo, vazio) e copie a URL (ex.: `git@github.com:SEU_USER/lyra-orrery.git`).

Se tiver Git instalado, use o script:

```bash
bash init-git-and-push.sh git@github.com:SEU_USER/lyra-orrery.git
```
