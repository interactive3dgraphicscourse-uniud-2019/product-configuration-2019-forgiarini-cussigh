
let iconSelectHandler = function (controller, e) {
    let textureID = this.getAttribute("data-icon-id");
    if (controller.currentTextureSelected == textureID) {
        return;
    }
    controller.clearTextureColorSelection();
    controller.selectTexture(textureID, true);
}

let textureTypeSelectHandler = function (controller, e) {
    let selectedType = this.value;
    if (controller.currentTextureTypeSelected == selectedType) {
        return;
    }
    controller.hideTexturesAvaiable();
    controller.showTextureTypes(selectedType, true);
}

let sliderHandler = function (controller, e) {
    controller.updateControllerRoughness(e.target.value);
}

class EditorPartController {
    constructor(domEl, objControl) {
        let el = domEl;
        this.objController = objControl;
        this.container = el;
        this.name = this.objController.name;

        this.selectTextureContainer = this.container.querySelectorAll(".avaiable-materials")[0];
        this.selectTextureMenu = this.container.querySelectorAll(".select-texture-material")[0];
        this.textures = this.container.querySelectorAll(".texture-icon-wrapper");
        this.texturesTypes = this.container.querySelectorAll(".available-textures");
        this.rangeInput = this.container.querySelectorAll(".slidercontainer input");

        let that = this;

        this.textures.forEach(tex => {
            tex.addEventListener('click', iconSelectHandler.bind(tex, that), false);
        });

        this.selectTextureMenu.addEventListener("change", textureTypeSelectHandler.bind(this.selectTextureMenu, that), false);
        this.rangeInput.forEach(range => {
            range.addEventListener("input", sliderHandler.bind(range, that), false);
        });

        if (this.objController.textureParameters.material == null) {
            this.showTextureTypes("wood", true);
        } else {
            let index = -1;
            for (let i = 0, n = this.selectTextureMenu.children.length; i < n; i++) {
                if (this.selectTextureMenu.children[i].value == this.objController.textureParameters.material) {
                    index = i;
                    break;
                }
            }
            this.selectTextureMenu.selectedIndex = index;
            this.showTextureTypes(this.objController.textureParameters.material, false);
            this.clearTextureColorSelection();
            this.selectTexture(this.objController.textureParameters.color, false);

            this.setSliderValue(
                this.objController.textureParameters.material, this.objController.textureParameters.normalScale);
        }
    }

    selectTexture(textureID, updateActiveColor) {
        this.textures.forEach(textureWrapper => {
            if (textureWrapper.getAttribute("data-icon-id") == textureID) {
                textureWrapper.classList += " selected";
            }
        });
        this.currentTextureSelected = textureID;
        if (updateActiveColor) {
            this.objController.updateTextureColor(textureID);
        }
    }

    clearTextureColorSelection() {
        this.textures.forEach(textureWrapper => {
            textureWrapper.classList.remove("selected");
        });
    }

    showTextureTypes(typeName, updateController) {
        let that = this;
        this.clearTextureColorSelection();
        this.resetSliders();
        let colorID = "";
        this.texturesTypes.forEach(textureTypeWrapper => {
            if (textureTypeWrapper.getAttribute("data-texture-type") == typeName) {
                let slider = textureTypeWrapper.querySelectorAll(".slidercontainer input")[0];
                let newSlideVal = parseFloat(slider.min);
                slider.value = newSlideVal;
                if (updateController) {
                    that.updateControllerRoughness(newSlideVal);
                }
                colorID = textureTypeWrapper.querySelectorAll(".texture-icon-wrapper")[0].getAttribute("data-icon-id");
                that.selectTexture(colorID, false);
                textureTypeWrapper.classList.remove("hide");
                return;
            }
        });
        this.currentTextureTypeSelected = typeName;
        if (updateController) {
            this.objController.updateTexture(typeName, colorID);
        }
    }

    hideTexturesAvaiable() {
        this.texturesTypes.forEach(textureTypeWrapper => {
            if (!textureTypeWrapper.classList.contains("hide")) {
                textureTypeWrapper.classList += " hide";
            }
        });
    }

    updateControllerRoughness(newVal) {
        this.objController.updateTextureRoughness(newVal);
    }

    resetSliders() {
        this.rangeInput.forEach(range => {
            range.value = 0.0;
        });
    }

    setSliderValue(material, value) {
        this.rangeInput.forEach(range => {
            let el = range;
            while (!Util.is(el, ".available-textures")) {
                el = el.parentNode;
            }
            if (el.getAttribute('data-texture-type') === material) {
                if (value < range.min) {
                    value = range.min;
                } else if (value > range.max) {
                    value = range.max;
                }
                range.value = value;
            }
        });
    }
}
