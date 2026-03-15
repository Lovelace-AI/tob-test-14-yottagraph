import { ref, computed } from 'vue';

export interface WatchlistCompany {
    cik: number;
    ticker: string;
    name: string;
    addedAt: string;
}

const _watchlist = ref<WatchlistCompany[]>([]);
const _initialized = ref(false);

const STORAGE_KEY = 'edgar-watchlist';

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_watchlist.value));
    } catch {
        // localStorage unavailable
    }
}

function loadFromStorage() {
    if (_initialized.value) return;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            _watchlist.value = JSON.parse(stored);
        }
    } catch {
        // localStorage unavailable
    }
    _initialized.value = true;
}

export function useWatchlist() {
    loadFromStorage();

    const companies = computed(() => _watchlist.value);
    const count = computed(() => _watchlist.value.length);

    function addCompany(company: { cik: number; ticker: string; name: string }) {
        if (_watchlist.value.some((c) => c.cik === company.cik)) return false;

        _watchlist.value = [..._watchlist.value, { ...company, addedAt: new Date().toISOString() }];
        persist();
        return true;
    }

    function removeCompany(cik: number) {
        _watchlist.value = _watchlist.value.filter((c) => c.cik !== cik);
        persist();
    }

    function isWatched(cik: number): boolean {
        return _watchlist.value.some((c) => c.cik === cik);
    }

    function clear() {
        _watchlist.value = [];
        persist();
    }

    return {
        companies,
        count,
        addCompany,
        removeCompany,
        isWatched,
        clear,
    };
}
