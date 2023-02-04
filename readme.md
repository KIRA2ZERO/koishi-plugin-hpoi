# koishi-plugin-hpoi

[![npm](https://img.shields.io/npm/v/koishi-plugin-hpoi?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-hpoi)

返回(手办)hpoi维基索引

# 指令：hpoi

+ 基本语法：`hpoi <order:string> <category:stirng>`
+ 别名： `手办维基`
+ 选项：`r18 -r <r18:string> 设定r18阈值(不限、全年龄、低于轻微露出、轻微露出、一般露出),默认值:不限`  
+ 选项: `number -n <number:posint> 设定索引个数,默认值:10`
+ 选项: `keyword','-k <keyword:string> 设定索引关键词`
+ 用法：`order 的可选参数有（发售、入库、总热度、一周热度、一天热度、评价\n`
+ 用法: `category 的可选参数有(手办、动漫模型、Doll娃娃、真实模型、毛绒布偶、全部)`
+ 注意事项：`确保输入的参数在参数列表中并且索引个数最大为36`
+ 示例：`hpoi 一天热度 手办 -r 全年龄 -n 36 -k miku`