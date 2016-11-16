module.exports = {
    "type": "object",
    "additionalProperties": false,
    "required": ["nombre", "torneo", "isCurrent"],
    "properties": {
        "nombre": {
            "type": "string"
        },
        "torneo": {
            "type": "string"
        },
        "isCurrent": {
            "type": "boolean"
        }
    }
}