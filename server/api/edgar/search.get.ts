const EDGAR_USER_AGENT = 'AetherApp admin@example.com';

interface EdgarCompanyTicker {
    cik_str: number;
    ticker: string;
    title: string;
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const q = (query.q as string)?.trim();

    if (!q || q.length < 2) {
        return { results: [] };
    }

    const searchLower = q.toLowerCase();

    try {
        const response = await fetch('https://www.sec.gov/files/company_tickers.json', {
            headers: { 'User-Agent': EDGAR_USER_AGENT },
        });

        if (!response.ok) {
            throw new Error(`EDGAR API error: ${response.status}`);
        }

        const data: Record<string, EdgarCompanyTicker> = await response.json();
        const allCompanies = Object.values(data);

        const results = allCompanies
            .filter(
                (c) =>
                    c.title.toLowerCase().includes(searchLower) ||
                    c.ticker.toLowerCase().includes(searchLower) ||
                    String(c.cik_str).includes(searchLower)
            )
            .slice(0, 25)
            .map((c) => ({
                cik: c.cik_str,
                ticker: c.ticker,
                name: c.title,
            }));

        return { results };
    } catch (error: any) {
        console.error('EDGAR search error:', error.message);
        return { results: [], error: error.message };
    }
});
