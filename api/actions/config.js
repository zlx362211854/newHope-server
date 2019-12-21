import path from "path";
const uploadFolder = path.join(__dirname, "../../uploads");
module.exports = {
  code: {
    success: 1000,
    fail: 2000
  },
  db: "mongodb://127.0.0.1/NEWHOPE",
  dbHost: "127.0.0.1",
  dbPort: "27017",
  dbName: "NEWHOPE",
  dbUser: "zlx",
  dbPass: "8c8e5820a11cbbbdee276669cf3bdf6a", // 
  secretKey: "8d31c99f-eb51-477d-b32a-e43792066729",
  cosmosDB: 'mongodb://localhost/DES-cosmos-dev',
  testDB: "mongodb://localhost/DES-test",
  protocol: "DES://",
  uploadFolder,
  meta: {
    installed: "DES.installed"
  }
};
