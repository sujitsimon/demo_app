const express = require('express');
const { io } = require("socket.io-client");
const multer = require("multer");
var cors = require('cors');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
const PORT = 8080;
const io_client = io('http://127.0.0.1:5000')
io_client.connect({ autoConnect: true });
let result = undefined;

const whitelist = ['http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://localhost:3001', 'http://localhost:3000']

var corsOption = {
    origin : function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not Allowed'));
        }
    }
}
app.use(cors(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.use(cors(corsOption));
app.options("*", cors(corsOption));


const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload_path");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "csv") {
        cb(null, true);
    } else {
        cb(new Error("Not a CSV File!!"), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

app.post('/upload', upload.single('data_file'), (req, res) => {
    console.log(req.file.filename);
    io_client.emit('handle_upload', req.file.filename)
    res.sendStatus(200);
});

app.get('/graph_data', (req, res) => {
    res.json(result);
})


io_client.on('connected', () => {
    console.log('Connected to Client');
});

io_client.on('fit_data', (data) => {
    console.log('received fit data');
    console.log(data);
    result = data;
})

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
});
