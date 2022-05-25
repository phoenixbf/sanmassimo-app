
const sid = "lamia/20211021-7kn89gdpx";
//const sid = "samples/montebelluna";

let APP = ATON.App.realize();
window.APP = APP;

APP._povs = [];


APP.setup = ()=>{
    ATON.FE.realize(); // Realize the base front-end

	ATON.FE.addBasicLoaderEvents(); // Add basic events handling

    ATON.FE.loadSceneID(sid);

    // UI
    ATON.FE.uiAddButtonFullScreen("idTopToolbar");
    ATON.FE.uiAddButtonVR("idTopToolbar");
    //ATON.FE.uiAddButtonDeviceOrientation("idTopToolbar");

    ATON.FE.uiAddButtonInfo("idBottomRToolbar");
    ATON.FE.uiAddButton("idBottomToolbar", "prev", APP.povPrev, "Previous Viewpoint" );
    ATON.FE.uiAddButtonHome("idBottomToolbar");
    ATON.FE.uiAddButton("idBottomToolbar", "next", APP.povNext, "Next Viewpoint" );

    ATON.on("SceneJSONLoaded",()=>{
        if (ATON.SceneHub.getDescription()) ATON.FE.popupSceneInfo();

        APP.updatePOVs();
    });

	ATON.on("Tap", ()=>{
		if (ATON._hoveredSemNode) APP.popupSemDescription(ATON._hoveredSemNode);
	});
};

APP.update = ()=>{
    //console.log("tick")
};

APP.getHTMLDescriptionFromSemNode = (semid)=>{
    let S = ATON.getSemanticNode(semid);
    if (S === undefined) return undefined;
    
    let descr = S.getDescription();
    if (descr === undefined) return undefined;

    descr = JSON.parse(descr);
    return descr;
};

APP.popupSemDescription = (semid)=>{
    if (semid === undefined) return;

    ATON.FE.playAudioFromSemanticNode(semid);

    let descr = APP.getHTMLDescriptionFromSemNode(semid);
    if (descr === undefined) return;

    let htmlcontent = "<div class='atonPopupTitle'>";
    htmlcontent += semid+"</div>";

    htmlcontent += "<div class='atonPopupDescriptionContainer'>"+descr+"</div>";

    if ( !ATON.FE.popupShow(htmlcontent, "atonPopupCompact") ) return;
}

APP.povNext = ()=>{
    let numpovs = APP._povs.length;
    if (numpovs < 1) return;

    APP._cPOVind = (APP._cPOVind + 1) % numpovs;

    let pov = APP._povs[APP._cPOVind];

    let dur = (ATON.XR._bPresenting)? ATON.XR.STD_TELEP_DURATION : 1.0;
    ATON.Nav.requestPOV(pov, dur);
};

APP.povPrev = ()=>{
    let numpovs = APP._povs.length;
    if (numpovs < 1) return;

    APP._cPOVind = (APP._cPOVind - 1);
    if (APP._cPOVind<0) APP._cPOVind = (numpovs-1);

    let pov = APP._povs[APP._cPOVind];

    let dur = (ATON.XR._bPresenting)? ATON.XR.STD_TELEP_DURATION : 1.0;
    ATON.Nav.requestPOV(pov, dur);
};

APP.updatePOVs = ()=>{

    APP._povs = [];

    for (let k in ATON.Nav.povlist){
        let pov = ATON.Nav.povlist[k];

        APP._povs.push(pov);
        console.log(pov);
    }

    if (APP._povs.length>0) APP._cPOVind = 0;
};

// Run the App
window.onload = ()=>{
	APP.run();
};