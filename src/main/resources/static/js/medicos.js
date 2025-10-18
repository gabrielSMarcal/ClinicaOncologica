const API_URL = 'http://localhost:8080/api/medicos';
let medicoParaDeletar = null;

// Carregar médicos ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarMedicos();
    document.getElementById('medico-form').addEventListener('submit', salvarMedico);
});

// Carregar lista de médicos
async function carregarMedicos() {
    try {
        const response = await fetch(API_URL);
        const medicos = await response.json();
        
        const tbody = document.getElementById('medicos-tbody');
        tbody.innerHTML = '';
        
        medicos.forEach(medico => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${medico.id}</td>
                <td>${medico.nome}</td>
                <td>${medico.crm}</td>
                <td><span class="status-badge status-${medico.ativo ? 'ativo' : 'inativo'}">
                    ${medico.ativo ? 'Ativo' : 'Inativo'}
                </span></td>
                <td>${medico.pacientes ? medico.pacientes.length : 0}</td>
                <td>
                    <button class="btn-warning" onclick="editarMedico(${medico.id})">Editar</button>
                    <button class="btn-danger" onclick="deletarMedico(${medico.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        alert('Erro ao carregar médicos');
    }
}

// Salvar médico (criar ou atualizar)
async function salvarMedico(event) {
    event.preventDefault();
    
    const id = document.getElementById('medico-id').value;
    const medico = {
        nome: document.getElementById('nome').value,
        crm: document.getElementById('crm').value,
        ativo: document.getElementById('ativo').value === 'true'
    };
    
    try {
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medico)
        });
        
        if (response.ok) {
            alert(id ? 'Médico atualizado com sucesso!' : 'Médico cadastrado com sucesso!');
            cancelarEdicao();
            carregarMedicos();
        } else {
            alert('Erro ao salvar médico');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar médico');
    }
}

// Editar médico
async function editarMedico(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const medico = await response.json();
        
        document.getElementById('medico-id').value = medico.id;
        document.getElementById('nome').value = medico.nome;
        document.getElementById('crm').value = medico.crm;
        document.getElementById('ativo').value = medico.ativo.toString();
        
        document.getElementById('form-title').textContent = 'Editar Médico';
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao carregar médico:', error);
        alert('Erro ao carregar dados do médico');
    }
}

// Deletar médico
async function deletarMedico(id) {
    try {
        // Verificar se pode deletar
        const response = await fetch(`${API_URL}/${id}/pode-deletar`);
        const data = await response.json();
        
        if (data.podeDeletar) {
            // Pode deletar diretamente
            if (confirm('Tem certeza que deseja excluir este médico?')) {
                await confirmarExclusao(id);
            }
        } else {
            // Precisa realocar pacientes
            medicoParaDeletar = id;
            mostrarModalRealocacao(data);
        }
    } catch (error) {
        console.error('Erro ao deletar médico:', error);
        alert('Erro ao processar exclusão');
    }
}

// Mostrar modal de realocação
function mostrarModalRealocacao(data) {
    const modal = document.getElementById('modal-realocacao');
    const container = document.getElementById('pacientes-realocacao');
    
    container.innerHTML = '';
    
    data.pacientes.forEach(paciente => {
        const card = document.createElement('div');
        card.className = 'paciente-card';
        card.id = `paciente-${paciente.id}`;
        
        card.innerHTML = `
            <h4>👤 ${paciente.nome}</h4>
            <div class="paciente-info">
                <p><strong>CPF:</strong> ${paciente.cpf}</p>
                <p><strong>Idade:</strong> ${calcularIdade(paciente.dataNascimento)} anos</p>
                <p><strong>Tipo de Câncer:</strong> ${paciente.tipoCancer}</p>
                <p><strong>Início do Tratamento:</strong> ${formatarData(paciente.dataInicioTratamento)}</p>
            </div>
            <div class="paciente-actions">
                <select id="medico-${paciente.id}">
                    <option value="">Selecione um médico para realocar</option>
                    ${data.medicosDisponiveis.map(m => 
                        `<option value="${m.id}">${m.nome} (${m.crm})</option>`
                    ).join('')}
                </select>
                <button class="btn-success" onclick="realocarPaciente(${paciente.id})">Realocar</button>
                <button class="btn-danger" onclick="excluirPaciente(${paciente.id})">Excluir Paciente</button>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    modal.style.display = 'block';
}

// Realocar paciente
async function realocarPaciente(pacienteId) {
    const novoMedicoId = document.getElementById(`medico-${pacienteId}`).value;
    
    if (!novoMedicoId) {
        alert('Por favor, selecione um médico para realocar o paciente');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/realocar-paciente`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pacienteId: parseInt(pacienteId),
                novoMedicoId: parseInt(novoMedicoId)
            })
        });
        
        if (response.ok) {
            alert('Paciente realocado com sucesso!');
            document.getElementById(`paciente-${pacienteId}`).remove();
            verificarSePodeConfirmarDelecao();
        } else {
            alert('Erro ao realocar paciente');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao realocar paciente');
    }
}

// Excluir paciente
async function excluirPaciente(pacienteId) {
    if (!confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8080/api/pacientes/${pacienteId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Paciente excluído com sucesso!');
            document.getElementById(`paciente-${pacienteId}`).remove();
            verificarSePodeConfirmarDelecao();
        } else {
            alert('Erro ao excluir paciente');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir paciente');
    }
}

// Verificar se todos os pacientes foram realocados/excluídos
function verificarSePodeConfirmarDelecao() {
    const container = document.getElementById('pacientes-realocacao');
    if (container.children.length === 0) {
        alert('Todos os pacientes foram realocados ou excluídos. Agora você pode confirmar a exclusão do médico.');
    }
}

// Confirmar exclusão do médico
async function confirmarDelecaoMedico() {
    const container = document.getElementById('pacientes-realocacao');
    
    if (container.children.length > 0) {
        alert('Você ainda precisa realocar ou excluir todos os pacientes antes de deletar o médico.');
        return;
    }
    
    await confirmarExclusao(medicoParaDeletar);
}

// Executar exclusão do médico
async function confirmarExclusao(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Médico excluído com sucesso!');
            fecharModal();
            carregarMedicos();
        } else {
            const error = await response.json();
            alert(error.erro || 'Erro ao excluir médico');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir médico');
    }
}

// Fechar modal
function fecharModal() {
    document.getElementById('modal-realocacao').style.display = 'none';
    medicoParaDeletar = null;
}

// Cancelar edição
function cancelarEdicao() {
    document.getElementById('medico-form').reset();
    document.getElementById('medico-id').value = '';
    document.getElementById('form-title').textContent = 'Cadastrar Novo Médico';
}

// Funções auxiliares
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modal-realocacao');
    if (event.target === modal) {
        fecharModal();
    }
}