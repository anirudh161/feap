var FEStress = function(Ue,x,elem,d,ndof,userno){


  //[U,Ue1,nume1,nen,mK.getMatrix()]
  // function [f] = festress(Ue,x,elem,d,ndof,userno)

  // %compute array sizes
  // nume1 = size( elem,1);  %number of elements
  // nen = size(elem,2) - 1; % number of nodes per element 
  // mrecords = size(d,2);  % number of material properties/set 
  // ndm = size(x,2); % dimension of space
  var nume1 = elem.length;
  var nen = 2;
  var mrecords = d.length;
  var ndm = 2;
  var de = [];
  var xe = [];

  // %compute the elment forces
  // for e =1:nume1
  //     for i =1:mrecords 
  //         de(i) = d(elem(e,nen+1),i);
  //     end
  //     for i =1:nen
  //         for j =1:ndm
  //             xe(i,j) = x(elem(e,i),j);
  //         end
  //     end
  //     [Ke, F0e, ft] = elem02(xe,de,Ue(:,e)',nen,ndof,6);
  //     f(:,e) = [ft];
  //     end
  // end
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