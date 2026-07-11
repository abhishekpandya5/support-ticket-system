import cors from 'cors';
/**
 * Returns CORS middleware configured from environment.
 * Development defaults to common frontend dev-server origins.
 */
export declare function configureCors(): (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
//# sourceMappingURL=cors.d.ts.map