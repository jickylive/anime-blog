---
title: VBA IE对象的操作方法
tags: []
id: '352'
categories:
  - - IT技术
date: 2019-04-15 21:24:38
---

## VBA?IE对象的操作方法

(2013-10-27 11:39:29)

![](http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif)转载_▼_

标签：

### [vba](http://search.sina.com.cn/?c=blog&q=vba&by=tag)

### [ie](http://search.sina.com.cn/?c=blog&q=ie&by=tag)

### [标签](http://search.sina.com.cn/?c=blog&q=%B1%EA%C7%A9&by=tag)

### [对象](http://search.sina.com.cn/?c=blog&q=%B6%D4%CF%F3&by=tag)

### [图片](http://search.sina.com.cn/?c=blog&q=%CD%BC%C6%AC&by=tag)

### [it](http://search.sina.com.cn/?c=blog&q=it&by=tag)

分类： [电子商务](http://blog.sina.com.cn/s/articlelist_1679244812_8_1.html)

## IE和文档对象模型

我们在实际工作中遇到网站和网页相关往往要涉及到这类问题：如何下载网页数据？网页之间的通讯是怎么实现的、它们能不能被控制等等。分析网页根据不同协变色镜可以用不同的角度去看，如数据流、标记，不过，如果你是用VB/VBA/脚本或其它支持自动化对象（AUTOMATION）的语言编程，有一个值得了解方法是掌握对象模型，将网页视为对象来自行控制，这个方法需要了解的是IE的自动化对象(InternetExplorer.Application)或IE控件（Microsoft Internet Controls），以及标准的文档对象模型（Document）
以下代码在VBA环境下进行试验——我不在意你是用WORD还是EXCEL——可以先做一行过程模块，也可以在立即窗口下逐行输入：

Set ieA = CreateObject("InternetExplorer.Application")? ‘创建对象
ieA.Visible = True?? ‘使IE页面可见，做完这一步，在VBA之外可以看到一个新的IE
ieA.navigate "about:blank"?? ‘空白页

这几行代码的作用是创建一个IE应用程序对象（是的，相当于一个IE应用程序），并打开一个空白的网页。这个网页独立于VBA的应用程序（WORD或EXCEL）之外，事实上，你必须自已关掉它，或者用ieA.Quit下令退出——注意一下，单纯的关闭VBA或SET ieA=nothing是不会退出这个网页的。当然，如果你正在上网并且愿意，在第3行也可以将第3行的字符串替换成一个网站的名字，或者替换成一个你主机中的文档名——比如C:\\XXX.HTM，或D:\\PIC\\XXX.GIF，正如你在IE地址栏输入名称浏览这些文档一样。另一种可选择的方法是直接在VB/VBA的窗体或工作表等宿主上增加一个的WEB BROWS 浏览器控件，也相当于上面的IE应用程序
注：WEB BROWSE控件和单独的IE程序并不是完全相同的，例如WEB控件不能用QUIT方法退出，IE的NAVIGETE方法没有复杂的POST参数，但文档对象都可以用同样的方法引用，大部分事件和方法也通用
另外，如果访问一个已经存在的网页，例如[WWW.EXCELHOME.NET](http://www.excelhome.net/)，因为可能产生异步的延时，所以如果不是立即窗口，往往根据READYSTATE的状态保证网页加载完毕：

SUB LOADIE()?? ‘ 在代码的常见的处理情况
Set ieA = CreateObject("InternetExplorer.Application")
ieA.Visible = True
ieA.navigate "[WWW.OOXX.COM](http://www.ooxx.com/)"? ‘←打开某个网页，要一定时间，但代码会往下执行
DO UNTIL ieA.Readystate=4?? ‘? 检查网页是否加载完毕（4表示完全加载）
?? DOEVENTS??????????????? ‘ 循环中交回工作权限给系统，以免“软死机”
LOOP? 
END SUB

如果对这个IE应用程序对象的相关声明和事件感兴趣，就要引用IE控件找到对象中的常量和事件：SHDOCVW.DLL(MICROSOFT INTERNET CONTROL)
你可以看到的是，通过ieA——就是创建的对象——我们可以操作它，也可以访问它的属性。下面继续，如果前面你是在命令行输入，打开的那个空白网页没有关闭，变量是继续有效的：
Set doc = ieA.Document???? ‘取得网页的文档对象
doc.body.innerHTML = "Hello"?? ‘在文档的BODY标记内加上标记文字HELLO
网页上写了一行小字，HELLO......通用的惯例，当然你可以写上其它的什么，HI，我爱你，EXCEL，HOME之类，但这不是最需要的关心的问题，我们要知道这个对象之下的结构。
从文档对象（Document）以下展开的对象模型，它代表网页的内容，和前面那个IE的应用程序不是同一个体系——请注意这一点——如果我们编程时要用到对应的对象事件和常量，在VB/VBA中要引用的类型库是MSHTML.TLB（MIRCOSOFT HTML OBJECT LIBRARY）
Documnet（文档）是文档对象模型的基础，相当于OFFICE对象中的APPLICATION，取得Document之后，不论修改网页还是读写网页，还是触发事件，一切都好说，每个URL都对应有一个Documnet（这是假如定成功导航Navigate到那个URL完成，因此之前要求确定IE对象READSTATE，以确定对应URL的Document打开了）
在Documnet之下可以取得documentElement和body两个节点：

......????????????? ‘前面已经取得了ieA对象，并打开空白网页，不再重复
set doc=ieA.Document
set xbody=doc.Body?? ‘取得body对象
set xDoc=doc. documentElement? ‘取得根节点

body前面已经说过，相当于

标记的对象，根节点相当于网页中的标记元素的对象，MHTML的类型库定义里，它们都属于HTMLHtmlElement类型的对象，下面我把这种类型的对象称为一个“节点”，不过要注意的是文档对象不是节点对象，它是HTMLDocument类型。根节点和body节点不同的是根节点包括整个网页，在HTML的文档对象模型中，这类对象有几种属性可以取得其中的内容： 对象.innerHtml?? ‘对象内部的HTML文本 对象.OuterHtml?? ‘对象中的HTML文本，包括对象本身的HTML标记在内 对象.innerText??? ‘对象内部的TEXT，不包括HTML标记 对象.OuterText??? ‘同上，包括对象本身的文本 所以，如果我们要抓取某个网站的所有HTML内容，代码可以这样写：

......????????????? ‘前面已经取得了ieA对象，并打开某URL网页
set doc=ieA.Document
set xDoc=doc. documentElement? ‘取得根节点
strX=xDoc.OuterHtml??? ‘取得所有的HTML内容

这种取值的方式不妨可以当成EXCEL的单元格取值：

set shDocX=APPLICATION.ACTIVEWORK.ACTIVESHEET? ‘从应用程序、工作簿一直定位到当前工作表，这是EXCEL的工作簿对象模型
set rngX=shDocX.Rang(“a1”)?? ‘取得单元格(其实不一定是一个格子，只要是RANGE类型对象即可)
X=rngX.VALUE??? ‘取得VALUE值，也可以取只读的TEXT

在网页上看到的标记，就是根节点或body之下的标记节点对象（node）。每一个标记节点对象之下都有一个名为ChildNodes的集合，它包含了“直属于本节点下的标记”，听起来有点抽象——这么说吧，就象是文件目录，根目录下的子目录……

HELLO

001

在上面的网页例子里，HTML标记是文档的根节点，是Document的Childnodes集合中的一个成员（还是要提请注意，Document不是节点，是另一种类型对象：上一级文档，但它可以有下级节点集合，正如磁盘可以有下级目录，但它本身不是目录），BODY是根节点的ChildNodes集合中的一个成员，而DIV和P两个节点则是BODY的ChildNodes集合中的两个成员，同样也有自已的Childnoes集合——不过我们很直观地可以看到，它们的下级集合是空的。
用程序代码程序问的过程是怎么样的呢？这种“目录式”层次的方式似乎是很有序的，那么，把上面的内容另存为一个HTML文档，放到硬盘的某个目录下，自已写一段代码做完前面的工作吧，我不代劳了：

…….假定你已经用ieA为名的对象浏览了上述网页文件
set doc=ieA.Document
set xbody=doc. body?? ‘取得body节点
set xI00= xbody.Childnodes.item(0)? ‘取得body的第1个节点
set xI01=xbody.Childnodes.item(0)? ‘取得bdoy的第2个节点
Msgbox xI00.innerText?? ‘显示第1个节点（DIV）的文本
Msgbox xI01.outerHtml?? ‘显示第2个节点（P）的完整内容

在VB/VBA/VBS系列的语言中，item是默认方法，可以省略，不过我在这里还是写出来，加深印象。
应该注意的是，文档对象模型中，集合与OFFICE的集合有所不同，首先，集合是从0开始计数的，习惯了OFFICE VBA编程的朋友们一定要注意，不同的对象架构有不同的方式，这里用的是“0集合”，其次，它用的计数属性是Length而不是Count，不要习惯性地打上Childnode.Count查看集合的数量了
除了ChildNodes集合，大家在网页文档对象中还常见到的就是很大气的一种集合：All集合，这是“最糊涂”的一种集合，文档和各级节点都带有这个集合，正如这个名字所示，它是不分层次的，但用起来也很方便：

…….
Set doc=ieA.Document
Set xCols=doc.All?? ;取得文档中的所有节点集合
Set xbCols=doc.body.All ;取得body节点下所有的节点集合

虽然任何标记节点都有ALL集合，但我们还是喜欢用DOCUMENT的ALL，原因无它，文档最大，一锅烩的ALL找起来也最合适。
ALL查找是有条件的：如果这个标记没有ID，你无法查到它的名字：

hi,you

excel

set tag1=doc.All.item(“myTag”).item(0)?? ‘返回标记内部ID=myTag的集合并取第一个

最初在我个人看来，如果网页中的HTML标记已经有了ID，不如用文档对象的getElementById直接返回一个对象更直接，这个方法不需要经过集合：

set tag1=doc. getElementById(“myTag”)? ‘返回第一个内部标有ID=myTag的标记

不过，ALL集合有一个很方便的特性——至少在初学者看来是很好用的：ID可以挂到ALL集合之下：

strX=doc.All.mytag.innerhtml???? ‘呜呜呜，太好用了

另一种方法是以标记名为集合，要用到文档对象的getElementsByName方法：

set mydivs=doc. getElementsByName(“div”)?? ‘取得所有DIV标记，注意还是集合

 今天先写到这里，下回......不定期休息

(补一小段,特别增加，关于FORMS,某位兄弟，下面真的真的没有了，不要期望我上传实例......)

关于文档对象的FORMS集合，因为大部分网页的数据提交都是通过FORM标记提交的，因此FORMS集合在没有网页中FORM标记没有ID标记或ID标记重复的情况下，可以用来区分不同的FORM节点：

QUOTE:

Set myForms=doc.Forms??? ‘取得所有的FORM标记 Set frmX=myForms.item(0)? ‘第1个FORM

FORM标记节点代表的对象是很多朋友关心的内容——在网页对象中，它可以发送数据到服务器，使服务器刷新网页（实际上是服务器按某个格式约定发回数据），我们可以把网页的FORM看成是一个远程的函数调用接口，FORM标记中的ACTION指向的URL地址就是函数入口，而FORM标记内的各个INPUT标记节点就是函数的参数，当发出FORM.Submit方法时，就是远程调用函数了，在服务器端，诸如ASP，PHP就是老老实实找FORM的参数，不管你是用GET还是POST：

QUOTE:

frmX.submit?? ‘是的，只要Submit，相当于用户在页面上按下FORM的发送按键

但它的参数，也就是INPUT标记们怎么办？当然你可以自已修改，访问,唔......如果你分析了已经存在的网页，想从一个空白页面（ABOUT:BLANK）用VBA“凭空”生成FORM和INPUT节点，光凭上面的方法还不够，我们还要“创造节点”（**createElement\_x**）并连入文档对应的位置（**appendChild**），但这已经是另一个问题了