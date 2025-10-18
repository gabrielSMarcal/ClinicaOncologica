document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = '/api/pacientes';

    // Function to fetch and display patients
    function fetchPacientes() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const pacientesList = document.getElementById('pacientesList');
                pacientesList.innerHTML = '';
                data.forEach(paciente => {
                    const li = document.createElement('li');
                    li.textContent = `${paciente.nome} - ${paciente.cpf}`;
                    li.dataset.id = paciente.id;
                    li.addEventListener('click', () => displayPaciente(paciente));
                    pacientesList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching pacientes:', error));
    }

    // Function to display selected patient details
    function displayPaciente(paciente) {
        document.getElementById('pacienteId').value = paciente.id;
        document.getElementById('pacienteNome').value = paciente.nome;
        document.getElementById('pacienteCpf').value = paciente.cpf;
        document.getElementById('pacienteDataNascimento').value = paciente.dataNascimento;
        document.getElementById('pacienteTipoCancer').value = paciente.tipoCancer;
        document.getElementById('pacienteDataInicioTratamento').value = paciente.dataInicioTratamento;
    }

    // Function to create or update a patient
    function savePaciente(event) {
        event.preventDefault();
        const id = document.getElementById('pacienteId').value;
        const pacienteData = {
            nome: document.getElementById('pacienteNome').value,
            cpf: document.getElementById('pacienteCpf').value,
            dataNascimento: document.getElementById('pacienteDataNascimento').value,
            tipoCancer: document.getElementById('pacienteTipoCancer').value,
            dataInicioTratamento: document.getElementById('pacienteDataInicioTratamento').value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/${id}` : apiUrl;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pacienteData)
        })
        .then(response => response.json())
        .then(data => {
            fetchPacientes();
            clearForm();
        })
        .catch(error => console.error('Error saving paciente:', error));
    }

    // Function to delete a patient
    function deletePaciente() {
        const id = document.getElementById('pacienteId').value;
        if (!id) return;

        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchPacientes();
            clearForm();
        })
        .catch(error => console.error('Error deleting paciente:', error));
    }

    // Function to clear the form
    function clearForm() {
        document.getElementById('pacienteId').value = '';
        document.getElementById('pacienteNome').value = '';
        document.getElementById('pacienteCpf').value = '';
        document.getElementById('pacienteDataNascimento').value = '';
        document.getElementById('pacienteTipoCancer').value = '';
        document.getElementById('pacienteDataInicioTratamento').value = '';
    }

    // Event listeners
    document.getElementById('pacienteForm').addEventListener('submit', savePaciente);
    document.getElementById('deletePacienteButton').addEventListener('click', deletePaciente);

    // Initial fetch of pacientes
    fetchPacientes();
});