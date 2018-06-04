# Cadasta Esri Admin

## Commands

- `start`
- `build`
- `test`

## Development

### Recommended Reading

- **Configuration**
  - [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter): Our project was created from this starter kit. The README contains useful information regarding how React and TypeScript interact.
  - [Create React App](https://github.com/facebook/create-react-app): The aforementioned "TypeScript React Starter" is based off of this starter. The project's [User Guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md) contains a wealth of information about using the project and expanding your app's functionality (e.g. testing strategies, server side rendering, code splitting). This is a sensible first-step when looking to expand our applications configuration.
- **Code organization**
  - [A Better File Structure For React/Redux Applications](https://marmelab.com/blog/2015/12/17/react-directory-structure.html): Our project is organized by grouping files by domain, as described in this blogpost. This should feel more natural to someone coming from a framework such as Django.
- **Code organization**
  - [A Better File Structure For React/Redux Applications](https://marmelab.com/blog/2015/12/17/react-directory-structure.html): Our project is organized by grouping files by domain, as described in this blogpost. This should feel more natural to someone coming from a framework such as Django.
  - [Presentation and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- **Redux**
  - [Getting Started with Redux (video series)](https://egghead.io/courses/getting-started-with-redux)
  - [Using the Redux Store Like a Database](https://hackernoon.com/shape-your-redux-store-like-your-database-98faa4754fd5)

### Code Style

**Style Rules**

- Files containing a Container and/or Component should always export their Container or Component (if no Container is available) as `default`. Files that do not export a Container or Component should have no `default` export. A file should never export more than onee Container or Component.
- Filenames for files exporting a Container or Component should be uppercased. Any supporting file (e.g. `css` or `.spec.ts` files should also be uppercase). Filenames for files that do not export a Container or Component should be lowercased.
- Test files should have filenames that mirror the files they are testing, but end with `.spec.ts`

### Dev Tools

* [Redux DevTools Extension](http://extension.remotedev.io/)
