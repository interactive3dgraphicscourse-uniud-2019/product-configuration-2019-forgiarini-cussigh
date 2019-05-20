
let iconSelectHandler = function (controller, e) {
    let textureID = this.getAttribute("data-icon-id");
    if (controller.currentTextureSelected == textureID) {
        return;
    }
    controller.clearTextureSelection();
    controller.selectTexture(textureID, true);
}

let textureTypeSelectHandler = function (controller, e) {
    let selectedType = this.value;
    if (controller.currentTextureTypeSelected == selectedType) {
        return;
    }
    controller.hideTexturesAvaiable();
    controller.showTextureTypes(selectedType);
}

let sliderHandler = function (controller, e) {
    controller.updateSlider();
}

class EditorPartController {
    constructor(domEl, name, data) {
        let el = domEl;
        let partName = name;
        this.container = el;
        this.name = partName;

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
        this.showTextureTypes("wood");
    }

    selectTexture(textureID, updateActiveColor) {
        this.textures.forEach(textureWrapper => {
            if (textureWrapper.getAttribute("data-icon-id") == textureID) {
                textureWrapper.classList += " selected";
            }
        });
        this.currentTextureSelected = textureID;
        if (updateActiveColor) {
            updateTextureColor(textureID, this.name);
        }
    }

    clearTextureSelection() {
        this.textures.forEach(textureWrapper => {
            textureWrapper.classList.remove("selected");
        });
    }

    showTextureTypes(typeName) {
        let that = this;
        this.clearTextureSelection();
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
        updateTexture(typeName, colorID, this.name);
    }

    hideTexturesAvaiable() {
        this.texturesTypes.forEach(textureTypeWrapper => {
            if (!textureTypeWrapper.classList.contains("hide")) {
                textureTypeWrapper.classList += " hide";
            }
        });
    }
    updateSlider() {
        updateTextureRoughness(this.name, this.rangeInput.value);
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
            let tmpl_obj = {
                id: id,
                url: iconUrl
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
