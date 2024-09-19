AFRAME.registerComponent('promoter', {
    init: function () {
      // Setup self references
      const CONTEXT_AF = this;
      
      // setup global variables
      CONTEXT_AF.currentPreset = "LL";
      CONTEXT_AF.capSite = false;
      CONTEXT_AF.repressor = false;

    },

  });