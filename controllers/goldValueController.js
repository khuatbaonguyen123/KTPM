import { GoldValue, GoldType } from '../models/index.js';
import sequelize from '../database.js'; 
import { getIO } from '../socket.js';

export const upsertGoldValue = async (req, res) => {
  const { day, gold_type_name, buy_value, sell_value } = req.body;

  if (!day || !gold_type_name) {
    return res.status(400).json({ error: 'Day and gold type name are required.' });
  }

  try {
    const goldType = await GoldType.findOne({ where: { name: gold_type_name } });

    if (!goldType) {
      return res.status(404).json({ error: `Gold type '${gold_type_name}' not found.` });
    }

    const [record, created] = await GoldValue.upsert({
      day,
      gold_type_id: goldType.id,
      buy_value,
      sell_value,
      updated_at: new Date()
    }, {
      returning: true
    });

    // Emit the change to all clients
    const io = getIO();
    io.emit("gold_value_updated", record);

    res.status(created ? 201 : 200).json({
      message: created ? 'Created new gold value.' : 'Updated existing gold value.',
      data: record
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGoldValuesByDay = async (req, res) => {
  const { day } = req.query;

  if (!day) {
    return res.status(400).json({ error: 'Missing required query parameter: day' });
  }

  try {
    const results = await sequelize.query(
      `
      SELECT 
        gt.name AS gold_type_name,
        gv.buy_value,
        gv.sell_value,
        gv.updated_at
      FROM gold_value gv
      JOIN gold_type gt ON gv.gold_type_id = gt.id
      WHERE gv.day = :day
      `,
      {
        replacements: { day },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllGoldValues = async (req, res) => {
  const values = await GoldValue.findAll();
  res.json(values);
};

export const getGoldValueById = async (req, res) => {
  const { id } = req.params;
  const value = await GoldValue.findByPk(id);
  value ? res.json(value) : res.status(404).json({ error: 'Not found' });
};

export const deleteGoldValue = async (req, res) => {
  const { id } = req.params;
  try {
    await GoldValue.destroy({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
