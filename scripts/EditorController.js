
function buildMenuOptions(container, data) {
    let controller = data.controller;
    tmpl.arg = "part";
    let tmpl_obj = {
        name_id: data.partID,
        name: data.partName,
    };

    let partEditor = Util.createNodeHTML("tmpl-insert-part-wrapper", "part", tmpl_obj);
    let selectTextureType = partEditor.querySelectorAll(".select-texture-material")[0];
    let textureTypes = partEditor.querySelectorAll(".available-colors")[0];

    let guard;

    data.textures.forEach(item => {
        guard = false;
        // check if part can have this texture material
        for (let i = 0, n = controller.materials.length; i < n; i++) {
            if (item.typeID === controller.materials[i]) {
                guard = true;
            }
        }

        if (guard) {
            let tmpl_obj = {
                type_name: item.typeID,
                type: item.typeSelect,
                minValSlider: item.roughness.min,
                maxValSlider: item.roughness.max,
                startValSlider: item.roughness.start,
                stepSlider: item.roughness.step
            }

            let optionEL = Util.createNodeHTML("tmpl-option-texture-type", "texture", tmpl_obj);
            selectTextureType.appendChild(optionEL);

            let typeWrapper = Util.createNodeHTML("tmpl-insert-texture-type-wrapper", "texture", tmpl_obj);

            let textureIconsWrapper = typeWrapper.querySelectorAll(".available-textures-wrapper")[0];

            item.colors.forEach(texture => {
                let id = texture.id;
                let iconUrl = texture.iconURL;
                let alt = texture.alt;
                let color = texture.iconColor;
                let tmpl_obj = {
                    id: id,
                    background_color: color,
                    alt: alt
                };

                let textureEl = Util.createNodeHTML("tmpl-insert-texture-icon-wrapper", "texture_info", tmpl_obj);
                if (iconUrl !== "") {
                    let tmpl_obj = {
                        url: iconUrl,
                        alt: alt
                    };
                    let iconEl = Util.createNodeHTML("tmpl-insert-texture-icon-img", "texture_info", tmpl_obj);
                    let iconWrapper = textureEl.querySelectorAll(".texture-icon-container")[0];
                    iconWrapper.appendChild(iconEl);
                }
                textureIconsWrapper.appendChild(textureEl);
            });
            textureTypes.appendChild(typeWrapper);
        }
    });
    container.appendChild(partEditor);
    return partEditor;
}

function buildPresetObj(container, data){

    let dataToEncode = {
        table: data.table,
        legs: data.legs
    }

    let tmpl_obj = {
        data: JSON.stringify(dataToEncode),
        preview_url: data.preview,
        alt: data.alt,
    };
    let preset = Util.createNodeHTML("tmpl-preset", "preset", tmpl_obj);
    container.appendChild(preset);
}

let closeEditorHandler = function (controller, e) {
    controller.updateVisibility();
}

class EditorController {

    constructor(domEL, partsToHideSelector) {
        let element = domEL;
        this.domEL = element;
        this.closeButton = this.domEL.querySelectorAll(".close-button")[0];
        this.topMenuContainer = this.domEL.querySelectorAll(".top-menu")[0];
        this.menuVisible = true;
        let that = this;
        this.topMenuContainer.addEventListener("click", closeEditorHandler.bind(this.closeButton, that), false);
        this.partsContainer = this.domEL.querySelectorAll(partsToHideSelector)[0];
    
        let bottomPartsFix = Util.createNodeHTML("tmpl-bottom-parts", "fix", {});
        this.partsContainer.appendChild(bottomPartsFix);
        
        this.menuTotalHeight = this.domEL.offsetHeight;
        this.partsContainerHeight = this.partsContainer.offsetHeight;

        this.updateDimensions();
    }
    
    static addSeparators(container, separatorTemplateName){
        let objectParts = container.childNodes;
        console.log(objectParts);
        if (objectParts.length > 1) {
            objectParts.forEach((part, i) => {
                if (i > 0) {
                    let separator = Util.createNodeHTML(separatorTemplateName, "separator", {});
                    container.insertBefore(separator, part);
                }
            });
        }
    }

    updateVisibility() {
        if (this.menuVisible) {
            this.hideEditor();
            if (!this.closeButton.classList.contains("close")) {
                this.closeButton.classList += " close";
            }
            this.menuVisible = false;
        } else {
            this.showEditor();
            this.closeButton.classList.remove("close");
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

    updateDimensions() {
        // fixing parts container height to show or hide scrollbar
        if (window.innerHeight - 94 < this.menuTotalHeight) {
            this.partsContainer.style.height = ((window.innerHeight - 94) - (this.menuTotalHeight - this.partsContainerHeight)) + "px";
        } else {
            this.partsContainer.style.height = "";
        }
        // @todo resize menu on mobile
    }
}