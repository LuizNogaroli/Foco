const fs = require('fs');
const logPath = 'kb/troubleshooting_log.md';

const newEntry = `

### 5. Corrupção Global de Caracteres Especiais (Acentos)
**Sintoma:** Textos na interface do usuário (como alertas "Avançando para a próxima etapa" e títulos como "Identificação do Imóvel") passaram a exibir o caractere de interrogação ou apresentar as palavras faltando letras (ex: \`Imvel\`, \`prxima\`).
**Causa:** Como detalhado no item 4, manipulações feitas por scripts no terminal (PowerShell) utilizando codificações legadas gravaram bytes inválidos nos arquivos UTF-8. Ao serem lidos posteriormente, o sistema converteu esses bytes corrompidos permanentemente no *Unicode Replacement Character* (código \`\\uFFFD\`). Além do texto visível, isso afetou comentários e cabeçalhos de arquivos (BOM UTF-8).
**Solução Aplicada:** Como a corrupção estava espalhada por dezenas de arquivos \`.js\` e \`.html\`, a solução manual seria inviável. Foi desenvolvido um script em Node.js (\`fix.js\`) que realizou uma varredura recursiva em todo o projeto. O script:
1. Detectou arquivos contendo o caractere \`\\uFFFD\`.
2. Utilizou um dicionário de mapeamento para substituir as palavras fragmentadas por suas versões originais (ex: \`Identifica\\uFFFDo\` -> \`Identificação\`, \`Avan\\uFFFDando\` -> \`Avançando\`).
3. Limpou cabeçalhos BOM (Byte Order Mark) corrompidos no topo de arquivos como \`foco-02.js\` e \`foco-06.js\`.
4. Salvou os arquivos corrigidos forçando o *encoding* estrutural correto (\`utf8\`).
Após rodar o script, os arquivos foram restaurados com sucesso.
`;

fs.appendFileSync(logPath, newEntry, 'utf8');
console.log('Appended to log successfully.');
