import { bindable, ViewResources, customElement, inlineView } from 'aurelia-templating';
import { observable, bindingMode, computedFrom } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import * as moment from 'moment';
import { StyleEngine } from '@aurelia-ux/core';

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

const _moment = moment;

class DatetimeUtility {
    /**
     * Checks to see if a date is beyond the min or max set date
     * @param date The date to check
     */
    static dateOutOfRange(date, minDate, maxDate, config) {
        let result = false;
        if (minDate != null && date.isBefore(minDate, 'day')) {
            result = true;
        }
        if (maxDate != null && date.isAfter(maxDate, 'day')) {
            result = true;
        }
        if (config && config.calendarSettings) {
            const settings = config.calendarSettings;
            if (settings.disableDays &&
                settings.disableDays.some(disabledDate => this.checkDayForDisabled(disabledDate, date))) {
                result = true;
            }
        }
        return result;
    }
    static checkDayForDisabled(disabledDateConfig, date) {
        if (disabledDateConfig.weekday != null) {
            return disabledDateConfig.weekday === date.weekday();
        }
        if (disabledDateConfig.day || disabledDateConfig.month || disabledDateConfig.year) {
            const disabledDate = Object.assign({}, disabledDateConfig);
            if (disabledDate.year == null) {
                disabledDate.year = date.year();
            }
            if (disabledDate.day == null) {
                disabledDate.day = date.date();
            }
            if (disabledDate.month == null) {
                disabledDate.month = date.month() + 1;
            }
            const parsedVal = _moment(`${disabledDate.month}-${disabledDate.day}-${disabledDate.year}`);
            return parsedVal.isValid() && parsedVal.isSame(date, 'day');
        }
        return false;
    }
}

var uxCalendar = "<template> <require from=\"@aurelia-ux/datepicker/ux-calendar.css\"></require> <div class=\"ux-calendar__month-display\"> <ux-button type=\"text\" click.delegate=\"previousMonth()\"> <svg viewBox=\"0 0 24 24\" class=\"ux-calendar__svg-icon\"> <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path> </svg> </ux-button> <span> ${displayMonth.format('MMMM YYYY')} </span> <ux-button type=\"text\" click.delegate=\"nextMonth()\"> <svg viewBox=\"0 0 24 24\" class=\"ux-calendar__svg-icon\"> <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path> </svg> </ux-button> </div> <div class=\"ux-calendar__row ux-calendar__row--weekdays\"> <div class=\"ux-calendar__day\" repeat.for=\"weekday of weekdays\"> ${weekday[0]} </div> </div> <div class=\"ux-calendar__row\" repeat.for=\"week of calendarRows\"> <div class=\"ux-calendar__day\" repeat.for=\"day of week\"> <div click.delegate=\"changeCalendarSelection(day)\" if.bind=\"day\" class=\"ux-calendar__day--highlight ${day.isSame(value, 'day') ? 'ux-calendar__day--selected' : ''} ${isValidDate(day) ? 'ux-calendar__day--out-of-range' : '' }\"> ${day.date()} </div> </div> </div> </template> ";

var UX_CALENDAR_VIEW = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': uxCalendar
});

