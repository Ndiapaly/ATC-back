import mongoose from 'mongoose';

// Définition du schéma Inscription
const inscriptionSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    date_naissance: { type: Date, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    telephone: { type: String, required: true, match: /^[7-9][0-9]{8}$/ },
    adresse: { type: String, required: true },
    cv: { type: String, required: true },
    photos: { type: String, required: true },
    secteur_activite: { type: String, required: true },
    profession: { type: String, required: true },
    employeur: { type: String, required: true },
    adresse_employeur: { type: String, required: true },
    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },
    question4: { type: String, required: true },
    question5: { type: String, required: true },
    question6: { type: String, required: true },
    question7: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Inscription', inscriptionSchema);