

var InputParameters = function(){


  //define the number of dof's per node
  this.ndof=3;

  //define the user element type number 
  this.userno=2;

  // define the nodal geometry x(i,j) where
  // each row (i) cooresponds to a global node number 
  // each column (j) cooresponds to a coordinate direction
  // x =    [5 0
  //         0 0
  //         0 5];

  var x = new MatrixUtil([[0, 0],
                          [10, 0],
                          [0, 12],
                          [10, 12],
                          [14, 12]]);
  x.scalarMultiply(12);
  this.x = x.getMatrix();

  //define element conductivities e(i,j) where
  // j =1   local node number (1) for element i
  // j = 2 - local node number (2) for element i
  // j=3    -material number for element i
  // elem = [1 2 1
  //         2 3 1
  //         1 3 1];
  this.elem = [[1, 3, 1],[2, 4, 1],[3, 4, 2],[4, 5, 1]];


  // define the material properties d(i,j) where 
  // i - material number 
  // j - property (j=1 -- E, j=2 -- A, j=3 -- wx, j4 = wy j=5 -- To , j=6 -- alpha
  //   j7 = I   j8 = h, j9 = t1, j10 = t2) 
  //               E  a  x  y  t          a    i   h  1  2
  // var d = [[29000, 3, 0, 0, 0, 0.0000065, 285, 10, 0, 0],
  //          [29000, 3, 0, -.2, 80, 0.0000065, 285, 10, 100, 60],
  //          [29000, 3, 0, 0, 0, 0.000065, 285, 10, 0, 0]];
  this.materialProperties = [{
    E: 29000, 
    area: 3,
    wx: 0,
    wy:0,
    to: 0,
    alpha: 0.0000065,
    moment: 285,
    height: 10,
    t1: 0,
    t2:0
  }];

   
   // define boundary conditions bc(i,j) where
   // i - global node number
   // 2nd column = x dir
   // 3rd column = y dir
   // 4th column = rotation
   // (0= free, 1= zero, -1 = nonzero)
   this.bc = [[1, 1, 1, -1],
              [2, 1, 1, 1],
              [3, 0, -1, 0],
              [4, 0, 0, 0],
              [5, -1, 1, 1]];
      
   // define the nodal forces fc (i,j) where
   // Node, x force, y force, moment
   this.fc = [4, 0, 2, 0];
   
   // define nodal displacements dc (i ,j) where
   // Node, x disp, ydisp, rotation
   this.dc = [[1, 0, 0, -.01],
              [3, 0, .2, 0],
              [5, .1, 0, 0]];
   
};





