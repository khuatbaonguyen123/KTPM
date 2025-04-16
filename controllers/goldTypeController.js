import { GoldType } from '../models/index.js'; 

// Create GoldType
export const createGoldType = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate if the name is provided
    if (!name) {
      return res.status(400).json({ error: 'Gold Type name is required' });
    }

    // Check if the GoldType already exists
    const existingGoldType = await GoldType.findOne({ where: { name } });
    if (existingGoldType) {
      return res.status(400).json({ error: 'Gold Type with this name already exists' });
    }

    // Create a new GoldType
    const newGoldType = await GoldType.create({ name });
    res.status(201).json(newGoldType);
  } catch (error) {
    console.error('Create GoldType Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all GoldTypes
export const getAllGoldTypes = async (req, res) => {
  try {
    const goldTypes = await GoldType.findAll();
    
    if (!goldTypes.length) {
      return res.status(404).json({ error: 'No gold types found' });
    }

    res.json(goldTypes);
  } catch (error) {
    console.error('Get All GoldTypes Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get GoldType by name
export const getGoldTypeByName = async (req, res) => {
  try {
    const { name } = req.query; // Get name from query parameter

    if (!name) {
      return res.status(400).json({ error: 'Gold Type name is required' });
    }

    const goldType = await GoldType.findOne({ where: { name } });

    if (!goldType) {
      return res.status(404).json({ error: 'Gold Type not found' });
    }

    res.json(goldType);
  } catch (error) {
    console.error('Get GoldType by Name Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update GoldType by ID
export const updateGoldTypeName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'New name is required' });
    }

    const goldType = await GoldType.findByPk(id);

    if (!goldType) {
      return res.status(404).json({ error: 'Gold Type not found' });
    }

    // Update the name
    goldType.name = name;
    await goldType.save();

    res.json(goldType);
  } catch (error) {
    console.error('Update GoldType Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete GoldType by ID
export const deleteGoldType = async (req, res) => {
  try {
    const { id } = req.params;

    const goldType = await GoldType.findByPk(id);

    if (!goldType) {
      return res.status(404).json({ error: 'Gold Type not found' });
    }

    await goldType.destroy();
    res.status(204).json({ message: 'Gold Type deleted successfully' });
  } catch (error) {
    console.error('Delete GoldType Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
