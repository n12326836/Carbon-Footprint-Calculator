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
const { type, amount, unit, factor, note } = req.body;
try {
const amt = Number(amount ?? 0);
const fac = Number(factor ?? 0);
const carbon = amt * fac;
const emission = await Emission.create({ userId: req.user.id,type, amount:amt, unit, factor:fac, note,carbon });
res.status(201).json(emission);
} catch (error) {
res.status(500).json({ message: error.message });
}
}

const updateEmission = async (req, res) => {
const { type, amount, unit, factor, note } = req.body;
try {
const emission = await Emission.findById(req.params.id);
if (!emission) return res.status(404).json({ message: 'Emission not found' });
    emission.type       = type       || emission.type;
    if (amount !== undefined) emission.amount = Number(amount);
    emission.unit       = unit       || emission.unit;
    if (factor !== undefined) emission.factor = Number(factor);
    emission.note       = note       || emission.note;
    emission.carbon = Number(emission.amount || 0) * Number(emission.factor || 0);

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
