/**
 * Script to populate and process the form data on pricing.html
 */

/**
* Register event listeners
*/
document.getElementById('priceButton').addEventListener('click', displayPricing);
document.getElementById('numberOfPeople').addEventListener('focusout', validateNumberOfPeople);

/**
* Store form field options
*/
let mealPlanOptions = ["Standard", "Gluten Free", "Vegetarian", "Vegan", "Keto", "Diabetic"];
let weekDayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let deliveryOptions = ["Curbside Pickup", "Delivery"];

/**
* Call functions for populating form field options
*/
populateMealPlan();
populateWeekDayOptions();
populateDeliveryOptions();

/**
* Populate options for Meal Plan field
*/
function populateMealPlan() {
    let mealPlanField = document.getElementById('mealPlan');
    mealPlanOptions.forEach(function (element) {
        mealPlanField.innerHTML += '<option>' + element + '</option>';
    });
}

/**
* Populate options for Week Day field and add select all event listener
*/
function populateWeekDayOptions() {
    let weekDayField = document.getElementById('checkbox-wrap');
    weekDayOptions.forEach(function (element) {
        let machineReadableName = element.split(" ").join("");
        weekDayField.innerHTML += '<div class="form-check"><input class="form-check-input" type="checkbox" name="weekDayOptions" id="' + machineReadableName + '" value="' + machineReadableName + '"></input><label class="form-check-label" for="' + machineReadableName + '">' + element + '</label></div>';
    });
    document.getElementById('selectAll').addEventListener('change', selectAllToggle);
}

/**
* Populate options for Delivery Options field
*/
function populateDeliveryOptions() {
    let deliveryOptionsField = document.getElementById('delivery-options-wrap');
    deliveryOptions.forEach(function (element) {
        let machineReadableName = element.split(" ").join("");
        deliveryOptionsField.innerHTML += '<div class="form-check"><input class="form-check-input" type="radio" name="deliveryOption" id="' + machineReadableName + '" value="' + machineReadableName + '"></input><label class="form-check-label" for="' + machineReadableName + '">' + element + '</label></div>';
    });
}

/**
* Toggle select all weekday option checkboxes
*/
function selectAllToggle() {
    let checkboxes = document.getElementsByName('weekDayOptions');
    let selectAll = document.getElementById('selectAll');
    for (let current = 0; current < checkboxes.length; current++) {
        if (selectAll.checked) {
            checkboxes[current].checked = true;
        } else {
            checkboxes[current].checked = false;
        }
    }
}

/**
* Validate that meal plan is selected
*
* @returns {boolean} False if validation fails, true otherwise
*/
function validateMealPlan() {
    let mealPlan = document.getElementById('mealPlan').value;
    let errorMessage = document.getElementsByClassName('form-error meal-plan')[0];
    if (mealPlan == "") {
        errorMessage.classList.remove('d-none');
        return false;
    } else {
        errorMessage.classList.add('d-none');
        return true;
    }
}

/**
* Validate that at least one weekday checkbox was checked
*
* @returns {boolean} False if validation fails, true otherwise
*/
function validateWeekDay() {
    let checkboxes = document.getElementsByName('weekDayOptions');
    let errorMessage = document.getElementsByClassName('form-error days-of-week')[0];
    for (let current = 0; current < checkboxes.length; current++) {
        if (checkboxes[current].checked) {
            errorMessage.classList.add('d-none');
            return true;
        }
    }
    errorMessage.classList.remove('d-none');
    return false;
}

/**
* Validate that numberOfPeople field is not empty and is an integer between 1 - 10
*
* @returns {boolean} False if validation fails, true otherwise
*/
function validateNumberOfPeople() {
    let numberOfPeople = document.getElementById('numberOfPeople').value;
    let errorMessage = document.getElementsByClassName('form-error number-of-people')[0];
    if (numberOfPeople == "" || Number.parseInt(numberOfPeople) < 1 || Number.parseInt(numberOfPeople) > 10) {
        errorMessage.classList.remove('d-none');
        return false;
    } else {
        errorMessage.classList.add('d-none');
        return true;
    }
}

