-- Executar este script no editor SQL do Supabase
-- para criar a tabela_indicacao que armazenará as informações de RIPs e Cadastros Mínimos
-- da Aba 1, e que serão consumidos pela Aba 2.

CREATE TABLE IF NOT EXISTS tabela_indicacao (
    numero_requerimento TEXT PRIMARY KEY,
    dados_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Garantir que a tabela possa ser lida e escrita sem regras (para o funcionamento da POC atual)
-- OBS: Num ambiente de produção, políticas de RLS precisariam ser criadas.
ALTER TABLE tabela_indicacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON tabela_indicacao FOR ALL USING (true);
