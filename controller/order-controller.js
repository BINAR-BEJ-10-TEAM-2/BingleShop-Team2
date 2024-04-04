const { Order } = require('../models');
const { ResponseError } = require('../error/response-error');


const createOrder = async (req, res, next) => {
    try {
        const orders = new Order();
        orders.address_to = req.body.address_to;
        orders.quantity = req.body.quantity;
        orders.status = 'pending';

        console.log('CHECKED => ', orders);
        await orders.save();

        return res.json({
            success: 1,
            message: 'ORDER_CREATED',
            data: {
                id: orders.id,
                address_to: orders.address_to,
                quantity: orders.quantity,
                status: orders.status,
            },
        });
    } catch (error) {
        next(error);
    }
};

const putOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;

        const orders = Order;
        orders.status = 'completed';

        // console.log("ORDER_ID",req)
        const orderIndex = await Order.findOne({ where: { id: orderId } });
        console.log('INI ORDER INDEX', orderIndex);
        if (!orderIndex) {
            // await orders.save();
            return res.send('ORDER_NOT_FOUND');
        }
        await orders.update(
            { status: orders.status },
            {
                where: {
                    id: orderId,
                },
            }
        );
        return res.send('ORDER_UPDATED');
    } catch (error) {
        next(error)
    }

};

module.exports = { createOrder, putOrder };
