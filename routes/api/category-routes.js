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

// This route currently doesn't work.
router.put('/:id', (req, res) => {
  // update a category by its `id` value
    Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        Product.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const product = productTags.map(({ product_id }) => product_id);
          const newProduct = req.body.tagIds
          .filter((product_id) => !product.includes(product_id))
          .map((product_id) => {
            return {
              product_id: req.params.id,
              product_id,
            };
          });

            // figure out which ones to remove
          const productsToRemove = productTags
          .filter(({ product_id }) => !req.body.tagIds.includes(product_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            Product.destroy({ where: { id: productsToRemove } }),
            Product.bulkCreate(newProduct),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
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
