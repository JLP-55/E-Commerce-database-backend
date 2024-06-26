const router = require('express').Router();
const { Category, Product } = require('../../models');

// The "/api/categories" endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll({
      include: [{model: Product}],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({message: "error"});
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{model: Product}, /*{model: Tags}*/],
    });
    if (!categoryData) {
      res.status(404).json({message: "no such category exists"});
      return;
    };
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name,
    })
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({message: "error"});
  }
});

router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      } 
    });
    if (!categoryData) {
      res.status(202).json({message: "no such category exists"});
    }
    res.status(200).json({message: "category updated"});
  } catch (err) {
    res.status(500).json(err);
  };
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryData) {
      res.status(404).json({message: "no such category exists"});
      return;
    }

    res.status(200).json({message: "category deleted"});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
