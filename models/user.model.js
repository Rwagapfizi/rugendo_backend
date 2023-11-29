const pool = require('../utils/mysql');

class User {
    constructor(id, firstName, lastName, email, telephone, nationalID, password, role, companyID) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.telephone = telephone;
        this.nationalID = nationalID;
        this.password = password;
        this.role = role;
        this.companyID = companyID;
    }

    static getAll(callback) {
        pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                return callback(error);
            }
            const users = results.map(row => new User(
                row.id,
                row.firstName,
                row.lastName,
                row.email,
                row.telephone,
                row.nationalID,
                row.password,
                row.role,
                row.companyID,
            ));
            callback(null, users);
        });
    }

    static create(userData, callback) {
        pool.query('INSERT INTO users SET ?', userData, (error, result) => {
            if (error) {
                return callback(error);
            }
            if (!User.validateUser(userData)) {
                const error = new Error('Invalid user data');
                return callback(error, null);
            }
            const newUser = new User(
                result.insertId,
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.telephone,
                userData.nationalID,
                userData.password,
                userData.role,
                userData.companyID,
            );
            callback(null, newUser);
        });
    }

    static getUserById(userID, callback) {
        const query = 'SELECT * FROM users WHERE id = ?';
        pool.query(query, [userID], (error, results) => {
            if (error) {
                console.error('Error fetching user by ID:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No user found
            }

            const userData = results[0];
            const user = new User(
                userData.id,
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.telephone,
                userData.nationalID,
                userData.password,
                userData.role,
                userData.companyID
            );

            // console.log(user)
            callback(null, user);
        });
    }

    static getUserByEmail(email, callback) {
        const query = 'SELECT * FROM users WHERE email = ?';
        pool.query(query, [email], (error, results) => {
            if (error) {
                return callback(error);
            }
            // console.log('Query results:', results);
            if (results.length === 0) {
                return callback(null, null); // No user found
            }
            const userData = results[0];
            const user = new User(
                userData.id,
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.telephone,
                userData.nationalID,
                userData.password,
                userData.role,
                userData.companyID,
            );
            callback(null, user);
        });
    }

    static getUserByTelephone = (telephone, callback) => {
        const query = 'SELECT * FROM users WHERE telephone = ?';
        pool.query(query, [telephone], (error, results) => {
            if (error) {
                console.error('Error querying user by telephone:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No user found
            }

            const userData = results[0];
            const user = new User(
                userData.id,
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.telephone,
                userData.nationalID,
                userData.password,
                userData.role,
                userData.companyID,
            );
            callback(null, user);
        });
    };

    static getUserByNationalID = (nationalID, callback) => {
        const query = 'SELECT * FROM users WHERE nationalID = ?';
        pool.query(query, [nationalID], (error, results) => {
            if (error) {
                console.error('Error querying user by national ID:', error);
                return callback(error, null);
            }

            if (results.length === 0) {
                return callback(null, null); // No user found
            }

            const userData = results[0];
            const user = new User(
                userData.id,
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.telephone,
                userData.nationalID,
                userData.password,
                userData.role,
                userData.companyID,
            );
            callback(null, user);
        });
    };

    static deleteById(userId, callback) {
        const query = 'DELETE FROM users WHERE id = ?';
        pool.query(query, [userId], (error, result) => {
            if (error) {
                console.error('Error deleting user by ID:', error);
                return callback(error, null);
            }
    
            if (result.affectedRows === 0) {
                return callback(null, null); // No user found
            }
    
            return callback(null, { id: userId }); // Return the deleted user's ID
        });
    }
    
    static validateUser(user) {
        if (!user.firstName || !user.lastName || !user.email || !user.nationalID || !user.password || !user.role) {
            return false;
        }
        // Implement further validation as needed
        return true;
    }
}

module.exports = User;
