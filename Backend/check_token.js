const jwt = require('jsonwebtoken');
console.log(jwt.sign({ id: 'some-id', email: 'superadmin@educore.com', role: 'SUPER_ADMIN' }, 'test-secret', { expiresIn: '1h' }));
