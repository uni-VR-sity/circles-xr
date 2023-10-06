//some code from older Mozilla Hubs implementation: https://github.com/mozilla/hubs

//import pdfjs from "pdfjs-dist";
//import errorImageSrc from "../assets/images/media-error.png";

//const = window['pdfjs-dist/build/pdf.js'];
//pdfjs.GlobalWorkerOptions.workerSrc = '!!file-loader?outputPath=assets/js&name=[name]-[hash].js!pdfjs-dist/build/pdf.worker.js';

// const pdfjs = import('pdfjs-dist/build/pdf');
// const pdfjsWorker = import('pdfjs-dist/build/pdf.worker.entry');

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/*
  PDFjs which is used to render pdfs depends on the window.requestAnimationFrame function.
  This is not called when in mobileVR.
  This system replaces the function with the requestAnimationFrame of the xrSession.
  It also adds a listener to ensure it is reset and call not called callbacks after the user leaves xr.
*/

//fix [modified] from here for vr systems: https://github.com/mozilla/hubs/pull/5427
//Related to: https://github.com/mozilla/hubs/issues/4951#issuecomment-1125019842
class MediaPDFOculusFix {
    constructor() {
        this.requestAnimationFramePrev = this.requestAnimationFramePrev || window.requestAnimationFrame;
        this.cbList = new Set();
        this.wasVR = false;
        this.sceneEl = document.querySelector('a-scene');

        const CONTEXT_AF = this;
        CONTEXT_AF.inImmersiveVR = false;

        this.sceneEl.addEventListener('enter-vr', function () {
            CONTEXT_AF.inImmersiveVR = true;
        });

        this.sceneEl.addEventListener('exit-vr', function () {
            CONTEXT_AF.inImmersiveVR = false;
        });
    }

    tick() {
        const isMobileVR = AFRAME.utils.device.isMobileVR();
        let isVR = this.inImmersiveVR && isMobileVR;

        if (isVR !== this.wasVR) {
            if (isVR) {
                this.onEnterVR(this.sceneEl);
            } else if (this.wasVR) {
                this.onExitVR();
            }
        }
        this.wasVR = isVR;
    }

    onEnterVR() {
        const { xrSession } = this.sceneEl;
        window.requestAnimationFrame = cb => {
            let myCb = () => {
                this.cbList.delete(myCb);
                cb();
            };
            this.cbList.add(myCb);
            return xrSession.requestAnimationFrame.call(xrSession, myCb);
        };

        console.log(window.requestAnimationFrame);

        //Make sure tick is called
        if (!this.interval)
            this.interval = setInterval(() => {
                this.tick();
            }, 500);
    }

    async onExitVR() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
        window.requestAnimationFrame = cb => this.requestAnimationFramePrev.call(window, cb);
        this.cbList.forEach(cb => {
            window.requestAnimationFrame(cb);
        });
    }
}

