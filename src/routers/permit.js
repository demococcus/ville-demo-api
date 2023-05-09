const express = require('express')
const Permit = require('../models/permit')
const geom_tools = require("../geom-tools")
const router = new express.Router()

router.post('/permits', async (req, res) => {

    const permit  = new Permit({
        ...req.body,
    })
    
    // purge everything except the last 5 documents in the collection
    const lastFiveRecords = await Permit.find().sort({_id: -1}).limit(5);
    const deletedRecords = await Permit.deleteMany({_id: {$nin: lastFiveRecords.map(doc => doc._id)}});
    console.log(`Deleted ${deletedRecords.deletedCount} records`);


    // auto-calculated values
    if (permit.status == 2) {permit.date = Date.now()}
    if (permit.geom) {
        permit.insideElements = geom_tools.countVertices(permit.geom)
        permit.centroid = geom_tools.centroid(permit.geom)
    }


    try {
        await permit.save()
        res.status(201).send(permit)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/permits', async (req, res) => {

    try {
        const permits = await Permit.find()   
        res.send(permits)
    } catch(e) {
        res.status(500).send()
    }
})


router.get('/permits/:id', async (req, res) => {
    try {
        const permit = await Permit.findOne({ _id: req.params.id})

        if (!permit) {
            res.status(404).send()
            return
        } 
        res.send(permit)
    } catch(e) {
        res.status(500).send()
    }
    
})


router.delete('/permits/:id', async (req, res) => {

    try {
        const permit = await Permit.findOneAndDelete({_id: req.params.id})
        if (!permit) {
            res.status(404).send()
            return
        } 
        res.status(202).send(permit)
    } catch (e) {
        res.status(500).send()
    }

})

router.patch('/permits/:id', async (req, res) => {
    
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        'status', 'geom', 'mapZoom', 
        'companyName', 'isPrivateCompany', 'certificateNumber',
        'firstName', 'lastName', 'phone', 'phoneExt', 'email',
        'periodStart', 'periodEnd',
        'acceptA', 'acceptB', 'acceptC'
    ]


    const isValidProperties = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidProperties) {
        res.status(400).send({'error': 'Invalid property detected!'})
        return
    }

    try {      
    
        const permit = await Permit.findOne({_id: req.params.id})       

        updates.forEach((update) => {
            permit[update] = req.body[update]
        })

        // auto-calculated values
        permit.dateModified =  Date.now()
        if (permit.status == 2) {permit.dateSubmitted = Date.now()}

        if (permit.geom) {
            permit.insideElements = geom_tools.countVertices(permit.geom)
            permit.centroid = geom_tools.centroid(permit.geom)
        }

                
        if (!permit) {
            res.status(404).send()
            return
        } 


        await permit.save()  

        res.send(permit)
    } catch (e) {
        res.status(500).send()
    }

})


module.exports = router