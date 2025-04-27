const express = require('express');
const router = express.Router();
const loginUser = require('../controllers/loginControllerV2');

router.post('/login', loginUser);

module.exports = router;
