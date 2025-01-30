import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Inscription from '../models/Inscription.js'; // Assurez-vous que le modèle Inscription est correctement défini

const router = express.Router();

// Configuration de Multer pour le stockage des fichiers
const stockage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, fichier, cb) => {
        cb(null, fichier.fieldname + '-' + Date.now() + path.extname(fichier.originalname));
    }
});

// Configuration de Multer pour accepter les champs de fichier 'photos' et 'cv'
const upload = multer({ storage: stockage }).fields([
    { name: 'photos', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
]);

// Route pour créer une nouvelle inscription
router.post('/', upload, async (req, res) => {
    try {
        // Vérifiez que les fichiers ont bien été reçus
        if (!req.files || !req.files['photos'] || !req.files['cv']) {
            return res.status(400).send({ message: 'Les fichiers photos et cv sont requis.' });
        }

        // Récupération des chemins des fichiers
        const photoPath = req.files['photos'][0].path;
        const cvPath = req.files['cv'][0].path;

        // Création d'une nouvelle inscription
        const nouvelleInscription = new Inscription({ 
            nom: req.body.nom,
            prenom: req.body.prenom,
            date_naissance: req.body.date_naissance,
            email: req.body.email,
            telephone: req.body.telephone,
            adresse: req.body.adresse,
            cv: cvPath,
            photos: photoPath,
            secteur_activite: req.body.secteur_activite,
            profession: req.body.profession,
            employeur: req.body.employeur,
            adresse_employeur: req.body.adresse_employeur,
            question1: req.body.question1,
            question2: req.body.question2,
            question3: req.body.question3,
            question4: req.body.question4,
            question5: req.body.question5,
            question6: req.body.question6,
            question7: req.body.question7
            // Ajoutez les autres champs de votre formulaire ici
        });

        // Sauvegarde de l'inscription dans la base de données
        await nouvelleInscription.save();
        res.status(201).send(nouvelleInscription);
    } catch (error) {
        console.error('Erreur lors de la création de l\'inscription:', error);
        res.status(400).send({ message: 'Erreur lors de la création de l\'inscription', error });
    }
});

// Route pour exporter les inscriptions en PDF
router.get('/export-pdf', async (req, res) => {
    try {
        const inscriptions = await Inscription.find({});
        const doc = new PDFDocument();
        const filePath = 'inscriptions.pdf';
        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(12);

        inscriptions.forEach(inscription => {
            doc.text(`Nom : ${inscription.nom}`);
            doc.text(`Prénom : ${inscription.prenom}`);
            doc.text(`Email : ${inscription.email}`);
            doc.text(`Téléphone : ${inscription.telephone}`);
            doc.text(`Adresse : ${inscription.adresse}`);
            doc.text(`Photos : ${inscription.photos}`);
            doc.text(`CV : ${inscription.cv}`);
            doc.text(`Secteur d'activité : ${inscription.secteur_activite}`);
            doc.text(`Profession : ${inscription.profession}`);
            doc.text(`Employeur : ${inscription.employeur}`);
            doc.text(`Adresse de l'employeur : ${inscription.adresse_employeur}`);
            doc.text(`Date de Naissance : ${inscription.date_naissance}`);
            doc.text(`question1 : ${inscription.question1}`);
            doc.text(`question2 : ${inscription.question2}`);
            doc.text(`question3 : ${inscription.question3}`);
            doc.text(`question4 : ${inscription.question4}`);
            doc.text(`question5 : ${inscription.question5}`);
            doc.text(`question6 : ${inscription.question6}`);
            doc.text(`question7 : ${inscription.question7}`);
            // Ajoutez les autres champs de votre formulaire ici
            doc.text('---');
        });

        doc.end();
        res.download(filePath);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de l\'exportation en PDF', error });
    }
});

export default router;