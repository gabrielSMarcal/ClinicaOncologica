import { getDados, postDados, putDados, deleteDados } from './api.js';

let medicoEmEdicao = null;
let medicoParaDeletar = null;

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
        renderizarTabelaMedicos(medicos);
    } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        alert('Erro ao carregar médicos: ' + error.message);
    }
}

// Renderizar tabela de médicos
function renderizarTabelaMedicos(medicos) {
    const tbody = document.getElementById('medicos-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    medicos.forEach(medico => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${medico.id}</td>
            <td>${medico.nome}</td>
            <td>${medico.crm}</td>
            <td><span class="status ${medico.ativo ? 'ativo' : 'inativo'}">${medico.ativo ? 'Ativo' : 'Inativo'}</span></td>
            <td>${medico.pacientes ? medico.pacientes.length : 0}</td>
            <td>
                <button class="btn-edit" onclick="editarMedico(${medico.id})">Editar</button>
                <button class="btn-delete" onclick="deletarMedico(${medico.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Salvar médico (criar ou atualizar)
async function salvarMedico(event) {
    event.preventDefault();
    
    const id = document.getElementById('medico-id').value;
    const nome = document.getElementById('nome').value;
    const crm = document.getElementById('crm').value;
    const ativo = document.getElementById('ativo').value === 'true';
    
    const medicoData = {
        nome: nome.trim(),
        crm: crm.trim()
    };
    
    // Só inclui ativo se estiver editando
    if (id) {
        medicoData.ativo = ativo;
    }
    
    try {
        if (id) {
            // Atualizar
            await putDados(`/medicos/${id}`, medicoData);
            alert('Médico atualizado com sucesso!');
        } else {
            // Criar
            await postDados('/medicos', medicoData);
            alert('Médico cadastrado com sucesso!');
        }
        
        limparFormulario();
        carregarMedicos();
    } catch (error) {
        console.error('Erro ao salvar médico:', error);
        alert('Erro ao salvar médico: ' + error.message);
    }
}

// Editar médico
window.editarMedico = async function(id) {
    try {
        const medico = await getDados(`/medicos/${id}`);
        
        document.getElementById('medico-id').value = medico.id;
        document.getElementById('nome').value = medico.nome;
        document.getElementById('crm').value = medico.crm;
        document.getElementById('ativo').value = medico.ativo.toString();
        
        // Mostrar campo de status ao editar
        document.getElementById('status-group').style.display = 'block';
        document.getElementById('form-title').textContent = 'Editar Médico';
        
        medicoEmEdicao = medico;
    } catch (error) {
        console.error('Erro ao carregar médico:', error);
        alert('Erro ao carregar médico: ' + error.message);
    }
}

// Deletar médico
window.deletarMedico = async function(id) {
    try {
        const medico = await getDados(`/medicos/${id}`);
        
        if (medico.pacientes && medico.pacientes.length > 0) {
            // Médico tem pacientes, mostrar modal
            medicoParaDeletar = medico;
            mostrarModalRealocacao(medico);
        } else {
            // Médico não tem pacientes, pode deletar
            if (confirm(`Tem certeza que deseja deletar o médico ${medico.nome}?`)) {
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

// Mostrar modal de realocação
function mostrarModalRealocacao(medico) {
    const modal = document.getElementById('modal-realocacao');
    const pacientesDiv = document.getElementById('pacientes-realocacao');
    
    pacientesDiv.innerHTML = `
        <h3>Pacientes do Dr(a). ${medico.nome}:</h3>
        <ul>
            ${medico.pacientes.map(p => `<li>${p.nome} - CPF: ${p.cpf}</li>`).join('')}
        </ul>
        <p class="modal-info">Por favor, realoque ou exclua estes pacientes antes de deletar o médico.</p>
    `;
    
    modal.style.display = 'block';
}

// Fechar modal
window.fecharModal = function() {
    const modal = document.getElementById('modal-realocacao');
    modal.style.display = 'none';
    medicoParaDeletar = null;
}

// Confirmar deleção do médico (após realocação)
window.confirmarDelecaoMedico = async function() {
    if (!medicoParaDeletar) return;
    
    try {
        // Verificar novamente se não há pacientes
        const medico = await getDados(`/medicos/${medicoParaDeletar.id}`);
        
        if (medico.pacientes && medico.pacientes.length > 0) {
            alert('Ainda há pacientes vinculados a este médico. Realoque-os primeiro.');
            return;
        }
        
        await deleteDados(`/medicos/${medicoParaDeletar.id}`);
        alert('Médico deletado com sucesso!');
        fecharModal();
        carregarMedicos();
    } catch (error) {
        console.error('Erro ao deletar médico:', error);
        alert('Erro ao deletar médico: ' + error.message);
    }
}

// Cancelar edição
window.cancelarEdicao = function() {
    limparFormulario();
}

// Limpar formulário
function limparFormulario() {
    document.getElementById('medico-form').reset();
    document.getElementById('medico-id').value = '';
    document.getElementById('status-group').style.display = 'none';
    document.getElementById('form-title').textContent = 'Cadastrar Novo Médico';
    medicoEmEdicao = null;
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modal-realocacao');
    if (event.target == modal) {
        fecharModal();
    }
}