const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const axios = require('axios');
const { response } = require('express');
const port = 5000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

let procitajPogledZaNaziv=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/view/"+naziv+".html"),"utf-8");
}

app.get("/", (req, res) =>{
    res.send(procitajPogledZaNaziv("klijent"));
});

app.get("/sviOglasi", (req,res) => {
    axios.get('http://localhost:3000/Oglasi')
    .then(response => {
        let prikaz = "";
        response.data.forEach(element => {
            prikaz += 
            `
                <tr>
                    <td>${element.Id}</td>
                    <td>${element.Kategorija}</td>
                    <td>${element.DatumIsteka}</td>
                    <td>${element.Cena.valuta}</td>
                    <td>${element.Cena.vrednost}</td>
                    <td>${element.Tekst}</td>
                    <td>${element.Oznaka}</td> 
                    <td>${element.Email}</td>
                    <td><a href="/detaljnije/${element.Id}">Izmeni</a></td>
                    <td><a href="/obrisi/${element.Id}">Obrisi</a></td>
                </tr>
            `
        }); //fali oznaka, fali email
        res.send(procitajPogledZaNaziv("sviOglasi").replace("#{data}", prikaz));
    })
    .catch(error =>{
        console.log(error);
    })
});



app.get("/obrisi/:Id", (req,res) => {
    axios.delete(`http://localhost:3000/deleteOglas/${req.params["Id"]}`);
    res.redirect("/sviOglasi");
});

app.get("/addOglas", (req,res) =>{
    res.send(procitajPogledZaNaziv("formaZaDodavanje"));
});

app.get("/snimiOglas", (req,res) => {
    axios.post("http://localhost:3000/addOglas", {
        Id:0,
        Kategorija:req.body.kategorija,
        DatumIsteka:req.body.datumIsteka,
        Cena:
        {
            valuta:req.body.valuta,
            vrednost:req.body.cena
        },
        Tekst:req.body.tekst,
        Oznaka:req.body.oznaka,
        Email:req.body.email
    });//oglasi i email nije kako treba............ne radi nista kako treba
    res.redirect("/sviOglasi");
});

app.post("/filtrirajPoKategoriji", (req,res) => {
    axios.get(`http://localhost:3000/filtrirajPoKategoriji?kategorija=${req.body.filter}`).then(response => {
        let prikaz = "";
        response.data.forEach(element => {
            prikaz += 
            `
                <tr>
                    <td>${element.Id}</td>
                    <td>${element.Kategorija}</td>
                    <td>${element.DatumIsteka}</td>
                    <td>${element.Cena.valuta}</td>
                    <td>${element.Cena.vrednost}</td>
                    <td>${element.Tekst}</td>
                    <td>${element.Oznaka}</td>
                    <td>${element.Email}</td>
                    <td><a href="/detaljnije/${element.Id}">Izmeni</a></td>
                    <td><a href="/obrisi/${element.Id}">Obrisi</a></td>
                </tr>
            `
        });
        res.send(procitajPogledZaNaziv('sviOglasi').replace("#{data}", prikaz));
    }).catch(error => {
        console.log(error);
    });
});

app.listen(port, ()=>{
    console.log("Pokrenut klijent")
});