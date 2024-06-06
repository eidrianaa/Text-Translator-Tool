const express = require('express');
const router = express.Router();
const User = require('./models/User');  // Asigură-te că calea către modelul User este corectă

// Ruta pentru a obține toți utilizatorii
router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      res.status(500).send(error);
    }
});

// Ruta pentru a crea un utilizator nou
router.post('/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
});

module.exports = router;
