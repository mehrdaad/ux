import { observable, bindingMode } from 'aurelia-framework';
import { ValueAttributeObserver, EventSubscriber } from 'aurelia-binding';
import { StyleEngine, AureliaUX } from '@aurelia-ux/core';
import { bindable, customElement, inlineView } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';
import { inject } from 'aurelia-dependency-injection';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var uxTextarea = "<template role=\"textbox\" class=\"ux-textarea\"> <require from=\"@aurelia-ux/textarea/ux-textarea.css\"></require> <textarea ref=\"textbox\" class=\"ux-textarea__inner-textarea\" value.bind=\"rawValue\" focus.bind=\"focus\" disabled.bind=\"disabled & booleanAttr\" readonly.bind=\"readonly & booleanAttr\" require.bind=\"required & booleanAttr\" aria-disabled.bind=\"disabled & booleanAttr\" aria-readonly.bind=\"readonly & booleanAttr\" aria-required.bind=\"required & booleanAttr\">\n  </textarea> <div class=\"ux-textarea__bottom-border\"></div> </template> ";

var VIEW = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': uxTextarea
});

var UxTextArea = /** @class */ (function () {
    function UxTextArea(element, styleEngine) {
        this.element = element;
        this.styleEngine = styleEngine;
        this.autofocus = null;
        this.autoResize = false;
        this.disabled = false;
        this.focus = false;
        this.readonly = false;
        this.value = undefined;
        Object.setPrototypeOf(element, uxTextAreaElementProto);
    }
    UxTextArea.prototype.bind = function () {
        var element = this.element;
        var textbox = this.textbox;
        if (this.autofocus || this.autofocus === '') {
            this.focus = true;
        }
        if (element.hasAttribute('placeholder')) {
            var attributeValue = element.getAttribute('placeholder');
            if (attributeValue) {
                textbox.setAttribute('placeholder', attributeValue);
                element.removeAttribute('placeholder');
            }
        }
        if (this.cols) {
            textbox.setAttribute('cols', this.cols.toString());
            element.removeAttribute('cols');
        }
        if (this.rows) {
            textbox.setAttribute('rows', this.rows.toString());
            element.removeAttribute('rows');
        }
        if (this.minlength) {
            textbox.setAttribute('minlength', this.minlength.toString());
        }
        if (this.maxlength) {
            textbox.setAttribute('maxlength', this.maxlength.toString());
        }
        this.autocompleteChanged(this.autocomplete);
    };
    UxTextArea.prototype.attached = function () {
        var textbox = this.textbox;
        this.isAttached = true;
        this.textbox.addEventListener('change', stopEvent);
        this.textbox.addEventListener('input', stopEvent);
        this.fitTextContent();
        textbox.addEventListener('change', stopEvent);
        textbox.addEventListener('input', stopEvent);
    };
    UxTextArea.prototype.detached = function () {
        var textbox = this.textbox;
        this.isAttached = false;
        textbox.removeEventListener('change', stopEvent);
        textbox.removeEventListener('input', stopEvent);
    };
    UxTextArea.prototype.getValue = function () {
        return this.value;
    };
    UxTextArea.prototype.setValue = function (value) {
        var oldValue = this.value;
        var newValue = value === null || value === undefined ? null : value.toString();
        if (oldValue !== newValue) {
            this.value = newValue;
            this.ignoreRawChanges = true;
            this.rawValue = newValue === null ? '' : newValue.toString();
            this.fitTextContent();
            this.ignoreRawChanges = false;
            this.element.dispatchEvent(DOM.createCustomEvent('change', { bubbles: true }));
        }
    };
    UxTextArea.prototype.autocompleteChanged = function (newValue) {
        if (newValue != null) {
            this.textbox.setAttribute('autocomplete', newValue);
        }
        else {
            this.textbox.removeAttribute('autocomplete');
        }
    };
    UxTextArea.prototype.rawValueChanged = function (rawValue) {
        if (this.ignoreRawChanges) {
            return;
        }
        this.setValue(rawValue);
    };
    UxTextArea.prototype.themeChanged = function (newValue) {
        if (newValue != null && newValue.themeKey == null) {
            newValue.themeKey = 'textarea';
        }
        this.styleEngine.applyTheme(newValue, this.element);
    };
    UxTextArea.prototype.fitTextContent = function () {
        if (this.isAttached && (this.autoResize || this.autoResize === '')) {
            this.textbox.style.height = 'auto';
            this.textbox.style.height = this.textbox.scrollHeight + 2 + "px";
        }
    };
    UxTextArea.prototype.focusChanged = function (focus) {
        focus = focus || focus === '' ? true : false;
        this.element.dispatchEvent(DOM.createCustomEvent(focus ? 'focus' : 'blur', { bubbles: true }));
    };
    __decorate([
        bindable
    ], UxTextArea.prototype, "autocomplete", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "autofocus", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "autoResize", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "cols", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "disabled", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "focus", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "maxlength", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "minlength", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "readonly", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "rows", void 0);
    __decorate([
        bindable
    ], UxTextArea.prototype, "theme", void 0);
    __decorate([
        observable({ initializer: function () { return ''; } })
    ], UxTextArea.prototype, "rawValue", void 0);
    UxTextArea = __decorate([
        inject(Element, StyleEngine),
        customElement('ux-textarea'),
        inlineView(VIEW)
    ], UxTextArea);
    return UxTextArea;
}());
function stopEvent(e) {
    e.stopPropagation();
}
var getVm = function (_) { return _.au.controller.viewModel; };
var uxTextAreaElementProto = Object.create(HTMLElement.prototype, {
    value: {
        get: function () {
            return getVm(this).getValue();
        },
        set: function (value) {
            getVm(this).setValue(value);
        }
    }
});

var UxTextAreaTheme = /** @class */ (function () {
    function UxTextAreaTheme() {
        this.themeKey = 'textarea';
    }
    return UxTextAreaTheme;
}());

/// <reference path="html.d.ts" />
function configure(config) {
    config.container.get(AureliaUX).registerUxElementConfig(uxTextAreaConfig);
    config.globalResources(UxTextArea);
}
var uxTextAreaConfig = {
    tagName: 'ux-textarea',
    properties: {
        value: {
            defaultBindingMode: bindingMode.twoWay,
            getObserver: function (element) {
                return new ValueAttributeObserver(element, 'value', new EventSubscriber(['change']));
            }
        }
    }
};

export { UxTextArea, UxTextAreaTheme, configure };
//# sourceMappingURL=index.js.map
