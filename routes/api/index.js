const router = require('express').Router();
const thuoghtRoutes = require('./thought-routes');
const userRoutes = require('./user-routes');

router.use('/thoughts', thuoghtRoutes);

router.use('/users', userRoutes);

module.exports = router;