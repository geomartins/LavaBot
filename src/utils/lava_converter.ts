const convertToSquidexJson = (obj: object) => {
    let result = {}
    for (const property in obj) {
        result[property] = {
            'iv': obj[property]
        }
    }
    return result;
}

export {
    convertToSquidexJson
}