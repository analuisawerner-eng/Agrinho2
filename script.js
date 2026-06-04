// ========== VARIÁVEIS GLOBAIS ==========
let dadosRebanho = {
    numAnimais: 0,
    estrutura: '',
    estado: '',
    cios: [],
    vacinas: [] // Array para armazenar as vacinas registradas
};

let tamanhoFonte = 16;
let leitorAtivo = null;

// ========== FUNÇÕES DE ACESSIBILIDADE ==========

function toggleAcessibilidade() {
    const menu = document.getElementById('menuAcessibilidade');
    menu.classList.toggle('ativo');
}

function aumentarFonte() {
    tamanhoFonte += 2;
    if (tamanhoFonte > 24) tamanhoFonte = 24;
    aplicarTamanhoFonte();
    salvarPreferencias();
}

function diminuirFonte() {
    tamanhoFonte -= 2;
    if (tamanhoFonte < 12) tamanhoFonte = 12;
    aplicarTamanhoFonte();
    salvarPreferencias();
}

function aplicarTamanhoFonte() {
    document.querySelectorAll('body, button, input, select, textarea, label, p, h1, h2, h3, h4, li, td, th').forEach(elemento => {
        elemento.style.fontSize = tamanhoFonte + 'px';
    });
    
    document.querySelectorAll('h1').forEach(el => {
        el.style.fontSize = (tamanhoFonte * 2) + 'px';
    });
    
    document.querySelectorAll('h2').forEach(el => {
        el.style.fontSize = (tamanhoFonte * 1.5) + 'px';
    });
    
    document.querySelectorAll('h3').forEach(el => {
        el.style.fontSize = (tamanhoFonte * 1.3) + 'px';
    });
}

function toggleContraste() {
    const body = document.body;
    const btnContraste = document.getElementById('btnContraste');
    
    body.classList.toggle('modo-escuro');
    
    if (body.classList.contains('modo-escuro')) {
        btnContraste.innerHTML = '☀️ Modo Claro';
        btnContraste.title = 'Modo Claro';
    } else {
        btnContraste.innerHTML = '🌓 Modo Escuro';
        btnContraste.title = 'Modo Escuro';
    }
    
    salvarPreferencias();
}

function iniciarLeitura() {
    pararLeitura();
    
    if ('speechSynthesis' in window) {
        const telaAtiva = document.querySelector('.tela.ativa');
        
        if (telaAtiva) {
            const textoParaLer = telaAtiva.innerText;
            const utterance = new SpeechSynthesisUtterance(textoParaLer);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            window.speechSynthesis.speak(utterance);
            leitorAtivo = utterance;
            
            alert('🔊 Leitura iniciada! Use o botão "Parar Leitura" para interromper.');
        }
    } else {
        alert('❌ Seu navegador não suporta leitura por voz. Tente usar o Google Chrome.');
    }
}

function pararLeitura() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        leitorAtivo = null;
        console.log('🔇 Leitura interrompida');
    }
}

function salvarPreferencias() {
    const preferencias = {
        tamanhoFonte: tamanhoFonte,
        modoEscuro: document.body.classList.contains('modo-escuro')
    };
    localStorage.setItem('preferenciasAcessibilidade', JSON.stringify(preferencias));
}

function carregarPreferencias() {
    const preferenciasSalvas = localStorage.getItem('preferenciasAcessibilidade');
    
    if (preferenciasSalvas) {
        const preferencias = JSON.parse(preferenciasSalvas);
        
        if (preferencias.tamanhoFonte) {
            tamanhoFonte = preferencias.tamanhoFonte;
            aplicarTamanhoFonte();
        }
        
        if (preferencias.modoEscuro) {
            document.body.classList.add('modo-escuro');
            const btnContraste = document.getElementById('btnContraste');
            btnContraste.innerHTML = '☀️ Modo Claro';
        }
    }
    
    // Carregar vacinas salvas
    const vacinasSalvas = localStorage.getItem('vacinasRebanho');
    if (vacinasSalvas) {
        dadosRebanho.vacinas = JSON.parse(vacinasSalvas);
    }
}

