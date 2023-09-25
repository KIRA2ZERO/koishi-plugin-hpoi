"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.Config = exports.usage = exports.using = exports.name = void 0;
const koishi_1 = require("koishi");
const class_1 = require("./class");
exports.name = 'hpoi';
exports.using = ['puppeteer'];
exports.usage = `
v1.0.5版本更新说明：

1.修复本插件无法正常使用的bug

2.新增【hpoi.update】、【hpoi.clear】命令，可以获取hpoi最新入库手办信息以及清除hpoi_table表中所有数据

（如果要实现实时推送hpoi中的最新入库手办，可以配合koishi-plugin-schedule插件，在需要推送的频道中使用命令schedule 1m / 30m -- hpoi.update即可）
`;
exports.Config = koishi_1.Schema.object({});
function apply(ctx) {
    ctx.model.extend('hpoi_table', {
        key: 'unsigned',
        id: 'json',
    }, {
        primary: 'key',
        autoInc: true
    });
    ctx.command('hpoi <order:string> <category:string> 返回hpoi维基的索引结果(默认前10条)', '手办维基索引').alias('手办维基')
        .option('r18', '-r <r18:string> 设定r18阈值(不限、全年龄、低于轻微露出、轻微露出、一般露出),默认值:不限', { fallback: '不限' })
        .option('number', '-n <number:posint> 设定索引个数,默认值:10', { fallback: 10 })
        .option('keyword', '-k <keyword:string> 设定索引关键词', { fallback: '' })
        .usage(`使用教程 https://github.com/KIRA2ZERO/koishi-plugin-hpoi`)
        .example('hpoi 一天热度 手办 -r 全年龄 -n 36 -k miku')
        .action(({ session, options }, order, category) => {
        const hpoi = new class_1.Hpoi(ctx, session);
        hpoi.search(options, order, category);
    });
    ctx.command('hpoi.update 推送hpoi最新入库手办')
        .action(({ session }) => {
        const hpoi = new class_1.Hpoi(ctx, session);
        hpoi.update();
    });
    ctx.command('hpoi.clear 清空hpoi_table表中的数据')
        .action(({ session }) => {
        const hpoi = new class_1.Hpoi(ctx, session);
        hpoi.clear();
    });
}
exports.apply = apply;
