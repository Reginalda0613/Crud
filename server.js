const express = require('express') 
const bodyParser = require('body-parser')
const app = express();

//conexão com banco 

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://dbUser:Reginalda012:forceline@CrudNode.4duii.gcp.mongodb.net/Unifacs?retryWrites=true&w=majority";

const uri="mongodb+srv://Reginalda012:forceline@CrudNode.4duii.gcp.mongodb.net/Unifacs?retryWrites=true&w=majority";
MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('Unifacs') // coloque o nome do seu DB

    app.listen(3000, () => {
        console.log('Server running on port 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
//Implementação para informar o servidor o que deve fazer
app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.get('/', (req, res) => {
    let cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
        db.collection('data').find().toArray((err, results) => {
            console.log(results)
        })
    })
})
//Rota para o roteamento de solicitação
app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id
  db.collection('data').find(ObjectId(id)).toArray(
      (err, result) => {
    if (err) return console.log(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    var telefone = req.body.telefone
    var cpf = req.body.cpf
   
    db.collection('data').updateOne(
        {
            _id: ObjectId(id)
        }, 
        {
            $set: {
              name: name,
              surname: surname,
              telefone: telefone,
              cpf: cpf
      }
    }, (err, result) => {
      if (err) return console.log(err)
      res.redirect('/show')
      console.log('Atualizado no Banco de Dados')
    })
  })
  app.route('/delete/:id')
  .get((req, res) => {
  var id = req.params.id
 
  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})

