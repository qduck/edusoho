!function(i){function e(e){for(var t,r,n=e[0],a=e[1],s=e[2],o=0,l=[];o<n.length;o++)r=n[o],Object.prototype.hasOwnProperty.call(u,r)&&u[r]&&l.push(u[r][0]),u[r]=0;for(t in a)Object.prototype.hasOwnProperty.call(a,t)&&(i[t]=a[t]);for(p&&p(e);l.length;)l.shift()();return d.push.apply(d,s||[]),c()}function c(){for(var e,t=0;t<d.length;t++){for(var r=d[t],n=!0,a=1;a<r.length;a++){var s=r[a];0!==u[s]&&(n=!1)}n&&(d.splice(t--,1),e=o(o.s=r[0]))}return e}var r={},u={198:0},d=[];function o(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return i[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=i,o.c=r,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(r,n,function(e){return t[e]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/static-dist/";var t=window.webpackJsonp=window.webpackJsonp||[],n=t.push.bind(t);t.push=e,t=t.slice();for(var a=0;a<t.length;a++)e(t[a]);var p=n;d.push([627,0]),c()}({17:function(e,t){e.exports=jQuery},627:function(e,t,r){"use strict";r.r(t);var n=r(4),a=$("#course-reply-btn");$("#message-reply-form").on("click","#course-reply-btn",function(e){return a.addClass("disabled").attr("disabled",!0),500<=$("#message_reply_content").val().length?(Object(n.a)("danger",Translator.trans("notify.private_message_maxlength.message")),a.removeClass("disabled").attr("disabled",!1)):0==$.trim($("#message_reply_content").val()).length?(Object(n.a)("danger",Translator.trans("validate.empty_content_hint")),a.removeClass("disabled").attr("disabled",!1)):$.post($("#message-reply-form").attr("action"),$("#message-reply-form").serialize()).success(function(e){$(".message-list").prepend(e.html),$("#message_reply_content").val(""),a.removeClass("disabled").attr("disabled",!1)}).error(function(e){a.removeClass("disabled").attr("disabled",!1)}),!1}),$(".message-list").on("click",".delete-message",function(e){if(1==$(".message-list").find(".message-me").length){if(!confirm(Translator.trans("confirm.last_private_message_delete.message")))return!1}else if(!confirm(Translator.trans("confirm.private_message_delete.message")))return!1;var t=$(this).parents(".media");$.post($(this).data("url"),function(){1==$(".message-list").find(".message-me").length&&(window.location.href=t.attr("parent-url")),t.remove()})}),$("textarea").bind("input propertychange",function(){0<$("#message_reply_content").val().length?$("#course-reply-btn").removeClass("disabled"):$("#course-reply-btn").addClass("disabled")})}});