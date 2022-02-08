const convertToSquidexJson = (obj: object) => {
    let result = {}
    for (const property in obj) {
        result[property] = {
            'iv': obj[property]
        }
    }

    console.log('8888888888888888888888888 '+JSON.stringify(result))
    return result;
}

export {
    convertToSquidexJson
}