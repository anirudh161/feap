

var FESolve = function(inputParameters){

  //  compute variables for subsequent use
  var numnp = inputParameters.x.length; //  number of nodal points
  var x = inputParameters.x;
  var nume1 = inputParameters.elem.length; //  number of elements
  var nen =  1; //  number of nodes per elmeent
  var nbc = inputParameters.bc.length;  //  number of boundary nodes
  var nfc = inputParameters.fc.length; // number of force nodes
  var ndc = inputParameters.dc.length; //  number of non-zero displacement nodes
  var ndm = 1; //  dimension of space
  var nummat = inputParameters.materialProperties.length; //  number of material sets
  var mrecords = inputParameters.materialProperties.length; //  number of material properties/set
  var dispflg = 0; // initialize flag
  var ndof = inputParameters.ndof;
  var elem = inputParameters.elem;
  var bc = inputParameters.bc;
  var aib= [];
  var dc = inputParameters.dc;
  var fc = inputParameters.fc;


  var dArr = [];
  for(var i = 0; i < numnp*inputParameters.ndof; i++){
    dArr.push(0);
  }

  //Create element ID matrix
  var id = [];
  for(i=0; i < nume1; i++){
    if(!id[i]){id[i] = [];}
    for(var j = 0; j <= nen; j++){
      id[i].push(ndof*elem[i][j]-2);
      id[i].push(ndof*elem[i][j]-1);
      id[i].push(ndof*elem[i][j]);
    }
  }

  // Setup boundary condition matrices
  var ib = [];
  for(var i = 0; i < numnp*inputParameters.ndof; i++){
    ib.push(0);
  }
  for(i=0; i < nbc; i++){
    if(bc[i][1] < 0){
      ib[ndof*bc[i][0]-3] = -1;
      dispflg = 1;
    } else if(bc[i][1] > 0){
      ib[ndof*bc[i][0]-3] = 1;
    }
    if( bc[i][2] < 0){
      ib[ndof*bc[i][0]-2] = -1;
      dispflg = 1;
    } else if(bc[i][2] > 0){
      ib[ndof*bc[i][0]-2] =1;
    }
    if(bc[i][3] < 0){
      ib[ndof*bc[i][0]-1] = -1;
      dispflg = 1;
    } else if(bc[i][3] > 0){
      ib[ndof*bc[i][0]-1] = 1;
    }
  }

  // find the active dofs
  for(i = 0; i < numnp*ndof; i++){
    if(ib[i]===0){
      aib.push(i);
    }
  }
  nact = aib.length;

  // set non-zero displacement conditions
  var aid = [];
  if(dispflg){
    for(i = 0; i < ndc; i++){
      dArr[(ndof)*dc[i][0]-2] = dc[i][1]
      dArr[(ndof)*dc[i][0]-1] = dc[i][2]
      dArr[(ndof)*dc[i][0]] = dc[i][3]
    }
    for(i = 0; i < numnp*ndof; i++){
      if(ib[i] < 0){
        aid.push(i);
      }
    }
    ndsp = aid.length;
  }

  // set nodal forces 
  var F = [];
  for(i = 0; i < numnp*ndof; i++){
    F.push(0);
  }
  for(i = 0; i < nfc ; i++){
    F[ndof*fc[i][0]-3] = fc[i][1];
    F[ndof*fc[i][0]-2] = fc[i][2];
    F[ndof*fc[i][0]-1] = fc[i][3];
  }


  // zero global stiffness and element force vcetor
  var K = []; //numnp*ndof , nmnp*ndof
  var Fo = []; //numnp*ndof
  var Fr = []; //numnp*ndof
  for(i = 0; i < numnp*ndof; i++){
    var Kinner =[];
    for(var j = 0; j < numnp*ndof; j++){
      Kinner.push(0);
    }
    K.push(Kinner);
    Fo.push(0);
    Fr.push(0);
  }
  var xe = [[0,0],[0,0]];

  for(var e=0;e < nume1; e++){
    for(i = 0 ; i <= nen; i++){
      for(j = 0 ; j <= ndm ; j++){
        xe[i][j] = x[elem[e][i]-1][j];
      }
    }
    var localMatrices = elemSolve(xe, inputParameters.materialProperties[elem[e][2]-1], inputParameters.materialProperties, nen, ndof, 3);
    for(i = 0 ; i < (nen+1)*ndof ; i++){
      for(j = 0; j < (nen+1)*ndof; j++){
        K[id[e][i]-1][id[e][j]-1] = K[id[e][i]-1][id[e][j]-1] + localMatrices[0][i][j];
      }
      F[id[e][i]-1] = F[id[e][i]-1] - localMatrices[1][i];
      Fr[id[e][i]-1] = Fr[id[e][i]-1] - localMatrices[1][i];
    }
  }
  Fr = new MatrixUtil([Fr]);
  Fr.scalarMultiply(-1);

  // form reduced stiffness and lod vector
  var Ff = [];
  var Kff = [];
  for(i = 0; i < nact ; i++){
    Kff.push([]);
    for(j = 0; j < nact ; j++){
      Kff[i].push(0);
    }
    Ff[i] = 0;
  }
  for(i = 0; i < nact ; i++){
    for(j = 0; j < nact ; j++){
      Kff[i][j] = K[aib[i]][aib[j]];
    }
    Ff[i] = F[aib[i]];
  }


  // form reduced stiffness matrix and load vector for non-zero displacement
  var Ur = [];
  var Kfr = [];
  for(i = 0; i < nact; i++){
    Kfr.push([]);
    for(j = 0; j < ndsp ; j++){
      Kfr[i].push(0);
    }
  }

  if(dispflg){
    for(i = 0; i < nact; i++){
      for(j = 0; j < ndsp ; j++){
        Kfr[i][j] = K[aib[i]][aid[j]];
      }
    }
    for(i = 0; i < ndsp ; i++){
      Ur[i] = dArr[aid[i]];
    }
  }

  //  solve for the unknown displacement
  var mKff = new MatrixUtil(Kff);
  var mFf = new MatrixUtil([Ff]);
  var mKfr = new MatrixUtil(Kfr);
  var mUr = new MatrixUtil([Ur]);
  if(dispflg===0){
    mKff.inverse();
    mFf.transpose();
    mKff.multiply(mFf);
  } else{
    mUr.transpose();
    mKfr.multiply(mUr);
    mFf.transpose();
    mFf.subtract(mKfr);
    mKff.inverse();
    mKff.multiply(mFf);
    var Uf = mKff.getMatrix();
  }

  // map displacements to element nodes
  var U = [];
  for(var i = 0; i < numnp*ndof ; i++){
    U.push(0);
  }
  for(var i = 0; i < nact ; i++){
    U[aib[i]] = Uf[i][0];
  }
  if(dispflg){
    for(var i = 0; i < ndsp; i++){
      U[aid[i]] = Ur[i];
    }
  }

  var U1 = [];
  for(var i = 0; i < 3; i++){
    U1.push([]);
  }
  var k = 0 ;
  for(var i = 0; i < numnp; i++){
    U1[0][i] = U[k];
    U1[1][i] = U[k+1];
    U1[2][i] = U[k+2];
    k = k+3;
  }

  //map local displacements
  var Ue = [];
  var Ue1 = [];
  for(var e = 0; e < nume1; e++){
    j = 0;
    if(!Ue[e]){
      Ue.push([])
    }
    if(!Ue1[e]){
      Ue1.push([]);
    }
    for(var i = 0; i < nen+1; i++){

      if(!Ue1[j]){
        Ue1.push([])
      }
      if(!Ue1[j+1]){
        Ue1.push([])
      }
      if(!Ue1[j+2]){
        Ue1.push([])
      }

      Ue[e][i] = U[elem[e][i]-1];
      Ue1[j][e] = U1[0][elem[e][i]-1];
      Ue1[j+1][e] = U1[1][elem[e][i]-1];
      Ue1[j+2][e] = U1[2][elem[e][i]-1];
      j += 3;
    }
    j=1;
  }

  var uCopy = [];
  for(var i = 0 ; i < U.length; i++){
    uCopy.push(U[i]);
  }


  // G = U'-D;
  var mU = new MatrixUtil([U]);
  var mD = new MatrixUtil([dArr]);
  mU.subtract(mD);
  var K2 = [];
  for(var i = 0; i < K.length; i++){
    K2.push([]);
    for(var j = 0; j < K[0].length; j++){
      K2[i].push(K[i][j]);
    }
  }
  var mK2 = new MatrixUtil(K2);
  var mK = new MatrixUtil(K);

  // Calculate reactions = K*D + K*G + Fr;
  mD.transpose()
  mK.multiply(mD);
  mU.transpose();
  mK2.multiply(mU);
  mK.add(mK2);
  Fr.transpose();
  mK.add(Fr);

  //form solution object
  var obj = {
    U: uCopy,
    Ue1: Ue1,
    nume1: nume1,
    nen: nen,
    reactions: mK.getMatrix()
  }

  return obj;
}







