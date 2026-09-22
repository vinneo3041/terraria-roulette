const canvas = document.getElementById('roleta');
    const ctx = canvas.getContext('2d');
    const girarBtn = document.getElementById('girarBtn');
    const atualizarBtn = document.getElementById('atualizarBtn');
    const itensTextarea = document.getElementById('itens');
    const resultadoEl = document.getElementById('resultado');
   
    const cores = ['#e94560', '#0f3460', '#f5a623', '#27ae60', '#8e44ad', '#00b8d9', '#ff6f61', '#3498db'];
   
    let itens = [];
    let anguloAtual = 0; // ângulo acumulado em graus
    let girando = false;
   
    function carregarItens() {
      itens = itensTextarea.value
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);
   
      if (itens.length < 2) {
        alert('Adicione pelo menos 2 itens.');
        return false;
      }
      return true;
    }
   
    function desenharRoleta() {
      const total = itens.length;
      const raio = canvas.width / 2;
      const anguloFatia = (2 * Math.PI) / total;
   
      ctx.clearRect(0, 0, canvas.width, canvas.height);
   
      for (let i = 0; i < total; i++) {
        const anguloInicio = i * anguloFatia;
        const anguloFim = anguloInicio + anguloFatia;
   
        // fatia
        ctx.beginPath();
        ctx.moveTo(raio, raio);
        ctx.arc(raio, raio, raio, anguloInicio, anguloFim);
        ctx.closePath();
        ctx.fillStyle = cores[i % cores.length];
        ctx.fill();
   
        // texto
        ctx.save();
        ctx.translate(raio, raio);
        ctx.rotate(anguloInicio + anguloFatia / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(itens[i], raio - 15, 6);
        ctx.restore();
      }
    }
   
    function girarRoleta() {
      if (girando) return;
      if (itens.length < 2) return;
   
      girando = true;
      girarBtn.disabled = true;
      resultadoEl.textContent = 'Girando...';
   
      const total = itens.length;
      const anguloFatia = 360 / total;
   
      // escolhe um índice vencedor aleatório
      const indiceVencedor = Math.floor(Math.random() * total);
   
      // volta completas aleatórias (5 a 8) + ajuste para o item cair no ponteiro (topo)
      const voltas = 5 + Math.floor(Math.random() * 4);
   
      // O ponteiro aponta para o topo (0°). Como desenhamos as fatias a partir do ângulo 0
      // (direita, sentido horário), precisamos calcular o deslocamento necessário.
      const anguloCentroFatia = indiceVencedor * anguloFatia + anguloFatia / 2;
      // Queremos que esse centro fique em -90° (topo) após a rotação.
      // pequena variação aleatória dentro da fatia para parecer mais natural
      const variacao = (Math.random() - 0.5) * (anguloFatia * 0.6);
   
      const anguloFinal = voltas * 360 + (360 - anguloCentroFatia - variacao) + 90;
   
      anguloAtual += anguloFinal;
   
      canvas.style.transform = `rotate(${anguloAtual}deg)`;
   
      setTimeout(() => {
        girando = false;
        girarBtn.disabled = false;
        resultadoEl.textContent = '🎉 ' + itens[indiceVencedor];
      }, 5100); // um pouco mais que a duração da transição CSS (5s)
    }
   
    atualizarBtn.addEventListener('click', () => {
      if (carregarItens()) {
        anguloAtual = anguloAtual % 360; // normaliza para evitar números gigantes
        canvas.style.transition = 'none';
        canvas.style.transform = `rotate(${anguloAtual}deg)`;
        desenharRoleta();
        resultadoEl.textContent = 'Clique em girar!';
        // reativa a transição no próximo frame
        requestAnimationFrame(() => {
          canvas.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        });
      }
    });
   
    girarBtn.addEventListener('click', girarRoleta);
   
    // inicialização
    canvas.style.transformOrigin = '50% 50%';
    if (carregarItens()) desenharRoleta();