AFRAME.registerComponent("circles-pdf-loader", {
    schema: {
        src: { type: "string" },
        scale: { type: 'number', default: 1.5 },
        minimumDimension: { type:'number', default: 1 },
        width: { type:'number', default: -1 },
        height: { type:'number', default: -1 },
        controlHeight: { type:'number', default: 0 },
        controlColor: { type: 'color', default: '#FFFFFF'},
        doubleSided: { type: 'boolean', default: false },
        projection: { type: "string", default: "flat" },
        contentType: { type: "string" },
        index: { default: 0 },
        batch: { default: false },
    },
    multiple: false,
    init: function() {
        const CONTEXT_AF = this;

        CONTEXT_AF.mediaPDFOculusFix = new MediaPDFOculusFix();

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        CONTEXT_AF.pdfjs = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified
        CONTEXT_AF.pdfjs.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        CONTEXT_AF.canvas = document.createElement("canvas");
        CONTEXT_AF.canvasContext = CONTEXT_AF.canvas.getContext("2d");

        CONTEXT_AF.texture = new THREE.CanvasTexture(CONTEXT_AF.canvas);
        CONTEXT_AF.texture.encoding = THREE.sRGBEncoding;
        CONTEXT_AF.texture.minFilter = THREE.LinearFilter;

        CONTEXT_AF.pageRendering = false; // Check conflict
    },
    createControls: function() {
        const CONTEXT_AF = this;

        var maxDimension;

        if (CONTEXT_AF.height > CONTEXT_AF.width)
        {
            maxDimension = CONTEXT_AF.height;
        }
        else
        {
            maxDimension = CONTEXT_AF.width;
        }

        const CONTROL_BUTTON_SIZE = maxDimension / 6;
        
        CONTEXT_AF.controls = true;

        // If using width override, storing height of element in schema
        if (CONTEXT_AF.data.height <= 0 && CONTEXT_AF.data.width > 0)
        {
            if (CONTEXT_AF.pdf.numPages > 1)
            {
                CONTEXT_AF.data.controlHeight = CONTROL_BUTTON_SIZE + ((0.15 * CONTEXT_AF.height) - (CONTROL_BUTTON_SIZE / 2));
                CONTEXT_AF.data.height = CONTEXT_AF.height;
            }
            else
            {
                CONTEXT_AF.data.height = CONTEXT_AF.height;
            }
        }

        // If there is more then 1 page, make controls
        if (CONTEXT_AF.pdf.numPages > 1)
        {
            CONTEXT_AF.controlsWrapper = document.createElement('a-entity');
            CONTEXT_AF.controlsWrapper.setAttribute('id', 'pdf_controls_wrapper');
            CONTEXT_AF.controlsWrapper.setAttribute('position', {x:0, y:(CONTEXT_AF.height/-2) - (0.15 * CONTEXT_AF.height), z:0});
            CONTEXT_AF.el.appendChild(CONTEXT_AF.controlsWrapper);

            CONTEXT_AF.nextBtn = document.createElement('a-entity');
            CONTEXT_AF.nextBtn.setAttribute('id', 'pdfNextBtn');
            CONTEXT_AF.nextBtn.setAttribute('class', 'button pdfControllerButton');
            CONTEXT_AF.nextBtn.setAttribute('position', {x:CONTEXT_AF.width/6, y:0, z:0});
            CONTEXT_AF.nextBtn.setAttribute('rotation', {x:0, y:0, z:90});
            CONTEXT_AF.nextBtn.setAttribute('geometry', {primitive:'plane', width:CONTROL_BUTTON_SIZE, height:CONTROL_BUTTON_SIZE});
            CONTEXT_AF.nextBtn.setAttribute('material', {src:CIRCLES.CONSTANTS.ICON_RELEASE,color:CONTEXT_AF.data.controlColor,shader:'flat', transparent:true});
            CONTEXT_AF.nextBtn.setAttribute('circles-interactive-object', {type:'scale'});
            CONTEXT_AF.controlsWrapper.appendChild(CONTEXT_AF.nextBtn);
            CONTEXT_AF.nextBtn.addEventListener('click', function (evt)
            {
                if (CONTEXT_AF.pageNum >= CONTEXT_AF.pdf.numPages) 
                {
                    return;
                }
                CONTEXT_AF.changePage(CONTEXT_AF.pageNum + 1);
                if (CONTEXT_AF.pageNum === CONTEXT_AF.pdf.numPages)
                {
                    CONTEXT_AF.nextBtn.setAttribute('circles-interactive-object', {enabled:false});
                    CONTEXT_AF.prevBtn.setAttribute('circles-interactive-object', {enabled:true});

                    CONTEXT_AF.nextBtn.setAttribute('material', {opacity:0.35});
                    CONTEXT_AF.prevBtn.setAttribute('material', {opacity:1});
                }
                else
                {
                    CONTEXT_AF.nextBtn.setAttribute('circles-interactive-object', {enabled:true});
                    CONTEXT_AF.prevBtn.setAttribute('circles-interactive-object', {enabled:true});

                    CONTEXT_AF.nextBtn.setAttribute('material', {opacity:1});
                    CONTEXT_AF.prevBtn.setAttribute('material', {opacity:1});
                }
            });

            CONTEXT_AF.prevBtn = document.createElement('a-entity');
            CONTEXT_AF.prevBtn.setAttribute('id', 'pdfPrevBtn');
            CONTEXT_AF.prevBtn.setAttribute('class', 'button pdfControllerButton');
            CONTEXT_AF.prevBtn.setAttribute('position', {x:CONTEXT_AF.width/-6, y:0, z:0});
            CONTEXT_AF.prevBtn.setAttribute('rotation', {x:0, y:0, z:-90});
            CONTEXT_AF.prevBtn.setAttribute('geometry', {primitive:'plane', width:CONTROL_BUTTON_SIZE, height:CONTROL_BUTTON_SIZE});
            CONTEXT_AF.prevBtn.setAttribute('material', {src:CIRCLES.CONSTANTS.ICON_RELEASE,color:CONTEXT_AF.data.controlColor,shader:'flat', transparent:true,side:'double',opacity:0.35});
            CONTEXT_AF.prevBtn.setAttribute('circles-interactive-object', {type:'scale', enabled:false});
            CONTEXT_AF.controlsWrapper.appendChild(CONTEXT_AF.prevBtn);
            CONTEXT_AF.prevBtn.addEventListener('click', function (evt)
            {
                if (CONTEXT_AF.pageNum <= 1) 
                {
                    return;
                }
                CONTEXT_AF.changePage(CONTEXT_AF.pageNum - 1);
                if (CONTEXT_AF.pageNum === 1)
                {
                    CONTEXT_AF.nextBtn.setAttribute('circles-interactive-object', {enabled:true});
                    CONTEXT_AF.prevBtn.setAttribute('circles-interactive-object', {enabled:false});

                    CONTEXT_AF.nextBtn.setAttribute('material', {opacity:1});
                    CONTEXT_AF.prevBtn.setAttribute('material', {opacity:0.35});
                }
                else
                {
                    CONTEXT_AF.nextBtn.setAttribute('circles-interactive-object', {enabled:true});
                    CONTEXT_AF.prevBtn.setAttribute('circles-interactive-object', {enabled:true});

                    CONTEXT_AF.nextBtn.setAttribute('material', {opacity:1});
                    CONTEXT_AF.prevBtn.setAttribute('material', {opacity:1});
                }
            });
        }
    },
    tick : function(time, timeDelta) {
        this.mediaPDFOculusFix.tick(this.el);
    },
    async update(oldData) {
        const CONTEXT_AF = this;
        const CONTROL_BUTTON_SIZE = 0.25;
        const data = this.data;
        let ratio = 1;

        if ( (oldData.src !== data.src) && (data.src !== '') ) {
        {
            // Using DocumentInitParameters object to load binary data.
            const loadingTask = CONTEXT_AF.pdfjs.getDocument(data.src);
            loadingTask.promise.then(function(pdf) {
                /* following simpler example from here: https://jsfiddle.net/pdfjs/cq0asLqz/ */
                CONTEXT_AF.pdf = pdf;
                CONTEXT_AF.el.setAttribute("media-pager", { maxIndex: CONTEXT_AF.pdf.numPages - 1 });
                let pageNumber = 1; //starting page
                CONTEXT_AF.changePage(pageNumber);
                
            }, function (reason) {
                // PDF loading error
                console.error("Error loading PDF", reason);
            });
        }
    }},
    async changePage(pageNum) {
        const CONTEXT_AF = this;

        if (!CONTEXT_AF.pdf) {
            console.warn('No PDF loaded yet.');
            return;
        }

        if (pageNum < 1 || pageNum > CONTEXT_AF.pdf.numPages) {
            console.warn('The page ' + pageNum + ' selected is out of range of PDF pages [1, ' + CONTEXT_AF.pdf.numPages + '] available.');
            return;
        }

        if (CONTEXT_AF.pageRendering) { // Check if other page is rendering
            //probably should have loading image here
        } 
        else {
            //let's save which page we are at so we can save it for later
            CONTEXT_AF.pageNum = pageNum;

            CONTEXT_AF.pdf.getPage(pageNum).then(function(page) {
                let viewport = page.getViewport({scale: CONTEXT_AF.data.scale});
            
                // Prepare canvas using PDF page dimensions
                CONTEXT_AF.canvas.height = viewport.height;
                CONTEXT_AF.canvas.width = viewport.width;
                ratio = CONTEXT_AF.canvas.width / CONTEXT_AF.canvas.height;

                if (CONTEXT_AF.data.width <= 0)
                {
                    // Potrait
                    if (ratio > 1)
                    {
                        CONTEXT_AF.height = CONTEXT_AF.data.minimumDimension;
                        CONTEXT_AF.width = width = ratio * CONTEXT_AF.height;
                    }
                    // Landscape
                    else
                    {
                        CONTEXT_AF.width = CONTEXT_AF.data.minimumDimension;
                        CONTEXT_AF.height = CONTEXT_AF.width / ratio;
                    }
                }
                else
                {
                    CONTEXT_AF.width = CONTEXT_AF.data.width;
                    CONTEXT_AF.height = CONTEXT_AF.width / ratio;
                }
            
                // Render PDF page into canvas context
                let renderContext = {
                    canvasContext: CONTEXT_AF.canvasContext,
                    viewport: viewport
                };

                CONTEXT_AF.renderTask = page.render(renderContext);

                //wait for rendering to finish
                CONTEXT_AF.renderTask.promise.then(function () {
                    CONTEXT_AF.pageRendering = true;
                    CONTEXT_AF.renderTask = null;

                    // Disposing of old geometry and material
                    if (CONTEXT_AF.mesh)
                    {
                        CONTEXT_AF.el.getObject3D('mesh').geometry.dispose();

                        if (CONTEXT_AF.el.getObject3D('mesh').material.map)
                        {
                            CONTEXT_AF.el.getObject3D('mesh').material.map.dispose();
                        }

                        CONTEXT_AF.el.getObject3D('mesh').material.dispose();
                    }

                    const material = new THREE.MeshBasicMaterial();
                    const geometry = new THREE.PlaneGeometry(CONTEXT_AF.width, CONTEXT_AF.height, 1, 1, CONTEXT_AF.texture.flipY);

                    if (CONTEXT_AF.data.doubleSided)
                    {
                        material.side = THREE.DoubleSide;
                    }

                    CONTEXT_AF.mesh = new THREE.Mesh(geometry, material);
                    CONTEXT_AF.el.setObject3D("mesh", CONTEXT_AF.mesh);

                    CONTEXT_AF.mesh.material.transparent        = false;
                    CONTEXT_AF.mesh.material.map                = CONTEXT_AF.texture;
                    CONTEXT_AF.mesh.material.map.needsUpdate    = true;
                    CONTEXT_AF.mesh.material.needsUpdate        = true;

                    // Adding controls if there are none
                    if (!CONTEXT_AF.controls)
                    {
                        CONTEXT_AF.createControls();
                    }

                    // if (this.canvasContext) {
                    //     this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    // }
                }).finally(function() {
                    //reset page rendering bit
                    CONTEXT_AF.pageRendering = false;
                });
            });
        }
    },
    remove: function()
    {
        const CONTEXT_AF = this;
        const element = CONTEXT_AF.el;

        // Removing controllers
        var controllers = element.querySelector('#pdf_controls_wrapper');
        
        if (controllers)
        {
            controllers.remove();
        }
    }
});