"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hpoi = void 0;
const koishi_1 = require("koishi");
const cheerio = __importStar(require("cheerio"));
class Hpoi {
    constructor(ctx, session) {
        this.ctx = ctx;
        this.session = session;
        this.category_dict = {
            '手办': 'category=100',
            '动漫模型': 'category=200',
            'Doll娃娃': 'category=300',
            '真实模型': 'category=500',
            '毛绒布偶': 'category=400',
            '全部': 'category=10000'
        };
        this.order_dict = {
            '发售': 'order=release',
            '入库': 'order=add',
            '总热度': 'order=hits',
            '一周热度': 'order=hits7Day',
            '一天热度': 'order=hitsDay',
            '评价': 'order=rating'
        };
        this.r18_dict = {
            '不限': 'r18=199',
            '全年龄': 'r18=0',
            '轻微露出': 'r18=12',
            '一般露出': 'r18=15',
            '低于轻微露出': 'r18=115',
            '无': 'r18=-1'
        };
        this.ctx.database.get('hpoi_table', {})
            .then(row => {
            if (typeof (row[0]) === "undefined") {
                const local_id_list = [];
                ctx.database.create('hpoi_table', { id: local_id_list });
            }
        });
    }
    // hpoi搜索
    search(options, order, category) {
        if (!(order in this.order_dict)) {
            this.session.send((0, koishi_1.h)('quote', { id: this.session.messageId }) + `【${order}】不在参数列表`);
            return;
        }
        if (!(category in this.category_dict)) {
            this.session.send((0, koishi_1.h)('quote', { id: this.session.messageId }) + `【${category}】不在参数列表`);
            return;
        }
        if (!(options.r18 in this.r18_dict)) {
            this.session.send((0, koishi_1.h)('quote', { id: this.session.messageId }) + `【${options.r18}】不在参数列表`);
            return;
        }
        if (options.number > 36) {
            this.session.send((0, koishi_1.h)('quote', { id: this.session.messageId }) + '一次索引个数最多36个');
            return;
        }
        this.session.send((0, koishi_1.h)('quote', { id: this.session.messageId }) + '请稍等...');
        const { r18, number, keyword } = options;
        const url = `https://www.hpoi.net/hobby/all?${this.order_dict[order]}&${this.r18_dict[r18]}&workers=&view=4&${this.category_dict[category]}&keyword=${keyword}`;
        this.ctx.http.get(url)
            .then(result => {
            let $ = cheerio.load(result), messageList = [];
            for (let i = 1; i <= number; i++) {
                let picTitle = $(`#content > div.row > div:nth-child(${i}) > p`).text(), picUrl = $(`#content > div.row > div:nth-child(${i}) > a > img`).attr('src'), hobbyUrl = `https://www.hpoi.net/` + $(`#content > div.row > div:nth-child(${i}) > a`).attr('href'), info = `${i}_${picTitle}_${hobbyUrl}`, message = (0, koishi_1.h)('message', (0, koishi_1.h)('image', { url: picUrl }), info);
                if (hobbyUrl.split('https://www.hpoi.net/')[1] === 'undefined') {
                    this.session.send('索引关键词无返回结果');
                    break;
                }
                messageList.push(message);
            }
            this.session.send((0, koishi_1.h)('message', { forward: true }, messageList));
        });
    }
    // hpoi推送
    async update() {
        const row = await this.ctx.database.get('hpoi_table', {}), local_id_list = row[0]?.id || [];
        const page = await this.ctx.http.get(`https://www.hpoi.net/hobby/`);
        const $ = cheerio.load(page);
        let new_id_list = [];
        const pageMain = await this.ctx.puppeteer.page();
        // 解析更新
        for (let count = 1; count <= 12; count++) {
            const link = `https://www.hpoi.net/` + $(`#hpoi-dataBase-Box-List > div:nth-child(${count}) > div > a`).attr('href'), id = link.match(/hobby\/(\d+)/)[1];
            // 有本地库中不存在的id号则推送    
            if (local_id_list.indexOf(id) === -1) {
                new_id_list.push(id);
                await pageMain.goto(link);
                await pageMain.waitForSelector(`body > div.container-fluid.hpoi-banner-box > div.container > div > div.col-md-18`);
                const data = await pageMain.$(`body > div.container-fluid.hpoi-banner-box > div.container > div > div.col-md-18`);
                data.screenshot()
                    .then(image => {
                    this.session.send((0, koishi_1.h)('message', '检测到新入库手办', koishi_1.h.image(image), link));
                });
                await sleep(3000);
            }
        }
        // pageMain.close()
        // 将推送的id保存至本地库中
        await this.ctx.database.set("hpoi_table", {}, { id: [...local_id_list, ...new_id_list] });
    }
    // 清空数据库
    async clear() {
        const ctx = this.ctx;
        const session = this.session;
        await ctx.database.remove('hpoi_table', {});
    }
}
exports.Hpoi = Hpoi;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
