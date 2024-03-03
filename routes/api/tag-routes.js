const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Not currently getting the required data for Tags
// Need the model Product to be included
router.get('/', async (req, res) => {
  // find all tags
  try {
  const tagData = await Tag.findAll({
    inculde: [{model: Product}]
  });
  res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product}]
    });
    if (!tagData) {
      res.status(404).json({message: "no such item exists"});
      return;
    };
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({message: "error"});
  }
  // be sure to include its associated Product data
});

// Still to do: all items below:

// .then template
router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
  .then(tag => {
    if(!req.body){
      res.json("You must have a body")
    }
    res.json(tag)
  })
  .catch(err => res.json(err))
});

// Try/catch template
// router.post('/', async (req, res) => {
//   // create a new tag
//   try {
//     const tag = Tag.create(req.body)
//     if(!req.body){
//       res.json("You must have a body")
//     }
//     res.json(tag)
//   } catch(err) {
//     res.json(err)
//   }
// });

// router.put('/:id', (req, res) => {
//   // update a tag's name by its `id` value
//   Tag.update(req.body. {
//     where: {
//       req.params.id,
//     },
//   })
//   .then(tag => {
//     if (req.body.)
//   })
// });

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
