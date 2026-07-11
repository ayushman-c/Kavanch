process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/kavach_test';
process.env.LOG_LEVEL = 'silent';
process.env.PORT = '0';

const mongoose = require('mongoose');
mongoose.set('bufferTimeoutMS', 1000);
