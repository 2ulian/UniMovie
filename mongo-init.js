db = db.getSiblingDB('netflix');

db.createUser({
  user: 'user',
  pwd: 'mangodb',
  roles: [
    {
      role: 'readWrite',
      db: 'netflix'
    }
  ]
});
