class ObjPartController {
    constructor(data) {

        this.materials = data.materialsAvaiable;

        this.textureParameters = {
            material: null,
            color: null,
            repeatS: 1.0,
            repeatT: 1.0,
            normalScale: data.textureData.normalScale,
        };

        this.lights = data.lights;

        this.uniforms = {
            // texture
            specularMap: { type: "t", value: undefined },
            diffuseMap: { type: "t", value: undefined },
            roughnessMap: { type: "t", value: undefined },
            normalMap: { type: "t", value: undefined },
            normalScale: {
                type: "v2",
                value: new THREE.Vector2(
                    this.textureParameters.normalScale,
                    this.textureParameters.normalScale)
            },
            textureRepeat: {
                type: "v2",
                value: new THREE.Vector2(
                    this.textureParameters.repeatS,
                    this.textureParameters.repeatT)
            },

            //scene lights
            pointLightPosition1: { type: "v3", value: this.lights[0].position },
            pointLightPosition2: { type: "v3", value: this.lights[1].position },
            pointLightPosition3: { type: "v3", value: this.lights[2].position },
            clight1: {
                type: "v3",
                value: new THREE.Vector3(
                    this.lights[0].red * this.lights[0].intensity,
                    this.lights[0].green * this.lights[0].intensity,
                    this.lights[0].blue * this.lights[0].intensity)
            },
            clight2: {
                type: "v3",
                value: new THREE.Vector3(
                    this.lights[1].red * this.lights[1].intensity,
                    this.lights[1].green * this.lights[1].intensity,
                    this.lights[1].blue * this.lights[1].intensity)
            },
            clight3: {
                type: "v3",
                value: new THREE.Vector3(
                    this.lights[2].red * this.lights[2].intensity,
                    this.lights[2].green * this.lights[2].intensity,
                    this.lights[2].blue * this.lights[2].intensity)
            },

            ambientLight: { type: "v3", value: ambientLight }
        }

        this.textureController = data.textureController;

        this.updateTexture(data.textureData.id, data.textureData.color);

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: data.vertexShader,
            fragmentShader: data.fragmentShader
        });

        this.material.vertexTangents = true;
        this.material.needsUpdate = true;

        //Loading object model
        let loader = new THREE.OBJLoader2();
        loader.useIndices = true;
        let that = this;
        loader.load(MODELS_PATH + data.modelName + ".obj", function (obj) {
            let geometry = obj.detail.loaderRootNode.children[0].geometry;
            let mesh = new THREE.Mesh(geometry, that.material);
            mesh.scale.multiplyScalar(0.05);
            THREE.BufferGeometryUtils.computeTangents(geometry);
            scene.add(mesh);
        });

        this.partHandledID = data.partID;
        this.description = data.partDescription;
    }

    updateTexture(name, color) {
        if (this.textureParameters.material == name) {
            return;
        }

        this.textureParameters.material = name;
        this.textureParameters.color = color;

        let texture = this.textureController.getTexture(this.textureParameters.material, this.textureParameters.color);

        this.uniforms.diffuseMap.value = texture.diffuseMap;
        this.uniforms.specularMap.value = texture.specularMap;
        this.uniforms.roughnessMap.value = texture.roughnessMap;
        this.uniforms.normalMap.value = texture.normalMap;
    }

    updateTextureColor(color) {
        if (this.textureParameters.color == color) {
            return;
        }
        this.textureParameters.color = color;
        let texture = this.textureController.getTexture(this.textureParameters.material, this.textureParameters.color);

        this.uniforms.diffuseMap.value = texture.diffuseMap;
        this.material.needsUpdate = true;
    }

    updateTextureRoughness(val) {
        this.textureParameters.normalScale = val;
        this.uniforms.normalScale.value = new THREE.Vector2(
            this.textureParameters.normalScale,
            this.textureParameters.normalScale
        );
    }

    updateLightPositions() {

    }
}