let UxCalendar = class UxCalendar {
    constructor(resources) {
        this.resources = resources;
        this.theme = null;
        this.weekdays = _moment.weekdays();
        this.calendarRows = new Array();
    }
    bind() {
        this.displayMonth = this.value.clone();
    }
    previousMonth() {
        this.displayMonth = this.displayMonth.clone().subtract(1, 'month');
    }
    nextMonth() {
        this.displayMonth = this.displayMonth.clone().add(1, 'month');
    }
    changeCalendarSelection(newDate) {
        const modifiedDate = this.value.clone()
            .set('date', newDate.date())
            .set('month', newDate.month())
            .set('year', newDate.year());
        if (this.isValidDate(modifiedDate)) {
            return;
        }
        this.value = modifiedDate;
    }
    displayMonthChanged(newDate) {
        this.calendarRows = new Array();
        const clonedDate = newDate.clone();
        const firstDay = clonedDate.startOf('month').weekday();
        const daysInMonth = newDate.daysInMonth();
        let currentWeek = new Array();
        while (currentWeek.length < firstDay) {
            currentWeek.push(null);
        }
        for (let index = 0; index < daysInMonth; index++) {
            currentWeek.push(clonedDate.clone().add(index, 'days'));
            if (currentWeek.length === 7) {
                this.calendarRows.push(currentWeek);
                currentWeek = new Array();
            }
        }
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            this.calendarRows.push(currentWeek);
        }
    }
    isValidDate(date) {
        return DatetimeUtility.dateOutOfRange(date, this.minDate, this.maxDate, this.config);
    }
};
__decorate([
    bindable
], UxCalendar.prototype, "theme", void 0);
__decorate([
    bindable
], UxCalendar.prototype, "weekdays", void 0);
__decorate([
    bindable
], UxCalendar.prototype, "minDate", void 0);
__decorate([
    bindable
], UxCalendar.prototype, "maxDate", void 0);
__decorate([
    bindable
], UxCalendar.prototype, "value", void 0);
__decorate([
    bindable
], UxCalendar.prototype, "config", void 0);
__decorate([
    observable
], UxCalendar.prototype, "displayMonth", void 0);
UxCalendar = __decorate([
    inject(ViewResources),
    customElement('ux-calendar'),
    inlineView(UX_CALENDAR_VIEW)
], UxCalendar);

var uxDatepicker = "<template class=\"ux-datepicker\"> <require from=\"@aurelia-ux/datepicker/ux-datepicker.css\"></require> <input class=\"ux-datepicker__inner-input\" ref=\"textbox\" value.bind=\"textboxValue\" blur.trigger=\"changeTextboxValue()\">  <div class=\"ux-datepicker__icon-container\" click.trigger=\"toggleDialog('month')\" if.bind=\"type !== 'time'\"> <svg viewBox=\"0 0 24 24\" class=\"ux-datepicker__calendar-icon\"> <path d=\"M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z\"></path> </svg> </div> <div class=\"ux-datepicker__border-bottom\"></div> <div class=\"ux-datepicker__overlay\" if.bind=\"showDialog\"> <ux-picker-dialog display.bind=\"display\" config.bind=\"config\" type.bind=\"type\" initial-date.bind=\"initialDate\" close-dialog.call=\"showDialog = false\" min-date.bind=\"minDate\" max-date.bind=\"maxDate\" value.two-way=\"value\"></ux-picker-dialog> </div> </template> ";

var UX_DATEPICKER_VIEW = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': uxDatepicker
});

