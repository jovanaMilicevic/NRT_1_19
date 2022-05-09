const fs = require('fs');
const lib = require('libxmljs2');
const xml2js = require('xml2js');

const pathXML = '../oglasi.xml';
const pathDTD = '../oglasi.dtd';
const pathXSD = '../oglasi.xsd';

let oglasi = [];

class Oglas 
{
    constructor(id, kategorija, datumIsteka, cene, tekst, oznake, emails)
    {
        this.id = id;
        this.kategorija = kategorija;
        this.datumIsteka = datumIsteka;
        this.cene = cene;
        this.tekst = tekst;
        this.oznake = oznake;
        this.emails = emails;
    }
}
class Cena
{
    constructor(vrednost, valuta)
    {
        this.vrednost = vrednost;
        this.valuta = valuta;
    }
}
class Oznaka
{
    constructor(vrednost, oznaka)
    {
        this.vrednost = vrednost;
        this.oznaka = oznaka;
    }
}
class Email
{
    constructor(vrednost, email)
    {
        this.vrednost = vrednost;
        this.email = email;
    }
}

function readXML()
{
    let oglasXML;
    let xml = fs.readFileSync(pathXML, (err, data)=>{
        if(err) throw err;
        return data;
    }).toString();

    xml2js.parseString(xml, (err, result) =>
    {
        if(err) throw err;
        oglasXML = result['Oglasi']['Oglas'];
    });

    for(let oglas of oglasXML)
    {
        console.log(oglas.DatumIsteka[0]._);
    }
}
readXML();