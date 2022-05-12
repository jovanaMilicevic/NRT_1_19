const fs = require('fs');
const path = "../oglasi.json";

//let oglasi = readFiles();

exports.lista = readFiles();

function readFiles()
{
    return JSON.parse(fs.readFileSync(path, (err, data)=>{
        if(err) throw err;
        return data;
    }).toString())
}

function saveFiles(data)
{
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

exports.returnId = (id) =>
{
    return this.lista.find(a => a.Id == id);
}

exports.addOglas = (nov)=> {
    let id=0;
    if(this.lista.length>0)
    {
        id = this.lista[this.lista.length-1].Id+1;
    }
    nov.Id = id;
    this.lista.push(nov);
    saveFiles(this.lista);
}


exports.deleteOglas = (id) => {
    this.lista = this.lista.filter(a => a.Id != id);
    saveFiles(this.lista);
}

exports.changeOglas = (nov) => {
    this.lista[this.lista.findIndex(a => a.Id == this.lista.Id)] = nov;
    saveFiles(this.lista);
}
exports.filtrirajPoKategoriji = (kategorija) => {
    return this.lista.filter(a=>a.Kategorija.toLowerCase().includes(kategorija.toLowerCase()));
}
/*
exports.filterOglas = (kat, val, cenOd, cenDo) => { 
    return this.lista.filter(a => a.Kategorija.toLowerCase().includes(kat.toLowerCase()) && 
        a.Cena.valuta.toLowerCase().includes(val.toLowerCase()) && a.Cena.cena >= cenOd && a.Cena.cena >= cenDo);
}*/
/*
let nov = {
    "Kategorija": "stanovi",
    "DatumIsteka": "12.9.2022.",
    "Cena": {
        "valuta": "RSD",
        "vrednost": 180.125
    },
    "Tekst": "Prodajem stan brt nzm sta ti nije jasno" ,
    "Oznaka": [
        "boze",
        "pomozi"
    ],
    "Email": [
        {
            "email":"privatni",
            "vrednost":"primer@gmail.com"
        }
    ]    
}


this.addOglas(nov);
console.log(this.lista);*/
