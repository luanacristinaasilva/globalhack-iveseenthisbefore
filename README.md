# 🌟 I've Seen This Before — Sororidade & Mentoria
### Time BrasilIA | Trilha: DataConcise / Modernização de Data & AI

> Quando a Dev ou a PO escreve uma especificação técnica, o agente não só busca padrões passados — ele faz matchmaking de mentoria e colaboração feminina.

---

## Stack Técnica

| Camada       | Tecnologia                                         | Motivo                                        |
|--------------|----------------------------------------------------|-----------------------------------------------|
| **Frontend** | React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui | Prototipagem rápida e UI bonita out-of-the-box |
| **Backend**  | Node.js + Express + TypeScript                     | Familiar, rápido, mesmo ecossistema            |
| **Data**     | JSON estático simulando repos/Confluence           | MVP sem banco de dados, fácil de apresentar    |
| **Testes**   | Vitest (unit) + Supertest (API) + Playwright (e2e) | Suite completa, zero config com Vite           |

---

## Estrutura de Pastas

```
hackaton/
├── README.md
├── package.json                    ← root workspace (npm workspaces)
├── .gitignore
│
├── data/                           ← STEP 1: Fonte de dados simulada
│   ├── users.json
│   ├── contributions.json
│   └── skills.json
│
├── backend/                        ← Node.js + Express + TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── src/
│       ├── index.ts
│       ├── app.ts
│       ├── step1-datasource/
│       │   ├── dataLoader.ts
│       │   └── types.ts
│       ├── step2-indexer/
│       │   ├── contributionIndexer.ts
│       │   └── tagService.ts
│       ├── step3-profiles/
│       │   ├── profileService.ts
│       │   └── profileRoutes.ts
│       ├── step4-matchmaking/
│       │   ├── matchmakingEngine.ts
│       │   ├── notificationService.ts
│       │   └── matchmakingRoutes.ts
│       ├── step5-scheduling/
│       │   ├── schedulingService.ts
│       │   └── schedulingRoutes.ts
│       └── shared/
│           └── utils.ts
│
├── backend/tests/
│   ├── unit/
│   │   ├── dataLoader.test.ts
│   │   ├── contributionIndexer.test.ts
│   │   ├── profileService.test.ts
│   │   ├── matchmakingEngine.test.ts
│   │   └── schedulingService.test.ts
│   └── functional/
│       ├── profiles.api.test.ts
│       ├── matchmaking.api.test.ts
│       └── scheduling.api.test.ts
│
└── frontend/                       ← React + Vite + TypeScript + Tailwind
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── playwright.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── pages/
        │   ├── Home.tsx
        │   ├── Contributions.tsx
        │   ├── Profile.tsx
        │   ├── Matchmaking.tsx
        │   └── Scheduling.tsx
        ├── components/
        │   ├── layout/
        │   │   ├── Header.tsx
        │   │   ├── Sidebar.tsx
        │   │   └── Footer.tsx
        │   ├── contributions/
        │   │   ├── ContributionCard.tsx
        │   │   └── ContributionList.tsx
        │   ├── profile/
        │   │   ├── ProfileCard.tsx
        │   │   ├── SkillBadge.tsx
        │   │   └── OptInToggle.tsx
        │   ├── matchmaking/
        │   │   ├── MatchCard.tsx
        │   │   └── MatchList.tsx
        │   └── scheduling/
        │       ├── ScheduleModal.tsx
        │       └── ChatCard.tsx
        ├── hooks/
        │   ├── useContributions.ts
        │   ├── useProfile.ts
        │   ├── useMatchmaking.ts
        │   └── useScheduling.ts
        ├── services/
        │   ├── api.ts
        │   ├── contributionsService.ts
        │   ├── profileService.ts
        │   ├── matchmakingService.ts
        │   └── schedulingService.ts
        ├── types/
        │   └── index.ts
        └── tests/
            ├── unit/
            │   ├── ContributionCard.test.tsx
            │   ├── ProfileCard.test.tsx
            │   ├── MatchCard.test.tsx
            │   └── matchmakingService.test.ts
            └── functional/
                ├── home.spec.ts
                ├── profile.spec.ts
                ├── matchmaking.spec.ts
                └── scheduling.spec.ts
```
