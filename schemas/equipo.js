module.exports = {
    "type": "object",
    "additionalProperties": false,
    "required": ["nombre", "pais"],
    "properties": {
        "nombre": {
            "type": "string"
        },
        "ciudad": {
            "type": "string"
        },
        "provincia": {
            "type": "string"
        },
        "pais": {
            "type": "string"
        },
        "escudo": {
            "type": "string"
        }
    }
}