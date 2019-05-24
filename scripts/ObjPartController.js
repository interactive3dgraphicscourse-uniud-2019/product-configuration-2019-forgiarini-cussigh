class ObjPartController {
    constructor(data) {
        this.textureParameters = {
            material: null,
            color: null,
            repeatS: 1.0,
            repeatT: 1.0,
            normalScale: 0.0,
        };

        this.maps = {
            normalMap: null,
            diffuseMap: null,
            specularMap: null,
            roughnessMap: null,
        }

        this.textureController = data.textureController;

        this.updateTexture(data.textureData.id, data.textureData.color);

        this.lights = data.lights;

        this.uniforms = {
            specularMap: { type: "t", value: this.maps.specularMap },
            diffuseMap: { type: "t", value: this.maps.diffuseMap },
            roughnessMap: { type: "t", value: this.maps.roughnessMap },
            pointLightPosition1: { type: "v3", value: this.lights[0].position },
            pointLightPosition2: { type: "v3", value: this.lights[1].position },
            normalMap: { type: "t", value: this.maps.normalMap },
            normalScale: { type: "v2", value: new THREE.Vector2(1, 1) },
            clight1: { type: "v3", value: new THREE.Vector3() },
            clight2: { type: "v3", value: new THREE.Vector3() },
            textureRepeat: { type: "v2", value: new THREE.Vector2(1, 1) }
        }

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: data.vertexShader,
            fragmentShader: data.fragmentShader
        });

        this.material.vertexTangents = true;
        this.material.needsUpdate = true;
        let loader = new THREE.OBJLoader2();
        loader.useIndices = true;
        let that = this;
        loader.load("models/" + data.modelName + ".obj", function (obj) {
            let geometry = obj.detail.loaderRootNode.children[0].geometry;
            let mesh = new THREE.Mesh(geometry, that.material);
            mesh.scale.multiplyScalar(0.05);
            THREE.BufferGeometryUtils.computeTangents(geometry);
            scene.add(mesh);
        });

        this.name = data.partID;
        this.description = data.partDescription;
    }

    updateTexture(name, color) {
        if (this.textureParameters.material == name) {
            return;
        }

        this.textureParameters.material = name;
        this.textureParameters.color = color;

        let texture = this.textureController.getTexture(this.textureParameters.material, this.textureParameters.color);

        this.maps.normalMap = texture.normalMap;
        this.maps.diffuseMap = texture.diffuseMap;
        this.maps.specularMap = texture.specularMap;
        this.maps.roughnessMap = texture.roughnessMap;
    }

    updateTextureColor(color) {
        if (this.textureParameters.color == color) {
            return;
        }
        this.textureParameters.color = color;
        let texture = this.textureController.getTexture(this.textureParameters.material, this.textureParameters.color);

        this.maps.diffuseMap = texture.diffuseMap;
        this.material.needsUpdate = true;
    }

    updateTextureRoughness(val) {
        this.textureParameters.normalScale = val;
    }

    updateUniforms() {
        this.uniforms.clight1.value = new THREE.Vector3(
            this.lights[0].red * this.lights[0].intensity,
            this.lights[0].green * this.lights[0].intensity,
            this.lights[0].blue * this.lights[0].intensity);

        this.uniforms.clight2.value = new THREE.Vector3(
            this.lights[1].red * this.lights[1].intensity,
            this.lights[1].green * this.lights[1].intensity,
            this.lights[1].blue * this.lights[1].intensity);

        this.uniforms.textureRepeat.value = new THREE.Vector2(this.textureParameters.repeatS, this.textureParameters.repeatT);
        this.uniforms.diffuseMap.value = this.maps.diffuseMap;
        this.uniforms.specularMap.value = this.maps.specularMap;
        this.uniforms.roughnessMap.value = this.maps.roughnessMap;
        this.uniforms.normalMap.value = this.maps.normalMap;
        this.uniforms.normalScale.value = new THREE.Vector2(this.textureParameters.normalScale, this.textureParameters.normalScale);
    }
}