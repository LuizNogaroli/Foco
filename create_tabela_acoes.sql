-- Script para criar a tabela_acoes e inserir os dados de teste do RIP 2026001
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS tabela_acoes (
    rip TEXT PRIMARY KEY,
    nup_sei TEXT,
    tipo_processo TEXT,
    resumo TEXT,
    descricao TEXT
);

-- Habilitar RLS e permitir acesso público para testes na POC
ALTER TABLE tabela_acoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access" ON tabela_acoes;
CREATE POLICY "Public Access" ON tabela_acoes FOR ALL USING (true);

-- Inserir os dados de mock para o RIP 2026001 conforme imagem fornecida
INSERT INTO tabela_acoes (rip, nup_sei, tipo_processo, resumo, descricao)
VALUES (
    '2026001',
    '19739.000123/2026-45',
    'Processo administrativo',
    'Apuração administrativa sobre a situação dominial e ocupacional',
    'Processo fictício instaurado para análise da regularidade da ocupação, verificação de eventuais restrições administrativas e avaliação da necessidade de manifestação técnica da SPU quanto à destinação do imóvel.'
)
ON CONFLICT (rip) DO UPDATE 
SET 
    nup_sei = EXCLUDED.nup_sei,
    tipo_processo = EXCLUDED.tipo_processo,
    resumo = EXCLUDED.resumo,
    descricao = EXCLUDED.descricao;
