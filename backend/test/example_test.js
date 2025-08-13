const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Emission = require('../models/Emission');
const { updateEmission, getEmission, addEmission, deleteEmission } = require('../controllers/emissionController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

afterEach(() => sinon.restore());
describe('AddEmission Function Test', () => {

  it('should create a new emission successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { type: 'fuel', subtype: 'petrol', amount: 10, unit: 'L', factor: 2.03, note: 'test' }
    };

    // Mock emission that would be created
    const createdEmission = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Emission.create to return the createdEmission
    const createStub = sinon.stub(Emission, 'create').resolves(createdEmission);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addEmission(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdEmission)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Emission.create to throw an error
    const createStub = sinon.stub(Emission, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { type: 'fuel', subtype: 'petrol', amount: 10, unit: 'L', factor: 2.31, note: 'test' }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addEmission(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('UpdateEmission Function Test', () => {
  
  it('should update emission successfully', async () => {
    // Mock emission data
    const emissionId = new mongoose.Types.ObjectId().toString();;
    const existingEmission = {
      _id: emissionId,
      type: 'fuel',
      subtype: 'petrol',
      amount: 10,
      unit: 'L',
      factor: 2.31,
      note: 'old',
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Emission.findById to return mock doc
    const findByIdStub = sinon.stub(Emission, 'findById').resolves(existingEmission);

    // Mock request & response
    const req = {
      params: { id: emissionId },
      body: { type: 'fuel', subtype: 'diesel', amount: 15, unit: 'L', factor: 2.68, note: 'updated' }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    
    await updateEmission(req, res);

    // Assertions（按常见实现逐字段赋值）
    expect(existingEmission.subtype).to.equal('diesel');
    expect(existingEmission.amount).to.equal(15);
    expect(existingEmission.factor).to.equal(2.68);
    expect(existingEmission.note).to.equal('updated');
    expect(res.status.called).to.be.false; // No error status should be set if success returns json directly
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if emission is not found', async () => {
    const findByIdStub = sinon.stub(Emission, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateEmission(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Emission not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Emission, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateEmission(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetEmission Function Test', () => {

  it('should return emissions for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock emission data
    const emissions = [
      { _id: new mongoose.Types.ObjectId(), type: 'fuel', userId },
      { _id: new mongoose.Types.ObjectId(), type: 'electricity', userId }
    ];

    // Stub Emission.find to return mock docs
    const findStub = sinon.stub(Emission, 'find').resolves(emissions);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getEmission(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(emissions)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Emission.find to throw an error
    const findStub = sinon.stub(Emission, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getEmission(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteEmission Function Test', () => {

  it('should delete an emission successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock emission found in the database
    const doc = { remove: sinon.stub().resolves() };

    // Stub Emission.findById to return the mock doc
    const findByIdStub = sinon.stub(Emission, 'findById').resolves(doc);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteEmission(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(doc.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Emission deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();

  });

  it('should return 404 if emission is not found', async () => {
    // Stub Emission.findById to return null
    const findByIdStub = sinon.stub(Emission, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteEmission(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Emission not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();

  });

  it('should return 500 if an error occurs', async () => {
    // Stub Emission.findById to throw an error
    const findByIdStub = sinon.stub(Emission, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteEmission(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
    afterEach(() => sinon.restore());
  });

});
