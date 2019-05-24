
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
    controller.updateSlider();
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
        this.rangeInput = this.container.querySelectorAll(".slidercontainer input")[0];

        let that = this;

        this.textures.forEach(tex => {
            tex.addEventListener('click', iconSelectHandler.bind(tex, that), false);
        });

        this.selectTextureMenu.addEventListener("change", textureTypeSelectHandler.bind(this.selectTextureMenu, that), false);
        this.rangeInput.addEventListener("input", sliderHandler.bind(this.rangeInput, that), false);
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
        let colorID = "";
        this.texturesTypes.forEach(textureTypeWrapper => {
            if (textureTypeWrapper.getAttribute("data-texture-type") == typeName) {
                textureTypeWrapper.classList.remove("hide");
                colorID = textureTypeWrapper.querySelectorAll(".texture-icon-wrapper")[0].getAttribute("data-icon-id");
                that.selectTexture(colorID, false);
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

    updateSlider() {
        this.objController.updateTextureRoughness(this.rangeInput.value);
    }
}

function buildMenuOptions(container, data) {
    tmpl.arg = "part";
    let tmpl_obj = {
        name_id: data.partID,
        name: data.partName,
        minValSlider: data.roughness.min,
        maxValSlider: data.roughness.max,
        startValSlider: data.roughness.start,
        stepSlider: data.roughness.step
    };

    let parser = new DOMParser();
    let objectPartEL = parser.parseFromString(tmpl("tmpl-insert-part-wrapper", tmpl_obj), "text/xml");
    let objectPartEditor = objectPartEL.firstChild;
    let selectTextureType = objectPartEditor.querySelectorAll(".select-texture-material")[0];
    let textureTypes = objectPartEditor.querySelectorAll(".available-colors")[0];

    data.textures.forEach(item => {
        tmpl.arg = "texture";
        let tmpl_obj = {
            type_name: item.typeID,
            type: item.typeSelect
        }
        let optionEL = parser.parseFromString(tmpl("tmpl-option-texture-type", tmpl_obj), "text/xml");
        let option = optionEL.firstChild;
        selectTextureType.appendChild(option);

        let typeWrapperEL = parser.parseFromString(tmpl("tmpl-insert-texture-type-wrapper", tmpl_obj), "text/xml");
        let typeWrapper = typeWrapperEL.firstChild;

        tmpl.arg = "texture_info";
        item.colors.forEach(texture => {
            let id = texture.id;
            let iconUrl = texture.iconURL;
            let alt = texture.alt;
            let tmpl_obj = {
                id: id,
                url: iconUrl,
                alt: alt
            };

            let textureWrapperEL = parser.parseFromString(tmpl("tmpl-insert-texture-icon-wrapper", tmpl_obj), "text/xml");
            let textureWrapper = textureWrapperEL.firstChild;
            typeWrapper.appendChild(textureWrapper);
        });
        textureTypes.appendChild(typeWrapper);
    });
    let insertingHTML = parser.parseFromString(xmlToString(objectPartEditor), "text/html");
    let partContainer = insertingHTML.documentElement.children[1].firstChild;
    container.appendChild(partContainer);
    return partContainer;
}

let closeEditorHandler = function (controller, e) {
    controller.updateVisibility();
}

class EditorController {

    constructor(domEL) {
        let element = domEL;
        this.domEL = element;
        this.closeButton = this.domEL.querySelectorAll(".close-button")[0];
        this.menuVisible = true;
        let that = this;
        this.closeButton.addEventListener("click", closeEditorHandler.bind(this.closeButton, that), false);
        this.partsContainer = this.domEL.querySelectorAll(".parts-container")[0];
    }

    updateVisibility() {
        if (this.menuVisible) {
            this.hideEditor();
            this.menuVisible = false;
        } else {
            this.showEditor();
            this.menuVisible = true;
        }
    }

    showEditor() {
        this.partsContainer.classList.remove("hide");
    }

    hideEditor() {
        if (!this.partsContainer.classList.contains("hide")) {
            this.partsContainer.classList += " hide";
        }
    }
}