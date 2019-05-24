
class TextureController {
    constructor(path) {
        this.path = path;
        this.textures = [];
    }

    loadColor(material, color) {
        for (let i = 0, n = this.textures.length; i < n; i++) {
            if (this.textures[i].material == material) {
                let map = loadTexture(this.path + material + "/" + material + color + "_Diffuse.jpg");
                this.textures[i].diffuseMaps.push({
                    color: color,
                    map: map
                });
                return map;
            }
        }
    }

    loadTexture(material, color) {
        this.textures.push({
            material: material,
            normalMap: loadTexture(this.path + material + "/" + material + "_Normal.jpg"),
            diffuseMaps: [{
                color: color,
                map: loadTexture(this.path + material + "/" + material + color + "_Diffuse.jpg")
            }],
            specularMap: loadTexture(this.path + material + "/" + material + "_Specular.jpg"),
            roughnessMap: loadTexture(this.path + material + "/" + material + "_Roughness.jpg"),
        });
        let tmp = this.textures[this.textures.length - 1];
        return {
            normalMap: tmp.normalMap,
            diffuseMap: tmp.diffuseMaps[0].map,
            specularMap: tmp.specularMap,
            roughnessMap: tmp.roughnessMap,
        }
    }

    getTexture(material, color) {
        let materialFound = false;
        let colorFound = false;

        for (let i = 0, n = this.textures.length; i < n; i++) {
            if (this.textures[i].material == material) {
                for (let j = 0, m = this.textures[i].diffuseMaps.length; j < m; j++) {
                    if (this.textures[i].diffuseMaps[j].color == color) {
                        colorFound = true;
                        return {
                            normalMap: this.textures[i].normalMap,
                            diffuseMap: this.textures[i].diffuseMaps[j].map,
                            specularMap: this.textures[i].specularMap,
                            roughnessMap: this.textures[i].roughnessMap,
                        }
                    }
                }
                if (!colorFound) {
                    return {
                        normalMap: this.textures[i].normalMap,
                        diffuseMap: this.loadColor(material, color),
                        specularMap: this.textures[i].specularMap,
                        roughnessMap: this.textures[i].roughnessMap,
                    }
                }
                materialFound = true;
            }
        }
        if (!materialFound) {
            return this.loadTexture(material, color);
        }
    }

    removeTexture(id) {

    }
}