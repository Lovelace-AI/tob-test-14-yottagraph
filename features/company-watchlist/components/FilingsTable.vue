<template>
    <div>
        <div class="d-flex align-center mb-4 ga-3">
            <v-btn icon variant="text" size="small" @click="$emit('back')">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div>
                <h2 class="text-h6">{{ companyInfo?.name || 'Loading...' }}</h2>
                <div class="text-caption text-medium-emphasis" v-if="companyInfo">
                    {{ companyInfo.tickers?.join(', ') }}
                    <span v-if="companyInfo.sicDescription">
                        &middot; {{ companyInfo.sicDescription }}</span
                    >
                    <span v-if="companyInfo.stateOfIncorporation">
                        &middot; {{ companyInfo.stateOfIncorporation }}</span
                    >
                </div>
            </div>
            <v-spacer />
            <v-select
                v-model="selectedFormTypes"
                :items="formTypeOptions"
                label="Filing type"
                variant="outlined"
                density="compact"
                multiple
                clearable
                chips
                closable-chips
                style="max-width: 320px"
            />
        </div>

        <v-data-table
            :headers="headers"
            :items="filteredFilings"
            :loading="loading"
            density="comfortable"
            hover
            items-per-page="25"
            :items-per-page-options="[10, 25, 50, 100]"
        >
            <template v-slot:item.form="{ item }">
                <v-chip size="small" :color="formColor(item.form)" variant="tonal">
                    {{ item.form }}
                </v-chip>
            </template>

            <template v-slot:item.filingDate="{ item }">
                {{ formatDate(item.filingDate) }}
            </template>

            <template v-slot:item.size="{ item }">
                {{ formatSize(item.size) }}
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn
                    icon
                    variant="text"
                    size="small"
                    :href="item.url"
                    target="_blank"
                    rel="noopener"
                >
                    <v-icon>mdi-open-in-new</v-icon>
                    <v-tooltip activator="parent" location="top">View on SEC.gov</v-tooltip>
                </v-btn>
            </template>

            <template v-slot:no-data>
                <div class="text-center pa-8 text-medium-emphasis">
                    <v-icon size="48" class="mb-2">mdi-file-document-outline</v-icon>
                    <div>No filings found</div>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch, onMounted } from 'vue';
    import { useEdgarApi, type EdgarFiling, type CompanyInfo } from '../composables/useEdgarApi';

    const props = defineProps<{ cik: number }>();
    defineEmits<{ back: [] }>();

    const { getFilings, loadingFilings: loading } = useEdgarApi();

    const companyInfo = ref<CompanyInfo | null>(null);
    const filings = ref<EdgarFiling[]>([]);
    const selectedFormTypes = ref<string[]>([]);

    const headers = [
        { title: 'Form', key: 'form', width: '100px' },
        { title: 'Filed', key: 'filingDate', width: '120px' },
        { title: 'Description', key: 'description' },
        { title: 'Size', key: 'size', width: '100px' },
        { title: '', key: 'actions', width: '60px', sortable: false },
    ];

    const formTypeOptions = [
        '10-K',
        '10-Q',
        '8-K',
        '4',
        'SC 13G',
        'SC 13D',
        'DEF 14A',
        'S-1',
        '20-F',
        '6-K',
    ];

    const filteredFilings = computed(() => {
        if (selectedFormTypes.value.length === 0) return filings.value;
        return filings.value.filter((f) => selectedFormTypes.value.includes(f.form));
    });

    function formColor(form: string): string {
        const colors: Record<string, string> = {
            '10-K': 'blue',
            '10-Q': 'cyan',
            '8-K': 'orange',
            '4': 'purple',
            'SC 13G': 'teal',
            'SC 13D': 'teal',
            'DEF 14A': 'indigo',
            'S-1': 'red',
        };
        return colors[form] || 'grey';
    }

    function formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function formatSize(bytes: number): string {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    async function loadFilings() {
        const result = await getFilings(props.cik);
        if (result) {
            companyInfo.value = result.company;
            filings.value = result.filings;
        }
    }

    watch(() => props.cik, loadFilings);
    onMounted(loadFilings);
</script>
