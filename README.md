# sample-loopback

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Description
This is sample REST API application using LoopBack4 + SQLite3.

---

### Install LoopBack 4 CLI
```
yarn add global @loopback/cli
```

### Create a new project
```
lb4 app
? Project name: sample-loopback
? Project description: Sample REST API application with LoopBack4 and SQLite3.
? Project root directory: sample-loopback
? Application class name: SampleLoopbackApplication
? Select features to enable in the project Enable tslint, Enable prettier, Enable mocha, Enable loopbackBuild, Enable vscode, Enable docker, Enable repositories, Enable services
```

### Add SQLite3 connector
```
yarn add loopback-connector-sqlite3
```

### Create model
```
lb4 model
? Model class name: user
? Please select the model base class Entity (A persisted model with an ID)
? Allow additional (free-form) properties? No
Let's add a property to User
Enter an empty property name when done

? Enter the property name: id
? Property type: number
? Is id the ID property? Yes
? Is it required?: No
? Default value [leave blank for none]:

Let's add another property to User
Enter an empty property name when done

? Enter the property name: firstName
? Property type: string
? Is it required?: Yes
? Default value [leave blank for none]:

Let's add another property to User
Enter an empty property name when done

? Enter the property name: lastName
? Property type: string
? Is it required?: Yes
? Default value [leave blank for none]:

Let's add another property to User
Enter an empty property name when done

? Enter the property name: age
? Property type: number
? Is it required?: No
? Default value [leave blank for none]:
```

### Create datasource
```
lb4 datasource
? Datasource name: sqlite
? Select the connector for sqlite: other
? Enter the connector's package name: loopback-connector-sqlite3
```

### Create repository
```
lb4 repository
? Please select the datasource SqliteDatasource
? Select the model(s) you want to generate a repository User
? Please select the repository base class DefaultCrudRepository
```

### Create controller
```
? Controller class name: user
? What kind of controller would you like to generate? REST Controller with CRUD functions
? What is the name of the model to use with this CRUD repository? User
? What is the name of your CRUD repository? UserRepository
? What is the type of your ID? number
? What is the base HTTP path name of the CRUD operations? /users
```

### Add datasource setting
./src/datasources/sqlite.datasource.json

###### before:
```json
{
  "name": "sqlite",
  "connector": "loopback-connector-sqlite3"
}
```

###### after:
```json
{
  "name": "sqlite",
  "connector": "loopback-connector-sqlite3",
  "file": "./db/sample.db",
  "debug": true
}
```

### Add migration setting
./src/index.ts

```js
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const app = new SampleLoopbackApplication(options);
  await app.boot();
  await app.migrateSchema(); // add this line
  await app.start();
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

---

### Try it
```
yarn start
```

open browser:
  http://localhost:3000/explorer/

or

exec curl:
```
# add user
curl http://localhost:3000/users/ -X POST -H "Content-Type: application/json" -d '{"id": 0, "firstName": "Matsubara", "lastName": "Kohei", "age": 27}'

# get all users
curl http://localhost:3000/users/ -X GET
# -> [{"id":0,"firstName":"Matsubara","lastName":"Kohei","age":27}]
```