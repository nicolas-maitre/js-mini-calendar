"use strict"
class MiniCalendar{
    constructor(container=document.body, startDay = new Date()){
        this.dayLength = 1000 * 60 * 60 * 24;

        this.months = {};
        this.selectedMonthId = 0;

        this.container = container;
        this.elem = container.addElement('mini-calendar');
        
        let menu = this.elem.addElement('menu');
        let lastMonthBtn = menu.addElement('button', {_textContent: '<'});
        this.monthDisplay = menu.addElement('p', {_textContent: '...'});
        let nextMonthBtn = menu.addElement('button', {_textContent: '>'});     
        this.datesContainer = this.elem.addElement('div', {id: 'datesContainer'});

        lastMonthBtn.addEventListener('click', evt=>this.setLastMonth());
        nextMonthBtn.addEventListener('click', evt=>this.setNextMonth());

        this.setDate(startDay);
    }
    setDate(date){
        this.monthDisplay.textContent = this._getTranslatedMonth(date.getMonth());
        if(this.months[this.selectedMonthId]){
            this.months[this.selectedMonthId].container.classList.add('none');
        }
        let month = this._buildMonth(date);
        if(this.months[month.id]){
            this.months[month.id].container.remove();
        }
        this.months[month.id] = month;
        this.selectedMonthId = month.id;
    }
    setNextMonth(){
        let newDate = new Date(this.selectedMonthId);
        let lastDateMonth = newDate.getMonth();
        while (newDate.getMonth() === lastDateMonth) {
            newDate = new Date(newDate.getTime() + this.dayLength);
        }
        //oulàlà
        this.setDate(newDate);
    }
    setLastMonth(){
        let newDate = new Date(this.selectedMonthId);
        let lastDateMonth = newDate.getMonth();
        while (newDate.getMonth() === lastDateMonth) {
            newDate = new Date(newDate.getTime() - this.dayLength);
        }
        //oulàlà
        this.setDate(newDate);
    }
    _buildMonth(startDay){
        let startDayStamp = startDay.getTime();
        let firstDayStamp = startDayStamp - (startDay.getDate() - 1) * this.dayLength
        let firstDay = new Date(firstDayStamp);
        let firstMonday = firstDay;
        while (firstMonday.getDay() !== 1) {
            firstMonday = new Date(firstMonday.getTime() - this.dayLength);
        }
        let startDayMonth = startDay.getMonth();
        let firstMondayStamp = firstMonday.getTime();
        let weeksContainer = this.datesContainer.addElement('div', {class: 'weeks'});
        for (let indWeek = 0; indWeek < 6; indWeek++) {
            let weekElem = weeksContainer.addElement('div');
            for (let indDay = 0; indDay < 7; indDay++) {
                let index = indWeek * 7 + indDay;
                let dayStamp = firstMondayStamp + this.dayLength * index
                let dayDate = new Date(dayStamp);
                let dayElem = weekElem.addElement('button', {_textContent: dayDate.getDate()});
                if(dayDate.getMonth() !== startDayMonth){
                    dayElem.classList.add('external');
                }
                if(startDayStamp == dayStamp){
                    dayElem.classList.add('this-day');
                }
            }
        }
        return {
            firstDay,
            id: firstDayStamp,
            container: weeksContainer
        }
    }
    _getTranslatedMonth(index){
        const translatedMonths = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
        return translatedMonths[index];
    }
}

//utils xd
Element.prototype.addElement = function(type, attributes = {} /*or class*/){
	if(typeof attributes === 'string'){
		attributes = {class: attributes}
	}
	return this.appendChild(newElement(type, attributes));
}
function newElement(type, attributes = {}){
	var elem = document.createElement(type);
	for(var attrName in attributes){
		var attrVal = attributes[attrName];
		//You could probably analye the string to extract the property to modify but it's simpler and faster like that.
		if(attrName === '_textContent'){ elem.textContent = attrVal; continue; }
		if(attrName === '_innerText'){ elem.innerText = attrVal; continue; }
		if(attrName === '_innerHTML'){ elem.innerHTML = attrVal; continue; }
		if(attrName === '_value'){ elem.value = attrVal; continue; }
		if(attrName === '_dataset'){ Object.assign(elem.dataset, attrVal); continue; }
		elem.setAttribute(attrName, attrVal);
	}
	return elem;
}