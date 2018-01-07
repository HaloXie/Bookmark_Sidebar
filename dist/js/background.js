/*! (c) Philipp König under GPL-3.0 */
(e=>{"use strict";window.AnalyticsHelper=function(t){let a=[],n=!1,i=!1,o={dev:"100595538-3",live:"100595538-2"};this.init=(async()=>{window.GoogleAnalyticsObject="ga",window.ga=window.ga||function(){(window.ga.q=window.ga.q||[]).push(arguments)},window.ga.l=+new Date;let e=document.createElement("script");e.async=1,e.src="https://www.google-analytics.com/analytics.js";let a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(e,a),window.ga("create","UA-"+o[t.isDev?"dev":"live"],"auto"),window.ga("set","checkProtocolTask",null),window.ga("set","transport","beacon")}),this.trackEvent=(e=>new Promise(t=>{l({hitType:"event",eventCategory:e.category,eventAction:e.action,eventLabel:e.label,eventValue:e.value||1},e.always||!1),t()})),this.trackPageView=(e=>new Promise(t=>{l({hitType:"pageview",page:e.page},e.always||!1),t()})),this.trackUserData=(()=>{let e=t.helper.model.getData("lastTrackDate"),a=+(new Date).setHours(0,0,0,0);!1===i&&e!==a&&(i=!0,t.helper.model.setData("lastTrackDate",a).then(()=>{let e=t.helper.model.getShareInfo(),a="not_set";!0===e.config&&!0===e.activity?a="all":!0===e.config&&!1===e.activity?a="config":!1===e.config&&!0===e.activity?a="activity":!1===e.config&&!1===e.activity&&(a="nothing"),this.trackEvent({category:"extension",action:"user",label:"share_"+a,always:!0}),this.trackEvent({category:"extension",action:"version",label:t.manifest.version_name,always:!0}),!0===e.activity&&r(),!0===e.config&&s(),i=!1}))});let r=()=>{let e=t.helper.model.getData("installationDate");e&&this.trackEvent({category:"extension",action:"installationDate",label:new Date(e).toISOString().slice(0,10)}),t.helper.bookmarkApi.func.getSubTree(0).then(e=>{let t=0,a=e=>{for(let n=0;n<e.length;n++){let i=e[n];i.url?t++:i.children&&a(i.children)}};e&&e[0]&&e[0].children&&e[0].children.length>0&&a(e[0].children),this.trackEvent({category:"extension",action:"bookmarks",label:"amount",value:t})})},s=()=>{let e=["behaviour","appearance","newtab","language"],t=(e,a)=>{Object.keys(a).forEach(n=>{if("newtab"===e&&"shortcuts"===n?a[n]=a[n].length:"utility"===e&&"pinnedEntries"===n&&"object"==typeof a[n]&&(a[n]=Object.keys(a[n]).length),"object"==typeof a[n])t(e+"_"+n,a[n]);else{"string"!=typeof a[n]&&(a[n]=JSON.stringify(a[n])),("newtab"===e&&"website"===n||"utility"===e&&"customCss"===n)&&(a[n]=a[n]&&a[n].length>0?"true":"false");let t=1;!isNaN(parseFloat(a[n]))&&isFinite(a[n])?t=parseFloat(a[n]):0===a[n].search(/^\d+px$/i)&&(t=parseFloat(a[n].replace(/px$/i,""))),this.trackEvent({category:"configuration",action:e+"_"+n,label:a[n],value:t})}})};chrome.storage.sync.get(e,a=>{e.forEach(e=>{"language"===e?(void 0!==a[e]&&"default"!==a[e]||(a[e]=chrome.i18n.getUILanguage()),a[e]={ui:a[e]}):"newtab"===e&&"object"==typeof a[e]&&void 0!==a[e].override&&!1===a[e].override&&(a[e]={override:!1}),"object"==typeof a[e]&&t(e,a[e])})}),chrome.storage.local.get(["utility"],e=>{if(e.utility){let a={};["lockPinned","pinnedEntries","customCss"].forEach(t=>{void 0!==e.utility[t]&&(a[t]=e.utility[t])}),t("utility",a)}})},l=(e,i)=>{let o=t.helper.model.getShareInfo(),r=!0;!0!==i&&(r=e.eventCategory&&"configuration"===e.eventCategory?o.config:o.activity),r&&(a.push(e),!1===n&&h())},h=()=>{n=!0,e.delay(1e3).then(()=>{if(a.length>0&&window.ga&&window.ga.loaded){let e=a.shift();window.ga("send",e),h()}else n=!1})}},window.BookmarkApi=function(e){this.func={},this.init=(()=>new Promise(e=>{["get","getSubTree","removeTree"].forEach(e=>{this.func[e]=(a=>t(e,[""+a]))}),["update","move"].forEach(e=>{this.func[e]=((a,n)=>t(e,[""+a,n]))}),["create","search"].forEach(e=>{this.func[e]=(a=>t(e,[a]))}),e()}));let t=(t,a)=>new Promise((n,i)=>{chrome.bookmarks[t](...a,a=>{let o=chrome.runtime.lastError;void 0===o?-1!==["update","move","create","removeTree"].indexOf(t)?Promise.all([e.helper.cache.remove({name:"htmlList"}),e.helper.cache.remove({name:"htmlPinnedEntries"})]).then(()=>{n(a)}):n(a):i(o.message)})})},window.BrowserActionHelper=function(e){let t=null,a="unknown";this.init=(()=>new Promise(e=>{o(),e()})),this.clearTimeout=(()=>new Promise(e=>{t&&(clearTimeout(t),t=null),e()}));let n=t=>{let a=document.createElement("canvas");a.width=128,a.height=128;let n=a.getContext("2d");e.helper.icon.getInfo().then(t=>Promise.all([e.helper.language.getLangVars(),e.helper.icon.getSvgImage(t.name,"#555555")])).then(([e,o])=>{let r=new Image;r.onload=(()=>{n.drawImage(r,32,32,64,64);let o=i(t.url);chrome.notifications.create("browserAction",{type:"basic",title:e.vars[o.title].message,message:e.vars[o.desc].message,isClickable:!0,buttons:[{title:e.vars[o.link].message}],iconUrl:a.toDataURL()})}),r.src=o})},i=e=>{a="unknown";let t={title:"notification_sidebar_not_working_headline",link:"notification_sidebar_not_working_link",desc:"notification_sidebar_not_working_general"};if(e){t.desc="notification_sidebar_not_working_unknown";let n=!1,i={new_tab:["chrome://newtab/"],system:["chrome://","about:blank"],extension_page:["chrome-extension://"],webstore:["https?://chrome.google.com/webstore/"]};Object.keys(i).some(o=>{if(i[o].some(i=>{if(0===e.search(new RegExp(i,"gi")))return a=o,t.desc="notification_sidebar_not_working_"+o,n=!0,!0}),n)return!0})}return t},o=()=>{chrome.browserAction.onClicked.addListener(()=>{chrome.tabs.query({active:!0,currentWindow:!0},a=>{chrome.tabs.sendMessage(a[0].id,{action:"toggleSidebar",reinitialized:e.reinitialized}),t=setTimeout(()=>{n(a[0])},750)})}),chrome.notifications.onButtonClicked.addListener(r),chrome.notifications.onClicked.addListener(r)},r=()=>{let e="html/settings.html#feedback_faq_notworking";"new_tab"===a&&(e="html/settings.html#newtab"),chrome.tabs.create({url:chrome.extension.getURL(e)}),chrome.notifications.clear("browserAction")}},window.CacheHelper=function(e){this.set=(e=>new Promise(t=>{try{chrome.storage.local.set({["cache_"+e.name]:e.val},()=>{t()})}catch(e){t()}})),this.get=(e=>new Promise(t=>{chrome.storage.local.get(["cache_"+e.name],a=>{t({val:a["cache_"+e.name]})})})),this.remove=(t=>new Promise(a=>{e.importRunning?a():chrome.storage.local.remove(["cache_"+t.name],()=>{a()})}))},window.IconHelper=function(t){let a={},n=null;this.init=(()=>new Promise(e=>{this.getInfo().then(a=>{"logo"===a.name?chrome.browserAction.setIcon({path:t.manifest.browser_action.default_icon}):this.set({name:a.name,color:a.color}),t.isDev&&(chrome.browserAction.setBadgeBackgroundColor({color:[245,197,37,255]}),chrome.browserAction.setBadgeText({text:"X"})),e()})})),this.getInfo=(()=>new Promise(e=>{chrome.storage.sync.get(["appearance"],t=>{let a="bookmark",n="#555555";t&&t.appearance&&t.appearance.styles&&(t.appearance.styles.iconShape&&(a=t.appearance.styles.iconShape),t.appearance.styles.iconColor&&(n=t.appearance.styles.iconColor)),e({name:a,color:n})})})),this.getSvgImage=((t,n)=>new Promise(i=>{new Promise(n=>{a[t]?n(a[t]):e.xhr(chrome.extension.getURL("img/icon/menu/icon-"+t+".svg")).then(e=>{let i=e.responseText;a[t]="data:image/svg+xml;charset=utf-8,"+i,n(a[t])})}).then(e=>{e=e.replace(/#000/g,n),i(e)})})),this.set=(e=>new Promise(t=>{let a=e.onlyCurrentTab||!1;if(n&&!a&&n===e.name+"_"+e.color)t();else{let i=document.createElement("canvas");i.width=128,i.height=128;let o=i.getContext("2d");this.getSvgImage(e.name,e.color).then(i=>{let r=new Image;r.onload=(()=>{o.drawImage(r,0,0,128,128),chrome.browserAction.setIcon({imageData:o.getImageData(0,0,128,128),tabId:a&&e.tabInfo?e.tabInfo.id:null}),a||(n=e.name+"_"+e.color),t()}),r.src=i})}}))},window.ImageHelper=function(t){let a={},n=!1;this.init=(()=>new Promise(e=>{chrome.storage.local.get(["imageCache"],t=>{a=t.imageCache||{},e()})})),this.getThumbnail=(a=>new Promise(n=>{if(void 0===a.url||a.url.startsWith("chrome://")||a.url.startsWith("chrome-extension://"))n({img:null});else{let r=i("thumb",a.url);r?n({img:r}):e.xhr(t.urls.thumbnail,{method:"POST",timeout:1e4,data:{url:a.url,lang:chrome.i18n.getUILanguage(),ua:navigator.userAgent}}).then(e=>{let t=e.responseText;t&&t.length>0?(o("thumb",a.url,t),n({img:t})):n({img:null})},()=>{n({img:null})})}})),this.getFavicon=(e=>new Promise(t=>{let a=new Image;a.onload=function(){let e=document.createElement("canvas");e.width=this.width,e.height=this.height,e.getContext("2d").drawImage(this,0,0);let a=e.toDataURL("image/png");t({img:a})},a.src="chrome://favicon/size/16@2x/"+e.url}));let i=(e,t)=>a[e+"_"+t]?a[e+"_"+t].d:null,o=(e,t,i)=>{if(a[e+"_"+t]={t:+new Date,d:i},!1===n){n=!0;let e=+new Date;return Object.keys(a).forEach(t=>{e-a[t].t>432e6&&delete a[t]}),new Promise(e=>{chrome.storage.local.set({imageCache:a},()=>{n=!1,e()})})}}},window.LanguageHelper=function(t){let a={af:"Afrikaans",ar:"Arabic",hy:"Armenian",be:"Belarusian",bg:"Bulgarian",ca:"Catalan","zh-CN":"Chinese (Simplified)","zh-TW":"Chinese (Traditional)",hr:"Croatian",cs:"Czech",da:"Danish",nl:"Dutch",en:"English",eo:"Esperanto",et:"Estonian",tl:"Filipino",fi:"Finnish",fr:"French",de:"German",el:"Greek",iw:"Hebrew",hi:"Hindi",hu:"Hungarian",is:"Icelandic",id:"Indonesian",it:"Italian",ja:"Japanese",ko:"Korean",lv:"Latvian",lt:"Lithuanian",no:"Norwegian",fa:"Persian",pl:"Polish",pt:"Portuguese",ro:"Romanian",ru:"Russian",sr:"Serbian",sk:"Slovak",sl:"Slovenian",es:"Spanish",sw:"Swahili",sv:"Swedish",ta:"Tamil",th:"Thai",tr:"Turkish",uk:"Ukrainian",vi:"Vietnamese"},n=["ar","fa","iw"],i=null,o={},r=!1;this.init=(()=>new Promise(e=>{chrome.storage.sync.get(["language"],a=>{let l=a.language||"default";"default"===l&&(l=chrome.i18n.getUILanguage());let h=t.manifest.default_locale;this.getAvailableLanguages().then(t=>{[l,h].some(a=>{if(t&&t.infos&&t.infos[a]&&t.infos[a].available)return i=a,r=n.indexOf(i)>-1,s(a,h).then(t=>{t&&t.langVars&&(o=t.langVars,e())}),!0})})})})),this.getLangVars=(()=>new Promise(e=>{e({language:i,dir:r?"rtl":"ltr",vars:o})})),this.getAvailableLanguages=(()=>new Promise(t=>{chrome.storage.local.get(["languageInfos"],n=>{if(n&&n.languageInfos&&(+new Date-n.languageInfos.updated)/36e5<8)t({infos:n.languageInfos.infos});else{let n=Object.keys(a).length,i=0,o={};Object.keys(a).forEach(r=>{o[r]={name:r,label:a[r],available:!1};let s=()=>{++i===n&&(chrome.storage.local.set({languageInfos:{infos:o,updated:+new Date}}),t({infos:o}))};e.xhr(chrome.extension.getURL("_locales/"+r+"/messages.json"),{method:"HEAD"}).then(()=>{o[r].available=!0,s()},s)})}})}));let s=(t,a=null)=>new Promise(n=>{if(t){let i=a=>{let i=a.langVars;e.xhr(chrome.extension.getURL("_locales/"+t+"/messages.json")).then(e=>{let t=JSON.parse(e.responseText);Object.assign(i,t),n({langVars:i})})};a&&a!==t?s(a,null).then(i):i({langVars:{}})}})},window.ModelHelper=function(e){let t={},a={config:null,activity:null};this.init=(()=>new Promise(e=>{chrome.storage.sync.get(["model","shareInfo"],i=>{t=i.model||{},"object"==typeof i.shareInfo&&(a=i.shareInfo),void 0===t.installationDate&&(t.installationDate=+new Date),n().then(e)})})),this.getShareInfo=(()=>a),this.setShareInfo=(e=>new Promise(t=>{a={config:e.config||!1,activity:e.activity||!1},chrome.storage.sync.set({shareInfo:a},()=>{chrome.runtime.lastError,t()})})),this.setData=((e,a)=>new Promise(i=>{t[e]=a,n().then(i)})),this.getData=(e=>t[e]||null);let n=()=>new Promise(e=>{Object.getOwnPropertyNames(t).length>0&&chrome.storage.sync.set({model:t},()=>{chrome.runtime.lastError,e()})})},window.NewtabHelper=function(e){let t={};this.init=(()=>new Promise(e=>{this.updateConfig().then(()=>{a(),e()})})),this.updateConfig=(()=>new Promise(e=>{chrome.storage.sync.get(["newtab"],a=>{t=void 0===a.newtab?{}:a.newtab,e()})}));let a=async()=>{chrome.tabs.onCreated.addListener(e=>{if(e.url&&"chrome://newtab/"===e.url&&void 0!==t.override&&!0===t.override){let a="create";0===e.index?a="update":chrome.tabs.remove(e.id),t.website&&t.website.length>0?i(a):n(a)}})},n=e=>{chrome.tabs[e]({url:chrome.extension.getURL("html/newtab.html"),active:!0})},i=e=>{chrome.tabs[e]({url:o(t.website,"bs_nt",1),active:!0})},o=(e,t,a)=>{let n=new RegExp("([?&])"+t+"=.*?(&|#|$)","i");if(e.match(n))return e.replace(n,"$1"+t+"="+a+"$2");{let n="";return-1!==e.indexOf("#")&&(n=e.replace(/.*#/,"#"),e=e.replace(/#.*/,"")),e+(-1!==e.indexOf("?")?"&":"?")+t+"="+a+n}}},window.PortHelper=function(t){let a=()=>new Promise(a=>{e.xhr(t.urls.checkStatus,{method:"POST",responseType:"json",data:{version:t.isDev?"9.9.9":t.manifest.version}}).then(e=>{a(e.response&&e.response.available?{status:"available"}:{status:"unavailable"})},()=>{a({status:"unavailable"})})}),n=()=>new Promise(e=>{let a=!1,n=t.helper.model.getData("installationDate"),i=t.helper.model.getShareInfo();!1===t.isDev&&null===i.config&&null===i.activity&&(+new Date-n)/864e5>5&&(a=!0),e({showMask:a})}),i=a=>new Promise(n=>{a.abort&&!0===a.abort?e.cancelXhr(t.urls.checkUrls):e.xhr(t.urls.checkUrls,{method:"POST",data:{urlList:a.urls,ua:navigator.userAgent,lang:chrome.i18n.getUILanguage()}}).then(e=>{let t=JSON.parse(e.responseText);n(t)},()=>{n({error:!0})})}),o=e=>new Promise(a=>{new Promise(a=>{let n={title:e.title};e.url&&(n.url=e.url),e.preventReload&&(t.preventReload=!0),t.helper.bookmarkApi.func.update(e.id,n).then(()=>{a({updated:e.id})},e=>{a({error:e})})}).then(n=>{e.preventReload&&(t.preventReload=!1),a(n)})}),r=e=>new Promise(a=>{new Promise(a=>{let n={parentId:e.parentId,index:e.index||0,title:e.title,url:e.url?e.url:null};e.preventReload&&(t.preventReload=!0),t.helper.bookmarkApi.func.create(n).then(e=>{a({created:e.id})},e=>{a({error:e})})}).then(n=>{e.preventReload&&(t.preventReload=!1),a(n)})}),s=e=>new Promise(a=>{new Promise(n=>{e.preventReload&&(t.preventReload=!0),t.helper.bookmarkApi.func.removeTree(e.id).then(()=>{a({deleted:e.id})},e=>{n({error:e})})}).then(n=>{e.preventReload&&(t.preventReload=!1),a(n)})}),l=e=>new Promise(a=>{let n={parentId:""+e.parentId,index:e.index};t.helper.bookmarkApi.func.move(e.id,n).then(()=>{a({moved:e.id})})}),h=e=>new Promise(a=>{t.helper.bookmarkApi.func.getSubTree(e.id).then(e=>{a({bookmarks:e})})}),c=e=>new Promise(a=>{t.helper.bookmarkApi.func.search(e.searchVal).then(e=>{a({bookmarks:e})})}),d=e=>new Promise(a=>{if(t.helper.viewAmount.addByEntry(e),e.newTab&&!0===e.newTab){let n=(n=null)=>{chrome.tabs.query({active:!0,currentWindow:!0},i=>{chrome.tabs.create({url:e.href,active:void 0===e.active||!!e.active,index:null===n?i[0].index+1:n,openerTabId:i[0].id},e=>{t.helper.model.setData("openedByExtension",e.id).then(a)})})};"afterLast"===e.position?chrome.tabs.query({currentWindow:!0},e=>{let t=0;e.forEach(e=>{t=Math.max(t,e.index)}),n(t+1)}):"beforeFirst"===e.position?n(0):n()}else e.newWindow&&!0===e.newWindow?(chrome.windows.create({url:e.href,state:"maximized"}),a()):e.incognito&&!0===e.incognito?(chrome.windows.create({url:e.href,state:"maximized",incognito:!0}),a()):chrome.tabs.query({active:!0,currentWindow:!0},n=>{chrome.tabs.update(n[0].id,{url:e.href},e=>{t.helper.model.setData("openedByExtension",e.id).then(a)})})});this.init=(()=>new Promise(e=>{let m=0,g={checkUrls:i,bookmarks:h,searchBookmarks:c,moveBookmark:l,updateBookmark:o,createBookmark:r,deleteBookmark:s,reload:t.reload,reinitialize:t.reinitialize,updateShareInfo:t.helper.model.setShareInfo,shareInfoMask:n,languageInfos:t.helper.language.getAvailableLanguages,langvars:t.helper.language.getLangVars,favicon:t.helper.image.getFavicon,thumbnail:t.helper.image.getThumbnail,openLink:d,getCache:t.helper.cache.get,setCache:t.helper.cache.set,removeCache:t.helper.cache.remove,websiteStatus:a,trackPageView:t.helper.analytics.trackPageView,trackEvent:t.helper.analytics.trackEvent,updateIcon:t.helper.icon.set,reloadIcon:t.helper.icon.init,clearNotWorkingTimeout:t.helper.browserAction.clearTimeout,addViewAmount:t.helper.viewAmount.addByUrl,viewAmounts:t.helper.viewAmount.getAll};chrome.runtime.onConnect.addListener(e=>{e.name&&"background"===e.name&&e.onMessage.addListener((a,n)=>{g[a.type]&&(50===m&&(t.helper.analytics.trackUserData(),m%=50),a.tabInfo=n.sender.tab,g[a.type](a).then(t=>{try{e.postMessage({uid:a.uid,result:t})}catch(e){}}),m++)})}),e()}))},window.UpgradeHelper=function(e){this.loaded=!1,this.init=(async()=>{chrome.runtime.onUpdateAvailable.addListener(()=>{chrome.runtime.reload()}),this.loaded=!0}),this.onInstalled=(()=>{chrome.tabs.create({url:chrome.extension.getURL("html/intro.html")}),e.reinitialize()}),this.onUpdated=(a=>{chrome.storage.local.remove(["languageInfos"]);let n=e.manifest.version;a.previousVersion!==n&&e.helper.analytics.trackEvent({category:"extension",action:"update",label:a.previousVersion+" -> "+n,always:!0});let i=a.previousVersion.split("."),o=n.split(".");i[0]!==o[0]||i[1]!==o[1]?t(n).then(()=>{e.reinitialize()}):e.reinitialize()});let t=t=>new Promise(a=>{let n=0,i=()=>{++n>=3&&a()};chrome.storage.sync.get(null,a=>{void 0===a.model||void 0!==a.model.updateNotification&&a.model.updateNotification===t||e.helper.model.setData("updateNotification",t).then(()=>{0!==t.search("1.11.")&&chrome.tabs.create({url:chrome.extension.getURL("html/changelog.html")})}),void 0===a.behaviour&&(a.behaviour={}),void 0===a.appearance&&(a.appearance={}),void 0===a.newtab&&(a.newtab={}),void 0===a.behaviour.reopenSidebar&&void 0!==a.behaviour.autoOpen&&(a.behaviour.reopenSidebar=a.behaviour.autoOpen,delete a.behaviour.autoOpen,delete a.utility.autoOpen,void 0!==a.utility&&chrome.storage.local.set({utility:a.utility})),void 0===a.newtab.autoOpen&&void 0!==a.newtab.initialOpen&&(a.newtab.autoOpen=a.newtab.initialOpen,delete a.newtab.initialOpen),chrome.storage.sync.remove(["shareUserdata"]),delete a.behaviour.initialOpenOnNewTab,delete a.behaviour.replaceNewTab,delete a.behaviour.language,delete a.appearance.language,delete a.appearance.sidebarPosition,void 0===a.appearance.styles&&(a.appearance.styles={}),void 0!==a.shareInfo||void 0===a.shareUserdata||!0!==a.shareUserdata&&!1!==a.shareUserdata||chrome.storage.sync.set({shareInfo:{config:a.shareUserdata,activity:a.shareUserdata}}),void 0===a.appearance.styles.hoverColor&&(a.appearance.styles.hoverColor=a.appearance.darkMode?"#555555":"#f5f5f5"),chrome.storage.sync.set({behaviour:a.behaviour},i),chrome.storage.sync.set({newtab:a.newtab},i),chrome.storage.sync.set({appearance:a.appearance},i)})})},window.ViewAmountHelper=function(e){this.getAll=(()=>new Promise(a=>{t().then(t=>{a({viewAmounts:t,counterStartDate:e.helper.model.getData("installationDate")})})})),this.addByUrl=(t=>new Promise(a=>{null===e.helper.model.getData("openedByExtension")&&e.helper.bookmarkApi.func.search({url:t.url}).then(e=>{e.some(e=>e.url===t.url&&(this.addByEntry(e),!0)),a()}),e.helper.model.setData("openedByExtension",null)})),this.addByEntry=(e=>{e.id&&t().then(t=>{void 0!==t[e.id]&&"object"==typeof t[e.id]||(t[e.id]={c:0}),t[e.id].c++,t[e.id].d=+new Date,chrome.storage.local.set({clickCounter:t})})});let t=()=>new Promise(e=>{chrome.storage.local.get(["clickCounter"],t=>{let a={};void 0!==t.clickCounter&&(a=t.clickCounter),e(a)})})};(new function(){this.importRunning=!1,this.preventReload=!1,this.manifest=chrome.runtime.getManifest(),this.urls={website:"https://extensions.blockbyte.de/",checkStatus:"https://extensions.blockbyte.de/ajax/status/bs",checkUrls:"https://4v1.de/u",uninstall:"https://extensions.blockbyte.de/uninstall/bs",thumbnail:"https://4v1.de/t"},this.isDev=!1,this.reinitialized=null,this.reload=(t=>new Promise(a=>{Promise.all([this.helper.newtab.updateConfig(),this.helper.cache.remove({name:"htmlList"}),this.helper.cache.remove({name:"htmlPinnedEntries"})]).then(()=>{chrome.tabs.query({},n=>{n.forEach((a,n)=>{let i=a.active?0:100*n;e.delay(i).then(()=>{chrome.tabs.sendMessage(a.id,{action:"reload",scrollTop:t.scrollTop||!1,reinitialized:this.reinitialized,type:t.type})})}),a()})})})),this.reinitialize=(()=>new Promise(a=>{this.reinitialized=+new Date;let n={css:"insertCSS",js:"executeScript"};Promise.all([this.helper.newtab.updateConfig(),this.helper.language.init(),this.helper.cache.remove({name:"htmlList"}),this.helper.cache.remove({name:"htmlPinnedEntries"})]).then(()=>{chrome.tabs.query({},i=>{i.forEach((a,i)=>{if(void 0===a.url||!a.url.startsWith("chrome://")&&!a.url.startsWith("chrome-extension://")){let o=a.active?0:100*i;e.delay(o).then(()=>{Object.entries(n).forEach(([e,n])=>{let i=!1;this.manifest.content_scripts[0][e].forEach(e=>{chrome.tabs[n](a.id,{file:e},()=>{let e=chrome.runtime.lastError;e&&e.message&&!1===i&&(i=!0,t(a.id))})})})})}else t(a.id)}),a()})})}));let t=e=>{chrome.tabs.sendMessage(e,{action:"reinitialize"})},a=async()=>{chrome.bookmarks.onImportBegan.addListener(()=>{this.importRunning=!0}),chrome.bookmarks.onImportEnded.addListener(()=>{this.importRunning=!1,e.delay(1e3).then(()=>{this.reload({type:"Created"})})}),["Changed","Created","Removed"].forEach(e=>{chrome.bookmarks["on"+e].addListener(()=>{!1===this.importRunning&&!1===this.preventReload&&this.reload({type:e})})}),["Moved","ChildrenReordered"].forEach(e=>{chrome.bookmarks["on"+e].addListener(()=>{Promise.all([this.helper.cache.remove({name:"htmlList"}),this.helper.cache.remove({name:"htmlPinnedEntries"})])})})},n=()=>{this.helper={model:new window.ModelHelper(this),bookmarkApi:new window.BookmarkApi(this),language:new window.LanguageHelper(this),upgrade:new window.UpgradeHelper(this),viewAmount:new window.ViewAmountHelper(this),newtab:new window.NewtabHelper(this),image:new window.ImageHelper(this),port:new window.PortHelper(this),icon:new window.IconHelper(this),browserAction:new window.BrowserActionHelper(this),cache:new window.CacheHelper(this),analytics:new window.AnalyticsHelper(this)}},i=(t,a=0)=>{this.helper&&this.helper.upgrade&&this.helper.upgrade.loaded?"install"===t.reason?this.helper.upgrade.onInstalled(t):"update"===t.reason&&this.helper.upgrade.onUpdated(t):a<100&&e.delay(500).then(()=>{i(t,a+1)})};this.run=(()=>{let e=+new Date;this.isDev="Dev"===this.manifest.version_name||!("update_url"in this.manifest),chrome.runtime.onInstalled.addListener(e=>{i(e)}),chrome.runtime.setUninstallURL(this.urls[this.isDev?"website":"uninstall"]),n(),Promise.all([this.helper.model.init(),this.helper.language.init(),this.helper.icon.init(),this.helper.analytics.init(),this.helper.browserAction.init(),this.helper.bookmarkApi.init()]).then(()=>Promise.all([a(),this.helper.newtab.init(),this.helper.image.init(),this.helper.port.init(),this.helper.upgrade.init()])).then(()=>{this.isDev&&console.log("LOADED",+new Date-e)})})}).run()})(jsu);