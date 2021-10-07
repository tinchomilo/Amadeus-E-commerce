const express = require('express');
const mercadopago = require("mercadopago");
const router = express.Router();
require('dotenv').config();
const { SERVER } = process.env


mercadopago.configure({
    access_token: 'APP_USR-6623451607855904-111502-1f258ab308efb0fb26345a2912a3cfa5-672708410'
  });

router.post('/checkout', (req, res) => {
   

    let preference = {
		
		items: [{
			title: req.body.name,
			unit_price: Number(req.body.price),
			quantity: Number(req.body.quantity),
			
		}],
		shipments:{
			cost: req.body.shipping
		},
		
		back_urls: {
			"success": `${SERVER}/orderdetail`,
			"failure": `${SERVER}/orderdetail`,
			"pending": `${SERVER}/orderdetail`
		},
		auto_return: 'approved',
        
	};

    mercadopago.preferences.create(preference)
		.then(function (response) {
			//trabajar con la respuesta de MP
            // console.log(response.body)
            global.id = response.body.id;
            res.send(response.body.init_point)
		}).catch(function (error) {
			console.log(error);
		});
        
})  

router.post('/cart', (req, res) => {
   
	 const { cartProducts, shipping }  = req.body
	 const arreglo =  cartProducts.map ((item)  => ({ 
					title: item.name,
					unit_price: Number(item.price),
					quantity: Number(item.quantity), 
	}))
	
	console.log('arreglo que viene por body', req.body)
	
		let preference = {
			
			items: arreglo,
			shipments:{
				cost: shipping
			},
			back_urls: {
				"success": `${SERVER}/orderdetail`,
				"failure": `${SERVER}/orderdetail`,
				"pending": `${SERVER}/orderdetail`
			},
			auto_return: 'approved',
			
		};
	
		mercadopago.preferences.create(preference)
			.then(function (response) {
				//trabajar con la respuesta de MP
				// console.log(response.body)
				global.id = response.body.id;
				res.send(response.body.init_point)
			}).catch(function (error) {
				console.log(error);
			});
			
	})  

router.get('/feedback' , ( req, res) => {
    const {payment_id, status, merchant_order_id} = req.query
    // console.log(req.query)
    res.send({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	})
})

module.exports = router;