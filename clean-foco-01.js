const fs = require('fs');

if (fs.existsSync('foco-01.js')) {
    let content = fs.readFileSync('foco-01.js', 'utf8');
    
    // We want to restore the end of loadRipsEConceituacao and the verifying function.
    // Let's find the closing of minFields.forEach
    const startIdx = content.indexOf("const minFields = ['cep_sem_rip'");
    if (startIdx !== -1) {
        let goodContent = content.substring(0, startIdx);
        
        let newEnding = `        const minFields = ['cep_sem_rip', 'logradouro_sem_rip', 'bairro_sem_rip', 'municipio_sem_rip', 'uf_sem_rip', 'numero_sem_rip', 'complemento_sem_rip', 'area_sem_rip'];
        minFields.forEach(id => {
            if (dbState[id] && dbState[id] !== '') {
                const el = document.getElementById(id);
                if (el) {
                    el.readOnly = true;
                    el.classList.add('auto-loaded-field');
                }
            }
        });
    }

    // Tenta rodar logo após 400ms se o banco foi rápido, ou aguarda o Trigger Oficial
    setTimeout(() => {
        if (window.parent && window.parent.formDataState && Object.keys(window.parent.formDataState).length > 0) {
            loadRipsEConceituacao(window.parent.formDataState);
        }
    }, 400);

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'DATABASE_LOADED') {
            loadRipsEConceituacao(event.data.data);
        }
    });

});

// ================================================================
// LÓGICA DE CONCEITUAÇÃO E RIP
// ================================================================
window.verificarConceituacao = function() {
    const checkboxes = document.querySelectorAll('input[name="conceituacao[]"]:checked');
    const conceituacoes = Array.from(checkboxes).map(cb => cb.value);

    const dispensaRIP = conceituacoes.some(val => 
        val === 'espelho d’água' || 
        val === 'cavidades naturais' || 
        val === 'mangue' || 
        val === 'praia'
    );

    const secaoMinimo = document.getElementById('secaoCadastroMinimo');

    if (dispensaRIP) {
        secaoMinimo.style.display = 'block';
    } else {
        secaoMinimo.style.display = 'none';
    }
};

// A pesquisa manual de RIPs foi removida por regra de negócio.
// Os RIPs são carregados automaticamente via integração.
`;
        fs.writeFileSync('foco-01.js', goodContent + newEnding, 'utf8');
        console.log('foco-01.js fixado com sucesso!');
    }
}
