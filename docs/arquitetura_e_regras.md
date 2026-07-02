# Arquitetura e Regras de Negócio do Projeto de Admissibilidade

Este documento registra as decisões arquiteturais e as regras de negócio essenciais aplicadas ao sistema, servindo como base de conhecimento para consultas futuras e para a equipe de desenvolvimento.

## 1. Fronteira de Rascunho (Draft Boundary)

Para garantir a integridade dos dados dos sistemas corporativos oficiais (Portal de Serviços, Datalake, SPUnet), o sistema de Admissibilidade foi construído sob uma **Fronteira de Rascunho**.

- **Leitura Segura (Read-Only)**: O sistema consulta as bases de dados externas através de requisições do tipo `GET`. Ele "lê" as informações originais do imóvel ou do requerimento para preencher o formulário inicial automaticamente.
- **Isolamento de Salvamento**: Todas as edições feitas na tela, inclusões e remoções de RIPs ou documentos ocorrem **exclusivamente no banco de dados local do sistema de Admissibilidade** (atualmente utilizando o Supabase, na tabela `foco_drafts`). 
- **Sem Sobrescrita Externa**: O código de sincronização (`sync.js`) e banco de dados (`db.js`) não possui funções de `POST/PUT/PATCH` apontadas para as APIs externas. Dessa forma, é tecnologicamente impossível que um usuário sobrescreva o banco de dados oficial do SPUnet a partir da tela de rascunho de admissibilidade. O Supabase é o guardião do "estado do formulário", e os sistemas externos são os guardiões dos "dados da União".

## 2. Gatilho de Sincronia de Rede (`DATABASE_LOADED`)

Devido a latências variáveis de rede, as abas do sistema não utilizam temporizadores fixos (`setTimeout`) para carregar os dados.

- **O Evento**: Assim que o `db.js` termina de consultar e baixar os dados do processo do Supabase, ele dispara um evento global (Trigger) chamado `DATABASE_LOADED`.
- **A Captura**: Arquivos como o `foco-01.js` ficam em compasso de espera ("escutando"). Apenas quando esse evento é capturado, o sistema executa a injeção dos dados e monta os blocos na tela (ex: blocos de RIPs importados). Isso elimina bugs de carregamento onde a tela renderizava antes dos dados chegarem.

## 3. Inteligência de Auto-Reparação e Regras de RIPs

Existem cenários complexos onde a lista de RIPs de um requerimento pode estar vazia no banco local, seja por intenção do usuário ou por erros de instabilidades passadas.

- **A Regra de Negócio (Obrigatoriedade)**: Por regra, um imóvel com conceituação que aponte para um tipo específico da união (terreno de marinha, marginal, interior, etc) **obrigatoriamente precisa ter pelo menos um RIP**.
- **A Exceção (Praia e Mangue)**: Se a conceituação do imóvel for "Praia" ou "Mangue", é juridicamente aceitável que não haja um RIP atrelado.
- **Reparação de Corrupção (Fantasmas/Vazios)**: Quando o sistema carrega uma lista de RIPs vazia do banco de rascunhos, a Inteligência Artificial do `foco-01.js` avalia a regra acima.
    - Se for Praia/Mangue: O sistema compreende que o usuário intencionalmente zerou a lista de RIPs e obedece (deixando vazio).
    - Se NÃO for Praia/Mangue: O sistema sabe que a lista NÃO PODE estar vazia. Ele conclui que o banco foi corrompido em algum salvamento instável e entra em modo de segurança: ele ignora o estado vazio gravado no rascunho e **restaura automaticamente os RIPs originais (mock/nativos)** daquele processo. Isso elimina "fantasmas" e resgata dados perdidos.

## 4. Atualização Visual Reativa (Dados do Requerimento)

O campo bloqueado `RIP(s) associado(s)` (localizado no topo do formulário) possui atualização reativa:
- Ele é recalculado toda vez que a função `window.atualizarListaRipsOculta()` é invocada.
- Sempre que um usuário "Adiciona" ou "Remove" um RIP pelo box inferior, esse gatilho dispara, garantindo que o cabeçalho do requerimento sempre exiba com precisão a lista exata de RIPs no momento, sem necessidade de atualizar a página inteira.