let UxDatepicker = class UxDatepicker {
    constructor(element, resources, styleEngine) {
        this.element = element;
        this.resources = resources;
        this.styleEngine = styleEngine;
        this.display = 'month';
        this.type = 'datetime';
        this.formatters = {
            date: 'L',
            time: 'LT',
            datetime: 'L LT'
        };
        this.parsers = {
            time: ['h:m a', 'H:m']
        };
        this.showDialog = false;
    }
    bind() {
        this.processAttribute('placeholder');
        if (this.initialDate != null) {
            const dateParse = _moment(this.initialDate);
            if (dateParse.isValid()) {
                this.initialDate = dateParse;
            }
        }
        else {
            this.initialDate = _moment();
        }
        if (this.minDate != null) {
            const dateParse = _moment(this.minDate);
            this.minDate = dateParse.isValid() ? dateParse : null;
        }
        if (this.maxDate != null) {
            const dateParse = _moment(this.maxDate);
            this.maxDate = dateParse.isValid() ? dateParse : null;
        }
        if (this.minTime != null) {
            const dateParse = _moment(this.minTime, this.parsers.time);
            this.minTime = dateParse.isValid() ? dateParse : null;
        }
        if (this.maxTime != null) {
            const dateParse = _moment(this.maxTime, this.parsers.time);
            this.maxTime = dateParse.isValid() ? dateParse : null;
        }
        this.valueChanged(this.value);
        this.themeChanged(this.theme);
    }
    toggleDialog(display) {
        if (this.showDialog) {
            this.showDialog = false;
            return;
        }
        this.display = display;
        this.showDialog = true;
    }
    changeTextboxValue() {
        if (!this.textboxValue) {
            this.value = null;
            return;
        }
        let parseValue;
        parseValue = this.type === 'time' ? _moment(this.textboxValue, this.parsers.time) : _moment(this.textboxValue);
        if (parseValue.isValid() &&
            DatetimeUtility.dateOutOfRange(parseValue, this.minDate, this.maxDate, this.config) === false) {
            this.value = parseValue.toDate();
        }
        else {
            this.value = null;
            this.textboxValue = '';
        }
    }
    valueChanged(newValue) {
        if (newValue == null) {
            return;
        }
        if (this.type.toLowerCase() === 'datetime') {
            this.textboxValue = _moment(newValue).format(this.formatters.datetime);
        }
        if (this.type.toLowerCase() === 'date') {
            this.textboxValue = _moment(newValue).format(this.formatters.date);
        }
        if (this.type.toLowerCase() === 'time') {
            this.textboxValue = _moment(newValue).format(this.formatters.time);
        }
        this.showDialog = false;
    }
    minDateChanged(newValue) {
        if (newValue != null && newValue instanceof _moment === false) {
            const dateParse = _moment(newValue);
            this.minDate = dateParse.isValid() ? dateParse : null;
        }
    }
    maxDateChanged(newValue) {
        if (newValue != null && newValue instanceof _moment === false) {
            const dateParse = _moment(newValue);
            this.maxDate = dateParse.isValid() ? dateParse : null;
        }
    }
    minTimeChanged(newValue) {
        if (newValue != null && newValue instanceof _moment === false) {
            const dateParse = _moment(newValue, this.parsers.time);
            this.minTime = dateParse.isValid() ? dateParse : null;
        }
    }
    maxTimeChanged(newValue) {
        if (newValue != null && newValue instanceof _moment === false) {
            const dateParse = _moment(newValue, this.parsers.time);
            this.maxTime = dateParse.isValid() ? dateParse : null;
        }
    }
    themeChanged(newValue) {
        if (newValue != null && newValue.themeKey == null) {
            newValue.themeKey = 'datepicker';
        }
        this.styleEngine.applyTheme(newValue, this.element);
    }
    processAttribute(attributeName) {
        const attributeValue = this.element.getAttribute('placeholder');
        if (attributeValue) {
            this.element.removeAttribute(attributeName);
            this.textbox.setAttribute(attributeName, attributeValue);
        }
    }
};
__decorate([
    bindable
], UxDatepicker.prototype, "theme", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "display", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "type", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "initialDate", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "minTime", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "maxTime", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "minDate", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "maxDate", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "placeholder", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "config", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "formatters", void 0);
__decorate([
    bindable
], UxDatepicker.prototype, "parsers", void 0);
__decorate([
    bindable({ defaultBindingMode: bindingMode.twoWay })
], UxDatepicker.prototype, "value", void 0);
UxDatepicker = __decorate([
    inject(Element, ViewResources, StyleEngine),
    customElement('ux-datepicker'),
    inlineView(UX_DATEPICKER_VIEW)
], UxDatepicker);

var uxPickerDialog = "<template role=\"dialog\"> <require from=\"@aurelia-ux/datepicker/ux-picker-dialog.css\"></require> <header> <template if.bind=\"type !== 'time'\"> <div class=\"year ${display === 'year' ? 'active':''}\" click.trigger=\"display = 'year'\"> ${selectedDate.format('YYYY')} </div> <div class=\"date ${display === 'month' ? 'active':''}\" click.trigger=\"display = 'month'\"> ${selectedDate.format('ddd, MMM D')} </div> </template> </header> <ux-year-list if.bind=\"display === 'year'\" config.bind=\"config\" min-date.bind=\"minDate\" max-date.bind=\"maxDate\" value.two-way=\"selectedDate\"> </ux-year-list> <ux-calendar if.bind=\"display === 'month'\" config.bind=\"config\" value.two-way=\"selectedDate\" min-date.bind=\"minDate\" max-date.bind=\"maxDate\"> </ux-calendar> <footer> <ux-button type=\"text\" click.delegate=\"closeDialog()\">Cancel</ux-button> <ux-button type=\"text\" click.delegate=\"selectDate()\">OK</ux-button> </footer> </template> ";

var UX_PICKER_DIALOG_VIEW = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': uxPickerDialog
});

