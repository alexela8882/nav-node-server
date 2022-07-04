var express = require('express');
const cors = require('cors');
var httpntlm = require('httpntlm');
var bodyParser = require("body-parser");
var router = express.Router();

var app = express()

var whitelist = [
  'http://localhost:8000',
  'http://uat.reddotcrm.com',
  'https://uat.reddotcrm.com',
  'https://reddotcrm.com'
]

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors(corsOptions))

var PORT = 4000;

router.get('/', function(req, res) {
    // res.status(200).send('Hello world');

    console.log("Fetching data. Please wait...")

    httpntlm.get({
      url: "http://LEKZPC:7048/DynamicsNAV100/ODataV4/Company('CRONUS%20International%20Ltd.')",
      username: 'Admin',
      password: 'acf0106',
      workstation: '',
      domain: ''
    }, function (err, response){
      if(err) {
        console.log(err);
        return err;
      }

      res.writeHead(200, { "Content-type": "application/json" });
      res.end(response.body);

      console.log("Data fetch!")
    });
});

router.post('/post', function(req, res) {
  console.log("Fetching data. Please wait...");
  // console.log(req.body)

  var url = req.body.url
  var username = req.body.username
  var password = req.body.password

  httpntlm.get({
    url: url,
    username: username,
    password: password,
    workstation: '',
    domain: ''
  }, function (err, response){
    if(err) {
      console.log(err);
      return err;
    }

    res.writeHead(200, { "Content-type": "application/json" });
    res.end(response.body);

    let data = response.body ? response.body : 'Failed to fetch data!'

    console.log(data);

    if (response.body) console.log("Data fetch!");
  });
});

app.use("/", router);

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});