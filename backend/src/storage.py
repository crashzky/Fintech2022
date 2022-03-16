import sqlite3

addresses_messages = {}
conn = sqlite3.connect("./nto-moll-db.sqlite3")
conn.row_factory = sqlite3.Row
db = conn.cursor()
# smells bad, I know
db.executescript(
    """
    DROP TABLE IF EXISTS renter;
    DROP TABLE IF EXISTS room;
    
    CREATE TABLE renter(
        address VARCHAR(255) NOT NULL PRIMARY KEY,
        message VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE room(
        id VARCHAR(255) NOT NULL PRIMARY KEY,
        internal_name VARCHAR(255) NOT NULL,
        area DOUBLE PRECISION NOT NULL,
        location VARCHAR(255) NOT NULL
    );
    """
)
