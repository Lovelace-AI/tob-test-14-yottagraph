import { encodeFirestorePath } from '~/utils/pathTransform';
import type { PrefsStore, SettingsDoc } from '~/composables/usePrefsStore';

function getApiFetch() {
    const { isElectron } = useElectron();
    const isPackagedElectron =
        isElectron.value && typeof window !== 'undefined' && window.location.protocol === 'file:';

    if (isPackagedElectron) {
        return (url: string, options?: any) => {
            const baseURL = 'http://localhost:3001';
            const { userId } = useUserState();
            const headers = {
                ...options?.headers,
                'x-user-id': userId.value || 'electron-user',
            };
            return $fetch(url, { ...options, baseURL, headers });
        };
    }

    return $fetch;
}

export class KVPrefsStore implements PrefsStore {
    private apiFetch = getApiFetch();

    async getValue<PrefType>(docPath: string, fieldName: string): Promise<PrefType | undefined> {
        try {
            const encodedPath = encodeFirestorePath(docPath);
            const result = await this.apiFetch('/api/kv/read', {
                params: { docPath: encodedPath, fieldName },
            });
            if (result === undefined || result === null) return undefined;
            if (typeof result === 'string') {
                try {
                    return JSON.parse(result);
                } catch {
                    return result as unknown as PrefType;
                }
            }
            return result as PrefType;
        } catch {
            return undefined;
        }
    }

    async setValue<PrefType>(docPath: string, fieldName: string, value: PrefType): Promise<void> {
        const encodedPath = encodeFirestorePath(docPath);
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        await this.apiFetch('/api/kv/write', {
            method: 'POST',
            body: { docPath: encodedPath, fieldName, value: serialized },
        });
    }

    async readDoc(path: string): Promise<SettingsDoc | undefined> {
        try {
            const encodedPath = encodeFirestorePath(path);
            const result = await this.apiFetch('/api/kv/read', {
                params: { docPath: encodedPath },
            });
            if (!result || typeof result !== 'object') return undefined;
            return result as SettingsDoc;
        } catch {
            return undefined;
        }
    }

    async deleteDoc(path: string): Promise<void> {
        const encodedPath = encodeFirestorePath(path);
        await this.apiFetch('/api/kv/delete', {
            method: 'POST',
            body: { path: encodedPath },
        });
    }

    async deleteCollection(path: string): Promise<void> {
        const docs = await this.listDocuments(path);
        for (const docId of docs) {
            await this.deleteDoc(`${path}/${docId}`);
        }
    }

    async listDocuments(collectionPath: string): Promise<string[]> {
        try {
            const encodedPath = encodeFirestorePath(collectionPath);
            const result = await this.apiFetch('/api/kv/documents', {
                params: { collectionPath: encodedPath },
            });
            return Array.isArray(result) ? result : [];
        } catch {
            return [];
        }
    }

    async listCollections(docPath: string): Promise<string[]> {
        // Redis is flat, so we can't truly list subcollections.
        // Return an empty array — callers should know their collection names.
        return [];
    }

    async copyDoc(from: string, to: string): Promise<void> {
        const doc = await this.readDoc(from);
        if (!doc) return;
        for (const [field, value] of Object.entries(doc)) {
            await this.setValue(to, field, value);
        }
    }

    async copyCollection(from: string, to: string): Promise<void> {
        const docs = await this.listDocuments(from);
        for (const docId of docs) {
            await this.copyDoc(`${from}/${docId}`, `${to}/${docId}`);
        }
    }
}
