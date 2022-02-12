// @ts-nocheck
import 'reflect-metadata';

import {Comment, CommentClient} from './comment/Comment.model';
import {
    DirArg,
    MorpheusArgs,
    buildDirs,
    createClientPackageJson,
    createInterfaceFromClass,
    writeAllFilesToProject,
} from '@roadmanjs/utils';

// Automatically run this
(async () => {
    const args: DirArg[] = [
        {cmd: 'rm', dir: 'dist-client'},
        {cmd: 'mkdir', dir: 'dist-client'},
        {cmd: 'cp', dir: 'dist/client/gql', newDir: 'dist-client'},
        {cmd: 'cp', dir: 'register', newDir: 'dist-client/register'},
        {cmd: 'cp', dir: 'docs', newDir: 'dist-client/docs'},
        {cmd: 'cp', dir: 'README.md', newDir: 'dist-client/README.md'},
        // {cmd: 'cp', dir: 'LICENSE', newDir: 'dist-client/LICENSE'},
        {cmd: 'cp', dir: 'dist/client/index.js', newDir: 'dist-client/index.js'},
        {cmd: 'cp', dir: 'dist/client/index.d.ts', newDir: 'dist-client/index.d.ts'},
        {cmd: 'cp', dir: 'dist/client/index.js.map', newDir: 'dist-client/index.js.map'},
    ];

    // copy/create files for dist-client, e.g comments gql
    // export comments gql
    const commentClientFragment = createInterfaceFromClass(Comment);
    const morphArgs: MorpheusArgs = {
        filename: 'Comment.fragment',
        consts: [{name: 'CommentFragment', value: CommentClient.FRAGMENT}],
        interfaces: [commentClientFragment]
    };

    buildDirs(args);

    await createClientPackageJson({
        name: '@roadmanjs/social-client',
        description: 'GraphQL client gql for @roadmanjs/social',

        extraProps: {
            main: 'index.js',
            types: 'index.d.ts',
            files: ['index.d.ts', 'docs/', '/gql', 'register/', 'LICENSE'],
        },
    });

    await writeAllFilesToProject([morphArgs], '.', 'dist-client/gql/query');
})();
