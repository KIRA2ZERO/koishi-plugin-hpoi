import { Context, Schema ,h} from 'koishi'

import * as cheerio from 'cheerio'

export const name = 'hpoi'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {

  const category_dict = {
    '手办':'category=100',
    '动漫模型':'category=200',
    'Doll娃娃':'category=300',
    '真实模型':'category=500',
    '毛绒布偶':'category=400',
    '全部':'category=10000'
  },
  order_dict = {
    '发售':'order=release',
    '入库':'order=add',
    '总热度':'order=hits',
    '一周热度':'order=hits7Day',
    '一天热度':'order=hitsDay',
    '评价':'order=rating'
  },
  r18_dict = {
    '不限':'r18=199',
    '全年龄':'r18=0',
    '轻微露出':'r18=12',
    '一般露出':'r18=15',
    '低于轻微露出':'r18=115',
    '无':'r18=-1'
  }

  ctx.command('hpoi <order:string> <category:stirng> 返回hpoi维基的索引结果(默认前10条)','手办维基索引').alias('手办维基')
  .option('r18', '-r <r18:string> 设定r18阈值(不限、全年龄、低于轻微露出、轻微露出、一般露出),默认值:不限',{fallback:'不限'})
  .option('number','-n <number:posint> 设定索引个数,默认值:10',{fallback:10})
  .option('keyword','-k <keyword:string> 设定索引关键词',{fallback:''})
  .usage(`使用教程 https://github.com/KIRA2ZERO/koishi-plugin-hpoi`)
  .example('hpoi 一天热度 手办 -r 全年龄 -n 36 -k miku')
  .action(({session,options},order,category) => {

    if(!(order in order_dict)){session.send(h('quote',{id:session.messageId})+`【${order}】不在参数列表`);return}
    if(!(category in category_dict)){session.send(h('quote',{id:session.messageId})+`【${category}】不在参数列表`);return}
    if(!(options.r18 in r18_dict)){session.send(h('quote',{id:session.messageId})+`【${options.r18}】不在参数列表`);return}
    if(options.number>36){session.send(h('quote',{id:session.messageId})+'一次索引个数最多36个');return}

    session.send(h('quote',{id:session.messageId}) + '请稍等...');

    const {r18,number,keyword} = options;
    const url = `https://www.hpoi.net/hobby/all?${order_dict[order]}&${r18_dict[r18]}&workers=&view=4&${category_dict[category]}&keyword=${keyword}`
    ctx.http.get(url)
    .then(result =>{
      let $ = cheerio.load(result),
          messageList = [];
      for(let i = 1;i <= number ;i ++){
        let picTitle = $(`#content > div.row > div:nth-child(${i}) > p`).text(),
            picUrl = $(`#content > div.row > div:nth-child(${i}) > a > img`).attr('src'),
            hobbyUrl = `https://www.hpoi.net/` + $(`#content > div.row > div:nth-child(${i}) > a`).attr('href'),
            info = `${i}_${picTitle}_${hobbyUrl}`,
            message = h('message',h('image',{url:picUrl}),info);
        if(hobbyUrl.split('https://www.hpoi.net/')[1] === 'undefined'){session.send('索引关键词无返回结果');break}
        messageList.push(message)
      }
      session.send(h('message',{forward:true},messageList));
    }) 
    
  })
}
