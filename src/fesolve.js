

var FESolve = function(inputParameters){

// function [U,Ue1,nume1,nen,reactions] = fesolve(x,elem,d,bc,fc,dc,ndof,userno)

  //  compute variables for subsequent use
  var numnp = inputParameters.x.length; //size(x,1);  //  number of nodal points
  var nume1 = inputParameters.elem.length; //size(elem,1);  //  number of elements
  var nen =  1; //note 0 index //size(elem,2)-1; //  number of nodes per elmeent
  var nbc = inputParameters.bc.length;  //size(bc,1) ;   //  number of boundary nodes
  var nfc = inputParameters.fc.length; //size(fc,1); // number of force nodes
  var ndc = inputParameters.dc.length; //size(dc,1); //  number of non-zero displacement nodes
  var ndm = 2; //size(x,2); //  dimension of space
  var nummat = inputParameters.materialProperties.length;//size(d,1);  //  number of material sets
  var mrecords = 10;//size(d,2); //  number of material properties/set
  var dispflg = 0; // initialize flag
  var ndof = inputParameters.ndof;
  var elem = inputParameters.elem;
  var bc = inputParameters.bc;


  var dArr = [];
  for(var i = 0; i < numnp*inputParameters.ndof; i++){
    dArr.push([0]);
  }
  var D = new MatrixUtil(dArr);//zeros(numnp*ndof,1);


  // //  define Id array
  // for e =1 : nume1
  //     k = 0;
  //     for i = 1:nen
  //         id(e,1+k) = ndof*elem(e,i)-2;
  //         id(e,2+k) = ndof*elem(e,i)-1;
  //         id(e,3+k) = ndof*elem(e,i)-0;
  //         k=k+3;
  //     end
  // end
  var id = [];
  for(i=0; i < nume1; i++){
    if(!id[i]){id[i] = [];}
    for(var j = 0; j <= nen; j++){
      id[i].push(ndof*elem[i][j]-2);
      id[i].push(ndof*elem[i][j]-1);
      id[i].push(ndof*elem[i][j]);
    }
  }

  // // boundary condition stuff
  // ib = zeros(numnp*ndof,1);
  // for j =1:nbc
  //     if bc(j,2) < 0
  //         ib(ndof*bc(j,1)-2) = -1;
  //         dispflg =1;
  //     elseif bc(j,2) > 0
  //         ib(ndof*bc(j,1)-2) = 1;
  //     end
  //     if bc(j,3) < 0
  //         ib(ndof*bc(j,1)-1) = -1;
  //         dispflg =1;
  //     elseif bc(j,3) > 0
  //         ib(ndof*bc(j,1)-1) = 1;
  //     end
  //     if bc(j,4) < 0
  //         ib(ndof*bc(j,1)-0) = -1;
  //         dispflg = 1;
  //     elseif bc(j,4) > 0
  //         ib(ndof*bc(j,1)-0) = 1;
  //     end
  // end

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
  console.log(ib);


  // // finds the active dofs
  // j=0;
  // for i =1:numnp*ndof
  //     if ib(i) == 0
  //         j = j+1;
  //         aib(j) = i;
  //     end
  // end
  // nact = j;
      
      

  // // set non-zero displacement conditions
  // if dispflg ==1
  //     D = zeros(numnp*ndof,1);
  //     ndc = size(dc,1);
  //     for j =1: ndc
  //         D(ndof*dc(j,1)-2) = dc(j,2);
  //         D(ndof*dc(j,1)-1) = dc(j,3);
  //         D(ndof*dc(j,1)-0) = dc(j,4);
  //     end
  //     j = 0;
  //     for i =1:numnp*ndof
  //         if ib(i) < 0
  //             j=j+1;
  //             aid(j) = i;
  //         end
  //     end
  //     ndsp = j;
  // end



  // // set nodal forces 
  // F = zeros(numnp*ndof,1);
  // for j =1:nfc
  //     F(ndof*fc(j,1)-2) = fc(j,2);
  //     F(ndof*fc(j,1)-1) = fc(j,3);
  //     F(ndof*fc(j,1)-0) = fc(j,4);
  // end

  // //  for i=1:numnp*ndof
  // //      F(i) = 0;
  // //      for j=1:nfc
  // //          if fc(j,1) ==i
  // //              if fc(j,2) ~=0
  // //                  F(i) =fc(j,2);
  // //              end
  // //          end
  // //      end
  // //  end

  // // zero global stiffness and element force vcetor
  // K = zeros(numnp*ndof,numnp*ndof);
  // F0 = zeros(numnp*ndof,1);
  // Fr = zeros(numnp*ndof,1);
  // //  form element global stiffness matrix and load vcetor and assemble
  // for e=1:nume1
  //     for i=1:mrecords 
  //         de(i) = d(elem(e,nen+1),i);
  //     end
  //     for i=1:nen
  //         for j=1:ndm
  //             xe(i,j) = x(elem(e,i),j);
  //         end
  //     end
      
  //     if userno ==1
  // //          [Ke,F0e,fe] = elem01(xe,de,de,nen,ndof,3);
  //             xe
  //     elseif userno==2
  //         [Ke,F0e,fe] = elem02(xe,de,de,nen,ndof,3);
  //     else
  //         disp('Element not found')
  //         pause
  //     end
      
      
  //     // assemble local element array into system array
  //     for i =1:nen*ndof
  //         for j=1: nen*ndof
  //             K(id(e,i),id(e,j)) = K(id(e,i),id(e,j)) + Ke(i,j);
  //         end
  //             F(id(e,i)) = F(id(e,i)) - F0e(i);
  //             Fr(id(e,i)) = Fr(id(e,i))-F0e(i);
  //     end
  // end
  // Fr = -Fr;

  // // form reduced stiffness and lod vector
  // for i=1: nact
  //     for j =1: nact
  //         Kff(i,j) = K(aib(i),aib(j));
  //     end
  //     Ff(i) = F(aib(i));
  // end

  // // form reduced stiffness matrix and load vector for non-zero displacement
  // if dispflg ==1
  //     for i=1:nact 
  //         for j =1:ndsp
  //             Kfr(i,j) = K(aib(i),aid(j));
  //         end
  //     end
  //     for i=1:ndsp
  //         Ur(i) = D(aid(i));
  //     end
  // end


  // //  solve for the unknown displacement
  // if dispflg ==0
  //     Uf = Kff\Ff';
  // elseif dispflg ==1
  //     Uf = Kff\(Ff' - Kfr*Ur');
  // end


  // // map displacements to element nodes
  // for i=1:numnp*ndof
  //     U(i) = 0;
  // end
  // for i =1:nact
  //     U(aib(i)) = Uf(i);
  // end
  // if dispflg ==1
  //     for i =1:ndsp
  //         U(aid(i)) = Ur(i);
  //     end 
  // end

  // j=1;
  // for e=1:numnp
  //     U1(1,e) = U(1,j);
  //     U1(2,e) = U(1,j+1);
  //     U1(3,e) = U(1,j+2);
  //     j=j+3;
  // end
    


  // for e=1:nume1
  //     j=1;
  //     for i = 1:nen
  //         Ue(e,i) = U(elem(e,i));
  //         Ue1(j,e) = U1(1,elem(e,i));
  //         Ue1(j+1,e) = U1(2,elem(e,i));
  //         Ue1(j+2,e) = U1(3,elem(e,i));
  //         j = j+3;
  //     end
  //     j=1;
  // end
  // Ue1;
  // G = U'-D;
  // a=K*G;
  // b=K*D;
  // reactions = K*D + K*G+Fr;


}

