const DateCorrection = (rows) => {
    const vehiculo = rows.map(row => {
        return {
            placa: row.placa,
            modelo: row.modelo,
            fv_seguro: row.fv_seguro.toISOString().slice(0, 10),
            fv_tecnicomecanica: row.fv_tecnicomecanica.toISOString().slice(0, 10),
            id_linea: row.id_linea,
            url_image: row.url_image
        }
    })
    return vehiculo
}

module.exports = { DateCorrection }