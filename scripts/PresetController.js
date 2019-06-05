let clickPresetHandler = function (controller, e) {
    let dataEL = this.querySelectorAll(".preset-data")[0];
    let data = JSON.parse(dataEL.getAttribute("data-preset"));
    controller.updateLiveModel(data);
}

class PresetController {
    constructor(domEl, guiControllers) {
        let el = domEl;
        this.container = el;
        this.presets = this.container.childNodes;
        this.controllers = guiControllers;
        let that = this;

        this.presets.forEach(pr => {
            pr.addEventListener("click", clickPresetHandler.bind(pr, that), false);
        });
    }

    updateLiveModel(data) {
        Object.keys(data).forEach(partID => {
            this.controllers.forEach(ctrl => {
                if (ctrl.istance.name == partID) {
                    ctrl.istance.updateMenu(data[partID]);
                }
            });
        });
    }
}
