const fs = require('fs');
const path = "../oglasi.json";

let oglasi = readFiles();

exports.lista = oglasi;

function readFiles()
{
    return JSON.parse(fs.readFileSync(path, (err, data)=>{
        if(err) throw err;
        return data;
    }).toString())
}

console.log(oglasi[0].Kategorija);