import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import inscriptionRoutes from './routes/inscriptionRoute.js';
import fs from 'fs';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion à MongoDB
connectDB();

// Routes
app.use('/inscriptions', inscriptionRoutes);

// Route pour générer un PDF
app.post('/generate-pdf', async (req, res) => {
    const { nom, prenom, date_de_naissance, secteur_d_activite, employeur, addresse_de_l_employeur, question1, question2, question3, question4, question5, question6, question7, email, telephone, adresse, photo } = req.body;
    const pdfDoc = new PDFDocument({ margin: 20 });
    pdfDoc.pipe(fs.createWriteStream('output.pdf'));
    pdfDoc.fontSize(20).text('Formulaire d\'inscription', { align: 'center' });
    pdfDoc.fontSize(12).text(`Nom : ${nom}`);
    pdfDoc.fontSize(12).text(`Prénom : ${prenom}`);
    pdfDoc.fontSize(12).text(`Date de naissance : ${date_de_naissance}`);
    pdfDoc.fontSize(12).text(`Secteur d'activité : ${secteur_d_activite}`);
    pdfDoc.fontSize(12).text(`Employeur : ${employeur}`);
    pdfDoc.fontSize(12).text(`photos : ${photo}`);
    pdfDoc.fontSize(12).text(`cvt : ${cv}`);
    pdfDoc.fontSize(12).text(`Adresse de l'employeur : ${addresse_de_l_employeur}`);
    pdfDoc.fontSize(12).text(`Question 1 : ${question1}`);
    pdfDoc.fontSize(12).text(`Question 2 : ${question2}`);
    pdfDoc.fontSize(12).text(`Question 3 : ${question3}`);
    pdfDoc.fontSize(12).text(`Question 4 : ${question4}`);
    pdfDoc.fontSize(12).text(`Question 5 : ${question5}`);
    pdfDoc.fontSize(12).text(`Question 6 : ${question6}`);
    pdfDoc.fontSize(12).text(`Question 7 : ${question7}`);
    pdfDoc.fontSize(12).text(`Email : ${email}`);
    pdfDoc.fontSize(12).text(`Téléphone : ${telephone}`);
    pdfDoc.fontSize(12).text(`Adresse : ${adresse}`);
    if (photo) {
        pdfDoc.image(photo, {
            fit: [100, 100],
            align: 'center',
            valign: 'center'
        });
    }
    pdfDoc.end();
    res.json({ message: 'PDF généré avec succès' });
});

// Route pour la racine
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Formulaire');
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Compare this snippet from formulaire/server.js:
