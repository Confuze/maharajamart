import bcrypt from "bcryptjs";

const password = process.argv[2];
const SALT_ROUNDS = 12;

console.log(`Password passed: "${password}"`);

const pwHash = await bcrypt.hash(password, SALT_ROUNDS);

console.log(pwHash);
