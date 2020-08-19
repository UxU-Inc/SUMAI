const crypto = require('crypto');

module.exports = {
    encrypt: (password) => {
        return new Promise(async (resolve, reject) => {
            const salt = crypto.randomBytes(64).toString('base64');
            crypto.pbkdf2(password, salt, 10000+password.length*5, 64, 'sha512', (err, derivedKey) => {
                if(err) reject(err);
                const hashed = derivedKey.toString('base64');
                resolve({hashed: hashed, salt: salt});
            });
        })
    },
    confirm: (password, salt) => {
        return new Promise(async (resolve, reject) => {
            crypto.pbkdf2(password, salt, 10000+password.length*5, 64, 'sha512', (err, derivedKey) => {
                if(err) reject(err);
                const hashed = derivedKey.toString('base64');
                resolve({hashed: hashed});
            });
        })
    }
}