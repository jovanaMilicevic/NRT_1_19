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
        let oznakeHTML="";
        let prikaz = "";
        console.log(oznakeHTML)
        response.data.forEach(element => {
        oznakeHTML="";
        element.Oznaka.forEach(o=>oznakeHTML+=`<label type="text" name="oznaka" value="${o}"></label>`)
            
            prikaz += 
            `
                <tr>
                    <td>${element.Kategorija}</td>
                    <td>${element.DatumIsteka}</td>
                    <td>${element.Cena.valuta}</td>
                    <td>${element.Cena.vrednost}</td>
                    <td>${element.Tekst}</td>
                    <td>
                        <div id="oznakee">${element.Oznaka}</div>
                    </td>
                    <td>${element.Email[0].vrednost}</td>
                    <td><a href="/izmeni/${element.Id}">Izmeni</a></td>
                    <td><a href="/obrisi/${element.Id}">Obrisi</a></td>
                </tr>

            `
        });                    //<td>${element.Id}</td>
        res.send(procitajPogledZaNaziv("/sviOglasi").replace("#{data}", prikaz));
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

app.post("/snimiOglas", (req,res) => {
    axios.post("http://localhost:3000/addOglas", {
        Id:parseInt("0"),
        Kategorija:req.body.kategorija,
        DatumIsteka:req.body.datumIsteka,
        Cena:
        {
            valuta:req.body.valuta,
            vrednost:req.body.cena
        },
        Tekst:req.body.tekst,
        Oznaka:[req.body.oznaka],
        Email:[{
            email:req.body.email,
            vrednost: req.body.vrednost
        }]
        
    });//oglasi i email nije kako treba 
    res.redirect("/sviOglasi");
});

app.get("/izmeni/:Id", (req, res) =>{
    axios.get(`http://localhost:3000/returnId/${req.params["Id"]}`).then(response=>{
        let prikaz =
        `
            <input type="number" name="Id" value=${response.data.Id} hidden>
            <label style="margin-left:5%">Kategorija:</label> <select name="kategorija">
                                            <option value="${response.data.Kategorija}">${response.data.Kategorija}</option>
                                            <option value="automobili">Automobili</option>
                                            <option value="stanovi">Stanovi</option>
                                            <option value="alati">Alati</option>
                                            <option value="motori">Motori</option>
                                            <option value="elektronika">Elektronika</option>
                                        </select>
            <br><br>
            <label style="margin-left:5%">Datum isteka oglasa:</label> <input type="date" name="expiringDate" value="${response.data.DatumIsteka}"><br><br>
            <label style="margin-left:5%">Cena:</label> <input type="number" name="vrednost" value="${response.data.Cena.vrednost}"> <select name="valuta">
                                                                                                                    <option value="RSD">RSD</option>
                                                                                                                    <option value="EUR">EUR</option>
                                                                                                                </select><br><br>
            <label style="margin-left:5%">Tekst:</label> 
            <input type="text" name="tekst" value="${response.data.Tekst}">
            <br><br>
            <label style="margin-left:5%">Oznake:</label>
            <input type="text" name="oznaka" value="${response.data.Oznaka}"><br><br>
            <label style="margin-left:5%">Email:</label><input type="text" name="vrednost" value="${response.data.Email[0].vrednost}"><select name="tipMaila">
                                                                                                    <option value="${response.data.Email[0].email}">${response.data.Email[0].email}</option>
                                                                                                    <option value="privatni">Privatni</option>
                                                                                                    <option value="sluzbeni">Sluzbeni</option>
                                                                                                </select><br><br>
            
        `
        res.send(procitajPogledZaNaziv('izmena').replace("#{data}",prikaz));
    }).catch(error=>{ //fali za oznake i email, email nece da se prikaze vrednost tipa, sad sam i to sjebala
        console.log(error);
    });
});



app.post("/filtrirajPoKategoriji", (req,res) => {
    axios.get(`http://localhost:3000/filtrirajPoKategoriji?kategorija=${req.body.filter}`).then(response => {
        let prikaz = "";
        response.data.forEach(element => {
            prikaz += 
            `
                <tr>
                    <td>${element.Kategorija}</td>
                    <td>${element.DatumIsteka}</td>
                    <td>${element.Cena.valuta}</td>
                    <td>${element.Cena.vrednost}</td>
                    <td>${element.Tekst}</td>
                    <td>${element.Oznaka}</td>
                    <td>${element.Email[0].vrednost}</td>
                    <td><a href="/izmeni/${element.Id}">Izmeni</a></td>
                    <td><a href="/obrisi/${element.Id}">Obrisi</a></td>
                </tr>
            `
        });
        res.send(procitajPogledZaNaziv('/sviOglasi').replace("#{data}", prikaz));
    }).catch(error => {
        console.log(error);
    });
});

app.post("/changeOglas", (req,res)=>{
    axios.post("http://localhost:3000/changeOglas",{
        Id:parseInt(req.body.Id),
        Kategorija:req.body.kategorija,
        DatumIsteka:req.body.expiringDate,
        Cena:{
            valuta:req.body.valuta,
            vrednost:req.body.vrednost
        },
        Tekst:req.body.tekst,
        Oznaka:[req.body.oznaka],
        Email:[{email:req.body.email,
            vrednost: req.body.vrednost}]

    })
    res.redirect('/sviOglasi')
});

app.listen(port, ()=>{
    console.log("Pokrenut klijent")
});