//Base de Datos storagedb
db.createUser({user:'Eliecer',pwd:'eliecer123',roles:[{role:'readWrite',db:'storagedb'}]});
//Coleccion Usuarios
db.createCollection('adm_usuarios');
//Insertando Usuario
db.adm_usuarios.insertOne({
    email:'eliecer21@gmail.com',
    username:'Eliecer21',
    password:'$2b$10$tX02GNhVBxm5SVQyzQivSuA8OTcOyrv2r2tfydOF7NOG2kvEyQ3Wq',
    passConfirm:'$2b$10$tX02GNhVBxm5SVQyzQivSuA8OTcOyrv2r2tfydOF7NOG2kvEyQ3Wq'
});
//password:holis