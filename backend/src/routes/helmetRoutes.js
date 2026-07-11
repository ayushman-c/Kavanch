const { Router } = require('express');
const {
  registerHelmet,
  getAllHelmets,
  getHelmetById,
  updateHelmet,
} = require('../controllers/helmetController');
const {
  validateRegisterHelmet,
  validateUpdateHelmet,
} = require('../validators/helmetValidator');

const router = Router();

router.post('/', validateRegisterHelmet, registerHelmet);
router.get('/', getAllHelmets);
router.get('/:helmetId', getHelmetById);
router.put('/:helmetId', validateUpdateHelmet, updateHelmet);

module.exports = router;
