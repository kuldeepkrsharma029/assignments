const validator = require('validator');
const ErrorMsg = require('../config/error_msg.js');

class Validator {

    validateAndGetMaximumSlots(slots) {
        if(slots === undefined || validator.isEmpty(slots, {ignore_whitespace:true})) {
            throw new Error ('Number of slots is required for initializing parking lot!')
        }
        if(!validator.isNumeric(slots, {no_symbols: true})) {
            throw new Error ('Number of slots should be a valid positive integer greater than 0!')
        }
        var maximumSlots = parseInt(slots);
        if (maximumSlots <= 0) {
			throw new Error('At least 1 slot is required to initialize parking lot!');
        }
        return maximumSlots;
    }

    validateParkingLotInitializedYet(parkingSlots) {
        if (parkingSlots <= 0) {
            throw new Error(ErrorMsg.NOT_INITIALIZED_PARKING_LOT);
        }
    }

    checkRegistrationNumberAndColorBothPresent(resgistrationNumber, color) {
        if(resgistrationNumber === undefined || validator.isEmpty(resgistrationNumber, {ignore_whitespace:true})) {
            throw new Error ('resgistrationNumber is required to park car!')
        }
        if(color === undefined || validator.isEmpty(color, {ignore_whitespace:true})) {
            throw new Error ('color is required to park car!')
        }
    }

    validateAndGetSlotIndexForMarkSlotFree(slotNumber) {
        if(slotNumber === undefined || !validator.isNumeric(slotNumber, {no_symbols: true})) {
            throw new Error ('Slot number should be a valid positive integer greater than 0!')
        }
        return parseInt(slotNumber) - 1;
    }

    validateIsEmptyString(input, projectedField, operation) {
        if(input === undefined || validator.isEmpty(input, {ignore_whitespace:true})) {
            throw new Error (projectedField + 'is required for ' + operation)
        }
    }
    
}

module.exports = Validator;