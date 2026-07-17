# Implementação de Trilha de Auditoria com Snapshots JSON e Geração Dinâmica de PDFs

## Contexto do Desafio
O sistema FOCO lida com fluxos de processos governamentais que precisam manter um histórico inviolável de quem preencheu, o que preencheu e quando preencheu, gerando a necessidade de anexação de relatórios físicos (PDFs) no sistema convencional de protocolo eletrônico (SEI). 

A abordagem inicial de gerar um PDF fisicamente toda vez que alguém assinava uma etapa e enviá-lo ao banco de dados levantou a questão de peso de armazenamento e lentidão de rede. Ao mesmo tempo, o limite de 5MB da API `localStorage` do navegador inviabilizava manter documentos em Base64 na memória local.

## A Solução Arquitetural: "Máquina do Tempo" (JSON Snapshots)
Foi definido que, em vez de gerar e armazenar os arquivos pesados (PDFs) no banco de dados Supabase (via Supabase Storage) a cada passo, o sistema trabalhará com o conceito de **Snapshots Imutáveis de Dados em JSONB**.

### Estrutura e Vantagens
1. **Captura Fiel no Momento Zero:** Quando o usuário clica em "Registrar Manifestação" ou "Avançar", o sistema tira uma "fotografia" (Deep Copy) do objeto unificado `window.formDataState` inteiro.
2. **Armazenamento Leve:** Esse JSON é inserido na tabela `foco_historico` com o nome da etapa e um `timestamp` emitido diretamente no servidor de banco de dados (o que evita falsificações de relógio local). Custo e peso de transação quase nulos.
3. **Geração Dinâmica de PDF Sob Demanda (O "Pulo do Gato"):** Como o JSON retém absolutamente todas as escolhas, IDs, checklists e os dados da assinatura digital registrados naquela hora exata, podemos, em qualquer data futura, renderizar visualmente esse JSON em uma página HTML "em branco" e aí sim evocar a biblioteca `html2pdf.js` para baixar o PDF.

### Trecho de Implementação (`db.js`)
```javascript
window.salvarSnapshotHistorico = async (abaOrigem) => {
    // A Deep Copy previne que alterações futuras mutacionem os dados que estamos prestes a enviar pela rede
    const dadosSnapshot = JSON.parse(JSON.stringify(window.formDataState));
    
    // O backend ou SDK encarrega-se do Timestamp confiável
    const payload = {
        processo_id: processId,
        aba_origem: abaOrigem,
        dados_snapshot: dadosSnapshot
    };

    // Chamada REST / Supabase SDK
    // ... POST -> foco_historico ...
};
```

Esta escolha de engenharia privilegia performance, baixo custo de servidor na nuvem e flexibilidade na interface gráfica do histórico (podendo ser renderizada como Timeline nativa no HTML ou gerada em PDF on-the-fly).
