const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The "/api/products" endpoint

router.get('/', async (req, res) => {
  // find all products
  try {
    const productData = await Product.findAll({
      include: [{model: Category}, {model: Tag}],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model: Tag}],
    });
    if (!productData) {
      res.status(404).json({message: "no such product exists"});
      return;
    };
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json({message: "error"});
  }
});

router.post('/', (req, res) => {
  // create new product
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update product data
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

      return res.json({message: "product updated"});
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productTagId = await Product.destroy({
      where: {id: req.params.id}
    })
    if (!productTagId) {
      res.status(404).json({message: "no tag with this id"});
      return;
    }
    res.status(200).json({message: "product deleted"});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
