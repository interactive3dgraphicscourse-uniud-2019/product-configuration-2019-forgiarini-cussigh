class MobileController {
    constructor() {
        this.partsToHide = [];
        
        let nav = document.getElementById("siteNavigator");
        this.partsToHide.push(nav);
        
        let presets = document.getElementById("presetsContainer");
        this.partsToHide.push(presets);
        
        this.partsHidden = false;
        this.updateVisibility();
    }

    updateVisibility() {
        if (Util.isMobile()) {
            if (!this.partsHidden) {
                this.hideParts();
                this.partsHidden = true;
            }
        } else {
            if (this.partsHidden) {
                this.showParts();
                this.partsHidden = false;
            }
        }
    }

    hideParts() {
        this.partsToHide.forEach(part => {
            if (!part.classList.contains("mobile-hide")) {
                part.classList += " mobile-hide";
            }
        });
    }

    showParts() {
        this.partsToHide.forEach(part => {
            part.classList.remove("mobile-hide");
        });
    }
}