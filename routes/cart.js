const router = require('express').Router();
const Cart = require('.././models/Cart');
const { verifyTokenAndAuthrization, verifyTokenAndAdmin, verifyToken } = require('./verifyToken');


//create cart
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error)
    }
})

//update
router.put('/:id', verifyTokenAndAuthrization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// //delete
router.delete('/:id', verifyTokenAndAuthrization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Delete Successfully');
    } catch (err) {
        res.status(500).json(err);
    }
});

// get user cart
router.get('/find/:userId', verifyTokenAndAuthrization ,async (req, res) => {
    try {
        const cart = await Cart.findOne({userId :req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get all
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const cart = await Cart.find();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;