function salvarVacinas() {
    localStorage.setItem('vacinasRebanho', JSON.stringify(dadosRebanho.vacinas));
}

// ========== FUNÇÕES DE NAVEGAÇÃO ==========

function mostrarTela(id) {
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });
    document.getElementById(id).classList.add('ativa');
}

function selecionarProducao(tipo) {
    if (tipo === 'agro') {
        mostrarTela('telaAgro');
    } else if (tipo === 'leite') {
        mostrarTela('telaLeite');
    }
}

function voltarInicio() {
    mostrarTela('telaInicial');
}

// ========== GERENCIAMENTO AGRÍCOLA ==========

document.getElementById('formAgro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const localizacao = document.getElementById('localizacao').value;
    const tipoManejo = document.getElementById('tipoManejo').value;
    const implementos = document.getElementById('implementos').value;
    const plantacao = document.getElementById('plantacaoAtual').value;
    
    gerarRecomendacoesAgro(localizacao, tipoManejo, implementos, plantacao);
});

function gerarRecomendacoesAgro(localizacao, manejo, implementos, plantacao) {
    const resultadoDiv = document.getElementById('resultadoAgro');
    const recomendacoesDiv = document.getElementById('recomendacoesAgro');
    const descarteDiv = document.getElementById('descarteAgrotoxicos');
    
    resultadoDiv.style.display = 'block';
    
    let recomendacoes = `
        <h4>📌 Próximos Passos para Boa Colheita:</h4>
        <ul>
            <li>📍 Propriedade em: <strong>${localizacao}</strong></li>
            <li>🌿 Manejo: <strong>${manejo}</strong></li>
            <li>🌾 Culturas: <strong>${plantacao}</strong></li>
        </ul>
    `;
    
    if (manejo === 'convencional') {
        recomendacoes += `
            <h4>🔧 Manejo Convencional:</h4>
            <ul>
                <li>• Realizar análise de solo a cada 6 meses</li>
                <li>• Rotação de culturas: ${plantacao} → soja → milho</li>
                <li>• Controle integrado de pragas com monitoramento semanal</li>
                <li>• Calagem conforme necessidade do solo</li>
            </ul>
        `;
    } else if (manejo === 'organico') {
        recomendacoes += `
            <h4>🌱 Manejo Orgânico:</h4>
            <ul>
                <li>• Adubação verde com leguminosas</li>
                <li>• Controle biológico de pragas</li>
                <li>• Compostagem para fertilização</li>
                <li>• Cobertura morta para conservação de umidade</li>
            </ul>
        `;
    } else if (manejo === 'agroecologico') {
        recomendacoes += `
            <h4>🌍 Manejo Agroecológico:</h4>
            <ul>
                <li>• Diversificação de culturas</li>
                <li>• Sistemas agroflorestais</li>
                <li>• Conservação do solo com cobertura permanente</li>
                <li>• Controle natural de pragas com inimigos naturais</li>
            </ul>
        `;
    } else if (manejo === 'plantio_direto') {
        recomendacoes += `
            <h4>🚜 Plantio Direto:</h4>
            <ul>
                <li>• Manter palhada do cultivo anterior</li>
                <li>• Rotação de culturas planejada</li>
                <li>• Não revolver o solo</li>
                <li>• Monitoramento constante da umidade</li>
            </ul>
        `;
    }
    
    descarteDiv.innerHTML = `
        <h4>⚠️ DESCARTE CORRETO DE AGROTÓXICOS:</h4>
        <ul>
            <li>1️⃣ <strong>Tríplice Lavagem:</strong> Lave as embalagens 3 vezes</li>
            <li>2️⃣ <strong>Perfuração:</strong> Fure o fundo das embalagens</li>
            <li>3️⃣ <strong>Devolução:</strong> Entregue nos postos de coleta em até 1 ano</li>
            <li>4️⃣ <strong>Armazenamento:</strong> Mantenha em local coberto e ventilado</li>
            <li>5️⃣ <strong>EPIs:</strong> Use sempre equipamentos de proteção</li>
        </ul>
        <p><strong>📍 Posto de coleta mais próximo: </strong>Consulte a cooperativa local</p>
    `;
    
    recomendacoesDiv.innerHTML = recomendacoes;
}

