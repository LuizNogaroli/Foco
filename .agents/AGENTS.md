## Regra de Base de Conhecimento (Knowledge Base)
Sempre que o agente enfrentar um desafio complexo e encontrar uma solução (arquitetural, lógica ou técnica), ele deve documentar esse aprendizado gerando um artefato (arquivo .md). Para evitar sobrescrita e acumular o histórico, o arquivo deve ser nomeado no formato `kb_<assunto>_YYYYMMDD_HHMM.md` (ex: `kb_datalake_fields_20260626_1755.md`). O objetivo é construir uma base de conhecimento duradoura para o projeto que depois será depurada em um documento único.

O agente deve criar os artefatos de Knowledge Base de forma autônoma e silenciosa, sem precisar relatar ao usuário a criação de cada um deles, pois o usuário fará a revisão posterior.
Certifique-se de salvar todos esses arquivos .md diretamente no diretório 'kb/' na raiz do projeto (crie-o se não existir), para manter o repositório organizado e não poluir a raiz do código.
