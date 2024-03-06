const router = require('express').Router();
const { Category, Product } = require('../../models');

// Just some helpfull notes:
// - We have defined the relationship between models in all files in the "models" folder.
// - .findAll and then include: "model" is enough for sequielize to figure out the relationship between models.
// - you have to send a response to the user, that is how it works. REQUEST, RESPONSE... and so on.

// The `/api/categories` endpoint

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
  // be sure to include its associated Products
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
    res.status(500).json({message: "error"});
  }
  // be sure to include its associated Products
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

// all you need is the "id": "number", for the insomnia request
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
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  };
  // update a category by its `id` value
    // Category.update(req.body, {
    //   where : {
    //     id: req.params.id,
    //   },
    // })
    // .then((categoryId) => {
    //   Category.findAll({
    //     where: {category: req.params.id}
    //   }).then((category) => {
    //     // create filtered list of new category...
    //     const 
    //   })
    // })
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

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