let UxPickerDialog = class UxPickerDialog {
    constructor(resources) {
        this.resources = resources;
        this.theme = null;
        this.type = 'datetime';
        this.display = 'month';
    }
    bind() {
        if (this.value != null) {
            this.selectedDate = _moment(this.value);
        }
        else {
            this.selectedDate = this.initialDate;
            if (this.minDate != null && this.selectedDate.isBefore(this.minDate)) {
                this.selectedDate = _moment(this.minDate).clone();
            }
            if (this.maxDate != null && this.selectedDate.isBefore(this.maxDate)) {
                this.selectedDate = _moment(this.minDate).clone();
            }
        }
    }
    valueChanged(newDate) {
        this.selectedDate = _moment(newDate);
    }
    selectDate() {
        if (this.selectedDate != null) {
            this.value = this.selectedDate.toDate();
        }
    }
    changeView(view) {
        this.display = view;
    }
};
__decorate([
    bindable
], UxPickerDialog.prototype, "theme", void 0);
__decorate([
    bindable
], UxPickerDialog.prototype, "type", void 0);
__decorate([
    bindable
], UxPickerDialog.prototype, "display", void 0);
__decorate([
    bindable
], UxPickerDialog.prototype, "weekdays", void 0);
__decorate([
    bindable
], UxPickerDialog.prototype, "config", void 0);
__decorate([
    bindable
], UxPickerDialog.prototype, "initialDate", void 0);
__decorate([
    bindable
], UxPickerDialog.prototype, "minDate", void 0);
__decorate([
    bindable
], UxPickerDialog.prototype, "maxDate", void 0);
__decorate([
    bindable
], UxPickerDialog.prototype, "value", void 0);
__decorate([
    bindable
], UxPickerDialog.prototype, "closeDialog", void 0);
UxPickerDialog = __decorate([
    inject(ViewResources),
    customElement('ux-picker-dialog'),
    inlineView(UX_PICKER_DIALOG_VIEW)
], UxPickerDialog);

var uxYearList = "<template class=\"ux-year-list\"> <require from=\"@aurelia-ux/datepicker/ux-year-list.css\"></require> <template repeat.for=\"year of yearList\"> <div class=\"ux-year-list__year ${year == value.year() ? 'ux-year-list__year--selected' : ''}\" click.delegate=\"selectYear(year)\"> ${year} </div> </template> </template> ";

var UX_YEAR_LIST_VIEW = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': uxYearList
});

let UxYearList = class UxYearList {
    constructor(element, resources) {
        this.element = element;
        this.resources = resources;
        this.theme = null;
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);
    }
    attached() {
        this.scrollToActive();
    }
    selectYear(year) {
        this.value = this.value.clone().set('year', year);
    }
    get yearList() {
        const yearList = [];
        let min = 1900;
        let max = 2100;
        if (this.minDate) {
            min = this.minDate.year();
        }
        if (this.maxDate) {
            max = this.maxDate.year();
        }
        while (min <= max) {
            yearList.push(min);
            min++;
        }
        return yearList;
    }
    scrollToActive() {
        let selected = this.element.querySelector('div.selected');
        if (selected == null && this.element.children.length > 5) {
            selected = this.element.children[Math.round(this.element.children.length / 2)];
        }
        if (selected != null) {
            selected.scrollIntoView();
        }
    }
};
__decorate([
    bindable
], UxYearList.prototype, "theme", void 0);
__decorate([
    bindable
], UxYearList.prototype, "minDate", void 0);
__decorate([
    bindable
], UxYearList.prototype, "maxDate", void 0);
__decorate([
    bindable
], UxYearList.prototype, "value", void 0);
__decorate([
    computedFrom('minDate', 'maxDate')
], UxYearList.prototype, "yearList", null);
UxYearList = __decorate([
    inject(Element, ViewResources),
    customElement('ux-year-list'),
    inlineView(UX_YEAR_LIST_VIEW)
], UxYearList);

class UxDatepickerTheme {
    constructor() {
        this.themeKey = 'datepicker';
    }
}

function configure(config) {
    config.globalResources([
        UxCalendar,
        UxDatepicker,
        UxPickerDialog,
        UxYearList
    ]);
}

export { UxDatepickerTheme, configure };
//# sourceMappingURL=index.js.map
