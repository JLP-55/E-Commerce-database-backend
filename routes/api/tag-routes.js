const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The "/api/tags" endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
  const tagData = await Tag.findAll({
    include: [
      {
        model: Product,
          through: ProductTag,
      }
    ]
  });
  res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
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
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create({
      tag_name: req.body.tag_name,
    });
    if(!req.body){
      res.json("You must have a body")
    };
    res.status(200).json(tagData)
    console.log(tagData)
  } catch(err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({message: "tag updated"});
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(202).json({message: "no such tag exists"});
    };
    res.status(200).json({message: "tag deleted"});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
