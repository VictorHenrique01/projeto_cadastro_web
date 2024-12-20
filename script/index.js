async function listarEnderecos() {
    const url = "https://go-wash-api.onrender.com/api/auth/address";
    let token = localStorage.getItem('access_token');

    if (!token) {
        alert("Você precisa estar logado para ver seus endereços.");
        return;
    }

    try {
        let api = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (api.ok) {
            const contentType = api.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                let resposta = await api.json();
                console.log(resposta);

                let enderecos = resposta.data;
                let tbody = document.getElementById("corpo_tabela");
                tbody.innerHTML = ""; 

                if (Array.isArray(enderecos)) {
                    enderecos.forEach(endereco => {
                        let row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${endereco.id}</td>
                            <td>${endereco.title}</td>
                            <td>${endereco.cep}</td>
                            <td>${endereco.address}</td>
                            <td>${endereco.number}</td>
                            <td><button class="botao_atualiza" onclick="atualizarEnd(${endereco.id})">Atualizar</button></td>
                            <td><button class="botao_deleta" data-id="${endereco.id}">Deletar</button></td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    console.error("enderecos não são um array:", enderecos);
                    alert("Não foram encontrados endereços.");
                }
            } else {
                console.error("Resposta não é JSON:", await api.text());
                alert("Erro ao carregar os dados. Tente novamente mais tarde.");
            }
        } else {
            let respostaErro = await api.json();
            console.error(respostaErro);
        }
    } catch (error) {
        console.error("Erro ao listar endereços:", error);
    }
}

// Início da Função de atualizar 
async function atualizarEnd(id) {
    window.location.href="../view/atualiza.html?id=" + id;
}

// Função para deletar
async function deletarEndereco(id) {
    const url = `https://go-wash-api.onrender.com/api/auth/address/${id}`;
    let token = localStorage.getItem('access_token');

    if (!token) {
        alert("Você precisa estar logado para deletar um endereço.");
        return;
    }

    try {
        let response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Endereço deletado com sucesso!");
            listarEnderecos(); 
        } else {
            let erro = await response.json();
            console.error("Erro ao deletar:", erro);
            alert("Não foi possível deletar o endereço.");
        }
    } catch (error) {
        console.error("Erro ao tentar deletar o endereço:", error);
        alert("Ocorreu um erro ao tentar deletar o endereço.");
    }
}

document.addEventListener("click", function(event) {
    if (event.target.classList.contains("botao_deleta")) {
        let id = event.target.getAttribute("data-id");
        deletarEndereco(id);
    }
});

window.onload = listarEnderecos;
