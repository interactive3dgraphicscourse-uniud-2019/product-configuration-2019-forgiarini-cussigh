class DomUtils {
    /**
     * Create Stats for canvas and returns a reference to an istance of that plugin.
     * Requires stats.js
     */
    static createStats() {
        if(typeof Stats === "undefined"){
            return;
        }
        let stats = new Stats();
        stats.domElement.style.position = "absolute";
        stats.domElement.style.top = "0px";
        document.body.appendChild(stats.domElement);
        return stats;
    }

    static xmlToString(xmlData) {
        let xmlString;
        //IE
        if (window.ActiveXObject) {
            xmlString = xmlData.xml;
        }
        // code for Mozilla, Firefox, Opera, etc.
        else {
            xmlString = (new XMLSerializer()).serializeToString(xmlData);
        }
        return xmlString;
    }

    static createNodeHTML(templateName, argName, data) {
        tmpl.arg = argName;
        let insertingHTML = htmlParser.parseFromString(tmpl(templateName, data), "text/html");
        let partContainer = insertingHTML.documentElement.children[1].firstChild;
        return partContainer;
    }

    static is(el, selector) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    }

    static buildPresetObj(container, modelData) {
        let dataToEncode = modelData.data

        let tmpl_obj = {
            data: JSON.stringify(dataToEncode),
            preview_url: modelData.preview,
            alt: modelData.alt,
        };
        let preset = DomUtils.createNodeHTML("tmpl-preset", "preset", tmpl_obj);
        container.appendChild(preset);
    }

    static buildMenuOptions(container, data) {
        let controller = data.controller;
        tmpl.arg = "part";
        let tmpl_obj = {
            name_id: data.partID,
            name: data.partName,
        };

        let partEditor = DomUtils.createNodeHTML("tmpl-insert-part-wrapper", "part", tmpl_obj);
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

                let optionEL = DomUtils.createNodeHTML("tmpl-option-texture-type", "texture", tmpl_obj);
                selectTextureType.appendChild(optionEL);

                let typeWrapper = DomUtils.createNodeHTML("tmpl-insert-texture-type-wrapper", "texture", tmpl_obj);

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

                    let textureEl = DomUtils.createNodeHTML("tmpl-insert-texture-icon-wrapper", "texture_info", tmpl_obj);
                    if (iconUrl !== "") {
                        let tmpl_obj = {
                            url: iconUrl,
                            alt: alt
                        };
                        let iconEl = DomUtils.createNodeHTML("tmpl-insert-texture-icon-img", "texture_info", tmpl_obj);
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

    static addSeparators(container, separatorTemplateName){
        let objectParts = container.childNodes;
        let partsPointers = [];
        objectParts.forEach(part => {
            partsPointers.push(part);
        });
        if (partsPointers.length > 1) {
            partsPointers.forEach((part, i) => {
                if (i > 0) {
                    let separator = DomUtils.createNodeHTML(separatorTemplateName, "separator", {});
                    container.insertBefore(separator, part);
                }
            });
        }
    }
}