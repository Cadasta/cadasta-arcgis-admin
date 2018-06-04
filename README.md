# Cadasta Esri Admin

## Development

### Background

The project was created with the [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter) guide. This is built off of the [Create React App](https://github.com/facebook/create-react-app) project. For adding additional configuration to the codebase (e.g. testing strategies, server side rendering) first review the TypeScript React Starter README and then (if you are still uncertain about a path forward) the Create React App README. These two projects contain a wealth of information regarding customizing project configuration.


The project is organized by grouping files by domain, as described in ["A Better File Structure For React/Redux Applications"](https://marmelab.com/blog/2015/12/17/react-directory-structure.html). This should feel more natural to someone coming from a framework such as Django.

Other recommended reading:

- [Presentation and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Getting Started with Redux (video series)](https://egghead.io/courses/getting-started-with-redux)

### Code Style

Style Rules

- Files containing a Container and/or Component should always export their Container or Component (if no Container is available) as `default`. Files that do not export a Container or Component should have no `default` export. A file should never export more than onee Container or Component.
-Filenames for files exporting a Container or Component should be uppercased. Any supporting file (e.g. `css` or `.spec.ts` files should also be uppercase). Filenames for files that do not export a Container or Component should be lowercased.
- Test files should have filenames that mirror the files they are testing, but end with `.spec.ts`
