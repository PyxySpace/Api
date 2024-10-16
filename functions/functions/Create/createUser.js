module.exports = {
    // CREATE USER
    createUser: (req, res, db, uuid, errorMessage, admin) => {
        admin.auth().createUser({
            email: req.body.email,
            emailVerified: false,
            phoneNumber: req.body.phone,
            password: req.body.password,
            displayName: req.body.displayName,
            photoURL: req.body.photoURL,
            disabled: false,
        })
            .then(function(userRecord) {
                db.collection('users').doc(userRecord.uid)
                    .set({
                        uid: userRecord.uid,
                        admin: req.body.admin,
                        is_deactivate: req.body.is_deactivate,
                        date: {
                            date_created: new Date(userRecord.metadata.creationTime),
                            last_login: new Date(userRecord.metadata.creationTime)
                        },
                        nat: req.body.nat,
                        email: req.body.email,
                        gender: req.body.gender,
                        name: {
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            username: req.body.username,
                        },
                        phone: userRecord.phoneNumber
                    }).then(result =>{
                    return res.status(202).send(result+ ' Successfully created new user:', userRecord.uid);
                    }).catch(e => {
                        return res.status(409).send(errorMessage(e.code, e.message));
                    });
            }).catch(function(error) {
                console.log('Error creating new user:', error.message);
                return res.status(409).send(errorMessage(error.code, error.message));
            })
    }
};