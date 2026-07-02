function loadRipsEConceituacao(dbState) {
        if (!dbState) return;
        
        let ripsArray = [];
        
        // Verifica a regra de neg├│cio para saber se RIP ├뿯½ obrigat├│rio
        let isRipObrigatorio = true;
        if (dbState['conceituacao[]']) {
            const concs = Array.isArray(dbState['conceituacao[]']) ? dbState['conceituacao[]'] : [dbState['conceituacao[]']];
            if (concs.length > 0 && concs.every(c => c === 'praia_mar' || c === 'praia_rio' || c === 'manguezal')) {
                isRipObrigatorio = false;
            }
        }
        
        // 1. Tenta recuperar da lista oculta (novo formato)
        if ('lista_rips' in dbState) {
            const lr = dbState.lista_rips;
            if (lr && lr.trim() !== '') {
                ripsArray = lr.split(',').map(r => r.trim()).filter(r => r);
            } else {
                // Se a lista estiver vazia, s├│ respeita se a regra de neg├│cio permitir (ex: Praia/Mangue).
                // Caso contr├뿯½rio (RIP obrigat├│rio), significa que o banco foi salvo vazio por engano (bug anterior)
                // e devemos ignorar a lista vazia para for├뿯½ar o fallback para os dados mock/legado.
                if (!isRipObrigatorio) {
                    ripsArray = [];
                } else {
                    // For├뿯½a fallback
                    if (dbState._ripsPesquisados) {
                        ripsArray = Object.keys(dbState._ripsPesquisados);
                    } else {
                        Object.keys(dbState).forEach(key => {
                            if (key.match(/^imoveis\[\d+\]\[rip\]$/)) {
                                const ripVal = dbState[key];
                                if (ripVal && !ripsArray.includes(ripVal)) {
                                    ripsArray.push(ripVal);
                                }
                            }
                        });
