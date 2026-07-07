-- Script para Popular Banco de Dados Foco-11
-- Dados baseados na imagem do painel gerencial

-- 1. Inserindo os Requerimentos Principais (A Capa do Processo)
INSERT INTO tabela_requerimentos (numero_requerimento, dados_json) VALUES
('PR2026001', '{"data_req": "01/01/2026", "uf": "PR", "municipio": "Curitiba/PR", "interessado": "Prefeitura Municipal A", "processo_sei": "10480.002401/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('DF2026002', '{"data_req": "02/01/2026", "uf": "DF", "municipio": "Brasília/DF", "interessado": "Universidade Federal B", "processo_sei": "10480.002402/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('RJ2026003', '{"data_req": "03/01/2026", "uf": "RJ", "municipio": "Niterói/RJ", "interessado": "Marinha do Brasil C", "processo_sei": "10480.002403/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('RJ2026004', '{"data_req": "04/01/2026", "uf": "RJ", "municipio": "Niterói/RJ", "interessado": "Associação de Moradores D", "processo_sei": "10480.002404/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('PR2026005', '{"data_req": "05/01/2026", "uf": "PR", "municipio": "Curitiba/PR", "interessado": "Prefeitura Municipal E", "processo_sei": "10480.002405/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('PR2026006', '{"data_req": "06/01/2026", "uf": "PR", "municipio": "Curitiba/PR", "interessado": "Universidade Federal F", "processo_sei": "10480.002406/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('AM2026007', '{"data_req": "07/01/2026", "uf": "AM", "municipio": "Manaus/AM", "interessado": "ONG Ambiental G", "processo_sei": "10480.002407/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('SP2026008', '{"data_req": "08/01/2026", "uf": "SP", "municipio": "Santos/SP", "interessado": "Instituto de Pesquisa H", "processo_sei": "10480.002408/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('RS2026009', '{"data_req": "09/01/2026", "uf": "RS", "municipio": "Porto Alegre/RS", "interessado": "Governo do Estado I", "processo_sei": "10480.002409/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('CE2026010', '{"data_req": "10/01/2026", "uf": "CE", "municipio": "Fortaleza/CE", "interessado": "Universidade Federal J", "processo_sei": "10480.002410/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('DF2026011', '{"data_req": "11/01/2026", "uf": "DF", "municipio": "Brasília/DF", "interessado": "Associação de Moradores K", "processo_sei": "10480.002411/2026-66", "regime_requerido": "Cessão Onerosa"}'),
('SP2026012', '{"data_req": "12/01/2026", "uf": "SP", "municipio": "São Paulo/SP", "interessado": "Governo do Estado L", "processo_sei": "10480.002412/2026-66", "regime_requerido": "Cessão Onerosa"}');

-- 2. Inserindo os dados na tabela de Status do Fluxo
INSERT INTO tabela_status_fluxo (numero_requerimento, dados_json) VALUES
('PR2026001', '{"checkpoint": "SPU/PR - Destinação", "status_geral": "Aguardando Análise"}'),
('DF2026002', '{"checkpoint": "SPU/DF", "status_geral": "Aguardando Análise"}'),
('RJ2026003', '{"checkpoint": "SPU/RJ", "status_geral": "Aguardando Análise"}'),
('RJ2026004', '{"checkpoint": "SPU/RJ", "status_geral": "Aguardando Análise"}'),
('PR2026005', '{"checkpoint": "SPU/PR", "status_geral": "Aguardando Análise"}'),
('PR2026006', '{"checkpoint": "SPU/PR", "status_geral": "Aguardando Análise"}'),
('AM2026007', '{"checkpoint": "SPU/AM - Destinação", "status_geral": "Aguardando Análise"}'),
('SP2026008', '{"checkpoint": "SPU/SP", "status_geral": "Aguardando Análise"}'),
('RS2026009', '{"checkpoint": "SPU/RS", "status_geral": "Aguardando Análise"}'),
('CE2026010', '{"checkpoint": "SPU/CE", "status_geral": "Aguardando Análise"}'),
('DF2026011', '{"checkpoint": "SPU/DF", "status_geral": "Aguardando Análise"}'),
('SP2026012', '{"checkpoint": "SPU/SP", "status_geral": "Aguardando Análise"}');

-- 3. Inserindo os dados na tabela de Atribuição
INSERT INTO tabela_atribuicao (numero_requerimento, dados_json) VALUES
('PR2026001', '{"atribuido_para": "Não atribuído"}'),
('DF2026002', '{"atribuido_para": "Não atribuído"}'),
('RJ2026003', '{"atribuido_para": "Não atribuído"}'),
('RJ2026004', '{"atribuido_para": "Não atribuído"}'),
('PR2026005', '{"atribuido_para": "Não atribuído"}'),
('PR2026006', '{"atribuido_para": "Não atribuído"}'),
('AM2026007', '{"atribuido_para": "Não atribuído"}'),
('SP2026008', '{"atribuido_para": "Não atribuído"}'),
('RS2026009', '{"atribuido_para": "Não atribuído"}'),
('CE2026010', '{"atribuido_para": "Não atribuído"}'),
('DF2026011', '{"atribuido_para": "Não atribuído"}'),
('SP2026012', '{"atribuido_para": "Não atribuído"}');
