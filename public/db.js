const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nume: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  parola: { type: String, required: true },
  dataInregistrare: { type: Date, default: Date.now }
});

// Middleware pre-save pentru hash-uirea parolei
userSchema.pre('save', function(next) {
  const user = this;

  // Doar hash-uirea parolei dacă a fost modificată sau este nouă
  if (!user.isModified('parola')) return next();

  bcrypt.hash(user.parola, 10, (err, hash) => {
    if (err) return next(err);
    user.parola = hash;
    next();
  });
});

const Utilizator = mongoose.model('Utilizator', userSchema);

// Exemplu de inserare a unui utilizator nou
const newUser = new Utilizator({
  nume: 'Ion Popescu',
  email: 'ion.popescu@example.com',
  parola: 'parola123'
});

newUser.save()
  .then(doc => console.log('Utilizator nou adăugat:', doc))
  .catch(err => console.error('Eroare la adăugarea utilizatorului:', err));

module.exports = Utilizator;
