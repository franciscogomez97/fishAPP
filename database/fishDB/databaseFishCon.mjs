import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Inicializa y abre la conexión de la base de datos
async function openDb() {
    return open({
        filename: './fishapp.sqlite',
        driver: sqlite3.Database
    });
}

export { openDb };
