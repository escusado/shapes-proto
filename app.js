Class('ThreeApp').inherits(Widget)({

  ELEMENT_CLASS: 'three-stage-container',

  prototype : {
    init : function(config){
      Widget.prototype.init.call(this, config);

      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({antialias:true});
      this.element = this.renderer.domElement;

      this.size = {
        w : window.innerWidth,
        h : window.innerHeight
      };

      window.addEventListener('resize', this.resize.bind(this));
    },

    setup : function setup(){
      this.renderer.setSize(this.size.w, this.size.h);
      this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    },

    resize : function resize(){
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.children.forEach(function(child){
        child.resize();
      });
    },

    animate : function animate(){
      var now = new Date().getTime(),
          updateData = {
              now: now,
              dt: now - (this.time || now)
          };

      this.time = now;

      this.dispatch('update', {
        data: updateData
      });

      requestAnimationFrame(this.animate.bind(this));
    },


  }
});