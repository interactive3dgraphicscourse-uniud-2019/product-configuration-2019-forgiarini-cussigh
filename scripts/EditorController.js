
function buildMenuOptions(container, data) {
    tmpl.arg = "part";
    let tmpl_obj = {
        name_id: data.partID,
        name: data.partName,
    };

    let partEditor = createNodeHTML("tmpl-insert-part-wrapper", "part", tmpl_obj);
    let selectTextureType = partEditor.querySelectorAll(".select-texture-material")[0];
    let textureTypes = partEditor.querySelectorAll(".available-colors")[0];

    data.textures.forEach(item => {
        let tmpl_obj = {
            type_name: item.typeID,
            type: item.typeSelect,
            minValSlider: item.roughness.min,
            maxValSlider: item.roughness.max,
            startValSlider: item.roughness.start,
            stepSlider: item.roughness.step
        }

        let optionEL = createNodeHTML("tmpl-option-texture-type", "texture", tmpl_obj);
        selectTextureType.appendChild(optionEL);

        let typeWrapper = createNodeHTML("tmpl-insert-texture-type-wrapper", "texture", tmpl_obj);

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

            let textureEl = createNodeHTML("tmpl-insert-texture-icon-wrapper", "texture_info", tmpl_obj);
            if (iconUrl !== "") {
                let tmpl_obj = {
                    url: iconUrl,
                    alt: alt
                };
                let iconEl = createNodeHTML("tmpl-insert-texture-icon-img", "texture_info", tmpl_obj);
                let iconWrapper = textureEl.querySelectorAll(".texture-icon-container")[0];
                iconWrapper.appendChild(iconEl);
            }
            textureIconsWrapper.appendChild(textureEl);
        });

        textureTypes.appendChild(typeWrapper);
    });
    container.appendChild(partEditor);
    return partEditor;
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
        this.objectParts = this.partsContainer.querySelectorAll(".part");
        if(this.objectParts.length > 1){
            this.objectParts.forEach((part, i) =>{
                if(i>0){
                    let separator = createNodeHTML("tmpl-part-separator", "separator", {});
                    that.partsContainer.insertBefore(separator, part);
                }
            });
        }

        let bottomPartsFix = createNodeHTML("tmpl-bottom-parts", "fix", {});
        this.partsContainer.appendChild(bottomPartsFix); 
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
}