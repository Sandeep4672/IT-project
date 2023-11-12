const path = require('path');


const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.listen(3000,function(){
    console.log('Server started at 3000');
})
