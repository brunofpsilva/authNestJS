db.createUser({
    user: 'test',
    pwd: 'test',
    roles: [
        {
            role: 'readWrite',
            db: 'test',
        },
    ],
});

db = new Mongo().getDB("auth");

db.createCollection('users', { capped: false });

db.users.insert([
    {
        email: "test@test.com",
        password: "$2a$12$Iq717k/bO31bC6YKCtg8weyhGvrMV5Ff/bkA6LY8ncKRj5ddGwumS",
        role: "admin",
    },
    {
        email: "test2@test2.com",
        password: "$2a$12$4SoZaJ/arkz39anb555FrOD5TGng2SkA3WAn..qMNg1WbgIH2/fYm",
        role: "role2",
    },
    {
        email: "test3@test3.com",
        password: "$2a$12$Elo.dTNfqUVCPBb8aERNPOA1Mic7GQPQu7VUmQKFQpMSqw25RHn6a",
        role: "role3",
    },
]);