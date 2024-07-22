!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p=(window.__sw__.assetPath + '/bundles/newsletter2gosw6/'),n(n.s="EVLe")}({EVLe:function(e,t,n){"use strict";n.r(t);var o=Shopware.Mixin;Shopware.Component.register("newsletter2go-index",{template:'{% block newsletter2go_index %}\n<sw-page class="newsletter2go">\n\n    {# header start #}\n    {% block newsletter2go_index_header %}\n    <template slot="smart-bar-header">\n        <h2> {{ $tc(\'newsletter2go.general.mainHeader\') }}</h2>\n    </template>\n    {% endblock %}\n    {# header start #}\n\n    {# buttons bar start#}\n    {% block newsletter2go_index_actions %}\n<template slot="smart-bar-actions">\n\n    {# save button start#}\n        {% block newsletter2go_save_button %}\n            <sw-button variant="primary"\n                       @click="onSave"\n                       :disabled="!isConnected">\n                {{ $tc(\'newsletter2go.settingForm.buttonLabelSave\') }}\n            </sw-button>\n        {% endblock %}\n    {# save button end#}\n\n</template>\n    {% endblock %}\n    {# buttons bar end#}\n\n    {# content start #}\n    {% block newsletter2go_index_content %}\n    <sw-card-view slot="content">\n\n        {# deletation dialog start #}\n        <sw-modal :title="$tc(\'newsletter2go.settingForm.titleDisconnectDialog\')"\n                  v-if="isDisconnectDialogVisible"\n                  selector=".panel--content"\n                  @mousedown="closeDisconnectDialog"\n                  @keyup.esc="closeDisconnectDialog"\n                  @modal-close="closeDisconnectDialog">\n\n            <sw-container rows="1fr 1fr">\n                <div>{{ $tc(\'newsletter2go.settingForm.messageDisconnectDialog\') }}</div>\n\n                <div>\n                    <sw-container columns="1fr 1fr" align="center center" justify="center">\n                        <div>\n                            <sw-button variant="danger" @click="disconnect">\n                                {{ $tc(\'newsletter2go.settingForm.buttonLabelConfirm\') }}\n                            </sw-button>\n                        </div>\n\n                        <div>\n                            <sw-button @click="closeDisconnectDialog">\n                                {{ $tc(\'newsletter2go.settingForm.buttonLabelCancel\') }}\n                            </sw-button>\n                        </div>\n                    </sw-container>\n                </div>\n            </sw-container>\n\n        </sw-modal>\n        {# deletation dialog end #}\n\n        {% block newsletter2go_account_configuration %}\n        <sw-card :title="$tc(\'newsletter2go.general.accountConfigurationTitle\')" :isLoading="isLoading">\n\n            <sw-container columns="2fr 1fr">\n                <div style="line-height: 34px;padding: 2px 24px;">\n                    <sw-icon :name="setting.connectionIconName" :color="setting.connectionIconColor"></sw-icon>\n                    {{ setting.connectionMessage }}\n                </div>\n                <div>\n                    {# connect button start#}\n                    {% block newsletter2go_connect_button %}\n                        <sw-button v-if="displayConnectButton"\n                                   variant="primary"\n                                   :link="setting.connectLink">\n                            {{ $tc(\'newsletter2go.settingForm.connectButton\') }}\n                        </sw-button>\n                        {% endblock %}\n                        {# connect button end #}\n\n                        {# disconnect button start#}\n                        {% block newsletter2go_disconnect_button %}\n                        <sw-button v-if="isConnected"\n                                   variant="danger"\n                                   @click="viewDisconnectDialog">\n                            {{ $tc(\'newsletter2go.settingForm.disconnectButton\') }}\n                        </sw-button>\n\n                        <sw-button v-if="isConnected" :disabled="false" :square="false" :block="false"\n                                   link="https://ui.newsletter2go.com/integrations" :isLoading="false">\n                            settings\n                        </sw-button>\n                    {% endblock %}\n                    {# disconnect button end#}\n\n                </div>\n            </sw-container>\n\n        </sw-card>\n        {% endblock %}\n\n        {#  conversion tracking start  #}\n        {% block newsletter2go_conversion_tracking %}\n            <sw-card :title="$tc(\'newsletter2go.general.conversionTrackingTitle\')" >\n                <sw-switch-field :label="$tc(\'newsletter2go.settingForm.conversionTrackingSwitch\')"\n                                 v-model="setting.conversionTracking"\n                                 :disabled="!isConnected">\n                </sw-switch-field>\n            </sw-card>\n        {% endblock %}\n        {#  conversion tracking end  #}\n\n    </sw-card-view>\n\n    {% endblock %}\n    {# content end #}\n</sw-page>\n{% endblock %}\n',inject:["ConversionTrackingService","ConnectionService"],mixins:[o.getByName("notification")],data:function(){return{setting:{connectionMessage:"",connectionIconName:"",connectionIconColor:""},companyId:"",isConnected:!1,isLoading:!0,isAccountConfigLoading:!0,isDisconnectDialogVisible:!1,displayConnectButton:!1}},created:function(){this.createdComponent(),this.testConnection()},computed:{},methods:{createdComponent:function(){var e=this;this.ConnectionService.getIntegrationLink().then((function(t){e.setting.connectLink=t.integration})),this.ConversionTrackingService.getValue().then((function(t){e.setting.conversionTracking=t.conversion_tracking,"undefined"!==t.error&&e.createNotificationSuccess({title:e.$tc("newsletter2go.settingForm.titleSaveSuccess"),message:t.error})}))},onSave:function(){var e=this;this.isConnected&&(this.isLoading=!0,this.ConversionTrackingService.updateValue(this.setting.conversionTracking).then((function(t){var n="",o="";"undefined"!==t.error?(n=e.$tc("newsletter2go.settingForm.titleSaveError"),o=t.error):(n=e.$tc("newsletter2go.settingForm.titleSaveSuccess"),o=e.$tc("newsletter2go.settingForm.messageSaveSuccess")),e.createNotificationSuccess({title:n,message:o}),e.isLoading=!1})))},testConnection:function(){var e=this;this.ConnectionService.testConnection().then((function(t){200===t.status?(e.isConnected=!0,e.companyId=t.company_id,e._setConnectionViewSuccessful()):(e.isConnected=!1,e.displayConnectButton=!0,e._setConnectionViewNotConnected(),203!==t.status&&e.createNotificationError({title:e.$tc("newsletter2go.settingForm.titleSaveError"),message:"Status ".concat(t.status,": ").concat(t.error)})),e.isLoading=!1}))},_setConnectionViewSuccessful:function(){this.setting.connectionIconName="regular-check-circle",this.setting.connectionIconColor="#65c765",this.setting.connectionMessage=this.$tc("newsletter2go.settingForm.messageConnectedSuccess")+this.companyId},_setConnectionViewNotConnected:function(){this.setting.connectionIconName="regular-times-hexagon",this.setting.connectionIconColor="#f76363",this.setting.connectionMessage=this.$tc("newsletter2go.settingForm.messageConnectedError")},viewDisconnectDialog:function(){console.log("clicked"),this.isDisconnectDialogVisible=!0},closeDisconnectDialog:function(){this.isDisconnectDialogVisible=!1},disconnect:function(){var e=this;this.isLoading=!0,this.isConnected=!1,this.isDisconnectDialogVisible=!1,this.displayConnectButton=!0,this._setConnectionViewNotConnected(),this.ConnectionService.disconnect().then((function(t){200!==t.status&&e.createNotificationSuccess({title:"Code ".concat(t.status),message:e.$tc("newsletter2go.settingForm.titleSaveError")}),e.isLoading=!1}))}},metaInfo:function(){return{title:this.$createTitle()}}});Shopware.Component.override("sw-settings-index",{template:'{% block sw_settings_content_card_slot_plugins %}\n    {% parent %}\n\n    {% block sw_settings_newsletter2go_item %}\n        <sw-settings-item :label="$tc(\'newsletter2go.general.mainMenuItemGeneral\')"\n                          :to="{ name: \'newsletter2go.app.index\' }"\n                          :backgroundEnabled="false">\n            <template slot="icon">\n                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"  viewBox="0 110 750 300">\n                    <rect style="fill: #00baff;" width="600" height="600"/>\n                    <path style="fill: none;" d="M310.48,347.8c.45.31.9.6,1.35.88C311.38,348.4,310.93,348.1,310.48,347.8Z"\n                          transform="translate(6.37 2.47)"/>\n                    <path style="fill: #3d3d3d;"\n                          d="M310.48,347.8C292.07,335.7,278,315,275.22,305.34h0c.68,3.86-10.06,52.36-15.67,62.49-16.35-6.07-30.47-2.07-44.59-4.22-12.88-2-23.39-4.73-26.69-8.85-8-8-13.93-12.08-24-12.08,0,0-9.45-.52-12.44,11.56-2.5,10.08-7.83,60.09,2.29,74.54,2,2,9.13,3.13,9.77-4.7.73-8.77,10.85-35.36,17-37.22a15.23,15.23,0,0,1,3.87-.9c22.92-3.22,80.8,23.77,92.25,21.14,7-1.6,24.95-30.38,35.43-58l-.61-.4C311.38,348.4,310.93,348.11,310.48,347.8Z"\n                          transform="translate(6.37 2.47)"/>\n                    <path style="fill: #3d3d3d;" d="M311.83,348.68l.61.4h0Z" transform="translate(6.37 2.47)"/>\n                    <path style="fill: none;"\n                          d="M276.29,306.35c-.36-.36-.72-.73-1.05-1.1C275.57,305.62,275.92,306,276.29,306.35Z"\n                          transform="translate(6.37 2.47)"/>\n                    <path style="fill: none;" d="M277.09,307.1l.32.3Z" transform="translate(6.37 2.47)"/>\n                    <path style="fill: #3d3d3d;" d="M275.18,305.18l.06.07Z" transform="translate(6.37 2.47)"/>\n                    <path style="fill: #3d3d3d;" d="M277.09,307.1l-.8-.75Z" transform="translate(6.37 2.47)"/>\n                    <rect style="fill: #3d3d3d;" x="315.61" y="416.13" width="2.76" height="39.61"\n                          transform="translate(-203.62 551.61) rotate(-66.1)"/>\n                    <rect style="fill: #3d3d3d;" x="317.21" y="429.33" width="2.76" height="29.91"\n                          transform="translate(-210.3 558.05) rotate(-66.1)"/>\n                    <rect style="fill: #3d3d3d;" x="318.18" y="441.55" width="2.76" height="21.6"\n                          transform="matrix(0.41, -0.91, 0.91, 0.41, -217.09, 563.73)"/>\n                    <rect style="fill: #3d3d3d;" x="124.37" y="316.72" width="2.76" height="39.61"\n                          transform="translate(-226.6 358.47) rotate(-72.62)"/>\n                    <rect style="fill: #3d3d3d;" x="126.92" y="329.68" width="2.76" height="29.91"\n                          transform="translate(-232.56 366.58) rotate(-72.62)"/>\n                    <rect style="fill: #3d3d3d;" x="128.79" y="341.73" width="2.76" height="21.6"\n                          transform="translate(-238.78 373.91) rotate(-72.62)"/>\n                    <path style="fill: #3d3d3d;"\n                          d="M422.11,456.74c-8.8,0-35.15-7.46-37.51-13.48a66.34,66.34,0,0,0,2.41-6.68c1.25-4.29,21.65-62.62,26.3-84.24,3.11-10.88,5.35-20.73-1.39-33.48-3.25-6.16-11.39-12.75-21.3-18.93-4.39-2.81-8.89-5.43-13.46-7.85,9.13-18.57,73-157.12,67.83-173.88-4.35-14-91.56-51.55-103.22-47.13s-92.8,180.8-88.26,189.4,14.75,12.22,14.75,12.22c-4.83,13.95-.49,24.1,6.9,32.48h0l.06.07c.33.37.69.74,1.05,1.1l.8.75.32.3c9.08,8,27.29,14.57,36.41,17.49l.12,0c2.75.88,4.65,1.42,5.2,1.56h0v0c7.53,2.23,13.17,3.55,14.06,3.75,8.46,1.94,28.46,4.3,38.38,8a43.33,43.33,0,0,1,4.5,2s.26.94-2.13,5.12c-7.12,18.18,2.36,51.33-22.63,92.09,0,0-11.33,17.27-12.13,25.83,0,0-.42,8.93,11.86,10.93,10.25,1.66,63,3.1,76.56-8.17C429.38,464,430,456.75,422.11,456.74Zm-53.19-178.1c-3.36,5.56-12.46,3.44-17.27,1.84a304.67,304.67,0,0,0-52.77-15.28v0c-4.69-1-8.87-1.75-12.19-2.39-10.92-2.11-17.31-1.89-19.36-6.54s72.33-170.72,79.62-171.5,79.92,32.45,83.46,40.74C433.23,132.16,384.66,251,369.92,277,369.6,277.54,369.27,278.06,368.92,278.64Z"\n                          transform="translate(6.37 2.47)"/>\n                    <path d="M275.24,305.25s0,0,0,.09h0C278,315,292.07,335.7,310.48,347.8c.45.3.9.6,1.35.88l.61.4h0l0,0a143.09,143.09,0,0,0,6.64-22.57C317.17,325.84,286.29,317.24,275.24,305.25Z"\n                          transform="translate(6.37 2.47)"/>\n                    <path style="fill: #fff;"\n                          d="M430.4,125.53c-3.54-8.29-76.17-41.53-83.46-40.74s-81.66,166.85-79.62,171.5,8.44,4.43,19.36,6.54c3.32.64,7.5,1.43,12.19,2.39v0a304.67,304.67,0,0,1,52.77,15.28c4.81,1.6,13.91,3.72,17.27-1.84.35-.58.68-1.1,1-1.6C384.66,251,433.23,132.16,430.4,125.53ZM388.47,184c-2.39,8.64-84.21,61.29-88.84,64.22-4.21,2.67-6.55,3-8.62,3a5.55,5.55,0,0,1-1.63-.17c0-.25,1.06-1,1.93-1.71,62.28-48.45,71.71-56.89,77-71.07,5-13.43-7.25-64.39-9.1-72.7a2.51,2.51,0,0,1-.05-1.41,1.21,1.21,0,0,1,.71-.81,1.15,1.15,0,0,1,1.34.3,3.41,3.41,0,0,1,.6,1C366.39,113.81,390.77,175.75,388.47,184Z"\n                          transform="translate(6.37 2.47)"/>\n                    <path style="fill: #3d3d3d;"\n                          d="M361.17,103.72a1.15,1.15,0,0,0-1.34-.3,1.21,1.21,0,0,0-.71.81,2.51,2.51,0,0,0,.05,1.41c1.85,8.31,14.07,59.27,9.1,72.7-5.25,14.18-14.68,22.62-77,71.07-.87.67-1.93,1.46-1.93,1.71a5.55,5.55,0,0,0,1.63.17c2.07,0,4.41-.38,8.62-3,4.63-2.93,86.45-55.58,88.84-64.22,2.3-8.27-22.08-70.21-26.7-79.33A3.41,3.41,0,0,0,361.17,103.72Z"\n                          transform="translate(6.37 2.47)"/>\n                </svg>\n            </template>\n        </sw-settings-item>\n    {% endblock %}\n{% endblock %}\n'});var r=n("YR4w"),i=n("XJ2Y");function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,(r=o.key,i=void 0,i=function(e,t){if("object"!==c(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,t||"default");if("object"!==c(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(r,"string"),"symbol"===c(i)?i:String(i)),o)}var r,i}function l(e,t){return(l=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e})(e,t)}function u(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=g(e);if(t){var r=g(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return d(this,n)}}function d(e,t){if(t&&("object"===c(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function g(e){return(g=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}Shopware.Module.register("newsletter2go-app",{type:"plugin",name:"Newsletter2GoSW6",title:"Newsletter2Go",description:"newsletter2go.general.descriptionTextModule",version:"1.0.0",targetVersion:"1.0.0",color:"#9AA8B5",icon:"regular-cog",snippets:{"de-DE":r,"en-GB":i},settingsItem:[{group:"plugins",to:"newsletter2go.app.index",icon:"regular-cog",backgroundEnabled:!0}],routes:{index:{component:"newsletter2go-index",path:"index",meta:{parentPath:"sw.settings.index"}}}});var f=Shopware.Classes.ApiService,p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&l(e,t)}(i,e);var t,n,o,r=u(i);function i(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"n2g";return s(this,i),r.call(this,e,t,n)}return t=i,(n=[{key:"getValue",value:function(){var e="".concat(this.getApiBasePath(),"/tracking");return this.httpClient.get(e,{headers:this.getBasicHeaders()}).then((function(e){return f.handleResponse(e)}))}},{key:"updateValue",value:function(e){var t="".concat(this.getApiBasePath(),"/tracking");return this.httpClient.put(t,{conversion_tracking:e},{headers:this.getBasicHeaders()}).then((function(e){return f.handleResponse(e)}))}}])&&a(t.prototype,n),o&&a(t,o),Object.defineProperty(t,"prototype",{writable:!1}),i}(f);function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function v(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,(r=o.key,i=void 0,i=function(e,t){if("object"!==h(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,t||"default");if("object"!==h(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(r,"string"),"symbol"===h(i)?i:String(i)),o)}var r,i}function w(e,t){return(w=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e})(e,t)}function m(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=S(e);if(t){var r=S(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return y(this,n)}}function y(e,t){if(t&&("object"===h(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function S(e){return(S=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var C=Shopware.Classes.ApiService,k=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&w(e,t)}(i,e);var t,n,o,r=m(i);function i(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"n2g";return b(this,i),r.call(this,e,t,n)}return t=i,(n=[{key:"testConnection",value:function(){var e="".concat(this.getApiBasePath(),"/connection");return this.httpClient.get(e,{headers:this.getBasicHeaders()}).then((function(e){return C.handleResponse(e)}))}},{key:"disconnect",value:function(){var e="".concat(this.getApiBasePath(),"/connection");return this.httpClient.delete(e,{headers:this.getBasicHeaders()}).then((function(e){return C.handleResponse(e)}))}},{key:"getIntegrationLink",value:function(){var e="".concat(this.getApiBasePath(),"/integration");return this.httpClient.get(e,{headers:this.getBasicHeaders()}).then((function(e){return C.handleResponse(e)}))}}])&&v(t.prototype,n),o&&v(t,o),Object.defineProperty(t,"prototype",{writable:!1}),i}(C),_=Shopware.Application;_.addServiceProvider("ConversionTrackingService",(function(e){var t=_.getContainer("init");return new p(t.httpClient,e.loginService)})),_.addServiceProvider("ConnectionService",(function(e){var t=_.getContainer("init");return new k(t.httpClient,e.loginService)}))},XJ2Y:function(e){e.exports=JSON.parse('{"newsletter2go":{"header":"Newsletter2Go","general":{"mainMenuItemGeneral":"Newsletter2Go","mainHeader":"Newsletter2Go Settings","accountConfigurationTitle":"Account Settings","conversionTrackingTitle":"Conversion-Tracking"},"settingForm":{"connectButton":"Connect to Newsletter2Go","disconnectButton":"Disconnect","conversionTrackingSwitch":"Activate","buttonLabelSave":"Save","buttonLabelConfirm":"Confirm","buttonLabelCancel":"Cancel","titleSaveSuccess":"Settings","titleSaveError":"Settings Error","titleDisconnectDialog":"Disconnect","messageDisconnectDialog":"Do you really want to disconnect?","messageSaveSuccess":"Settings saved successfully","messageSaveError":"Settings are not saved","messageConnectedSuccess":"Connected successfully with company ID: ","messageConnectedError":"Not connected"}}}')},YR4w:function(e){e.exports=JSON.parse('{"newsletter2go":{"header":"Newsletter2Go","general":{"mainMenuItemGeneral":"Newsletter2Go","mainHeader":"Einstellungen für Newsletter2Go","accountConfigurationTitle":"Account Einstellungen","conversionTrackingTitle":"Conversion-Tracking"},"settingForm":{"connectButton":"Mit Newsletter2Go verbinden","disconnectButton":"Verbindung trennen","conversionTrackingSwitch":"Aktivieren","buttonLabelSave":"Speichern","buttonLabelConfirm":"Bestätigen","buttonLabelCancel":"Abbrechen","titleSaveSuccess":"Einstellungen","titleSaveError":"Einstellungen Fehler","titleDisconnectDialog":"Verbindung Trennenung","messageDisconnectDialog":"Wollen Sie wirklich die Verbindung trennen?","messageSaveSuccess":"Die Einstellungen wurden erfolgreich gespeichert","messageSaveError":"Die Einstellungen konnten nicht gespeichert werden","messageConnectedSuccess":"Erfolgreich verbunden. Company ID: ","messageConnectedError":"Nicht verbunden"}}}')}});