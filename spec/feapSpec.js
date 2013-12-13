var returnArguments = function(){ return arguments; };

  describe('Constructor', function() {

    it('should return an object', function(){
      expect(new InputParameters()).to.be.an(Object);
    });

  describe('Setup', function(){

    it('should contain input properties', function(){

      var params = new InputParameters();

      expect(params.x).to.eql([[0, 0],
                              [120, 0],
                              [0, 144],
                              [120, 144],
                              [168, 144]]);

      expect(params.elem).to.eql([[1, 3, 1],
                                   [2, 4, 1],
                                   [3, 4, 2],
                                   [4, 5, 1]]);
      calculate()

    })

  })

});




