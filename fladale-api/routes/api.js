// Importa i moduli necessari
const express = require('express');
const router = express.Router(); // Crea un oggetto router per definire rotte modulari
const db = require('../db'); // Modulo custom per l'accesso al database
const crypto = require('crypto'); // Per generare token sicuri
const nodemailer = require('nodemailer'); // Per inviare email
const rateLimit = require('express-rate-limit'); // Per limitare il numero di richieste da un singolo IP
const bcrypt = require('bcryptjs');

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
                        <a href="${process.env.CLIENT_URL}/home-page/hp_index.html" style="text-decoration: none">
                            <img src="https://raw.githubusercontent.com/L-B3N2/test_email/1a5ea73ff322f26410c91b77ad9e87880d759e49/lg_fladale_no_bg_wheat.png" alt="Logo Fladale" style="height: 50px; vertical-align: middle;">
                            <img src="https://raw.githubusercontent.com/L-B3N2/test_email/1a5ea73ff322f26410c91b77ad9e87880d759e49/wr_fladale_no_bg_wheat.png" alt="Scritta Fladale" style="height: 50px; vertical-align: middle;">
                        </a>
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
        res.json({ message: "Se l'email è corretta, riceverai un messaggio funzionante per il recupero." });
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

//Rotta POST /register: eeffettua registrazione nuovo utente nel database
router.post('/register', async (req, res) => {
    const { email, password, nome, cognome, telefono, citta, indirizzo } = req.body;

    try {
        const conn = await db.getConnection();

        const existing = await conn.query('SELECT * FROM utenti WHERE email = ?', [email]);
        if (existing.length > 0) {
            conn.release();
            return res.status(400).json({ message: 'Se hai già un account accedi' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const token_attivazione = crypto.randomBytes(32).toString('hex');

        // Salva nuovo utente non attivo
        await conn.query(
            `INSERT INTO utenti (email, password_hash, nome, cognome, telefono, citta, indirizzo, attivo, token_attivazione)
             VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
            [email, password_hash, nome, cognome, telefono, citta, indirizzo, token_attivazione]
        );

        conn.release();

        // Invia email di attivazione
        const link = `${process.env.CLIENT_URL}/log-in-page/attivazione_index.html?token=${token_attivazione}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"fladale" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "fladale - Attiva il tuo account!",
            html: `
                <div style="background: url('https://raw.githubusercontent.com/L-B3N2/test_email/refs/heads/main/background_email_2.jpg') center center / cover no-repeat; padding: 40px 0 0 0; font-family: Arial, sans-serif; text-align: center;">
                    <div style="width: 70%; margin: auto; background-color: wheat; border-radius: 12px; padding: 30px; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
                        <div style="margin-bottom: 20px;">
                            <a href="${process.env.CLIENT_URL}/home-page/hp_index.html" style="text-decoration: none">
                                <img src="https://raw.githubusercontent.com/L-B3N2/test_email/1a5ea73ff322f26410c91b77ad9e87880d759e49/lg_fladale_no_bg_wheat.png" alt="Logo Fladale" style="height: 50px; vertical-align: middle; text-decoration: none;">
                                <img src="https://raw.githubusercontent.com/L-B3N2/test_email/1a5ea73ff322f26410c91b77ad9e87880d759e49/wr_fladale_no_bg_wheat.png" alt="Scritta Fladale" style="height: 50px; vertical-align: middle; text-decoration: none;">
                            </a>
                        </div>
                        <h2 style="color: green; font-family: Georgia, 'Times New Roman', Times, serif;">fladale - Benvenuto!</h2>
                        <p style="color: #333; font-size: 1.05em;">Clicca il bottone qui sotto per attivare il tuo profilo!</p>
                        <div style="margin: 30px 0;">
                            <a href="${link}" style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Attiva il tuo profilo</a>
                        </div>
                        <p style="font-size: 0.85em; color: #666;">Se non hai effettuato la registrazione, ignora questa email.</p>
                    </div>
                    <div style="width: 100%; background-color: #4CAF50; margin-top: 40px; padding: 15px 0;">
                        <p style="margin: 0; font-size: 0.9rem; color: black;">&copy; 2025 fladale. Tutti i diritti riservati.</p>
                    </div>
                </div>
            `
        });

        res.status(201).json({ message: 'Registrazione completata. Controlla la tua email per attivare il tuo account.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore server durante la registrazione' });
    }
});

//Rotta GET /attiva-account: controlla attraverso il token che l'attivazione sia stata confermata
router.get('/attiva-account', async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token mancante" });

    //Controllo token
    try {
        const rows = await db.query("SELECT id FROM utenti WHERE token_attivazione = ?", [token]);
        if (!rows.length) return res.status(400).json({ error: "Token non valido o già usato" });

        await db.query("UPDATE utenti SET attivo = 1, token_attivazione = NULL WHERE id = ?", [rows[0].id]);
        res.json({ message: "Account attivato con successo!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore attivazione account" });
    }
});

//Rotta POST /login: controllo dell'account nel database
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const conn = await db.getConnection();
        const result = await conn.query('SELECT * FROM utenti WHERE email = ?', [email]);
        conn.release();

        if (result.length === 0) {
            return res.status(401).json({ error: "Email o password errate" });
        }

        const user = result[0];
        if (!user.attivo) {
            return res.status(403).json({ error: "Account non attivo. Controlla la tua email." });
        }
        const valid = await bcrypt.compare(password, user.password_hash);

        if (valid) {
            res.cookie('user_email', email, { path: '/' });
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ error: "Email o password errata" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server" });
    }
});

