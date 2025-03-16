const https = require('https');
const fs = require('fs').promises;
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

/**
 * @typedef {{ id: number, title: string, description: string, completed: boolean, createdAt: string, updatedAt?: string }} Todo
 */

const loadData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw new Error(`Failed to load data: ${error.message}`);
  }
};

const saveData = async (data) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`Failed to save data: ${error.message}`);
  }
};

const sendResponse = (res, statusCode, data = null, message = '') => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    success: statusCode < 400,
    message,
    data
  }));
};

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req
      .on('data', (chunk) => (body += chunk))
      .on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (error) {
          reject(new Error('Invalid JSON in request body'));
        }
      })
      .on('error', (error) => reject(error));
  });
};

const validateTodoBody = (body, isPartial = false) => {
  const errors = [];
  if (!isPartial) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      errors.push('Title is required and must be a string with at least 3 characters');
    }
    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 5) {
      errors.push('Description is required and must be a string with at least 5 characters');
    }
  } else {
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length < 3)) {
      errors.push('Title must be a string with at least 3 characters if provided');
    }
    if (body.description !== undefined && (typeof body.description !== 'string' || body.description.trim().length < 5)) {
      errors.push('Description must be a string with at least 5 characters if provided');
    }
  }
  if (body.completed !== undefined && typeof body.completed !== 'boolean') {
    errors.push('Completed must be a boolean if provided');
  }
  return errors;
};

const validateId = (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    return 'Invalid ID: must be a positive integer';
  }
  return null;
};

const requestHandler = async (req, res) => {
  try {
    const { method, url } = req;
    const todos = await loadData();

    if (!url.startsWith('/todos')) {
      return sendResponse(res, 404, null, 'Route not found. Use /todos or /todos/:id');
    }

    if (url === '/todos') {
      switch (method) {
        case 'GET':
          sendResponse(res, 200, todos, 'Todos retrieved successfully');
          return;
        case 'POST':
          const postBody = await parseBody(req);
          const postErrors = validateTodoBody(postBody);
          if (postErrors.length > 0) {
            return sendResponse(res, 400, null, postErrors.join(', '));
          }
          const newTodo = {
            id: Date.now(),
            title: postBody.title.trim(),
            description: postBody.description.trim(),
            completed: false,
            createdAt: new Date().toISOString()
          };
          todos.push(newTodo);
          await saveData(todos);
          sendResponse(res, 201, newTodo, 'Todo created successfully');
          return;
        default:
          sendResponse(res, 405, null, `Method ${method} not allowed on ${url}`);
          return;
      }
    }

    const urlParts = url.split('/');
    if (urlParts.length === 3 && urlParts[1] === 'todos') {
      const id = urlParts[2];
      const idError = validateId(id);
      if (idError) {
        return sendResponse(res, 400, null, idError);
      }

      const parsedId = parseInt(id, 10);
      const todoIndex = todos.findIndex((todo) => todo.id === parsedId);
      if (todoIndex === -1) {
        return sendResponse(res, 404, null, `Todo with ID ${parsedId} not found`);
      }

      switch (method) {
        case 'GET':
          sendResponse(res, 200, todos[todoIndex], 'Todo retrieved successfully');
          return;
        case 'PUT':
          const putBody = await parseBody(req);
          const putErrors = validateTodoBody(putBody, true);
          if (putErrors.length > 0) {
            return sendResponse(res, 400, null, putErrors.join(', '));
          }
          todos[todoIndex] = {
            ...todos[todoIndex],
            ...(putBody.title && { title: putBody.title.trim() }),
            ...(putBody.description && { description: putBody.description.trim() }),
            ...(putBody.completed !== undefined && { completed: putBody.completed }),
            updatedAt: new Date().toISOString()
          };
          await saveData(todos);
          sendResponse(res, 200, todos[todoIndex], 'Todo updated successfully');
          return;
        case 'PATCH':
          const patchBody = await parseBody(req);
          if (patchBody.completed === undefined || typeof patchBody.completed !== 'boolean') {
            return sendResponse(res, 400, null, 'Completed status must be a boolean');
          }
          todos[todoIndex] = {
            ...todos[todoIndex],
            completed: patchBody.completed,
            updatedAt: new Date().toISOString()
          };
          await saveData(todos);
          sendResponse(res, 200, todos[todoIndex], 'Todo completion status updated');
          return;
        case 'DELETE':
          todos.splice(todoIndex, 1);
          await saveData(todos);
          sendResponse(res, 204, null, 'Todo deleted successfully');
          return;
        default:
          sendResponse(res, 405, null, `Method ${method} not allowed on ${url}`);
          return;
      }
    }

    sendResponse(res, 404, null, 'Route not found');

  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    sendResponse(res, 500, null, `Server error: ${error.message}`);
  }
};

// Create HTTPS server
const startServer = async () => {
  try {
    const sslOptions = {
      key: await fs.readFile(path.join(__dirname, 'certs', 'server.key')),
      cert: await fs.readFile(path.join(__dirname, 'certs', 'server.crt'))
    };

    const server = https.createServer(sslOptions, requestHandler);

    server.listen(PORT, () => {
      console.log(`HTTPS Server running on port ${PORT}`);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();