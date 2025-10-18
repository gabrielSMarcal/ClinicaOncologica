import { getDados, postDados, putDados, deleteDados } from './api.js';

let pacienteEmEdicao = null;

// Carregar pacientes e médicos ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarPacientes();
    carregarMedicosSelect();
    
    const form = document.getElementById('pacienteForm');
    if (form) {
        form.addEventListener('submit', salvarPaciente);
    }
});

// Listar todos os pacientes
async function carregarPacientes() {
    try {
        const pacientes = await getDados('/pacientes');
        console.log('Pacientes carregados:', pacientes);
        renderizarTabelaPacientes(pacientes);
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        alert('Erro ao carregar pacientes: ' + error.message);
    }
}

// Renderizar tabela de pacientes
function renderizarTabelaPacientes(pacientes) {
    const tbody = document.querySelector('#pacientesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!pacientes || pacientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">Nenhum paciente cadastrado</td></tr>';
        return;
    }
    
    pacientes.forEach(paciente => {
        const tr = document.createElement('tr');
        
        let nomeMedico = 'N/A';
        try {
            if (paciente.medico) {
                nomeMedico = paciente.medico.nome || 'N/A';
            }
        } catch (e) {
            console.warn('Erro ao acessar médico do paciente:', e);
        }
        
        tr.innerHTML = `
            <td>${paciente.id || ''}</td>
            <td>${paciente.nome || ''}</td>
            <td>${formatarCPF(paciente.cpf || '')}</td>
            <td>${formatarData(paciente.dataNascimento || '')}</td>
            <td>${paciente.tipoCancer || ''}</td>
            <td>${formatarData(paciente.dataInicioTratamento || '')}</td>
            <td>${nomeMedico}</td>
            <td>
                <button class="btn-edit" onclick="editarPaciente(${paciente.id})">Editar</button>
                <button class="btn-delete" onclick="deletarPaciente(${paciente.id})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Carregar médicos no select
async function carregarMedicosSelect() {
    try {
        const medicos = await getDados('/medicos');
        const select = document.getElementById('medicoId');
        
        if (!select) return;
        
        select.innerHTML = '<option value="">Selecione um médico</option>';
        
        const medicosAtivos = medicos.filter(m => m.ativo === true);
        
        medicosAtivos.forEach(medico => {
            const option = document.createElement('option');
            option.value = medico.id;
            option.textContent = `${medico.nome} - ${medico.crm}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        alert('Erro ao carregar médicos: ' + error.message);
    }
}

// Salvar paciente (criar ou atualizar)
async function salvarPaciente(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const tipoCancer = document.getElementById('tipoCancer').value;
    const dataInicioTratamento = document.getElementById('dataInicioTratamento').value;
    const medicoId = document.getElementById('medicoId').value;
    
    if (!validarCPF(cpf)) {
        alert('CPF inválido! Digite apenas números (11 dígitos).');
        return;
    }
    
    if (!medicoId) {
        alert('Por favor, selecione um médico.');
        return;
    }
    
    const pacienteData = {
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ''),
        dataNascimento: dataNascimento,
        tipoCancer: tipoCancer.trim(),
        dataInicioTratamento: dataInicioTratamento,
        medico: { 
            id: parseInt(medicoId) 
        }
    };
    
    console.log('Enviando dados:', pacienteData); // Debug
    
    try {
        if (pacienteEmEdicao) {
            await putDados(`/pacientes/${pacienteEmEdicao}`, pacienteData);
            alert('Paciente atualizado com sucesso!');
        } else {
            await postDados('/pacientes', pacienteData);
            alert('Paciente cadastrado com sucesso!');
        }
        
        limparFormulario();
        carregarPacientes();
    } catch (error) {
        console.error('Erro ao salvar paciente:', error);
        alert('Erro ao salvar paciente: ' + error.message);
    }
}

// Editar paciente
window.editarPaciente = async function(id) {
    try {
        const paciente = await getDados(`/pacientes/${id}`);
        
        document.getElementById('nome').value = paciente.nome;
        document.getElementById('cpf').value = paciente.cpf;
        document.getElementById('dataNascimento').value = paciente.dataNascimento;
        document.getElementById('tipoCancer').value = paciente.tipoCancer;
        document.getElementById('dataInicioTratamento').value = paciente.dataInicioTratamento;
        
        if (paciente.medico && paciente.medico.id) {
            document.getElementById('medicoId').value = paciente.medico.id;
        }
        
        pacienteEmEdicao = paciente.id;
        
        document.querySelector('#pacienteForm button[type="submit"]').textContent = 'Atualizar';
    } catch (error) {
        console.error('Erro ao carregar paciente:', error);
        alert('Erro ao carregar paciente: ' + error.message);
    }
}

// Deletar paciente
window.deletarPaciente = async function(id) {
    try {
        const paciente = await getDados(`/pacientes/${id}`);
        
        if (confirm(`Tem certeza que deseja deletar o paciente ${paciente.nome}?`)) {
            await deleteDados(`/pacientes/${id}`);
            alert('Paciente deletado com sucesso!');
            carregarPacientes();
        }
    } catch (error) {
        console.error('Erro ao deletar paciente:', error);
        alert('Erro ao deletar paciente: ' + error.message);
    }
}

// Limpar formulário
function limparFormulario() {
    document.getElementById('pacienteForm').reset();
    pacienteEmEdicao = null;
    document.querySelector('#pacienteForm button[type="submit"]').textContent = 'Cadastrar';
}

// Validar CPF (formato básico)
function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.length === 11;
}

// Formatar CPF para exibição
function formatarCPF(cpf) {
    if (!cpf) return '';
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatar data para exibição (dd/MM/yyyy)
function formatarData(dataISO) {
    if (!dataISO) return '';
    try {
        const partes = dataISO.split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return dataISO;
    } catch (e) {
        return dataISO;
    }
}