FEAP.js
=============

Frame-based finite element analysis (FEA) framework.  This framework can be used to model real-world physical structures.  Build a structure by inputting its geometry and information about the members (beams, columns, etc) that form that structure, then put loads on the structure.  FEAP will tell you the forces in each member, all reaction forces, and all non-fixed displacements.  Only works for 2D.  

More on FEA here - http://en.wikipedia.org/wiki/Finite_element_method

Usage
-----

Demo- from base directory:

```
git submodule update --init
open index.html
```

Real usage:

Edit mesh.js to describe your structure.  



What am I looking at?
----------

Imagine the following: A simple steel beam sticking out of a wall.  What would happen to that beam if you pulled down on the very tip of it?
![alt tag](http://i.imgur.com/ta6gsm9.png)

So if we modeled this in FEAP.js, our D3 output would return the following.  Note the "undeflected shape" is what the structure would look like without any load of it.  This is provided on the canvas simply as a frame of reference.

![alt tag](http://i.imgur.com/FALLLvt.png)

Raw number data can be grabbed by executing feap.solve():

```
> feap.solve()
	// Object {U: Array[525], Ue1: Array[318], nume1: 318, nen: 1, reactions: Array[525]…}
	// U: Array[525]
	// Ue1: Array[318]
	// force: Array[318]
	// nen: 1
	// nume1: 318
	// reactions: Array[525]
```

Ok, how do I make my own structure?
----------

Edit mesh.js.  Mesh describes the location of each "node" (connection point), which nodes are connected to which, the materials that are used to connect each, and the imposed displacements and forces on each node.  See comments in mesh.js.  

A sample alternative structure is contained in Demo_mesh2.js
