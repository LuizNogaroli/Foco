document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form04");

  if (!form) {
    return;
  }

  const situacaoRadios = document.querySelectorAll('input[name="imoveis[0][situacao_ocupacional]"]');

  const blocoDesocupado = document.getElementById("bloco-desocupado_0");
  const blocoOcupado = document.getElementById("bloco-ocupado_0");
  const blocoUsoAtual = document.getElementById("bloco-uso-atual_0");

  const tempoDesocupacao = document.getElementById("campo-tempo-desocupacao_0");
  const obsDesocupado = document.getElementById("obs-desocupado_0");
  const dataConhecimentoOcupacao = document.getElementById("campo-data-conhecimento-ocupacao_0");
  const obsOcupado = document.getElementById("obs-ocupado_0");
  const usoImobiliario = document.getElementById("campo32_0");
  const usoEspecifico = document.getElementById("campo33_0");

  const usoEspecificoMap = {
    "0101": ["01.01.01 Sede/Escritório Federal", "01.01.02 Sede Estadual/Municipal", "01.01.99 Outros"],
    "0102": ["01.02.01 Agricultura", "01.02.02 Pecuária", "01.02.05 Pesca"],
    "0103": ["01.03.01 Unidade de Conservação", "01.03.02 APP", "01.03.04 Recuperação Ambiental"],
    "0104": ["01.04.01 Museu/Teatro", "01.04.02 Estádio/Ginásio", "01.04.03 Lazer Público"],
    "0106": ["01.06.01 Habitação Interesse Social", "01.06.02 Mercado Popular"],
    "0111": ["01.11.01 Terra Indígena", "01.11.02 Quilombola", "01.11.04 Ribeirinha"]
  };

  if (usoImobiliario) {
    usoImobiliario.addEventListener('change', () => {
        const val = usoImobiliario.value;
        if (!usoEspecifico) return;
        usoEspecifico.innerHTML = '';
        if (usoEspecificoMap[val]) {
            usoEspecifico.disabled = false;
            usoEspecifico.innerHTML = '<option value="">Selecione o uso específico atual...</option>';
            usoEspecificoMap[val].forEach(opt => {
                const el = document.createElement('option'); el.value = opt; el.textContent = opt; usoEspecifico.appendChild(el);
            });
        } else {
            usoEspecifico.disabled = true;
            usoEspecifico.innerHTML = '<option value="">Selecione primeiro o uso imobiliário atual...</option>';
        }
    });
  }

  const blocoObsAmbiental = document.getElementById("bloco-obs35_0");
  const obsAmbiental = document.getElementById("obs35_0");

  const custosRadios = document.querySelectorAll('input[name="imoveis[0][custos_manutencao]"]');
  const blocoCustos = document.getElementById("bloco-obs37_0");
  const campoCustos = document.getElementById("campo37_0");

  const blocoObsRiscos = document.getElementById("bloco-obs-riscos_0");
  const obsRiscos = document.getElementById("obs-riscos_0");

  const blocoObsRestricoes = document.getElementById("bloco-obs-restricoes_0");
  const obsRestricoes = document.getElementById("obs-restricoes_0");

  const disputaRadios = document.querySelectorAll('input[name="imoveis[0][imovel_em_disputa]"]');
  const blocoDisputa = document.getElementById("bloco-obs-disputa_0");
  const obsDisputa = document.getElementById("obs-disputa_0");

  function atualizarDisputa() {
    const selecionado = document.querySelector('input[name="imoveis[0][imovel_em_disputa]"]:checked');
    const valor = selecionado ? selecionado.value : "";

    if (valor === "Sim") {
      if (blocoDisputa) blocoDisputa.style.display = "flex";
    } else {
      if (blocoDisputa) blocoDisputa.style.display = "none";
      if (obsDisputa) obsDisputa.value = "";
    }
  }

  disputaRadios.forEach(function (radio) {
    radio.addEventListener("change", atualizarDisputa);
  });

  function limparCampos(container) {
    if (!container) {
      return;
    }

    const campos = container.querySelectorAll("input, select, textarea");

    campos.forEach(function (campo) {
      if (campo.type === "checkbox" || campo.type === "radio") {
        campo.checked = false;
      } else {
        campo.value = "";
      }

      campo.required = false;
    });
  }

  function existeCampoMarcado(campos) {
    return Array.from(campos).some(function (campo) {
      return campo.checked;
    });
  }

  function atualizarSituaçãoOcupacional() {
    const selecionado = document.querySelector('input[name="imoveis[0][situacao_ocupacional]"]:checked');
    const valor = selecionado ? selecionado.value : "";

    if (valor === "Desocupado") {
      if (blocoDesocupado) {
        blocoDesocupado.style.display = "flex";
      }

      if (blocoOcupado) {
        blocoOcupado.style.display = "none";
      }

      if (blocoUsoAtual) {
        blocoUsoAtual.style.display = "none";
      }

      limparCampos(blocoOcupado);
      limparCampos(blocoUsoAtual);

      if (tempoDesocupacao) {
        tempoDesocupacao.required = false;
      }

      if (obsDesocupado) {
        obsDesocupado.required = false;
      }

      return;
    }

    if (valor === "Ocupado regularmente" || valor === "Ocupado irregularmente") {
      if (blocoDesocupado) {
        blocoDesocupado.style.display = "none";
      }

      if (blocoOcupado) {
        blocoOcupado.style.display = "flex";
      }

      if (blocoUsoAtual) {
        blocoUsoAtual.style.display = "flex";
      }

      limparCampos(blocoDesocupado);

      if (dataConhecimentoOcupacao) {
        dataConhecimentoOcupacao.required = false;
      }

      if (obsOcupado) {
        obsOcupado.required = false;
      }

      if (usoImobiliario) {
        usoImobiliario.required = false;
      }

      if (usoEspecifico) {
        usoEspecifico.required = false;
      }

      return;
    }

    if (blocoDesocupado) {
      blocoDesocupado.style.display = "none";
    }

    if (blocoOcupado) {
      blocoOcupado.style.display = "none";
    }

    if (blocoUsoAtual) {
      blocoUsoAtual.style.display = "none";
    }

    limparCampos(blocoDesocupado);
    limparCampos(blocoOcupado);
    limparCampos(blocoUsoAtual);
  }

  function atualizarIncidenciaAmbiental() {
    const incidenciaCheckboxes = document.querySelectorAll(
      'input[name="imoveis[0][incidencia_ambiental][]"]'
    );

    const algumaOpcaoMarcada = existeCampoMarcado(incidenciaCheckboxes);

    if (algumaOpcaoMarcada) {
      if (blocoObsAmbiental) {
        blocoObsAmbiental.style.display = "flex";
      }
    } else {
      if (blocoObsAmbiental) {
        blocoObsAmbiental.style.display = "none";
      }

      if (obsAmbiental) {
        obsAmbiental.value = "";
      }
    }

    if (obsAmbiental) {
      obsAmbiental.required = false;
    }
  }

  function atualizarCustos() {
    const selecionado = document.querySelector('input[name="imoveis[0][custos_manutencao]"]:checked');
    const valor = selecionado ? selecionado.value : "";

    if (valor === "Sim") {
      if (blocoCustos) {
        blocoCustos.style.display = "flex";
      }
    } else {
      if (blocoCustos) {
        blocoCustos.style.display = "none";
      }

      if (campoCustos) {
        campoCustos.value = "";
      }
    }
  }

  function atualizarRiscos() {
    const riscosCheckboxes = document.querySelectorAll(
      'input[name="imoveis[0][riscos][]"]'
    );

    const algumRiscoMarcado = existeCampoMarcado(riscosCheckboxes);

    if (algumRiscoMarcado) {
      if (blocoObsRiscos) {
        blocoObsRiscos.style.display = "flex";
      }
    } else {
      if (blocoObsRiscos) {
        blocoObsRiscos.style.display = "none";
      }

      if (obsRiscos) {
        obsRiscos.value = "";
      }
    }

    if (obsRiscos) {
      obsRiscos.required = false;
    }
  }

  function atualizarRestricoes() {
    const restricoesCheckboxes = document.querySelectorAll(
      'input[name="imoveis[0][restricoes][]"]'
    );

    const algumaRestricaoMarcada = existeCampoMarcado(restricoesCheckboxes);

    if (algumaRestricaoMarcada) {
      if (blocoObsRestricoes) {
        blocoObsRestricoes.style.display = "flex";
      }
    } else {
      if (blocoObsRestricoes) {
        blocoObsRestricoes.style.display = "none";
      }

      if (obsRestricoes) {
        obsRestricoes.value = "";
      }
    }

    if (obsRestricoes) {
      obsRestricoes.required = false;
    }
  }

  situacaoRadios.forEach(function (radio) {
    radio.addEventListener("change", atualizarSituaçãoOcupacional);
  });

  custosRadios.forEach(function (radio) {
    radio.addEventListener("change", atualizarCustos);
  });

  document.addEventListener("change", function (event) {
    if (event.target.matches('input[name="imoveis[0][incidencia_ambiental][]"]')) {
      atualizarIncidenciaAmbiental();
    }

    if (event.target.matches('input[name="imoveis[0][riscos][]"]')) {
      atualizarRiscos();
    }

    if (event.target.matches('input[name="imoveis[0][restricoes][]"]')) {
      atualizarRestricoes();
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio real para demonstração
    atualizarSituaçãoOcupacional();
    atualizarIncidenciaAmbiental();
    atualizarCustos();
    atualizarRiscos();
    atualizarRestricoes();

    if (form.checkValidity()) {
      const rootWindow = window.parent?.parent || window.parent || window;
                  // O motor sync.js cuidará do salvamento na tabela intermediária (foco_drafts)
            alert('=é Aba validada e salva na tabela intermediária com sucesso! Avançando para a próxima etapa...');
            const btnTabNext = rootWindow.document?.querySelector('button[data-url="foco-05.html"]');
            if (btnTabNext) {
                setTimeout(() => btnTabNext.click(), 100);
            }
    } else {
      form.reportValidity();
    }
  });

  atualizarSituaçãoOcupacional();
  atualizarIncidenciaAmbiental();
  atualizarCustos();
  atualizarRiscos();
  atualizarRestricoes();

  // Botão Limpar Global
  const btnLimpar = document.getElementById('btnLimpar');
  if (btnLimpar) {
      btnLimpar.addEventListener('click', () => {
          if (confirm('Limpar todos os campos?')) {
              location.reload();
          }
      });
  }
});