// ========== GERENCIAMENTO PECUÁRIA LEITEIRA ==========

document.getElementById('formLeite').addEventListener('submit', function(e) {
    e.preventDefault();
    
    dadosRebanho.numAnimais = parseInt(document.getElementById('numAnimais').value);
    dadosRebanho.estrutura = document.getElementById('estrutura').value;
    dadosRebanho.estado = document.getElementById('estado').value;
    
    mostrarGerenciamentoRebanho();
});

function mostrarGerenciamentoRebanho() {
    const resultadoDiv = document.getElementById('resultadoLeite');
    resultadoDiv.style.display = 'block';
    
    document.getElementById('infoRebanho').innerHTML = `
        <p>🐮 <strong>Total de Animais:</strong> ${dadosRebanho.numAnimais}</p>
        <p>🏗️ <strong>Estrutura:</strong> ${dadosRebanho.estrutura}</p>
        <p>📍 <strong>Estado:</strong> ${dadosRebanho.estado}</p>
        <p>💉 <strong>Vacinas Registradas:</strong> ${dadosRebanho.vacinas.length}</p>
    `;
    
    mostrarHigieneEquipamentos();
}

// ========== PLANILHA DE VACINAS ==========

function abrirPlanilhaVacinas() {
    const secaoVacinas = document.getElementById('secaoVacinas');
    secaoVacinas.style.display = 'block';
    
    // Atualizar calendário de orientação
    atualizarCalendarioOrientacao();
    
    // Atualizar tabela
    atualizarTabelaVacinas();
    
    // Scroll até a planilha
    secaoVacinas.scrollIntoView({ behavior: 'smooth' });
}

function fecharPlanilhaVacinas() {
    const secaoVacinas = document.getElementById('secaoVacinas');
    secaoVacinas.style.display = 'none';
}

