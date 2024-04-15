import { Plugin, showMessage, confirm, fetchSyncPost, Dialog } from "siyuan";

import { SettingUtils } from "./libs/setting-utils";
const STORAGE_NAME = "send-to-config";

import CardView from "@/pages/card.svelte";

const defaultConfig = {
  InputArea:
    "发送到提醒事项====shortcuts://run-shortcut?name=从剪贴板添加提醒事项\nGoogle 搜索====https://www.google.com/search?q=${content}",
  isToClipboard: true,
  separator: "",
};

export default class PluginSample extends Plugin {
  private blockIconEventBindThis = this.blockIconEvent.bind(this);

  private settingUtils: SettingUtils;

  private blockIconEvent({ detail }: any) {
    let resultText = this.getContent(detail);

    detail.menu.addItem({
      iconHTML: "",
      label: this.i18n.menuByURL,
      submenu: this.initMenuByURL(resultText),
    });
    detail.menu.addItem({
      iconHTML: "",
      label: this.i18n.menuByScript,
      submenu: this.initMenuByScript(resultText),
    });
  }

  //@todo 可以自定义内容获取逻辑
  private getContent(detail) {
    let resultText = "";
    const separator = this.settingUtils.get("separator") || "";

    detail.blockElements.forEach((element) => {
      resultText += element.innerText + separator;
    });
    return resultText;
  }

  //@todo 可以自定义内容处理逻辑
  private initMenuByScript(resultText) {
    return [
      {
        label: "卡片分享",
        click: () => {
          // showMessage("尚未实现");
          this.showDialog(resultText);
        },
      },
      {
        label: "自定义脚本处理",
        click: () => {
          showMessage("尚未实现");
        },
      },
    ];
  }
  private writeToClipboard(resultText) {
    if (this.settingUtils.get("isToClipboard") && navigator.clipboard) {
      navigator.clipboard.writeText(resultText).then(
        function () {
          console.log("文本已成功复制到剪贴板");
        },
        function (err) {
          console.error("写入剪贴板时出错:", err);
        }
      );
    } else {
      console.warn("浏览器不支持 Clipboard API");
    }
  }

  private jumpTo(resultText, url) {
    resultText = encodeURIComponent(resultText);
    url = url.replace("${content}", resultText);

    window.open(url);
  }
  private initMenuByURL(resultText) {
    return this.settingUtils
      .get("InputArea")
      .split("\n")
      .map((line) => {
        const item = line.split("====");
        if (item.length !== 2) {
          showMessage(`配置有误，请检查`);
        }
        console.log(item);
        return {
          label: item[0],
          click: () => {
            this.writeToClipboard(resultText);
            this.jumpTo(resultText, item[1]);
          },
        };
      });
  }

  private showDialog(resultText) {
    let dialog = new Dialog({
      title: `卡片分享`,
      content: `<div id="cardPanel" class="b3-dialog__content"></div>`,
      width: this.isMobile ? "92vw" : "720px",
      destroyCallback(options) {
        pannel.$destroy();
      },
    });

    // dialog.element.querySelector("#helloPanel").createElement("iframe");
    //     dialog.element.querySelector(
    //       "#helloPanel"
    //     ).innerHTML = ;

    var cardPanel = dialog.element.querySelector("#cardPanel");
    cardPanel.style.margin = "0 auto";
    console.log(resultText);
    let pannel = new CardView({
      props: {
        content: resultText,
      },
      target: dialog.element.querySelector("#cardPanel"),
    });
  }

  onload() {
    this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
    this.settingUtils = new SettingUtils(this, STORAGE_NAME);

    try {
      this.settingUtils.load();
    } catch (error) {
      console.error(
        "Error loading settings storage, probably empty config json:",
        error
      );
    }

    this.settingUtils.addItem({
      key: "isToClipboard",
      value: true,
      type: "checkbox",
      title: "写入剪贴板？",
      description: "用于搭配快捷指令从剪切板获取数据等场景",
    });

    this.settingUtils.addItem({
      key: "separator",
      value: "",
      type: "textinput",
      title: "多行内容分隔符",
      description: "选中多行时，拼接使用分隔符。默认为空",
    });

    this.settingUtils.addItem({
      key: "InputArea",
      value: defaultConfig.InputArea,
      type: "textarea",
      title: "自定义链接",
      description:
        "以 名称====链接 配置；换行分隔。${content} 将会替换为选中的内容",
    });

    this.settingUtils.addItem({
      key: "restore",
      value: "",
      type: "button",
      title: "恢复默认值",
      button: {
        label: "确认",
        callback: () => {
          this.settingUtils.set("InputArea", defaultConfig.InputArea);
        },
      },
    });
  }
}
