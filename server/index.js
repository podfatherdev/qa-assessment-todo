import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'demo-secret-key-not-for-production';

// Middleware
app.use(cors());
app.use(express.json());

// Dummy users
const users = [
  { id: 1, username: 'admin', role: 'admin', name: 'Admin User' },
  { id: 2, username: 'user', role: 'user', name: 'Regular User' }
];

// In-memory database with user assignments
let todos = [
  { id: 1, text: 'Manage system settings', completed: true, updatedAt: new Date(), userId: 1 },
  { id: 2, text: 'Review all user tasks', completed: false, updatedAt: new Date(), userId: 1 },
  { id: 3, text: 'Land an interview at Podfather', completed: true, updatedAt: new Date(), userId: 2 },
  { id: 4, text: 'Charm offensive', completed: false, updatedAt: new Date(), userId: 2 },
  { id: 5, text: 'Get the job', completed: false, updatedAt: new Date(), userId: 2 },
];

let nextId = 6;

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes

// POST /api/auth/login - Login with username
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    }
  });
});

// GET /api/auth/me - Get current user info
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  });
});

// Todo Routes (all require authentication)

// GET /api/todos - Get todos (filtered by user role)
app.get('/api/todos', authenticateToken, (req, res) => {
  let userTodos;

  if (req.user.role === 'admin') {
    // Admin sees all todos
    userTodos = todos;
  } else {
    // Regular users see only their own todos
    userTodos = todos.filter(todo => todo.userId === req.user.id);
  }

  res.json(userTodos);
});

// POST /api/todos - Create new todo (assigned to current user)
app.post('/api/todos', authenticateToken, (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  const newTodo = {
    id: nextId++,
    text: text.trim(),
    completed: false,
    updatedAt: new Date(),
    userId: req.user.id
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id - Update todo (only if user owns it or is admin)
app.put('/api/todos/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;

  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const todo = todos[todoIndex];

  // Check if user owns the todo or is admin
  if (todo.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (text !== undefined) {
    todos[todoIndex].text = text.trim();
    todos[todoIndex].updatedAt = new Date();
  }

  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
    todos[todoIndex].updatedAt = new Date();
  }

  res.json(todos[todoIndex]);
});

// DELETE /api/todos/:text - Delete todo by its text (only if user owns it or is admin)
app.delete('/api/todos/:text', authenticateToken, (req, res) => {
  const text = req.params.text;
  const todo = todos.find(todo => todo.text === text);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found: ' + text });
  }

  // Check if user owns the todo or is admin
  if (todo.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  todos = todos.filter(todo => todo.text !== text);
  res.status(204).send();
});

// DELETE /api/todos/completed - Delete all completed todos (filtered by user role)
app.delete('/api/todos/completed', authenticateToken, (req, res) => {
  const initialLength = todos.length;

  if (req.user.role === 'admin') {
    // Admin can clear all completed todos
    todos = todos.filter(todo => !todo.completed);
  } else {
    // Regular users can only clear their own completed todos
    todos = todos.filter(todo => !todo.completed || todo.userId !== req.user.id);
  }

  const deletedCount = initialLength - todos.length;
  res.json({ message: `${deletedCount} completed todos deleted` });
});

// PUT /api/todos/:id/reassign - Reassign todo to different user (admin only)
app.put('/api/todos/:id/reassign', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { userId } = req.body;

  // Only admins can reassign todos
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can reassign todos' });
  }

  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Validate that the target user exists
  const targetUser = users.find(u => u.id === userId);
  if (!targetUser) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  todos[todoIndex].userId = userId;
  todos[todoIndex].updatedAt = new Date();

  res.json(todos[todoIndex]);
});

// Admin Routes (admin only)

// GET /api/admin/users - Get all users (admin only)
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  res.json(users);
});

// PUT /api/admin/users/:id - Update user name or role (admin only)
app.put('/api/admin/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const id = parseInt(req.params.id);
  const { name, role } = req.body;

  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name !== undefined) {
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }
    users[userIndex].name = name.trim();
  }

  if (role !== undefined) {
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either "admin" or "user"' });
    }
    users[userIndex].role = role;
  }

  res.json(users[userIndex]);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
