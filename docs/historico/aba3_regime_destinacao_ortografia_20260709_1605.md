# Correção Ortográfica e de Acentuação nos Regimes de Destinação

## Estado Anterior (Antes)
No arquivo [foco-03.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-03.html), o dropdown do campo "Regime de destinação proposto:" apresentava termos com erros de acentuação, grafia incorreta ou caracteres corrompidos, tais como:
- `condies` (Cessão de uso em condies especiais)
- `Áreal` (Concessão de Direito Áreal)
- `Promessaúde` (Promessaúde compra e venda)
- `Remio` (Remio do foro)
- `gesto` (gesto de orlas)
- `Transferncia` (Transferncia de propriedade)

No arquivo [index.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/index.html), a opção correspondente à Cessão de Uso gratuita carecia da preposição "a":
- `Cessão de Uso gratuita entidade s/ fins lucrativos`

## Estado Novo (Depois)
Efetuamos a correção de acentuação e termos em ambos os arquivos para garantir integridade e correspondência perfeita dos filtros:
- `condições` (Cessão de uso em condições especiais)
- `Real` (Concessão de Direito Real)
- `Promessa de` (Promessa de compra e venda)
- `Remição` (Remição do foro)
- `gestão` (gestão de orlas)
- `Transferência` (Transferência de propriedade)
- `Cessão de Uso gratuita a entidade s/ fins lucrativos` (com "a")

## Plano de Rollback / Desfazer
Para reverter as correções ortográficas:
1. Abra os arquivos [foco-03.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-03.html) e [index.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/index.html).
2. Localize as tags `<option>` dentro do respectivo elemento `<select>`.
3. Substitua os termos corrigidos pelos termos incorretos originais detalhados na seção "Estado Anterior".
