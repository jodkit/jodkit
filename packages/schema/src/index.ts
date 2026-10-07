export {
  compileCreateTable,
  compileMigrationForCollections,
} from "./compileSql.js";
export {
  defineCollection,
  getCollections,
  resetCollectionsForTests,
  type CollectionDefinition,
  type FieldDefinition,
  type FieldType,
} from "./defineCollection.js";
export {
  asProductCreateInput,
  asProductPatchInput,
  validateCollectionInput,
  type ValidationError,
} from "./validateInput.js";
