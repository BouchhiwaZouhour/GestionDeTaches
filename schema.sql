DROP DATABASE IF EXISTS todolist;
DROP TABLE IF EXISTS taches;
CREATE DATABASE todolist;
USE todolist;

CREATE TABLE taches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tache VARCHAR(255) NOT NULL,    
    etat ENUM('faite', 'non faite') NOT NULL DEFAULT 'non faite'
);
