import { defineFeatureModule } from '~/composables/useModuleRegistry';

export default defineFeatureModule({
    id: 'company-watchlist',
    name: 'Company Watchlist',
    icon: 'mdi-briefcase-eye',
    description: 'Track companies and browse their SEC EDGAR filings',

    routes: [
        {
            path: '/watchlist',
            component: () => import('./pages/index.vue'),
        },
    ],

    navigation: {
        title: 'Watchlist',
        order: 10,
    },

    requires: [],
    provides: ['useWatchlist', 'useEdgarApi'],

    setup() {
        console.log('Company Watchlist module initialized');
    },
});
