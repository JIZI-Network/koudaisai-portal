/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/activate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** ユーザーを有効化する。 */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["Activate"];
                };
            };
            responses: {
                /** @description OK */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description 不正なrequest bodyの形式 */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description トークンが不正 */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description ユーザーが存在しない */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description ユーザーが既に有効化されている */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description レート制限 */
                429: {
                    headers: {
                        /** @description rate limitがリセットされるまでの秒数 */
                        "ratelimit-reset"?: number;
                        /** @description 再試行可能になるまでの秒数 */
                        "retry-after"?: number;
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 資格情報を検証し、アクセストークンとリフレッシュトークンを発行する。 */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["Login"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LoginSuccess"];
                    };
                };
                /** @description 不正なrequest bodyの形式 */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description 資格情報が無効だった場合 */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** リフレッシュトークンを検証し、アクセストークンを発行する。 */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["Refresh"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LoginSuccess"];
                    };
                };
                /** @description 不正なrequest bodyの形式 */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description 資格情報が無効だった場合 */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** パスワードをリセット */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["Reset"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description 不正なrequest bodyの形式 */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description 資格情報が無効だった場合 */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/revoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** リフレッシュトークンとそれから生成されたアクセストークンを失効させる。 */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["Revoke"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description 不正なrequest bodyの形式 */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description 資格情報が無効だった場合 */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** OIDCの認証エンドポイントまでリダイレクト */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Found. */
                302: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/redirect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** OIDCのリダイレクトエンドポイント */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["AdminRedirectPayload"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LoginSuccess"];
                    };
                };
                /** @description セッションが無効な場合 */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}

export type webhooks = Record<string, never>;

export interface components {
    schemas: {
        Activate: {
            /**
             * Format: uuid
             * @description ユーザーのuuid
             */
            uuid: string;
            /** @description ユーザーのactivation token */
            token: string;
            /**
             * @description パスワード
             * @example carryL0v3
             */
            password: string;
        };
        Login: {
            /**
             * @description mアドレス(新旧どちらも含む)
             * @example johnson.p.5703@m.isct.ac.jp
             */
            m_address: string;
            /**
             * @description パスワード
             * @example carryL0v3
             */
            password: string;
        };
        LoginSuccess: {
            /**
             * Format: jwt
             * @description アクセストークン(jwt)
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikd1eS1NYW51ZWwgZGUgSG9tZW0gQ2hyaXN0byIsImlhdCI6MTUxNjIzOTAyMn0.DVUM5s6qVNEg1YUycbacP82KhRnvvfS8kEecEXXZi5U
             */
            access_token: string;
            /**
             * Format: jwt
             * @description リフレッシュトークン(jwt)
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikd1eS1NYW51ZWwgZGUgSG9tZW0gQ2hyaXN0byIsImlhdCI6MTUxNjIzOTAyMn0.DVUM5s6qVNEg1YUycbacP82KhRnvvfS8kEecEXXZi5U
             */
            refresh_token: string;
        };
        Refresh: {
            /**
             * Format: jwt
             * @description リフレッシュトークン
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikd1eS1NYW51ZWwgZGUgSG9tZW0gQ2hyaXN0byIsImlhdCI6MTUxNjIzOTAyMn0.DVUM5s6qVNEg1YUycbacP82KhRnvvfS8kEecEXXZi5U
             */
            refresh_token?: string;
        };
        Reset: {
            /**
             * Format: jwt
             * @description アクセストークン
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikd1eS1NYW51ZWwgZGUgSG9tZW0gQ2hyaXN0byIsImlhdCI6MTUxNjIzOTAyMn0.DVUM5s6qVNEg1YUycbacP82KhRnvvfS8kEecEXXZi5U
             */
            access_token: string;
            /**
             * @description 古いパスワード
             * @example carryL0v3
             */
            old_password: string;
            /**
             * @description 新しいパスワード
             * @example carry<3
             */
            new_password: string;
        };
        Revoke: {
            /**
             * Format: jwt
             * @description リフレッシュトークン
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikd1eS1NYW51ZWwgZGUgSG9tZW0gQ2hyaXN0byIsImlhdCI6MTUxNjIzOTAyMn0.DVUM5s6qVNEg1YUycbacP82KhRnvvfS8kEecEXXZi5U
             */
            refresh_token: string;
        };
        AdminRedirectPayload: {
            /** @description code */
            code: string;
            /** @description state */
            state: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}

export type $defs = Record<string, never>;
export type operations = Record<string, never>;
