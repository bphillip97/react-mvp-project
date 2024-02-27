import express, { json } from 'express';
import cors from 'cors';
import pkg from 'pg';
const {Pool} = pkg;

const app = express();
const port = 5000;

// Connect to PostgreSQL database
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(json());

// RESTful API routes

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;

  try {
    const result = await pool.query('INSERT INTO todos (title) VALUES ($1) RETURNING *', [title]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const todoId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [todoId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
