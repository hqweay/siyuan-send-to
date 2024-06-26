## 更新

- 2024/04/16 做了个使用 Gemini 总结选中块内容的例子：搭配快捷指令使用 [Gemini 总结](https://www.icloud.com/shortcuts/bf7b65fddd6a416d9a824d238531d13e)
- 使用步骤：
  - 【 ==使用 Arc 浏览器示例，若使用其它浏览器需调整快捷指令内调用浏览器的参数== 】
  - 安装 Gemini 总结 的快捷指令
  - 在 插件内 配置 `Gemini 总结====shortcuts://run-shortcut?name=Gemini 总结剪贴板` 开启
  - 在思源笔记内选中块-插件-通过URL发送到-Gemini 总结

- 效果
  - ![](asset/02.png)
  - ![](asset/03.png)




## 说明

思路是【获取选中块内容】后在思源笔记内部【进行分发、处理等操作】。

说明：写了个 demo，大概能走通流程。期望稳定的朋友请勿下载。提上集市是希望感兴趣的朋友能看到，可以提提想法。

希望达到效果：
- 【获取选中块内容】支持自定义（比如 支持自定义分隔符）
- 【进行分发、处理等操作】支持自定义（比如利用 URL Scheme 添加到提醒事项等）

现在做了几个例子：

- 将块内容发送到提醒事项（依赖 Apple 生态的快捷指令）
- 将块内容发送到 Google 搜索
- 将块内容生成卡片并支持下载
- 使用 Gemini 进行总结

期望能实现的场景示例：
- 一键分享至社交平台
- 能识别内容中的时间并添加至任务/提醒 App


## 效果

![](asset/01.png)

![](preview.png)