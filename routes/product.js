const router = require('express').Router();
const Product = require('.././models/Product');
const { verifyTokenAndAuthrization, verifyTokenAndAdmin } = require('./verifyToken');


//create
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error)
    }
})

//update
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Delete Successfully');
    } catch (err) {
        res.status(500).json(err);
    }
});

//get
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all products
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
           products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
           products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            });
        } else {
           products = await Product.find().sort({ createdAt: -1 });
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get user stats

// router.get('/stats',verifyTokenAndAdmin, async (req, res) => {
//     const date  = new Date();
//     const lastyear  = new Date(date.setFullYear(date.getFullYear() - 1));

//     try {
//         const data  = await User.aggregate([
//             {
//                 $match: {
//                     createdAt: {
//                         $gt: lastyear
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     month: {$month: '$createdAt'}
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$month',
//                     total: {$sum : 1}
//                 }
//             }
//         ])

//         res.status(200).json(data);
//     } catch (err) {
//         res.status(500).json(err)
//     }

// })
module.exports = router;