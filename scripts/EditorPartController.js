
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

let iconSelectHandler = function (controller, e) {
    let textureID = this.getAttribute("data-icon-id");
    if (controller.currentTextureSelected == textureID) {
        return;
    }
    controller.clearTextureColorSelection();
    controller.selectTexture(textureID, true);
}

let closeAllSelect = elmnt => {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    let x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

let fakeOptionHandler = function (selectEl, e) {
    /*when an item is clicked, update the original select box,
    and the selected item:*/
    let y, i, k, s, h;

    s = this.parentNode.parentNode.getElementsByTagName("select")[0];
    h = this.parentNode.previousSibling;
    for (i = 0; i < s.length; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
                y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
        }
    }
    // Triggering change event
    let event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, false);
    selectEl.dispatchEvent(event);
}

let fakeSelectClickHandler = function (e) {
    /*when the select box is clicked, close any other select boxes,
    and open/close the current select box:*/
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
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

        this.rangeInput.forEach(range => {
            range.addEventListener("input", sliderHandler.bind(range, that), false);
        });

        if (this.objController.textureParameters.material == null) {
            this.showTextureTypes("wood", true);
        } else {
            let index = -1;
            let materialActive = this.objController.textureParameters.material;
            for (let i = 0, n = this.selectTextureMenu.children.length; i < n; i++) {
                if (this.selectTextureMenu.children[i].value == materialActive) {
                    index = i;
                    break;
                }
            }
            this.selectTextureMenu.selectedIndex = index;
            this.showTextureTypes(materialActive, false);
            this.clearTextureColorSelection();
            this.selectTexture(this.objController.textureParameters.color, false);

            this.setSliderValue(
                materialActive, this.objController.textureParameters.normalScale);
        }

        this.selectTextureMenu.addEventListener("change", textureTypeSelectHandler.bind(this.selectTextureMenu, that), false);
        this.createFakeSelectMenu();
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

    updateMenu(data){
        this.fakeMaterials.forEach(item => {
            if(item.matID == data.material){
                // Triggering change event
                let event = document.createEvent('HTMLEvents');
                event.initEvent('click', true, false);
                item.domEl.dispatchEvent(event);
                return;
            }
        });
        
        //select color
        this.clearTextureColorSelection();
        this.selectTexture(data.color, true);

        //update roughness
        this.setSliderValue(data.material, data.roughness);
        this.updateControllerRoughness(data.roughness);
    }

    createFakeSelectMenu() {
        let selectWrapper = this.selectTextureMenu.parentNode;
        this.fakeMaterials = [];
        /*create a new DIV that will act as the selected item*/
        let fakeSelected = document.createElement("DIV");
        fakeSelected.setAttribute("class", "select-selected");
        fakeSelected.innerHTML = this.selectTextureMenu.options[this.selectTextureMenu.selectedIndex].innerHTML;
        selectWrapper.appendChild(fakeSelected);

        /*for each element, create a new DIV that will contain the option list:*/
        let fakeOptionsContainer = document.createElement("DIV");
        fakeOptionsContainer.setAttribute("class", "select-items select-hide");
        for (let i = 0, n = this.selectTextureMenu.length; i < n; i++) {
            /*for each option in the original select element,
            create a new DIV that will act as an option item:*/
            let fakeOption = document.createElement("DIV");
            fakeOption.innerHTML = this.selectTextureMenu.options[i].innerHTML;
            fakeOption.addEventListener("click", fakeOptionHandler.bind(fakeOption, this.selectTextureMenu), false);
            fakeOptionsContainer.appendChild(fakeOption);
            this.fakeMaterials.push({ matID: this.selectTextureMenu.options[i].value, domEl: fakeOption });
        }

        selectWrapper.appendChild(fakeOptionsContainer);
        fakeSelected.addEventListener("click", fakeSelectClickHandler.bind(fakeSelected), false);
        /*if the user clicks anywhere outside the select box,
        then close all select boxes:*/
        document.addEventListener("click", closeAllSelect);
    }
}
