const path = require('path');

const fastify = require('fastify')({
  logger: true,
});

const {
  initDatabase,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('./src/database');

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

fastify.register(require('point-of-view'), {
  engine: {
    pug: require('pug'),
  },
  root: path.join(__dirname, 'views'),
  viewExt: 'pug',
});

fastify.register(require('fastify-formbody'));

fastify.get('/', async (request, reply) => {
  return reply.redirect('/users');
});

fastify.get('/users', async (request, reply) => {
  const users = await getUsers();

  return reply.view('users.pug', {
    title: 'Пользователи',
    users,
  });
});

fastify.get('/users/create', async (request, reply) => {
  return reply.view('create-user.pug', {
    title: 'Создание пользователя',
    values: {},
  });
});

fastify.post('/users', async (request, reply) => {
  const { name = '', email = '' } = request.body;

  if (!name.trim() || !email.trim()) {
    return reply.code(400).view('create-user.pug', {
      title: 'Создание пользователя',
      error: 'Заполните имя и email',
      values: { name, email },
    });
  }

  await createUser({
    name: name.trim(),
    email: email.trim(),
  });

  return reply.redirect('/users');
});

fastify.get('/users/:id/edit', async (request, reply) => {
  const user = await getUserById(request.params.id);

  if (!user) {
    return reply.code(404).view('not-found.pug', {
      title: 'Пользователь не найден',
    });
  }

  return reply.view('edit-user.pug', {
    title: 'Редактирование пользователя',
    user,
  });
});

fastify.post('/users/:id', async (request, reply) => {
  const { name = '', email = '' } = request.body;
  const user = await getUserById(request.params.id);

  if (!user) {
    return reply.code(404).view('not-found.pug', {
      title: 'Пользователь не найден',
    });
  }

  if (!name.trim() || !email.trim()) {
    return reply.code(400).view('edit-user.pug', {
      title: 'Редактирование пользователя',
      error: 'Заполните имя и email',
      user: {
        id: user.id,
        name,
        email,
      },
    });
  }

  await updateUser(request.params.id, {
    name: name.trim(),
    email: email.trim(),
  });

  return reply.redirect('/users');
});

fastify.post('/users/:id/delete', async (request, reply) => {
  await deleteUser(request.params.id);

  return reply.redirect('/users');
});

const start = async () => {
  try {
    await initDatabase();

    const port = Number(process.env.PORT) || 3000;
    await fastify.listen(port, '0.0.0.0');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
