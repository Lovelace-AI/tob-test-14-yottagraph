<template>
    <div class="home-page">
        <div class="home-content">
            <div class="hero-section">
                <v-icon size="48" color="primary" class="mb-4">mdi-briefcase-eye</v-icon>
                <h1 class="hero-title">{{ appName || 'EDGAR Watchlist' }}</h1>
                <p class="hero-subtitle">
                    Track companies and browse their SEC filings in one place.
                </p>
            </div>

            <div class="actions-grid">
                <v-card class="action-card" to="/watchlist" hover>
                    <div class="action-icon-wrap" style="background: rgba(63, 234, 0, 0.1)">
                        <v-icon size="32" color="primary">mdi-format-list-bulleted</v-icon>
                    </div>
                    <div class="action-text">
                        <div class="action-title">
                            Your Watchlist
                            <v-chip
                                v-if="count > 0"
                                size="x-small"
                                color="primary"
                                variant="tonal"
                                class="ml-2"
                            >
                                {{ count }}
                            </v-chip>
                        </div>
                        <div class="action-desc">
                            {{
                                count > 0
                                    ? `You're tracking ${count} ${count === 1 ? 'company' : 'companies'}. Click to view filings.`
                                    : 'Add companies to start tracking their SEC EDGAR filings.'
                            }}
                        </div>
                    </div>
                    <v-icon class="action-arrow" size="20">mdi-arrow-right</v-icon>
                </v-card>
            </div>

            <div class="info-section">
                <h2 class="section-title">What You Can Do</h2>
                <div class="steps-grid">
                    <div class="step-item">
                        <v-icon color="primary" class="mr-3">mdi-magnify</v-icon>
                        <div>
                            <div class="step-title">Search Companies</div>
                            <div class="step-desc">
                                Find any public company by name, ticker symbol, or CIK number.
                            </div>
                        </div>
                    </div>
                    <div class="step-item">
                        <v-icon color="primary" class="mr-3">mdi-eye-plus</v-icon>
                        <div>
                            <div class="step-title">Build Your Watchlist</div>
                            <div class="step-desc">
                                Curate a personal list of companies you want to monitor.
                            </div>
                        </div>
                    </div>
                    <div class="step-item">
                        <v-icon color="primary" class="mr-3">mdi-file-document-multiple</v-icon>
                        <div>
                            <div class="step-title">Browse Filings</div>
                            <div class="step-desc">
                                View 10-Ks, 10-Qs, 8-Ks, and all other EDGAR filings with one click.
                            </div>
                        </div>
                    </div>
                    <div class="step-item">
                        <v-icon color="primary" class="mr-3">mdi-filter</v-icon>
                        <div>
                            <div class="step-title">Filter by Type</div>
                            <div class="step-desc">
                                Narrow down filings to specific form types to find what matters.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useWatchlist } from '~/features/company-watchlist/composables/useWatchlist';

    const { appName } = useAppInfo();
    const { count } = useWatchlist();
</script>

<style scoped>
    .home-page {
        height: 100%;
        overflow-y: auto;
        display: flex;
        justify-content: center;
        padding: 48px 24px;
    }

    .home-content {
        max-width: 720px;
        width: 100%;
    }

    .hero-section {
        text-align: center;
        margin-bottom: 48px;
    }

    .hero-title {
        font-family: var(--font-headline);
        font-weight: 400;
        font-size: 2rem;
        letter-spacing: 0.02em;
        margin-bottom: 8px;
    }

    .hero-subtitle {
        color: var(--lv-silver);
        font-size: 1.1rem;
    }

    .actions-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 48px;
    }

    .action-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        text-decoration: none;
        transition: border-color 0.2s ease;
        cursor: pointer;
    }

    .action-icon-wrap {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .action-text {
        flex: 1;
        min-width: 0;
    }

    .action-title {
        font-family: var(--font-headline);
        font-weight: 400;
        font-size: 1.05rem;
        letter-spacing: 0.02em;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
    }

    .action-desc {
        color: var(--lv-silver);
        font-size: 0.875rem;
        line-height: 1.4;
    }

    .action-arrow {
        flex-shrink: 0;
        opacity: 0.3;
        transition: opacity 0.2s;
    }

    .action-card:hover .action-arrow {
        opacity: 0.8;
    }

    .info-section {
        margin-bottom: 48px;
    }

    .section-title {
        font-family: var(--font-headline);
        font-weight: 400;
        font-size: 1.1rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--lv-silver);
        margin-bottom: 20px;
    }

    .steps-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .step-item {
        display: flex;
        align-items: flex-start;
    }

    .step-title {
        font-weight: 500;
        margin-bottom: 2px;
    }

    .step-desc {
        color: var(--lv-silver);
        font-size: 0.875rem;
        line-height: 1.4;
    }
</style>
