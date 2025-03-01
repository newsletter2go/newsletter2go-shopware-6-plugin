import './page/newsletter2go-index';
import './extension/sw-settings-index';

import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('newsletter2go-app', {
    type: 'plugin',
    name: 'Newsletter2GoSW6',
    title: 'Newsletter2Go',
    description: 'newsletter2go.general.descriptionTextModule',
    version: '1.0.0',
    targetVersion: '1.0.0',
    color: '#9AA8B5',
    icon: 'regular-cog',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    settingsItem: [
        {
            group: 'plugins',
            to: 'newsletter2go.app.index',
            icon: 'regular-cog',
            backgroundEnabled: true,
        }
    ],


    routes: {
        index: {
            component: 'newsletter2go-index',
            path: 'index',
            meta: {
                parentPath: 'sw.settings.index'
            }
        }
    }
});
