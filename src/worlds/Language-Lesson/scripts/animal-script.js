AFRAME.registerComponent('animal', {
    init: function () {
        const CONTEXT_AF = this;

        if(CONTEXT_AF.el.id == 'crow'){
            console.log('This is a crow.');
            CONTEXT_AF.el.addEventListener('animation-finished', function(){
                CONTEXT_AF.el.emit('wingsClose');
            });
        }
        
        CONTEXT_AF.el.addEventListener('speak', function(evt){

            switch(evt.detail.value){

                case 'moose':
                    console.log('Speak Moose!');
                    
                    CONTEXT_AF.el.removeAttribute('animation-mixer');
                    CONTEXT_AF.el.setAttribute('animation-mixer', {clip: 'Armature|Take*', loop: 'once'});

                    break;

                case 'crow':
                    console.log('Speak Crow!');

                    CONTEXT_AF.el.removeAttribute('animation-mixer');
                    CONTEXT_AF.el.setAttribute('animation-mixer', {clip: 'FlyToIdle*', startAt: '4500', loop: 'once', clampWhenFinished: 'true'});
                    CONTEXT_AF.el.emit('wingsClose');

                    break;

                case 'wolf':
                    console.log('Speak Wolf!');

                    CONTEXT_AF.el.removeAttribute('animation-mixer');
                    CONTEXT_AF.el.setAttribute('animation-mixer', {clip: 'Animation*', startAt: '6000', loop: 'once'});

                    break;

                default:
                    console.log('*Unknown Animal*');
            }
        });
    }
})