/**
* Validate that delivery option is selected
* 
* @returns {boolean} False if validation fails, true otherwise
*/
function validateDeliveryOptions() {
    let deliveryOptions = document.getElementsByName('deliveryOption');
    let errorMessage = document.getElementsByClassName('form-error delivery-options')[0];
    for (let current = 0; current < deliveryOptions.length; current++) {
        if (deliveryOptions[current].checked) {
            errorMessage.classList.add('d-none');
            return true;
        }
    }
    errorMessage.classList.remove('d-none');
    return false;
}

/**
* Calculate price per day
*
* @returns {number} The calculated price per day
*/
function calculatePricePerDay() {
    let planPrices = {
        Standard: 10.00,
        'Gluten Free': 12.00,
        Vegetarian: 10.00,
        Vegan: 9.50,
        Keto: 12.25,
        Diabetic: 10.50
    }
    let mealPlanField = document.getElementById('mealPlan').value;
    let chosenPlanPrice = planPrices[mealPlanField];
    let numberOfPeople = document.getElementById('numberOfPeople').value;
    return chosenPlanPrice * numberOfPeople;
}


/**
* Calculate fees
*
* @returns {number} The calculated fees, or 0 if no fees
*/
function calculateFees() {
    const deliveryFee = 5.00;
    let deliveryOption = document.querySelector('input#Delivery');
    if (deliveryOption.checked) {
        return deliveryFee;
    }
    else {
        return 0;
    }
}

/**
* Calculate number of days
*
* @returns {number} The calculated number of days
*/
function calculateNumberOfDays() {
    let numberOfDays = 0;
    let checkboxes = document.getElementsByName('weekDayOptions');
    for (let current = 0; current < checkboxes.length; current++) {
        if (checkboxes[current].checked) {
            numberOfDays++;
        }
    }
    return numberOfDays;
}

/**
* Calculate subtotal
*
* @returns {number} The calculated subtotal
*/
function calculateSubtotal() {
    let subtotal = calculatePricePerDay() * calculateNumberOfDays() + calculateFees();
    return subtotal;
}

/**
* Calculate taxes
*
* @returns {number} The calculated taxes
*/
function calculateTaxes() {
    const taxRate = 0.0625;
    let taxes = taxRate * calculateSubtotal();
    return taxes;
}

/**
* Calculate total
*
* @returns {number} The calculated grand total
*/
function calculateTotal() {
    let total = calculateSubtotal() + calculateTaxes();
    return total;
}

/**
* Run validation and display pricing if true
*/
function displayPricing() {
    if (validateMealPlan() && validateNumberOfPeople() && validateWeekDay() && validateDeliveryOptions()) {
        let mealPlan = document.getElementsByClassName('plan-result')[0];
        mealPlan.innerHTML = document.getElementById('mealPlan').value;
        let numberOfPeople = document.getElementsByClassName('people-result')[0];
        numberOfPeople.innerHTML = document.getElementById('numberOfPeople').value;
        let numberOfDays = document.getElementsByClassName('days-result')[0];
        numberOfDays.innerHTML = calculateNumberOfDays();
        let pricePerDay = document.getElementsByClassName('price-result')[0];
        pricePerDay.innerHTML = '$' + calculatePricePerDay().toFixed(2);
        let taxes = document.getElementsByClassName('taxes-result')[0];
        taxes.innerHTML = '$' + calculateTaxes().toFixed(2);
        let fees = document.getElementsByClassName('fees-result')[0];
        fees.innerHTML = '$' + calculateFees().toFixed(2);
        let total = document.getElementsByClassName('total-result')[0];
        total.innerHTML = '$' + calculateTotal().toFixed(2);
        let priceTable = document.querySelector('div.price-calculated');
        priceTable.classList.remove('d-none');
    } else {
        let priceTable = document.querySelector('div.price-calculated');
        priceTable.classList.add('d-none');
    }
}
