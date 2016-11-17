module.exports = {
    "type": "object",
    "additionalProperties": false,
    "required": ["nombre", "apellido"],
    "properties": {
        "nombre": {
            "type": "string"
        },
        "apellido": {
            "type": "string"
        },
        "pais": {
            "type": "string"
        },
        "fechaNacimiento": {
            "type": "string",
            "format": "date"
        },
        "isRetired": {
            "type": "boolean"
        }
    }
}