import 'reflect-metadata';

import {Comment, CommentClient, CommentPagination} from './comment/Comment.model';
import {MorpheusArgs, createInterfaceFromClass, writeAllFilesToProject} from '@roadmanjs/utils';
import {Reaction, ReactionClient, ReactionPagination} from './reaction/Reaction.model';

import flatten from 'lodash/flatten';

// Automatically run this before building
(async () => {
    const clients: any[] = [
        {name: 'Comment', client: CommentClient, fragment: Comment, pagination: CommentPagination},
        {
            name: 'Reaction',
            client: ReactionClient,
            fragment: Reaction,
            pagination: ReactionPagination,
        },
    ];

    const clientMorphs = clients.map((client) =>
        Object.keys(client.client).map((key) => {
            const clientName = client.name;
            const ClientValue = client.client[key];
            const clientFragmentValue: any = client.fragment;
            const clientPaginationValue: any = client.pagination;

            if (key === 'FRAGMENT') {
                const clientFragment = createInterfaceFromClass(clientFragmentValue);
                const clientPagination = createInterfaceFromClass(clientPaginationValue);
                const contentFrag: MorpheusArgs = {
                    filename: `${clientName}.fragment`,
                    consts: [{name: `${clientName}Fragment`, value: ClientValue}],
                    interfaces: [clientFragment, clientPagination],
                };

                return contentFrag;
            }

            const contentFile: MorpheusArgs = {
                filename: `${clientName}.${key.toLowerCase()}`,
                consts: [{name: `${clientName}${key}`, value: ClientValue}],
            };
            return contentFile;
        })
    );

    const morphs: MorpheusArgs[] = [...flatten(clientMorphs)];

    await writeAllFilesToProject(morphs, '.', 'src/client/gql/auto');
})();
