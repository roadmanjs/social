export interface Reaction {
    owner: string;
    reaction: string;
    postId: string;
}

export interface ReactionPagination {
    items?: Reaction[];
    hasNext?: boolean;
    params?: object;
}

export const ReactionFragment = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: {kind: 'Name', value: 'ReactionFragment'},
            typeCondition: {kind: 'NamedType', name: {kind: 'Name', value: 'Reaction'}},
            directives: [],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'owner'},
                        arguments: [],
                        directives: [],
                    },
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'reaction'},
                        arguments: [],
                        directives: [],
                    },
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'postId'},
                        arguments: [],
                        directives: [],
                    },
                ],
            },
        },
    ],
    loc: {start: 0, end: 83},
};
