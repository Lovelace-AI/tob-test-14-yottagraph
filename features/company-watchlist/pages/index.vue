<template>
    <div class="d-flex flex-column" style="height: 100%">
        <FeatureHeader title="Watchlist" icon="mdi-briefcase-eye">
            <template #actions v-if="!selectedCik">
                <v-btn variant="text" prepend-icon="mdi-plus" @click="showAddDialog = true">
                    Add Company
                </v-btn>
            </template>
        </FeatureHeader>

        <div class="flex-grow-1 overflow-y-auto pa-4">
            <!-- Filings view -->
            <FilingsTable v-if="selectedCik" :cik="selectedCik" @back="selectedCik = null" />

            <!-- Watchlist view -->
            <template v-else>
                <v-data-table
                    v-if="companies.length > 0"
                    :headers="headers"
                    :items="companies"
                    density="comfortable"
                    hover
                    @click:row="(_e: Event, row: any) => viewFilings(row.item)"
                    class="cursor-pointer"
                >
                    <template v-slot:item.ticker="{ item }">
                        <v-chip size="small" color="primary" variant="tonal">{{
                            item.ticker
                        }}</v-chip>
                    </template>

                    <template v-slot:item.addedAt="{ item }">
                        {{ formatDate(item.addedAt) }}
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-btn
                            icon
                            variant="text"
                            size="small"
                            color="error"
                            @click.stop="removeCompany(item.cik)"
                        >
                            <v-icon>mdi-close-circle-outline</v-icon>
                            <v-tooltip activator="parent" location="top"
                                >Remove from watchlist</v-tooltip
                            >
                        </v-btn>
                    </template>
                </v-data-table>

                <!-- Empty state -->
                <div
                    v-else
                    class="d-flex flex-column align-center justify-center"
                    style="min-height: 400px"
                >
                    <v-icon size="80" color="grey-darken-1" class="mb-4"
                        >mdi-briefcase-eye-outline</v-icon
                    >
                    <h2 class="text-h5 mb-2">Your watchlist is empty</h2>
                    <p class="text-medium-emphasis text-body-1 mb-6">
                        Add companies to track their SEC EDGAR filings
                    </p>
                    <v-btn
                        color="primary"
                        size="large"
                        prepend-icon="mdi-plus"
                        @click="showAddDialog = true"
                    >
                        Add Your First Company
                    </v-btn>
                </div>
            </template>
        </div>

        <AddCompanyDialog v-model="showAddDialog" @added="onCompanyAdded" />
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useWatchlist } from '../composables/useWatchlist';
    import type { EdgarCompany } from '../composables/useEdgarApi';
    import AddCompanyDialog from '../components/AddCompanyDialog.vue';
    import FilingsTable from '../components/FilingsTable.vue';

    const { companies, removeCompany } = useWatchlist();

    const showAddDialog = ref(false);
    const selectedCik = ref<number | null>(null);

    const headers = [
        { title: 'Ticker', key: 'ticker', width: '120px' },
        { title: 'Company', key: 'name' },
        { title: 'CIK', key: 'cik', width: '120px' },
        { title: 'Added', key: 'addedAt', width: '140px' },
        { title: '', key: 'actions', width: '60px', sortable: false },
    ];

    function viewFilings(company: { cik: number }) {
        selectedCik.value = company.cik;
    }

    function onCompanyAdded(_company: EdgarCompany) {
        // Company is added via the composable; no extra action needed
    }

    function formatDate(isoStr: string): string {
        return new Date(isoStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }
</script>

<style scoped>
    .cursor-pointer :deep(tbody tr) {
        cursor: pointer;
    }
</style>
