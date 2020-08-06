# node-express-crud-jwt-authorization
Node express crud app. JWT authorization.



For testing application use [Postman](https://www.getpostman.com/) or [Insomnia](https://insomnia.rest/).


Method | URL | description | access
-------|---- | ------------|--------
POST      |/api/login                                  | login                     | all users
POST      |/api/users                                  | create new user           | all users
GET       |/api/users                                  | get all users             | all users
GET       |/api/users/:id                              | get user                  | all users
PATCH     |/api/users/:id                              | update user               | authenticated user
DELETE    |/api/users/:id                              | update user               | authenticated user


JSON format when register:
```
{
    "username": "yourUsername",
    "email": "yourEmail",
    "password": "yourPassword"
}
```


JSON format when login:
```
{
    "username": "yourUsername",
    "password": "yourPassword"
}
```
After registration or login, user will get token. That token must be sent with every request in Authorization header. 
Authorization - "Bearer " + token


JSON format when adding new user or updating:
```
{
	"username": "John",
	"password": "secret",
	"email": "john@example.com"
}
```

When updating, you can ommit some properties. For example, if you want to update user:
```
{
	"username": "John"
}
```
