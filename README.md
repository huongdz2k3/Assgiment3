# Assignment 3: Todo list

### Provide the following authentication APIs:
1. Register using username and password
2. Log in with username and password
3. Refresh token
4. Log out

### Following APIs must be use with a valid token

4. Get todo list
5. Add a new todo with attributes: Description, due date, color code (must be in hex format, optional)
6. Export todo list to exel file
7. Import todo list from excel file
8. If 1 account is being used on 2 devices at the same time, any change on 1 device is immediately reflected in another

### Note
- Implement jwt for authentication (https://www.npmjs.com/package/jsonwebtoken)
- Import, export excel using exceljs (https://www.npmjs.com/package/exceljs)
- Because working with excel file might take a lot of time, import and export should use queue with redis (https://docs.nestjs.com/techniques/queues)
- Synchronize content on different devices using subscription (https://docs.nestjs.com/graphql/subscriptions)
