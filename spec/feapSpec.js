var returnArguments = function(){ return arguments; };

describe('Constructor', function() {

  it('should return an object', function(){
    expect(new InputParameters()).to.be.an(Object);
  });

});


