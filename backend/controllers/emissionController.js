const Emission = require('../models/Emission');
const getEmission = async (req, res) => {
try {
const emission = await Emission.find({ userId: req.user.id });
res.json(emission);
} catch (error) {
res.status(500).json({ message: error.message });
}
}

const addEmission = async (req, res) => {
const { type, subtype, amount, unit, factor, note } = req.body;
try {
const carbon = amount * factor;
const emission = await Emission.create({ userId: req.user.id,type, subtype, amount, unit, factor, note  });
res.status(201).json(emission);
} catch (error) {
res.status(500).json({ message: error.message });
}
}

const updateEmission = async (req, res) => {
const { type, subtype, amount, unit, factor, note } = req.body;
try {
const emission = await Emission.findById(req.params.id);
if (!emission) return res.status(404).json({ message: 'Emission not found' });
    emission.type       = type       || emission.type;
    emission.subtype    = subtype    || emission.subtype;
    emission.amount     = amount     ?? emission.amount;
    emission.unit       = unit       || emission.unit;
    emission.factor     = factor     ?? emission.factor;
    emission.note       = note       || emission.note;
const updated = await emission.save();
res.json(updated);
} catch (error) {
res.status(500).json({ message: error.message });
}
}

const deleteEmission = async (req, res) => {try {
const emission = await Emission.findById(req.params.id);
if (!emission) return res.status(404).json({ message: 'Emission not found' });
await emission.remove();
res.json({ message: 'Emission deleted' });
} catch (error) {
res.status(500).json({ message: error.message });
}
};
module.exports = { getEmission, addEmission, updateEmission, deleteEmission };
