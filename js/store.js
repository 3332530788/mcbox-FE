window.mcAction = {};
mcAction.liCur = function(dom, index) {
    dom.removeClass('cur');
    dom.eq(index).addClass('cur');
}
mcAction.showOnly = function(dom, index) {
    dom.eq(index).toggleClass('hidden');
    dom.not(dom.eq(index)).addClass('hidden');
}
mcAction.hiddenAll = function(dom) {
    dom.addClass('hidden');
}
mcAction.checkServerStatus = function(id, ip) {
    serverChecker.checkServerStatus(id, ip);
}
mcAction.downloadSrc = function(id, type, json, isMy) {
    if (isMy) {
        resManager.installRes(id, type);
    } else {
        resManager.installRes(id, type, json);
    }
}
mcAction.delSrc = function(delObj) {
    resManager.deleteResObj(delObj);
}
mcAction.stopDownloadSrc = function(id, type) {
    resManager.stopInstall(id, type);
}
mcAction.litenSrc = function(funAdd, funDel, funInt) {
    resManager.resAdded.connect(funAdd);
    resManager.resDeleted.connect(funDel);
    resManager.resLocalLoadFinished.connect(funInt);
    resManager.loadLocalRes();
}
mcAction.litenInstance = function(funChangeTxt, funChangeState, funFinshed) {
    instManager.instanceLoadingStateChanged.connect(funChangeTxt);
    instManager.instanceLoadingStateFinished.connect(funFinshed);
    serverChecker.serverStateUpdated.connect(funChangeState);
}
