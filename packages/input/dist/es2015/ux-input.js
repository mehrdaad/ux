import { __decorate } from "tslib";
import { customElement, bindable, useView } from 'aurelia-templating';
import { DOM, PLATFORM } from 'aurelia-pal';
import { observable, computedFrom } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import { StyleEngine, normalizeBooleanAttribute, getBackgroundColorThroughParents } from '@aurelia-ux/core';
// tslint:disable-next-line: no-submodule-imports
import '@aurelia-ux/core/components/ux-input-component.css';
// tslint:disable-next-line: no-submodule-imports
import '@aurelia-ux/core/components/ux-input-component--outline.css';
import { UxDefaultInputConfiguration } from './ux-default-input-configuration';
let UxInput = /** @class */ (() => {
    let UxInput = class UxInput {
        constructor(element, styleEngine, defaultConfiguration) {
            this.element = element;
            this.styleEngine = styleEngine;
            this.autofocus = null;
            this.disabled = false;
            this.readonly = false;
            this.variant = 'filled';
            this.dense = false;
            this.rawValue = '';
            this.focused = false;
            defineUxInputElementApis(element);
            if (defaultConfiguration.theme !== undefined) {
                this.theme = defaultConfiguration.theme;
            }
            if (defaultConfiguration.dense !== undefined) {
                this.dense = defaultConfiguration.dense;
            }
            if (defaultConfiguration.variant !== undefined) {
                this.variant = defaultConfiguration.variant;
            }
        }
        bind() {
            const element = this.element;
            const textbox = this.textbox;
            const textboxValue = this.textbox.getAttribute('value');
            if (textboxValue != null) {
                this.rawValue = textboxValue;
            }
            if (this.autofocus || this.autofocus === '') {
                this.focused = true;
            }
            this.dense = normalizeBooleanAttribute('dense', this.dense);
            if (element.hasAttribute('id')) {
                const attributeValue = element.getAttribute('id');
                if (attributeValue) {
                    element.removeAttribute('id');
                    textbox.setAttribute('id', attributeValue);
                }
            }
            if (element.hasAttribute('step')) {
                const attributeValue = element.getAttribute('step');
                if (attributeValue) {
                    textbox.setAttribute('step', attributeValue);
                    element.removeAttribute('step');
                }
            }
            this.typeChanged(this.type);
            if (this.min) {
                textbox.setAttribute('min', this.min.toString());
            }
            if (this.max) {
                textbox.setAttribute('max', this.max.toString());
            }
            if (this.minlength) {
                textbox.setAttribute('minlength', this.minlength.toString());
            }
            if (this.maxlength) {
                textbox.setAttribute('maxlength', this.maxlength.toString());
            }
            this.autocompleteChanged(this.autocomplete);
            this.themeChanged(this.theme);
        }
        attached() {
            this.textbox.addEventListener('change', stopEvent);
            this.textbox.addEventListener('input', stopEvent);
            this.variantChanged(this.variant);
        }
        detached() {
            this.textbox.removeEventListener('change', stopEvent);
            this.textbox.removeEventListener('input', stopEvent);
        }
        getValue() {
            return this.value;
        }
        setValue(value) {
            const oldValue = this.value;
            const newValue = this.processRawValue(value);
            if (oldValue !== newValue) {
                this.value = newValue;
                this.ignoreRawChanges = true;
                this.rawValue = newValue === null || newValue === undefined ? '' : newValue.toString();
                this.ignoreRawChanges = false;
                this.element.dispatchEvent(DOM.createCustomEvent('change', { bubbles: true }));
            }
        }
        processRawValue(rawValue) {
            let newValue = rawValue;
            if (this.type === 'number') {
                newValue = rawValue === '' ? NaN : Number(rawValue);
                if (isNaN(newValue)) {
                    newValue = null;
                }
                else {
                    if (this.min !== undefined && this.min > newValue) {
                        newValue = this.min;
                    }
                    if (this.max !== undefined && newValue > this.max) {
                        newValue = this.max;
                    }
                }
            }
            return newValue;
        }
        autocompleteChanged(newValue) {
            if (newValue == null) {
                this.textbox.removeAttribute('autocomplete');
            }
            else {
                this.textbox.setAttribute('autocomplete', newValue);
            }
        }
        themeChanged(newValue) {
            if (newValue != null && newValue.themeKey == null) {
                newValue.themeKey = 'input';
            }
            this.styleEngine.applyTheme(newValue, this.element);
        }
        focusedChanged(focused) {
            this.element.classList.toggle('ux-input-component--focused', focused);
            this.element.dispatchEvent(DOM.createCustomEvent(focused ? 'focus' : 'blur', { bubbles: false }));
        }
        typeChanged(newValue) {
            if (![
                'text',
                'date',
                'time',
                'datetime-local',
                'password',
                'number',
                'email',
                'url',
                'tel',
                'search'
            ].includes(newValue)) {
                this.type = 'text';
                return;
            }
            this.textbox.setAttribute('type', this.type);
        }
        rawValueChanged(newValue) {
            this.element.classList.toggle('ux-input-component--has-value', newValue.length > 0);
            if (this.ignoreRawChanges) {
                return;
            }
            this.setValue(newValue);
        }
        focus() {
            this.textbox.focus();
        }
        blur() {
            if (document.activeElement === this.textbox) {
                this.textbox.blur();
            }
        }
        variantChanged(newValue) {
            this.element.style.backgroundColor = newValue === 'outline' ?
                this.element.style.backgroundColor = getBackgroundColorThroughParents(this.element) :
                '';
        }
        get placeholderMode() {
            return typeof this.label !== 'string' || this.label.length === 0;
        }
    };
    __decorate([
        bindable
    ], UxInput.prototype, "autofocus", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "autocomplete", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "disabled", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "maxlength", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "minlength", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "min", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "max", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "readonly", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "theme", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "label", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "placeholder", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "type", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "variant", void 0);
    __decorate([
        bindable
    ], UxInput.prototype, "dense", void 0);
    __decorate([
        observable
    ], UxInput.prototype, "rawValue", void 0);
    __decorate([
        observable
    ], UxInput.prototype, "focused", void 0);
    __decorate([
        computedFrom('label')
    ], UxInput.prototype, "placeholderMode", null);
    UxInput = __decorate([
        inject(Element, StyleEngine, UxDefaultInputConfiguration),
        customElement('ux-input'),
        useView(PLATFORM.moduleName('./ux-input.html'))
    ], UxInput);
    return UxInput;
})();
export { UxInput };
function stopEvent(e) {
    e.stopPropagation();
}
const getVm = (_) => _.au.controller.viewModel;
const defineUxInputElementApis = (element) => {
    Object.defineProperties(element, {
        value: {
            get() {
                return getVm(this).getValue();
            },
            set(value) {
                getVm(this).setValue(value);
            },
            configurable: true
        },
        focus: {
            value() {
                getVm(this).focus();
            },
            configurable: true
        },
        blur: {
            value() {
                getVm(this).blur();
            },
            configurable: true
        }
    });
};
//# sourceMappingURL=ux-input.js.map