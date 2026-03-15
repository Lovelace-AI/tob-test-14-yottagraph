<template>
    <v-dialog
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        max-width="600"
        scrollable
    >
        <v-card>
            <v-card-title class="d-flex align-center pa-4">
                <v-icon class="mr-2">mdi-plus-circle</v-icon>
                Add Company to Watchlist
                <v-spacer />
                <v-btn icon variant="text" size="small" @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="px-4 pb-0">
                <v-text-field
                    v-model="searchQuery"
                    label="Search by company name, ticker, or CIK"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    autofocus
                    :loading="searching"
                    @update:model-value="onSearch"
                />
            </v-card-text>

            <v-card-text class="px-4 pt-0" style="min-height: 200px; max-height: 400px">
                <v-list v-if="results.length > 0" density="compact">
                    <v-list-item
                        v-for="company in results"
                        :key="company.cik"
                        :disabled="isWatched(company.cik)"
                        @click="add(company)"
                    >
                        <template v-slot:prepend>
                            <v-icon v-if="isWatched(company.cik)" color="success"
                                >mdi-check-circle</v-icon
                            >
                            <v-icon v-else>mdi-domain</v-icon>
                        </template>

                        <v-list-item-title>
                            {{ company.name }}
                            <v-chip size="x-small" class="ml-2" variant="tonal" color="primary">{{
                                company.ticker
                            }}</v-chip>
                        </v-list-item-title>
                        <v-list-item-subtitle>CIK: {{ company.cik }}</v-list-item-subtitle>

                        <template v-slot:append>
                            <v-btn
                                v-if="!isWatched(company.cik)"
                                variant="tonal"
                                color="primary"
                                size="small"
                                @click.stop="add(company)"
                            >
                                Add
                            </v-btn>
                            <v-chip v-else size="small" color="success" variant="tonal"
                                >Watching</v-chip
                            >
                        </template>
                    </v-list-item>
                </v-list>

                <div
                    v-else-if="searchQuery && searchQuery.length >= 2 && !searching"
                    class="text-center text-medium-emphasis pa-8"
                >
                    No companies found for "{{ searchQuery }}"
                </div>

                <div
                    v-else-if="!searchQuery || searchQuery.length < 2"
                    class="text-center text-medium-emphasis pa-8"
                >
                    Type at least 2 characters to search
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useEdgarApi, type EdgarCompany } from '../composables/useEdgarApi';
    import { useWatchlist } from '../composables/useWatchlist';

    defineProps<{ modelValue: boolean }>();
    const emit = defineEmits<{
        'update:modelValue': [value: boolean];
        added: [company: EdgarCompany];
    }>();

    const { searchCompanies, searching } = useEdgarApi();
    const { isWatched, addCompany } = useWatchlist();

    const searchQuery = ref('');
    const results = ref<EdgarCompany[]>([]);

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    function onSearch() {
        if (searchTimeout) clearTimeout(searchTimeout);

        const q = searchQuery.value?.trim();
        if (!q || q.length < 2) {
            results.value = [];
            return;
        }

        searchTimeout = setTimeout(async () => {
            results.value = await searchCompanies(q);
        }, 300);
    }

    function add(company: EdgarCompany) {
        addCompany(company);
        emit('added', company);
    }

    function close() {
        emit('update:modelValue', false);
        searchQuery.value = '';
        results.value = [];
    }
</script>
