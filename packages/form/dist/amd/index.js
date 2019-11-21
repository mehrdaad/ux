define('@aurelia-ux/form', ['exports', 'aurelia-templating', 'aurelia-pal', 'aurelia-dependency-injection', '@aurelia-ux/core'], function (exports, aureliaTemplating, aureliaPal, aureliaDependencyInjection, core) { 'use strict';

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

    var uxForm = "<template role=\"form\" class=\"ux-form\"> <require from=\"@aurelia-ux/form/ux-form.css\"></require> <slot></slot> </template> ";

    var UX_FORM_VIEW = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': uxForm
    });

    var UxForm = /** @class */ (function () {
        function UxForm(element, styleEngine) {
            this.element = element;
            this.styleEngine = styleEngine;
            this.bindSubmitToEnter = false;
        }
        UxForm.prototype.bind = function () {
            if (this.theme != null) {
                this.themeChanged(this.theme);
            }
            if (this.submitOnEnter !== undefined) {
                this.bindSubmitToEnter = true;
            }
        };
        UxForm.prototype.attached = function () {
            var _this = this;
            if (this.bindSubmitToEnter) {
                this.element.addEventListener('keyup', function (e) {
                    var canSubmit = true;
                    if (e.srcElement != null && e.srcElement.tagName === 'TEXTAREA') {
                        canSubmit = false;
                    }
                    if (e.keyCode === 13 && canSubmit) {
                        _this.submitForm();
                    }
                });
            }
        };
        UxForm.prototype.detached = function () {
            var _this = this;
            if (this.bindSubmitToEnter) {
                this.element.removeEventListener('keyup', function (e) {
                    if (e.keyCode === 13) {
                        _this.submitForm();
                    }
                });
            }
        };
        UxForm.prototype.themeChanged = function (newValue) {
            if (newValue != null && newValue.themeKey == null) {
                newValue.themeKey = 'form';
            }
            this.styleEngine.applyTheme(newValue, this.element);
        };
        UxForm.prototype.submitForm = function () {
            var submitEvent = aureliaPal.DOM.createCustomEvent('submit', { bubbles: true, target: this.element });
            this.element.dispatchEvent(submitEvent);
        };
        __decorate([
            aureliaTemplating.bindable
        ], UxForm.prototype, "theme", void 0);
        __decorate([
            aureliaTemplating.bindable
        ], UxForm.prototype, "submitOnEnter", void 0);
        UxForm = __decorate([
            aureliaDependencyInjection.inject(Element, core.StyleEngine),
            aureliaTemplating.customElement('ux-form'),
            aureliaTemplating.inlineView(UX_FORM_VIEW)
        ], UxForm);
        return UxForm;
    }());

    var uxField = "<template class=\"ux-form__field\"> <slot></slot> </template> ";

    var UX_FIELD_VIEW = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': uxField
    });

    var UxField = /** @class */ (function () {
        function UxField(element) {
            this.element = element;
        }
        UxField.prototype.attached = function () {
            if (this.label && !this.element.querySelector('label')) {
                this.labelElement = document.createElement('label');
                this.labelElement.textContent = this.label;
                this.element.insertBefore(this.labelElement, this.element.firstChild);
            }
        };
        UxField.prototype.labelChanged = function (newValue) {
            if (this.labelElement != null) {
                this.labelElement.textContent = newValue;
            }
        };
        __decorate([
            aureliaTemplating.bindable
        ], UxField.prototype, "label", void 0);
        UxField = __decorate([
            aureliaDependencyInjection.inject(Element),
            aureliaTemplating.customElement('ux-field'),
            aureliaTemplating.inlineView(UX_FIELD_VIEW)
        ], UxField);
        return UxField;
    }());

    var UxSubmitCustomAttribute = /** @class */ (function () {
        function UxSubmitCustomAttribute(element) {
            this.element = element;
            this.canSubmit = false;
        }
        UxSubmitCustomAttribute.prototype.attached = function () {
            var _this = this;
            var currentParent = this.element.parentElement;
            while (currentParent != null) {
                if (currentParent.tagName === 'UX-FORM') {
                    this.canSubmit = true;
                    this.submitEvent = aureliaPal.DOM.createCustomEvent('submit', { bubbles: true });
                    this.element.addEventListener('mouseup', function () {
                        _this.element.dispatchEvent(_this.submitEvent);
                    });
                    break;
                }
                currentParent = currentParent.parentElement;
            }
        };
        UxSubmitCustomAttribute.prototype.detached = function () {
            var _this = this;
            if (this.canSubmit) {
                this.element.removeEventListener('mouseup', function () {
                    _this.element.dispatchEvent(_this.submitEvent);
                });
            }
        };
        UxSubmitCustomAttribute = __decorate([
            aureliaDependencyInjection.inject(Element)
        ], UxSubmitCustomAttribute);
        return UxSubmitCustomAttribute;
    }());

    var UxFormTheme = /** @class */ (function () {
        function UxFormTheme() {
            this.themeKey = 'form';
        }
        return UxFormTheme;
    }());

    function configure(config) {
        config.globalResources([
            UxForm,
            UxField,
            UxSubmitCustomAttribute
        ]);
    }

    exports.UxField = UxField;
    exports.UxForm = UxForm;
    exports.UxFormTheme = UxFormTheme;
    exports.UxSubmitCustomAttribute = UxSubmitCustomAttribute;
    exports.configure = configure;

    Object.defineProperty(exports, '__esModule', { value: true });

});
//# sourceMappingURL=index.js.map
