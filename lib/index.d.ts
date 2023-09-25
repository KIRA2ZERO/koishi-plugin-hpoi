import { Context, Schema } from 'koishi';
export declare const name = "hpoi";
export declare const using: readonly ["puppeteer"];
export interface Config {
}
export declare const usage = "\nv1.0.5\u7248\u672C\u66F4\u65B0\u8BF4\u660E\uFF1A\n\n1.\u4FEE\u590D\u672C\u63D2\u4EF6\u65E0\u6CD5\u6B63\u5E38\u4F7F\u7528\u7684bug\n\n2.\u65B0\u589E\u3010hpoi.update\u3011\u3001\u3010hpoi.clear\u3011\u547D\u4EE4\uFF0C\u53EF\u4EE5\u83B7\u53D6hpoi\u6700\u65B0\u5165\u5E93\u624B\u529E\u4FE1\u606F\u4EE5\u53CA\u6E05\u9664hpoi_table\u8868\u4E2D\u6240\u6709\u6570\u636E\n\n\uFF08\u5982\u679C\u8981\u5B9E\u73B0\u5B9E\u65F6\u63A8\u9001hpoi\u4E2D\u7684\u6700\u65B0\u5165\u5E93\u624B\u529E\uFF0C\u53EF\u4EE5\u914D\u5408koishi-plugin-schedule\u63D2\u4EF6\uFF0C\u5728\u9700\u8981\u63A8\u9001\u7684\u9891\u9053\u4E2D\u4F7F\u7528\u547D\u4EE4schedule 1m / 30m -- hpoi.update\u5373\u53EF\uFF09\n";
export declare const Config: Schema<Config>;
declare module 'koishi' {
    interface Tables {
        hpoi_table: hpoi_table;
    }
}
export interface hpoi_table {
    key: number;
    id: any;
}
export declare function apply(ctx: Context): void;
