
var calculate = function(){

  var inputParameters = new InputParameters();

  //[U,Ue1,nume1,nen,mK.getMatrix()]
  var output = FESolve(inputParameters);
  // (Ue,x,elem,d,ndof,userno)

  var forces = FEStress(output.Ue1,inputParameters.x,inputParameters.elem,inputParameters.materialProperties,3,2);
  console.log(forces);
};
calculate();



  // var obj = {
  //   U: U,
  //   Ue1: Ue1,
  //   nume1: nume1,
  //   nen: nen,
  //   K: mK.getMatrix()
  // }
