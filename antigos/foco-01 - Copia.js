// foco-01.js
// Exclusivo da Seção 1: Dados do Requerimento (foco-01.html)
// Depende de: formulario.js (mascaraCPFCNPJ, mascaraSEI)

document.addEventListener('DOMContentLoaded', function () {

    if (!document.getElementById('form01')) return;

    const form01 = document.getElementById('form01');

    // ══════════════════════════════════════════════════════════════════════════
    // 1. MÁSCARAS
    // ══════════════════════════════════════════════════════════════════════════

    mascaraCPFCNPJ(document.getElementById('campo14'));
    mascaraSEI(document.getElementById('campo13'));

    // Máscara de telefone — local, exclusiva do foco-01
    (function mascaraTelefone(input) {
        if (!input) return;
        input.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '').slice(0, 11);
            if (v.length <= 10) {
                v = v.replace(/(\d{2})(\d)/,       '($1) $2');
                v = v.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
            } else {
                v = v.replace(/(\d{2})(\d)/,       '($1) $2');
                v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
            }
            this.value = v;
        });
    })(document.getElementById('campo19'));

    // ══════════════════════════════════════════════════════════════════════════
    // 2. DATA MÁXIMA = HOJE
    // ══════════════════════════════════════════════════════════════════════════

    document.getElementById('campo12').setAttribute(
        'max', new Date().toISOString().split('T')[0]
    );

    // ══════════════════════════════════════════════════════════════════════════
    // 3. VALIDAÇÃO NO SUBMIT
    // ══════════════════════════════════════════════════════════════════════════

    const validacoes01 = [
        { id: 'campo11', erro: 'err11', check: v => v.trim() !== '' },
        { id: 'campo12', erro: 'err12', check: v => v !== '' },
        { id: 'campo13', erro: 'err13', check: v => v.trim() !== '' },
        { id: 'campo14', erro: 'err14', check: v => [11, 14].includes(v.replace(/\D/g, '').length) },
        { id: 'campo15', erro: 'err15', check: v => v.trim().length >= 3 },
        { id: 'campo16', erro: 'err16', check: v => v.trim() !== '' },
        {
            // Telefone: (00) 0000-0000 = 10 dígitos  ou  (00) 00000-0000 = 11 dígitos
            id:    'campo19',
            erro:  'err19',
            check: v => [10, 11].includes(v.replace(/\D/g, '').length)
        },
    ];

    form01.addEventListener('submit', function (e) {
        e.preventDefault();
        let valido = true;

        validacoes01.forEach(function (reg) {
            const campo = document.getElementById(reg.id);
            const erro  = document.getElementById(reg.erro);
            const ok    = reg.check(campo.value);
            erro.style.display      = ok ? 'none'    : 'block';
            campo.style.borderColor = ok ? '#28a745' : '#dc3545';
            if (!ok) valido = false;
        });

        // Radio campo17 — Pessoa estrangeira
        const radioSelecionado17 = document.querySelector('input[name="campo17"]:checked');
        const err17              = document.getElementById('err17');
        err17.style.display      = radioSelecionado17 ? 'none' : 'block';
        if (!radioSelecionado17) valido = false;

        // Radio campo110 — Prioridade Legal
        const radioSelecionado110 = document.querySelector('input[name="campo110"]:checked');
        const err110              = document.getElementById('err110');
        err110.style.display      = radioSelecionado110 ? 'none' : 'block';
        if (!radioSelecionado110) valido = false;

        if (valido) alert('✅ Seção 1 enviada com sucesso!');
    });

    // ══════════════════════════════════════════════════════════════════════════
    // 4. BOTÃO LIMPAR
    // ══════════════════════════════════════════════════════════════════════════

    document.getElementById('btnLimpar').addEventListener('click', function () {
        if (!confirm('Deseja limpar todos os campos?')) return;

        form01.reset();

        document.querySelectorAll('#form01 .error-msg').forEach(function (e) {
            e.style.display = 'none';
        });
        document.querySelectorAll('#form01 input, #form01 select, #form01 textarea').forEach(function (el) {
            el.style.borderColor = '';
        });
    });

}); // fim DOMContentLoaded
