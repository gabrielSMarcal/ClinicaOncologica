const baseURL = 'http://localhost:8081/api';

// GET - Obter dados
export function getDados(endpoint) {
    return fetch(`${baseURL}${endpoint}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
            throw error;
        });
}

// POST - Criar recurso
export function postDados(endpoint, dados) {
    return fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.erro || err.message || 'Erro ao criar recurso');
            });
        }
        return response.json();
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
        throw error;
    });
}

// PUT - Atualizar recurso
export function putDados(endpoint, dados) {
    return fetch(`${baseURL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.erro || err.message || 'Erro ao atualizar recurso');
            });
        }
        return response.json();
    })
    .catch(error => {
        console.error('Erro ao atualizar dados:', error);
        throw error;
    });
}

// DELETE - Deletar recurso
export function deleteDados(endpoint) {
    return fetch(`${baseURL}${endpoint}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.erro || err.message || 'Erro ao deletar recurso');
            });
        }
        // Pode retornar vazio ou JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
        return { mensagem: 'Deletado com sucesso' };
    })
    .catch(error => {
        console.error('Erro ao deletar dados:', error);
        throw error;
    });
}