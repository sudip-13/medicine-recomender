const doctor = require('../database/model/doctor.model')
const { diseases } = require('../utils/const');
const getDoctor = async (req, res) => {
    let { disease } = req.body;
    disease = disease.toLowerCase().split(' ').join('_');
    if (!(disease in diseases)) {
        return res.status(404).json({
            status: false,
            message: 'Currently we don\'t have any doctor for this desease'
        })
    }

    const specialization = diseases[disease] || diseases.disease;
    try {
        const doc = await doctor.findOne({
            specialization
        })
        if(!doc) {
            return res.status(404).json({
                status: false,
                message: 'Currently we don\'t have any doctor for this desease'
            })
        }
        return res.status(200).json({
            status: true,
            data: doc
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getDoctor
}