const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}))

app.get("/", (req, res) => {
    res.render("index");
});
 
app.get("/users/register", (req, res) => {
    res.render("register");
});

app.get("/users/login", (req, res) => {
    res.render("login");
})

app.get("/users/dashboard", (req, res) => {
    res.render("dashboard", { user: "Axel"});
});

app.post("/users/register", async (req, res) => {
    let { name, email, password, password2 } = req.body;
    console.log({ name, email, password, password2 });
    
    let errors = [];
    if(!name || !email || !password || !password2) {
        errors.push({message: "Please enter all fields."});
    }

    if(password.length < 6) {
        errors.push({message: "Password should be at least 6 characters."});
    }

    if(password != password2) {
        errors.push({message: "Passwords do not match."});
    }

    if(errors.length > 0) {
        res.render("register", { errors });
    } else {
        // Form validation passed(bring in bcrypt)
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(`SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
            if (err) {
                throw err;
            }
            console.log(results.rows);

            if (results.rows.length > 0) {
                errors.push({message: "Email already registered."});
                res.render("register", { errors })
            }
        });
    }
});
 
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}.`);
});
