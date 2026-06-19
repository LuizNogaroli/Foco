const CAMPO511_DATA = [
    {
        group: "Uso por órgão/entidade da Administração Pública Federal",
        options: [
            { value: "Afetação", label: "Afetação" },
            { value: "Cessão de Uso gratuita APF", label: "Cessão de Uso gratuita — Adm. Pública Federal" },
        ],
    },
    {
        group: "Uso por ente federativo (Estado / DF / Município)",
        options: [
            { value: "Cessão de Uso gratuita ente federativo", label: "Cessão de Uso gratuita — ente federativo" },
            { value: "Cessão de Uso onerosa ente federativo", label: "Cessão de Uso onerosa — ente federativo" },
        ],
    },
    {
        group: "Uso por entidade sem fins lucrativos",
        options: [
            { value: "Cessão de Uso gratuita entidade", label: "Cessão de Uso gratuita — entidade s/ fins lucrativos" },
            { value: "Cessão de Uso onerosa entidade", label: "Cessão de Uso onerosa — entidade s/ fins lucrativos" },
        ],
    },
    {
        group: "Uso por particular (pessoa física ou jurídica)",
        options: [
            { value: "Concessão de Uso Especial para fins de Moradia (CUEM)", label: "Concessão de Uso Especial p/ fins de Moradia (CUEM)" },
            { value: "Concessão de Direito Real de Uso (CDRU) gratuita", label: "Concessão de Direito Real de Uso (CDRU) gratuita" },
            { value: "Concessão de Direito Real de Uso (CDRU) onerosa", label: "Concessão de Direito Real de Uso (CDRU) onerosa" },
            { value: "Autorização de Uso", label: "Autorização de Uso" },
            { value: "Locação", label: "Locação" },
            { value: "Arrendamento", label: "Arrendamento" },
        ],
    },
    {
        group: "Alienação",
        options: [
            { value: "Venda", label: "Venda" },
            { value: "Doação", label: "Doação" },
            { value: "Legitimação Fundiária", label: "Legitimação Fundiária" },
            { value: "Legitimação de Posse", label: "Legitimação de Posse" },
            { value: "Alienação em REURB", label: "Alienação em REURB" },
        ],
    },
    {
        group: "Sem destinação",
        options: [
            { value: "Manutenção em vacância", label: "Manutenção em vacância" },
        ],
    },
];

function initCustomSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'cs-wrapper';
    wrapper.dataset.csFor = selectId;

    // Display (trigger)
    const display = document.createElement('div');
    display.className = 'cs-display';
    display.setAttribute('tabindex', '0');
    display.setAttribute('role', 'combobox');
    display.setAttribute('aria-haspopup', 'listbox');
    display.setAttribute('aria-expanded', 'false');

    const placeholder = document.createElement('span');
    placeholder.className = 'cs-placeholder';
    placeholder.textContent = 'Selecione (Tabela RESOLUÇÃO COMGC/SPU/MGI Nº 3/2025)...';

    const arrow = document.createElement('span');
    arrow.className = 'cs-arrow';
    arrow.textContent = '▼';

    display.appendChild(placeholder);
    display.appendChild(arrow);

    // Dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'cs-dropdown';
    dropdown.setAttribute('role', 'listbox');

    // Popula grupos e opções (sem ícones)
    CAMPO511_DATA.forEach((group, groupIndex) => {
        const header = document.createElement('div');
        header.className = groupIndex === 0 ? 'cs-group-header first' : 'cs-group-header';
        header.textContent = group.group;
        dropdown.appendChild(header);

        group.options.forEach(opt => {
            const item = document.createElement('div');
            item.className = 'cs-option';
            item.setAttribute('role', 'option');
            item.setAttribute('data-value', opt.value);
            item.textContent = opt.label;

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                selectOption(item, opt.value, opt.label, wrapper, display, selectId);
            });

            dropdown.appendChild(item);
        });
    });

    wrapper.appendChild(display);
    wrapper.appendChild(dropdown);

    select.parentNode.insertBefore(wrapper, select.nextSibling);

    // Abrir/fechar ao clicar no display
    display.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(wrapper);
    });

    // Suporte a teclado
    display.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(wrapper);
        } else if (e.key === 'Escape') {
            closeDropdown(wrapper);
        }
    });

    // Fecha ao clicar fora
    document.addEventListener('click', () => closeDropdown(wrapper));

    // Validação visual
    select.addEventListener('invalid', () => wrapper.classList.add('invalid'));
    select.addEventListener('change', () => {
        if (select.value) wrapper.classList.remove('invalid');
    });
}

function toggleDropdown(wrapper) {
    if (wrapper.classList.contains('disabled')) return;
    const isOpen = wrapper.classList.contains('open');

    // Fecha todos os outros
    document.querySelectorAll('.cs-wrapper.open').forEach(w => {
        w.classList.remove('open');
        w.querySelector('.cs-display')?.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
        wrapper.classList.add('open');
        wrapper.querySelector('.cs-display').setAttribute('aria-expanded', 'true');
    }
}

function closeDropdown(wrapper) {
    wrapper.classList.remove('open');
    wrapper.querySelector('.cs-display')?.setAttribute('aria-expanded', 'false');
}

function selectOption(item, value, label, wrapper, display, selectId) {
    // Marca opção selecionada
    wrapper.querySelectorAll('.cs-option').forEach(o => o.classList.remove('selected'));
    item.classList.add('selected');

    // Atualiza texto do display
    const textEl = display.querySelector('.cs-placeholder, .cs-selected-text');
    textEl.className = 'cs-selected-text';
    textEl.textContent = label;

    // Sincroniza com o <select> nativo
    const select = document.getElementById(selectId);
    if (select) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    wrapper.classList.remove('invalid');
    closeDropdown(wrapper);

    // Exibe bloco de observações, se existir
    triggerObsBlock(value);
}

function triggerObsBlock(value) {
    const bloco = document.getElementById('bloco511_obs');
    if (bloco) bloco.style.display = value ? 'block' : 'none';
}

// Inicializa ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    initCustomSelect('campo511');
});
