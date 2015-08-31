Class('Shapes').inherits(Widget)({
  prototype : {
    init : function(config){
      Widget.prototype.init.call(this, config);
    },

    setup : function setup (ev) {
      this.scene = this.parent.scene;
      this.renderer = this.parent.renderer;

      this.parent.bind('update', this.update.bind(this));

      this.camera = new THREE.PerspectiveCamera(45, this.parent.size.w / this.parent.size.h, 0.1, 20000);
      this.camera.position.z = 5;
      this.scene.add(this.camera);

      this.createElements();

      this._bindEvents();

      console.log('????');
    },

    resize : function resize(ev){
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    },

    update : function update (ev) {
      // console.log('<<<<<<', timing);

      this.animate(ev.data);

      this.renderer.render( this.scene, this.camera );
    },

    createElements : function createElements () {
      this.addFloor();
      this.addDirLight();
      // this.addDodecaethron();

      var verticesOfCube = [
          -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
          -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
      ];

      var indicesOfFaces = [
          2,1,0,    0,3,2,
          0,4,7,    7,3,0,
          0,1,5,    5,4,0,
          1,2,6,    6,5,1,
          2,3,7,    7,6,2,
          4,5,6,    6,7,4
      ];

      // var geometry =    new THREE.SphereGeometry(1,8,5);
      var geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 6, 2 );
      var MeshLambertMaterial = new THREE.MeshLambertMaterial({wireframe: true, wireframeLinewidth: 2, vertexColors: THREE.FaceColors, color: 0x00FF00, morphTargets: true});
      // var vertextMaterial = new THREE.MeshBasicMaterial( { depthWrite: false, transparent: true, opacity: 0.5,color: 0x5B47F3, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
      this.mesh = new THREE.Mesh( geometry, MeshLambertMaterial );
      wireframe = new THREE.EdgesHelper( this.mesh, 0x5BFFF3 );
      this.scene.add( wireframe );
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      this.scene.add( this.mesh );


      var geometry2 =    new THREE.IcosahedronGeometry(0.6);
      var vertextMaterial2 = new THREE.MeshBasicMaterial( { depthWrite: false, transparent: true, opacity: 0.8,color: 0xFFFF00, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
      this.mesh2 = new THREE.Mesh( geometry2, vertextMaterial2 );
      wireframe2 = new THREE.EdgesHelper( this.mesh2, 0xDDEE55 );
      this.scene.add( wireframe2 );
      this.mesh2.castShadow = true;
      this.mesh2.receiveShadow = true;
      this.scene.add( this.mesh2 );

      var geometry3 =    new THREE.TetrahedronGeometry(0.2);
      var vertextMaterial3 = new THREE.MeshBasicMaterial( { depthWrite: false, transparent: true, opacity: 0.8,color: 0x6AFF1C, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
      this.mesh3 = new THREE.Mesh( geometry3, vertextMaterial3 );
      wireframe3 = new THREE.EdgesHelper( this.mesh3, 0x2A680B );
      this.scene.add( wireframe3 );
      this.mesh3.castShadow = true;
      this.mesh3.receiveShadow = true;
      this.scene.add( this.mesh3 );



      this.scene.fog = new THREE.Fog( 0xFF0000, 0.5, 1000 );
      // this.scene.fog.color.setHSL( 0.6, 0, 1 );

      hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
      hemiLight.color.setHSL( 0.6, 1, 0.6 );
      hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      hemiLight.position.set( 0, 500, 0 );
      this.scene.add( hemiLight );

      this.renderer.setClearColor( this.scene.fog.color );
      this.renderer.shadowMapEnabled = true;
      this.renderer.shadowMapCullFace = THREE.CullFaceBack;
    },

    animate : function animate(timing){
      this.mesh.rotation.x += 0.005;
      this.mesh.rotation.y += 0.005;

      this.mesh2.rotation.x -= 0.005;
      this.mesh2.rotation.y += 0.005;

      this.mesh3.rotation.x -= 0.005;
      this.mesh3.rotation.z += 0.005;
    },

    addFloor : function addFloor(){
      var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
      var groundMat = new THREE.MeshPhongMaterial( { color: 0x262B2E, specular: 0x050505 } );
      // groundMat.color.setHSL( 0.095, 1, 0.75 );

      var ground = new THREE.Mesh( groundGeo, groundMat );
      ground.rotation.x = -Math.PI/2;
      ground.position.y = -33;

      ground.receiveShadow = true;

      this.scene.add( ground );
    },

    addDirLight : function addDirLight(){
      var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
      dirLight.color.setHSL( 0.1, 1, 0.95 );
      dirLight.position.set( -1, 1.75, 1 );
      dirLight.position.multiplyScalar( 50 );
      this.scene.add( dirLight );

      dirLight.castShadow = true;

      dirLight.shadowMapWidth = 2048;
      dirLight.shadowMapHeight = 2048;

      var d = 50;

      dirLight.shadowCameraLeft = -d;
      dirLight.shadowCameraRight = d;
      dirLight.shadowCameraTop = d;
      dirLight.shadowCameraBottom = -d;

      dirLight.shadowCameraFar = 3500;
      dirLight.shadowBias = -0.0001;
      dirLight.shadowDarkness = 0.35;
    },


    _bindEvents : function(){
      document.addEventListener('mousemove', this._handleMouseMove.bind(this));
    },

    _handleMouseMove : function _handleMouseMove (ev) {
      // console.log('>>>>', ev.clientX, ev.clientY);

      var raycaster = new THREE.Raycaster(),
          mouse = new THREE.Vector2();

      mouse.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( ev.clientY / window.innerHeight ) * 2 + 1;

      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera( mouse, this.camera );

      // calculate objects intersecting the picking ray
      var intersects = raycaster.intersectObjects( this.scene.children );

      // this.scene.children.forEach(function(obj){
      //   if(obj &&obj.material){
      //     obj.material.color.set( 0x000055 );
      //   }
      // });

      for ( var i = 0; i < intersects.length; i++ ) {

        // intersects[ i ].object.material.color.set( 0x00FF00 );
        // intersects[ i ].face.color.setStyle( '#00FF00' );
        // intersects[ i ].object.colorsNeedUpdate = true;
        // console.log('<<<<<', intersects[ i ]);
      }

    }

    // addDodecaethron : function addDodecaethron(){
    //   var geometry = new THREE.Geometry();

    //   // vertices
    //   geometry.vertices = [
    //       new THREE.Vector3( 2.04772293123743050, -4.09327412386437040, -5.74908146957292670),
    //       new THREE.Vector3(  7.02732984841516030, 1.40331541320251810, -1.62706516545639390),
    //       new THREE.Vector3( 4.22549114271519950, -1.62031854283173550,  5.78962800381778210),
    //       new THREE.Vector3( 0.75411577446253997,  7.11690807989861880, -1.66761169970125600),
    //       new THREE.Vector3(-0.75411577446252998, -7.11690807989862510,  1.66761169970125020),
    //       new THREE.Vector3(-4.22549114271518980,  1.62031854283173260, -5.78962800381778920),
    //       new THREE.Vector3( -2.0477229312374288,  4.09327412386436950,  5.74908146957292670),
    //       new THREE.Vector3(-7.02732984841515230, -1.40331541320252740,  1.62706516545639970),
    //       new THREE.Vector3( 6.27321407395262300, -5.71359266669610030,  0.04054653424485652),
    //       new THREE.Vector3( 2.80183870569996340,  3.02363395603425690, -7.41669316927418000),
    //       new THREE.Vector3( 4.97960691717773150,  5.49658953706689160,  4.12201630411653590),
    //       new THREE.Vector3(-2.80183870569996340, -3.02363395603425690,  7.41669316927418000),
    //       new THREE.Vector3(-4.97960691717773150, -5.49658953706689160, -4.12201630411653590),
    //       new THREE.Vector3(-6.27321407395262480,  5.71359266669610210, -0.04054653424485653)
    //   ];

    //   // faces - in counterclockwise winding order - important!
    //   geometry.faces.push(
    //       new THREE.Face3( 8, 0, 9 ),  new THREE.Face3( 9, 1, 8 ),
    //       new THREE.Face3( 8, 1, 10 ), new THREE.Face3( 10, 2, 8 ),
    //       new THREE.Face3( 8, 2, 11 ), new THREE.Face3( 11, 4, 8 ),
    //       new THREE.Face3( 8, 4, 12 ), new THREE.Face3( 12, 0, 8 ),
    //       new THREE.Face3( 12, 5, 9 ), new THREE.Face3( 9, 0, 12 ),
    //       new THREE.Face3( 13, 3, 9 ), new THREE.Face3( 9, 5, 13 ),
    //       new THREE.Face3( 10, 1, 9 ), new THREE.Face3( 9, 3, 10 ),
    //       new THREE.Face3( 10, 3, 13 ), new THREE.Face3( 13, 6, 10 ),
    //       new THREE.Face3( 11, 2, 10 ), new THREE.Face3( 10, 6, 11 ),
    //       new THREE.Face3( 11, 7, 12 ), new THREE.Face3( 12, 4, 11 ),
    //       new THREE.Face3( 12, 7, 13 ), new THREE.Face3( 13, 5, 12 ),
    //       new THREE.Face3( 13, 7, 11 ), new THREE.Face3( 11, 6, 13 )
    //   );

    //   // normals ( since they are not specified directly )
    //   geometry.computeFaceNormals();
    //   geometry.computeVertexNormals();
    //   var material = new THREE.MeshPhongMaterial( { color: 0x7FFF7A, specular: 0xFF6D67, shininess: 20, vertexColors: THREE.FaceColors, shading: THREE.SmoothShading } );
    //   this.dode = mesh = new THREE.Mesh( geometry, material );
    //   this.dode.castShadow = true;
    //   this.dode.receiveShadow = true;
    //   this.scene.add(this.dode);

    // }
  }
});