const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.get('/', async (req, res) => {
    let token = req.query.token || req.cookies.access_token;

    if (!token) {
        return res.redirect("http://localhost:4000/login");
    }

    try {
        const { data } = await axios.get(
            "http://localhost:4000/api/validate?token=" + token
        );

        if (!data.valid) {
            return res.redirect("http://localhost:4000/login");
        }

        res.json({
            success: true,
            redirectUrl: `http://localhost:3001/?token=${accessToken}`
        });

    } catch (err) {
        return res.redirect("http://localhost:4000/login");
    }
});

app.listen(3001, () => console.log("My Service running on 3001"));
