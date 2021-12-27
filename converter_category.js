const Restaurant = require('./models/Restaurant');
Restaurant.find({},(err,restaurants)=>{
    restaurants.forEach(restaurant=>{
        restaurant.category.split('/')
    })
})