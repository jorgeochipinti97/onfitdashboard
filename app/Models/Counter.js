const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

// Comprueba si el modelo ya existe, para prevenir errores de recompilación
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

export default Counter;