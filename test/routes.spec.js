const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);


describe('Client Routes', () => {
  //happy path
  it('should return the home page with text', (done) => {
   chai.request(server)
   .get('/')
   .end((error, response) => {
     response.should.have.status(200);
     response.should.be.html;
     response.res.text.includes('Palette Picker');
     done();
   });
 });

  //sad path
  it('should return a 404 for a route that does not exitst', (done) => {
    chai.request(server)
    .get('/bender')
    .end((error, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch(error => console.log('Hey', error))
  })

  beforeEach(done => {
    database.seed.run()
    .then(() => done())
    .catch(error => console.log(error))
  });

  describe('GET /api/v1/projects', () => {
    it('should return all the projects', (done) => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('JohnSnow');
        done();
      });
    });

    it('should return all of the palettes', (done) => {
      chai.request(server)
      .get('/api/v1/palettes')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Go Broncos!');
        response.body[0].should.have.property('hex1');
        response.body[0].hex1.should.equal('#EBA148');
        done();
      });
    });
  });

  describe('POST /api/v1/projects', () => {
    it.skip('should save a project to the database', (done) => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        name: 'Tyrion',
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('Array');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Tyrion');
        chai.request(server)
        .get('/api/v1/projects')
        .end((error, response) => {
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          done();
        });
      });
    });

    it('should not create a record with missing data', (done) => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        notTheName: 1,
      })
      .end((error, response) => {
        response.should.have.status(500);
        // response.body.error.should.equal({ error });
        done();
      });
    });

    it.skip('should save a palette to the database', (done) => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        name: 'A Nights Watch',
        hex1: '#FFFFFF',
        hex2: '#DDDDDD',
        hex3: '#HHHHHH',
        hex4: '#AAAAAA',
        hex5: '#CCCCCC',
        project_id: 29
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('Array');
        response.body.length.should.equal(1)
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('A Nights Watch');
        response.body[0].should.have.property('hex1');
        response.body[0].hex1.should.equal('#FFFFFF');
        response.body[0].should.have.property('hex2');
        response.body[0].hex2.should.equal('#DDDDDD');
        response.body[0].should.have.property('hex3');
        response.body[0].hex3.should.equal('#HHHHHH');
        response.body[0].should.have.property('hex4');
        response.body[0].hex4.should.equal('#AAAAAA');
        response.body[0].should.have.property('hex5');
        response.body[0].hex5.should.equal('#CCCCCC');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(3);
        chai.request(server)
        .get('/api/v1/projects')
        .end((error, response) => {
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
      });
    });

  });

  describe('DELETE /api/v1/palettes/:id', () => {
   it.skip('should delete a palette', (done) => {
     chai.request(server)
     .delete('/api/v1/palettes/30')
     .end((error, response) => {
       response.should.have.status(204);
       done();
     });
   });

   it('should return a 422 error if it could not find a palette', () => {
     chai.request(server)
     .delete('/api/v1/palettes/200')
     .end((error, response) => {
       response.should.have.status(422);
       done();
     })
   })
 });

});
