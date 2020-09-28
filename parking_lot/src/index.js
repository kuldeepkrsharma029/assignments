const fileStream = require('fs');
const readLine = require('readline');
var	cmdLineInputs = process.argv;
var fileMode = false;

const UserCommand = require('./config/user_commands.js');
const AppConstant = require('./config/app_constant.js');
const ErrorMsg = require('./config/error_msg.js');
var ParkingLot = require('./modules/parkingLot.js');
var parkingLot = new ParkingLot();


if (cmdLineInputs[cmdLineInputs.length - 1].endsWith('.txt')) {
    fileMode = true;
    fileStream.readFile(cmdLineInputs[2], AppConstant.UTF_8, function (err, data) {
        if (err) {
            console.log(ErrorMsg.FILE_READ_ERROR);
        }
        var line = data.split('\n');
		for (var i = 0; i < line.length; i++) {
			processUserCommands(line[i]);
        }
        process.exit(1);
    });
}
else {
    fileMode = false;
    openInteractiveConsole();
}

function openInteractiveConsole () {

    var prompts = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    // option for user to enter commands
    if (!fileMode) {
        prompts.question('Input: ', function (data) {
            processUserCommands(data);
        });
    }
}

function processUserCommands (inputCommand) {
	var operation = inputCommand.split(' ')[0];
	var totalParkingSlots;
    var	parkingSlotNumber;
    var	parkingSlotNumbes;
    try {
        switch (operation) {
            case UserCommand.CREATE_PARKING_LOT:
                totalParkingSlots = parkingLot.initializeParkingLot(inputCommand.split(' ')[1]);
                console.log('Created a parking lot with ' + totalParkingSlots + ' slots');
                break;
            case UserCommand.PARK_CAR:
                parkingSlotNumber = parkingLot.parkCar(inputCommand.split(' ')[1], inputCommand.split(' ')[2]);
                console.log('Allocated slot number: ' + parkingSlotNumber);
                break;
            case UserCommand.LEAVE:
                parkingSlotNumber = parkingLot.makeSlotFree(inputCommand.split(' ')[1]);
                console.log('Slot number ' + parkingSlotNumber + ' is free');
                break;
            case UserCommand.STATUS:
                var parkingSlotStatus = parkingLot.fetchParkingLotStatus();
                console.log(parkingSlotStatus.join('\n'));
                break;
            case UserCommand.REG_NUM_CARS_BY_COLOR:
                var registrationNumberOfCarsByColor = parkingLot.fetchRegistrationNumbersByCarColor(inputCommand.split(' ')[1]);
                console.log(registrationNumberOfCarsByColor);
                break;
            case UserCommand.SLOT_NUM_CARS_BY_COLOR:
                parkingSlotNumbes = parkingLot.fetchSlotNumbersByCarColor(inputCommand.split(' ')[1]);
                console.log(parkingSlotNumbes);
                break;
            case UserCommand.SLOT_NUM_CARS_BY_REG_NUMBER:
                parkingSlotNumbes = parkingLot.fetchSlotNumbersByCarRegistrationNumber(inputCommand.split(' ')[1]);
                console.log(parkingSlotNumbes);
                break;
            case UserCommand.EXIT:
                console.log('Exit application as user input is :: exit');
                process.exit(0);
            default:
                throw new Error('Unsupported Operations :: ' + operation);
        }
    } catch (err) {
        console.log(err.message);
    }
    openInteractiveConsole();
}