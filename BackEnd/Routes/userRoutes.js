const express = require('express');
const router = express.Router();
const { signup, signin } = require('../Controller/userController')

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;