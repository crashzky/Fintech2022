import sqlite3


addresses_messages = {}
conn = sqlite3.connect("/nto-moll-db.sqlite3")
conn.row_factory = sqlite3.Row
db = conn.cursor()
# smells bad, I know
db.executescript(
    """
    DROP TABLE IF EXISTS renter;
    
    CREATE TABLE renter(
        address VARCHAR(255) NOT NULL PRIMARY KEY,
        message VARCHAR(255) NOT NULL,
        signature_v TEXT,
        signature_r TEXT,
        signature_s TEXT
    );
    """
)
