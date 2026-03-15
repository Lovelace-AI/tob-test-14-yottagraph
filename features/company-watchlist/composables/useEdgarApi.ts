import { ref } from 'vue';

export interface EdgarCompany {
    cik: number;
    ticker: string;
    name: string;
}

export interface EdgarFiling {
    accessionNumber: string;
    filingDate: string;
    reportDate: string;
    form: string;
    description: string;
    primaryDocument: string;
    size: number;
    url: string;
}

export interface CompanyInfo {
    cik: string;
    name: string;
    tickers: string[];
    exchanges: string[];
    sic: string;
    sicDescription: string;
    stateOfIncorporation: string;
}

export interface FilingsResponse {
    company: CompanyInfo;
    filings: EdgarFiling[];
}

export function useEdgarApi() {
    const searching = ref(false);
    const loadingFilings = ref(false);

    async function searchCompanies(query: string): Promise<EdgarCompany[]> {
        if (!query || query.length < 2) return [];

        searching.value = true;
        try {
            const data = await $fetch<{ results: EdgarCompany[] }>('/api/edgar/search', {
                params: { q: query },
            });
            return data.results;
        } catch (error) {
            console.error('Company search failed:', error);
            return [];
        } finally {
            searching.value = false;
        }
    }

    async function getFilings(
        cik: number | string,
        formType?: string
    ): Promise<FilingsResponse | null> {
        loadingFilings.value = true;
        try {
            const data = await $fetch<FilingsResponse>('/api/edgar/filings', {
                params: { cik: String(cik), formType },
            });
            return data;
        } catch (error) {
            console.error('Filings fetch failed:', error);
            return null;
        } finally {
            loadingFilings.value = false;
        }
    }

    return {
        searching,
        loadingFilings,
        searchCompanies,
        getFilings,
    };
}