function atualizarCalendarioOrientacao() {
    const calendarioDiv = document.getElementById('calendarioOrientacao');
    
    const estadosLivresAftosa = ['PR', 'RS', 'SC', 'SP', 'MG', 'GO', 'MT', 'MS', 'DF', 'RO', 'AC', 'ES', 'BA', 'TO', 'RJ', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA', 'PA', 'AP', 'RR', 'AM'];
    const isZonaLivre = estadosLivresAftosa.includes(dadosRebanho.estado);
    
    let conteudo = `
        <h4>📅 Calendário de Orientação de Vacinas</h4>
        <div class="alerta-vacina">
            <strong>⚠️ AVISO IMPORTANTE:</strong>
            Consulte sempre um médico veterinário para validar o protocolo. 
            O calendário pode variar dependendo da sua região e do status sanitário da sua fazenda.
        </div>
        <table class="tabela-vacinas">
            <thead>
                <tr>
                    <th>Mês</th>
                    <th>Vacina</th>
                    <th>Categoria</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Janeiro</strong></td>
                    <td>Clostridioses</td>
                    <td>Todo o rebanho</td>
                </tr>
                <tr>
                    <td><strong>Março</strong></td>
                    <td>Reprodutivas (IBR/BVD/Lepto)</td>
                    <td>Vacas em lactação e novilhas</td>
                </tr>
    `;
    
    if (!isZonaLivre) {
        conteudo += `
                <tr>
                    <td><strong>Maio</strong></td>
                    <td>Febre Aftosa</td>
                    <td>Todo o rebanho</td>
                </tr>
        `;
    } else {
        conteudo += `
                <tr>
                    <td><strong>Maio</strong></td>
                    <td>✅ Zona Livre de Aftosa</td>
                    <td>Verificar legislação estadual</td>
                </tr>
        `;
    }
    
    conteudo += `
                <tr>
                    <td><strong>Julho</strong></td>
                    <td>Clostridioses</td>
                    <td>Todo o rebanho (reforço)</td>
                </tr>
                <tr>
                    <td><strong>Setembro</strong></td>
                    <td>Reprodutivas (IBR/BVD/Lepto)</td>
                    <td>Vacas em lactação e novilhas</td>
                </tr>
    `;
    
    if (!isZonaLivre) {
        conteudo += `
                <tr>
                    <td><strong>Novembro</strong></td>
                    <td>Febre Aftosa</td>
                    <td>Animais até 24 meses</td>
                </tr>
        `;
    }
    
    conteudo += `
                <tr>
                    <td><strong>Fluxo Contínuo</strong></td>
                    <td>Brucelose</td>
                    <td>Bezerras de 3 a 8 meses</td>
                </tr>
                <tr>
                    <td><strong>Anual</strong></td>
                    <td>Raiva</td>
                    <td>Todo rebanho acima de 3 meses</td>
                </tr>
            </tbody>
        </table>
    `;
    
    calendarioDiv.innerHTML = conteudo;
}

function adicionarVacina() {
    const brinco = document.getElementById('brincoAnimal').value.trim();
    const tipoVacina = document.getElementById('tipoVacina').value;
    const dataVacina = document.getElementById('dataVacina').value;
    const obsVacina = document.getElementById('obsVacina').value.trim();
    
    // Validações
    if (!brinco) {
        alert('❌ Por favor, insira o número do brinco do animal!');
        return;
    }
    
    if (!tipoVacina) {
        alert('❌ Por favor, selecione o tipo de vacina!');
        return;
    }
    
    if (!dataVacina) {
        alert('❌ Por favor, selecione a data da vacinação!');
        return;
    }
    
    // Criar objeto da vacina
    const novaVacina = {
        id: Date.now(), // ID único
        brinco: brinco,
        tipo: tipoVacina,
        data: dataVacina,
        observacao: obsVacina || 'Nenhuma',
        dataRegistro: new Date().toISOString()
    };
    
    // Adicionar ao array
    dadosRebanho.vacinas.push(novaVacina);
    
    // Salvar no localStorage
    salvarVacinas();
    
    // Limpar formulário
    document.getElementById('brincoAnimal').value = '';
    document.getElementById('tipoVacina').value = '';
    document.getElementById('dataVacina').value = '';
    document.getElementById('obsVacina').value = '';
    
    // Atualizar tabela
    atualizarTabelaVacinas();
    
    // Feedback
    alert('✅ Vacina registrada com sucesso!\n🐄 Animal: ' + brinco + '\n💉 Vacina: ' + tipoVacina + '\n📅 Data: ' + formatarData(dataVacina));
    
    // Atualizar contador na tela principal
    document.getElementById('infoRebanho').innerHTML = `
        <p>🐮 <strong>Total de Animais:</strong> ${dadosRebanho.numAnimais}</p>
        <p>🏗️ <strong>Estrutura:</strong> ${dadosRebanho.estrutura}</p>
        <p>📍 <strong>Estado:</strong> ${dadosRebanho.estado}</p>
        <p>💉 <strong>Vacinas Registradas:</strong> ${dadosRebanho.vacinas.length}</p>
    `;
}

function atualizarTabelaVacinas(filtro = '') {
    const corpoTabela = document.getElementById('corpoTabelaVacinas');
    
    // Filtrar vacinas se houver busca
    let vacinasFiltradas = dadosRebanho.vacinas;
    if (filtro) {
        vacinasFiltradas = dadosRebanho.vacinas.filter(v => 
            v.brinco.toLowerCase().includes(filtro.toLowerCase())
        );
    }
    
    // Ordenar por data (mais recente primeiro)
    vacinasFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    if (vacinasFiltradas.length === 0) {
        corpoTabela.innerHTML = `
            <tr>
                <td colspan="5" class="sem-registros">
                    📋 Nenhuma vacina registrada ainda
                </td>
            </tr>
        `;
        return;
    }
    
    let linhas = '';
    vacinasFiltradas.forEach(vacina => {
        linhas += `
            <tr>
                <td><strong>🔢 ${vacina.brinco}</strong></td>
                <td>💉 ${vacina.tipo}</td>
                <td>📅 ${formatarData(vacina.data)}</td>
                <td>📝 ${vacina.observacao}</td>
                <td>
                    <button onclick="excluirVacina(${vacina.id})" class="btn-excluir">
                        🗑️ Excluir
                    </button>
                </td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = linhas;
}

function excluirVacina(id) {
    if (confirm('Tem certeza que deseja excluir este registro de vacina?')) {
        dadosRebanho.vacinas = dadosRebanho.vacinas.filter(v => v.id !== id);
        salvarVacinas();
        atualizarTabelaVacinas();
        
        // Atualizar contador
        document.getElementById('infoRebanho').innerHTML = `
            <p>🐮 <strong>Total de Animais:</strong> ${dadosRebanho.numAnimais}</p>
            <p>🏗️ <strong>Estrutura:</strong> ${dadosRebanho.estrutura}</p>
            <p>📍 <strong>Estado:</strong> ${dadosRebanho.estado}</p>
            <p>💉 <strong>Vacinas Registradas:</strong> ${dadosRebanho.vacinas.length}</p>
        `;
    }
}

function filtrarVacinas() {
    const termoBusca = document.getElementById('buscaBrinco').value;
    atualizarTabelaVacinas(termoBusca);
}

function formatarData(dataString) {
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function mostrarHigieneEquipamentos() {
    const higieneDiv = document.getElementById('higieneEquipamentos');
    
    let instrucoesHigiene = '';
    
    if (dadosRebanho.estrutura === 'manual') {
        instrucoesHigiene = `
            <h4>🧹 HIGIENE DIÁRIA - ORDENHA MANUAL:</h4>
            <ul>
                <li>1. Lavar baldes com água quente e detergente neutro</li>
                <li>2. Escovar bem as superfícies</li>
                <li>3. Enxaguar com água limpa</li>
                <li>4. Secar ao sol</li>
            </ul>
            <h4>📅 HIGIENE MENSAL:</h4>
            <ul>
                <li>🧼 Lavagem profunda de todos os utensílios</li>
                <li>🔍 Inspeção de baldes e coadores</li>
                <li>📝 Registrar no controle de manutenção</li>
            </ul>
        `;
    } else {
        instrucoesHigiene = `
            <h4>🧹 HIGIENE DIÁRIA - ORDENHA MECÂNICA:</h4>
            <ul>
                <li>1. Circular solução de limpeza por 10 minutos</li>
                <li>2. Enxaguar com água limpa</li>
                <li>3. Desinfetar teteiras com solução de iodo</li>
                <li>4. Verificar borrachas e substituir se necessário</li>
            </ul>
            <h4>📅 HIGIENE MENSAL:</h4>
            <ul>
                <li>🔧 Desmontar todas as peças laváveis</li>
                <li>🧼 Limpeza profunda com detergente alcalino</li>
                <li>🔍 Inspeção de mangueiras e conexões</li>
                <li>📝 Registrar no controle de manutenção</li>
            </ul>
        `;
    }
    
    higieneDiv.innerHTML = instrucoesHigiene;
}

// ========== CONTROLE DE CIO ==========

function registrarCio() {
    const dataCio = document.getElementById('dataCio').value;
    
    if (!dataCio) {
        alert('Por favor, selecione a data do cio!');
        return;
    }
    
    dadosRebanho.cios.push({
        data: new Date(dataCio),
        status: 'cio_detectado'
    });
    
    atualizarCalendarioReprodutivo();
}

function atualizarCalendarioReprodutivo() {
    const calendarioDiv = document.getElementById('calendarioReprodutivo');
    
    if (dadosRebanho.cios.length === 0) return;
    
    const ultimoCio = dadosRebanho.cios[dadosRebanho.cios.length - 1].data;
    
    const inseminacao = new Date(ultimoCio);
    inseminacao.setHours(inseminacao.getHours() + 12);
    
    const repouso = new Date(inseminacao);
    repouso.setDate(repouso.getDate() + 45);
    
    const racaoPreParto = new Date(inseminacao);
    racaoPreParto.setDate(racaoPreParto.getDate() + 240);
    
    const dataParto = new Date(inseminacao);
    dataParto.setDate(dataParto.getDate() + 270);
    
    calendarioDiv.innerHTML = `
        <h4>📅 Calendário Reprodutivo:</h4>
        <div style="margin-top: 15px;">
            <p>🔵 <strong>Cio Detectado:</strong> ${ultimoCio.toLocaleDateString('pt-BR')}</p>
            <p>🟢 <strong>Momento Ideal para Inseminação:</strong> ${inseminacao.toLocaleDateString('pt-BR')} - ${inseminacao.toLocaleTimeString('pt-BR')}</p>
            <p>🟡 <strong>Período de Repouso até:</strong> ${repouso.toLocaleDateString('pt-BR')}</p>
            <p>🟠 <strong>Iniciar Ração Pré-Parto:</strong> ${racaoPreParto.toLocaleDateString('pt-BR')}</p>
            <p>🔴 <strong>Data Provável do Parto:</strong> ${dataParto.toLocaleDateString('pt-BR')}</p>
        </div>
    `;
}

// ========== NOTIFICAÇÕES ==========

function simularNotificacao(mensagem) {
    if (Notification.permission === "granted") {
        new Notification("AgroGestor", {
            body: mensagem,
            icon: "🌾"
        });
    }
}

if ("Notification" in window) {
    Notification.requestPermission();
}

// Verificar vacinas pendentes periodicamente
setInterval(() => {
    verificarVacinasPendentes();
}, 3600000);

function verificarVacinasPendentes() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1; // 1-12
    
    // Meses de vacinação: Janeiro(1), Março(3), Maio(5), Julho(7), Setembro(9), Novembro(11)
    const mesesVacina = [1, 3, 5, 7, 9, 11];
    
    if (mesesVacina.includes(mesAtual)) {
        const notificacoesDiv = document.getElementById('notificacoes');
        if (notificacoesDiv && notificacoesDiv.innerHTML === '') {
            notificacoesDiv.innerHTML = `
                <h4>🔔 LEMBRETE DE VACINAÇÃO!</h4>
                <p>Estamos no mês de vacinação! Verifique a planilha de vacinas.</p>
                <p>💉 Acesse a planilha para registrar as vacinas do seu rebanho.</p>
            `;
        }
    }
}

// ========== INICIALIZAÇÃO ==========

window.addEventListener('DOMContentLoaded', function() {
    carregarPreferencias();
    console.log('🚜 Sistema AgroGestor carregado com sucesso!');
    console.log('🌱 Preparado para o Agrinho 2026!');
    console.log('♿ Acessibilidade ativada!');
    console.log('💉 Planilha de vacinas pronta!');
    console.log('💾 Dados salvos automaticamente!');
});

document.addEventListener('click', function(e) {
    const menu = document.getElementById('menuAcessibilidade');
    const btnAcessibilidade = document.getElementById('btnAcessibilidade');
    
    if (!menu.contains(e.target) && e.target !== btnAcessibilidade) {
        menu.classList.remove('ativo');
    }
});