const express = require('express');
const app = express();
const port = process.env.port || 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const { default: validator } = require('validator');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser('key-word'));
app.use(session({
    secret: 'bruce',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));
app.use(flash());


app.get('/', (req, res) => {
    
    let emailError = req.flash('emailError');
    let nomeError = req.flash('nomeError');
    let pontosError = req.flash('pontosError');

    let email = req.flash('email');
    let nome = req.flash('nome');
    let pontos = req.flash('pontos');

    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError;
    nomeError = (nomeError == undefined || nomeError.length == 0) ? undefined : nomeError;
    pontosError = (pontosError == undefined || pontosError.length == 0) ? undefined : pontosError;

    email = (email == undefined || email.length == 0) ? '' : email;
    nome = (nome == undefined || nome.length == 0) ? '' : nome;
    pontos = (pontos == undefined || pontos.length == 0) ? '' : pontos;
    
    res.render('index', {emailError, nomeError, pontosError, email, nome, pontos});

});


app.post('/form', (req, res) => {

    let {email, nome, pontos} = req.body;
    let emailError, nomeError, pontosError;

    if(email == undefined || email == '' || !validator.isEmail(email)){
        emailError = 'E-mail inválido!';
    }

    if(nome == undefined || nome == ''){
        nomeError = 'Nome inválido!';
    }

    if(pontos == undefined || pontos == '' || pontos < 0){
        pontosError = 'Pontos inválido!';
    }

    if(emailError != undefined || nomeError != undefined || pontosError != undefined){
        
        req.flash('emailError', emailError);
        req.flash('nomeError', nomeError);
        req.flash('pontosError', pontosError);

        req.flash('email', email);
        req.flash('nome', nome);
        req.flash('pontos', pontos);

        res.redirect('/');

    }else{
        res.send('Tudo certo');
    }

});




app.listen(port, () => {
    console.log('This server is running on port: ' + port);
});