const Task = require('../models/Task');
const getTasks = async (req, res) => {
try {
const tasks = await Task.find({ userId: req.user.id });
res.json(tasks);
} catch (error) {
res.status(500).json({ message: error.message });
}
}