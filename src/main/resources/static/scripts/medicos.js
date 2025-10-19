import { getDados, postDados, putDados, deleteDados } from './api.js';

let medicoEmEdicao = null;
let medicoParaDeletar = null;
let pacientesParaRealocar = [];

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
    const medico = {
        nome: document.getElementById('nome').value,
        crm: document.getElementById('crm').value,
        ativo: id ? document.getElementById('ativo').value === 'true' : true
    };
    
    try {
        if (id) {
            await putDados(`/medicos/${id}`, medico);
            alert('Médico atualizado com sucesso!');
        } else {
            await postDados('/medicos', medico);
            alert('Médico cadastrado com sucesso!');
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
            // Se não tem pacientes, deletar diretamente
            if (confirm('Tem certeza que deseja deletar este médico?')) {
                await deleteDados(`/medicos/${id}`);
                alert('Médico deletado com sucesso!');
                carregarMedicos();
            }
        }
    } catch (error) {
        console.error('Erro ao deletar médico:', error);
        alert('Erro ao deletar médico: ' + error.message);
    }
}

// Abrir modal de realocação
async function abrirModalRealocacao(medicoId) {
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
        container.innerHTML = '<h3>Pacientes Vinculados:</h3>';
        
        pacientes.forEach(paciente => {
            const div = document.createElement('div');
            div.className = 'paciente-realocacao';
            div.innerHTML = `
                <div class="paciente-info">
                    <strong>${paciente.nome}</strong> - CPF: ${paciente.cpf}
                </div>
                <div class="paciente-actions">
                    <select class="select-medico" data-paciente-id="${paciente.id}">
                        <option value="">Selecione um médico</option>
                        ${outrosMedicos.map(m => `<option value="${m.id}">${m.nome} (${m.crm})</option>`).join('')}
                    </select>
                    <button class="btn-danger-small" onclick="window.excluirPaciente(${paciente.id})">Excluir Paciente</button>
                </div>
            `;
            container.appendChild(div);
        });
        
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
    pacientesParaRealocar = [];
}

// Excluir paciente
async function excluirPaciente(pacienteId) {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) {
        return;
    }
    
    try {
        await deleteDados(`/pacientes/${pacienteId}`);
        alert('Paciente excluído com sucesso!');
        
        // Atualizar lista de pacientes
        pacientesParaRealocar = pacientesParaRealocar.filter(p => p.id !== pacienteId);
        
        if (pacientesParaRealocar.length === 0) {
            // Se não há mais pacientes, fechar modal e permitir exclusão do médico
            fecharModal();
            await deletarMedicoFinal();
        } else {
            // Recarregar modal
            await abrirModalRealocacao(medicoParaDeletar);
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
        
        alert('Pacientes realocados com sucesso!');
        
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
        alert('Médico deletado com sucesso!');
        fecharModal();
        carregarMedicos();
    } catch (error) {
        console.error('Erro ao deletar médico:', error);
        alert('Erro ao deletar médico: ' + error.message);
    }
}

// Expor funções globalmente para serem chamadas pelo HTML
window.editarMedico = editarMedico;
window.deletarMedico = deletarMedico;
window.cancelarEdicao = cancelarEdicao;
window.fecharModal = fecharModal;
window.excluirPaciente = excluirPaciente;
window.confirmarDelecaoMedico = confirmarDelecaoMedico;