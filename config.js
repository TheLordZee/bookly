/** Common config for bookstore. */


let DB_URI = `postgresql://`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/bookly-test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/bookly`;
}


module.exports = { DB_URI };