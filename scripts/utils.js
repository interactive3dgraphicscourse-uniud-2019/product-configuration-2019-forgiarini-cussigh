class Util {
    /**
     * Returns a random number between min and max numbers included
     * @param {Integer} min Minimun number range
     * @param {Integer} max Maximum number range
     */
    static getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Maps linear values between input range between outout range. 
     * @param {Number} value Value to map
     * @param {Number} istart input range start
     * @param {Number} istop input range stop
     * @param {Number} ostart output range start
     * @param {Number} ostop output range stop
     */
    static mapValues(value, istart, istop, ostart, ostop) {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    }

    /**
     * Swap values of an array passed.
     * @param {Array} arr Array
     * @param {Number} a Index
     * @param {Number} b Index
     */
    static swapArrayValues(arr, a, b) {
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    /**
     * take a number in [0,255] range and returns his conversion in hexadecimal value
     * @param {Number} c 
     */
    static componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    /**
     * Converts an rgb color to the equivalent hex value
     * @param {Number} r red value of color
     * @param {Number} g green value of color
     * @param {Number} b blue value of color
     * @returns {String} String represinting the hex value of the color
     */
    static rgbToHex(r, g, b) {
        return "#" + Util.componentToHex(r) + Util.componentToHex(g) + Util.componentToHex(b);
    }

    /**
     * Return if (i,j) is a valid couple of index for a bidimensional array of size [mi-1][mj-1]
     */
    static inBound2(i, j, mi, mj) {
        return ((i >= 0) && (i <= mi) && (j >= 0) && (j <= mj));
    }

    /**
     * Converts an angle in degrees in the corrisponding angle in radians
     * 
     * @param {Number} deg angle expressed in degrees
     * @returns {Number} Angle expressend in radians
     */
    static degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    /**
     * Converts an angle in radians in the corrisponding angle in degrees
     * 
     * @param {Number} rad angle expressed in degrees
     * @returns {Number} Angle expressend in radians
     */
    static radToDeg(rad) {
        return rad * (180 / Math.PI);
    }

    /**
     * Checks if a vector is null vector by calculating his distance to the vector (2^-52, 2^-52, 2^-52).
     * If distance is less returns true, otherwise false.
     * 
     * @param {Object} vector 3d vector to check
     * @returns {Boolean} true if vector is a null vector, false otheriwise
     */
    static isNullVector(vector) {
        return (Math.abs(vector.x) < Number.EPSILON)
            && (Math.abs(vector.y) < Number.EPSILON)
            && (Math.abs(vector.z) < Number.EPSILON);
    }

    /**
     * Checks if an object is going to a target position (in a line) by calculating angle between his direction and direction from his position and target position.
     * If angle is less then MAX_DIFFERENCE_ANGLE costant returns true, otherwise false.
     * If object is over target returns false.
     * 
     * @param {Object} currPosition 3d Vector of current position
     * @param {Object} direction 3d Vector of object direction
     * @param {Object} destPosition 3d Vector of target position
     * @returns {Boolean} true if is going to hit, false otherwise
     */
    static isOBJMovingTo(currPosition, direction, destPosition) {
        let calculatedDirection = new THREE.Vector3(
            destPosition.x - currPosition.x,
            destPosition.y - currPosition.y,
            destPosition.z - currPosition.z
        );

        if (Util.isNullVector(calculatedDirection)) {
            return false;
        }

        return (Math.abs(direction.angleTo(calculatedDirection)) < MAX_DIFFERENCE_ANGLE);
    }

    static loadTexture(file) {
        var texture = new THREE.TextureLoader().load(file, texture => {
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set(0, 0);
            texture.needsUpdate = true;
            renderWorld();
        })
        return texture;
    }

    static isMobile() {
        return window.innerWidth <= MOBILE_WIDTH;
    }
}