const assert = require('assert');
const fileStream = require('fs');
const ParkingLot = require('../src/modules/parkingLot.js');
const UserCommand = require('../src/config/user_commands.js');
const AppConstant = require('../src/config/app_constant.js');
const ErrMsg = require('../src/config/error_msg.js');

var commandLines = [];
var parkingLot = new ParkingLot();

describe('Test reading commands from inputData.txt', function () {
  it('Reading file inputData.txt', function (done) {
    fileStream.readFile('./test/resources/inputData.txt', AppConstant.UTF_8, function (err, data) {
      if (err) {
          console.error(err);
        throw 'Unable to read inputData.txt!';
      }
      commandLines = data.split('\n');
      done();
    });
  });

  it('Testing commands from file', function (done) {
      assert.strictEqual(commandLines[0].split(AppConstant.CMD_SPLITTER)[0], UserCommand.CREATE_PARKING_LOT);
      assert.strictEqual(commandLines[1].split(AppConstant.CMD_SPLITTER)[0], UserCommand.PARK_CAR);
      assert.strictEqual(commandLines[7].split(AppConstant.CMD_SPLITTER)[0], UserCommand.LEAVE);
      assert.strictEqual(commandLines[8], UserCommand.STATUS);
      done();
  });
});

// Unit test cases for each and every functionalities from ParkingLot class
describe('Testing all functionalities in ParkingLot class', function () {
  it('Initialize parking lot with number of slots', function (done) {
      var createdSlots = parkingLot.initializeParkingLot(commandLines[0].split(AppConstant.CMD_SPLITTER)[1]);
      assert.strictEqual(createdSlots, 6);
      done();
  });

  it('Parking Car 1', function (done) {
      var allocatedSlot = parkingLot.parkCar(commandLines[1].split(AppConstant.CMD_SPLITTER)[1], commandLines[1].split(AppConstant.CMD_SPLITTER)[2]);
      assert.strictEqual(allocatedSlot, 1);
      done();
  });

  it('Parking Car 2', function (done) {
      var allocatedSlot = parkingLot.parkCar(commandLines[2].split(AppConstant.CMD_SPLITTER)[1], commandLines[2].split(AppConstant.CMD_SPLITTER)[2]);
      assert.strictEqual(allocatedSlot, 2);
      done();
  });

  it('Parking Car 3', function (done) {
      var allocatedSlot = parkingLot.parkCar(commandLines[3].split(AppConstant.CMD_SPLITTER)[1], commandLines[3].split(AppConstant.CMD_SPLITTER)[2]);
      assert.strictEqual(allocatedSlot, 3);
      done();
  });

  it('Parking Car 4', function (done) {
      var allocatedSlot = parkingLot.parkCar(commandLines[4].split(AppConstant.CMD_SPLITTER)[1], commandLines[4].split(AppConstant.CMD_SPLITTER)[2]);
      assert.strictEqual(allocatedSlot, 4);
      done();
  });

  it('Parking Car 5', function (done) {
      var allocatedSlot = parkingLot.parkCar(commandLines[5].split(AppConstant.CMD_SPLITTER)[1], commandLines[5].split(AppConstant.CMD_SPLITTER)[2]);
      assert.strictEqual(allocatedSlot, 5);
      done();
  });

  it('Parking Car 6', function (done) {
      var allocatedSlot = parkingLot.parkCar(commandLines[6].split(AppConstant.CMD_SPLITTER)[1], commandLines[6].split(AppConstant.CMD_SPLITTER)[2]);
      assert.strictEqual(allocatedSlot, 6);
      done();
  });

  it('Marking slot free for 4', function (done) {
      var slotMarkedFree = parkingLot.makeSlotFree(commandLines[7].split(AppConstant.CMD_SPLITTER)[1]);
      assert.strictEqual(slotMarkedFree, '4');
      done();
  });

  it('Status check', function (done) {
      var results = parkingLot.fetchParkingLotStatus();
      assert.strictEqual(results.length, 6);
      done();
  });

  it('Parking Car 7, allocate to the nearest empty slot i.e. 4', function (done) {
      var allocatedSlot = parkingLot.parkCar(commandLines[9].split(AppConstant.CMD_SPLITTER)[1], commandLines[9].split(AppConstant.CMD_SPLITTER)[2]);
      assert.strictEqual(allocatedSlot, 4);
      done();
  });

  it('Parking Car 8, should give error', function (done) {
      try {
        parkingLot.parkCar(commandLines[10].split(AppConstant.CMD_SPLITTER)[1], commandLines[10].split(AppConstant.CMD_SPLITTER)[2]);
      }
      catch (err) {
        assert.strictEqual(err.message, ErrMsg.FULL_PARKING_LOT);
      }
      done();
  });

  it('Registration numbers for cars which are of white color', function (done) {
      var registrationNumbers = parkingLot.fetchRegistrationNumbersByCarColor(commandLines[11].split(AppConstant.CMD_SPLITTER)[1]);
      assert.strictEqual(registrationNumbers, 'KA-01-HH-1234, KA-01-HH-9999, KA-01-P-333');
      done();
  });

  it('Slot numbers for cars which are of white color', function (done) {
      var slotNumbers = parkingLot.fetchSlotNumbersByCarColor(commandLines[12].split(AppConstant.CMD_SPLITTER)[1]);
      assert.strictEqual(slotNumbers, '1, 2, 4');
      done();
  });

  it('Slot number of car which registration number is -> KA-01-HH-3141', function (done) {
      var slotNumbers = parkingLot.fetchSlotNumbersByCarRegistrationNumber(commandLines[13].split(AppConstant.CMD_SPLITTER)[1]);
      assert.strictEqual(slotNumbers, '6');
      done();
  });

  it('Slot number of car which registration number is ->  MH-04-AY-1111, should give Not Found', function (done) {
      var slotNumbers = parkingLot.fetchSlotNumbersByCarRegistrationNumber(commandLines[14].split(AppConstant.CMD_SPLITTER)[1]);
      assert.strictEqual(slotNumbers, 'Not Found');
      done();
  });

});