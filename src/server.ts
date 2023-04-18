import express from 'express';
import cors from 'cors'
import axios from 'axios';

const app = express();
app.use(cors());
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

// Chave de segurança obtida no menu "Vendas" >> "Loja virtual"
const chaveDeSeguranca = 'd03e1212ed2c7c499509ce477906e532e6d1021289f2e2e96fa0f4a449249eb9';

// Endpoint de geração de token
const gerarTokenEndpoint = `http://ms-ecommerce.hiper.com.br/api/v1/auth/gerar-token/${chaveDeSeguranca}`;

// Endpoint de listagem de produtos
let listarProdutosEndpoint;

// Middleware para processar o corpo da requisição em JSON
app.use(express.json());

// Rota para listar os produtos
app.get('/produtos', async (req, res) => {
  try {
    // Chamada para obter o token de autenticação
    const tokenResponse = await axios.get(gerarTokenEndpoint);
    const token = tokenResponse.data.token;
    const pontoDeSincronizacao = tokenResponse.data.pontoDeSincronizacao;

    // Endpoint de listagem de produtos com o token de autenticação e ponto de sincronização
    listarProdutosEndpoint = `http://ms-ecommerce.hiper.com.br/api/v1/produtos/pontoDeSincronizacao`;

    // Chamada para listar os produtos
    const produtosResponse = await axios.get(listarProdutosEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const produtos = produtosResponse.data;

    res.json(produtos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao listar produtos.' });
  }
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
