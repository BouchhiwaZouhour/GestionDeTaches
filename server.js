import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';

// Connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todolist'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Base de données connectée avec succès !');
});

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // si tu veux ajouter CSS ou JS statique

// Route d'affichage des tâches
app.get("/", (req, res) => {
    const sql = "SELECT * FROM taches";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des tâches :", err);
            return res.sendStatus(500);
        }
        res.render("index", { taches: results, editTask: undefined, editIndex: undefined });
    });
});

// Ajouter une tâche
app.post("/add", (req, res) => {
    const { tache } = req.body;
    const etat = req.body.etat ? "faite" : "non faite";
    const sql = "INSERT INTO taches (tache, etat) VALUES (?, ?)";
    db.query(sql, [tache, etat], (err) => {
        if (err) {
            console.error("Erreur lors de l'ajout de la tâche :", err);
            return res.sendStatus(500);
        }
        res.redirect("/");
    });
});

// Supprimer une tâche
app.post("/delete", (req, res) => {
    const index = parseInt(req.body.index);
    const sql = "DELETE FROM taches WHERE id = ?";
    db.query(sql, [index], (err) => {
        if (err) {
            console.error("Erreur lors de la suppression de la tâche :", err);
            return res.sendStatus(500);
        }
        res.redirect("/");
    });
});

// Afficher une tâche à modifier
app.get("/edit/:index", (req, res) => {
    const id = parseInt(req.params.index);
    const sql = "SELECT * FROM taches";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erreur de récupération des tâches :", err);
            return res.sendStatus(500);
        }

        const editTask = results.find(task => task.id === id);
        res.render("index", {
            taches: results,
            editTask,
            editIndex: id
        });
    });
});

// Mettre à jour une tâche
app.post("/update/:index", (req, res) => {
    const id = parseInt(req.params.index);
    const { tache } = req.body;
    const etat = req.body.etat ? "faite" : "non faite";

    const sql = "UPDATE taches SET tache = ?, etat = ? WHERE id = ?";
    db.query(sql, [tache, etat, id], (err) => {
        if (err) {
            console.error("Erreur lors de la mise à jour de la tâche :", err);
            return res.sendStatus(500);
        }
        res.redirect("/");
    });
});

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
