

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

  var numRows = 7;
  var numColumns = 25;

  var xt = [];
  for(var i = 0 ; i < numColumns ; i++){
    for(var j = 0; j < numRows; j++){
      var a = [i*1.6,j*1.6]
      xt.push(a);
    }
  }

  var x = new MatrixUtil(xt);
  x.scalarMultiply(12);
  this.x = x.getMatrix();

  //define element conductivities e(i,j) where
  // j =1   local node number (1) for element i
  // j = 2 - local node number (2) for element i
  // j=3    -material number for element i
  // elem = [1 2 1
  //         2 3 1
  //         1 3 1];
  // this.elem = [[1, 3, 1],
  //               [2, 4, 1],
  //               [3, 4, 2],
  //               [4, 5, 1]];
  var elemArr = [];
  

  for(var i = 0; i < numColumns ; i++){
    for(var j = 0; j < numRows; j++){
      if( i === 0 && j === 0){
        //far left top corner
        elemArr.push([1,2,1])
        elemArr.push([1,(i+1)*numRows+1,1])
      } else if( i === 0 && j === numRows-1){
        //far left bottom corner
        elemArr.push([numRows,2*numRows,1])
      }else if( i === numColumns - 1 && j ===0){
        //far right top corner
        elemArr.push([numRows*(numColumns-1)+1,numRows*(numColumns-1)+2,1])
      } else if(i === numColumns - 1 && j === numRows -1){  
        //far right bottom corner
      } else if( j === 0){            //generic down- numRows*(i)+j+2
        //inside top
        elemArr.push([numRows*i+1,numRows*(i+1)+1,1]) //right
        elemArr.push([numRows*i+1,numRows*(i)+j+2,1])
      }else if( j === numRows-1){
        //inside bottom

        elemArr.push([numRows*i+numRows,numRows*(i+1)+j+1,1])
      } else if(i === numColumns-1){
        //inside right
        
        elemArr.push([numRows*i+j+1,numRows*(i)+j+2,1])
      } else{
        //everything else

        elemArr.push([numRows*i+j+1,numRows*(i+1)+j+1,1]) //right
        elemArr.push([numRows*i+j+1,numRows*(i)+j+2,1])
      }
    }
  }
  this.elem = elemArr;



  // define the material properties
  this.materialProperties = [{
    E: 29000, //modulus of elasticity
    area: 3, //cross sectional area
    wx: 0, //distributed load in element X axis
    wy:0, //distributed load in element Y axis
    to: 0, //initial temperature 
    alpha: 0.0000065, //coefficient of expansion
    moment: 285, //moment of inertia
    height: 10, //member height
    t1: 0, //temperature on positive Y axis side of member
    t2:0 //temperature on negative Y axis side of member
  },
  {
    E: 29000, 
    area: 3,
    wx: 0,
    wy: 0,
    to: 80,
    alpha: 0.0000065,
    moment: 285,
    height: 10,
    t1: 0,
    t2: 0
  }];

   
   // define boundary conditions bc(i,j) where
   // i - global node number
   // 2nd column = x dir
   // 3rd column = y dir
   // 4th column = rotation
   // (0= free, 1= zero, -1 = nonzero)
   this.bc = [];
    for(var i = 0; i < numRows*numColumns ; i++){
      if(i ===0){
        this.bc.push([1,-1,1,1]);
      } else if(i < numRows){
        this.bc.push([i,-1,1,1]);
      } else{
        this.bc.push([i,0,0,0]);
      }
    }

   // define the nodal forces fc (i,j) where
   // Node, x force, y force, moment
   this.fc = [[numColumns*numRows, 0, -6, 0]];
   
   
   // define nodal displacements dc (i ,j) where
   // Node, x disp, ydisp, rotation
    this.dc = [[1, 0.0001, 0, 0]];
   
};

