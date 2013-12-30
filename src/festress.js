var FEStress = function(Ue,x,elem,d,ndof,userno){

  var nume1 = elem.length;
  var nen = 2;
  var mrecords = d.length;
  var ndm = 2;
  var de = [];
  var xe = [];

  //compute the elment forces
  var mUe = new MatrixUtil(Ue);
  var f = [];
  mUe.transpose();
  Ue = mUe.getMatrix();
  for(var e = 0; e < nume1; e++){
    de.push([]);
    de[e] = d[elem[e][nen]-1]; //material props and elems are shifted by 1
    for(var i = 0; i < nen; i++){
      for(var j = 0; j < ndm; j++){
        if(!xe[i]){xe.push([])}
        xe[i][j] = x[elem[e][i]-1][j];
      }
    }
    f.push(elemSolve(xe,de[e],Ue[e],nen,ndof,6));
  }
  return f;
};