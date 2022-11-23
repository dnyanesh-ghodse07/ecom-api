const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const authUser = require('./routes/auth');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('connected to DB')
}).catch(err => console.log(err));

app.use('/api/auth', authUser);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);


app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port 4000')
})