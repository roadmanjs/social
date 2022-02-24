export interface Comment {
    owner: string;
    text: string;
    parentId: string;
    editedAt: Date;
}

export interface PaginationClass {
}

export const CommentFragment = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}},"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"text"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"parentId"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"editedAt"},"arguments":[],"directives":[]}]}}],"loc":{"start":0,"end":88}};
