"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UxTextArea = void 0;
var tslib_1 = require("tslib");
var aurelia_templating_1 = require("aurelia-templating");
var aurelia_pal_1 = require("aurelia-pal");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var core_1 = require("@aurelia-ux/core");
var aurelia_framework_1 = require("aurelia-framework");
// tslint:disable-next-line: no-submodule-imports
require("@aurelia-ux/core/components/ux-input-component.css");
// tslint:disable-next-line: no-submodule-imports
require("@aurelia-ux/core/components/ux-input-component--outline.css");
var UxTextArea = /** @class */ (function () {
    function UxTextArea(element, styleEngine) {
        this.element = element;
        this.styleEngine = styleEngine;
        this.autofocus = null;
        this.autoResize = false;
        this.disabled = false;
        this.readonly = false;
        this.variant = 'filled';
        this.dense = false;
        this.focused = false;
        this.value = undefined;
        defineUxTextAreaElementApis(element);
    }
    UxTextArea.prototype.bind = function () {
        var element = this.element;
        var textbox = this.textbox;
        if (this.autofocus || this.autofocus === '') {
            this.focused = true;
        }
        this.dense = core_1.normalizeBooleanAttribute('dense', this.dense);
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
        this.themeChanged(this.theme);
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
        this.variantChanged(this.variant);
    };
    UxTextArea.prototype.detached = function () {
        var textbox = this.textbox;
        this.isAttached = false;
        textbox.removeEventListener('change', stopEvent);
        textbox.removeEventListener('input', stopEvent);
    };
    UxTextArea.prototype.focus = function () {
        this.textbox.focus();
    };
    UxTextArea.prototype.blur = function () {
        if (document.activeElement === this.textbox) {
            this.textbox.blur();
        }
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
            this.element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent('change', { bubbles: true }));
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
    UxTextArea.prototype.rawValueChanged = function (newValue) {
        this.element.classList.toggle('ux-input-component--has-value', typeof newValue === 'string' && newValue.length > 0);
        if (this.ignoreRawChanges) {
            return;
        }
        this.setValue(newValue);
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
    UxTextArea.prototype.focusedChanged = function (focus) {
        focus = focus || focus === '' ? true : false;
        this.element.classList.toggle('ux-input-component--focused', focus);
        this.element.dispatchEvent(aurelia_pal_1.DOM.createCustomEvent(focus ? 'focus' : 'blur', { bubbles: true }));
    };
    UxTextArea.prototype.variantChanged = function (newValue) {
        this.element.style.backgroundColor = newValue === 'outline' ?
            this.element.style.backgroundColor = core_1.getBackgroundColorThroughParents(this.element) :
            '';
    };
    Object.defineProperty(UxTextArea.prototype, "placeholderMode", {
        get: function () {
            return typeof this.label !== 'string' || this.label.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "autocomplete", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "autofocus", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "autoResize", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "cols", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "disabled", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "maxlength", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "minlength", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "readonly", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "rows", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "label", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "placeholder", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "theme", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "variant", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], UxTextArea.prototype, "dense", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.observable({ initializer: function () { return ''; } })
    ], UxTextArea.prototype, "rawValue", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.observable()
    ], UxTextArea.prototype, "focused", void 0);
    tslib_1.__decorate([
        aurelia_framework_1.computedFrom('label')
    ], UxTextArea.prototype, "placeholderMode", null);
    UxTextArea = tslib_1.__decorate([
        aurelia_dependency_injection_1.inject(Element, core_1.StyleEngine),
        aurelia_templating_1.customElement('ux-textarea'),
        aurelia_framework_1.useView(aurelia_pal_1.PLATFORM.moduleName('./ux-textarea.html'))
    ], UxTextArea);
    return UxTextArea;
}());
exports.UxTextArea = UxTextArea;
function stopEvent(e) {
    e.stopPropagation();
}
var getVm = function (_) { return _.au.controller.viewModel; };
var defineUxTextAreaElementApis = function (element) {
    Object.defineProperties(element, {
        value: {
            get: function () {
                return getVm(this).getValue();
            },
            set: function (value) {
                getVm(this).setValue(value);
            },
            configurable: true
        },
        focus: {
            value: function () {
                getVm(this).focus();
            },
            configurable: true
        },
        blur: {
            value: function () {
                getVm(this).blur();
            },
            configurable: true
        }
    });
};
//# sourceMappingURL=ux-textarea.js.map