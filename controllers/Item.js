import Items from '../models/itemModel.js';
import fs from 'fs-extra';
import path from 'path';

export const getItem = async (req, res) => {
  try {
    const item = await Items.findAll({
      attributes: ['id', 'name', 'type', 'image', 'howtokeep'],
    });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).send(`Error, ${error}`);
  }
};

export const addItem = async (req, res) => {
  const { name, type, howtokeep } = req.body;

  if (!req.file) {
    return res.status(404).send('Image field must be filled!');
  }

  if (!name || !type || !howtokeep) {
    return res.status(404).send('All field must be filled!');
  }

  try {
    await Items.create({
      name: name,
      type: type,
      image: `uploads/${req.file.filename}`,
      howtokeep: howtokeep,
    });
    res.status(201).send('New item has been created!');
  } catch (error) {
    res.status(500).send(`Error, ${error}`);
  }
};

export const deleteItem = async (req, res) => {
  const findItem = await Items.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!findItem) {
    return res.status(404).send('Item is not found!');
  }

  try {
    await fs.unlink(path.join(`public/${findItem.image}`));

    await Items.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send('Item was deleted!');
  } catch (error) {
    res.status(500).send(`Error, ${error}`);
  }
};
