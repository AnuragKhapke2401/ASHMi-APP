const express = require('express');
const router = express.Router();
const profileController = require('../controllers/viewProfileController');

router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);

module.exports = router;
