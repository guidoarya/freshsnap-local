import History from '../models/historyModel.js';
import fs from 'fs-extra';
import path from 'path';

export const getHistory = async (req, res) => {
  try {
    const history = await History.findAll({
      attributes: [
        'id',
        'user_name',
        'location',
        'item_name',
        'createdAt',
        'image',
      ],
    });
    res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ msg: `Error, ${error}` });
  }
};

export const addHistory = async (req, res) => {
  const { user_name, item_name, location } = req.body;

  if (!req.file) {
    return res.status(404).send('Image field must be filled!');
  }

  if (!user_name || !location || !item_name) {
    return res.status(404).send('All field must be filled!');
  }

  try {
    await History.create({
      user_name: user_name,
      item_name: item_name,
      location: location,
      image: `uploads/${req.file.filename}`,
    });
    res.status(201).send('New history has been created!');
  } catch (error) {
    res.status(500).send(`Error, ${error}`);
  }
};

export const deleteHistory = async (req, res) => {
  const findHistory = await History.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!findHistory) {
    return res.status(404).send('History is not found!');
  }

  try {
    await fs.unlink(path.join(`public/${findHistory.image}`));
    await History.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send('History was deleted!');
  } catch (error) {
    res.status(500).send(`Error, ${error}`);
  }
};
