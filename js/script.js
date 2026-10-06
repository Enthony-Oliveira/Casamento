// Aguarda o documento carregar completamente
document.addEventListener("DOMContentLoaded", function () {
  // Seleciona os elementos da página
  const modal = document.getElementById("pix-modal");
  const btnPix = document.getElementById("btn-pix-modal");
  const btnClose = document.querySelector(".close-modal");
  const btnCopy = document.getElementById("copy-pix-btn");
  const pixKeyElement = document.getElementById("pix-key");
  const copyMsg = document.getElementById("copy-msg");

  // Garante que todos os elementos existem antes de adicionar as funções
  if (modal && btnPix && btnClose && btnCopy && pixKeyElement) {
    const pixKey = pixKeyElement.innerText;

    // 1. Abre o modal ao clicar no botão flutuante
    btnPix.addEventListener("click", function () {
      modal.classList.add("active");
    });

    // 2. Fecha o modal ao clicar no 'X'
    btnClose.addEventListener("click", function () {
      modal.classList.remove("active");
      copyMsg.style.display = "none";
    });

    // 3. Fecha o modal ao clicar na área escura
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.classList.remove("active");
        copyMsg.style.display = "none";
      }
    });

    // 4. Copia a chave Pix ao clicar no botão
    btnCopy.addEventListener("click", function () {
      navigator.clipboard
        .writeText(pixKey)
        .then(() => {
          copyMsg.style.display = "block";

          setTimeout(() => {
            copyMsg.style.display = "none";
          }, 3000);
        })
        .catch((err) => {
          console.error("Falha ao copiar: ", err);
        });
    });
  }
});

// =========================================
// CONTAGEM REGRESSIVA
// =========================================

// Configura a data do casamento (23 de Janeiro de 2027 às 17:00)
const dataCasamento = new Date("Jan 23, 2027 17:00:00").getTime();

// Atualiza o contador a cada 1 segundo
const intervalo = setInterval(function () {
  const agora = new Date().getTime();
  const distancia = dataCasamento - agora;

  // Faz os cálculos de dias, horas, minutos e segundos
  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor(
    (distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

  // Seleciona as caixinhas de tempo no HTML
  const numericos = document.querySelectorAll(".box-numeric");

  // Atualiza os textos na tela (adicionando um '0' na frente se for menor que 10)
  if (numericos.length >= 4) {
    numericos[0].innerText = dias;
    numericos[1].innerText = horas < 10 ? "0" + horas : horas;
    numericos[2].innerText = minutos < 10 ? "0" + minutos : minutos;
    numericos[3].innerText = segundos < 10 ? "0" + segundos : segundos;
  }

  // Se o dia do casamento chegar, zera o cronômetro e para a contagem
  if (distancia < 0) {
    clearInterval(intervalo);
    if (numericos.length >= 4) {
      numericos[0].innerText = "00";
      numericos[1].innerText = "00";
      numericos[2].innerText = "00";
      numericos[3].innerText = "00";
    }
  }
}, 1000);
