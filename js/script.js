(function () {
  "use strict";

  // =========================================
  // CONFIGURAÇÃO
  // =========================================
  // Horário de Brasília (-03:00) fixo: todo convidado vê a mesma contagem,
  // não importa o fuso do aparelho. Formato ISO funciona em todos os navegadores.
  // O convite diz 16:40h. Se a contagem deve ir até 17:00, troque aqui.
  const DATA_CASAMENTO = new Date("2027-01-23T16:40:00-03:00").getTime();

  // =========================================
  // CONTAGEM REGRESSIVA
  // =========================================
  const caixas = document.querySelectorAll(".box-numeric"); // buscado uma vez só
  const pad = (n) => String(n).padStart(2, "0");

  function atualizarContagem() {
    const distancia = DATA_CASAMENTO - Date.now();

    if (distancia <= 0) {
      caixas.forEach((el) => (el.textContent = "00"));
      return false; // fim: não precisa continuar rodando
    }

    const total = Math.floor(distancia / 1000);
    caixas[0].textContent = pad(Math.floor(total / 86400));
    caixas[1].textContent = pad(Math.floor((total % 86400) / 3600));
    caixas[2].textContent = pad(Math.floor((total % 3600) / 60));
    caixas[3].textContent = pad(total % 60);
    return true;
  }

  if (caixas.length >= 4 && atualizarContagem()) {
    // atualizarContagem() já rodou uma vez: o "00" não aparece por 1 segundo
    const intervalo = setInterval(function () {
      if (!atualizarContagem()) clearInterval(intervalo);
    }, 1000);
  }

  // =========================================
  // MODAL DO PIX
  // =========================================
  const modal = document.getElementById("pix-modal");
  const btnPix = document.getElementById("btn-pix-modal");
  const btnClose = modal && modal.querySelector(".close-modal");
  const btnCopy = document.getElementById("copy-pix-btn");
  const pixKeyElement = document.getElementById("pix-key");
  const copyMsg = document.getElementById("copy-msg");

  if (!(modal && btnPix && btnClose && btnCopy && pixKeyElement && copyMsg)) {
    return;
  }

  const pixKey = pixKeyElement.textContent.trim();
  let timerMensagem;

  function mostrarMensagem(texto, duracao) {
    clearTimeout(timerMensagem); // evita timers empilhados se clicar várias vezes
    copyMsg.textContent = texto; // o elemento sempre existe: leitores de tela anunciam
    timerMensagem = setTimeout(function () {
      copyMsg.textContent = "";
    }, duracao);
  }

  function abrirModal() {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // trava o scroll do fundo
    btnClose.focus();
  }

  function fecharModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    clearTimeout(timerMensagem);
    copyMsg.textContent = "";
    btnPix.focus(); // devolve o foco a quem abriu
  }

  btnPix.addEventListener("click", abrirModal);
  btnClose.addEventListener("click", fecharModal);

  // Clique na área escura (listener no próprio modal, não na janela inteira)
  modal.addEventListener("click", function (e) {
    if (e.target === modal) fecharModal();
  });

  // Esc fecha; Tab fica preso dentro do modal enquanto ele está aberto
  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("active")) return;

    if (e.key === "Escape") {
      fecharModal();
      return;
    }

    if (e.key === "Tab") {
      const itens = modal.querySelectorAll("button");
      const primeiro = itens[0];
      const ultimo = itens[itens.length - 1];

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }
  });

  // =========================================
  // COPIAR CHAVE PIX
  // =========================================
  async function copiarTexto(texto) {
    // 1º: API moderna (exige HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(texto);
        return true;
      } catch (_) {
        /* segue para o plano B */
      }
    }

    // Plano B: navegadores antigos e navegadores embutidos de apps
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.select();
    campo.setSelectionRange(0, texto.length); // necessário no iOS

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(campo);
    return ok;
  }

  btnCopy.addEventListener("click", async function () {
    const copiou = await copiarTexto(pixKey);
    btnCopy.focus(); // o plano B tira o foco do botão

    if (copiou) {
      mostrarMensagem("Chave copiada com sucesso!", 3000);
    } else {
      mostrarMensagem(
        "Não foi possível copiar. Toque na chave acima e copie manualmente.",
        6000,
      );
    }
  });
})();
