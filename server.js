const express = require("express");
const axios = require("axios");

const app = express();

const CLIENT_ID = "1469761209170526323";
const CLIENT_SECRET = "7EA3IqlBWDy33s7AtFdNvV0YJuXFQELt";
const REDIRECT_URI = "https://dclogin.onrender.com/callback";

let lastUser = null;

// LOGIN REDIRECT
app.get("/login",(req,res)=>{
    res.redirect(
`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=identify`
    );
});

// CALLBACK
app.get("/callback", async (req,res)=>{

    const code = req.query.code;

    try{

        const params = new URLSearchParams();
        params.append("client_id",CLIENT_ID);
        params.append("client_secret",CLIENT_SECRET);
        params.append("grant_type","authorization_code");
        params.append("code",code);
        params.append("redirect_uri",REDIRECT_URI);

        const tokenRes = await axios.post(
            "https://discord.com/api/oauth2/token",
            params,
            { headers:{
                "Content-Type":
                "application/x-www-form-urlencoded"
            }});

        const access_token =
            tokenRes.data.access_token;

        const userRes =
            await axios.get(
            "https://discord.com/api/users/@me",
            { headers:{
                Authorization:
                `Bearer ${access_token}`
            }});

        lastUser = userRes.data;

        console.log("LOGGED:",
            lastUser.username,
            lastUser.id);

        res.send(
        "<h2>Login OK! Możesz zamknąć stronę.</h2>");

    }catch(err){
        console.log(err);
        res.send("Błąd logowania");
    }
});

// ZWRACA USERA
app.get("/user",(req,res)=>{
    if(lastUser)
        res.json(lastUser);
    else
        res.json({});
});

app.listen(3000,
()=>console.log(
"OAuth server działa na 3000"));
