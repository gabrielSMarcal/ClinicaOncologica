document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "/api/medicos";

    // Function to fetch and display doctors
    function fetchMedicos() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const medicosList = document.getElementById("medicosList");
                medicosList.innerHTML = "";
                data.forEach(medico => {
                    const li = document.createElement("li");
                    li.textContent = `${medico.nome} - ${medico.crm}`;
                    medicosList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching doctors:', error));
    }

    // Function to add a new doctor
    document.getElementById("addMedicoForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const nome = document.getElementById("medicoNome").value;
        const crm = document.getElementById("medicoCrm").value;

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, crm })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Doctor added:', data);
            fetchMedicos(); // Refresh the list
        })
        .catch(error => console.error('Error adding doctor:', error));
    });

    // Initial fetch of doctors
    fetchMedicos();
});