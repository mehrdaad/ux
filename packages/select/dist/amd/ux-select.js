define(["require", "exports", "tslib", "aurelia-framework", "@aurelia-ux/positioning", "aurelia-logging", "@aurelia-ux/core", "./ux-select-theme", "./util", "./ux-default-select-configuration", "@aurelia-ux/core/components/ux-input-component.css", "@aurelia-ux/core/components/ux-input-component--outline.css"], function (require, exports, tslib_1, aurelia_framework_1, positioning_1, aurelia_logging_1, core_1, ux_select_theme_1, util_1, ux_default_select_configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UxSelect = void 0;
    var UP = 38;
    // const RIGHT = 39;
    var DOWN = 40;
    // const LEFT = 37;
    // const ESC = 27;
    var ENTER = 13;
    var SPACE = 32;
    var logger = aurelia_logging_1.getLogger('ux-select');
    var invalidMultipleValueMsg = 'Only null or Array instances can be bound to a multi-select';
    var selectArrayContext = 'context:ux-select';
    var UxSelect = /** @class */ (function () {
        function UxSelect(element, styleEngine, observerLocator, taskQueue, defaultConfiguration, positioningFactory) {
            this.element = element;
            this.styleEngine = styleEngine;
            this.observerLocator = observerLocator;
            this.taskQueue = taskQueue;
            this.positioningFactory = positioningFactory;
            this.selectedOption = null;
            this.variant = 'filled';
            this.dense = false;
            this.ignoreSelectEvent = true;
            // Only chrome persist the element prototype when cloning with clone node
            defineUxSelectElementApis(element);
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
        UxSelect.prototype.bind = function () {
            if (util_1.bool(this.autofocus)) {
                // setTimeout(focusEl, 0, this.button);
            }
            this.dense = core_1.normalizeBooleanAttribute('dense', this.dense);
            if (this.isMultiple) {
                if (!this.value) {
                    this.value = [];
                }
                else if (!Array.isArray(this.value)) {
                    throw new Error(invalidMultipleValueMsg);
                }
            }
            if (!this.winEvents) {
                this.winEvents = new aurelia_framework_1.ElementEvents(window);
            }
            this.themeChanged(this.theme);
            // Initially Synchronize options with value of this element
            this.taskQueue.queueMicroTask(this);
        };
        UxSelect.prototype.attached = function () {
            this.resolveDisplayValue();
            this.variantChanged(this.variant);
            this.positioning = this.positioningFactory(this.element, this.optionWrapperEl, {
                placement: 'bottom-start',
                constraintElement: window,
                offsetY: 0,
            });
        };
        UxSelect.prototype.unbind = function () {
            this.winEvents.disposeAll();
            if (this.arrayObserver) {
                this.arrayObserver.unsubscribe(selectArrayContext, this);
                this.arrayObserver = null;
            }
            this.selectedOption = null;
        };
        UxSelect.prototype.resolveDisplayValue = function () {
            var _this = this;
            var values = this.options
                .filter(function (option) {
                return Array.isArray(_this.value) ?
                    _this.value.some(function (value) { return value === option.value; }) :
                    option.value === _this.value;
            })
                .map(function (t) { return t.innerText; });
            this.displayValue = values.join(', ');
            this.element.classList.toggle('ux-input-component--has-value', this.displayValue.length > 0);
        };
        UxSelect.prototype.synchronizeOptions = function () {
            var value = this.value;
            var isArray = Array.isArray(value);
            var options = this.options;
            var matcher = this.element.matcher || defaultMatcher;
            var i = options.length;
            this.ignoreSelectEvent = true;
            var _loop_1 = function () {
                var option = options[i];
                var optionValue = option.value;
                if (isArray) {
                    option.selected = value.findIndex(function (item) { return !!matcher(optionValue, item); }) !== -1;
                    return "continue";
                }
                option.selected = !!matcher(optionValue, value);
            };
            while (i--) {
                _loop_1();
            }
            this.ignoreSelectEvent = false;
        };
        UxSelect.prototype.synchronizeValue = function () {
            var options = this.options;
            var ii = options.length;
            var count = 0;
            var optionValues = [];
            // extract value from ux-option
            for (var i = 0; i < ii; i++) {
                var option = options[i];
                if (!option.selected) {
                    continue;
                }
                optionValues.push(option.value);
                count++;
            }
            if (this.isMultiple) {
                // multi-select
                if (Array.isArray(this.value)) {
                    var selectValues = this.value;
                    var matcher_1 = this.element.matcher || defaultMatcher;
                    // remove items that are no longer selected.
                    var i = 0;
                    var _loop_2 = function () {
                        var a = selectValues[i];
                        if (optionValues.findIndex(function (b) { return matcher_1(a, b); }) === -1) {
                            selectValues.splice(i, 1);
                        }
                        else {
                            i++;
                        }
                    };
                    while (i < selectValues.length) {
                        _loop_2();
                    }
                    // add items that have been selected.
                    i = 0;
                    var _loop_3 = function () {
                        var a = optionValues[i];
                        if (selectValues.findIndex(function (b) { return matcher_1(a, b); }) === -1) {
                            selectValues.push(a);
                        }
                        i++;
                    };
                    while (i < optionValues.length) {
                        _loop_3();
                    }
                    this.resolveDisplayValue();
                    return; // don't notify.
                }
            }
            else {
                // single-select
                // tslint:disable-next-line:prefer-conditional-expression
                if (count === 0) {
                    optionValues = null;
                }
                else {
                    optionValues = optionValues[0];
                }
                this.setValue(optionValues);
            }
        };
        UxSelect.prototype.setupListAnchor = function () {
            var _this = this;
            if (this.positioning) {
                this.positioning.update();
            }
            this.winEvents.subscribe('wheel', function (e) {
                if (_this.expanded) {
                    if (e.target === aurelia_framework_1.PLATFORM.global || !_this.optionWrapperEl.contains(e.target)) {
                        _this.collapse();
                    }
                }
            }, true);
        };
        UxSelect.prototype.unsetupListAnchor = function () {
            this.winEvents.disposeAll();
        };
        UxSelect.prototype.onKeyboardSelect = function () {
            if (!this.expanded) {
                return;
            }
            var focusedOption = this.focusedUxOption;
            if (this.isMultiple) {
                if (!focusedOption) {
                    return;
                }
                focusedOption.selected = !focusedOption.selected;
            }
            else {
                this.collapse();
            }
        };
        UxSelect.prototype.call = function () {
            this.synchronizeOptions();
        };
        UxSelect.prototype.getValue = function () {
            return this.value;
        };
        UxSelect.prototype.setValue = function (newValue) {
            if (newValue !== null && newValue !== undefined && this.isMultiple && !Array.isArray(newValue)) {
                throw new Error('Only null, undenfined or Array instances can be bound to a multi-select.');
            }
            if (this.value === newValue) {
                return;
            }
            // unsubscribe from old array.
            if (this.arrayObserver) {
                this.arrayObserver.unsubscribe(selectArrayContext, this);
                this.arrayObserver = null;
            }
            if (this.isMultiple) {
                // subscribe to new array.
                if (Array.isArray(newValue)) {
                    this.arrayObserver = this.observerLocator.getArrayObserver(newValue);
                    this.arrayObserver.subscribe(selectArrayContext, this);
                }
            }
            if (newValue !== this.value) {
                this.value = newValue;
                this.resolveDisplayValue();
                this.element.dispatchEvent(aurelia_framework_1.DOM.createCustomEvent('change', { bubbles: true }));
            }
        };
        UxSelect.prototype.expand = function () {
            var _this = this;
            if (this.expanded) {
                return;
            }
            if (this.isExpanding) {
                return;
            }
            this.isExpanding = true;
            this.optionWrapperEl.classList.add('ux-select__list-wrapper--open');
            setTimeout(function () {
                _this.optionCtEl.classList.add('ux-select__list-container--open');
                _this.isExpanding = false;
                _this.expanded = true;
                _this.setFocusedOption(_this.selectedOption);
            }, 0);
            this.setupListAnchor();
        };
        UxSelect.prototype.collapse = function () {
            var _this = this;
            if (this.isCollapsing) {
                return;
            }
            this.isCollapsing = true;
            this.optionCtEl.classList.remove('ux-select__list-container--open');
            var listTransitionString = getComputedStyle(this.element).getPropertyValue('--aurelia-ux--select-list-transition')
                || ux_select_theme_1.UxSelectTheme.DEFAULT_LIST_TRANSITION;
            var listTransition = parseInt(listTransitionString.replace('ms', ''));
            setTimeout(function () {
                var _a;
                (_a = _this.optionWrapperEl) === null || _a === void 0 ? void 0 : _a.classList.remove('ux-select__list-wrapper--open');
                _this.isCollapsing = false;
                _this.expanded = false;
                _this.setFocusedOption(null);
                _this.unsetupListAnchor();
            }, listTransition);
        };
        UxSelect.prototype.setFocusedOption = function (focusedOption) {
            var oldFocusedOption = this.focusedUxOption;
            if (focusedOption !== oldFocusedOption) {
                if (oldFocusedOption) {
                    oldFocusedOption.focused = false;
                }
                if (focusedOption) {
                    focusedOption.focused = true;
                    focusedOption.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }
                this.focusedUxOption = focusedOption;
            }
        };
        UxSelect.prototype.moveSelectedIndex = function (offset) {
            var currentIndex = 0;
            var options = this.options;
            if (this.focusedUxOption) {
                currentIndex = options.indexOf(this.focusedUxOption);
            }
            else if (this.selectedOption) {
                currentIndex = options.indexOf(this.selectedOption);
            }
            var nextIndex = currentIndex + offset;
            if (nextIndex > options.length - 1) {
                nextIndex = options.length - 1;
            }
            if (nextIndex < 0) {
                nextIndex = 0;
            }
            var focusedOption = options[nextIndex];
            if (focusedOption.disabled) {
                if (offset > 0) {
                    if (nextIndex === options.length - 1) {
                        return;
                    }
                    this.moveSelectedIndex(offset + 1);
                }
                else {
                    if (nextIndex < 0) {
                        return;
                    }
                    this.moveSelectedIndex(offset - 1);
                }
                return;
            }
            this.setFocusedOption(focusedOption);
            focusedOption.focused = true;
            if (this.isMultiple) {
                // empty
            }
            else {
                this.ignoreSelectEvent = true;
                if (this.selectedOption) {
                    this.selectedOption.selected = false;
                }
                this.selectedOption = focusedOption;
                this.selectedOption.selected = true;
                this.ignoreSelectEvent = false;
                this.setValue(this.selectedOption.value);
            }
        };
        UxSelect.prototype.onTriggerClick = function () {
            if (!this.isDisabled) {
                if (this.expanded) {
                    return;
                }
                this.expand();
            }
        };
        UxSelect.prototype.onBlur = function () {
            if (!this.element.contains(aurelia_framework_1.DOM.activeElement)) {
                this.collapse();
            }
        };
        UxSelect.prototype.onSelect = function (e) {
            e.stopPropagation();
            if (this.ignoreSelectEvent) {
                return;
            }
            var newSelection = e.detail;
            var lastSelection = this.selectedOption;
            if (this.isMultiple) {
                this.synchronizeValue();
            }
            else {
                this.ignoreSelectEvent = true;
                if (lastSelection) {
                    lastSelection.selected = false;
                }
                this.ignoreSelectEvent = false;
                this.selectedOption = newSelection;
                this.setValue(newSelection.value);
                if (this.expanded) {
                    this.collapse();
                }
            }
        };
        UxSelect.prototype.onKeyDown = function (event) {
            if (this.isDisabled) {
                return;
            }
            // tslint:disable-next-line:switch-default
            switch (event.which) {
                case UP:
                case DOWN:
                    this.moveSelectedIndex(event.which === UP ? -1 : 1);
                    event.preventDefault();
                    break;
                case ENTER:
                case SPACE:
                    this.onKeyboardSelect();
                    event.preventDefault();
                    break;
            }
            return true;
        };
        UxSelect.prototype.themeChanged = function (newValue) {
            if (newValue && !newValue.themeKey) {
                newValue.themeKey = 'ux-select';
            }
            this.styleEngine.applyTheme(newValue, this.element);
        };
        UxSelect.prototype.multipleChanged = function (newValue, oldValue) {
            newValue = util_1.bool(newValue);
            oldValue = util_1.bool(oldValue);
            var hasChanged = newValue !== oldValue;
            if (hasChanged) {
                this.ignoreSelectEvent = true;
                for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
                    var opt = _a[_i];
                    opt.selected = false;
                }
                this.ignoreSelectEvent = false;
                this.selectedOption = null;
                this.setValue(newValue
                    ? [] // Changing from single to multiple = reset value to empty array
                    : null // Changing from multiple to single = reset value to null
                );
            }
        };
        UxSelect.prototype.variantChanged = function (newValue) {
            this.element.style.backgroundColor = newValue === 'outline' ?
                this.element.style.backgroundColor = core_1.getBackgroundColorThroughParents(this.element) :
                '';
        };
        Object.defineProperty(UxSelect.prototype, "placeholderMode", {
            get: function () {
                return typeof this.label !== 'string' || this.label.length === 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UxSelect.prototype, "options", {
            get: function () {
                if (!this.optionCtEl) {
                    return [];
                }
                var result = [];
                var children = this.optionCtEl.children;
                var ii = children.length;
                for (var i = 0; ii > i; ++i) {
                    var element = children[i];
                    if (element.nodeName === 'UX-OPTION') {
                        result.push(element);
                    }
                    else if (element.nodeName === 'UX-OPTGROUP') {
                        var groupOptions = element.options;
                        var jj = groupOptions.length;
                        for (var j = 0; jj > j; ++j) {
                            result.push(groupOptions[j]);
                        }
                    }
                }
                return result;
            },
            enumerable: false,
            configurable: true
        });
        UxSelect.prototype.getOptions = function () {
            return this.options;
        };
        Object.defineProperty(UxSelect.prototype, "isMultiple", {
            get: function () {
                return util_1.bool(this.multiple);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(UxSelect.prototype, "isDisabled", {
            get: function () {
                return util_1.bool(this.disabled);
            },
            enumerable: false,
            configurable: true
        });
        tslib_1.__decorate([
            aurelia_framework_1.bindable()
        ], UxSelect.prototype, "theme", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable()
        ], UxSelect.prototype, "autofocus", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultValue: false })
        ], UxSelect.prototype, "disabled", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultValue: false })
        ], UxSelect.prototype, "multiple", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable
        ], UxSelect.prototype, "label", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable
        ], UxSelect.prototype, "placeholder", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable()
        ], UxSelect.prototype, "variant", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable
        ], UxSelect.prototype, "dense", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.computedFrom('label')
        ], UxSelect.prototype, "placeholderMode", null);
        tslib_1.__decorate([
            aurelia_framework_1.computedFrom('multiple')
        ], UxSelect.prototype, "isMultiple", null);
        tslib_1.__decorate([
            aurelia_framework_1.computedFrom('disabled')
        ], UxSelect.prototype, "isDisabled", null);
        UxSelect = tslib_1.__decorate([
            aurelia_framework_1.inject(Element, core_1.StyleEngine, aurelia_framework_1.ObserverLocator, aurelia_framework_1.TaskQueue, ux_default_select_configuration_1.UxDefaultSelectConfiguration, aurelia_framework_1.Factory.of(positioning_1.UxPositioning)),
            aurelia_framework_1.processContent(ensureUxOptionOrUxOptGroup),
            aurelia_framework_1.customElement('ux-select'),
            aurelia_framework_1.useView(aurelia_framework_1.PLATFORM.moduleName('./ux-select.html'))
        ], UxSelect);
        return UxSelect;
    }());
    exports.UxSelect = UxSelect;
    /**
     * A View-compiler hook that will remove any element that is not `<ux-option>` or `<ux-optgroup/>`
     * as child of this `<ux-select/>` element
     */
    function ensureUxOptionOrUxOptGroup(_, __, node) {
        if (node.hasAttribute('containerless')) {
            logger.warn('Cannot use containerless on <ux-select/>. Consider using as-element instead.');
            node.removeAttribute('containerless');
        }
        var currentChild = node.firstChild;
        while (currentChild) {
            var nextSibling = currentChild.nextSibling;
            if (currentChild.nodeName === 'UX-OPTION' || currentChild.nodeName === 'UX-OPTGROUP') {
                currentChild = nextSibling;
                continue;
            }
            node.removeChild(currentChild);
            currentChild = nextSibling;
        }
        return true;
    }
    var defineUxSelectElementApis = function (element) {
        Object.defineProperties(element, {
            value: {
                get: function () {
                    return util_1.getAuViewModel(this).getValue();
                },
                set: function (v) {
                    util_1.getAuViewModel(this).setValue(v);
                },
                configurable: true
            },
            options: {
                get: function () {
                    return util_1.getAuViewModel(this).getOptions();
                },
                configurable: true
            }
        });
    };
    function defaultMatcher(a, b) {
        return a === b;
    }
});
//# sourceMappingURL=ux-select.js.map