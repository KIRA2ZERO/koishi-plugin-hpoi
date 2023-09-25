import { Context, Session } from 'koishi';
export declare class Hpoi {
    ctx: Context;
    session: Session;
    category_dict: object;
    order_dict: object;
    r18_dict: object;
    constructor(ctx: Context, session: any);
    search(options: any, order: any, category: any): void;
    update(): Promise<void>;
    clear(): Promise<void>;
}
