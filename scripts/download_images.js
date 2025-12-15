import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cards = [
    { id: 1, name: "callejon_beso", url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQaFBx_eVWU3NqLx7BSOy9i2mFKHlYVW5DYrRwcmIyEZ2qkVev2g4tza0qUvybF6cDBOuLWpiM_" },
    { id: 2, name: "momias", url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Momias_de_Guanajuato_-_panoramio.jpg" },
    { id: 3, name: "teatro_juarez", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Teatro_Juárez%2C_Guanajuato_24_-_Escenario.JPG" },
    { id: 4, name: "cerro_bufa", url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Cerro_de_La_Bufa_Zacatecas%2C_ZAC%2C_Mexico_-_panoramio.jpg" },
    { id: 5, name: "mina_eden", url: "https://upload.wikimedia.org/wikipedia/commons/7/78/Adentro_de_la_mina_de_el_Eden%2C_Zacatecas.jpg" },
    { id: 6, name: "sotano_golondrinas", url: "https://upload.wikimedia.org/wikipedia/commons/4/40/S%C3%B3tano_de_las_Guaguas.jpg" },
    { id: 7, name: "jardin_surrealista", url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Jard%C3%ADn_surrealista_de_Edward_James_en_Xilitla%2C_San_Luis_Potos%C3%AD.jpg" },
    { id: 8, name: "feria_san_marcos", url: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Feria_de_San_Marcos%2C_Aguascalientes.jpg" },
    { id: 9, name: "catrina", url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Posada2.Catrina.jpeg" },
    { id: 10, name: "enchiladas_mineras", url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Enchiladas_mineras.jpg" },
    { id: 11, name: "asado_boda", url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Asado_de_boda.JPG" },
    { id: 12, name: "caja_agua", url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Caja_de_Agua_de_la_Plaza_San_Luis_Potos%C3%AD.jpg" },
    { id: 13, name: "deshilado", url: "https://upload.wikimedia.org/wikipedia/commons/6/63/Deshilado_en_Aguascalientes.jpg" },
    { id: 14, name: "alhondiga", url: "https://upload.wikimedia.org/wikipedia/commons/5/59/Guanajuato_-_Alh%C3%B3ndiga_de_Granaditas_5340.jpg" },
    { id: 15, name: "teleferico", url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Telef%C3%A9rico_de_Zacatecas_-_panoramio.jpg" },
    { id: 16, name: "real_catorce", url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Real_de_Catorce%2C_San_Luis_Potosi.jpg" },
    { id: 17, name: "cerro_muerto", url: "https://upload.wikimedia.org/wikipedia/commons/5/55/Cerro_del_Muerto%2C_Aguascalientes.jpg" },
    { id: 18, name: "cristo_rey", url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Cristo_Rey_en_el_Cerro_del_Cubilete_-_Silao%2C_Guanajuato%2C_M%C3%A9xico.jpg" },
    { id: 19, name: "la_quemada", url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/La_Quemada_Zacatecas.JPG" },
    { id: 20, name: "cascada_tamul", url: "https://upload.wikimedia.org/wikipedia/commons/2/23/Cascada_de_Tamul_%283682343023%29.jpg" }
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: Status Code ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => { });
            reject(err);
        });
    });
};

const downloadAll = async () => {
    for (const card of cards) {
        try {
            // Determine extension from URL or default to .jpg

            let ext = path.extname(card.url).split('?')[0] || '.jpg';
            if (ext.toLowerCase() === '.jpeg') ext = '.jpg';

            const filename = path.join(__dirname, '../public/assets/cards', `${card.name}${ext}`);
            await downloadImage(card.url, filename);
        } catch (error) {
            console.error(`Error downloading ${card.name}:`, error.message);
        }
    }
};

downloadAll();
