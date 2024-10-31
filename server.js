const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

// Caminho do arquivo JSON
const filePath = path.join(__dirname, 'receitas.json');

// Função para ler as receitas do arquivo
const lerReceitas = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Função para salvar as receitas no arquivo
const salvarReceitas = (receitas) => {
    fs.writeFileSync(filePath, JSON.stringify(receitas, null, 2));
};

// Rota para listar todas as receitas
app.get('/receitas', (req, res) => {
    const receitas = lerReceitas();
    res.json(receitas);
});

// Rota para obter uma receita específica
app.get('/receitas/:id', (req, res) => {
    const receitas = lerReceitas();
    const receita = receitas.find(r => r.id === parseInt(req.params.id));
    if (!receita) return res.status(404).json({ mensagem: 'Receita não encontrada' });
    res.json(receita);
});

// Rota para adicionar uma nova receita
app.post('/receitas', (req, res) => {
    const receitas = lerReceitas();
    const novaReceita = {
        id: receitas.length + 1,
        nome: req.body.nome,
        ingredientes: req.body.ingredientes,
        instrucoes: req.body.instrucoes,
        tempoPreparo: req.body.tempoPreparo,
        tipoPrato: req.body.tipoPrato,
    };
    receitas.push(novaReceita);
    salvarReceitas(receitas);
    res.status(201).json(novaReceita);
});

// Rota para atualizar uma receita
app.put('/receitas/:id', (req, res) => {
    const receitas = lerReceitas();
    const receita = receitas.find(r => r.id === parseInt(req.params.id));
    if (!receita) return res.status(404).json({ mensagem: 'Receita não encontrada' });

    receita.nome = req.body.nome;
    receita.ingredientes = req.body.ingredientes;
    receita.instrucoes = req.body.instrucoes;
    receita.tempoPreparo = req.body.tempoPreparo;
    receita.tipoPrato = req.body.tipoPrato;
    salvarReceitas(receitas);
    res.json(receita);
});

// Rota para remover uma receita
app.delete('/receitas/:id', (req, res) => {
    const receitas = lerReceitas();
    const receitaIndex = receitas.findIndex(r => r.id === parseInt(req.params.id));
    if (receitaIndex === -1) return res.status(404).json({ mensagem: 'Receita não encontrada' });

    receitas.splice(receitaIndex, 1);
    salvarReceitas(receitas);
    res.status(204).send();
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/receitas`);
});

//Comandos executados

// curl http://localhost:3000/receitas — lista todas as receitas disponíveis 
// curl http://localhost:3000/receitas/1 — obtém a receita com id 1. - Bolo de Chocolate

// curl -X POST http://localhost:3000/receitas -H "Content-Type: application/json" -d '{"id":6, "titulo": "Panqueca de Banana", "ingredientes": ["Banana", "Aveia", "Mel", "Ovo", "Canela"], "instrucoes":"Misture todos os ingredientes, unte uma frigideira com banha ou óleo e coloque a mistura da panqueca na frigideira, sempre cuidando pra ela não passar do ponto", "tempoPreparo":"5 minutos", "tipoPrato": "Lanche da Tarde"}'
//  adiciona uma nova receita com o curl(corpo JSON necessário). - Panqueca de Banana

// curl -X PUT http://localhost:3000/receitas/6 -H "Content-Type: application/json" -d '{"id":6, "titulo": "Panqueca de Banana", "ingredientes": ["Banana", "Aveia", "Mel", "Ovo", "Canela"], "instrucoes":"Misture todos os ingredientes, unte uma frigideira com banha ou óleo e coloque a mistura da panqueca na frigideira, sempre cuidando pra ela não passar do ponto", "tempoPreparo":"7 minutos", "tipoPrato": "Lanche da Tarde"}'
// atualiza a receita com id 1 utilizando curl (corpo JSON necessário). 

// curl -X DELETE http://localhost:3000/receitas/5 — remove a receita com id 5 utilizando curl - Pudim de Leite