import {Pool} from "pg";

// Open connection pool
const pool = new Pool({
    connectionString: `postgresql://admin:admin@pgsql.local:5432/test`,
});

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

pool.connect()

// Drop tables
    .then(() => pool.query("DROP TABLE IF EXISTS \"user\";"))
    .then(() => pool.query("DROP TABLE IF EXISTS \"role\";"))
    .then(() => console.log("Tables dropped"))

    // Create tables
    .then(() => pool.query("CREATE TABLE IF NOT EXISTS \"role\" (" +
        "id SERIAL PRIMARY KEY, " +
        "created_at DATE," +
        "name VARCHAR(50) NOT NULL UNIQUE" +
        ");"))
    .then(() => pool.query("CREATE TABLE IF NOT EXISTS \"user\" (" +
        "id SERIAL PRIMARY KEY, " +
        "created_at DATE," +
        "login VARCHAR(50) NOT NULL UNIQUE," +
        "pass VARCHAR(50) NOT NULL," +
        "role_id INT REFERENCES \"role\" (id)" +
        ");" +
        ""))
    .then(() => console.log("Tables created"))

    // Insert roles
    .then(() => pool.query("INSERT INTO \"role\" (name) VALUES ('admin');"))
    .then(() => pool.query("INSERT INTO \"role\" (name) VALUES ('member');"))
    .then(() => console.log("Roles created"))

    // Select roles
    .then(() => pool.query("SELECT * FROM \"role\";"))
    .then(function (res) {
        for (let i = 0; i < res.rows.length; i += 1) {
            console.log(res.rows[i]);
        }
    })

    // Insert users
    .then(() => pool.query("INSERT INTO \"user\" (login, pass, role_id) VALUES ('karl', 'pass', 1);"))
    .then(() => console.log("Users created"))

    // Select users
    .then(() => pool.query("SELECT * FROM \"user\";"))
    .then(function (res) {
        for (let i = 0; i < res.rows.length; i += 1) {
            console.log(res.rows[i]);
        }
    })
    .then(() => pool.end())
    .catch((err) => {
        console.error(err.message);
        pool.end();
    });

