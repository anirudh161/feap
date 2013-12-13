
var FEAP = function(){
  this.inputParameters = new InputParameters();
};

FEAP.prototype.solve = function(){
  var output = FESolve(this.inputParameters);
  output.force = FEStress(output.Ue1,this.inputParameters.x,this.inputParameters.elem,this.inputParameters.materialProperties,3,2);
  return output;
}


