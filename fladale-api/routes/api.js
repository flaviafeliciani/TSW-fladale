// Importa i moduli necessari
const express = require('express');
const router = express.Router(); // Crea un oggetto router per definire rotte modulari
const db = require('../db'); // Modulo custom per l'accesso al database
const crypto = require('crypto'); // Per generare token sicuri
const nodemailer = require('nodemailer'); // Per inviare email
const rateLimit = require('express-rate-limit'); // Per limitare il numero di richieste da un singolo IP

// Rotta GET /tags: restituisce tutti i tag con nome e categoria
router.get('/tags', async (req, res) => {
    try {
        const tags = await db.query('SELECT id, nome, categoria FROM tags');
        res.json(tags); // Risposta JSON con tutti i tag
    } catch (err) {
        res.status(500).json({ error: err.message }); // Errore del server
    }
});

// Rotta GET /piante: restituisce tutte le piante, oppure filtra per tag
router.get('/piante', async (req, res) => {
    const tags = req.query.tags; // Parametro di query per filtrare per tag

    try {
        let query;
        let params = [];

        if (tags) {
            // Filtra per uno o più tag specifici
            const tagArray = tags.split(',');
            const placeholders = tagArray.map(() => '?').join(',');

            // Seleziona le piante che hanno esattamente tutti i tag specificati
            query = `
                SELECT p.id, p.nome, p.descrizione, p.immagine_url, p.hover_url
                FROM piante p
                JOIN piante_tags pt ON p.id = pt.id_piante
                WHERE pt.id_tags IN (${placeholders})
                GROUP BY p.id
                HAVING COUNT(DISTINCT pt.id_tags) = ?
            `;
            params = [...tagArray, tagArray.length];
        } else {
            // Nessun filtro: restituisce tutte le piante
            query = `SELECT id, nome, descrizione, immagine_url, hover_url FROM piante`;
        }

        const rows = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rotta GET /piante/:id: restituisce i dettagli di una pianta con i tag per categoria
router.get('/piante/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const query = `
            SELECT 
                p.id, p.nome, p.descrizione, p.immagine_url, p.hover_url, p.richiesta_acqua_giorni,
                GROUP_CONCAT(CASE WHEN t.categoria = 'Luce' THEN t.nome END) AS luce,
                GROUP_CONCAT(CASE WHEN t.categoria = 'Ambiente' THEN t.nome END) AS ambiente,
                GROUP_CONCAT(CASE WHEN t.categoria = 'Grandezza' THEN t.nome END) AS grandezza,
                GROUP_CONCAT(CASE WHEN t.categoria = 'Cura' THEN t.nome END) AS cura
            FROM piante p
            JOIN piante_tags pt ON p.id = pt.id_piante
            JOIN tags t ON pt.id_tags = t.id
            WHERE p.id = ?
            GROUP BY p.id
        `;

        const rows = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Pianta non trovata" });
        }

        res.json(rows[0]); // Restituisce la pianta con i tag categorizzati
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware di rate limit per proteggere la rotta /password-dimenticata
const passwordDimenticataLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Finestra temporale: 15 minuti
    max: 5, // Max 5 richieste per IP
    message: {
        message: "Hai superato il numero massimo di tentativi. Riprova più tardi."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rotta POST /password-dimenticata: invia un'email per il recupero password
router.post("/password-dimenticata", passwordDimenticataLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email mancante" });

    // Genera un token sicuro (64 caratteri esadecimali)
    const token = crypto.randomBytes(32).toString('hex');

    // Link per reimpostare la password (letto da variabile d'ambiente)
    const link = `${process.env.CLIENT_URL}/profilo-page/profilo_index.html?token=${token}`;

    try {
        // Salva il token nel database
        await db.query("UPDATE utenti SET token_accesso = ? WHERE email = ?", [token, email]);

        // Configura il servizio email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        // HTML per l'email di recupero
        const htmlContent = `
            <div style="background: url('https://raw.githubusercontent.com/L-B3N2/test_email/refs/heads/main/background_email_2.jpg') center center / cover no-repeat; padding: 40px 0 0 0; font-family: Arial, sans-serif; text-align: center;">
                <div style="width: 70%; margin: auto; background-color: wheat; border-radius: 12px; padding: 30px; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
                    <div style="margin-bottom: 20px;">
                        <img src="https://raw.githubusercontent.com/L-B3N2/test_email/1a5ea73ff322f26410c91b77ad9e87880d759e49/lg_fladale_no_bg_wheat.png" alt="Logo Fladale" style="height: 50px; vertical-align: middle;">
                        <img src="https://raw.githubusercontent.com/L-B3N2/test_email/1a5ea73ff322f26410c91b77ad9e87880d759e49/wr_fladale_no_bg_wheat.png" alt="Scritta Fladale" style="height: 50px; vertical-align: middle;">
                    </div>
                    <h2 style="color: green; font-family: Georgia, 'Times New Roman', Times, serif;">fladale - Recupero Password</h2>
                    <p style="color: #333; font-size: 1.05em;">Clicca il bottone qui sotto per accedere direttamente al tuo profilo e modificare la tua password:</p>
                    <div style="margin: 30px 0;">
                        <a href="${link}" style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Accedi al tuo profilo</a>
                    </div>
                    <p style="font-size: 0.85em; color: #666;">Se non hai richiesto il recupero, ignora questa email.</p>
                </div>
                <div style="width: 100%; background-color: #4CAF50; margin-top: 40px; padding: 15px 0;">
                    <p style="margin: 0; font-size: 0.9rem; color: black;">&copy; 2025 fladale. Tutti i diritti riservati.</p>
                </div>
            </div>
        `;

        // Invia email
        await transporter.sendMail({
            from: `"fladale" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "fladale - Recupero Password",
            html: htmlContent
        });

        // Risposta generica (per non far capire se l'email esiste)
        res.json({ message: "Se l'email è corretta, riceverai un messaggio per il recupero." });
    } catch (err) {
        console.error("Errore invio mail:", err);
        res.status(500).json({ message: "Errore durante l'invio dell'email" });
    }
});

// Rotta GET /token-login: effettua login automatico da link con token
router.get('/token-login', async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token mancante" });

    try {
        const rows = await db.query('SELECT email FROM utenti WHERE token_accesso = ?', [token]);
        if (!rows || rows.length === 0) {
            return res.status(401).json({ error: "Token non valido" });
        }

        const utente = rows[0];

        // Invalida il token dopo l'uso per sicurezza
        await db.query('UPDATE utenti SET token_accesso = NULL WHERE email = ?', [utente.email]);

        // Risposta con l'email dell'utente autenticato
        res.json({ email: utente.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore del server" });
    }
});

// Esporta tutte le rotte definite in questo file per usarle nell'app principale
module.exports = router;
