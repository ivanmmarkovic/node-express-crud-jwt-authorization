# node-express-crud-jwt-authorization
Node express crud app. JWT authorization.



For testing application use [Postman](https://www.getpostman.com/). There is a postman collection in each project.

Open terminal in project directory and run:

```
- docker-compose up --build

```

In another terminal window open project and run:

```
npm install
npm run start-dev

```

In authMiddleware, add payload to req object
```
payload = jwt.verify(token, global.jwtKey);
// add payload to req
req.payload = payload;
```
Access payload in controller
```
app.get("/protected", authMiddleware, async (req, res, next) => {
    console.log(req.payload);
    res.status(200).json({message: "Protected page"});
});
```


Method | Path | Description
-------|------|------------ 
POST       |/login                           | login
POST       |/users                           | create user                    
GET        |/users                           | get all users                     
GET        |/users/:id                       | get user by id                   
PATCH      |/users/:id                       | update user                    
DELETE     |/users/:id                       | delete user 
GET        |/public                          | all users can access
GET        |/protected                       | only logged users can access


Request body when creating user
```
{
  "username": "john",
  "email": "john@example.com",
  "password": "john"
}
```

Request body when updating user can contain all fields or some fileds. 
If user submit new password, password will be updated.
```
{
  "username": "johnupdated",
  "email": "johnupdated@example.com"
}
```
