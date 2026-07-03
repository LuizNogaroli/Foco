const rip = '2026001';
const name = 'natureza_terreno';
const label = 'Natureza do Terreno';
const valStr = 'Terreno Nacional Interior';

const editIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-top: -3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

let encLabel = encodeURIComponent(label);
let encVal = encodeURIComponent(valStr);
let iconHtml = `<span class="edit-icon" style="cursor: pointer; margin-left: 8px; color: #0056b3;" title="Solicitar Alteração/Inclusão" onclick="openSolicitacaoModal('${rip}', '${name}', '${encLabel}', '${encVal}')">${editIconSVG}</span>`;

const html = `
    <div class="form-group editavel" style="margin: 0; position: relative;">
        <label>${label}:${iconHtml}</label>
        <input type="text" name="imoveis[1][${name}]" value="${valStr}" readonly class="auto-loaded-field" style="padding-right: 30px;">
    </div>
`;
console.log(html);
