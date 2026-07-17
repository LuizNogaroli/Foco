const WORKFLOW_STAGES = {
  // --- FLUXO POSITIVO (AVANÇO) ---
  1:  { id_workflow: 1,  tag_fluxo: "Normal", status: "Aguardando análise",           instancia: "Painel de Requerimentos", perfil: "Todos",               descricao: "Aguardando iniciar a análise" },
  2:  { id_workflow: 2,  tag_fluxo: "Normal", status: "Indicação do imóvel",          instancia: "Destinação",              perfil: "Equipe (Destinação)",     descricao: "Indicação de imóvel/área" },
  3:  { id_workflow: 3,  tag_fluxo: "Normal", status: "Diagnóstico preliminar do imóvel",        instancia: "Caracterização",          perfil: "Equipe (Caracterização)", descricao: "Diagnóstico das características do imóvel" },
  4:  { id_workflow: 4,  tag_fluxo: "Normal", status: "Análise de viabilidade",          instancia: "Destinação",              perfil: "Equipe (Destinação)",     descricao: "Análise Preliminar do Imóvel" },
  5:  { id_workflow: 5,  tag_fluxo: "Normal", status: "Validação análise de viabilidade - Chefia",             instancia: "Chefia",                  perfil: "Chefia",                  descricao: "Validação da Chefia no âmbito da SPU/UF" },
  6:  { id_workflow: 6,  tag_fluxo: "Normal", status: "Validação análise de viabilidade - Coordenação",        instancia: "Coordenação",             perfil: "Coordenação",             descricao: "Validação da Coordenação no âmbito da SPU/UF" },
  7:  { id_workflow: 7,  tag_fluxo: "Normal", status: "Deliberação Superintendência", instancia: "Superintendência",        perfil: "Superintendência",        descricao: "Deliberação da Superintendência no âmbito da SPU/UF" },
  8:  { id_workflow: 8,  tag_fluxo: "Normal", status: "Conferência análise de viabilidade",        instancia: "Equipe C.G.",             perfil: "Equipe C.G.",             descricao: "Validação da Equipe C.G. no âmbito da SPU/UC" },
  9:  { id_workflow: 9,  tag_fluxo: "Normal", status: "Validação análise de viabilidade - Coordenação-Geral",  instancia: "Coordenação-Geral",       perfil: "Coordenação-Geral",       descricao: "Validação da Coordenação-Geral no âmbito da SPU/UC" },
  10: { id_workflow: 10, tag_fluxo: "Normal", status: "Validação conferência",            instancia: "Direção",                 perfil: "Direção",                 descricao: "Validação da Direção no âmbito da SPU/UC" },
  11: { id_workflow: 11, tag_fluxo: "Normal", status: "Manifestação CDE",              instancia: "CDE",                     perfil: "CDE",                     descricao: "Deliberação da Comissão de Destinações Especiais" },

  // --- FLUXO NEGATIVO (DEVOLUÇÕES / SALTOS) ---
  12: { id_workflow: 12, tag_fluxo: "Devolvido", status: "Indicação do imóvel",                    instancia: "Destinação",              perfil: "Equipe (Destinação)",     descricao: "Devolução para indicação de outro imóvel/área, acrescentar ou excluir imóvel/área" },
  13: { id_workflow: 13, tag_fluxo: "Devolvido", status: "Diagnóstico preliminar do imóvel",                    instancia: "Caracterização",          perfil: "Equipe (Caracterização)", descricao: "Devolução para ajuste na análise preliminar do imóvel/área" },
  14: { id_workflow: 14, tag_fluxo: "Devolvido", status: "Análise de viabilidade",                    instancia: "Destinação",              perfil: "Equipe (Destinação)",     descricao: "Devolução para ajuste na proposta de destinação" },
  15: { id_workflow: 15, tag_fluxo: "Devolvido", status: "Validação análise de viabilidade - Coordenação-Geral",                    instancia: "Coordenação-Geral",       perfil: "Coordenação-Geral",       descricao: "Devolução do processo para ajustes" },
  16: { id_workflow: 16, tag_fluxo: "Devolvido", status: "Deliberação Superintendência",                    instancia: "Superintendência",        perfil: "Superintendência",        descricao: "Devolução do processo para ajustes" },
  17: { id_workflow: 17, tag_fluxo: "Normal",   status: "Concluído",                                    instancia: "Superintendência",     perfil: "Superintendência",      descricao: "Processo concluído via Superintendência" },
  18: { id_workflow: 18, tag_fluxo: "Normal",   status: "Concluído",                                    instancia: "CDE",                  perfil: "CDE",                   descricao: "Processo concluído via CDE" }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = WORKFLOW_STAGES;
}
