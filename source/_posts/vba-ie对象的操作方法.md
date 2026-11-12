---
title: VBA IE对象的操作方法
tags: []
id: '352'
categories:
  - - IT技术
date: 2019-04-15 21:24:38
---

## VBA IE对象的操作方法

> 原文日期：2013-10-27 11:39:29  
> 转载

### 标签

- [vba](http://search.sina.com.cn/?c=blog&q=vba&by=tag)
- [ie](http://search.sina.com.cn/?c=blog&q=ie&by=tag)
- [标签](http://search.sina.com.cn/?c=blog&q=%B1%EA%C7%A9&by=tag)
- [对象](http://search.sina.com.cn/?c=blog&q=%B6%D4%CF%F3&by=tag)
- [图片](http://search.sina.com.cn/?c=blog&q=%CD%BC%C6%AC&by=tag)
- [it](http://search.sina.com.cn/?c=blog&q=it&by=tag)

**分类：** [电子商务](http://blog.sina.com.cn/s/articlelist_1679244812_8_1.html)

---

## IE和文档对象模型

在实际工作中，常常需要处理网站和网页相关的问题，比如如何下载网页数据、网页间的通信、网页控制等。对于使用 VB/VBA/脚本或其他支持自动化对象（AUTOMATION）的语言编程的开发者，掌握对象模型非常重要。通过 IE 的自动化对象（`InternetExplorer.Application`）或 IE 控件（Microsoft Internet Controls），以及标准的文档对象模型（Document），可以将网页视为对象进行控制。

以下代码可在 VBA 环境下试验：

```vba
Set ieA = CreateObject("InternetExplorer.Application") ' 创建对象
ieA.Visible = True ' 使IE页面可见
ieA.navigate "about:blank" ' 打开空白页
```

这段代码会创建一个 IE 应用程序对象，并打开一个空白网页。该网页独立于 VBA 应用程序（如 Word 或 Excel）之外。关闭网页需调用 `ieA.Quit`，仅关闭 VBA 或 `Set ieA = Nothing` 并不会退出网页。

你也可以将 `navigate` 的参数替换为网站地址或本地文档路径。例如：

```vba
ieA.navigate "C:\XXX.HTM"
```

另一种方法是在 VB/VBA 的窗体或工作表上添加 Web Browser 控件。注意，Web 控件和独立 IE 程序并不完全相同，例如 Web 控件不能用 `Quit` 方法退出，IE 的 `navigate` 方法没有复杂的 POST 参数，但文档对象的引用方法基本一致。

如果访问已存在的网页（如 [www.excelhome.net](http://www.excelhome.net/)），由于可能存在异步延时，通常需要根据 `ReadyState` 状态判断网页是否加载完成：

```vba
Sub LOADIE()
    Set ieA = CreateObject("InternetExplorer.Application")
    ieA.Visible = True
    ieA.navigate "http://www.ooxx.com/"
    Do Until ieA.ReadyState = 4
        DoEvents
    Loop
End Sub
```

若需访问 IE 应用程序对象的相关声明和事件，可引用 IE 控件（SHDOCVW.DLL，Microsoft Internet Control）。

---

### 文档对象模型的基本操作

通过 `ieA` 对象，可以操作 IE，也可以访问其属性。例如：

```vba
Set doc = ieA.Document ' 获取网页文档对象
doc.body.innerHTML = "Hello" ' 在 BODY 标签内添加文字
```

`Document` 是文档对象模型的基础。获取 `Document` 后，可以修改网页、读写内容或触发事件。每个 URL 对应一个 `Document`，需确保 `ReadyState` 为 4 后再操作。

在 `Document` 下可获取 `documentElement` 和 `body` 两个节点：

```vba
Set doc = ieA.Document
Set xbody = doc.Body ' 获取 body 对象
Set xDoc = doc.documentElement ' 获取根节点
```

常用属性：

- `对象.innerHTML`：对象内部的 HTML 文本
- `对象.outerHTML`：对象的 HTML，包括自身标签
- `对象.innerText`：对象内部的纯文本
- `对象.outerText`：对象的文本，包括自身

抓取网页所有 HTML 内容：

```vba
Set doc = ieA.Document
Set xDoc = doc.documentElement
strX = xDoc.outerHTML
```

类似 Excel 的对象模型：

```vba
Set shDocX = Application.ActiveWorkbook.ActiveSheet
Set rngX = shDocX.Range("A1")
X = rngX.Value
```

---

### 节点与集合

网页中的每个标签节点下都有 `ChildNodes` 集合，包含直属子节点。例如：

```vba
Set doc = ieA.Document
Set xbody = doc.body
Set xI00 = xbody.ChildNodes.item(0) ' 第1个节点
Set xI01 = xbody.ChildNodes.item(1) ' 第2个节点
MsgBox xI00.innerText
MsgBox xI01.outerHTML
```

注意：

- 集合从 0 开始计数
- 使用 `Length` 属性获取数量，而不是 `Count`

除了 `ChildNodes`，还有 `All` 集合，包含文档或节点下的所有元素：

```vba
Set doc = ieA.Document
Set xCols = doc.All ' 文档所有节点
Set xbCols = doc.body.All ' body 下所有节点
```

通过 ID 获取节点：

```vba
Set tag1 = doc.All.item("myTag").item(0)
' 或更直接
Set tag1 = doc.getElementById("myTag")
' 也可直接访问
strX = doc.All.myTag.innerHTML
```

通过标签名获取集合：

```vba
Set mydivs = doc.getElementsByName("div")
```

---

### FORMS 集合

大部分网页数据提交通过 FORM 标签。FORMS 集合可用于区分不同的 FORM 节点：

```vba
Set myForms = doc.Forms ' 获取所有 FORM
Set frmX = myForms.item(0) ' 第1个 FORM
```

FORM 节点可通过 `submit` 方法提交数据：

```vba
frmX.submit
```

如需动态创建 FORM 和 INPUT 节点，可使用 `createElement` 和 `appendChild` 方法，这部分内容可后续补充。

---

*本文到此结束，后续内容敬请期待。*