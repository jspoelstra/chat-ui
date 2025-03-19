## General Guidelines
1. **Use Type Annotations**: Always use type annotations to define the types of variables, function parameters, and return values.
2. **Enable Strict Mode**: Enable strict mode in `tsconfig.json` to catch potential errors early.
3. **Use Interfaces and Types**: Use interfaces and types to define the shape of objects and ensure consistency.
4. **Avoid `any` Type**: Avoid using the `any` type as it defeats the purpose of TypeScript's type safety.
5. **Leverage Generics**: Use generics to create reusable and type-safe components and functions.
6. **Consistent Code Style**: Follow a consistent code style using tools like Prettier and ESLint.
7. **Write Tests**: Write unit tests using frameworks like Jest to ensure your code works as expected.
8. **Document Your Code**: Use JSDoc comments to document your code and provide context for other developers.

## Node.js App Guidelines
1. **Project Structure**: Organize your project structure logically, separating concerns (e.g., controllers, services, models).
2. **Environment Variables**: Use environment variables to manage configuration and secrets.
3. **Error Handling**: Implement proper error handling to manage exceptions and provide meaningful error messages.
4. **Asynchronous Code**: Use async/await for handling asynchronous operations to keep the code clean and readable.
5. **Security Best Practices**: Follow security best practices, such as validating input, sanitizing data, and using HTTPS.
6. **Dependency Management**: Keep your dependencies up to date and avoid using deprecated packages.
7. **Logging**: Implement logging to track application behavior and troubleshoot issues.
8. **Performance Optimization**: Optimize performance by using caching, load balancing, and efficient database queries.
