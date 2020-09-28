var Car = require('./car.js');
const Validator = require('../validator/validator.js');
const validator = new Validator();
const ErrorMsg = require('../config/error_msg.js');
const UserCommands = require('../config/user_commands.js');
const AppConstant = require('../config/app_constant.js');

class ParkingLot {
    constructor() {
        this.maximumParkingSlots = 0;
        this.parkingSlots = new Array();
    }

    /**
     * @description To initialize parking lot with number of slots
     * @param {Number} slots number of slots
     */
    initializeParkingLot(slots) {
        this.maximumParkingSlots = validator.validateAndGetMaximumSlots(slots);
        // Initialize parking slots with null to make it available for cars
        for (var i = 0; i < this.maximumParkingSlots; i++) {
            this.parkingSlots.push(null);
        }
        return this.maximumParkingSlots;
    }

    /**
     * @description To park a car
     * @param {String} registrationNumber registration number of the car
     * @param {String} color color of the car
     */
    parkCar(registrationNumber, color) {
        validator.checkRegistrationNumberAndColorBothPresent(registrationNumber, color);
        validator.validateParkingLotInitializedYet(this.maximumParkingSlots);
        var slotIndex = this.findNearestAvailableSlot(this.parkingSlots)
        var car = new Car(registrationNumber, color);
        this.parkingSlots[slotIndex] = car;
        return slotIndex + 1;
    }
    
    findNearestAvailableSlot(parkingSlots) {
		for (var slotIndex = 0; slotIndex < parkingSlots.length; slotIndex++) {
			if (parkingSlots[slotIndex] == null) {
				return slotIndex;
			}
		}
		throw new Error(ErrorMsg.FULL_PARKING_LOT);
    }
    
    /**
     * @description To mark a particular slot as free
     * @param {Number} slot slot that needed to be free
     */
    makeSlotFree(slot) {
        var slotIndex = validator.validateAndGetSlotIndexForMarkSlotFree(slot);
        validator.validateParkingLotInitializedYet(this.maximumParkingSlots);
        if (slotIndex >= this.maximumParkingSlots) {
            throw new Error(slot + ErrorMsg.SLOT_NOT_FOUND);
        }
        if (this.parkingSlots[slotIndex] === null) {
            throw new Error(slot + ErrorMsg.SLOT_ALREADY_FREE);
        }
		if (slotIndex > -1 && slotIndex <= this.parkingSlots.length) {
			this.parkingSlots[slotIndex] = null;
        }
        return slot;
    }

    /**
     * @description To get parking lot status (tab delimited output)
     */
    fetchParkingLotStatus() {
        validator.validateParkingLotInitializedYet(this.maximumParkingSlots);
        var arr = new Array();
        arr.push(AppConstant.FILE_HEADER);
        for (var slotIndex = 0; slotIndex < this.parkingSlots.length; slotIndex++) {
            if (this.parkingSlots[slotIndex] != null) {
        	    var slotNumber = slotIndex + 1;
        	    arr.push(slotNumber + '.\t' + this.parkingSlots[slotIndex].registrationNumber + '\t' + this.parkingSlots[slotIndex].color);
            }
        }
        return arr;
    }
    
    /**
     * @description To get registration numbers of car based on car color
     * @param {String} color color of the car (case insensitive)
     */
    fetchRegistrationNumbersByCarColor(color) {
        validator.validateIsEmptyString(color, AppConstant.FIELD_COLOR, UserCommands.REG_NUM_CARS_BY_COLOR);
        return this.fetchProjectedFieldByParticularSearchCriteria(AppConstant.FIELD_REG_NUM, AppConstant.FIELD_COLOR, color);
    }

    /**
     * @description To get the slot numbers based on car color
     * @param {String} color color of the car (case insensitive)
     */
    fetchSlotNumbersByCarColor(color) {
        validator.validateIsEmptyString(color, AppConstant.FIELD_COLOR, UserCommands.SLOT_NUM_CARS_BY_COLOR);
        return this.fetchProjectedFieldByParticularSearchCriteria(AppConstant.FIELD_SLOT_NUM, AppConstant.FIELD_COLOR, color);
    }

    /**
     * @description To get the slot numbers based on car registration number
     * @param {String} registrationNumber registration number of the car (case insensitive)
     */
    fetchSlotNumbersByCarRegistrationNumber(registrationNumber) {
        validator.validateIsEmptyString(registrationNumber, AppConstant.FIELD_REG_NUM, UserCommands.SLOT_NUM_CARS_BY_REG_NUMBER);
        return this.fetchProjectedFieldByParticularSearchCriteria(AppConstant.FIELD_SLOT_NUM, AppConstant.FIELD_REG_NUM, registrationNumber);
    }

    /**
     * @description To get the projected data based on search criteria
     * @param {String} projectionField field that neeeds to be projected on the console
     * @param {String} searchCriteria a criteria based on which we can search
     * @param {String} searchData data for a particular criteria, example RED in case of criteria color
     */
    fetchProjectedFieldByParticularSearchCriteria(projectionField, searchCriteria, searchData) {
        validator.validateParkingLotInitializedYet(this.maximumParkingSlots);
        var results = new Array();
	    for (var slotIndex = 0; slotIndex < this.parkingSlots.length; slotIndex++) {
	        if (this.parkingSlots[slotIndex] && this.parkingSlots[slotIndex][searchCriteria].toLowerCase() == searchData.toLowerCase()) {
	            results.push((projectionField === AppConstant.FIELD_SLOT_NUM) ? slotIndex + 1 : this.parkingSlots[slotIndex][projectionField]);
	        }
        }
        if(results.length>0) {
            return results.join(', ');
        }
        return ErrorMsg.NOT_FOUND;
    }
}

module.exports = ParkingLot;