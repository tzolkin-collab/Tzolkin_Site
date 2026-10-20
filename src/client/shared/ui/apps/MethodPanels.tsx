/**
 * Painéis de código para "Como construímos", com o CodeBlock do kit.
 * Exemplos ilustrativos: sem dados reais e sem promessa de certificação.
 * Os três painéis têm 10 linhas, a mesma altura e linhas curtas (sem rolagem horizontal).
 */
import { CodeBlock, IllustrativeTag, tok } from '@/client/shared/ui/assets';
import type { CodeLine } from '@/client/shared/ui/assets';

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden="true" inert className="min-w-0">
      <div className="h-[286px]">{children}</div>
      <IllustrativeTag className="mt-3 !text-[11px] !normal-case !tracking-normal text-foreground/70" />
    </div>
  );
}

const permissoes: readonly CodeLine[] = [
  [tok('cm', '// perfis e ações por área')],
  [tok('kw', 'export const'), tok('var', ' perfis'), tok('punct', ' = {')],
  [tok('plain', '  '), tok('var', 'admin'), tok('punct', ': ['), tok('num', 'LER'), tok('punct', ', '), tok('num', 'EDITAR'), tok('punct', ', '), tok('num', 'APAGAR'), tok('punct', '],')],
  [tok('plain', '  '), tok('var', 'operador'), tok('punct', ': ['), tok('num', 'LER'), tok('punct', ', '), tok('num', 'EDITAR'), tok('punct', '],')],
  [tok('plain', '  '), tok('var', 'leitura'), tok('punct', ': ['), tok('num', 'LER'), tok('punct', '],')],
  [tok('punct', '} '), tok('kw', 'as const'), tok('punct', ';')],
  [],
  [tok('kw', 'export const'), tok('fn', ' pode'), tok('punct', ' = (p, a) =>')],
  [tok('plain', '  '), tok('var', 'perfis'), tok('punct', '[p].'), tok('fn', 'includes'), tok('punct', '(a);')],
  [tok('kw', 'const'), tok('var', ' chave'), tok('punct', ' = '), tok('var', 'process.env.'), tok('num', 'API_KEY'), tok('punct', ';')],
];

const recursos: readonly CodeLine[] = [
  [tok('cm', '# quem responde por cada recurso')],
  [tok('fn', 'hospedagem'), tok('punct', ':   { dono: '), tok('str', 'TZOLKIN'), tok('punct', ' }')],
  [tok('fn', 'banco_dados'), tok('punct', ':  { dono: '), tok('str', 'TZOLKIN'), tok('punct', ' }')],
  [tok('fn', 'filas'), tok('punct', ':        { dono: '), tok('str', 'TZOLKIN'), tok('punct', ' }')],
  [],
  [tok('cm', '# contas que ficam com você')],
  [tok('fn', 'dominio'), tok('punct', ':      { dono: '), tok('kw', 'CLIENTE'), tok('punct', ' }')],
  [tok('fn', 'servicos_ext'), tok('punct', ': { dono: '), tok('kw', 'CLIENTE'), tok('punct', ' }')],
  [],
  [tok('fn', 'revisao_acessos'), tok('punct', ': '), tok('str', 'trimestral')],
];

const terminal: readonly CodeLine[] = [
  [tok('punct', '$ '), tok('fn', 'tree'), tok('plain', ' -L 1 projeto')],
  [tok('plain', '├── '), tok('var', 'docs/')],
  [tok('plain', '├── '), tok('var', 'src/')],
  [tok('plain', '├── '), tok('var', 'tests/')],
  [tok('plain', '└── '), tok('var', 'HANDOFF.md')],
  [tok('punct', '$ '), tok('fn', 'npm'), tok('plain', ' test')],
  [tok('str', '✓ '), tok('plain', 'fluxos críticos '), tok('cm', '(12)')],
  [tok('str', '✓ '), tok('plain', 'permissões '), tok('cm', '(4)')],
  [tok('str', '✓ '), tok('plain', 'responsáveis '), tok('cm', '(3)')],
  [tok('str', '19 passaram'), tok('cm', ' · 0 falhas')],
];

export function PermissionsPanel() {
  return (
    <Wrap>
      <CodeBlock
        className="h-full"
        lines={permissoes}
        tabs={[{ name: 'permissoes.ts', active: true }, { name: '.env.example' }]}
        highlightLines={[10]}
        ariaLabel="Exemplo de arquivo de permissões"
      />
    </Wrap>
  );
}

export function ResourcesPanel() {
  return (
    <Wrap>
      <CodeBlock
        className="h-full"
        lines={recursos}
        tabs={[{ name: 'recursos.yaml', active: true }, { name: 'infra.md' }]}
        highlightLines={[7, 8]}
        ariaLabel="Exemplo de arquivo de recursos e responsáveis"
      />
    </Wrap>
  );
}

export function RepoPanel() {
  return (
    <Wrap>
      <CodeBlock
        className="h-full"
        variant="terminal"
        title="projeto — zsh"
        showLineNumbers={false}
        lines={terminal}
        highlightLines={[10]}
        ariaLabel="Exemplo de árvore do repositório e testes"
      />
    </Wrap>
  );
}
