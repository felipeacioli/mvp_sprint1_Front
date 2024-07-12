/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getList = async () => {
  let url = 'http://127.0.0.1:5000/materiais';
  console.log(fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {    
    data.materiais.forEach(item => insertList(item.descricao, item.grupo, item.quantidade, item.preco))
    }))
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para obter a cotação do dolar através de API externa via requisição GET
  --------------------------------------------------------------------------------------
*/

const getUSDExchangeRate = async () => {
  let apiKey = "ec91dba71503e226d37905fc";
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const usdRate = data.conversion_rates.BRL;
    return usdRate;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento da cotação do dolar,.
  --------------------------------------------------------------------------------------
*/

let cotacaoPromise = getUSDExchangeRate();
cotacaoPromise
  .then((cotacao) => {
    let h2Element = document.getElementById("dolarCotation");
    h2Element.textContent = `Cotação do dólar: R$ ${cotacao.toFixed(3)}`; // Aqui você imprime o valor da cotação do dólar
  })
  .catch((error) => {
    console.error("Erro ao obter taxa de câmbio do USD:", error);
  });

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputDescricao, inputGrupo, inputQuantidade, inputPreco) => {
  const formData = new FormData();
  formData.append('descricao', inputDescricao);
  formData.append('grupo', inputGrupo);
  formData.append('quantidade', inputQuantidade);
  formData.append('preco', inputPreco);

  let url = 'http://127.0.0.1:5000/material';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const Item = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(Item)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/material?descricao=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com descrição, quantidade e grupo 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputDescricao = document.getElementById("newDescricao").value;
  let inputGrupo = document.getElementById("newGrupo").value;
  let inputQuantidade = document.getElementById("newQuantidade").value;
  let inputPreco = document.getElementById("newPreco").value;

  if (inputDescricao === '') {
    alert("Descreva o material!");
  } else if (isNaN(inputQuantidade)) {
    alert("Quantidade precisa ser um número!");
  } else if (isNaN(inputPreco)) {
    alert("Preço precisa ser um número!");
  } else {
    insertList(inputDescricao, inputGrupo, inputQuantidade, inputPreco)
    postItem(inputDescricao, inputGrupo, inputQuantidade, inputPreco)
    alert("Material adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (description, group, quantity, price) => {
  var item = [description, group, quantity, price]
  console.log(item)
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newDescricao").value ="";
  document.getElementById("newGrupo").value ="";
  document.getElementById("newQuantidade").value ="";
  document.getElementById("newPreco").value ="";
  removeElement()
}