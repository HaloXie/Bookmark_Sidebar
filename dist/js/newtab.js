/*! (c) Philipp König under GPL-3.0 */
(e=>{"use strict";window.EntryHelper=function(e){let t=!1,s={},a={},o={},l={bookmarks:{},directories:{},pinned:{}};this.init=(e=>(t=!0,new Promise(t=>{this.update(e).then(t)}))),this.initOnce=(()=>new Promise(e=>{t?e():this.init().then(e)})),this.getAmount=(t=>{if(i(),0===Object.keys(s).length&&(s=e.helper.model.getData("u/entryAmounts")),s&&s[t]){let e=s[t].visible;return a.showHidden&&(e+=s[t].hidden),e}return null}),this.getAllPinnedData=(()=>Object.values(l.pinned)),this.getAllBookmarkData=(()=>Object.values(l.bookmarks)),this.getData=(e=>{let t=null;return"object"==typeof l.bookmarks[e]?(t=l.bookmarks[e],"object"==typeof l.pinned[e]&&(t.pinnedIndex=l.pinned[e].index)):"object"==typeof l.directories[e]&&(t=l.directories[e]),t}),this.addData=((e,t,s)=>{"object"==typeof l.bookmarks[e]?("pinnedIndex"===t&&"object"==typeof l.pinned[e]&&(l.pinned[e].index=s),l.bookmarks[e][t]=s):"object"==typeof l.directories[e]&&(l.directories[e][t]=s)}),this.isVisible=(e=>{let t=!1;return"object"==typeof l.bookmarks[e]?t=!1===l.bookmarks[e].hidden:"object"==typeof l.directories[e]&&(t=!1===l.directories[e].hidden),t}),this.update=((t=null)=>new Promise(a=>{i();let n=[e.helper.model.call("viewAmounts")];null===t&&n.push(e.helper.model.call("bookmarks",{id:0})),Promise.all(n).then(i=>{o=i[0],null===t&&i[1]&&i[1].bookmarks&&i[1].bookmarks[0]&&i[1].bookmarks[0].children&&(t=i[1].bookmarks[0].children),l={bookmarks:{},directories:{},pinned:{}},s={bookmarks:{visible:0,hidden:0},directories:{visible:0,hidden:0},pinned:{visible:0,hidden:0}},r(t),e.helper.model.setData({"u/entryAmounts":s}),a()})}));let i=()=>{a=e.helper.model.getData(["u/hiddenEntries","u/additionalInfo","u/pinnedEntries","u/showHidden"])},r=(e,t=[],s=!1)=>{e.forEach(e=>{let l=[...t];"0"!==e.parentId&&l.push(e.parentId),e.additionalInfo=a.additionalInfo[e.id]||{},e.hidden=s||!0===a.hiddenEntries[e.id],e.parents=l,e.views={startDate:+new Date(Math.max(e.dateAdded,o.counterStartDate)),total:0},e.url?p(e):e.children&&n(e)})},n=e=>{e.childrenAmount={bookmarks:0,directories:0,total:0},e.parents.forEach(e=>{l.directories[e].childrenAmount.directories++}),l.directories[e.id]=e,r(e.children,e.parents,e.hidden),e.isDir=!0,e.childrenAmount.total=e.childrenAmount.bookmarks+e.childrenAmount.directories,e.views.perMonth=Math.round(e.views.total/d(e.views.startDate)*100)/100,s.directories[e.hidden?"hidden":"visible"]++},p=e=>{let t=0,i=0;if(o.viewAmounts[e.id]&&(t=o.viewAmounts[e.id].c,i=o.viewAmounts[e.id].d||0),e.views.total=t,e.views.lastView=i,e.views.perMonth=Math.round(t/d(e.views.startDate)*100)/100,e.parents.forEach(e=>{l.directories[e]&&(l.directories[e].childrenAmount.bookmarks++,l.directories[e].views.total+=t,l.directories[e].views.lastView=Math.max(l.directories[e].views.lastView||0,i))}),e.pinned=!1,l.bookmarks[e.id]=e,s.bookmarks[e.hidden?"hidden":"visible"]++,a.pinnedEntries[e.id]){e.pinned=!0;let t=Object.assign({},e);t.index=a.pinnedEntries[e.id].index,delete t.parents,delete t.parentId,l.pinned[e.id]=t,s.pinned[e.hidden?"hidden":"visible"]++}},d=e=>Math.max(1,Math.round((+new Date-e)/2627999942.4))},window.EditHelper=function(t){let s=!1;this.init=(async()=>{a(),t.opts.elm.body.attr(t.opts.attr.pos,t.helper.model.getData("b/sidebarPosition")),e("<a />").addClass(t.opts.classes.edit).appendTo(t.opts.elm.body),location.href.search(/#edit$/)>-1&&i()}),this.isEditMode=(()=>s);let a=()=>{t.opts.elm.body.on("click","a."+t.opts.classes.edit,e=>{e.preventDefault(),s||i()}).on("click","menu."+t.opts.classes.infoBar+" > a",s=>{s.preventDefault();let a=e(s.currentTarget);a.hasClass(t.opts.classes.cancel)?l():a.hasClass(t.opts.classes.save)&&o().then(()=>{l()})})},o=()=>new Promise(s=>{let a=[];t.opts.elm.topNav.find("a."+t.opts.classes.link).forEach(t=>{let s=e(t).text().trim(),o=(e(t).data("href")||e(t).attr("href")).trim();s&&s.length>0&&o&&o.length>0&&a.push({label:s,url:o})});let o=+new Date,l=t.helper.template.loading().appendTo(t.opts.elm.body);t.opts.elm.body.addClass(t.opts.classes.loading),t.helper.model.setData({"n/searchEngine":t.opts.elm.search.wrapper.children("select")[0].value,"n/topPagesType":t.opts.elm.topPages.children("select")[0].value,"n/shortcuts":a}).then(()=>e.delay(Math.max(0,1e3-(+new Date-o)))).then(()=>{t.opts.elm.body.removeClass(t.opts.classes.loading),l.remove(),s()})}),l=()=>{s=!1,history.pushState({},null,location.href.replace(/#edit/g,"")),t.opts.elm.body.removeClass(t.opts.classes.edit),t.opts.elm.search.wrapper.children("select").remove(),t.opts.elm.topPages.children("select").remove(),t.opts.elm.topNav.find("a:not(."+t.opts.classes.link+")").remove(),t.helper.search.updateSearchEngine(t.helper.model.getData("n/searchEngine")),t.helper.topPages.setType(t.helper.model.getData("n/topPagesType")),t.helper.shortcuts.refreshEntries(),e.delay(500).then(()=>{e("menu."+t.opts.classes.infoBar).remove()})},i=()=>{s=!0,history.pushState({},null,location.href.replace(/#edit/g,"")+"#edit"),e("<menu />").addClass(t.opts.classes.infoBar).append("<a class='"+t.opts.classes.cancel+"'>"+t.helper.i18n.get("overlay_cancel")+"</a>").append("<a class='"+t.opts.classes.save+"'>"+t.helper.i18n.get("settings_save")+"</a>").appendTo(t.opts.elm.body),e.delay().then(()=>{t.opts.elm.body.addClass(t.opts.classes.edit),d(),p(),r(),e.delay(500).then(()=>{e(window).trigger("resize")})})},r=()=>{let s=["<a class='"+t.opts.classes.edit+"' />","<a class='"+t.opts.classes.remove+"' />","<a "+t.opts.attr.pos+"='left' />","<a "+t.opts.attr.pos+"='right' />"];t.opts.elm.topNav.find("> ul > li").forEach(t=>{e(t).append(s)}),e("<a class='"+t.opts.classes.add+"' />").prependTo(t.opts.elm.topNav),t.opts.elm.topNav.off("click.edit").on("click.edit","a."+t.opts.classes.edit,t=>{t.stopPropagation();let s=e(t.currentTarget).parent("li");n(s)}).on("click.edit","a."+t.opts.classes.add,()=>{let a=e("<li />").append("<a class='"+t.opts.classes.link+"'>&nbsp;</a>").append(s).prependTo(t.opts.elm.topNav.children("ul"));e.delay().then(()=>{n(a)})}).on("click.edit","a."+t.opts.classes.remove,t=>{e(t.currentTarget).parent("li").remove()}).on("click.edit","a["+t.opts.attr.pos+"]",s=>{let a=e(s.currentTarget).attr(t.opts.attr.pos),o=e(s.currentTarget).parent("li");switch(a){case"left":o.prev("li").length()>0&&o.insertBefore(o.prev("li"));break;case"right":o.next("li").length()>0&&o.insertAfter(o.next("li"))}}).on("click.edit","> ul > li > div",e=>{"BUTTON"!==e.target.tagName&&e.stopPropagation()}),e(document).off("click.edit").on("click.edit",()=>{t.opts.elm.topNav.find("> ul > li > div").remove()})},n=s=>{t.opts.elm.topNav.find("> ul > li > div").remove();let a=s.children("a."+t.opts.classes.link).eq(0);e("<div />").append("<label>"+t.helper.i18n.get("overlay_bookmark_title")+"</label>").append("<input type='text' value='"+a.text().trim().replace(/'/g,"&#x27;")+"' "+t.opts.attr.type+"='label' />").append("<label>"+t.helper.i18n.get("overlay_bookmark_url")+"</label>").append("<input type='text' value='"+(a.data("href")||a.attr("href")).trim().replace(/'/g,"&#x27;")+"' "+t.opts.attr.type+"='url' />").append("<button type='submit'>"+t.helper.i18n.get("overlay_close")+"</button>").appendTo(s).find("input[type='text']").on("change input",s=>{let o=s.currentTarget.value.trim();switch(e(s.currentTarget).attr(t.opts.attr.type)){case"url":a.removeAttr("href").removeData("href"),o&&o.length>0&&(o.startsWith("chrome://")||o.startsWith("chrome-extension://")?a.data("href",o):(0!==o.search(/^\w+:\/\//)&&(o="http://"+o),a.attr("href",o)));break;case"label":o&&o.length>0?a.text(o.trim()):a.html("&nbsp;")}})},p=()=>{let s=e("<select />").prependTo(t.opts.elm.topPages),a=t.helper.topPages.getAllTypes(),o=t.helper.model.getData("n/topPagesType");Object.keys(a).forEach(l=>{let i=t.helper.i18n.get("newtab_top_pages_"+a[l]);e("<option value='"+l+"' "+(o===l?"selected":"")+" />").text(i).appendTo(s)}),s.on("input change",e=>{t.helper.topPages.setType(e.currentTarget.value)})},d=()=>{let s=e("<select />").appendTo(t.opts.elm.search.wrapper),a=t.helper.search.getSearchEngineList(),o=t.helper.model.getData("n/searchEngine");Object.entries(a).forEach(([t,a])=>{e("<option value='"+t+"' "+(o===t?"selected":"")+" />").text(a.name).appendTo(s)}),s.on("input change",e=>{t.helper.search.updateSearchEngine(e.currentTarget.value)})}},window.SearchHelper=function(t){let s={},a=null,o={},l={google:{name:"Google",url:"https://www.google.com/",queryUrl:"https://www.google.com/search?q={1}",sorting:10},bing:{name:"Bing",url:"https://www.bing.com/",queryUrl:"https://www.bing.com/search?q={1}",sorting:20},yahoo:{name:"Yahoo",url:"https://search.yahoo.com/",queryUrl:"https://search.yahoo.com/search?p={1}",sorting:30,lang:{de:{url:"https://de.search.yahoo.com/",queryUrl:"https://de.search.yahoo.com/search?p={1}"},jp:{url:"https://search.yahoo.co.jp/",queryUrl:"https://search.yahoo.co.jp/search?p={1}"}}},yandex:{name:"Yandex",url:"https://yandex.com/",queryUrl:"https://yandex.com/search/?text={1}",sorting:40,lang:{ru:{name:"Яндекс",url:"https://yandex.ru/",queryUrl:"https://yandex.ru/search/?text={1}",sorting:15},uk:{name:"Яндекс",url:"https://yandex.ua/",queryUrl:"https://yandex.ua/search/?text={1}",sorting:15},tr:{url:"https://yandex.com.tr/",queryUrl:"https://yandex.com.tr/search/?text={1}",sorting:15}}},baidu:{name:"Baidu",url:"https://www.baidu.com/",queryUrl:"https://www.baidu.com/s?wd={1}",sorting:50,lang:{"zh-CN":{name:"百度",sorting:15}}}};this.init=(async()=>{i(),d(),this.updateSearchEngine(t.helper.model.getData("n/searchEngine"))}),this.updateSearchEngine=(e=>{if(o[e]){a=e;let s=t.helper.i18n.get("newtab_search_placeholder",[o[e].name]);t.opts.elm.search.field.attr("placeholder",s)}}),this.getSearchEngineList=(()=>o);let i=()=>{let e=t.helper.i18n.getUILanguage(),s=[];Object.entries(l).forEach(([t,a])=>{let o={alias:t,name:a.name,url:a.url,queryUrl:a.queryUrl,sorting:a.sorting};a.lang&&a.lang[e]&&Object.entries(a.lang[e]).forEach(([e,t])=>{o[e]=t}),o.name&&o.url&&o.queryUrl&&s.push(o)}),s.sort((e,t)=>(e.sorting||9999)-(t.sorting||9999)),o={},s.forEach(e=>{o[e.alias]=e})},r=s=>{let a=e("ul."+t.opts.classes.suggestions+" > li."+t.opts.classes.active),o="next"===s?0:-1;a.length()>0&&(o=a.prevAll("li").length()+("next"===s?1:-1),a.removeClass(t.opts.classes.active));let l=!1;if(o>=0){let s=e("ul."+t.opts.classes.suggestions+" > li").eq(o);s.length()>0&&(l=!0,s.addClass(t.opts.classes.active),t.opts.elm.search.field[0].value=s.text().trim())}!1===l&&(t.opts.elm.search.field[0].value=t.opts.elm.search.field.data("typedVal")||"")},n=e=>{e&&e.trim().length>0&&(0===e.search(/https?\:\/\//)||0===e.search(/s?ftps?\:\/\//)||0===e.search(/chrome\:\/\//)?chrome.tabs.update({url:e}):o[a]&&chrome.tabs.update({url:o[a].queryUrl.replace("{1}",encodeURIComponent(e))}))},p=t=>new Promise(a=>{if(t)if(s[t])a(s[t]);else{let o=encodeURIComponent(t),l=(e=[])=>{s[t]=e,a(e)};e.xhr("http://google.com/complete/search?client=chrome&q="+o,{responseType:"json"}).then(e=>{try{if(e.response&&e.response[0]===t){let t=[],s=[];e.response[1].forEach((a,o)=>{"NAVIGATION"===e.response[4]["google:suggesttype"][o]?t.push({type:"url",label:a}):s.push({type:"word",label:a})}),l(t.concat(s))}}catch(e){l()}},()=>{l()})}else a([])}),d=()=>{t.opts.elm.search.submit.on("click",e=>{e.preventDefault(),e.stopPropagation();let s=t.opts.elm.search.field[0].value;s&&s.trim().length>0?n(s):o[a]&&chrome.tabs.update({url:o[a].url})}),t.opts.elm.search.field.on("keyup click",s=>{s.preventDefault(),s.stopPropagation();let a=s.currentTarget.value,o=event.which||event.keyCode;13===o?n(a):40===o?r("next"):38===o?r("prev"):(t.opts.elm.search.field.data("typedVal",a),p(a).then(s=>{if(e("ul."+t.opts.classes.suggestions).remove(),s.length>0){let a=e("<ul />").addClass(t.opts.classes.suggestions).insertAfter(t.opts.elm.search.field);s.some((s,o)=>{if(e("<li />").attr(t.opts.attr.type,s.type).text(s.label).appendTo(a),o>4)return!0}),a.css({top:t.opts.elm.search.field[0].offsetTop+"px",left:t.opts.elm.search.field[0].offsetLeft+"px"})}}))}),e(document).on("mousemove","ul."+t.opts.classes.suggestions+" > li",s=>{e("ul."+t.opts.classes.suggestions+" > li").removeClass(t.opts.classes.active),e(s.currentTarget).addClass(t.opts.classes.active)}).on("click","ul."+t.opts.classes.suggestions+" > li",s=>{s.preventDefault(),s.stopPropagation();let a=e(s.currentTarget).text().trim();t.opts.elm.search.field[0].value=a,n(a)}),e(document).on("click",()=>{e("ul."+t.opts.classes.suggestions).remove(),!1===t.helper.edit.isEditMode()&&t.opts.elm.search.field[0].focus()}),e(window).on("resize",()=>{e("ul."+t.opts.classes.suggestions).remove()})}},window.ShortcutsHelper=function(t){this.init=(async()=>{this.refreshEntries(),s()}),this.refreshEntries=(()=>{let s=t.helper.model.getData("n/shortcuts");t.opts.elm.topNav.children("ul").remove();let a=e("<ul />").appendTo(t.opts.elm.topNav);s&&s.length>0&&s.forEach(s=>{let o=e("<li />").appendTo(a),l=e("<a />").addClass(t.opts.classes.link).text(s.label).appendTo(o);s.url.startsWith("chrome://")||s.url.startsWith("chrome-extension://")?l.data("href",s.url):l.attr("href",s.url)})});let s=()=>{t.opts.elm.topNav.on("mousedown","a."+t.opts.classes.link,s=>{let a=e(s.currentTarget).data("href");a&&(s.preventDefault(),t.helper.model.call("openLink",{href:a,newTab:2===s.which,position:t.helper.model.getData("b/newTabPosition"),active:2!==s.which}))})}},window.TopPagesHelper=function(t){let s=null,a={topPages:"default",mostUsed:"most_used",recentlyUsed:"recently_used",pinnedEntries:"pinned_entries",hidden:"hidden"};this.init=(async()=>{o(),t.opts.elm.topPages.html("<ul />"),this.setType(t.helper.model.getData("n/topPagesType")),setInterval(()=>{document.hidden&&i()},12e4)}),this.getAllTypes=(()=>a),this.setType=(e=>{s===e&&"hidden"!==s||(s=e,i())}),this.handleWindowResize=(()=>{let e=l(),s=t.opts.elm.topPages.children("ul").data("total");e.total!==s&&i()});let o=()=>{e(window).on("resize.topPages",()=>{this.handleWindowResize()})},l=()=>{let s={total:8,rows:2},a={w:t.opts.elm.content[0].offsetWidth||window.innerWidth,h:t.opts.elm.content[0].offsetHeight||window.innerHeight},o=e("menu."+t.opts.classes.infoBar);return o.length()>0&&(a.h-=o[0].offsetHeight),a.w>650?s.total=8:a.w>490?s.total=6:a.w>340?s.total=4:s.total=0,a.h<330?s.total=0:a.h<470&&(s.total/=2,s.rows=1),s},i=()=>{t.opts.elm.topPages.children("ul").removeClass(t.opts.classes.visible),"hidden"===s?!1===t.helper.edit.isEditMode()&&t.opts.elm.topPages.children("ul").data("total",0).html(""):Promise.all([n(),e.delay(200)]).then(([s])=>{let a=l();return t.opts.elm.topPages.children("ul").html("").data("total",a.total).attr(t.opts.attr.perRow,a.total/a.rows),s.forEach(s=>{let a=e("<li />").appendTo(t.opts.elm.topPages.children("ul")),o=e("<a />").attr({href:s.url,title:s.title}).appendTo(a),l=e("<span />").text(s.title).appendTo(o);t.helper.model.call("favicon",{url:s.url}).then(e=>{e.img&&l.prepend("<img src='"+e.img+"' />")});let i=e("<img />").appendTo(o);t.helper.model.call("thumbnail",{url:s.url}).then(e=>{e.img&&i.attr("src",e.img).addClass(t.opts.classes.visible)})}),e.delay(100)}).then(()=>{t.opts.elm.topPages.children("ul").addClass(t.opts.classes.visible)})},r=()=>new Promise(e=>{t.helper.entry.init().then(()=>{e()})}),n=()=>new Promise(e=>{let t=l();if(t.total>0)switch(s){case"mostUsed":case"recentlyUsed":r().then(()=>{let t=d(s);e(t)});break;case"pinnedEntries":r().then(()=>{let t=p();e(t)});break;default:chrome.topSites.get(s=>{if(void 0===chrome.runtime.lastError&&s){let a=s.slice(0,t.total);e(a)}else e([])})}else e([])}),p=()=>{let e=t.helper.entry.getAllPinnedData(),s=t.helper.model.getData(["u/showHidden"]),a=l(),o=[];return e.some(e=>{if((s.showHidden||t.helper.entry.isVisible(e.id))&&(o.push(e),o.length>=a.total))return!0}),o},d=e=>{let s=l(),a=t.helper.entry.getAllBookmarkData(),o=t.helper.model.getData(["u/showHidden","u/mostViewedPerMonth"]),i=t.helper.i18n.getLocaleSortCollator();"recentlyUsed"===e?a.sort((e,s)=>{let a=t.helper.entry.getData(e.id),o=t.helper.entry.getData(s.id),l=a?a.views.lastView:0,r=o?o.views.lastView:0;return l===r?i.compare(e.title,s.title):r-l}):"mostUsed"===e&&a.sort((e,s)=>{let a=t.helper.entry.getData(e.id),l=t.helper.entry.getData(s.id),r=a?a.views[o.mostViewedPerMonth?"perMonth":"total"]:0,n=l?l.views[o.mostViewedPerMonth?"perMonth":"total"]:0;return r===n?i.compare(e.title,s.title):n-r});let r=[];return a.some(e=>{if((o.showHidden||t.helper.entry.isVisible(e.id))&&(r.push(e),r.length>=s.total))return!0}),r}},window.newtab=function(){this.opts={classes:{building:"building",initLoading:"initLoading",sidebarPermanent:"permanent",smallContent:"small",loading:"loading",chromeApps:"chromeApps",suggestions:"suggestions",edit:"edit",add:"add",link:"link",permanentSidebar:"permanentSidebar",remove:"remove",infoBar:"infoBar",save:"save",cancel:"cancel",active:"active",visible:"visible",darkMode:"dark"},attr:{type:"data-type",perRow:"data-perRow",pos:"data-pos"},elm:{body:e("body"),title:e("head > title"),content:e("section#content"),topNav:e("section#content > nav"),search:{wrapper:e("div#search"),field:e("div#search > input[type='text']"),submit:e("div#search > button[type='submit']")},topPages:e("div#topPages")},events:{loaded:"blockbyte-bs-loaded",elementsCreated:"blockbyte-bs-created",openSidebar:"blockbyte-bs-sidebar-open"},manifest:chrome.runtime.getManifest()},this.run=(()=>{chrome.permissions.contains({permissions:["tabs","topSites"]},e=>{e?t():chrome.tabs.update({url:"chrome-search://local-ntp/local-ntp.html"})})});let t=()=>{o(),s();let t=this.helper.template.loading().appendTo(this.opts.elm.body);this.opts.elm.body.addClass(this.opts.classes.initLoading),this.helper.model.init().then(()=>(!0===this.helper.model.getData("a/darkMode")&&this.opts.elm.body.addClass(this.opts.classes.darkMode),this.helper.i18n.init())).then(()=>(this.helper.font.init(),this.helper.stylesheet.init(),this.helper.stylesheet.addStylesheets(["newtab"],e(document)),this.helper.i18n.parseHtml(document),this.helper.topPages.init(),this.helper.search.init(),this.helper.shortcuts.init(),this.helper.edit.init(),a(),e.delay(500))).then(()=>{t.remove(),this.opts.elm.body.removeClass([this.opts.classes.building,this.opts.classes.initLoading]),e(window).trigger("resize")})},s=()=>{this.helper={model:new window.ModelHelper(this),template:new window.TemplateHelper(this),i18n:new window.I18nHelper(this),font:new window.FontHelper(this),stylesheet:new window.StylesheetHelper(this),search:new window.SearchHelper(this),entry:new window.EntryHelper(this),shortcuts:new window.ShortcutsHelper(this),topPages:new window.TopPagesHelper(this),edit:new window.EditHelper(this)}},a=async()=>{chrome.extension.onMessage.addListener(e=>{e&&e.action&&"reinitialize"===e.action&&location.reload(!0)}),this.helper.model.getData("n/autoOpen")&&e(window).on("resize",()=>{if(this.opts.elm.sidebar&&this.opts.elm.sidebar.iframe&&this.opts.elm.sidebar.sidebar){let t=this.opts.elm.sidebar.sidebar.realWidth();window.innerWidth-t>=500?(this.opts.elm.sidebar.sidebar.addClass(this.opts.classes.sidebarPermanent),t>0&&this.opts.elm.content.addClass(this.opts.classes.smallContent),e(document).trigger(this.opts.events.openSidebar),e.delay(500).then(()=>{e(document).trigger("click")})):(this.opts.elm.sidebar.sidebar.removeClass(this.opts.classes.sidebarPermanent),this.opts.elm.content.removeClass(this.opts.classes.smallContent)),this.helper.topPages.handleWindowResize()}})},o=()=>new Promise(t=>{e("["+this.opts.attr.type+"='script_sidebar']").remove();let s=[this.opts.events.loaded,this.opts.events.elementsCreated].join(" ");e(document).off(s).on(s,t=>{this.opts.elm.sidebar=t.detail.elm,e(window).trigger("resize")}),this.opts.manifest.content_scripts[0].css.forEach(t=>{e("<link />").attr({href:chrome.extension.getURL(t),type:"text/css",rel:"stylesheet",[this.opts.attr.type]:"script_sidebar"}).appendTo("head")});let a=(s=0)=>{let o=this.opts.manifest.content_scripts[0].js[s];if(void 0!==o){let t=document.createElement("script");document.head.appendChild(t),t.onload=(()=>a(s+1)),t.src="/"+o,e(t).attr(this.opts.attr.type,"script_sidebar")}else t()};a()})},(new window.newtab).run()})(jsu);