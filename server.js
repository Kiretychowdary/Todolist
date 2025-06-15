const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const ListModel = require('./models/list');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nmkrspvlidata', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.delete("/deleteTask", async (req, res) => {
    let id = req.body.id;
    await ListModel.findByIdAndDelete(id);
})
app.get("/", (req, res) => {
    res.send("RADHAKRISHNANMKRSPVLIDAATA");
})
app.get("/getTask", async (req, res) => {
    const list = await ListModel.find()
    console.log("List fetched successfully:", list);
    res.status(200).send(list);
})
app.delete("/deleteAll", async (req, res) => {
    try {
        await ListModel.deleteMany({});
        console.log("All tasks deleted successfully");
    }
    catch (err) {
        console.error("Error deleting tasks:", err);
        res.status(500).send("Error deleting tasks");
    }
});
app.post("/postTask", (req, res) => {
    // res.send("Hello from NMKRSPVLIDAATA");
    const { title, description } = req.body;
    console.log("Title:", title);
    console.log("Description:", description);
    list = new ListModel({
        title: title,
        description: description
    });
    list.save()
        .then(() => {
            console.log("Data saved successfully");
            res.status(200).send("Data saved successfully");
        })
        .catch((err) => {
            console.error("Error saving data:", err);
            res.status(500).send("Error saving data");
        });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});