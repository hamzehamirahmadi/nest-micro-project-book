# Backend

Using the NX tool, I created a monorepo that has four services: Auth, User, Books, and Payment. Also, a Libs has been added to this monorepo where common modules between services will be developed.

In Nx, development is faster, but the amount of conflicts in simultaneous development is greater, and this requires practice and creating a suitable mechanism for it.

![Nx](https://github.com/hamzehamirahmadi/nest-micro-project-book/blob/main/accets/nx.png)
![Nx2](https://github.com/hamzehamirahmadi/nest-micro-project-book/blob/main/accets/nx2.png)

A database is considered for each service, and data is created/updated in all services through messaging broker. In this project, user information is shared between services through message broker.

Redis has also been used to cache books.

A backup version of the database named badeh-saba.zip has been added so that you can add the initial data.
```sh
unzip badeh-saba.zip
mongorestore /PATH
```

![Mongodb](https://github.com/hamzehamirahmadi/nest-micro-project-book/blob/main/accets/mongodb.png)


RabbitMQ is used as a message broker. In this structure, each service has its own Queue. An exchange has been created for this project, which sends messages to services through RoutingKey. For example, three RoutingKeys have been created for User data. (userRemoved, userUpdated, and userCreated) Each Queue can participate in Exchange data using these keys.
Also, the Payment service sends the user's access payment information to the Books service through (accessBook).

![Rabbitmq](https://github.com/hamzehamirahmadi/nest-micro-project-book/blob/main/accets/rabbitmq.png)

## Getting Started

### Install:
```sh
npm install
```


### Develop :
```sh
npm run auth:serve
npm run books:serve
npm run payment:serve
npm run user:serve
```


### Build:
```sh
npm run auth:build
npm run books:build
npm run payment:build
npm run user:build
```


### Test:
```sh
npm run auth:test
npm run books:test
npm run payment:test
npm run user:test
```

### Docker Compose:
In this docker, all services will be executed.
```sh
docker-compose up
```

### Api
For easy access to the Api, there is an output from Postman called server-6.0.asc that you can import.

Swagger is also used for Api which is available for every service in ze addresses

```
http://localhost:3000/api/auth/docs
http://localhost:3100/api/users/docs
http://localhost:3200/api/books/docs
http://localhost:3300/api/auth/payment

```
