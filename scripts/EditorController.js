

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
    
        let bottomPartsFix = DomUtils.createNodeHTML("tmpl-bottom-parts", "fix", {});
        this.partsContainer.appendChild(bottomPartsFix);
        
        this.menuTotalHeight = this.domEL.offsetHeight;
        this.partsContainerHeight = this.partsContainer.offsetHeight;

        this.updateDimensions();
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