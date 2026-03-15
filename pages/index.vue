<template>
    <div class="home-page">
        <div class="home-content">
            <!-- Hero Section -->
            <div class="hero-section">
                <img src="/LL-logo-full-wht.svg" alt="Lovelace" class="hero-logo" />
                <h1 class="hero-title">{{ appName || 'Welcome to Aether' }}</h1>
                <p class="hero-subtitle">Your AI-powered workspace is ready.</p>
            </div>

            <!-- Quick Actions -->
            <div class="actions-grid">
                <v-card
                    class="action-card"
                    to="/chat"
                    hover
                    :style="{ borderColor: 'rgba(63, 234, 0, 0.3)' }"
                >
                    <div class="action-icon-wrap" style="background: rgba(63, 234, 0, 0.1)">
                        <v-icon size="32" color="primary">mdi-robot</v-icon>
                    </div>
                    <div class="action-text">
                        <div class="action-title">Agent Chat</div>
                        <div class="action-desc">
                            Talk to your deployed AI agents. Ask questions, run tasks, and get
                            answers in real time.
                        </div>
                    </div>
                    <v-icon class="action-arrow" size="20">mdi-arrow-right</v-icon>
                </v-card>

                <v-card class="action-card" to="/entity-lookup" hover>
                    <div class="action-icon-wrap" style="background: rgba(0, 59, 255, 0.1)">
                        <v-icon size="32" color="secondary">mdi-magnify</v-icon>
                    </div>
                    <div class="action-text">
                        <div class="action-title">Entity Lookup</div>
                        <div class="action-desc">
                            Search the Query Server for named entities. Look up people,
                            organizations, and more.
                        </div>
                    </div>
                    <v-icon class="action-arrow" size="20">mdi-arrow-right</v-icon>
                </v-card>

                <v-card class="action-card" to="/mcp" hover>
                    <div class="action-icon-wrap" style="background: rgba(255, 92, 0, 0.1)">
                        <v-icon size="32" color="warning">mdi-server</v-icon>
                    </div>
                    <div class="action-text">
                        <div class="action-title">MCP Explorer</div>
                        <div class="action-desc">
                            Browse and test MCP server tools. Discover capabilities and run tools
                            interactively.
                        </div>
                    </div>
                    <v-icon class="action-arrow" size="20">mdi-arrow-right</v-icon>
                </v-card>
            </div>

            <!-- Getting Started -->
            <div class="getting-started">
                <h2 class="section-title">Getting Started</h2>
                <div class="steps-grid">
                    <div class="step-item">
                        <span class="step-number">1</span>
                        <div>
                            <div class="step-title">Deploy an Agent</div>
                            <div class="step-desc">
                                Create a Python ADK agent in <code>agents/</code> and run
                                <code>/deploy_agent</code> to ship it to Vertex AI.
                            </div>
                        </div>
                    </div>
                    <div class="step-item">
                        <span class="step-number">2</span>
                        <div>
                            <div class="step-title">Chat with your Agent</div>
                            <div class="step-desc">
                                Open Agent Chat to interact with your deployed agents through the
                                Portal Gateway.
                            </div>
                        </div>
                    </div>
                    <div class="step-item">
                        <span class="step-number">3</span>
                        <div>
                            <div class="step-title">Build a Feature</div>
                            <div class="step-desc">
                                Copy <code>templates/feature-template/</code> to
                                <code>features/</code> and create your own module.
                            </div>
                        </div>
                    </div>
                    <div class="step-item">
                        <span class="step-number">4</span>
                        <div>
                            <div class="step-title">Deploy MCP Servers</div>
                            <div class="step-desc">
                                Add tools for your agents with FastMCP servers in
                                <code>mcp-servers/</code>. Run <code>/deploy_mcp</code> to deploy.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { appName } = useAppInfo();
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

    /* Hero */
    .hero-section {
        text-align: center;
        margin-bottom: 48px;
    }

    .hero-logo {
        height: 2rem;
        width: auto;
        margin-bottom: 24px;
        opacity: 0.6;
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

    /* Action Cards */
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

    /* Getting Started */
    .getting-started {
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
        gap: 16px;
        align-items: flex-start;
    }

    .step-number {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--lv-surface);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--lv-green);
        margin-top: 2px;
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

    .step-desc code {
        font-size: 0.85em;
        padding: 1px 5px;
    }
</style>
