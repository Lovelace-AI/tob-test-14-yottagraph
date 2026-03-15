const EDGAR_USER_AGENT = 'AetherApp admin@example.com';

interface EdgarSubmission {
    cik: string;
    entityType: string;
    sic: string;
    sicDescription: string;
    name: string;
    tickers: string[];
    exchanges: string[];
    ein: string;
    stateOfIncorporation: string;
    filings: {
        recent: {
            accessionNumber: string[];
            filingDate: string[];
            reportDate: string[];
            acceptanceDateTime: string[];
            act: string[];
            form: string[];
            fileNumber: string[];
            items: string[];
            size: number[];
            isXBRL: number[];
            primaryDocument: string[];
            primaryDocDescription: string[];
        };
    };
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const cik = query.cik as string;
    const formType = query.formType as string | undefined;

    if (!cik) {
        throw createError({ statusCode: 400, statusMessage: 'cik parameter is required' });
    }

    const paddedCik = String(cik).padStart(10, '0');

    try {
        const response = await fetch(`https://data.sec.gov/submissions/CIK${paddedCik}.json`, {
            headers: { 'User-Agent': EDGAR_USER_AGENT },
        });

        if (!response.ok) {
            throw new Error(`EDGAR API error: ${response.status}`);
        }

        const data: EdgarSubmission = await response.json();
        const recent = data.filings.recent;
        const count = recent.accessionNumber.length;

        let filings = [];
        for (let i = 0; i < count; i++) {
            filings.push({
                accessionNumber: recent.accessionNumber[i],
                filingDate: recent.filingDate[i],
                reportDate: recent.reportDate[i],
                form: recent.form[i],
                description: recent.primaryDocDescription[i],
                primaryDocument: recent.primaryDocument[i],
                size: recent.size[i],
            });
        }

        if (formType) {
            const types = formType.split(',').map((t) => t.trim().toUpperCase());
            filings = filings.filter((f) => types.includes(f.form));
        }

        const accessionToPath = (accession: string) => accession.replace(/-/g, '');

        return {
            company: {
                cik: data.cik,
                name: data.name,
                tickers: data.tickers,
                exchanges: data.exchanges,
                sic: data.sic,
                sicDescription: data.sicDescription,
                stateOfIncorporation: data.stateOfIncorporation,
            },
            filings: filings.map((f) => ({
                ...f,
                url: `https://www.sec.gov/Archives/edgar/data/${data.cik}/${accessionToPath(f.accessionNumber)}/${f.primaryDocument}`,
            })),
        };
    } catch (error: any) {
        console.error('EDGAR filings error:', error.message);
        throw createError({ statusCode: 502, statusMessage: error.message });
    }
});
