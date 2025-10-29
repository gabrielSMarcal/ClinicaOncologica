import { getDados, postDados, putDados, deleteDados } from './api.js';

let medicoEmEdicao = null;
let medicoParaDeletar = null;
let pacientesParaRealocar = [];
let medicoParaInativar = null; // Adicionar esta variável

// Carregar médicos ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarMedicos();
    
    const form = document.getElementById('medico-form');
    if (form) {
        form.addEventListener('submit', salvarMedico);
    }
});

// Listar todos os médicos
async function carregarMedicos() {
    try {
        const medicos = await getDados('/medicos');
        await renderizarTabelaMedicos(medicos);
    } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        alert('Erro ao carregar médicos: ' + error.message);
    }
}

// Renderizar tabela de médicos
async function renderizarTabelaMedicos(medicos) {
    const tbody = document.getElementById('medicos-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    for (const medico of medicos) {
        let qtdPacientes = 0;
        try {
            qtdPacientes = await getDados(`/medicos/${medico.id}/pacientes/count`);
        } catch (error) {
            console.error(`Erro ao contar pacientes do médico ${medico.id}:`, error);
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${medico.id}</td>
            <td>${medico.nome}</td>
            <td>${medico.crm}</td>
            <td><span class="status ${medico.ativo ? 'ativo' : 'inativo'}">${medico.ativo ? 'Ativo' : 'Inativo'}</span></td>
            <td>${qtdPacientes}</td>
            <td>
                <button class="btn-edit" onclick="window.editarMedico(${medico.id})">Editar</button>
                <button class="btn-delete" onclick="window.deletarMedico(${medico.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

// Salvar médico (criar ou atualizar)
async function salvarMedico(event) {
    event.preventDefault();
    
    const id = document.getElementById('medico-id').value;
    const novoStatus = document.getElementById('ativo').value === 'true';
    
    const medico = {
        nome: document.getElementById('nome').value,
        crm: document.getElementById('crm').value,
        ativo: id ? novoStatus : true
    };
    
    try {
        // Se for EDIÇÃO e o status mudou para INATIVO
        if (id && medicoEmEdicao && medicoEmEdicao.ativo && !novoStatus) {
            // Verificar se o médico tem pacientes
            const qtdPacientes = await getDados(`/medicos/${id}/pacientes/count`);
            
            if (qtdPacientes > 0) {
                // Salvar dados do médico para usar depois da realocação
                medicoParaInativar = {
                    id: parseInt(id),
                    nome: medico.nome,
                    crm: medico.crm,
                    ativo: false
                };
                
                // Se tem pacientes, abrir modal de realocação
                mostrarNotificacao('Atenção', 'Este médico possui pacientes vinculados. Você precisa realocar ou excluir todos os pacientes antes de inativá-lo.');
                await abrirModalRealocacao(parseInt(id), true); // true indica que é inativação
                return; // Não continua o salvamento
            }
        }
        
        if (id) {
            await putDados(`/medicos/${id}`, medico);
            mostrarNotificacao('Sucesso', 'Médico atualizado com sucesso!');
        } else {
            await postDados('/medicos', medico);
            mostrarNotificacao('Sucesso', 'Médico cadastrado com sucesso!');
        }
        
        cancelarEdicao();
        carregarMedicos();
    } catch (error) {
        console.error('Erro ao salvar médico:', error);
        alert('Erro ao salvar médico: ' + error.message);
    }
}

// Editar médico
async function editarMedico(id) {
    try {
        const medico = await getDados(`/medicos/${id}`);
        
        document.getElementById('medico-id').value = medico.id;
        document.getElementById('nome').value = medico.nome;
        document.getElementById('crm').value = medico.crm;
        document.getElementById('ativo').value = medico.ativo.toString();
        
        document.getElementById('status-group').style.display = 'block';
        document.getElementById('form-title').textContent = 'Editar Médico';
        
        medicoEmEdicao = medico;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao carregar médico:', error);
        alert('Erro ao carregar médico: ' + error.message);
    }
}

// Cancelar edição
function cancelarEdicao() {
    document.getElementById('medico-form').reset();
    document.getElementById('medico-id').value = '';
    document.getElementById('status-group').style.display = 'none';
    document.getElementById('form-title').textContent = 'Cadastrar Novo Médico';
    medicoEmEdicao = null;
}

// Deletar médico
async function deletarMedico(id) {
    try {
        // Verificar se o médico tem pacientes
        const qtdPacientes = await getDados(`/medicos/${id}/pacientes/count`);
        
        if (qtdPacientes > 0) {
            // Se tem pacientes, abrir modal de realocação
            await abrirModalRealocacao(id);
        } else {
            // Se não tem pacientes, deletar diretamente usando modal de confirmação
            const confirmado = await confirmarComModal('Tem certeza que deseja deletar este médico?');
            if (confirmado) {
                await deleteDados(`/medicos/${id}`);
                mostrarNotificacao('Sucesso', 'Médico deletado com sucesso');
                carregarMedicos();
            }
        }
    } catch (error) {
        console.error('Erro ao deletar médico:', error);
        alert('Erro ao deletar médico: ' + error.message);
    }
}

// Abrir modal de realocação
async function abrirModalRealocacao(medicoId, isInativacao = false) {
    try {
        medicoParaDeletar = medicoId;
        
        // Buscar pacientes do médico
        const pacientes = await getDados(`/medicos/${medicoId}/pacientes`);
        pacientesParaRealocar = pacientes;
        
        // Buscar todos os médicos (exceto o atual)
        const todosMedicos = await getDados('/medicos');
        const outrosMedicos = todosMedicos.filter(m => m.id !== medicoId && m.ativo);
        
        // Renderizar lista de pacientes no modal
        const container = document.getElementById('pacientes-realocacao');
        
        // Alterar mensagem do modal dependendo se é inativação ou exclusão
        const modalWarning = document.querySelector('.modal-warning');
        if (modalWarning) {
            if (isInativacao) {
                modalWarning.textContent = 'Este médico possui pacientes vinculados. Você precisa realocar ou excluir todos os pacientes antes de inativá-lo.';
            } else {
                modalWarning.textContent = 'Este médico possui pacientes vinculados. Você precisa realocar ou excluir todos os pacientes antes de deletar o médico.';
            }
        }
        
        container.innerHTML = '<h3>Pacientes Vinculados:</h3>';
        
        pacientes.forEach(paciente => {
            const div = document.createElement('div');
            div.className = 'paciente-realocacao';
            div.innerHTML = `
                <div class="paciente-info">
                    <strong>${paciente.nome}</strong> Tipo de Câncer: ${paciente.tipoCancer}
                </div>
                <div class="paciente-actions">
                    <select class="select-medico" data-paciente-id="${paciente.id}">
                        <option value="">Selecione um médico</option>
                        ${outrosMedicos.map(m => `<option value="${m.id}">${m.nome} (${m.crm})</option>`).join('')}
                    </select>
                    <button class="btn-danger-small" onclick="window.excluirPaciente(${paciente.id}, ${isInativacao})">Excluir Paciente</button>
                </div>
            `;
            container.appendChild(div);
        });
        
        // Alterar texto do botão principal
        const btnConfirmar = document.querySelector('#modal-realocacao .btn-danger');
        if (btnConfirmar) {
            if (isInativacao) {
                btnConfirmar.textContent = 'Confirmar Inativação do Médico';
                btnConfirmar.onclick = () => window.confirmarInativacaoMedico();
            } else {
                btnConfirmar.textContent = 'Confirmar Exclusão do Médico';
                btnConfirmar.onclick = () => window.confirmarDelecaoMedico();
            }
        }
        
        // Mostrar modal
        document.getElementById('modal-realocacao').style.display = 'block';
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        alert('Erro ao carregar pacientes: ' + error.message);
    }
}

// Fechar modal
function fecharModal() {
    document.getElementById('modal-realocacao').style.display = 'none';
    medicoParaDeletar = null;
    medicoParaInativar = null; // Limpar também esta variável
    pacientesParaRealocar = [];
}

// Excluir paciente
async function excluirPaciente(pacienteId, isInativacao = false) {
    const confirmado = await confirmarComModal('Tem certeza que deseja excluir este paciente?');
    if (!confirmado) {
        return;
    }

    try {
        await deleteDados(`/pacientes/${pacienteId}`);
        mostrarNotificacao('Sucesso', 'Paciente excluído com sucesso!');

        // Atualizar lista de pacientes
        pacientesParaRealocar = pacientesParaRealocar.filter(p => p.id !== pacienteId);

        if (pacientesParaRealocar.length === 0) {
            if (isInativacao) {
                await inativarMedicoFinal();
            } else {
                await deletarMedicoFinal();
            }
        } else {
            // Recarregar modal
            await abrirModalRealocacao(medicoParaDeletar, isInativacao);
        }
    } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        alert('Erro ao excluir paciente: ' + error.message);
    }
}

// Confirmar exclusão do médico (após realocar/excluir pacientes)
async function confirmarDelecaoMedico() {
    try {
        // Buscar todos os selects de realocação
        const selects = document.querySelectorAll('.select-medico');
        const realocacoes = [];
        
        // Verificar se todos os pacientes foram realocados ou excluídos
        for (const select of selects) {
            const pacienteId = select.getAttribute('data-paciente-id');
            const novoMedicoId = select.value;
            
            if (!novoMedicoId) {
                alert('Por favor, selecione um médico para todos os pacientes ou exclua-os.');
                return;
            }
            
            realocacoes.push({ pacienteId, novoMedicoId });
        }
        
        // Realizar todas as realocações
        for (const { pacienteId, novoMedicoId } of realocacoes) {
            await putDados(`/pacientes/${pacienteId}/medico/${novoMedicoId}`, {});
        }
        
        mostrarNotificacao('Sucesso', 'Pacientes realocados com sucesso!');
        
        // Deletar o médico
        await deletarMedicoFinal();
        
    } catch (error) {
        console.error('Erro ao realocar pacientes:', error);
        alert('Erro ao realocar pacientes: ' + error.message);
    }
}

// Deletar médico (função final)
async function deletarMedicoFinal() {
    try {
        await deleteDados(`/medicos/${medicoParaDeletar}`);
        mostrarNotificacao('Sucesso', 'Médico deletado com sucesso');
        fecharModal();
        carregarMedicos();
    } catch (error) {
        console.error('Erro ao deletar médico:', error);
        alert('Erro ao deletar médico: ' + error.message);
    }
}

// Confirmar inativação do médico (após realocar/excluir pacientes)
async function confirmarInativacaoMedico() {
    try {
        // Buscar todos os selects de realocação
        const selects = document.querySelectorAll('.select-medico');
        const realocacoes = [];
        
        // Verificar se todos os pacientes foram realocados ou excluídos
        for (const select of selects) {
            const pacienteId = select.getAttribute('data-paciente-id');
            const novoMedicoId = select.value;
            
            if (!novoMedicoId) {
                alert('Por favor, selecione um médico para todos os pacientes ou exclua-os.');
                return;
            }
            
            realocacoes.push({ pacienteId, novoMedicoId });
        }
        
        // Realizar todas as realocações
        for (const { pacienteId, novoMedicoId } of realocacoes) {
            await putDados(`/pacientes/${pacienteId}/medico/${novoMedicoId}`, {});
        }
        
        mostrarNotificacao('Sucesso', 'Pacientes realocados com sucesso!');
        
        // Inativar o médico
        await inativarMedicoFinal();
        
    } catch (error) {
        console.error('Erro ao realocar pacientes:', error);
        alert('Erro ao realocar pacientes: ' + error.message);
    }
}

// Inativar médico (função final)
async function inativarMedicoFinal() {
    try {
        // Buscar os dados atuais do médico primeiro
        const medicoAtual = await getDados(`/medicos/${medicoParaDeletar}`);
        
        const medico = {
            nome: medicoAtual.nome,
            crm: medicoAtual.crm,
            ativo: false
        };
        
        console.log('Inativando médico:', medicoParaDeletar, medico); // Debug
        
        await putDados(`/medicos/${medicoParaDeletar}`, medico);
        mostrarNotificacao('Sucesso', 'Médico inativado com sucesso!');
        
        // Limpar variáveis
        medicoParaInativar = null;
        medicoParaDeletar = null;
        
        fecharModal();
        cancelarEdicao();
        carregarMedicos();
    } catch (error) {
        console.error('Erro ao inativar médico:', error);
        alert('Erro ao inativar médico: ' + error.message);
    }
}

// Funções mínimas para usar o modal já presente no HTML
(function () {
  function mostrarNotificacao(titulo, mensagem) {
    const modal = document.getElementById('modal-notificacao');
    if (!modal) return;
    const elTitulo = document.getElementById('notificacao-titulo');
    const elMensagem = document.getElementById('notificacao-mensagem');
    if (elTitulo) elTitulo.textContent = titulo || 'Informação';
    if (elMensagem) elMensagem.textContent = mensagem || '';
    modal.style.display = 'block';
    const ok = modal.querySelector('.modal-actions button');
    if (ok) ok.focus();
  }

  function fecharNotificacao() {
    const modal = document.getElementById('modal-notificacao');
    if (modal) modal.style.display = 'none';
  }

  // expõe globalmente para chamadas inline do HTML (ex: onclick)
  window.mostrarNotificacao = mostrarNotificacao;
  window.fecharNotificacao = fecharNotificacao;
})();

/*
  Modal de confirmação: confirmarComModal(mensagem) => Promise<boolean>
  Usa o markup #modal-confirmacao adicionado no HTML.
*/
(function () {
  let _confirmResolve = null;

  function abrirConfirmacao(titulo, mensagem) {
    const modal = document.getElementById('modal-confirmacao');
    if (!modal) return Promise.resolve(false);

    const elTitulo = document.getElementById('confirmacao-titulo');
    const elMensagem = document.getElementById('confirmacao-mensagem');
    const btnSim = document.getElementById('confirmacao-sim');
    const btnNao = document.getElementById('confirmacao-nao');
    const btnClose = document.getElementById('confirmacao-close');

    if (elTitulo) elTitulo.textContent = titulo || 'Confirmação';
    if (elMensagem) elMensagem.textContent = mensagem || '';

    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');

    // Limpa handlers anteriores
    const limpar = () => {
      if (!modal) return;
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      btnSim.removeEventListener('click', onSim);
      btnNao.removeEventListener('click', onNao);
      btnClose.removeEventListener('click', onNao);
      document.removeEventListener('keydown', onEsc);
    };

    function onSim() {
      limpar();
      if (_confirmResolve) _confirmResolve(true);
      _confirmResolve = null;
    }
    function onNao() {
      limpar();
      if (_confirmResolve) _confirmResolve(false);
      _confirmResolve = null;
    }
    function onEsc(e) {
      if (e.key === 'Escape') onNao();
    }

    btnSim.addEventListener('click', onSim);
    btnNao.addEventListener('click', onNao);
    btnClose.addEventListener('click', onNao);
    document.addEventListener('keydown', onEsc);

    return new Promise((resolve) => {
      _confirmResolve = resolve;
    });
  }

  // expõe função utilitária
  window.confirmarComModal = abrirConfirmacao;
})();

// Expor funções globalmente para serem chamadas pelo HTML
window.editarMedico = editarMedico;
window.deletarMedico = deletarMedico;
window.cancelarEdicao = cancelarEdicao;
window.fecharModal = fecharModal;
window.excluirPaciente = excluirPaciente;
window.confirmarDelecaoMedico = confirmarDelecaoMedico;
window.confirmarInativacaoMedico = confirmarInativacaoMedico;