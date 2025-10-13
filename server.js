require('dotenv').config(); // Ainda precisamos das variáveis de ambiente para o futuro, mesmo que não as usemos agora

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir ficheiros estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota padrão para a home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});