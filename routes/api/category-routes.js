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

router.put('/:id', (req, res) => {
  // update a category by its `id` value
    Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
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
    res.status(500).json({message: "error"});
  }
});

module.exports = router;
