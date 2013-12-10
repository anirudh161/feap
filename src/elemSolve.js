var elemSolve = function(x, d, u, nen, ndof, isw){

  var dx = x[1][0] - x[0][0];
  var dy = x[1][1] - x[0][1];
  var L = Math.sqrt(dx*dx+dy*dy);
  var cn = dx/L;
  var sn = dy/L;
  var E = d.E;
  var A = d.area;
  var I = d.moment;
  var wx = d.wx;
  var wy = d.wy;
  var c1 = .5*L*wx;
  var c2 = .5*L*wy;
  var  alpha = d.alpha;
  var To = d.to;
  var T1 = d.t1;
  var T2 = d.t2;
  var h = d.height;
  var Tav = .5*(T1+T2);
  var dTo = Tav - To;
  var dT = T1-T2;

  // //form local element stiffness matrix
  // ke = [EA/L     0             0          -EA/L   0             0
  //       0        12*E*I/L^3    6*E*I/L^2  0      -12*E*I/L^3    6*E*I/L^2
  //       0        6*E*I/L^2     4*E*I/L    0      -6*E*I/L^2     2*E*I/L
  //       -E*A/L   0             0          E*A/L   0             0
  //       0       -12*E*I/L^3   -6*E*I/L^2  0       12*E*I/L^3    -6*E*I/L^2
  //       0        6*E*I/L^2     2*E*I/L    0      -6*E*I/L^2      4*E*I/L];
  var ke = new MatrixUtil(
      [
        [E*A/L,  0,             0,          -E*A/L,  0,             0],
        [0,      12*E*I/L/L/L,  6*E*I/L/L,  0,      -12*E*I/L/L/L,  6*E*I/L/L],
        [0,      6*E*I/L/L,     4*E*I/L,    0,      -6*E*I/L/L,     2*E*I/L],
        [-E*A/L, 0,             0,          E*A/L,  0,              0],
        [0,      -12*E*I/L/L/L, -6*E*I/L/L, 0,      12*E*I/L/L/L,   -6*E*I/L/L],
        [0,      6*E*I/L/L,     2*E*I/L,    0,      -6*E*I/L/L,     4*E*I/L]
      ]
    );

  // //form local element load vector
  // f0e = [(-c1+ E*A*alpha*dTo)
  //         -c2
  //         (-wy*L*L/12 -E*I*alpha*dT/h)
  //         (-c1 - E*A*alpha*dTo)
  //         -c2
  //         (wy*L*L/12 + E*I*alpha*dT/h)];
  var foe = new MatrixUtil( 
                            [
                              [(-c1+ E*A*alpha*dTo)],
                              [-c2],
                              [(-wy*L*L/12 -E*I*alpha*dT/h)],
                              [(-c1 - E*A*alpha*dTo)],
                              [-c2],
                              [(wy*L*L/12 + E*I*alpha*dT/h)]
                            ]
                          );
      
  // cn = dx/L;
  // sn = dy/L;
  // //form element transformation matrix
  // B = [cn sn 0 0   0 0 
  //     -sn cn 0 0   0 0
  //       0  0 1 0   0 0 
  //       0  0 0 cn  sn 0
  //       0  0 0 -sn cn 0
  //       0 0  0  0  0 1];

  var cn = dx/L;
  var sn = dy/L;
  //form element transformation matrix
  var B = new MatrixUtil(
    [
        [cn,  sn, 0, 0,   0,  0],
        [-sn, cn, 0, 0,   0,  0],
        [0,   0,  1, 0,   0,  0],
        [0,   0,  0, cn,  sn, 0],
        [0,   0,  0, -sn, cn, 0],
        [0,   0,  0, 0,   0,  1]
    ]
  );

  var Btranspose = new MatrixUtil(B.getMatrix());
  Btranspose.transpose();
  var BtransposeLoad = new MatrixUtil(Btranspose.getMatrix());

  //     //form global element stiffness matrix
  //     Ke = B'*ke*B;
  //     //form global element load vector
  //     F0e = B'*f0e;
  //     //initialize local element force vector (to avoid warning)
  //     fe = 0;
  //form global element stiffness matrix

  Btranspose.multiply(ke);
  Btranspose.multiply(B)
  // foe.multiply(BtransposeLoad);
  BtransposeLoad.multiply(foe);
  return [Btranspose.getMatrix(),foe.getMatrix(),0];
};




