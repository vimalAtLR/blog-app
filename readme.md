**Project Configuration**
- File of postman collection - postman_collection.json
- Install all the packages of node using "npm install" command
- Install **prettier** and **ESLint** plugin. Follow the steps given in the following link, to install the document
  - https://code.visualstudio.com/docs/introvideos/extend

**Database Migration in Knex**

- DB Name = **test**
- To create the migration file use the following command.
  - **npx knex --knexfile=./src/knexfile.ts migrate:make migration_name -x ts**
- Use the following command to run the migration. Default environment will be development
  - **npx knex --knexfile=./src/knexfile.ts migrate:latest --env production**
- Use the following command to rollback the migration.
  - **npx knex migrate:rollback** or **knex migrate:rollback --all**
- Use the following command to run the migration in imports.
  - **npx ts-node src/migrations/<file_name>**
- To learn more about migration you can follow the following link
  - http://knexjs.org/#Migrations

**Project Structure**

- Service Classes

  - Create service class only if business logic needs to be apply before database transaction for the specific table. Store the file in the **src/services** folder
  - Respository class instance must be created.
  - Service classes will contain business logic code only
  - File name should be same as table name
  - Class name must have **Service** word in it. Example UserService or **UserPermissionService**

- Controller Classes

  - Create controller class for each module. Store the file in the **src/controllers** folder
  - Service class instance must be created. Never create repository class directly into the controller.
  - Controller classes will contain the code of validating the Request. After validating the request, it will send the request instance to the service class.
  - File name should be same as table/module name
  - Class name must have **Controller** word in it. Example **UserController** or **UserPermissionController**

- Route Classes

  - Create Route class for each module or table. Store the file in the **src/routes** folder.
  - All the table/module related routes must be defined in the Route class.
  - Create controller instance
  - File name should be same as table/moudle name.
  - Class name must have **Route** word in it. Example **UserRoute** or **UserPermissionRoute**

- Models Classes

  - Create table classes for every table and store the file in the **src/tables** folder
  - Use **name** property to define table name
  - Use **cols** property to define all the fields.

- Database environments
  - All the database environments must be stored in the knexfile.js

**Commands**

- Use the following command to compile the project
  - **npm run compile**
- Use following command to formate all the files of the project
  - **npm run prettier-format**
- Use following command to see all the ESLint issues
  - **npm run lint**
- Use following command to start the project
  - **npm run start**
- Use following command to compile the project and watch the compiled files
  - **npm run compile-watch**
  - **npm run start-watch**
- To kill port if already running
  - **sudo kill -9 $(sudo lsof -t -i:8080)**
