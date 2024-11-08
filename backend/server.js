const express=require('express')
const mysql = require('mysql2');
const cors = require('cors');


const app=express()
app.use(cors());
app.use(express.json()); 


const db=mysql.createConnection({
    host:'localhost',
    user:'priya',
    password:'123@asd',
    database:'data'
})



db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});



const PORT= 5000

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})



app.get('/data', (req, res) => {
    db.query('select * from dataTable', (err, results) => {
      if(err){
        return res.status(400).json("Data not found")
      }
      res.json(results);
    });
  });




app.get('/fetchData',  (req, res) => {
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
        return res.status(400).json({ "errort": "Please provide both fromDate and toDate." });
    }

    
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/; 
    if (!dateFormat.test(fromDate) || !dateFormat.test(toDate)) {
        return res.status(400).json({"error":"Invalid date format. Please use YYYY-MM-DD." });
    
    }

    if (fromDate> toDate) {
        return res.status(400).json({ "error": "'From Date' cannot be after 'To Date'." });
    }


    db.query(`SELECT * FROM dataTable WHERE DATE(created_datetime) BETWEEN ? AND ?;`, [fromDate, toDate], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "An error occurred while fetching data." });
        }
        res.json(results);
    });
});


