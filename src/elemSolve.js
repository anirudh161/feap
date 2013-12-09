var elemSolve = function(x, d, u, nen, ndof, isw){

  console.log(x)
  var dx = x[1][0] - x[0][0];
  var dy = x[1][1] - x[0][1];
  
  var L = Math.sqrt(dx*dx+dy*dy);
  var cn = dx/L;
  var sn = dy/L;

  console.log(d)
  // E = d(1);
  // A = d(2);
  // I = d(7);
  // EA = E*A;
  // wx = d(3);
  // wy = d(4);
  // c1 = .5*L*wx;
  // c2 = .5*L*wy;
  // alpha = d(6);

  // To = d(5);
  // T1 = d(9);
  // T2 = d(10);
  // h = d(8);

  // Tav = .5*(T1+T2);
  // dTo = Tav - To;
  // dT = T1-T2;

  // //form local element stiffness matrix
  // ke = [EA/L     0             0          -EA/L   0             0
  //       0        12*E*I/L^3    6*E*I/L^2  0      -12*E*I/L^3    6*E*I/L^2
  //       0        6*E*I/L^2     4*E*I/L    0      -6*E*I/L^2     2*E*I/L
  //       -E*A/L   0             0          E*A/L   0             0
  //       0       -12*E*I/L^3   -6*E*I/L^2  0       12*E*I/L^3    -6*E*I/L^2
  //       0        6*E*I/L^2     2*E*I/L    0      -6*E*I/L^2      4*E*I/L];
          
  // //form local element load vector
  // f0e = [(-c1+ E*A*alpha*dTo)
  //         -c2
  //         (-wy*L*L/12 -E*I*alpha*dT/h)
  //         (-c1 - E*A*alpha*dTo)
  //         -c2
  //         (wy*L*L/12 + E*I*alpha*dT/h)];
      
      
      
      
  // cn = dx/L;
  // sn = dy/L;
  // //form element transformation matrix
  // B = [cn sn 0 0   0 0 
  //     -sn cn 0 0   0 0
  //       0  0 1 0   0 0 
  //       0  0 0 cn  sn 0
  //       0  0 0 -sn cn 0
  //       0 0  0  0  0 1];

  // if isw ==3
      
  //     //form global element stiffness matrix
  //     Ke = B'*ke*B;
  //     //form global element load vector
  //     F0e = B'*f0e;
  //     //initialize local element force vector (to avoid warning)
  //     fe = 0;
  // elseif isw ==6
  //     //compute local element force vector
  //     fe = ke*B*U' + f0e;
      
  //     //initalize stiffness and load arrays ( to avoid warning)
  //     Ke =0;
  //     F0e = 0;
  // end



}