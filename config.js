module.exports = {
  databaseURL: process.env.DATABASE_URL || "mongodb://localhost/blog",
  port: process.env.PORT || 8080
};
