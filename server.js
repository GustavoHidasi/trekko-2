require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do banco de dados (Neon / PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Necessário para o Neon
});

// ── CRIAÇÃO DA CONTA FALSA AUTOMÁTICA ──
const criarContaFake = async () => {
  try {
    const res = await pool.query("SELECT id FROM users WHERE email = 'teste@trekko.com'");
    if (res.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('123456', salt);
      await pool.query(
        `INSERT INTO users (email, password_hash, fullname, phone, birthday, cpf) VALUES ($1, $2, $3, $4, $5, $6)`,
        ['teste@trekko.com', hash, 'Viajante Teste', '11999999999', '1990-01-01', '11122233344']
      );
      console.log('✅ Conta falsa criada no banco: teste@trekko.com / Senha: 123456');
    }
  } catch (err) {
    console.log('Aviso: Não foi possível criar conta falsa agora.', err.message);
  }
};
criarContaFake();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve todos os arquivos estáticos (HTML, CSS, JS) da pasta atual
app.use(express.static(__dirname));

// ── MIDDLEWARE DE AUTENTICAÇÃO (Valida o token JWT) ──
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
    req.user = user;
    next();
  });
};

// ── ROTA DE LOGIN ──
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Busca o usuário no banco
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuário não encontrado' });

    const user = result.rows[0];
    
    // Compara a senha digitada com a criptografada no banco
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Senha incorreta' });

    // Gera Token JWT válido por 7 dias
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, message: 'Login realizado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// ── ROTA DE REGISTRO (Criar Conta) ──
app.post('/api/auth/register', async (req, res) => {
  const { email, password, fullname, phone, birthday, cpf } = req.body;
  try {
    // Verifica se usuário já existe
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    // Criptografa a senha antes de salvar no banco
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insere o novo usuário no banco de dados Neon
    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, fullname, phone, birthday, cpf) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [email, passwordHash, fullname, phone, birthday, cpf]
    );

    // Cria o token para já deixar o usuário logado automaticamente
    const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, message: 'Conta criada com sucesso!' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro interno ao criar conta.' });
  }
});

// ── ROTA DE PERFIL ──
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    // req.user.userId vem do JWT
    const result = await pool.query(
      'SELECT email, fullname, phone, birthday, cpf, city, preferences FROM users WHERE id = $1',
      [req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Trekko rodando em http://localhost:${PORT}`);
});