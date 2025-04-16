import { GoldValue, GoldType } from '../models/index.js';
import sequelize from '../database.js'; 
import { QueryTypes } from 'sequelize';

export const createGoldValue = async (req, res) => {
  try {
    const { sell_value, buy_value, day, gold_type_name } = req.body;

    if (!sell_value || !buy_value || !day || !gold_type_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const goldType = await GoldType.findOne({ where: { name: gold_type_name } });

    if (!goldType) {
      return res.status(404).json({ error: 'Gold type not found' });
    }

    const newGoldValue = await GoldValue.create({
      sell_value,
      buy_value,
      day,
      gold_type_id: goldType.id,
      updated_at: new Date()
    });

    res.status(201).json(newGoldValue);
  } catch (error) {
    console.error('Create Gold Value Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all gold values, optionally filtered by day and gold_type_name
export const getAllGoldValues = async (req, res) => {
  try {
    const { day, gold_type_name } = req.query;

    // Construct the where clause for optional filters
    const where = {};
    if (day) {
      where.day = day; // Filter by day if provided
    }
    if (gold_type_name) {
      const goldType = await GoldType.findOne({ where: { name: gold_type_name } });
      if (!goldType) return res.status(404).json({ error: 'Gold type not found' });
      where.gold_type_id = goldType.id; // Filter by gold type name if provided
    }

    const values = await GoldValue.findAll({ where });
    res.json(values);
  } catch (error) {
    console.error('Get All Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get the latest gold value by gold type name
export const getLatestGoldValueByTypeName = async (req, res) => {
  try {
    const { gold_type_name } = req.query;

    if (!gold_type_name) {
      return res.status(400).json({ error: 'Gold type name is required' });
    }

    const goldType = await GoldType.findOne({ where: { name: gold_type_name } });

    if (!goldType) {
      return res.status(404).json({ error: 'Gold type not found' });
    }

    const latestValue = await GoldValue.findOne({
      where: { gold_type_id: goldType.id },
      order: [['day', 'DESC']],
    });

    if (!latestValue) {
      return res.status(404).json({ error: 'No values found for this gold type' });
    }

    res.json({
      gold_type: gold_type_name,
      sell_value: latestValue.sell_value,
      buy_value: latestValue.buy_value,
      day: latestValue.day,
      last_updated: latestValue.updated_at,
    });
  } catch (error) {
    console.error('Error fetching latest gold value:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLatestGoldValueForAllTypesByDay = async (req, res) => {
  try {
    const { day } = req.query;

    if (!day) {
      return res.status(400).json({ error: 'Day is required (YYYY-MM-DD)' });
    }

    const results = await sequelize.query(
      `
      SELECT gv.gold_type_id, gt.name AS gold_type_name, gv.sell_value, gv.buy_value, gv.day, gv.updated_at AS last_updated
      FROM gold_values gv
      JOIN gold_types gt ON gv.gold_type_id = gt.id
      WHERE gv.day = :day
      AND gv.updated_at = (
        SELECT MAX(updated_at)
        FROM gold_values
        WHERE gold_type_id = gv.gold_type_id AND day = :day
      )
      `,
      {
        replacements: { day },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No gold values found for the specified day' });
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching latest gold values for all types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const updateGoldValue = async (req, res) => {
  try {
    const { id } = req.params;
    const { sell_value, buy_value, day, gold_type_name } = req.body;

    const goldValue = await GoldValue.findByPk(id);
    if (!goldValue) {
      return res.status(404).json({ error: 'Gold value not found' });
    }

    let gold_type_id = goldValue.gold_type_id;

    if (gold_type_name) {
      let goldType = await GoldType.findOne({ where: { name: gold_type_name } });

      // If gold type doesn't exist, create a new one
      if (!goldType) {
        goldType = await GoldType.create({ name: gold_type_name });
      }

      gold_type_id = goldType.id;
    }

    await goldValue.update({
      sell_value: sell_value ?? goldValue.sell_value,
      buy_value: buy_value ?? goldValue.buy_value,
      day: day ?? goldValue.day,
      gold_type_id,
      updated_at: new Date()
    });

    res.json(goldValue);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  
export const deleteGoldValue = async (req, res) => {
    try {
      const { id } = req.params;
  
      const goldValue = await GoldValue.findByPk(id);
      if (!goldValue) {
        return res.status(404).json({ error: 'Gold value not found' });
      }
  
      await goldValue.destroy();
      res.json({ message: 'Gold value deleted successfully' });
    } catch (error) {
      console.error('Delete Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  