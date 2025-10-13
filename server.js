const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Carrega as chaves do ficheiro .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Cria a ligação com o Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.static('public'));

// Rota da API que vai buscar uma pergunta ao Supabase
app.get('/api/question', async (req, res) => {
    try {
        const { count } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true });

        const randomIndex = Math.floor(Math.random() * count);

        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .range(randomIndex, randomIndex)
            .single();

        if (error) {
            throw error;
        }

        res.json(data);

    } catch (error) {
        console.error('Erro ao buscar pergunta do Supabase:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});