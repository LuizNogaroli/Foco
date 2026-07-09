# Simplificação da Interface de Geolocalização (Aba 2)

**Data:** 08 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
- **Ocultação dos Campos de Entrada (foco-02.html):**
  - Removi a exibição dos campos de entrada textuais *"Localizar por CEP"*, *"Latitude"* e *"Longitude"*.
  - Transformei estes três campos em elementos do tipo `<input type="hidden">`.
  - Isto assegura que toda a lógica existente de sincronismo com o Supabase, preenchimento geográfico e salvamento do mapa continue operando perfeitamente sem quebrar as integrações de geolocalização do SPUnet.
- **Botão de Mapa Único:**
  - Reduzi a seção visual a apenas o botão *"🗺️ Abrir mapa..."* estilizado centralizadamente na tela.
