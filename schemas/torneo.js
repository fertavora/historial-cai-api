module.exports = {
    "type": "object",
    "additionalProperties": false,
    "required": ["nombre", "tipo"],
    "properties": {
        "nombre": {
            "type": "string"
        },
        "tipo": {
            "type": "string"
        }
    }
}