//Rotta GET /utente: richiede le informazioni dell'utente
router.get('/utente', async (req, res) => {
    const email = req.query.email;
    try {
        const conn = await db.getConnection();
        const rows = await conn.query('SELECT nome, cognome, email, telefono, citta, indirizzo FROM utenti WHERE email = ?', [email]);
        conn.release();

        if (rows.length === 0) return res.status(404).json({ error: 'Utente non trovato' });

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore server' });
    }
});

//Rotta POST /utente/update: aggiorna le informazione dell'utente
router.post('/utente/update', async (req, res) => {
    const { email, nome, cognome, telefono, citta, indirizzo, password } = req.body;

    try {
        const conn = await db.getConnection();

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await conn.query(`
            UPDATE utenti
            SET nome = ?, cognome = ?, telefono = ?, citta = ?, indirizzo = ?, password_hash = ?
            WHERE email = ?
        `, [nome, cognome, telefono, citta, indirizzo, hashedPassword, email]);
    } else {
        await conn.query(`
            UPDATE utenti
            SET nome = ?, cognome = ?, telefono = ?, citta = ?, indirizzo = ?
            WHERE email = ?
        `, [nome, cognome, telefono, citta, indirizzo, email]);
    }

        conn.release();
        res.json({ message: 'Modifiche salvate con successo' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore durante il salvataggio' });
    }
});

//Rotta GET /preferiti: richiede le piante salvate dall'utente attraverso /prefetiti/add
router.get('/preferiti', async (req, res) => {
    const email = req.query.email;
    try {
        const conn = await db.getConnection();

        const [utente] = await conn.query('SELECT id FROM utenti WHERE email = ?', [email]);
        if (!utente || utente.length === 0) return res.status(404).json({ error: 'Utente non trovato' });

        const results = await conn.query(`
            SELECT p.id, p.nome, p.descrizione, p.immagine_url, p.hover_url,
                         pr.percentuale_annaffiamento
            FROM piante p
            JOIN preferiti pr ON p.id = pr.id_pianta
            WHERE pr.id_utente = ?
        `, [utente.id]);

        conn.release();
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nel recupero preferiti' });
    }
});

//Rotta POST /preferiti/add: aggiunge le informazioni della pianta ai preferiti
router.post('/preferiti/add', async (req, res) => {
    const { email, id_pianta } = req.body;

    try {
        const conn = await db.getConnection();

        const [utente] = await conn.query('SELECT id FROM utenti WHERE email = ?', [email]);
        if (!utente) {
            conn.release();
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        await conn.query(`
            INSERT INTO preferiti (id_utente, id_pianta, percentuale_annaffiamento)
            VALUES (?, ?, 100)
            ON DUPLICATE KEY UPDATE id_pianta = id_pianta
        `, [utente.id, id_pianta]);

        conn.release();
        res.json({ message: 'Aggiunta ai preferiti!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante l\'aggiunta' });
    }
});

//Rotta POST /preferiti/delete: elimina le informazioni della pianta dai preferiti
router.post('/preferiti/delete', async (req, res) => {
    const { email, id_pianta } = req.body;
    try {
        const conn = await db.getConnection();

        const [utente] = await conn.query('SELECT id FROM utenti WHERE email = ?', [email]);
        if (!utente) return res.status(404).json({ error: 'Utente non trovato' });

        await conn.query(`
            DELETE FROM preferiti
            WHERE id_utente = ? AND id_pianta = ?
        `, [utente.id, id_pianta]);

        conn.release();
        res.json({ message: 'Rimossa dai preferiti' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante la rimozione' });
    }
});

//Rotta POST /preferiti/data-annaffiamento: aggiorna la data dell'ultimo annaffiamento della pianta preferita
//e la percentuale d'idratazione della pianta
router.post('/preferiti/data-annaffiamento', async (req, res) => {
    const { email, id_pianta, data } = req.body;

    try {
        const conn = await db.getConnection();
        const [utente] = await conn.query('SELECT id FROM utenti WHERE email = ?', [email]);
        if (!utente) {
            conn.release();
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        // Usa la data fornita
        const dataUsata = new Date(data);
        const oggi = new Date();
        const giorniPassati = Math.floor((oggi - dataUsata) / (1000 * 60 * 60 * 24));

        // Recupera intervallo idrico della pianta
        const [pianta] = await conn.query('SELECT richiesta_acqua_giorni FROM piante WHERE id = ?', [id_pianta]);
        const intervallo = pianta?.richiesta_acqua_giorni || 7;

        // Calcola nuova percentuale
        let percentuale = Math.round(100 - (giorniPassati / intervallo) * 100);
        if (percentuale < 0) percentuale = 0;
        if (percentuale > 100) percentuale = 100;

        // Salva data e percentuale
        await conn.query(`
            UPDATE preferiti
            SET data_ultimo_annaffiamento = ?, percentuale_annaffiamento = ?
            WHERE id_utente = ? AND id_pianta = ?
        `, [data, percentuale, utente.id, id_pianta]);

        conn.release();
        res.json({ message: 'Data e percentuale aggiornate!', percentuale });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore salvataggio data' });
    }
});

//Rotta GET /eventi-annaffiamento: crea i prossimi eventi per l'annaffiamento della pianta prendendo in considerazione 
//l'ultimo annaffiamento e il tempo indicato tra un annaffiamento e l'altro specifico per la pianta
router.get('/eventi-annaffiamento', async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "Email mancante" });

    try {
        const conn = await db.getConnection();

        // Ottieni id utente
        const [utente] = await conn.query('SELECT id FROM utenti WHERE email = ?', [email]);
        if (!utente) {
            conn.end();
            return res.status(404).json({ error: "Utente non trovato" });
        }

        // Prendi piante preferite con richiesta_acqua_giorni
        const piante = await conn.query(`
            SELECT p.nome AS id_pianta, p.richiesta_acqua_giorni, pf.data_ultimo_annaffiamento
            FROM preferiti pf
            JOIN piante p ON pf.id_pianta = p.id
            WHERE pf.id_utente = ?
        `, [utente.id]);

        const oggi = new Date();
        const eventi = [];

        piante.forEach(pianta => {
            const intervallo = pianta.richiesta_acqua_giorni || 7;
            const baseDate = pianta.data_ultimo_annaffiamento 
                ? new Date(pianta.data_ultimo_annaffiamento) 
                : oggi;

            for (let i = 1; i <= 5; i++) {
                const data = new Date(baseDate);
                data.setDate(baseDate.getDate() + i * intervallo);

                eventi.push({
                    id_pianta: pianta.id_pianta,
                    title: `Annaffiare ${pianta.id_pianta}`,
                    start: data.toISOString().split("T")[0] + "T08:00:00"
                });
            }
        });

        conn.end();
        res.json(eventi);
    } catch (err) {
        console.error("Errore eventi:", err);
        res.status(500).json({ error: "Errore nel calcolo eventi" });
    }
});

// Esporta tutte le rotte definite in questo file per usarle nell'app principale
module.exports = router;
